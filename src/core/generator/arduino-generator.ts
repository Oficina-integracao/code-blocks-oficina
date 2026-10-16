import * as Blockly from "blockly";
import { Order } from "./order";
import type { ArduinoCodeResult, ArduinoGeneratorContract } from "../domain/entities/generator";
import { GeneratorError } from "../domain/errors/domain-errors";
import { registerVariableBlocks } from "./blocks/variables";
import { registerOperatorBlocks } from "./blocks/operators";
import { registerConditionalBlocks } from "./blocks/conditionals";
import { registerLoopBlocks } from "./blocks/loops";

const CPP_RESERVED_WORDS = [
  "alignas,alignof,and,and_eq,asm,auto,bitand,bitor,char8_t,char16_t,char32_t,class,compl",
  "concept,const,consteval,constexpr,constinit,const_cast,co_await,co_return,co_yield,decltype",
  "default,delete,dynamic_cast,enum,explicit,export,extern,friend,inline,mutable,namespace,new",
  "noexcept,not,not_eq,nullptr,operator,or,or_eq,private,protected,public,register,reinterpret_cast",
  "requires,signed,sizeof,static,static_assert,static_cast,struct,template,this,thread_local,throw",
  "try,typedef,typeid,typename,union,unsigned,using,virtual,volatile,wchar_t,xor,xor_eq",
].join(",");

/** Coordinates the existing block generators into a deterministic Arduino sketch. */
export class ArduinoGenerator extends Blockly.Generator implements ArduinoGeneratorContract {
  public Order = Order;
  public definitions_: Record<string, string> = {};
  public setupCode_: string[] = [];
  private generating = false;
  private errors: string[] = [];
  private identifiers = new Map<string, string>();

  constructor(name = "Arduino") {
    super(name);
    this.addReservedWords(
      "setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto," +
        "define,include,HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false,null," +
        "int,float,double,char,byte,bool,boolean,void,long,short,String," +
        CPP_RESERVED_WORDS,
    );
    this.nameDB_ = new Blockly.Names(this.RESERVED_WORDS_);
    registerVariableBlocks(this);
    registerOperatorBlocks(this);
    registerConditionalBlocks(this);
    registerLoopBlocks(this);
  }

  public cleanIdentifier(name: string): string {
    const original = name.trim();
    const existing = this.identifiers.get(original);
    if (existing) return existing;
    let identifier = name.trim().replace(/[^a-zA-Z0-9_]/g, "_") || "unnamed_var";
    if (/^[0-9]/.test(identifier)) identifier = `var_${identifier}`;
    const unique = this.nameDB_!.getDistinctName(
      identifier,
      Blockly.Names.NameType.DEVELOPER_VARIABLE,
    );
    this.identifiers.set(original, unique);
    return unique;
  }

  public override init(workspace: Blockly.Workspace): void {
    super.init(workspace);
    this.setupCode_ = [];
    this.errors = [];
    this.nameDB_!.reset();
    this.identifiers.clear();
    this.isInitialized = true;
    this.generating = true;
  }

  public override blockToCode(
    block: Blockly.Block | null,
    thisOnly?: boolean,
  ): string | [string, number] {
    if (this.generating && block?.isEnabled() && !block.isInsertionMarker()) {
      const error = this.invalidBlockReason(block);
      if (error) {
        this.errors.push(new GeneratorError(error, block.id).message);
        return thisOnly ? "" : this.blockToCode(block.getNextBlock());
      }
    }
    return super.blockToCode(block, thisOnly);
  }

  private invalidBlockReason(block: Blockly.Block): string | undefined {
    if (!this.forBlock[block.type]) return `Unsupported block type: ${block.type}`;
    if (block.type !== "controls_flow_statements") return;
    let parent = block.getSurroundParent();
    while (parent) {
      if (["controls_repeat_ext", "controls_whileUntil", "controls_for"].includes(parent.type))
        return;
      parent = parent.getSurroundParent();
    }
    return "break/continue requires an enclosing loop";
  }

  public override scrub_(block: Blockly.Block, code: string, thisOnly?: boolean): string {
    if (this.generating) code = this.collectVariable(block, code);
    const next = block.getNextBlock();
    return code + (next && !thisOnly ? this.blockToCode(next) : "");
  }

  private collectVariable(block: Blockly.Block, code: string): string {
    if (!/^variables_(declare|set|get|change)$/.test(block.type)) return code;
    const name = this.cleanIdentifier(block.getField("VAR")!.getText() || "variavel");
    const key = `variable_${name}`;
    if (block.type === "variables_declare") {
      if (block.getSurroundParent()) return code;
      this.definitions_[key] = code.trimEnd();
      return "";
    }
    this.definitions_[key] ??= `int ${name} = 0;`;
    return code;
  }

  private generateStatements(workspace: Blockly.Workspace): string[] {
    const statements: string[] = [];
    for (const block of workspace.getTopBlocks(true)) {
      if (block.outputConnection) continue;
      const code = this.blockToCode(block);
      if (typeof code === "string" && code.trim()) statements.push(code);
    }
    return statements;
  }

  private renderSection(name: string, lines: string[], placeholder: string): string {
    const body = lines
      .map((line) => line.trimEnd())
      .filter(Boolean)
      .join("\n");
    return `void ${name}() {\n${this.prefixLines(body || placeholder, this.INDENT)}\n}`;
  }

  public override finish(code: string): string {
    const definitions = Object.values(this.definitions_).join("\n");
    const sections = definitions
      ? [`// --- Definições e Variáveis Globais ---\n${definitions}`]
      : [];
    sections.push(this.renderSection("setup", this.setupCode_, "// Inicializações"));
    sections.push(this.renderSection("loop", [code], "// Lógica Principal"));
    this.generating = false;
    this.isInitialized = null;
    return sections.join("\n\n") + "\n";
  }

  public generateCode(workspace: Blockly.Workspace): ArduinoCodeResult {
    this.init(workspace);
    try {
      const loopCode = this.generateStatements(workspace);
      const code = this.finish(loopCode.join(""));
      return {
        code,
        definitions: Object.values(this.definitions_),
        setupCode: [...this.setupCode_],
        loopCode,
        isValid: this.errors.length === 0,
        ...(this.errors.length ? { errors: [...this.errors] } : {}),
      };
    } finally {
      this.generating = false;
      this.isInitialized = null;
    }
  }

  public override workspaceToCode(workspace = Blockly.getMainWorkspace()): string {
    return this.generateCode(workspace).code;
  }
}

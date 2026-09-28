import * as Blockly from 'blockly';
import { Order } from './order';
import { ArduinoCodeResult, ArduinoGeneratorContract } from '../domain/entities/generator';

/**
 * Pure domain Arduino C/C++ Code Generator.
 * Extends Blockly.Generator to provide deterministic C/C++ translation.
 */
export class ArduinoGenerator extends Blockly.Generator implements ArduinoGeneratorContract {
  public Order = Order;
  public definitions_: Record<string, string> = {};
  public setupCode_: string[] = [];

  constructor(name = 'Arduino') {
    super(name);
    this.addReservedWords(
      'setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto,' +
      'define,include,HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false,null,' +
      'int,float,double,char,byte,bool,boolean,void,long,short,String'
    );
  }

  /**
   * Sanitizes variable/function identifiers to valid C/C++ identifier names.
   */
  public cleanIdentifier(name: string): string {
    const sanitized = name.trim().replace(/[^a-zA-Z0-9_]/g, '_');
    if (/^[0-9]/.test(sanitized)) {
      return `var_${sanitized}`;
    }
    return sanitized || 'unnamed_var';
  }

  /**
   * Custom scrub_ implementation ensuring deterministic concatenation of connected statements.
   */
  public scrub_(block: Blockly.Block, code: string, optThisOnly?: boolean): string {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    if (nextBlock && !optThisOnly) {
      return code + this.blockToCode(nextBlock);
    }
    return code;
  }

  /**
   * Generates Arduino C/C++ source code from a workspace.
   */
  public generateCode(workspace: Blockly.Workspace): ArduinoCodeResult {
    this.definitions_ = {};
    this.setupCode_ = [];

    const topBlocks = workspace.getTopBlocks(true);
    const loopLines: string[] = [];

    for (const block of topBlocks) {
      if (!block.isEnabled()) continue;
      const blockCode = this.blockToCode(block);
      if (typeof blockCode === 'string' && blockCode.trim().length > 0) {
        loopLines.push(blockCode);
      }
    }

    const definitions = Object.values(this.definitions_);
    const setupCode = [...this.setupCode_];
    const loopCode = loopLines;

    const sections: string[] = [];
    if (definitions.length > 0) {
      sections.push('// --- Definições e Variáveis Globais ---\n' + definitions.join('\n'));
    }

    sections.push('void setup() {\n' + (setupCode.length > 0 ? this.prefixLines(setupCode.join('\n'), '  ') : '  // Inicializações\n') + '}');
    sections.push('void loop() {\n' + (loopCode.length > 0 ? this.prefixLines(loopCode.join(''), '  ') : '  // Lógica Principal\n') + '}');

    const code = sections.join('\n\n') + '\n';

    return {
      code,
      definitions,
      setupCode,
      loopCode,
      isValid: true,
    };
  }
}

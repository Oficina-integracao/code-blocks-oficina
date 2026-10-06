import { describe, it, expect, beforeEach } from 'vitest';
import * as Blockly from 'blockly';
import { ArduinoGenerator } from '@/core/generator/arduino-generator';
import { registerVariableBlocks } from '@/core/generator/blocks/variables';
import { registerConditionalBlocks } from '@/core/generator/blocks/conditionals';
import { registerOperatorBlocks } from '@/core/generator/blocks/operators';

function connectValue(block: Blockly.Block, inputName: string, targetBlock: Blockly.Block): void {
  const inputConn = block.getInput(inputName)?.connection;
  const targetConn = targetBlock.outputConnection;
  if (inputConn && targetConn) {
    inputConn.connect(targetConn);
  }
}

function connectStatement(block: Blockly.Block, inputName: string, targetBlock: Blockly.Block): void {
  const inputConn = block.getInput(inputName)?.connection;
  const targetConn = targetBlock.previousConnection;
  if (inputConn && targetConn) {
    inputConn.connect(targetConn);
  }
}

function createNumberBlock(workspace: Blockly.Workspace, value: number | string): Blockly.Block {
  const numBlock = workspace.newBlock('math_number');
  numBlock.setFieldValue(String(value), 'NUM');
  return numBlock;
}

function createBooleanBlock(workspace: Blockly.Workspace, value: boolean): Blockly.Block {
  const boolBlock = workspace.newBlock('logic_boolean');
  boolBlock.setFieldValue(value ? 'TRUE' : 'FALSE', 'BOOL');
  return boolBlock;
}

function createVariableGetBlock(workspace: Blockly.Workspace, varName: string): Blockly.Block {
  const variable = workspace.createVariable(varName);
  const getBlock = workspace.newBlock('variables_get');
  getBlock.setFieldValue(variable.getId(), 'VAR');
  return getBlock;
}

describe('Operator Blocks Code Generation (T012)', () => {
  let workspace: Blockly.Workspace;
  let generator: ArduinoGenerator;

  beforeEach(() => {
    workspace = new Blockly.Workspace();
    generator = new ArduinoGenerator();
    registerVariableBlocks(generator);
    registerConditionalBlocks(generator);
    registerOperatorBlocks(generator);
  });

  describe('Arithmetic Operators (math_arithmetic)', () => {
    it('generates addition code (+) for two numeric operands', () => {
      const block = workspace.newBlock('math_arithmetic');
      block.setFieldValue('ADD', 'OP');
      connectValue(block, 'A', createNumberBlock(workspace, 10));
      connectValue(block, 'B', createNumberBlock(workspace, 5));

      const [code] = generator.blockToCode(block) as [string, number];
      expect(code).toBe('10 + 5');
    });

    it('generates subtraction code (-) for variables and numbers', () => {
      const block = workspace.newBlock('math_arithmetic');
      block.setFieldValue('MINUS', 'OP');
      connectValue(block, 'A', createVariableGetBlock(workspace, 'total'));
      connectValue(block, 'B', createNumberBlock(workspace, 3));

      const [code] = generator.blockToCode(block) as [string, number];
      expect(code).toBe('total - 3');
    });

    it('generates multiplication code (*) for two operands', () => {
      const block = workspace.newBlock('math_arithmetic');
      block.setFieldValue('MULTIPLY', 'OP');
      connectValue(block, 'A', createVariableGetBlock(workspace, 'largura'));
      connectValue(block, 'B', createVariableGetBlock(workspace, 'altura'));

      const [code] = generator.blockToCode(block) as [string, number];
      expect(code).toBe('largura * altura');
    });

    it('generates division code (/) for two operands', () => {
      const block = workspace.newBlock('math_arithmetic');
      block.setFieldValue('DIVIDE', 'OP');
      connectValue(block, 'A', createNumberBlock(workspace, 100));
      connectValue(block, 'B', createNumberBlock(workspace, 4));

      const [code] = generator.blockToCode(block) as [string, number];
      expect(code).toBe('100 / 4');
    });

    it('generates pow() function call for power exponentiation (POWER)', () => {
      const block = workspace.newBlock('math_arithmetic');
      block.setFieldValue('POWER', 'OP');
      connectValue(block, 'A', createNumberBlock(workspace, 2));
      connectValue(block, 'B', createNumberBlock(workspace, 8));

      const [code] = generator.blockToCode(block) as [string, number];
      expect(code).toBe('pow(2, 8)');
    });

    it('provides fallback value 0 when arithmetic operands are disconnected', () => {
      const block = workspace.newBlock('math_arithmetic');
      block.setFieldValue('ADD', 'OP');

      const [code] = generator.blockToCode(block) as [string, number];
      expect(code).toBe('0 + 0');
    });
  });

  describe('Arithmetic Precedence and Parenthesization', () => {
    it('wraps lower-precedence addition in parentheses when inside multiplication: (a + b) * c', () => {
      const addBlock = workspace.newBlock('math_arithmetic');
      addBlock.setFieldValue('ADD', 'OP');
      connectValue(addBlock, 'A', createNumberBlock(workspace, 1));
      connectValue(addBlock, 'B', createNumberBlock(workspace, 2));

      const mulBlock = workspace.newBlock('math_arithmetic');
      mulBlock.setFieldValue('MULTIPLY', 'OP');
      connectValue(mulBlock, 'A', addBlock);
      connectValue(mulBlock, 'B', createNumberBlock(workspace, 3));

      const [code] = generator.blockToCode(mulBlock) as [string, number];
      expect(code).toBe('(1 + 2) * 3');
    });

    it('does not wrap higher-precedence multiplication in parentheses when inside addition: a * b + c', () => {
      const mulBlock = workspace.newBlock('math_arithmetic');
      mulBlock.setFieldValue('MULTIPLY', 'OP');
      connectValue(mulBlock, 'A', createNumberBlock(workspace, 1));
      connectValue(mulBlock, 'B', createNumberBlock(workspace, 2));

      const addBlock = workspace.newBlock('math_arithmetic');
      addBlock.setFieldValue('ADD', 'OP');
      connectValue(addBlock, 'A', mulBlock);
      connectValue(addBlock, 'B', createNumberBlock(workspace, 3));

      const [code] = generator.blockToCode(addBlock) as [string, number];
      expect(code).toBe('1 * 2 + 3');
    });

    it('wraps addition in denominator of division: a / (b + c)', () => {
      const addBlock = workspace.newBlock('math_arithmetic');
      addBlock.setFieldValue('ADD', 'OP');
      connectValue(addBlock, 'A', createVariableGetBlock(workspace, 'y'));
      connectValue(addBlock, 'B', createVariableGetBlock(workspace, 'z'));

      const divBlock = workspace.newBlock('math_arithmetic');
      divBlock.setFieldValue('DIVIDE', 'OP');
      connectValue(divBlock, 'A', createVariableGetBlock(workspace, 'x'));
      connectValue(divBlock, 'B', addBlock);

      const [code] = generator.blockToCode(divBlock) as [string, number];
      expect(code).toBe('x / (y + z)');
    });
  });

  describe('Single-Argument Math Operators (math_single and math_modulo)', () => {
    it('generates negation (-) for negative operand with math_single NEG', () => {
      const block = workspace.newBlock('math_single');
      block.setFieldValue('NEG', 'OP');
      connectValue(block, 'NUM', createVariableGetBlock(workspace, 'temperatura'));

      const [code] = generator.blockToCode(block) as [string, number];
      expect(code).toBe('-temperatura');
    });

    it('generates abs() function call for math_single ABS', () => {
      const block = workspace.newBlock('math_single');
      block.setFieldValue('ABS', 'OP');
      connectValue(block, 'NUM', createNumberBlock(workspace, -42));

      const [code] = generator.blockToCode(block) as [string, number];
      expect(code).toBe('abs(-42)');
    });

    it('generates sqrt() function call for math_single ROOT', () => {
      const block = workspace.newBlock('math_single');
      block.setFieldValue('ROOT', 'OP');
      connectValue(block, 'NUM', createNumberBlock(workspace, 64));

      const [code] = generator.blockToCode(block) as [string, number];
      expect(code).toBe('sqrt(64)');
    });

    it('generates modulo operator (%) for math_modulo', () => {
      const block = workspace.newBlock('math_modulo');
      connectValue(block, 'DIVIDEND', createVariableGetBlock(workspace, 'contador'));
      connectValue(block, 'DIVISOR', createNumberBlock(workspace, 2));

      const [code] = generator.blockToCode(block) as [string, number];
      expect(code).toBe('contador % 2');
    });

    it('provides fallback for math_modulo when inputs are disconnected', () => {
      const block = workspace.newBlock('math_modulo');

      const [code] = generator.blockToCode(block) as [string, number];
      expect(code).toBe('0 % 1');
    });
  });

  describe('Relational / Comparison Operators (logic_compare)', () => {
    it('generates equality check (==)', () => {
      const block = workspace.newBlock('logic_compare');
      block.setFieldValue('EQ', 'OP');
      connectValue(block, 'A', createVariableGetBlock(workspace, 'status'));
      connectValue(block, 'B', createNumberBlock(workspace, 1));

      const [code] = generator.blockToCode(block) as [string, number];
      expect(code).toBe('status == 1');
    });

    it('generates inequality check (!=)', () => {
      const block = workspace.newBlock('logic_compare');
      block.setFieldValue('NEQ', 'OP');
      connectValue(block, 'A', createVariableGetBlock(workspace, 'modo'));
      connectValue(block, 'B', createNumberBlock(workspace, 0));

      const [code] = generator.blockToCode(block) as [string, number];
      expect(code).toBe('modo != 0');
    });

    it('generates strictly greater than (>)', () => {
      const block = workspace.newBlock('logic_compare');
      block.setFieldValue('GT', 'OP');
      connectValue(block, 'A', createVariableGetBlock(workspace, 'temperatura'));
      connectValue(block, 'B', createNumberBlock(workspace, 30));

      const [code] = generator.blockToCode(block) as [string, number];
      expect(code).toBe('temperatura > 30');
    });

    it('generates greater than or equal (>=)', () => {
      const block = workspace.newBlock('logic_compare');
      block.setFieldValue('GTE', 'OP');
      connectValue(block, 'A', createVariableGetBlock(workspace, 'idade'));
      connectValue(block, 'B', createNumberBlock(workspace, 18));

      const [code] = generator.blockToCode(block) as [string, number];
      expect(code).toBe('idade >= 18');
    });

    it('generates strictly less than (<)', () => {
      const block = workspace.newBlock('logic_compare');
      block.setFieldValue('LT', 'OP');
      connectValue(block, 'A', createVariableGetBlock(workspace, 'sensor'));
      connectValue(block, 'B', createNumberBlock(workspace, 100));

      const [code] = generator.blockToCode(block) as [string, number];
      expect(code).toBe('sensor < 100');
    });

    it('generates less than or equal (<=)', () => {
      const block = workspace.newBlock('logic_compare');
      block.setFieldValue('LTE', 'OP');
      connectValue(block, 'A', createVariableGetBlock(workspace, 'nivel'));
      connectValue(block, 'B', createNumberBlock(workspace, 50));

      const [code] = generator.blockToCode(block) as [string, number];
      expect(code).toBe('nivel <= 50');
    });

    it('provides fallback 0 when comparison inputs are disconnected', () => {
      const block = workspace.newBlock('logic_compare');
      block.setFieldValue('EQ', 'OP');

      const [code] = generator.blockToCode(block) as [string, number];
      expect(code).toBe('0 == 0');
    });
  });

  describe('Logical Operators (logic_operation and logic_negate)', () => {
    it('generates logical AND (&&) for two boolean expressions', () => {
      const cmp1 = workspace.newBlock('logic_compare');
      cmp1.setFieldValue('GT', 'OP');
      connectValue(cmp1, 'A', createVariableGetBlock(workspace, 'x'));
      connectValue(cmp1, 'B', createNumberBlock(workspace, 0));

      const cmp2 = workspace.newBlock('logic_compare');
      cmp2.setFieldValue('LT', 'OP');
      connectValue(cmp2, 'A', createVariableGetBlock(workspace, 'x'));
      connectValue(cmp2, 'B', createNumberBlock(workspace, 100));

      const andBlock = workspace.newBlock('logic_operation');
      andBlock.setFieldValue('AND', 'OP');
      connectValue(andBlock, 'A', cmp1);
      connectValue(andBlock, 'B', cmp2);

      const [code] = generator.blockToCode(andBlock) as [string, number];
      expect(code).toBe('x > 0 && x < 100');
    });

    it('generates logical OR (||) for two boolean expressions', () => {
      const block = workspace.newBlock('logic_operation');
      block.setFieldValue('OR', 'OP');
      connectValue(block, 'A', createBooleanBlock(workspace, true));
      connectValue(block, 'B', createBooleanBlock(workspace, false));

      const [code] = generator.blockToCode(block) as [string, number];
      expect(code).toBe('true || false');
    });

    it('wraps OR in parentheses when inside AND: (a || b) && c', () => {
      const orBlock = workspace.newBlock('logic_operation');
      orBlock.setFieldValue('OR', 'OP');
      connectValue(orBlock, 'A', createVariableGetBlock(workspace, 'a'));
      connectValue(orBlock, 'B', createVariableGetBlock(workspace, 'b'));

      const andBlock = workspace.newBlock('logic_operation');
      andBlock.setFieldValue('AND', 'OP');
      connectValue(andBlock, 'A', orBlock);
      connectValue(andBlock, 'B', createVariableGetBlock(workspace, 'c'));

      const [code] = generator.blockToCode(andBlock) as [string, number];
      expect(code).toBe('(a || b) && c');
    });

    it('does not wrap AND in parentheses when inside OR: a && b || c', () => {
      const andBlock = workspace.newBlock('logic_operation');
      andBlock.setFieldValue('AND', 'OP');
      connectValue(andBlock, 'A', createVariableGetBlock(workspace, 'a'));
      connectValue(andBlock, 'B', createVariableGetBlock(workspace, 'b'));

      const orBlock = workspace.newBlock('logic_operation');
      orBlock.setFieldValue('OR', 'OP');
      connectValue(orBlock, 'A', andBlock);
      connectValue(orBlock, 'B', createVariableGetBlock(workspace, 'c'));

      const [code] = generator.blockToCode(orBlock) as [string, number];
      expect(code).toBe('a && b || c');
    });

    it('generates logical NOT (!) with logic_negate', () => {
      const block = workspace.newBlock('logic_negate');
      connectValue(block, 'BOOL', createVariableGetBlock(workspace, 'ativo'));

      const [code] = generator.blockToCode(block) as [string, number];
      expect(code).toBe('!ativo');
    });

    it('wraps comparison expression in parentheses when negated: !(x == y)', () => {
      const cmpBlock = workspace.newBlock('logic_compare');
      cmpBlock.setFieldValue('EQ', 'OP');
      connectValue(cmpBlock, 'A', createVariableGetBlock(workspace, 'x'));
      connectValue(cmpBlock, 'B', createVariableGetBlock(workspace, 'y'));

      const notBlock = workspace.newBlock('logic_negate');
      connectValue(notBlock, 'BOOL', cmpBlock);

      const [code] = generator.blockToCode(notBlock) as [string, number];
      expect(code).toBe('!(x == y)');
    });

    it('provides fallback for logic_operation and logic_negate when disconnected', () => {
      const andBlock = workspace.newBlock('logic_operation');
      andBlock.setFieldValue('AND', 'OP');
      const [andCode] = generator.blockToCode(andBlock) as [string, number];
      expect(andCode).toBe('true && true');

      const orBlock = workspace.newBlock('logic_operation');
      orBlock.setFieldValue('OR', 'OP');
      const [orCode] = generator.blockToCode(orBlock) as [string, number];
      expect(orCode).toBe('false || false');

      const notBlock = workspace.newBlock('logic_negate');
      const [notCode] = generator.blockToCode(notBlock) as [string, number];
      expect(notCode).toBe('!true');
    });
  });

  describe('Integration with Variables and Control Flow', () => {
    it('generates variable assignment with arithmetic expression: total = a + b * 2;', () => {
      const mul = workspace.newBlock('math_arithmetic');
      mul.setFieldValue('MULTIPLY', 'OP');
      connectValue(mul, 'A', createVariableGetBlock(workspace, 'b'));
      connectValue(mul, 'B', createNumberBlock(workspace, 2));

      const add = workspace.newBlock('math_arithmetic');
      add.setFieldValue('ADD', 'OP');
      connectValue(add, 'A', createVariableGetBlock(workspace, 'a'));
      connectValue(add, 'B', mul);

      const variable = workspace.createVariable('total');
      const setBlock = workspace.newBlock('variables_set');
      setBlock.setFieldValue(variable.getId(), 'VAR');
      connectValue(setBlock, 'VALUE', add);

      const code = generator.blockToCode(setBlock);
      expect(code).toBe('total = a + b * 2;\n');
    });

    it('generates if statement using compound logical condition in Arduino sketch', () => {
      const cmp = workspace.newBlock('logic_compare');
      cmp.setFieldValue('GTE', 'OP');
      connectValue(cmp, 'A', createVariableGetBlock(workspace, 'temperatura'));
      connectValue(cmp, 'B', createNumberBlock(workspace, 50));

      const ifBlock = workspace.newBlock('controls_if');
      connectValue(ifBlock, 'IF0', cmp);

      const actionVar = workspace.createVariable('ventilador');
      const actionBlock = workspace.newBlock('variables_set');
      actionBlock.setFieldValue(actionVar.getId(), 'VAR');
      connectValue(actionBlock, 'VALUE', createNumberBlock(workspace, 1));
      connectStatement(ifBlock, 'DO0', actionBlock);

      const result = generator.generateCode(workspace);
      expect(result.isValid).toBe(true);
      expect(result.code).toContain('if (temperatura >= 50) {\n    ventilador = 1;\n  }\n');
    });
  });

  describe('Additional Math and Logic Operations (math_round, math_constrain, logic_ternary, logic_null)', () => {
    it('generates round, ceil, and floor for math_round', () => {
      const rBlock = workspace.newBlock('math_round');
      rBlock.setFieldValue('ROUND', 'OP');
      connectValue(rBlock, 'NUM', createNumberBlock(workspace, 3.7));
      expect(generator.blockToCode(rBlock)[0]).toBe('round(3.7)');

      const ceilBlock = workspace.newBlock('math_round');
      ceilBlock.setFieldValue('ROUNDUP', 'OP');
      connectValue(ceilBlock, 'NUM', createNumberBlock(workspace, 3.2));
      expect(generator.blockToCode(ceilBlock)[0]).toBe('ceil(3.2)');

      const floorBlock = workspace.newBlock('math_round');
      floorBlock.setFieldValue('ROUNDDOWN', 'OP');
      connectValue(floorBlock, 'NUM', createNumberBlock(workspace, 3.9));
      expect(generator.blockToCode(floorBlock)[0]).toBe('floor(3.9)');
    });

    it('generates constrain() for math_constrain', () => {
      const block = workspace.newBlock('math_constrain');
      connectValue(block, 'VALUE', createVariableGetBlock(workspace, 'leitura'));
      connectValue(block, 'LOW', createNumberBlock(workspace, 0));
      connectValue(block, 'HIGH', createNumberBlock(workspace, 1023));

      const [code] = generator.blockToCode(block) as [string, number];
      expect(code).toBe('constrain(leitura, 0, 1023)');
    });

    it('generates random() for math_random_int', () => {
      const block = workspace.newBlock('math_random_int');
      connectValue(block, 'FROM', createNumberBlock(workspace, 1));
      connectValue(block, 'TO', createNumberBlock(workspace, 6));

      const [code] = generator.blockToCode(block) as [string, number];
      expect(code).toBe('random(1, 6 + 1)');
    });

    it('generates ternary conditional expression for logic_ternary', () => {
      const block = workspace.newBlock('logic_ternary');
      connectValue(block, 'IF', createVariableGetBlock(workspace, 'ligado'));
      connectValue(block, 'THEN', createNumberBlock(workspace, 255));
      connectValue(block, 'ELSE', createNumberBlock(workspace, 0));

      const [code] = generator.blockToCode(block) as [string, number];
      expect(code).toBe('(ligado ? 255 : 0)');
    });

    it('generates NULL for logic_null', () => {
      const block = workspace.newBlock('logic_null');
      const [code] = generator.blockToCode(block) as [string, number];
      expect(code).toBe('NULL');
    });
  });
});

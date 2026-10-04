import { describe, it, expect, beforeEach } from 'vitest';
import * as Blockly from 'blockly';
import { ArduinoGenerator } from '@/core/generator/arduino-generator';
import { registerVariableBlocks } from '@/core/generator/blocks/variables';
import { registerLoopBlocks } from '@/core/generator/blocks/loops';

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

function connectNext(blockA: Blockly.Block, blockB: Blockly.Block): void {
  const nextConn = blockA.nextConnection;
  const prevConn = blockB.previousConnection;
  if (nextConn && prevConn) {
    nextConn.connect(prevConn);
  }
}

function createSetVariable(workspace: Blockly.Workspace, varName: string, value: number): Blockly.Block {
  const variable = workspace.createVariable(varName);
  const varBlock = workspace.newBlock('variables_set');
  varBlock.setFieldValue(variable.getId(), 'VAR');
  const numBlock = workspace.newBlock('math_number');
  numBlock.setFieldValue(String(value), 'NUM');
  connectValue(varBlock, 'VALUE', numBlock);
  return varBlock;
}

describe('Loop Blocks Code Generation (T014)', () => {
  let workspace: Blockly.Workspace;
  let generator: ArduinoGenerator;

  beforeEach(() => {
    workspace = new Blockly.Workspace();
    generator = new ArduinoGenerator();
    registerVariableBlocks(generator);
    registerLoopBlocks(generator);
  });

  describe('controls_repeat_ext - repeat N times', () => {
    it('generates for loop with counter up to N and body statement', () => {
      const repeatBlock = workspace.newBlock('controls_repeat_ext');

      const numBlock = workspace.newBlock('math_number');
      numBlock.setFieldValue('10', 'NUM');
      connectValue(repeatBlock, 'TIMES', numBlock);

      const varBlock = createSetVariable(workspace, 'count', 1);
      connectStatement(repeatBlock, 'DO', varBlock);

      const code = generator.blockToCode(repeatBlock);
      expect(code).toBe('for (int count = 0; count < 10; count++) {\n  count = 1;\n}\n');
    });

    it('generates for loop with fallback 0 when TIMES is disconnected', () => {
      const repeatBlock = workspace.newBlock('controls_repeat_ext');

      const varBlock = createSetVariable(workspace, 'x', 5);
      connectStatement(repeatBlock, 'DO', varBlock);

      const code = generator.blockToCode(repeatBlock);
      expect(code).toBe('for (int count = 0; count < 0; count++) {\n  x = 5;\n}\n');
    });

    it('generates empty loop when statement body is empty', () => {
      const repeatBlock = workspace.newBlock('controls_repeat_ext');

      const numBlock = workspace.newBlock('math_number');
      numBlock.setFieldValue('5', 'NUM');
      connectValue(repeatBlock, 'TIMES', numBlock);

      const code = generator.blockToCode(repeatBlock);
      expect(code).toBe('for (int count = 0; count < 5; count++) {\n}\n');
    });

    it('generates loop with multiple chained statements in body', () => {
      const repeatBlock = workspace.newBlock('controls_repeat_ext');

      const numBlock = workspace.newBlock('math_number');
      numBlock.setFieldValue('3', 'NUM');
      connectValue(repeatBlock, 'TIMES', numBlock);

      const var1 = createSetVariable(workspace, 'a', 1);
      const var2 = createSetVariable(workspace, 'b', 2);
      connectNext(var1, var2);
      connectStatement(repeatBlock, 'DO', var1);

      const code = generator.blockToCode(repeatBlock);
      expect(code).toBe('for (int count = 0; count < 3; count++) {\n  a = 1;\n  b = 2;\n}\n');
    });
  });

  describe('controls_whileUntil - while loop', () => {
    it('generates while loop with boolean condition and body statement', () => {
      const whileBlock = workspace.newBlock('controls_whileUntil');
      whileBlock.setFieldValue('WHILE', 'MODE');

      const boolBlock = workspace.newBlock('logic_boolean');
      boolBlock.setFieldValue('TRUE', 'BOOL');
      connectValue(whileBlock, 'BOOL', boolBlock);

      const varBlock = createSetVariable(workspace, 'sensor', 100);
      connectStatement(whileBlock, 'DO', varBlock);

      const code = generator.blockToCode(whileBlock);
      expect(code).toBe('while (true) {\n  sensor = 100;\n}\n');
    });

    it('generates while loop with fallback false when condition is disconnected', () => {
      const whileBlock = workspace.newBlock('controls_whileUntil');
      whileBlock.setFieldValue('WHILE', 'MODE');

      const varBlock = createSetVariable(workspace, 'sensor', 0);
      connectStatement(whileBlock, 'DO', varBlock);

      const code = generator.blockToCode(whileBlock);
      expect(code).toBe('while (false) {\n  sensor = 0;\n}\n');
    });

    it('generates empty while loop when statement body is empty', () => {
      const whileBlock = workspace.newBlock('controls_whileUntil');
      whileBlock.setFieldValue('WHILE', 'MODE');

      const boolBlock = workspace.newBlock('logic_boolean');
      boolBlock.setFieldValue('TRUE', 'BOOL');
      connectValue(whileBlock, 'BOOL', boolBlock);

      const code = generator.blockToCode(whileBlock);
      expect(code).toBe('while (true) {\n}\n');
    });
  });

  describe('controls_whileUntil - until loop', () => {
    it('generates negated condition while loop for UNTIL mode', () => {
      const untilBlock = workspace.newBlock('controls_whileUntil');
      untilBlock.setFieldValue('UNTIL', 'MODE');

      const boolBlock = workspace.newBlock('logic_boolean');
      boolBlock.setFieldValue('TRUE', 'BOOL');
      connectValue(untilBlock, 'BOOL', boolBlock);

      const varBlock = createSetVariable(workspace, 'pronto', 1);
      connectStatement(untilBlock, 'DO', varBlock);

      const code = generator.blockToCode(untilBlock);
      expect(code).toBe('while (!(true)) {\n  pronto = 1;\n}\n');
    });

    it('generates until loop with fallback false when condition is disconnected', () => {
      const untilBlock = workspace.newBlock('controls_whileUntil');
      untilBlock.setFieldValue('UNTIL', 'MODE');

      const varBlock = createSetVariable(workspace, 'pronto', 0);
      connectStatement(untilBlock, 'DO', varBlock);

      const code = generator.blockToCode(untilBlock);
      expect(code).toBe('while (!(false)) {\n  pronto = 0;\n}\n');
    });
  });

  describe('controls_for - count with variable', () => {
    it('generates for loop with step 1 (increment i++)', () => {
      const forBlock = workspace.newBlock('controls_for');
      const varI = workspace.createVariable('i');
      forBlock.setFieldValue(varI.getId(), 'VAR');

      const fromBlock = workspace.newBlock('math_number');
      fromBlock.setFieldValue('1', 'NUM');
      connectValue(forBlock, 'FROM', fromBlock);

      const toBlock = workspace.newBlock('math_number');
      toBlock.setFieldValue('10', 'NUM');
      connectValue(forBlock, 'TO', toBlock);

      const byBlock = workspace.newBlock('math_number');
      byBlock.setFieldValue('1', 'NUM');
      connectValue(forBlock, 'BY', byBlock);

      const bodyVar = createSetVariable(workspace, 'total', 5);
      connectStatement(forBlock, 'DO', bodyVar);

      const code = generator.blockToCode(forBlock);
      expect(code).toBe('for (int i = 1; i <= 10; i++) {\n  total = 5;\n}\n');
    });

    it('generates for loop with custom step (increment i += step)', () => {
      const forBlock = workspace.newBlock('controls_for');
      const varK = workspace.createVariable('k');
      forBlock.setFieldValue(varK.getId(), 'VAR');

      const fromBlock = workspace.newBlock('math_number');
      fromBlock.setFieldValue('0', 'NUM');
      connectValue(forBlock, 'FROM', fromBlock);

      const toBlock = workspace.newBlock('math_number');
      toBlock.setFieldValue('100', 'NUM');
      connectValue(forBlock, 'TO', toBlock);

      const byBlock = workspace.newBlock('math_number');
      byBlock.setFieldValue('10', 'NUM');
      connectValue(forBlock, 'BY', byBlock);

      const bodyVar = createSetVariable(workspace, 'total', 10);
      connectStatement(forBlock, 'DO', bodyVar);

      const code = generator.blockToCode(forBlock);
      expect(code).toBe('for (int k = 0; k <= 100; k += 10) {\n  total = 10;\n}\n');
    });

    it('generates for loop with descending range (decrement i-- or i -= step)', () => {
      const forBlock = workspace.newBlock('controls_for');
      const varJ = workspace.createVariable('j');
      forBlock.setFieldValue(varJ.getId(), 'VAR');

      const fromBlock = workspace.newBlock('math_number');
      fromBlock.setFieldValue('10', 'NUM');
      connectValue(forBlock, 'FROM', fromBlock);

      const toBlock = workspace.newBlock('math_number');
      toBlock.setFieldValue('1', 'NUM');
      connectValue(forBlock, 'TO', toBlock);

      const byBlock = workspace.newBlock('math_number');
      byBlock.setFieldValue('1', 'NUM');
      connectValue(forBlock, 'BY', byBlock);

      const bodyVar = createSetVariable(workspace, 'total', 0);
      connectStatement(forBlock, 'DO', bodyVar);

      const code = generator.blockToCode(forBlock);
      expect(code).toBe('for (int j = 10; j >= 1; j--) {\n  total = 0;\n}\n');
    });

    it('generates for loop with fallback values when inputs are disconnected', () => {
      const forBlock = workspace.newBlock('controls_for');
      const varI = workspace.createVariable('i');
      forBlock.setFieldValue(varI.getId(), 'VAR');

      const bodyVar = createSetVariable(workspace, 'total', 1);
      connectStatement(forBlock, 'DO', bodyVar);

      const code = generator.blockToCode(forBlock);
      expect(code).toBe('for (int i = 0; i <= 10; i++) {\n  total = 1;\n}\n');
    });
  });

  describe('controls_flow_statements - break and continue', () => {
    it('generates break statement for BREAK flow', () => {
      const breakBlock = workspace.newBlock('controls_flow_statements');
      breakBlock.setFieldValue('BREAK', 'FLOW');

      const code = generator.blockToCode(breakBlock);
      expect(code).toBe('break;\n');
    });

    it('generates continue statement for CONTINUE flow', () => {
      const continueBlock = workspace.newBlock('controls_flow_statements');
      continueBlock.setFieldValue('CONTINUE', 'FLOW');

      const code = generator.blockToCode(continueBlock);
      expect(code).toBe('continue;\n');
    });
  });

  describe('nested loops', () => {
    it('generates correctly indented nested for loop inside while loop', () => {
      const whileBlock = workspace.newBlock('controls_whileUntil');
      whileBlock.setFieldValue('WHILE', 'MODE');

      const boolBlock = workspace.newBlock('logic_boolean');
      boolBlock.setFieldValue('TRUE', 'BOOL');
      connectValue(whileBlock, 'BOOL', boolBlock);

      const forBlock = workspace.newBlock('controls_for');
      const varI = workspace.createVariable('i');
      forBlock.setFieldValue(varI.getId(), 'VAR');

      const fromBlock = workspace.newBlock('math_number');
      fromBlock.setFieldValue('0', 'NUM');
      connectValue(forBlock, 'FROM', fromBlock);

      const toBlock = workspace.newBlock('math_number');
      toBlock.setFieldValue('5', 'NUM');
      connectValue(forBlock, 'TO', toBlock);

      const byBlock = workspace.newBlock('math_number');
      byBlock.setFieldValue('1', 'NUM');
      connectValue(forBlock, 'BY', byBlock);

      const bodyVar = createSetVariable(workspace, 'val', 42);
      connectStatement(forBlock, 'DO', bodyVar);

      connectStatement(whileBlock, 'DO', forBlock);

      const code = generator.blockToCode(whileBlock);
      expect(code).toBe('while (true) {\n  for (int i = 0; i <= 5; i++) {\n    val = 42;\n  }\n}\n');
    });
  });

  describe('workspace generateCode integration with loops', () => {
    it('assembles loop statements inside void loop() with proper indentation', () => {
      const whileBlock = workspace.newBlock('controls_whileUntil');
      whileBlock.setFieldValue('WHILE', 'MODE');

      const boolBlock = workspace.newBlock('logic_boolean');
      boolBlock.setFieldValue('TRUE', 'BOOL');
      connectValue(whileBlock, 'BOOL', boolBlock);

      const bodyVar = createSetVariable(workspace, 'ativo', 1);
      connectStatement(whileBlock, 'DO', bodyVar);

      const result = generator.generateCode(workspace);
      expect(result.isValid).toBe(true);
      expect(result.code).toContain('void loop() {\n  while (true) {\n    ativo = 1;\n  }\n}\n');
    });
  });
});

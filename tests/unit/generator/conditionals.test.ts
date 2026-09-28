import { describe, it, expect, beforeEach } from 'vitest';
import * as Blockly from 'blockly';
import { ArduinoGenerator } from '@/core/generator/arduino-generator';
import { registerVariableBlocks } from '@/core/generator/blocks/variables';
import { registerConditionalBlocks } from '@/core/generator/blocks/conditionals';

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

describe('Conditional Blocks Code Generation (T013)', () => {
  let workspace: Blockly.Workspace;
  let generator: ArduinoGenerator;

  beforeEach(() => {
    workspace = new Blockly.Workspace();
    generator = new ArduinoGenerator();
    registerVariableBlocks(generator);
    registerConditionalBlocks(generator);
  });

  describe('controls_if - simple if', () => {
    it('generates if statement with boolean condition and body statement', () => {
      const ifBlock = workspace.newBlock('controls_if');

      const boolBlock = workspace.newBlock('logic_boolean');
      boolBlock.setFieldValue('TRUE', 'BOOL');
      connectValue(ifBlock, 'IF0', boolBlock);

      const varBlock = createSetVariable(workspace, 'x', 10);
      connectStatement(ifBlock, 'DO0', varBlock);

      const code = generator.blockToCode(ifBlock);
      expect(code).toBe('if (true) {\n  x = 10;\n}\n');
    });

    it('generates if statement with fallback condition (false) when condition is disconnected', () => {
      const ifBlock = workspace.newBlock('controls_if');

      const varBlock = createSetVariable(workspace, 'x', 5);
      connectStatement(ifBlock, 'DO0', varBlock);

      const code = generator.blockToCode(ifBlock);
      expect(code).toBe('if (false) {\n  x = 5;\n}\n');
    });

    it('generates empty if block when statement body is empty', () => {
      const ifBlock = workspace.newBlock('controls_if');

      const boolBlock = workspace.newBlock('logic_boolean');
      boolBlock.setFieldValue('TRUE', 'BOOL');
      connectValue(ifBlock, 'IF0', boolBlock);

      const code = generator.blockToCode(ifBlock);
      expect(code).toBe('if (true) {\n}\n');
    });

    it('generates if statement with multiple chained statements in body', () => {
      const ifBlock = workspace.newBlock('controls_if');

      const boolBlock = workspace.newBlock('logic_boolean');
      boolBlock.setFieldValue('TRUE', 'BOOL');
      connectValue(ifBlock, 'IF0', boolBlock);

      const var1 = createSetVariable(workspace, 'a', 1);
      const var2 = createSetVariable(workspace, 'b', 2);

      connectNext(var1, var2);
      connectStatement(ifBlock, 'DO0', var1);

      const code = generator.blockToCode(ifBlock);
      expect(code).toBe('if (true) {\n  a = 1;\n  b = 2;\n}\n');
    });
  });

  describe('controls_if - if / else', () => {
    it('generates if-else structure with statements in both branches', () => {
      const ifBlock = workspace.newBlock('controls_if');
      (ifBlock as any).loadExtraState?.({ hasElse: true });

      const boolBlock = workspace.newBlock('logic_boolean');
      boolBlock.setFieldValue('TRUE', 'BOOL');
      connectValue(ifBlock, 'IF0', boolBlock);

      const doVar = createSetVariable(workspace, 'status', 1);
      connectStatement(ifBlock, 'DO0', doVar);

      const elseVar = createSetVariable(workspace, 'status', 0);
      connectStatement(ifBlock, 'ELSE', elseVar);

      const code = generator.blockToCode(ifBlock);
      expect(code).toBe('if (true) {\n  status = 1;\n} else {\n  status = 0;\n}\n');
    });

    it('generates if-else structure with empty do branch and filled else branch', () => {
      const ifBlock = workspace.newBlock('controls_if');
      (ifBlock as any).loadExtraState?.({ hasElse: true });

      const boolBlock = workspace.newBlock('logic_boolean');
      boolBlock.setFieldValue('FALSE', 'BOOL');
      connectValue(ifBlock, 'IF0', boolBlock);

      const elseVar = createSetVariable(workspace, 'x', 99);
      connectStatement(ifBlock, 'ELSE', elseVar);

      const code = generator.blockToCode(ifBlock);
      expect(code).toBe('if (false) {\n} else {\n  x = 99;\n}\n');
    });

    it('generates if-else structure with disconnected condition defaulting to false', () => {
      const ifBlock = workspace.newBlock('controls_if');
      (ifBlock as any).loadExtraState?.({ hasElse: true });

      const elseVar = createSetVariable(workspace, 'flag', 1);
      connectStatement(ifBlock, 'ELSE', elseVar);

      const code = generator.blockToCode(ifBlock);
      expect(code).toBe('if (false) {\n} else {\n  flag = 1;\n}\n');
    });
  });

  describe('controls_if - if / else if / else', () => {
    it('generates if / else if / else chain with multiple branches', () => {
      const ifBlock = workspace.newBlock('controls_if');
      (ifBlock as any).loadExtraState?.({ elseIfCount: 1, hasElse: true });

      const bool0 = workspace.newBlock('logic_boolean');
      bool0.setFieldValue('TRUE', 'BOOL');
      connectValue(ifBlock, 'IF0', bool0);

      const do0 = createSetVariable(workspace, 'resultado', 10);
      connectStatement(ifBlock, 'DO0', do0);

      const bool1 = workspace.newBlock('logic_boolean');
      bool1.setFieldValue('FALSE', 'BOOL');
      connectValue(ifBlock, 'IF1', bool1);

      const do1 = createSetVariable(workspace, 'resultado', 20);
      connectStatement(ifBlock, 'DO1', do1);

      const elseVar = createSetVariable(workspace, 'resultado', 30);
      connectStatement(ifBlock, 'ELSE', elseVar);

      const code = generator.blockToCode(ifBlock);
      expect(code).toBe('if (true) {\n  resultado = 10;\n} else if (false) {\n  resultado = 20;\n} else {\n  resultado = 30;\n}\n');
    });

    it('generates if / else if chain without else branch', () => {
      const ifBlock = workspace.newBlock('controls_if');
      (ifBlock as any).loadExtraState?.({ elseIfCount: 1, hasElse: false });

      const bool0 = workspace.newBlock('logic_boolean');
      bool0.setFieldValue('TRUE', 'BOOL');
      connectValue(ifBlock, 'IF0', bool0);

      const do0 = createSetVariable(workspace, 'v', 1);
      connectStatement(ifBlock, 'DO0', do0);

      const bool1 = workspace.newBlock('logic_boolean');
      bool1.setFieldValue('TRUE', 'BOOL');
      connectValue(ifBlock, 'IF1', bool1);

      const do1 = createSetVariable(workspace, 'v', 2);
      connectStatement(ifBlock, 'DO1', do1);

      const code = generator.blockToCode(ifBlock);
      expect(code).toBe('if (true) {\n  v = 1;\n} else if (true) {\n  v = 2;\n}\n');
    });
  });

  describe('nested conditionals', () => {
    it('generates correctly indented nested if within if body', () => {
      const outerIf = workspace.newBlock('controls_if');
      const outerBool = workspace.newBlock('logic_boolean');
      outerBool.setFieldValue('TRUE', 'BOOL');
      connectValue(outerIf, 'IF0', outerBool);

      const innerIf = workspace.newBlock('controls_if');
      const innerBool = workspace.newBlock('logic_boolean');
      innerBool.setFieldValue('TRUE', 'BOOL');
      connectValue(innerIf, 'IF0', innerBool);

      const innerVar = createSetVariable(workspace, 'nivel', 2);
      connectStatement(innerIf, 'DO0', innerVar);

      connectStatement(outerIf, 'DO0', innerIf);

      const code = generator.blockToCode(outerIf);
      expect(code).toBe('if (true) {\n  if (true) {\n    nivel = 2;\n  }\n}\n');
    });

    it('generates correctly indented nested if-else within else branch', () => {
      const outerIf = workspace.newBlock('controls_if');
      (outerIf as any).loadExtraState?.({ hasElse: true });

      const outerBool = workspace.newBlock('logic_boolean');
      outerBool.setFieldValue('FALSE', 'BOOL');
      connectValue(outerIf, 'IF0', outerBool);

      const innerIf = workspace.newBlock('controls_if');
      (innerIf as any).loadExtraState?.({ hasElse: true });

      const innerBool = workspace.newBlock('logic_boolean');
      innerBool.setFieldValue('TRUE', 'BOOL');
      connectValue(innerIf, 'IF0', innerBool);

      const innerDoVar = createSetVariable(workspace, 'sub', 1);
      connectStatement(innerIf, 'DO0', innerDoVar);

      const innerElseVar = createSetVariable(workspace, 'sub', 2);
      connectStatement(innerIf, 'ELSE', innerElseVar);

      connectStatement(outerIf, 'ELSE', innerIf);

      const code = generator.blockToCode(outerIf);
      expect(code).toBe('if (false) {\n} else {\n  if (true) {\n    sub = 1;\n  } else {\n    sub = 2;\n  }\n}\n');
    });
  });

  describe('workspace generateCode integration with conditionals', () => {
    it('assembles conditional statements inside void loop() with proper indentation', () => {
      const ifBlock = workspace.newBlock('controls_if');
      (ifBlock as any).loadExtraState?.({ hasElse: true });

      const boolBlock = workspace.newBlock('logic_boolean');
      boolBlock.setFieldValue('TRUE', 'BOOL');
      connectValue(ifBlock, 'IF0', boolBlock);

      const doVar = createSetVariable(workspace, 'ligado', 1);
      connectStatement(ifBlock, 'DO0', doVar);

      const elseVar = createSetVariable(workspace, 'ligado', 0);
      connectStatement(ifBlock, 'ELSE', elseVar);

      const result = generator.generateCode(workspace);
      expect(result.isValid).toBe(true);
      expect(result.code).toContain('void loop() {\n  if (true) {\n    ligado = 1;\n  } else {\n    ligado = 0;\n  }\n}\n');
    });
  });
});

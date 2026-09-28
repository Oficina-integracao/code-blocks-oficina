import { describe, it, expect, beforeEach } from 'vitest';
import * as Blockly from 'blockly';
import { ArduinoGenerator } from '@/core/generator/arduino-generator';
import { registerVariableBlocks } from '@/core/generator/blocks/variables';

function connectValue(block: Blockly.Block, inputName: string, targetBlock: Blockly.Block): void {
  const inputConn = block.getInput(inputName)?.connection;
  const targetConn = targetBlock.outputConnection;
  if (inputConn && targetConn) {
    inputConn.connect(targetConn);
  }
}

describe('Variable Blocks Code Generation (T011)', () => {
  let workspace: Blockly.Workspace;
  let generator: ArduinoGenerator;

  beforeEach(() => {
    workspace = new Blockly.Workspace();
    generator = new ArduinoGenerator();
    registerVariableBlocks(generator);
  });

  describe('variables_declare', () => {
    it('generates int variable declaration with initial integer value', () => {
      const block = workspace.newBlock('variables_declare');
      block.setFieldValue('int', 'TYPE');
      block.setFieldValue('contador', 'VAR');

      const numBlock = workspace.newBlock('math_number');
      numBlock.setFieldValue('10', 'NUM');
      connectValue(block, 'VALUE', numBlock);

      const code = generator.blockToCode(block);
      expect(code).toBe('int contador = 10;\n');
    });

    it('generates float variable declaration with decimal value', () => {
      const block = workspace.newBlock('variables_declare');
      block.setFieldValue('float', 'TYPE');
      block.setFieldValue('temperatura', 'VAR');

      const numBlock = workspace.newBlock('math_number');
      numBlock.setFieldValue('25.5', 'NUM');
      connectValue(block, 'VALUE', numBlock);

      const code = generator.blockToCode(block);
      expect(code).toBe('float temperatura = 25.5;\n');
    });

    it('generates boolean variable declaration with boolean value', () => {
      const block = workspace.newBlock('variables_declare');
      block.setFieldValue('bool', 'TYPE');
      block.setFieldValue('ativo', 'VAR');

      const boolBlock = workspace.newBlock('logic_boolean');
      boolBlock.setFieldValue('TRUE', 'BOOL');
      connectValue(block, 'VALUE', boolBlock);

      const code = generator.blockToCode(block);
      expect(code).toBe('bool ativo = true;\n');
    });

    it('generates String variable declaration with text literal', () => {
      const block = workspace.newBlock('variables_declare');
      block.setFieldValue('String', 'TYPE');
      block.setFieldValue('mensagem', 'VAR');

      const textBlock = workspace.newBlock('text');
      textBlock.setFieldValue('Ola Arduino', 'TEXT');
      connectValue(block, 'VALUE', textBlock);

      const code = generator.blockToCode(block);
      expect(code).toBe('String mensagem = "Ola Arduino";\n');
    });

    it('generates default initial value when VALUE input is disconnected', () => {
      const block = workspace.newBlock('variables_declare');
      block.setFieldValue('int', 'TYPE');
      block.setFieldValue('total', 'VAR');

      const code = generator.blockToCode(block);
      expect(code).toBe('int total = 0;\n');
    });
  });

  describe('variables_set', () => {
    it('generates assignment code for an existing variable', () => {
      const variable = workspace.createVariable('velocidade');
      const block = workspace.newBlock('variables_set');
      block.setFieldValue(variable.getId(), 'VAR');

      const numBlock = workspace.newBlock('math_number');
      numBlock.setFieldValue('100', 'NUM');
      connectValue(block, 'VALUE', numBlock);

      const code = generator.blockToCode(block);
      expect(code).toBe('velocidade = 100;\n');
    });

    it('generates assignment with fallback 0 when value input is disconnected', () => {
      const variable = workspace.createVariable('velocidade');
      const block = workspace.newBlock('variables_set');
      block.setFieldValue(variable.getId(), 'VAR');

      const code = generator.blockToCode(block);
      expect(code).toBe('velocidade = 0;\n');
    });
  });

  describe('variables_get', () => {
    it('generates variable identifier reference for expression use', () => {
      const variable = workspace.createVariable('x');
      const block = workspace.newBlock('variables_get');
      block.setFieldValue(variable.getId(), 'VAR');

      const [code, order] = generator.blockToCode(block) as [string, number];
      expect(code).toBe('x');
      expect(order).toBe(0); // Order.ATOMIC
    });
  });

  describe('variables_change', () => {
    it('generates increment statement code', () => {
      const block = workspace.newBlock('variables_change');
      block.setFieldValue('contador', 'VAR');

      const numBlock = workspace.newBlock('math_number');
      numBlock.setFieldValue('1', 'NUM');
      connectValue(block, 'DELTA', numBlock);

      const code = generator.blockToCode(block);
      expect(code).toBe('contador = contador + 1;\n');
    });
  });

  describe('variable name sanitization', () => {
    it('sanitizes variable names with spaces or special characters to valid C++ identifiers', () => {
      const variable = workspace.createVariable('minha variavel!');
      const block = workspace.newBlock('variables_set');
      block.setFieldValue(variable.getId(), 'VAR');

      const numBlock = workspace.newBlock('math_number');
      numBlock.setFieldValue('42', 'NUM');
      connectValue(block, 'VALUE', numBlock);

      const code = generator.blockToCode(block);
      expect(code).toBe('minha_variavel_ = 42;\n');
    });
  });
});

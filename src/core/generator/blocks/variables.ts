import * as Blockly from 'blockly';
import { ArduinoGenerator } from '../arduino-generator';
import { Order } from '../order';

const DEFAULT_VALS: Record<string, string> = {
  int: '0', float: '0.0', bool: 'false', boolean: 'false', String: '""', char: "'\\0'",
};

function extractVarName(block: Blockly.Block, fieldName = 'VAR'): string {
  const field = block.getField(fieldName);
  const text = field?.getText?.();
  if (text) return text;
  const idOrName = block.getFieldValue(fieldName);
  return block.workspace?.getVariableById?.(idOrName)?.name || idOrName || 'variavel';
}

function ensureBlocksDefined(): void {
  if (Blockly.Blocks['variables_declare']) return;

  Blockly.common.defineBlocksWithJsonArray([
    {
      type: 'variables_declare',
      message0: 'declarar %1 %2 = %3',
      args0: [
        {
          type: 'field_dropdown',
          name: 'TYPE',
          options: [
            ['int', 'int'], ['float', 'float'], ['bool', 'bool'],
            ['String', 'String'], ['char', 'char'],
          ],
        },
        { type: 'field_input', name: 'VAR', text: 'variavel' },
        { type: 'input_value', name: 'VALUE' },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 330,
    },
    {
      type: 'variables_change',
      message0: 'alterar %1 por %2',
      args0: [
        { type: 'field_input', name: 'VAR', text: 'variavel' },
        { type: 'input_value', name: 'DELTA' },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 330,
    },
  ]);
}

/**
 * Registers variable block definitions and Arduino code generators.
 */
export function registerVariableBlocks(generator: ArduinoGenerator): void {
  ensureBlocksDefined();

  generator.forBlock['variables_declare'] = (block: Blockly.Block) => {
    const type = block.getFieldValue('TYPE') || 'int';
    const varName = generator.cleanIdentifier(extractVarName(block, 'VAR'));
    const defaultVal = DEFAULT_VALS[type] || '0';
    const val = generator.valueToCode(block, 'VALUE', Order.ASSIGNMENT) || defaultVal;
    return `${type} ${varName} = ${val};\n`;
  };

  generator.forBlock['variables_set'] = (block: Blockly.Block) => {
    const varName = generator.cleanIdentifier(extractVarName(block, 'VAR'));
    const val = generator.valueToCode(block, 'VALUE', Order.ASSIGNMENT) || '0';
    return `${varName} = ${val};\n`;
  };

  generator.forBlock['variables_get'] = (block: Blockly.Block) => {
    const varName = generator.cleanIdentifier(extractVarName(block, 'VAR'));
    return [varName, Order.ATOMIC];
  };

  generator.forBlock['variables_change'] = (block: Blockly.Block) => {
    const varName = generator.cleanIdentifier(extractVarName(block, 'VAR'));
    const delta = generator.valueToCode(block, 'DELTA', Order.ADDITIVE) || '1';
    return `${varName} = ${varName} + ${delta};\n`;
  };

  generator.forBlock['math_number'] = (block: Blockly.Block) => {
    const code = Number(block.getFieldValue('NUM') || 0);
    return [String(code), Order.ATOMIC];
  };

  generator.forBlock['text'] = (block: Blockly.Block) => {
    const text = block.getFieldValue('TEXT') || '';
    return [`"${text}"`, Order.ATOMIC];
  };

  generator.forBlock['logic_boolean'] = (block: Blockly.Block) => {
    const bool = block.getFieldValue('BOOL') === 'TRUE' ? 'true' : 'false';
    return [bool, Order.ATOMIC];
  };
}

import * as Blockly from 'blockly';
import { ArduinoGenerator } from '../arduino-generator';
import { Order } from '../order';

function extractVarName(block: Blockly.Block, fieldName = 'VAR'): string {
  const field = block.getField(fieldName);
  const text = field?.getText?.();
  if (text) return text;
  const idOrName = block.getFieldValue(fieldName);
  return block.workspace?.getVariableById?.(idOrName)?.name || idOrName || 'i';
}

function generateForLoopHeader(generator: ArduinoGenerator, block: Blockly.Block): string {
  const variable = generator.cleanIdentifier(extractVarName(block, 'VAR'));
  const from = generator.valueToCode(block, 'FROM', Order.ASSIGNMENT) || '0';
  const to = generator.valueToCode(block, 'TO', Order.ASSIGNMENT) || '10';
  const by = generator.valueToCode(block, 'BY', Order.ASSIGNMENT) || '1';

  const numFrom = Number(from);
  const numTo = Number(to);
  const numBy = Number(by);

  if (!isNaN(numFrom) && !isNaN(numTo) && numFrom > numTo) {
    const stepOp = !isNaN(numBy) && numBy === 1 ? '--' : ` -= ${by}`;
    return `for (int ${variable} = ${from}; ${variable} >= ${to}; ${variable}${stepOp})`;
  }

  const stepOp = !isNaN(numBy) && numBy === 1 ? '++' : ` += ${by}`;
  return `for (int ${variable} = ${from}; ${variable} <= ${to}; ${variable}${stepOp})`;
}

function generateRepeatExt(generator: ArduinoGenerator, block: Blockly.Block): string {
  const repeats = generator.valueToCode(block, 'TIMES', Order.ASSIGNMENT) || '0';
  const branch = generator.statementToCode(block, 'DO');
  return `for (int count = 0; count < ${repeats}; count++) {\n${branch}}\n`;
}

function generateWhileUntil(generator: ArduinoGenerator, block: Blockly.Block): string {
  const until = block.getFieldValue('MODE') === 'UNTIL';
  let cond = generator.valueToCode(block, 'BOOL', Order.NONE) || 'false';
  if (until) cond = `!(${cond})`;
  const branch = generator.statementToCode(block, 'DO');
  return `while (${cond}) {\n${branch}}\n`;
}

function generateForLoop(generator: ArduinoGenerator, block: Blockly.Block): string {
  const header = generateForLoopHeader(generator, block);
  const branch = generator.statementToCode(block, 'DO');
  return `${header} {\n${branch}}\n`;
}

function generateFlowStatement(block: Blockly.Block): string {
  return block.getFieldValue('FLOW') === 'CONTINUE' ? 'continue;\n' : 'break;\n';
}

/**
 * Registers loop block code generators for Arduino C/C++.
 */
export function registerLoopBlocks(generator: ArduinoGenerator): void {
  generator.forBlock['controls_repeat_ext'] = (b: Blockly.Block) => generateRepeatExt(generator, b);
  generator.forBlock['controls_whileUntil'] = (b: Blockly.Block) => generateWhileUntil(generator, b);
  generator.forBlock['controls_for'] = (b: Blockly.Block) => generateForLoop(generator, b);
  generator.forBlock['controls_flow_statements'] = (b: Blockly.Block) => generateFlowStatement(b);
}

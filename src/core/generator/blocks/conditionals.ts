import * as Blockly from 'blockly';
import { ArduinoGenerator } from '../arduino-generator';
import { Order } from '../order';

/**
 * Emits code for if and else-if branches of controls_if block.
 */
function generateIfBranches(generator: ArduinoGenerator, block: Blockly.Block): string {
  let code = '';
  let n = 0;
  while (block.getInput(`IF${n}`)) {
    const condition = generator.valueToCode(block, `IF${n}`, Order.NONE) || 'false';
    const branchCode = generator.statementToCode(block, `DO${n}`);
    const prefix = n === 0 ? 'if' : ' else if';
    code += `${prefix} (${condition}) {\n${branchCode}}`;
    n++;
  }
  return code;
}

/**
 * Emits code for the optional else branch of controls_if block.
 */
function generateElseBranch(generator: ArduinoGenerator, block: Blockly.Block): string {
  if (!block.getInput('ELSE')) return '';
  const elseCode = generator.statementToCode(block, 'ELSE');
  return ` else {\n${elseCode}}`;
}

/**
 * Registers conditional block code generators for Arduino C/C++.
 */
export function registerConditionalBlocks(generator: ArduinoGenerator): void {
  generator.forBlock['controls_if'] = (block: Blockly.Block) => {
    const branches = generateIfBranches(generator, block);
    const elseBranch = generateElseBranch(generator, block);
    return `${branches}${elseBranch}\n`;
  };
}

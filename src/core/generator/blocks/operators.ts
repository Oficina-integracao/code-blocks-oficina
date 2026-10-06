import * as Blockly from 'blockly';
import { ArduinoGenerator } from '../arduino-generator';
import { Order } from '../order';

type TupleCode = [string, number];

const ARITHMETIC_OPS: Record<string, [string | null, Order]> = {
  ADD: [' + ', Order.ADDITIVE],
  MINUS: [' - ', Order.ADDITIVE],
  MULTIPLY: [' * ', Order.MULTIPLICATIVE],
  DIVIDE: [' / ', Order.MULTIPLICATIVE],
  POWER: [null, Order.NONE],
};

const COMPARE_OPS: Record<string, [string, Order]> = {
  EQ: ['==', Order.EQUALITY],
  NEQ: ['!=', Order.EQUALITY],
  LT: ['<', Order.RELATIONAL],
  LTE: ['<=', Order.RELATIONAL],
  GT: ['>', Order.RELATIONAL],
  GTE: ['>=', Order.RELATIONAL],
};

function generateArithmetic(gen: ArduinoGenerator, block: Blockly.Block): TupleCode {
  const op = block.getFieldValue('OP') || 'ADD';
  const [symbol, order] = ARITHMETIC_OPS[op] || [' + ', Order.ADDITIVE];
  const a = gen.valueToCode(block, 'A', order) || '0';
  const b = gen.valueToCode(block, 'B', order) || '0';
  if (!symbol) return [`pow(${a}, ${b})`, Order.ATOMIC];
  return [`${a}${symbol}${b}`, order];
}

function generateSingleMath(gen: ArduinoGenerator, block: Blockly.Block): TupleCode {
  const op = block.getFieldValue('OP') || 'NEG';
  if (op === 'NEG') {
    const num = gen.valueToCode(block, 'NUM', Order.UNARY_PREFIX) || '0';
    return [`-${num}`, Order.UNARY_PREFIX];
  }
  const num = gen.valueToCode(block, 'NUM', Order.NONE) || '0';
  const fnName = op === 'ROOT' ? 'sqrt' : op.toLowerCase();
  return [`${fnName}(${num})`, Order.ATOMIC];
}

function generateRound(gen: ArduinoGenerator, block: Blockly.Block): TupleCode {
  const op = block.getFieldValue('OP') || 'ROUND';
  const num = gen.valueToCode(block, 'NUM', Order.NONE) || '0';
  const fn = op === 'ROUNDUP' ? 'ceil' : op === 'ROUNDDOWN' ? 'floor' : 'round';
  return [`${fn}(${num})`, Order.ATOMIC];
}

function generateConstrain(gen: ArduinoGenerator, block: Blockly.Block): TupleCode {
  const x = gen.valueToCode(block, 'VALUE', Order.NONE) || '0';
  const low = gen.valueToCode(block, 'LOW', Order.NONE) || '0';
  const high = gen.valueToCode(block, 'HIGH', Order.NONE) || '100';
  return [`constrain(${x}, ${low}, ${high})`, Order.ATOMIC];
}

function generateRandomInt(gen: ArduinoGenerator, block: Blockly.Block): TupleCode {
  const from = gen.valueToCode(block, 'FROM', Order.NONE) || '0';
  const to = gen.valueToCode(block, 'TO', Order.NONE) || '100';
  return [`random(${from}, ${to} + 1)`, Order.ATOMIC];
}

function generateModulo(gen: ArduinoGenerator, block: Blockly.Block): TupleCode {
  const dividend = gen.valueToCode(block, 'DIVIDEND', Order.MULTIPLICATIVE) || '0';
  const divisor = gen.valueToCode(block, 'DIVISOR', Order.MULTIPLICATIVE) || '1';
  return [`${dividend} % ${divisor}`, Order.MULTIPLICATIVE];
}

function generateComparison(gen: ArduinoGenerator, block: Blockly.Block): TupleCode {
  const op = block.getFieldValue('OP') || 'EQ';
  const [symbol, order] = COMPARE_OPS[op] || ['==', Order.EQUALITY];
  const a = gen.valueToCode(block, 'A', order) || '0';
  const b = gen.valueToCode(block, 'B', order) || '0';
  return [`${a} ${symbol} ${b}`, order];
}

function generateLogicalOp(gen: ArduinoGenerator, block: Blockly.Block): TupleCode {
  const op = block.getFieldValue('OP') || 'AND';
  const isAnd = op === 'AND';
  const symbol = isAnd ? '&&' : '||';
  const order = isAnd ? Order.LOGICAL_AND : Order.LOGICAL_OR;
  const fallback = isAnd ? 'true' : 'false';
  const a = gen.valueToCode(block, 'A', order) || fallback;
  const b = gen.valueToCode(block, 'B', order) || fallback;
  return [`${a} ${symbol} ${b}`, order];
}

function generateLogicalNegate(gen: ArduinoGenerator, block: Blockly.Block): TupleCode {
  const val = gen.valueToCode(block, 'BOOL', Order.UNARY_PREFIX) || 'true';
  return [`!${val}`, Order.UNARY_PREFIX];
}

function generateTernary(gen: ArduinoGenerator, block: Blockly.Block): TupleCode {
  const cond = gen.valueToCode(block, 'IF', Order.CONDITIONAL) || 'false';
  const thenVal = gen.valueToCode(block, 'THEN', Order.CONDITIONAL) || '0';
  const elseVal = gen.valueToCode(block, 'ELSE', Order.CONDITIONAL) || '0';
  return [`(${cond} ? ${thenVal} : ${elseVal})`, Order.CONDITIONAL];
}

/**
 * Registers operator block code generators for Arduino C/C++.
 */
export function registerOperatorBlocks(generator: ArduinoGenerator): void {
  generator.forBlock['math_arithmetic'] = (b: Blockly.Block) => generateArithmetic(generator, b);
  generator.forBlock['math_single'] = (b: Blockly.Block) => generateSingleMath(generator, b);
  generator.forBlock['math_round'] = (b: Blockly.Block) => generateRound(generator, b);
  generator.forBlock['math_constrain'] = (b: Blockly.Block) => generateConstrain(generator, b);
  generator.forBlock['math_random_int'] = (b: Blockly.Block) => generateRandomInt(generator, b);
  generator.forBlock['math_modulo'] = (b: Blockly.Block) => generateModulo(generator, b);
  generator.forBlock['logic_compare'] = (b: Blockly.Block) => generateComparison(generator, b);
  generator.forBlock['logic_operation'] = (b: Blockly.Block) => generateLogicalOp(generator, b);
  generator.forBlock['logic_negate'] = (b: Blockly.Block) => generateLogicalNegate(generator, b);
  generator.forBlock['logic_ternary'] = (b: Blockly.Block) => generateTernary(generator, b);
  generator.forBlock['logic_null'] = () => ['NULL', Order.ATOMIC];
  generator.forBlock['math_number'] = (b: Blockly.Block) => {
    return [String(Number(b.getFieldValue('NUM') || 0)), Order.ATOMIC];
  };
  generator.forBlock['logic_boolean'] = (b: Blockly.Block) => {
    return [b.getFieldValue('BOOL') === 'TRUE' ? 'true' : 'false', Order.ATOMIC];
  };
}

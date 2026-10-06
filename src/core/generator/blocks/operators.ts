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
  if (!symbol) {
    return [`pow(${a}, ${b})`, Order.ATOMIC];
  }
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

/**
 * Registers operator block code generators for Arduino C/C++.
 */
export function registerOperatorBlocks(generator: ArduinoGenerator): void {
  generator.forBlock['math_arithmetic'] = (b: Blockly.Block) => generateArithmetic(generator, b);
  generator.forBlock['math_single'] = (b: Blockly.Block) => generateSingleMath(generator, b);
  generator.forBlock['math_modulo'] = (b: Blockly.Block) => generateModulo(generator, b);
  generator.forBlock['logic_compare'] = (b: Blockly.Block) => generateComparison(generator, b);
  generator.forBlock['logic_operation'] = (b: Blockly.Block) => generateLogicalOp(generator, b);
  generator.forBlock['logic_negate'] = (b: Blockly.Block) => generateLogicalNegate(generator, b);
  generator.forBlock['logic_boolean'] = (b: Blockly.Block) => {
    return [b.getFieldValue('BOOL') === 'TRUE' ? 'true' : 'false', Order.ATOMIC];
  };
}

import type * as Blockly from 'blockly';

/**
 * Result of Arduino C/C++ code generation.
 * Pure domain representation without UI or infrastructure coupling.
 */
export interface ArduinoCodeResult {
  code: string;           // Complete assembled Arduino C/C++ source code
  definitions: string[];  // Global variable declarations, includes, and pins
  setupCode: string[];    // Instructions placed inside void setup()
  loopCode: string[];     // Instructions placed inside void loop()
  isValid: boolean;       // Indicates if the block tree was syntactically complete
  errors?: string[];      // Diagnostic messages if blocks are incomplete
}

/**
 * Contract for Arduino generator implementation.
 */
export interface ArduinoGeneratorContract {
  /**
   * Generates Arduino C/C++ code from a Blockly Workspace instance.
   * Pure function: Zero side-effects, zero HTTP/DB access, deterministic output.
   */
  generateCode(workspace: Blockly.Workspace): ArduinoCodeResult;
}

# Arduino C/C++ Generator Contract

**Feature**: [spec.md](file:///home/lucas/code-blocks-arduino/specs/001-code-blocks-arduino/spec.md) | **Date**: 2026-09-19

Defines the interface and behavior of the pure domain code generator responsible for converting Blockly structures into readable, deterministic Arduino C/C++ code.

---

## 1. Domain Module Interface

```typescript
export interface ArduinoCodeResult {
  code: string;           // Complete assembled Arduino C/C++ source code
  definitions: string[];  // Global variable declarations, includes, and pins
  setupCode: string[];    // Instructions placed inside void setup()
  loopCode: string[];     // Instructions placed inside void loop()
  isValid: boolean;       // Indicates if the block tree was syntactically complete
  errors?: string[];      // Diagnostic messages if blocks are incomplete
}

export interface ArduinoGeneratorContract {
  /**
   * Generates Arduino C/C++ code from a Blockly Workspace instance or serialized JSON.
   * Pure function: Zero side-effects, zero HTTP/DB access, deterministic output.
   */
  generateCode(workspace: Blockly.Workspace): ArduinoCodeResult;
}
```

---

## 2. Standard Output Skeleton

Every generated Arduino program adheres to the canonical Arduino runtime structure:

```cpp
// --- Definições e Variáveis Globais ---
int idade = 0;

void setup() {
  // Inicializações (e.g. Serial.begin, pinMode)
}

void loop() {
  // --- Lógica Principal do Algoritmo ---
  if (idade >= 18) {
    // bloco se
  } else {
    // bloco senao
  }
}
```

---

## 3. Supported Block Concept Mappings

| Categoria | Bloco Visual | Representação C/C++ Gerada |
| :--- | :--- | :--- |
| **Variáveis** | Criar variável `x` com valor `10` | `int x = 10;` ou `x = 10;` |
| **Operadores** | `a + b`, `x * 2`, `a == b`, `x > 10` | `(a + b)`, `(x * 2)`, `(a == b)`, `(x > 10)` |
| **Condicionais** | `SE [condição] FAÇA [bloco] SENÃO [bloco]` | `if (condição) { ... } else { ... }` |
| **Repetições** | `REPETIR [N] VEZES [bloco]` | `for (int i = 0; i < N; i++) { ... }` |
| **Repetições** | `ENQUANTO [condição] FAÇA [bloco]` | `while (condição) { ... }` |
| **Sequência** | Bloco A conectado acima do Bloco B | Linha A seguida deterministicamente da Linha B |

---

## 4. Invariants & Determinism

- **Zero Framework Dependency:** The generator must run in Node.js test runners (Vitest) without DOM dependencies.
- **Deterministic Emission:** Given identical block IDs, coordinates, and configurations, the output string must match byte-for-byte.
- **Graceful Partial Handling:** Disconnected or orphan blocks on the canvas are ignored or isolated so they do not produce invalid C/C++ compilation errors in `loop()`.

# Projects API Contract

**Feature**: [spec.md](file:///home/lucas/code-blocks-arduino/specs/001-code-blocks-arduino/spec.md) | **Date**: 2026-09-19

Defines the REST / Server Action interface for student project persistence.

---

## 1. List Projects

- **Method / Route**: `GET /api/projects`
- **Headers**: `Cookie: sb-session=...` (authenticated user)
- **Response (200 OK)**:
  ```json
  {
    "projects": [
      {
        "id": "7b03b865-9118-406a-a63e-f14d18725902",
        "title": "Pisca LED Simples",
        "created_at": "2026-09-19T10:00:00Z",
        "updated_at": "2026-09-19T10:30:00Z"
      }
    ]
  }
  ```
- **Error (401 Unauthorized)**:
  ```json
  { "error": "Unauthorized" }
  ```

---

## 2. Get Project by ID

- **Method / Route**: `GET /api/projects/:id`
- **Response (200 OK)**:
  ```json
  {
    "id": "7b03b865-9118-406a-a63e-f14d18725902",
    "title": "Pisca LED Simples",
    "workspace_state": {
      "blocks": { "languageVersion": 0, "blocks": [...] }
    },
    "generated_code": "void setup() {\n  pinMode(13, OUTPUT);\n}\nvoid loop() {\n  digitalWrite(13, HIGH);\n  delay(1000);\n  digitalWrite(13, LOW);\n  delay(1000);\n}",
    "created_at": "2026-09-19T10:00:00Z",
    "updated_at": "2026-09-19T10:30:00Z"
  }
  ```
- **Error (404 Not Found / 403 Forbidden)**:
  ```json
  { "error": "Project not found or access denied" }
  ```

---

## 3. Create New Project

- **Method / Route**: `POST /api/projects`
- **Request Body**:
  ```json
  {
    "title": "Novo Algoritmo com Condicional",
    "workspace_state": { "blocks": { "languageVersion": 0, "blocks": [...] } },
    "generated_code": "void setup() {}\nvoid loop() {}"
  }
  ```
- **Validation**:
  - `title`: string, 1 to 100 characters, non-empty after trim.
  - `workspace_state`: valid JSON object.
- **Response (201 Created)**:
  ```json
  {
    "id": "a50df882-9989-425d-bb85-a764d85ca663",
    "title": "Novo Algoritmo com Condicional",
    "created_at": "2026-09-19T11:00:00Z"
  }
  ```
- **Error (400 Bad Request)**:
  ```json
  {
    "error": "Validation failed",
    "details": [{ "field": "title", "message": "Title is required" }]
  }
  ```

---

## 4. Update Project

- **Method / Route**: `PUT /api/projects/:id`
- **Request Body**:
  ```json
  {
    "title": "Título Atualizado",
    "workspace_state": { "blocks": { "languageVersion": 0, "blocks": [...] } },
    "generated_code": "..."
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "id": "a50df882-9989-425d-bb85-a764d85ca663",
    "updated_at": "2026-09-19T11:15:00Z"
  }
  ```

---

## 5. Delete Project

- **Method / Route**: `DELETE /api/projects/:id`
- **Response (200 OK)**:
  ```json
  { "success": true, "message": "Project deleted successfully" }
  ```
- **Error (404 / 403)**:
  ```json
  { "error": "Project not found or access denied" }
  ```

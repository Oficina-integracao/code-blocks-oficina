# Admin Management API Contract

**Feature**: [spec.md](file:///home/lucas/code-blocks-arduino/specs/001-code-blocks-arduino/spec.md) | **Date**: 2026-09-19

Defines the administrative interface for managing authorized students on the platform.

---

## 1. List Students

- **Method / Route**: `GET /api/admin/students`
- **Authorization**: Caller MUST have role `ADMIN` in `profiles`.
- **Response (200 OK)**:
  ```json
  {
    "students": [
      {
        "id": "2e0fd291-a67b-40fa-8dc4-bb5013063f11",
        "email": "aluno1@utfpr.edu.br",
        "full_name": "Aluno Exemplo UTFPR",
        "role": "ALUNO",
        "projects_count": 3,
        "created_at": "2026-09-19T08:00:00Z"
      }
    ]
  }
  ```
- **Error (403 Forbidden)**:
  ```json
  { "error": "Access denied: Administrator role required" }
  ```

---

## 2. Pre-authorize / Add Student

- **Method / Route**: `POST /api/admin/students`
- **Authorization**: Caller MUST have role `ADMIN`.
- **Request Body**:
  ```json
  {
    "email": "novo.aluno@utfpr.edu.br",
    "full_name": "Novo Aluno"
  }
  ```
- **Validation**:
  - `email`: valid e-mail format.
  - `full_name`: optional string, trimmed.
- **Response (201 Created)**:
  ```json
  {
    "id": "e402bca9-598e-4a0b-9689-d9f21fa940e4",
    "email": "novo.aluno@utfpr.edu.br",
    "role": "ALUNO",
    "created_at": "2026-09-19T11:40:00Z"
  }
  ```

---

## 3. Revoke / Remove Student

- **Method / Route**: `DELETE /api/admin/students/:id`
- **Authorization**: Caller MUST have role `ADMIN`.
- **Response (200 OK)**:
  ```json
  { "success": true, "message": "Student registration removed successfully" }
  ```
- **Error (404 Not Found)**:
  ```json
  { "error": "Student not found" }
  ```

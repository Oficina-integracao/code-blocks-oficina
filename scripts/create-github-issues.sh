#!/usr/bin/env bash
# ==============================================================================
# Script para conversão de tarefas (tasks.md) em GitHub Issues
# Repositório: git@github.com:lucaszsilva1/code-blocks-arduino.git
# ==============================================================================

set -e

REPO="lucaszsilva1/code-blocks-arduino"

echo "=== Code Blocks Arduino: Sincronização de Issues com GitHub ==="
echo "Repositório alvo: $REPO"

# 1. Verificar autenticação no gh CLI
if ! gh auth status &>/dev/null; then
    echo "⚠️  Autenticação do GitHub CLI necessária ou token expirado."
    echo "Execute: gh auth login -h github.com"
    exit 1
fi

# 2. Obter issues já existentes para deduplicação
echo "Buscando issues existentes no repositório..."
EXISTING_ISSUES=$(gh issue list --repo "$REPO" --limit 200 --json title --jq '.[].title' 2>/dev/null || echo "")

create_issue_if_missing() {
    local task_id="$1"
    local title="$2"
    local label="$3"
    local body="$4"

    if echo "$EXISTING_ISSUES" | grep -q "\b$task_id\b"; then
        echo "⏭️  $task_id já possui issue cadastrada, ignorando."
    else
        echo "🚀 Criando issue para $task_id: $title"
        gh issue create \
            --repo "$REPO" \
            --title "$task_id: $title" \
            --label "$label" \
            --body "$body"
    fi
}

echo "Garantindo labels no repositório..."
gh label create "setup" --color "0e8a16" --description "Infraestrutura inicial" --repo "$REPO" --force 2>/dev/null || true
gh label create "foundational" --color "fbca04" --description "Pré-requisito bloqueante" --repo "$REPO" --force 2>/dev/null || true
gh label create "epic:workspace" --color "1d76db" --description "P1: Workspace e Gerador C/C++" --repo "$REPO" --force 2>/dev/null || true
gh label create "epic:projects" --color "5319e7" --description "P2: Auth e Persistência de Projetos" --repo "$REPO" --force 2>/dev/null || true
gh label create "epic:admin" --color "d93f0b" --description "P3: Gestão de Alunos pelo Administrador" --repo "$REPO" --force 2>/dev/null || true
gh label create "polish" --color "c5def5" --description "Polimento e DoD" --repo "$REPO" --force 2>/dev/null || true

# ==============================================================================
# Fase 1: Setup
# ==============================================================================
create_issue_if_missing "T001" "Initialize Next.js 14 project with TypeScript, Tailwind CSS, and App Router configuration" "setup" \
"### Descrição
Inicializar o projeto Next.js 14 monorepo com TypeScript em modo estrito, Tailwind CSS e App Router.

**Arquivos:**
- \`package.json\`
- \`tsconfig.json\`
- \`tailwind.config.ts\`
- \`next.config.js\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

create_issue_if_missing "T002" "Configure Vitest test runner, coverage reporting, and React Testing Library" "setup" \
"### Descrição
Configurar o executor de testes Vitest com relatório de cobertura (v8) e React Testing Library para execução em TDD.

**Arquivos:**
- \`vitest.config.ts\`
- \`tests/setup.ts\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

create_issue_if_missing "T003" "Configure ESLint and Prettier rules enforcing strict TypeScript and line limit warnings" "setup" \
"### Descrição
Configurar ESLint e Prettier para garantir TypeScript sem \`any\` não justificado e avisos para os limites de linhas definidos na Constituição.

**Arquivos:**
- \`.eslintrc.json\`
- \`.prettierrc\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

create_issue_if_missing "T004" "Configure GitHub Actions CI workflow" "setup" \
"### Descrição
Configurar a pipeline do GitHub Actions para validar Lint, Typecheck, Testes com Cobertura e Build a cada Push/PR.

**Arquivos:**
- \`.github/workflows/ci.yml\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

# ==============================================================================
# Fase 2: Foundational
# ==============================================================================
create_issue_if_missing "T005" "Setup Supabase client infrastructure for browser and server cookies" "foundational" \
"### Descrição
Configurar os clientes Supabase para browser, server (cookies HttpOnly) e middleware de proteção de rotas.

**Arquivos:**
- \`src/lib/supabase/client.ts\`
- \`src/lib/supabase/server.ts\`
- \`src/lib/supabase/middleware.ts\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

create_issue_if_missing "T006" "Define core domain entity types (UserProfile, Project, WorkspaceState)" "foundational" \
"### Descrição
Definir interfaces de domínio puro para UserProfile, Project e WorkspaceState com constraints estritas:
- \`role\`: \`['ALUNO', 'ADMIN']\`
- \`title\`: 1 a 100 caracteres após trim
- \`workspace_state\`: JSON válido

**Arquivos:**
- \`src/core/domain/entities/models.ts\`

**Referência:** \`specs/001-code-blocks-arduino/data-model.md\`"

create_issue_if_missing "T007" "Define domain error classes" "foundational" \
"### Descrição
Definir classes de erro de domínio (NotFoundError, UnauthorizedError, ValidationError, GeneratorError).

**Arquivos:**
- \`src/core/domain/errors/domain-errors.ts\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

create_issue_if_missing "T008" "Create PostgreSQL database migration with tables profiles and projects and RLS policies" "foundational" \
"### Descrição
Criar migration inicial do PostgreSQL para as tabelas \`profiles\` e \`projects\` com Row Level Security (RLS) habilitado e políticas de isolamento estrito.

**Arquivos:**
- \`supabase/migrations/20260919000000_initial_schema.sql\`

**Referência:** \`specs/001-code-blocks-arduino/data-model.md\`"

create_issue_if_missing "T009" "Create Zod boundary validation schemas" "foundational" \
"### Descrição
Implementar schemas Zod para validação estrutural na borda da aplicação (auth, payloads de projetos e operações de admin).

**Arquivos:**
- \`src/lib/validation/schemas.ts\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

create_issue_if_missing "T010" "Implement base UI primitives (Button, Modal, Input, Badge)" "foundational" \
"### Descrição
Implementar componentes visuais primitivos reutilizáveis respeitando o limite de complexidade de 100 linhas.

**Arquivos:**
- \`src/components/ui/button.tsx\`
- \`src/components/ui/modal.tsx\`
- \`src/components/ui/input.tsx\`
- \`src/components/ui/badge.tsx\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

# ==============================================================================
# Fase 3: User Story 1 (P1 - MVP: Workspace & Tradução C/C++)
# ==============================================================================
create_issue_if_missing "T011" "Unit test for foundational variable blocks code generation" "epic:workspace" \
"### Descrição (TDD)
Escrever testes unitários para a geração de código de declaração, atribuição e leitura de variáveis antes da implementação.

**Arquivos:**
- \`tests/unit/generator/variables.test.ts\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

create_issue_if_missing "T012" "Unit test for arithmetic and logical operator blocks code generation" "epic:workspace" \
"### Descrição (TDD)
Escrever testes unitários para operadores matemáticos (+, -, *, /) e lógicos (>, <, ==, !=, &&, ||) em C/C++.

**Arquivos:**
- \`tests/unit/generator/operators.test.ts\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

create_issue_if_missing "T013" "Unit test for conditional (if/else) blocks code generation" "epic:workspace" \
"### Descrição (TDD)
Escrever testes unitários para estruturas de controle Se e Se-Senão gerando \`if (...) { ... } else { ... }\`.

**Arquivos:**
- \`tests/unit/generator/conditionals.test.ts\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

create_issue_if_missing "T014" "Unit test for repetition loop blocks code generation" "epic:workspace" \
"### Descrição (TDD)
Escrever testes unitários para laços de repetição (repetir N vezes, enquanto) gerando loops \`for\` e \`while\` compatíveis com Arduino.

**Arquivos:**
- \`tests/unit/generator/loops.test.ts\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

create_issue_if_missing "T015" "Unit test for full ArduinoGenerator integration" "epic:workspace" \
"### Descrição (TDD)
Escrever testes unitários integrados para o esqueleto do gerador Arduino (\`setup\` e \`loop\`), definições globais e tratamento de blocos órfãos.

**Arquivos:**
- \`tests/unit/generator/arduino-generator.test.ts\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

create_issue_if_missing "T016" "Implement custom Blockly variable block definitions and C/C++ generators" "epic:workspace" \
"### Descrição
Implementar blocos customizados de variáveis e seus respectivos emissores de código C/C++ determinístico.

**Arquivos:**
- \`src/core/generator/blocks/variables.ts\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

create_issue_if_missing "T017" "Implement arithmetic and logical operator block definitions and C/C++ generators" "epic:workspace" \
"### Descrição
Implementar blocos de operadores aritméticos e lógicos com emissão formatada em C/C++.

**Arquivos:**
- \`src/core/generator/blocks/operators.ts\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

create_issue_if_missing "T018" "Implement conditional (if / if-else) block definitions and C/C++ generators" "epic:workspace" \
"### Descrição
Implementar blocos condicionais Se e Se-Senão com encaixe estruturado e tradução C/C++.

**Arquivos:**
- \`src/core/generator/blocks/conditionals.ts\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

create_issue_if_missing "T019" "Implement repetition loop block definitions and C/C++ generators" "epic:workspace" \
"### Descrição
Implementar blocos de repetição por contagem e condição com emissão de loops \`for\` / \`while\`.

**Arquivos:**
- \`src/core/generator/blocks/loops.ts\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

create_issue_if_missing "T020" "Implement core ArduinoGenerator class extending Blockly.Generator" "epic:workspace" \
"### Descrição
Implementar a classe central de geração ArduinoGenerator estendendo \`Blockly.Generator\` e orquestrando \`setup()\` e \`loop()\`.

**Arquivos:**
- \`src/core/generator/arduino-generator.ts\`

**Referência:** \`specs/001-code-blocks-arduino/contracts/generator.contract.md\`"

create_issue_if_missing "T021" "Define Blockly toolbox configuration containing fundamental algorithm categories" "epic:workspace" \
"### Descrição
Configurar o menu lateral (Toolbox) com as categorias de Sequência, Variáveis, Operadores, Condicionais e Laços.

**Arquivos:**
- \`src/core/generator/toolbox.ts\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

create_issue_if_missing "T022" "Implement dynamic client-side Blockly workspace container component" "epic:workspace" \
"### Descrição
Implementar componente Client Component com carregamento dinâmico (\`ssr: false\`) e injeção do SVG do Blockly com ciclo de vida limpo.

**Arquivos:**
- \`src/components/workspace/blockly-workspace.tsx\`

**Referência:** \`specs/001-code-blocks-arduino/research.md\`"

create_issue_if_missing "T023" "Implement formatted C/C++ read-only code viewer panel" "epic:workspace" \
"### Descrição
Implementar painel lateral de exibição do código C/C++ formatado com botão de cópia e realce de sintaxe.

**Arquivos:**
- \`src/components/workspace/code-viewer.tsx\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

create_issue_if_missing "T024" "Implement Workspace page integrating Blockly canvas, code viewer, and real-time generation listener" "epic:workspace" \
"### Descrição
Integrar o canvas Blockly, o visualizador de código e o ouvinte de atualização em tempo real na página do Workspace.

**Arquivos:**
- \`src/app/workspace/page.tsx\`

**Critério de Sucesso:** Atualização do código em menos de 1 segundo.

**Referência:** \`specs/001-code-blocks-arduino/spec.md\`"

# ==============================================================================
# Fase 4: User Story 2 (P2 - Auth & Persistência)
# ==============================================================================
create_issue_if_missing "T025" "Contract and integration test for Google Auth login and callback flow" "epic:projects" \
"### Descrição (TDD)
Escrever testes de contrato e integração para a rota de login Google e callback de sessão com cookies.

**Arquivos:**
- \`tests/integration/api/auth.test.ts\`

**Referência:** \`specs/001-code-blocks-arduino/contracts/auth.contract.md\`"

create_issue_if_missing "T026" "Contract and integration test for Projects CRUD API endpoints with RLS ownership rules" "epic:projects" \
"### Descrição (TDD)
Testar operações de CRUD de projetos e isolamento estrito de dados entre alunos garantido por RLS.

**Arquivos:**
- \`tests/integration/api/projects.test.ts\`

**Referência:** \`specs/001-code-blocks-arduino/contracts/projects.contract.md\`"

create_issue_if_missing "T027" "Unit test for ProjectRepository data operations and error handling" "epic:projects" \
"### Descrição (TDD)
Testar as operações do repositório de projetos e mapeamento de erros de domínio.

**Arquivos:**
- \`tests/unit/domain/project-repository.test.ts\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

create_issue_if_missing "T028" "Implement ProjectRepository for Supabase CRUD operations enforcing owner_id = auth.uid()" "epic:projects" \
"### Descrição
Implementar repositório de projetos interagindo com o Supabase respeitando o isolamento do proprietário.

**Arquivos:**
- \`src/lib/repositories/project-repository.ts\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

create_issue_if_missing "T029" "Implement Google OAuth sign-in screen and OAuth callback route handler" "epic:projects" \
"### Descrição
Implementar tela de login com Google e handler de callback em \`src/app/api/auth/callback/route.ts\`.

**Arquivos:**
- \`src/app/(auth)/login/page.tsx\`
- \`src/app/api/auth/callback/route.ts\`

**Referência:** \`specs/001-code-blocks-arduino/contracts/auth.contract.md\`"

create_issue_if_missing "T030" "Implement Projects API route handlers for list and create (GET, POST /api/projects)" "epic:projects" \
"### Descrição
Implementar rotas para listar e criar projetos com validação Zod e autorização.

**Arquivos:**
- \`src/app/api/projects/route.ts\`

**Referência:** \`specs/001-code-blocks-arduino/contracts/projects.contract.md\`"

create_issue_if_missing "T031" "Implement Projects API route handlers for get, update, and delete" "epic:projects" \
"### Descrição
Implementar rotas para consulta, atualização e exclusão de projeto por ID com validação de ownership.

**Arquivos:**
- \`src/app/api/projects/[id]/route.ts\`

**Referência:** \`specs/001-code-blocks-arduino/contracts/projects.contract.md\`"

create_issue_if_missing "T032" "Implement project card and save project modal dialog components" "epic:projects" \
"### Descrição
Implementar componentes de card de projeto e modal de confirmação de salvamento.

**Arquivos:**
- \`src/components/projects/project-card.tsx\`
- \`src/components/projects/save-project-modal.tsx\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

create_issue_if_missing "T033" "Implement Student Projects Dashboard page with project list and delete confirmation" "epic:projects" \
"### Descrição
Implementar página de gerenciamento de projetos do aluno com listagem, botão de novo projeto e exclusão.

**Arquivos:**
- \`src/app/(dashboard)/projects/page.tsx\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

create_issue_if_missing "T034" "Integrate project persistence toolbar in Workspace editor (/workspace/[id])" "epic:projects" \
"### Descrição
Integrar barra de ferramentas do Workspace para salvar, renomear e recarregar projetos com fidelidade total.

**Arquivos:**
- \`src/components/workspace/workspace-toolbar.tsx\`
- \`src/app/workspace/[id]/page.tsx\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

# ==============================================================================
# Fase 5: User Story 3 (P3 - Painel de Administração)
# ==============================================================================
create_issue_if_missing "T035" "Contract and integration test for Admin student management API endpoints" "epic:admin" \
"### Descrição (TDD)
Escrever testes de contrato e integração para rotas de gestão de alunos garantindo bloqueio para não-administradores.

**Arquivos:**
- \`tests/integration/api/admin.test.ts\`

**Referência:** \`specs/001-code-blocks-arduino/contracts/admin.contract.md\`"

create_issue_if_missing "T036" "Unit test for ProfileRepository admin lookup and role updates" "epic:admin" \
"### Descrição (TDD)
Testar operações de busca e alteração de perfis pelo repositório.

**Arquivos:**
- \`tests/unit/domain/profile-repository.test.ts\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

create_issue_if_missing "T037" "Implement ProfileRepository for querying and updating user profiles and roles" "epic:admin" \
"### Descrição
Implementar ProfileRepository para consultas de perfis e verificação de privilégios de administrador.

**Arquivos:**
- \`src/lib/repositories/profile-repository.ts\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

create_issue_if_missing "T038" "Implement Admin Students API route handlers (GET, POST, DELETE)" "epic:admin" \
"### Descrição
Implementar rotas administrativas para listagem, pré-cadastro e remoção de alunos com verificação de role ADMIN.

**Arquivos:**
- \`src/app/api/admin/students/route.ts\`
- \`src/app/api/admin/students/[id]/route.ts\`

**Referência:** \`specs/001-code-blocks-arduino/contracts/admin.contract.md\`"

create_issue_if_missing "T039" "Implement student roster table and add student modal dialog" "epic:admin" \
"### Descrição
Implementar tabela de listagem de alunos e diálogo de pré-autorização de novo e-mail.

**Arquivos:**
- \`src/components/admin/student-table.tsx\`
- \`src/components/admin/add-student-modal.tsx\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

create_issue_if_missing "T040" "Implement Admin Dashboard page with server-side role-guard" "epic:admin" \
"### Descrição
Implementar página \`/admin\` com guarda de permissão no servidor redirecionando usuários não autorizados.

**Arquivos:**
- \`src/app/admin/page.tsx\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

# ==============================================================================
# Fase 6: Polish & Cross-Cutting Concerns
# ==============================================================================
create_issue_if_missing "T041" "Implement responsive navigation header with user profile menu" "polish" \
"### Descrição
Implementar header de navegação global com menu de perfil, status de autenticação e links condicionais por papel.

**Arquivos:**
- \`src/components/layout/header.tsx\`
- \`src/app/layout.tsx\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

create_issue_if_missing "T042" "Create educational landing page highlighting ELLP/UTFPR academic context" "polish" \
"### Descrição
Criar landing page pública apresentando o projeto de extensão ELLP, contexto da disciplina e chamada para login.

**Arquivos:**
- \`src/app/page.tsx\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

create_issue_if_missing "T043" "Create seed script and Supabase local configuration for initial admin account" "polish" \
"### Descrição
Criar script de seed SQL para carregar o perfil do professor/administrador inicial no Supabase.

**Arquivos:**
- \`supabase/seed.sql\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

create_issue_if_missing "T044" "Run all end-to-end validation scenarios per quickstart.md" "polish" \
"### Descrição
Executar e validar manualmente ou via testes todos os cenários fim a fim descritos no guia de quickstart.

**Arquivos:**
- \`specs/001-code-blocks-arduino/quickstart.md\`

**Referência:** \`specs/001-code-blocks-arduino/quickstart.md\`"

create_issue_if_missing "T045" "Execute full static analysis, typecheck, and test suite to verify 100% CI pass" "polish" \
"### Descrição
Garantir que a pipeline de CI local e remota passe integralmente (Lint, Typecheck, Testes com Cobertura e Build) atendendo à Definition of Done.

**Arquivos:**
- \`src/\`

**Referência:** \`specs/001-code-blocks-arduino/tasks.md\`"

echo "=== Sincronização de Tarefas para Issues concluída! ==="

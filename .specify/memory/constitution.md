<!--
SYNC IMPACT REPORT
==================
Version Change: 1.0.0 -> 1.1.0
Type: MINOR (Expanded Guidance, Registered Decisions & Complexity Bounds)

Sections Updated:
- AI Agent Protocol & Operational Boundaries: Added Complexity Thresholds table and full Anti-Patterns checklist.
- Decision & Hurdle Log: Embedded official registered project decisions table (2026-09).
- Architecture & Stack Context: Added specific line count bounds and operational rules.
- Governance: Added Golden Rule & Human Escalation aphorism ("O agente sugere. O código implementa. O teste comprova. O humano decide.").

Follow-up TODOs:
- None.
-->

# Code Blocks Arduino Constitution

> **Oficina de Integração 2 — ES47C/IF66K**  
> **Projeto de extensão ELLP — Ensino Lúdico de Lógica e Programação — UTFPR**

Plataforma educacional desenvolvida para a disciplina de Oficina de Integração 2 e de apoio ao projeto de extensão ELLP (Ensino Lúdico de Lógica e Programação). O sistema facilita a transição de alunos iniciantes da lógica visual para a sintaxe de linguagens baseadas em texto, permitindo a construção de algoritmos via blocos visuais e realizando a tradução simultânea para código Arduino (C/C++).

- **Público & Perfis:** Administrador (gestão e controle de alunos) e Aluno (Workspace individual, edição, tradução e persistência de projetos).
- **Stack Base:** Next.js (TypeScript monorepo), Tailwind CSS, Google Blockly, Supabase (PostgreSQL, Auth Google, RLS), Vercel e GitHub Actions.

## Core Principles

### I. Simplicity First & Minimal System
- O desenvolvimento DEVE priorizar a menor solução viável que resolva o problema com clareza e robustez.
- Abstrações prematuras, dependências desnecessárias e infraestrutura não requerida pelo requisito imediato são terminantemente proibidas.
- **Golden Rule:** Construa o menor sistema que resolve o problema corretamente, prove que funciona, mantenha a arquitetura clara e adicione complexidade apenas quando estritamente necessário.

### II. Test-First & Incremental Development (TDD)
- O ciclo Red-Green-Refactor é obrigatório: primeiro escreve-se o teste que falha (Red), implementa-se o mínimo necessário para passar (Green), e então refatora-se mantendo o teste verde (Refactor).
- Mudanças de código DEVEM ser incrementais e acompanhadas de testes unitários e de integração correspondentes.
- A suíte de testes e o pipeline de CI DEVEM manter ou aumentar a cobertura de código existente; reduções de cobertura impedem o merge.

### III. Strict Dependency Direction & Clean Architecture
- O fluxo de dependências no código DEVE respeitar estritamente a hierarquia:
  `UI -> Application/API -> Domain -> Infrastructure`.
- **Domain:** Contém exclusivamente regras de negócio e tipagens puras. Zero dependência de frameworks, bibliotecas de UI, HTTP ou drivers externos.
- **Infrastructure / Repository:** Responsável apenas por persistência (Supabase) e integrações externas. Zero regras de negócio embutidas em queries ou clients.
- **Generator:** Responsável exclusivamente por traduzir o Workspace do Blockly em código C/C++ para Arduino. O generator NÃO DEVE consultar banco, acessar sessão, realizar chamadas HTTP ou manipular componentes de UI.

### IV. Validation Boundary & Defense in Depth
- Dados externos nunca são confiáveis. Todas as entradas externas DEVEM ser validadas estruturalmente na fronteira (API/UI) antes de atingir o núcleo da aplicação.
- A validação de negócio e garantia de integridade de domínio OCORRE obrigatoriamente no Domínio.
- TypeScript DEVE ser utilizado em modo estrito em todo o monorepo para prevenir inconsistências e mitigar alucinações de código. O uso de `any` sem justificativa é proibido.

### V. Server-Side Security & Data Isolation
- Autenticação e autorização DEVEM ser validadas no servidor. O login é obrigatório e gerenciado exclusivamente via autenticação Google no Supabase.
- A proteção de dados e isolamento entre alunos e administradores DEVE ser assegurada nativamente no banco de dados via Row Level Security (RLS). Nunca utilizar a UI como única barreira de segurança.
- É estritamente proibido expor service roles, tokens sensíveis, chaves privadas, stack traces ou logs de depuração ao cliente ou ao versionamento.

### VI. Vertical Slice Architecture & Traceability
- A organização do trabalho segue o modelo de Divisão Vertical (por Épicos), no qual cada membro é responsável por entregar uma funcionalidade de ponta a ponta (UI, Regra de Negócio, Banco de Dados e Testes).
- A autoria individual do código-fonte DEVE ser clara, auditável e verificável no histórico de commits e nas issues do GitHub, atendendo aos requisitos de avaliação acadêmica.

## Git, CI/CD & Definition of Done (DoD)

### Git Flow & Commits
- Commits DEVEM ser pequenos, atômicos e semânticos seguindo o padrão Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `ci:`, `docs:`).
- Padrão de branches: `feature/issue-N-descricao`, `fix/issue-N-descricao`, `test/issue-N-descricao`, `refactor/issue-N-descricao`. A branch `main` DEVE permanecer sempre estável.

### CI/CD Pipeline
- O pipeline no GitHub Actions e Vercel (Lint -> Typecheck -> Test -> Build) DEVE ser 100% verde.
- O CI é uma barreira de proteção contra código quebrado; nenhum bypass de checagens é permitido.

### Definition of Done (DoD)
Uma tarefa ou funcionalidade só é considerada finalizada quando atender integralmente ao checklist:
- [ ] Critérios de aceite foram integralmente atendidos.
- [ ] Testes foram escritos/atualizados e estão passando.
- [ ] Cobertura de testes não regrediu.
- [ ] Arquitetura, fluxo de dependência e regras de segurança (RLS) foram estritamente respeitadas.
- [ ] Nenhuma complexidade não justificada foi introduzida.
- [ ] Limites de complexidade por arquivo foram respeitados.
- [ ] Nenhum código de debug, comentário `TODO` desnecessário ou secret foi comitado.
- [ ] Commit e Pull Request associados à respectiva Issue do GitHub.
- [ ] CI 100% verde no GitHub Actions.

## AI Agent Protocol & Operational Boundaries

O Agente atua como *Pair Programmer*, *Reviewer* e *Researcher*. Antes de alterar qualquer arquivo de código, o Agente **DEVE** seguir o ciclo **U-I-P-I-T-R**:
1. **Understand:** Compreender o contexto, requisitos e restrições da tarefa.
2. **Inspect:** Ler código, testes, documentação e padrões de arquitetura existentes.
3. **Plan:** Projetar a menor alteração possível que resolva o problema de forma robusta.
4. **Implement:** Escrever o código aderente à tipagem estrita e convenções do repositório.
5. **Test:** Executar e atualizar testes, lint e tipagem. Reportar falhas honestamente sem mascará-las.
6. **Review:** Garantir que não houve scope creep, acoplamento indevido ou quebra arquitetural.

### Limites Indicativos de Complexidade

| Artefato | Limite Indicativo |
| :--- | :--- |
| Componente React | ~100 linhas |
| Service / Caso de Uso | ~150 linhas |
| Route Handler | ~60 linhas |
| Função | ~20 linhas |

*Quando um limite for ultrapassado: o agente identifica, explica o motivo, propõe refatoração pequena e aguarda a decisão do desenvolvedor humano.*

### Anti-Patterns Estritos (O Agente NÃO DEVE)
- ❌ Reproduzir toda a linguagem C/C++ em Blockly.
- ❌ Criar blocos avançados (classes, herança, templates, ponteiros) antes dos fundamentos.
- ❌ Colocar regras de negócio ou chamadas de banco nos componentes visuais.
- ❌ Transformar toda a aplicação em Client Component desnecessariamente.
- ❌ Gerar código C/C++ diretamente na camada de UI (sem passar pelo generator).
- ❌ Duplicar o estado do Blockly em estados paralelos redundantes.
- ❌ Confiar em autorização enviada pelo frontend ou ignorar RLS.
- ❌ Expor chaves Service Role ou secrets no cliente/browser.
- ❌ Adicionar bibliotecas ou dependências de terceiros sem aprovação prévia.
- ❌ Criar microsserviços ou serviços externos independentes sem justificativa comprovada.
- ❌ Adicionar funcionalidades sem Issue associada no GitHub.
- ❌ Esconder testes falhos ou desativar checagens de Lint/CI.
- ❌ Utilizar `any` sem justificativa formal.

### Escalation Protocol (Parar e Perguntar ao Humano)
O Agente DEVE parar imediatamente e solicitar decisão explícita do desenvolvedor ao encontrar:
- Conflitos arquiteturais ou múltiplas abordagens válidas com impacto estrutural.
- Decisões sensíveis de segurança, alterações de regras RLS ou migrações de banco destrutivas.
- Regras de negócio ambíguas ou implementações que entrem em contradição com esta Constituição.

## Decision & Hurdle Log

### Decisões Registradas

| Data | Decisão | Motivo |
| :--- | :--- | :--- |
| 2026-09 | Projeto definido como #Code Blocks Arduino | Tema escolhido para a Oficina de Integração 2 |
| 2026-09 | Google Blockly como motor visual | Permitir programação visual por blocos intuitiva |
| 2026-09 | C/C++ para Arduino como linguagem de destino | Criar ponte entre lógica visual e programação textual |
| 2026-09 | Blocos focados nos fundamentos de algoritmos | O objetivo pedagógico é ensinar conceitos básicos |
| 2026-09 | Variáveis como conceito obrigatório | Fundamento universal de programação |
| 2026-09 | Condicionais como conceito obrigatório | Fundamento essencial de controle de fluxo |
| 2026-09 | Repetições como conceito obrigatório | Fundamento essencial de controle de fluxo |
| 2026-09 | Operadores e expressões como conceitos básicos | Necessários para construção de algoritmos |
| 2026-09 | Sequência como conceito central | Base estrutural da execução de algoritmos |
| 2026-09 | Supabase + PostgreSQL | Persistência serverless, Auth e RLS nativo |
| 2026-09 | Google OAuth | Provedor único de autenticação para a plataforma |
| 2026-09 | Next.js + TypeScript + Tailwind CSS | Monorepo tipado contra alucinações e design modular |
| 2026-09 | Vercel | Hospedagem integrada ao fluxo serverless |
| 2026-09 | GitHub Actions | CI/CD com barreiras de lint, testes e cobertura |
| 2026-09 | Divisão vertical por épicos | Rastreabilidade e comprovação de autoria acadêmica |
| 2026-09 | Dois sprints de desenvolvimento | Planejamento pedagógico da disciplina acadêmica |

### Known Hurdles
- `[YYYY-MM-DD]` **Problema:** `[SINTOMA]` | **Solução:** `[FIX E PREVENÇÃO]`

## Governance

Esta Constituição constitui a autoridade máxima de engenharia e governança técnica do repositório **Code Blocks Arduino**, sobrepondo-se a preferências individuais ou padrões informais.

- **Auditoria e Conformidade:** Todos os Pull Requests, revisões de código e tarefas executadas por agentes ou humanos DEVEM verificar conformidade com os princípios aqui descritos e cumprir rigorosamente a Definition of Done (DoD).
- **Processo de Emenda:** Qualquer proposta de alteração nesta Constituição requer justificativa explícita, consenso da equipe e atualização documentada deste arquivo.
- **Aforismo Operacional:** *O agente sugere. O código implementa. O teste comprova. O humano decide.*
- **Versionamento Semântico da Governança:**
  - **MAJOR:** Mudanças que rompem ou redefinem princípios fundamentais, regras de segurança ou fluxo de arquitetura.
  - **MINOR:** Adição de novos princípios, seções, tabelas de decisões ou limites de complexidade.
  - **PATCH:** Esclarecimentos textuais, correções ortográficas e refinamentos não-semânticos.

**Version**: 1.1.0 | **Ratified**: 2026-09-19 | **Last Amended**: 2026-09-19

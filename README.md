# #Code Blocks Arduino

> Plataforma educacional para auxiliar a transição da programação visual para a programação textual utilizando fundamentos de algoritmos e geração de código C/C++ para Arduino.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Next.js](https://img.shields.io/badge/Next.js-TypeScript-black)
![Blockly](https://img.shields.io/badge/Google-Blockly-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![Arduino](https://img.shields.io/badge/Arduino-C%2FC%2B%2B-00979D)
[![Scrum Plan](https://img.shields.io/badge/Planejamento-Scrum%20(2%20Sprints)-blueviolet)](PLANEJAMENTO_SCRUM.md)

---

> 📋 **Documento de Planejamento Acadêmico:** Consulte o [Plano de Projeto e Divisão de Trabalho Scrum](PLANEJAMENTO_SCRUM.md) detalhando as 2 Sprints e a divisão vertical para 5 desenvolvedores.

## 📖 Sobre o Projeto

O **#Code Blocks Arduino** é um projeto acadêmico desenvolvido para a disciplina **Oficina de Integração 2**, associado ao projeto de extensão **ELLP — Ensino Lúdico de Lógica e Programação**, da UTFPR.

A plataforma foi concebida para auxiliar alunos iniciantes que estão aprendendo lógica de programação e precisam realizar a transição de ambientes de programação visual para linguagens de programação baseadas em texto.

A proposta utiliza o **Google Blockly** como ferramenta de programação visual. O aluno constrói algoritmos através de blocos que representam conceitos fundamentais de programação e, simultaneamente, visualiza a representação equivalente em **C/C++**, direcionada ao ecossistema Arduino.

O fluxo principal da plataforma é:

```text
┌──────────────────────┐
│     ALUNO            │
│                      │
│ Monta algoritmo      │
│ através de blocos    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   GOOGLE BLOCKLY     │
│                      │
│ Representação visual │
│ do algoritmo         │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  CODE GENERATOR      │
│                      │
│ Interpreta a lógica  │
│ dos blocos           │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      C / C++         │
│                      │
│ Código textual       │
│ para Arduino         │
└──────────────────────┘
```

O objetivo não é transformar toda a linguagem C/C++ em blocos.

O foco é representar **fundamentos básicos de algoritmos**, permitindo que o aluno compreenda a relação entre a lógica visual e sua representação textual.

---

# 🎯 Objetivos

## Objetivo geral

Desenvolver uma ferramenta educacional capaz de facilitar a transição da programação visual para a programação textual através da representação visual de conceitos básicos de algoritmos e da geração equivalente de código C/C++ para Arduino.

## Objetivos específicos

- Criar um ambiente de programação visual baseado em Blockly.
- Representar conceitos fundamentais de algoritmos através de blocos.
- Permitir a construção visual de algoritmos.
- Gerar automaticamente código C/C++ correspondente.
- Tornar visível a relação entre lógica e código.
- Permitir que alunos salvem e gerenciem seus projetos.
- Implementar autenticação utilizando Google.
- Garantir isolamento dos projetos entre usuários.
- Disponibilizar recursos administrativos para gerenciamento de alunos.
- Aplicar testes automatizados.
- Utilizar CI para garantir qualidade do código.
- Aplicar práticas de engenharia de software durante todo o desenvolvimento.

---

# 🎓 Contexto Acadêmico

O projeto integra conhecimentos trabalhados na disciplina de **Oficina de Integração 2**, incluindo:

- Programação Orientada a Objetos;
- Banco de Dados;
- Programação Web;
- Teste de Software;
- Gerência de Configuração e Manutenção;
- Arquitetura de Software;
- Gerenciamento de Projetos de Software.

A disciplina também estabelece práticas relacionadas ao uso de GitHub, Issues, commits, testes automatizados, cobertura de código e rastreabilidade da contribuição individual.

O desenvolvimento do projeto é organizado utilizando:

```text
Scrum
  +
GitHub Issues
  +
Kanban
  +
Git
  +
Pull Requests
  +
CI
  +
Testes automatizados
```

---

# 🧠 Conceito Pedagógico

A principal ideia do projeto é criar uma ponte entre duas formas de representação:

```text
PROGRAMADOR INICIANTE

        Lógica
          ↓
       Blockly
          ↓
      Algoritmo
          ↓
       C/C++
          ↓
       Arduino
```

O aluno não precisa começar escrevendo diretamente código textual.

Primeiro, ele trabalha com estruturas visuais.

Depois, observa como essas estruturas são representadas em uma linguagem textual.

Isso permite trabalhar conceitos fundamentais como:

- sequência;
- variáveis;
- atribuição;
- operadores;
- expressões;
- condicionais;
- repetições.

---

# 🧩 Blocos de Programação

Os blocos da plataforma representam **fundamentos de algoritmos**, e não comandos específicos de movimentação de robôs.

O conjunto inicial deve permanecer simples e adequado para alunos iniciantes.

## Categorias principais

### Sequência

Representa a ordem de execução das instruções.

```text
Instrução A
     ↓
Instrução B
     ↓
Instrução C
```

Equivalente conceitualmente a:

```cpp
instrucaoA();
instrucaoB();
instrucaoC();
```

---

## Variáveis

Permitem armazenar informações.

Exemplo visual:

```text
┌──────────────────┐
│ definir idade    │
│       = 18       │
└──────────────────┘
```

Equivalente:

```cpp
int idade = 18;
```

Também devem ser considerados conceitos como:

```text
criar variável
atribuir valor
alterar valor
consultar variável
```

---

## Operadores

Permitem construir expressões.

Operadores aritméticos básicos:

```text
+
-
*
/
```

Operadores relacionais:

```text
>
<
>=
<=
==
!=
```

Operadores lógicos podem ser introduzidos quando necessários:

```text
&&
||
!
```

---

## Condicionais

Representam decisões.

Exemplo:

```text
┌─────────────────────┐
│ SE idade >= 18      │
│                     │
│   faça algo         │
│                     │
│ SENÃO               │
│                     │
│   faça outra coisa   │
└─────────────────────┘
```

Equivalente:

```cpp
if (idade >= 18) {
    // faça algo
} else {
    // faça outra coisa
}
```

---

## Repetições

Representam estruturas de repetição.

Exemplo conceitual:

```text
┌─────────────────────┐
│ REPETIR             │
│                     │
│   instruções        │
│                     │
└─────────────────────┘
```

Possíveis representações textuais:

```cpp
for (...) {
    // instruções
}
```

ou:

```cpp
while (...) {
    // instruções
}
```

A quantidade de estruturas de repetição será mantida limitada ao necessário para o objetivo educacional do projeto.

---

# 🔄 Geração de Código

A geração de código é uma das principais funcionalidades da plataforma.

O processo é:

```text
Blockly Workspace
       ↓
Estrutura dos blocos
       ↓
Code Generator
       ↓
Código C/C++
       ↓
Arduino
```

Por exemplo:

### Representação visual

```text
[criar variável]

nome: contador
valor: 10
```

### Código

```cpp
int contador = 10;
```

Outro exemplo:

### Blockly

```text
SE contador > 10
    ...
SENÃO
    ...
```

### C/C++

```cpp
if (contador > 10) {
    ...
} else {
    ...
}
```

A geração deve ser:

- determinística;
- previsível;
- testável;
- legível;
- coerente com os blocos.

---

# 🏗️ Arquitetura

A aplicação utiliza uma arquitetura web full-stack baseada em Next.js e Supabase.

Visão geral:

```text
                         ┌─────────────────┐
                         │      ALUNO      │
                         └────────┬────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │       Next.js / React   │
                    │                         │
                    │        Workspace        │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │     Google Blockly       │
                    │                          │
                    │  Blocos → Algoritmo      │
                    └────────────┬─────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │     Code Generator       │
                    │                          │
                    │   Algoritmo → C/C++      │
                    └────────────┬─────────────┘
                                 │
                   ┌─────────────▼─────────────┐
                   │         Supabase          │
                   │                           │
                   │ Auth + PostgreSQL + RLS   │
                   └───────────────────────────┘
```

---

# 🛠️ Stack Tecnológica

## Front-End

### Next.js

Framework principal da aplicação web.

Responsabilidades:

- interface;
- roteamento;
- Server Components;
- Client Components quando necessários;
- integração com o Back-End.

### TypeScript

Utilizado como linguagem principal.

O TypeScript tem como objetivo proporcionar:

- tipagem estática;
- maior segurança durante desenvolvimento;
- contratos claros;
- redução de erros;
- melhor manutenção.

### Tailwind CSS

Utilizado para estilização da interface.

---

# 🧱 Google Blockly

O **Google Blockly** é o motor de programação visual da plataforma.

Responsabilidades:

- renderização dos blocos;
- conexão entre blocos;
- interação do usuário;
- estrutura do algoritmo;
- serialização do Workspace.

O projeto não deve implementar manualmente funcionalidades centrais já fornecidas pelo Blockly.

---

# 🗄️ Supabase

O Supabase fornece a infraestrutura de Back-End necessária para a aplicação.

Utilizado para:

- PostgreSQL;
- autenticação;
- persistência;
- autorização;
- Row Level Security.

Arquitetura:

```text
Next.js
   │
   ▼
Supabase
   │
   ├── Auth
   │
   ├── PostgreSQL
   │
   └── RLS
```

---

# 🔐 Autenticação

A autenticação será realizada exclusivamente através do Google.

Fluxo:

```text
Usuário
   ↓
Google
   ↓
Google OAuth
   ↓
Supabase Auth
   ↓
Sessão
   ↓
Aplicação
```

Não fazem parte do escopo inicial:

- login por senha;
- cadastro com senha;
- autenticação própria;
- outros provedores OAuth.

---

# 👥 Perfis de Usuário

A aplicação possui dois perfis principais.

## 👨‍💼 Administrador

O administrador pode:

- visualizar alunos;
- adicionar alunos;
- remover alunos.

O administrador possui acesso ao painel administrativo.

---

## 👨‍🎓 Aluno

O aluno possui acesso ao Workspace.

Pode:

- criar projetos;
- abrir projetos;
- editar projetos;
- salvar projetos;
- excluir projetos;
- construir algoritmos;
- visualizar o código C/C++.

Um aluno não pode acessar os projetos de outro aluno.

---

# 🔒 Segurança

A segurança do sistema utiliza múltiplas camadas.

```text
Google OAuth
      ↓
Supabase Auth
      ↓
Autorização
      ↓
Row Level Security
      ↓
PostgreSQL
```

## Row Level Security

O PostgreSQL utilizará políticas de **RLS** para garantir o isolamento dos dados.

Exemplo:

```text
Aluno A
   ↓
Projetos do Aluno A
   ✓ permitido

Aluno A
   ↓
Projeto do Aluno B
   ✗ bloqueado
```

A segurança não deve depender apenas da interface.

Mesmo que um usuário manipule uma requisição manualmente, o banco deve impedir o acesso não autorizado.

---

# 📁 Estrutura do Projeto

Estrutura conceitual:

```text
code-blocks-arduino/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── workspace/
│   │   ├── projects/
│   │   ├── admin/
│   │   └── api/
│   │
│   ├── components/
│   │   ├── blockly/
│   │   ├── workspace/
│   │   ├── projects/
│   │   └── admin/
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── projects/
│   │   └── code-generator/
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   └── errors/
│   │
│   └── types/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── package.json
├── tsconfig.json
├── README.md
└── CONSTITUTION.md
```

A estrutura pode evoluir durante o desenvolvimento, desde que as responsabilidades permaneçam organizadas.

---

# 🧑‍💻 Workspace

O Workspace é o principal ambiente do aluno.

Fluxo:

```text
┌───────────────┐
│ Novo Projeto  │
└───────┬───────┘
        ↓
┌────────────────────────┐
│      Blockly           │
│                        │
│ [variável]             │
│ [SE]                   │
│ [repetição]            │
│ [operação]             │
└────────────┬───────────┘
             │
             ▼
┌────────────────────────┐
│     Código C/C++       │
│                        │
│ int x = 10;             │
│ if (...) { ... }       │
└────────────────────────┘
```

O código deve ser atualizado conforme o algoritmo visual for alterado.

---

# 💾 Persistência

Cada projeto pertence a um aluno.

Modelo conceitual:

```text
User
 │
 └──< Project
          │
          ├── id
          ├── owner
          ├── name
          ├── workspace
          ├── createdAt
          └── updatedAt
```

O Workspace Blockly será serializado para persistência.

O código C/C++ é considerado uma representação derivada.

```text
Workspace
    ↓
persistência
    ↓
Generator
    ↓
C/C++
```

O código gerado não deve substituir o Workspace como fonte principal do algoritmo.

---

# 🧪 Estratégia de Testes

O projeto utiliza testes automatizados para garantir qualidade e evitar regressões.

## Testes unitários

Principalmente:

- geração de código;
- regras de negócio;
- validações;
- transformação de dados;
- autorização.

O generator deve possuir testes para cada estrutura básica.

Exemplo:

```text
Blockly Input
      ↓
Generator
      ↓
Expected C/C++
```

---

## Testes de integração

Devem validar integrações como:

```text
Aplicação
    ↓
Supabase
    ↓
PostgreSQL
```

Incluindo operações de:

- criação;
- leitura;
- atualização;
- exclusão;
- autorização.

---

## Testes End-to-End

Devem validar os fluxos críticos da aplicação.

Fluxo esperado:

```text
Login
 ↓
Workspace
 ↓
Criar projeto
 ↓
Adicionar blocos
 ↓
Visualizar código
 ↓
Salvar
 ↓
Reabrir
 ↓
Editar
 ↓
Excluir
```

---

# 📊 Cobertura

A cobertura de testes será acompanhada no pipeline de CI.

O objetivo é evitar que novas alterações reduzam a qualidade do projeto.

Uma alteração significativa deve incluir testes correspondentes.

---

# ⚙️ CI/CD

O projeto utiliza **GitHub Actions**.

Pipeline:

```text
Pull Request
      ↓
Install
      ↓
Lint
      ↓
Tests
      ↓
Coverage
      ↓
Build
      ↓
Deploy
```

O CI deve impedir que código quebrado avance para a branch principal.

---

# 🚀 Deploy

A aplicação será hospedada na **Vercel**.

Arquitetura:

```text
GitHub
   ↓
GitHub Actions
   ↓
CI
   ↓
Vercel
   ↓
Aplicação
```

O Supabase permanece responsável pela camada de dados e autenticação.

---

# 🔧 Instalação Local

Para configurar o banco e o administrador de testes, consulte o
[guia do Supabase local](docs/SUPABASE_LOCAL.md).

## Pré-requisitos

Antes de executar o projeto, é necessário possuir:

- Node.js;
- npm, pnpm ou equivalente;
- Git;
- projeto configurado no Supabase;
- OAuth do Google configurado.

A versão exata do Node.js deve ser definida pelo projeto no arquivo correspondente de configuração.

---

## Clonar o projeto

```bash
git clone <URL_DO_REPOSITORIO>
cd code-blocks-arduino
```

---

## Instalar dependências

```bash
npm install
```

ou:

```bash
pnpm install
```

---

# 🔐 Variáveis de Ambiente

Criar:

```text
.env.local
```

A partir de:

```text
.env.example
```

Exemplo conceitual:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

> A `SUPABASE_SERVICE_ROLE_KEY` é uma credencial privilegiada e nunca deve ser exposta ao navegador ou commitada no repositório.

---

# ▶️ Executando o Projeto

Modo desenvolvimento:

```bash
npm run dev
```

Depois acessar:

```text
http://localhost:3000
```

Os scripts oficiais devem ser consultados no `package.json`, pois podem evoluir durante o projeto.

---

# 🧹 Qualidade de Código

Antes de abrir um Pull Request:

```bash
npm run lint
```

Executar os testes:

```bash
npm test
```

Executar cobertura:

```bash
npm run test:coverage
```

Executar build:

```bash
npm run build
```

Os comandos exatos devem acompanhar os scripts efetivamente definidos no `package.json`.

---

# 🌿 Git Workflow

O projeto utiliza GitHub como fonte da verdade.

## Branch principal

```text
main
```

## Branches de desenvolvimento

```text
feature/issue-12-blockly-workspace
feature/issue-18-code-generator
feature/issue-25-project-persistence

fix/issue-30-project-access

test/issue-35-generator-tests
```

---

# 📝 Conventional Commits

Os commits devem seguir o padrão:

```text
tipo(escopo): descrição
```

Exemplos:

```bash
feat(blockly): add variable block

feat(generator): generate conditional code

feat(projects): save workspace

test(generator): add loop generation tests

fix(auth): prevent unauthorized project access

refactor(projects): isolate project service

ci: add coverage validation

docs: update architecture documentation
```

---

# 📋 GitHub Issues

Toda funcionalidade significativa deve possuir uma Issue.

Exemplo:

```text
Issue #18
Implementar geração de código para condicionais
```

A Issue deve descrever:

- objetivo;
- contexto;
- critérios de aceite;
- testes esperados;
- possíveis dependências.

---

# 📌 Kanban

O projeto utiliza GitHub Issues como base do Kanban.

Fluxo:

```text
Backlog
   ↓
Ready
   ↓
In Progress
   ↓
Review
   ↓
Done
```

O quadro deve representar o estado real das tarefas.

---

# 🔀 Pull Requests

Um Pull Request deve:

- estar associado a uma Issue;
- possuir descrição;
- informar testes executados;
- possuir CI verde;
- evitar alterações não relacionadas.

Exemplo:

```text
Closes #18
```

---

# 👥 Organização do Trabalho

O projeto utiliza **Scrum** com dois sprints de implementação.

A equipe utiliza **divisão vertical por épicos**.

Isso significa que cada integrante deve buscar implementar funcionalidades completas.

Exemplo:

```text
Épico: Projetos

UI
 ↓
Regra de negócio
 ↓
Persistência
 ↓
Testes
```

Em vez de dividir o sistema somente por tecnologia:

```text
Pessoa A → Front-End
Pessoa B → Back-End
Pessoa C → Banco
Pessoa D → Testes
```

A abordagem vertical facilita a rastreabilidade da contribuição individual.

---

# 🏆 Definition of Done

Uma funcionalidade é considerada concluída quando:

```text
[✓] Requisito definido
[✓] Issue criada
[✓] Implementação realizada
[✓] Testes adicionados
[✓] Testes passando
[✓] Lint passando
[✓] Build passando
[✓] Cobertura preservada
[✓] Segurança validada
[✓] RLS respeitado
[✓] Pull Request criado
[✓] CI verde
[✓] Código revisado
[✓] Commit rastreável
```

---

# 🚫 Fora do Escopo

O MVP não contempla:

- editor textual completo de C++;
- tradução reversa C++ → Blockly;
- compilação de código na plataforma;
- simulador completo de Arduino;
- implementação completa da linguagem C++;
- classes e herança como blocos;
- templates;
- gerenciamento avançado de memória;
- ponteiros avançados;
- múltiplos provedores de autenticação;
- sistema de login por senha;
- funcionalidades de IA generativa como requisito central.

O escopo poderá evoluir mediante decisão formal da equipe.

---

# 🧭 Roadmap Conceitual

## Sprint 1 — Fundação

Objetivo:

> Construir a base técnica da plataforma.

Possíveis entregas:

```text
✓ Setup Next.js
✓ TypeScript
✓ Tailwind
✓ Supabase
✓ Google OAuth
✓ Modelo de usuários
✓ RLS
✓ Estrutura inicial do Workspace
✓ Integração Blockly
✓ Primeiro conjunto de blocos
✓ Primeiro generator
✓ CI
✓ Testes iniciais
```

---

## Sprint 2 — Produto funcional

Objetivo:

> Entregar o fluxo completo de criação e gerenciamento de algoritmos.

Possíveis entregas:

```text
Workspace completo
      ↓
Variáveis
      ↓
Operadores
      ↓
Condicionais
      ↓
Repetições
      ↓
Geração C/C++
      ↓
Salvar projeto
      ↓
Editar projeto
      ↓
Excluir projeto
      ↓
Administração
      ↓
Testes
      ↓
CI
```

O backlog definitivo de cada sprint deve ser estabelecido através das Issues do projeto.

---

# 🧱 Princípios de Engenharia

O projeto segue os seguintes princípios:

### Simplicidade antes de abstração

Não criar abstrações sem necessidade.

### Código explícito antes de mágica

O comportamento deve ser fácil de entender.

### Testabilidade antes de velocidade aparente

Uma implementação difícil de testar deve ser questionada.

### Pequenas mudanças antes de grandes refactors

Preferir alterações incrementais.

### Segurança em camadas

Não confiar exclusivamente no Front-End.

### Blockly como representação principal

O código C/C++ é derivado do algoritmo visual.

### Fundamentos antes de complexidade

O projeto deve ensinar primeiro:

```text
sequência
↓
variáveis
↓
operações
↓
condicionais
↓
repetições
```

antes de avançar para recursos complexos.

---

# 🤖 Uso de Inteligência Artificial

Ferramentas de IA podem ser utilizadas durante o desenvolvimento como apoio à equipe.

A IA pode atuar como:

- pair programmer;
- auxiliar de arquitetura;
- auxiliar de testes;
- code reviewer;
- auxiliar de documentação;
- explicador técnico.

Porém, a IA não deve:

- inventar requisitos;
- alterar a arquitetura sem justificativa;
- criar funcionalidades fora do escopo;
- adicionar dependências desnecessárias;
- ignorar testes;
- ignorar RLS;
- inventar APIs do Arduino;
- substituir decisões da equipe.

Princípio:

```text
IA sugere
   ↓
Equipe avalia
   ↓
Código implementa
   ↓
Teste comprova
```

---

# 📚 Documentação de Arquitetura

A arquitetura detalhada e as regras obrigatórias de desenvolvimento estão documentadas em:

```text
CONSTITUTION.md
```

O `CONSTITUTION.md` deve ser considerado a fonte de verdade para:

- arquitetura;
- stack;
- padrões de código;
- segurança;
- testes;
- Git;
- Scrum;
- divisão de responsabilidades;
- uso de IA.

---

# 📐 Fluxo Completo do Sistema

```text
                         ┌───────────────┐
                         │    Google     │
                         └───────┬───────┘
                                 │
                                 ▼
                         ┌───────────────┐
                         │ Supabase Auth │
                         └───────┬───────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────┐
│                     Next.js                        │
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │                  Workspace                   │  │
│  │                                              │  │
│  │   ┌───────────────┐    ┌────────────────┐   │  │
│  │   │    Blockly    │───▶│ Code Generator │   │  │
│  │   │               │    │                │   │  │
│  │   │  Variáveis    │    │     C/C++      │   │  │
│  │   │  Condições    │    │    Arduino     │   │  │
│  │   │  Repetições   │    │                │   │  │
│  │   └───────────────┘    └────────────────┘   │  │
│  │                                              │  │
│  └───────────────────────┬──────────────────────┘  │
│                          │                         │
└──────────────────────────┼─────────────────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │    Supabase     │
                  │                 │
                  │ PostgreSQL      │
                  │ RLS             │
                  └─────────────────┘
```

---

# 🔄 Fluxo de Dados

## Criação

```text
Aluno
 ↓
Blockly
 ↓
Workspace
 ↓
Projeto
```

## Geração

```text
Workspace
 ↓
Generator
 ↓
C/C++
```

## Salvamento

```text
Workspace
 ↓
Serialização
 ↓
Supabase
 ↓
PostgreSQL
```

## Recuperação

```text
PostgreSQL
 ↓
Supabase
 ↓
Projeto
 ↓
Workspace
```

---

# 🎯 MVP

O MVP deve demonstrar claramente o conceito central do projeto:

> **Um aluno consegue construir um algoritmo utilizando blocos básicos e visualizar como aquela mesma lógica é representada em C/C++ para Arduino.**

Fluxo mínimo:

```text
Login Google
     ↓
Workspace
     ↓
Novo projeto
     ↓
Adicionar variável
     ↓
Utilizar operação
     ↓
Adicionar condicional/repetição
     ↓
Visualizar C/C++
     ↓
Salvar
     ↓
Reabrir
```

Se esse fluxo estiver funcionando com qualidade, o principal objetivo educacional da plataforma estará demonstrado.

---

# 📜 Regras Fundamentais

1. **O projeto é uma ferramenta educacional, não uma IDE completa.**
2. **Blockly é a representação visual principal.**
3. **C/C++ é a representação textual derivada.**
4. **O foco inicial são fundamentos de algoritmos.**
5. **A simplicidade é preferível à complexidade.**
6. **RLS é obrigatório para proteção dos dados.**
7. **Autenticação é feita exclusivamente pelo Google.**
8. **Todo projeto pertence a um aluno.**
9. **Testes fazem parte da implementação.**
10. **CI deve permanecer funcional.**
11. **Funcionalidades relevantes devem possuir Issues.**
12. **Commits devem ser rastreáveis.**
13. **A autoria individual deve permanecer identificável.**
14. **Mudanças arquiteturais devem ser documentadas.**
15. **Nenhum requisito deve ser inventado pela IA.**

---

# 📄 Licença

A definição da licença deve ser realizada pela equipe conforme as regras da instituição e do projeto de extensão.

Até que uma licença seja oficialmente definida, não assumir automaticamente uma licença open source.

---

# 👥 Equipe

| Integrante | Responsabilidade |
| ---------- | ---------------- |
| Lucas Silva  | Dev 1       |
| Joao flavio  | Dev 2      |
| Thiago  | Dev 3      |
| Yumi  | Dev 4        |
| Murilo  | Dev 5        |

A divisão definitiva deve ser mantida no GitHub e atualizada conforme os épicos forem atribuídos.

---

# 🏫 Instituição

**Universidade Tecnológica Federal do Paraná — UTFPR**

**Disciplina:** Oficina de Integração 2

**Projeto de extensão:** ELLP — Ensino Lúdico de Lógica e Programação

**Projeto:** #Code Blocks Arduino

---

# 📌 Documentos do Projeto

```text
README.md
    ↓
Visão geral e execução

CONSTITUTION.md
    ↓
Regras arquiteturais e de desenvolvimento

GitHub Issues
    ↓
Requisitos e tarefas

Pull Requests
    ↓
Implementações

GitHub Actions
    ↓
Qualidade e CI
```

---

# 💡 Princípio do Projeto

> **Aprender lógica visualmente. Entender a estrutura. Enxergar o código. Programar.**

O #Code Blocks Arduino busca transformar a passagem da programação em blocos para C/C++ de uma mudança abstrata de linguagem em uma evolução visual e compreensível do mesmo algoritmo.

**Bloco → Lógica → Código → Arduino.**

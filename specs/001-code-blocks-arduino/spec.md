# Feature Specification: Code Blocks Arduino Platform (MVP)

**Feature Branch**: `001-code-blocks-arduino`

**Created**: 2026-09-19

**Status**: Draft

**Input**: User description: "Plataforma web educacional #Code Blocks Arduino para a disciplina Oficina de Integração 2 e projeto de extensão ELLP. Permite construção de algoritmos visuais em blocos e tradução simultânea para código Arduino (C/C++), com autenticação Google, workspace do aluno, persistência individual com RLS e gestão de alunos por administrador."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Construção Visual de Algoritmos e Tradução para C/C++ em Tempo Real (Priority: P1)

Como um **Aluno iniciante**, eu quero construir algoritmos conectando blocos visuais intuitivos e acompanhar a geração imediata do código textual C/C++ para Arduino correspondente, para que eu compreenda a relação direta entre a lógica algorítmica e a sintaxe da linguagem de programação textual.

**Why this priority**: É o valor pedagógico central da plataforma. Se apenas este fluxo for implementado, o sistema já entrega o valor educacional essencial do projeto (transição do visual para o textual).

**Independent Test**: Pode ser testado de ponta a ponta na área de trabalho (Workspace) montando blocos de variáveis, operadores, condicionais e repetições, verificando que o painel de código exibe instantaneamente o código C/C++ legível e determinístico, mesmo sem autenticação ou salvamento em nuvem.

**Acceptance Scenarios**:

1. **Given** que o aluno está com o Workspace aberto, **When** ele conecta um bloco de declaração/atribuição de variável e um bloco condicional (Se/Senão), **Then** o painel de código textual é atualizado instantaneamente com o código Arduino C/C++ equivalente estruturado e legível.
2. **Given** que o aluno altera o valor ou operador de um bloco existente, **When** a alteração é feita no bloco visual, **Then** o código textual reflete imediatamente a nova expressão matemática ou lógica de forma determinística.
3. **Given** blocos posicionados na área de trabalho sem conexão lógica (blocos órfãos ou incompletos), **When** o código é gerado, **Then** o sistema gera apenas o código das estruturas lógicas completas e válidas, sem quebras de sintaxe no código final.

---

### User Story 2 - Autenticação e Gestão de Projetos do Aluno (Priority: P2)

Como um **Aluno**, eu quero autenticar-me com minha conta Google para acessar meu ambiente de desenvolvimento individualizado, onde posso criar novos projetos, salvar o progresso dos meus algoritmos, reabrir projetos salvos para edição contínua e excluir projetos obsoletos, com a garantia de que meus projetos são privados.

**Why this priority**: Permite que o aluno dê continuidade às suas atividades práticas ao longo de múltiplas aulas e oficinas, assegurando que seu trabalho seja salvo com segurança e permaneça inacessível para outros colegas.

**Independent Test**: Um aluno autenticado cria um projeto com nome específico, salva seus blocos, encerra a sessão, realiza novo login e reabre o projeto, constatando a restauração fiel de todos os blocos e do código gerado.

**Acceptance Scenarios**:

1. **Given** um usuário na página inicial da plataforma, **When** ele escolhe entrar, **Then** o sistema realiza a autenticação exclusivamente via Google e direciona o usuário para seu espaço de trabalho ou painel de projetos.
2. **Given** um aluno autenticado editando um algoritmo no Workspace, **When** ele clica em "Salvar Projeto" informando um título, **Then** o estado do projeto é persistido com sucesso e vinculado exclusivamente à sua conta.
3. **Given** um aluno acessando sua lista de projetos, **When** ele seleciona um projeto salvo anteriormente, **Then** o Workspace é carregado exatamente com a disposição dos blocos e lógica que foram salvos.
4. **Given** um aluno autenticado (Aluno A), **When** ocorre qualquer tentativa de consulta ou modificação de um projeto pertencente a outro aluno (Aluno B), **Then** o sistema recusa a requisição e mantém o isolamento absoluto dos dados.
5. **Given** um aluno visualizando seus projetos, **When** ele solicita a exclusão de um projeto e confirma a ação, **Then** o projeto é permanentemente removido de sua lista.

---

### User Story 3 - Gestão de Acessos e Alunos pelo Administrador (Priority: P3)

Como um **Professor / Administrador**, eu quero acessar um painel de gestão para visualizar a listagem de alunos cadastrados, autorizar novos alunos a utilizarem a plataforma e remover cadastros de alunos que concluíram a disciplina, para que o acesso à infraestrutura seja controlado e ordenado.

**Why this priority**: Permite que os docentes e bolsistas da disciplina Oficina de Integração 2 e do projeto ELLP regulem quem pode acessar a plataforma e organizem as turmas participantes.

**Independent Test**: Um usuário com papel de Administrador acessa a área administrativa, visualiza a lista de alunos registrados, inclui um novo e-mail de aluno e verifica que esse e-mail agora está autorizado a ingressar na plataforma.

**Acceptance Scenarios**:

1. **Given** um Administrador autenticado no sistema, **When** ele acessa a rota de administração, **Then** o sistema apresenta a relação completa de alunos cadastrados com seus respectivos dados básicos.
2. **Given** o painel de administração, **When** o Administrador informa os dados de um novo aluno e confirma o cadastro, **Then** o aluno é registrado e habilitado para efetuar login na plataforma.
3. **Given** um aluno previamente cadastrado, **When** o Administrador confirma a remoção desse aluno, **Then** o cadastro do aluno é desativado ou removido e seu acesso à plataforma é revogado.
4. **Given** um usuário com perfil de Aluno, **When** ele tenta navegar diretamente para o painel de administração, **Then** o sistema bloqueia o acesso e o redireciona para seu Workspace.

---

### Edge Cases

- **Perda temporária de conectividade de rede:** Caso o aluno tente salvar o projeto durante uma oscilação de rede, o sistema deve apresentar alerta amigável informando a falha de sincronização e manter o estado atual dos blocos no navegador para nova tentativa sem perda de trabalho.
- **Tentativa de login por usuário não cadastrado:** Caso um usuário autentique via Google mas seu e-mail não conste na lista de alunos autorizados pelo Administrador, o sistema deve exibir uma tela de espera explicativa orientando o aluno a solicitar liberação ao professor.
- **Nome de projeto inválido ou duplicado:** Caso o aluno tente salvar um projeto com nome vazio, espaços em branco ou ultrapassando limites de caracteres, o sistema deve solicitar uma identificação válida antes de prosseguir.
- **Desconexão de blocos durante edição complexa:** Se o aluno desconectar um bloco que continha estruturas aninhadas, os blocos desconectados devem permanecer visíveis na área de trabalho e o painel de código deve refletir imediatamente apenas os blocos que mantiverem conexão válida com a estrutura de execução.
- **Manipulação direta de parâmetros de URL:** Caso o usuário tente alterar IDs na URL para carregar projetos alheios, o sistema deve responder com erro de permissão ou "não encontrado", impedindo qualquer vazamento de dados.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE fornecer mecanismo de autenticação obrigatório exclusivamente integrado ao Google.
- **FR-002**: O sistema DEVE disponibilizar uma área de trabalho visual (Workspace) interativa para montagem de algoritmos por meio de blocos de encaixe.
- **FR-003**: O catálogo de blocos DEVE contemplar os fundamentos essenciais de algoritmos:
  - **Sequência:** Encadeamento ordenado de instruções de cima para baixo.
  - **Variáveis e Literais:** Declaração, atribuição, alteração e leitura de valores (números inteiros, decimais, booleanos e textos simples).
  - **Operadores:** Aritméticos fundamentais (`+`, `-`, `*`, `/`) e relacionais/lógicos (`>`, `<`, `==`, `!=`, `&&`, `||`, `!`).
  - **Condicionais:** Estruturas de controle de decisão `Se` e `Se-Senão`.
  - **Repetições:** Estruturas de repetição com controle de repetição por contagem ou condição.
- **FR-004**: O sistema DEVE gerar e exibir em tempo real a tradução do algoritmo montado em blocos para código textual legível em C/C++ compatível com a plataforma Arduino.
- **FR-005**: A geração de código DEVE ser determinística: uma mesma estrutura e configuração de blocos deve produzir rigorosamente o mesmo código textual C/C++.
- **FR-006**: O código gerado DEVE ser formatado com indentação clara, estrutura padronizada do ecossistema Arduino (`setup` e `loop` ou funções de suporte quando aplicável) e nomenclatura coerente com os blocos visuais.
- **FR-007**: O sistema DEVE permitir ao aluno autenticado salvar novos projetos, carregar projetos existentes no Workspace, atualizar o conteúdo de projetos e excluir projetos.
- **FR-008**: O sistema DEVE garantir o isolamento estrito de dados entre alunos, assegurando que um aluno visualize e gerencie apenas seus próprios projetos.
- **FR-009**: O sistema DEVE disponibilizar ao perfil de Administrador um painel dedicado para listar alunos, adicionar novos alunos autorizados e remover alunos cadastrados.
- **FR-010**: O sistema DEVE restringir o acesso a funcionalidades administrativas exclusivamente a usuários com papel de Administrador, impedindo o acesso de Alunos a tais recursos.
- **FR-011**: O sistema DEVE validar todas as entradas estruturais e parâmetros de requisições na borda da aplicação antes de processar qualquer persistência ou regra de negócio.

### Key Entities *(include if feature involves data)*

- **Usuário (User):**
  - Representa o ator que interage com a plataforma (Aluno ou Administrador).
  - Atributos principais: identificador único, e-mail associado à conta Google, nome de exibição, perfil de permissão (`ALUNO` ou `ADMIN`) e data de cadastro.
- **Projeto (Project):**
  - Representa o trabalho prático desenvolvido por um aluno no Workspace.
  - Atributos principais: identificador único, identificador do usuário proprietário (relação 1:N com Usuário), título do projeto, representação serializada dos blocos visuais, data de criação e data da última atualização.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O painel de código textual reflete qualquer alteração ou inserção de blocos realizada no Workspace em menos de 1 segundo.
- **SC-002**: 100% dos algoritmos montados com blocos válidos das categorias suportadas geram código C/C++ determinístico e livre de erros de sintaxe para Arduino.
- **SC-003**: Um aluno recém-cadastrado consegue ingressar na plataforma, montar um algoritmo com condicional e salvar seu projeto em menos de 3 minutos no primeiro uso.
- **SC-004**: 100% das tentativas de acesso de um aluno a projetos pertencentes a outros alunos resultam em bloqueio de acesso sem exposição de dados.
- **SC-005**: A restauração de um projeto salvo recarrega 100% dos blocos e conexões no Workspace exatamente como estavam no momento do salvamento.
- **SC-006**: O Administrador consegue cadastrar ou revogar o acesso de um aluno na plataforma em menos de 30 segundos através do painel de controle.

## Assumptions

- Os alunos e administradores utilizam navegadores modernos com suporte a padrões web atuais em computadores ou notebooks com resolução de tela adequada para visualização simultânea do Workspace e do painel de código.
- A compilação final e gravação física do código binário na placa Arduino física são realizadas pelo aluno utilizando a IDE do Arduino ou ferramenta de upload local, cabendo à plataforma fornecer o código C/C++ completo e legível para cópia ou download.
- Todos os usuários participantes possuem contas válidas no Google para autenticação.
- O escopo inicial não inclui simulador virtual de hardware, programação orientada a objetos avançada (classes/templates em blocos) ou tradução reversa de C/C++ textual para blocos visuais.

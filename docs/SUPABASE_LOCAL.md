# Supabase local — T043

O ambiente usa a CLI oficial **2.120.0**, executada pelo npx, sem instalar uma nova
dependência no projeto. É necessário Node.js 20+ e Docker Desktop iniciado.

## Iniciar

Na raiz do repositório, em PowerShell:

```powershell
npx.cmd --yes supabase@2.120.0 start
npx.cmd --yes supabase@2.120.0 status
Copy-Item .env.example .env.local
```

Preencha `NEXT_PUBLIC_SUPABASE_ANON_KEY` em `.env.local` com a chave **Publishable**
local exibida no status. O nome da variável foi preservado para os clients atuais.
Não use uma chave `service_role` ou `secret` nessa variável.
Reinicie o Next.js após alterar o ambiente. O `.env.local` é ignorado pelo Git.

| Serviço    | Endereço                 |
| ---------- | ------------------------ |
| API        | `http://127.0.0.1:54321` |
| Studio     | `http://127.0.0.1:54323` |
| PostgreSQL | `127.0.0.1:54322`        |

A primeira inicialização aplica as migrações e executa `supabase/seed.sql`.
O Postgres local usa a versão 17 gerada pela CLI; ao integrar um projeto hospedado,
confira se sua versão é a mesma antes de validar migrações entre os ambientes.

## Administrador de teste

| Campo  | Valor                                  |
| ------ | -------------------------------------- |
| ID     | `11111111-1111-4111-8111-111111111111` |
| E-mail | `admin.local@example.invalid`          |
| Nome   | Administrador Local                    |
| Papel  | ADMIN                                  |

Essa conta fictícia permite validar dados e repositórios no banco local. Ela não
tem senha nem identidade Google e não serve para entrar na interface. O seed é
idempotente: executá-lo novamente não duplica a conta.

O login Google, a vinculação de uma conta real e a autorização de alunos continuam
na T029. Após essa integração, a equipe deverá preparar uma conta Google real de
teste para os cenários E2E. Os redirects locais já estão configurados para a rota
`/api/auth/callback`; o provider Google permanece desabilitado até essa entrega.

## Validar o seed

```powershell
node scripts/test-local-seed.cjs
```

O comando reaplica o seed em uma transação com `psql` no container local
`supabase_db_code-blocks-oficina` e executa a suíte pgTAP pela CLI. Assim, valida também
que a reexecução não falha nem duplica a conta criada na primeira inicialização.
Os cinco testes conferem a existência do usuário, o papel ADMIN, a ausência de senha,
a idempotência e a relação entre `auth.users` e `profiles`. Eles usam a conexão
administrativa local e não comprovam que as políticas RLS estão corretas.

## Recriar e parar

O comando abaixo **apaga os dados do banco local**, reaplica as migrações e o seed.
Use somente quando quiser descartar o trabalho local de banco:

```powershell
npx.cmd --yes supabase@2.120.0 db reset --local
```

Para parar preservando os dados:

```powershell
npx.cmd --yes supabase@2.120.0 stop
```

Use este seed apenas localmente. Esta tarefa não requer `supabase link`, `db push`
ou acesso ao projeto hospedado. A revisão e os testes de RLS continuam pendentes
nas tarefas de persistência e administração.

Referências: [CLI e ambiente local](https://supabase.com/docs/guides/local-development/cli/getting-started),
[seed após migrações](https://supabase.com/docs/guides/local-development/seeding-your-database).

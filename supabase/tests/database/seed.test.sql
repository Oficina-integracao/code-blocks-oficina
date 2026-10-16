BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SET search_path TO public, extensions;
SELECT plan(5);

SELECT is(
    (SELECT COUNT(*) FROM auth.users WHERE id = '11111111-1111-4111-8111-111111111111'),
    1::bigint, 'seed cria exatamente um usuário local'
);
SELECT is(
    (SELECT role FROM public.profiles WHERE id = '11111111-1111-4111-8111-111111111111'),
    'ADMIN'::varchar, 'perfil local tem papel ADMIN'
);
SELECT is(
    (SELECT encrypted_password FROM auth.users WHERE id = '11111111-1111-4111-8111-111111111111'),
    ''::varchar, 'conta fictícia não recebe senha de login'
);

-- scripts/test-local-seed.cjs reaplica o seed antes de executar esta suíte.

SELECT is(
    (SELECT COUNT(*) FROM auth.users WHERE id = '11111111-1111-4111-8111-111111111111'),
    1::bigint, 'reexecução não duplica o usuário'
);
SELECT is(
    (SELECT COUNT(*) FROM public.profiles p JOIN auth.users u ON u.id = p.id
     WHERE p.id = '11111111-1111-4111-8111-111111111111' AND p.role = 'ADMIN'),
    1::bigint, 'reexecução preserva o ADMIN vinculado ao usuário'
);
SELECT * FROM finish();
ROLLBACK;

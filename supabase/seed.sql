-- T043: dados exclusivamente locais. Não executar no projeto hospedado.
-- Conta fictícia sem senha e sem identidade OAuth; não permite login na aplicação.
-- O trigger da migração inicial cria o perfil antes da promoção abaixo.
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-4111-8111-111111111111',
    'authenticated', 'authenticated', 'admin.local@example.invalid', '',
    '{}'::jsonb, '{"full_name":"Administrador Local"}'::jsonb,
    NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
    '11111111-1111-4111-8111-111111111111',
    'admin.local@example.invalid', 'Administrador Local', 'ADMIN'
)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;

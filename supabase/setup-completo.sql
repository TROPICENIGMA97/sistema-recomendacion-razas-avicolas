-- =============================================
-- SETUP COMPLETO - Sistema Avicola Cuichapa
-- Ejecuta TODO este bloque en Supabase SQL Editor
-- Panel: https://supabase.com/dashboard → SQL Editor → New query
-- =============================================

-- ---- 1. TABLA: recommendations ----
create table if not exists public.recommendations (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  objetivo    text not null,
  clima       text not null,
  espacio     text not null,
  presupuesto text not null,
  experiencia text not null,
  resultados  jsonb not null default '[]',
  motor       text not null default 'tau-prolog',
  notas       text not null default '',
  created_at  timestamptz not null default now()
);

create index if not exists idx_recommendations_user_id
  on public.recommendations (user_id, created_at desc);

alter table public.recommendations enable row level security;

drop policy if exists "usuarios_select_propio" on public.recommendations;
drop policy if exists "usuarios_insert_propio" on public.recommendations;
drop policy if exists "usuarios_update_propio" on public.recommendations;
drop policy if exists "usuarios_delete_propio" on public.recommendations;

create policy "usuarios_select_propio"
  on public.recommendations for select to authenticated
  using (auth.uid() = user_id);

create policy "usuarios_insert_propio"
  on public.recommendations for insert to authenticated
  with check (auth.uid() = user_id);

create policy "usuarios_update_propio"
  on public.recommendations for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "usuarios_delete_propio"
  on public.recommendations for delete to authenticated
  using (auth.uid() = user_id);

-- ---- 2. TABLA: breed_reviews (opiniones comunidad) ----
create table if not exists public.breed_reviews (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  user_nombre  text not null default 'Anonimo',
  raza         text not null,
  puntuacion   int  not null check (puntuacion between 1 and 5),
  comentario   text not null default '',
  created_at   timestamptz not null default now(),
  constraint chk_raza_valida check (raza in (
    'leghorn','rhode_island_red','cuello_desnudo','new_hampshire',
    'australorp','broiler','isa_brown','criollo','plymouth_rock'
  ))
);

create unique index if not exists idx_one_review_per_breed
  on public.breed_reviews (user_id, raza);

create index if not exists idx_breed_reviews_raza
  on public.breed_reviews (raza, created_at desc);

alter table public.breed_reviews enable row level security;

drop policy if exists "todos_leen_resenas"         on public.breed_reviews;
drop policy if exists "usuario_crud_propia_resena"  on public.breed_reviews;

create policy "todos_leen_resenas"
  on public.breed_reviews for select
  using (true);

create policy "usuario_crud_propia_resena"
  on public.breed_reviews for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---- VERIFICACION ----
select table_name, row_security
from information_schema.tables
where table_schema = 'public'
  and table_name in ('recommendations', 'breed_reviews');

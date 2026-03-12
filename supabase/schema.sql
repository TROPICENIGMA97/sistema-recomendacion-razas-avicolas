-- =============================================
-- Schema: Sistema de Recomendacion Avicola
-- Cuichapa, Veracruz
-- Run this in the Supabase SQL Editor
-- =============================================

-- Tabla de recomendaciones por usuario
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

-- Indices para consultas rapidas por usuario
create index if not exists idx_recommendations_user_id
  on public.recommendations (user_id, created_at desc);

-- RLS: cada usuario solo ve y modifica sus propios registros
alter table public.recommendations enable row level security;

drop policy if exists "usuarios_crud_propio" on public.recommendations;
drop policy if exists "usuarios_select_propio" on public.recommendations;
drop policy if exists "usuarios_insert_propio" on public.recommendations;
drop policy if exists "usuarios_update_propio" on public.recommendations;
drop policy if exists "usuarios_delete_propio" on public.recommendations;

create policy "usuarios_select_propio"
  on public.recommendations
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "usuarios_insert_propio"
  on public.recommendations
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "usuarios_update_propio"
  on public.recommendations
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "usuarios_delete_propio"
  on public.recommendations
  for delete
  to authenticated
  using (auth.uid() = user_id);

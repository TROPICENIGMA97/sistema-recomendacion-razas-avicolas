-- =============================================
-- Tabla: breed_reviews (opiniones de la comunidad)
-- Ejecutar en Supabase SQL Editor
-- =============================================

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

-- Un usuario solo puede tener una opinion por raza
create unique index if not exists idx_one_review_per_breed
  on public.breed_reviews (user_id, raza);

create index if not exists idx_breed_reviews_raza
  on public.breed_reviews (raza, created_at desc);

-- RLS
alter table public.breed_reviews enable row level security;

drop policy if exists "todos_leen_resenas"        on public.breed_reviews;
drop policy if exists "usuario_crud_propia_resena" on public.breed_reviews;

-- Todos los usuarios autenticados pueden leer todas las opiniones
create policy "todos_leen_resenas"
  on public.breed_reviews for select
  using (true);

-- Cada usuario solo puede crear/editar/eliminar sus propias opiniones
create policy "usuario_crud_propia_resena"
  on public.breed_reviews for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

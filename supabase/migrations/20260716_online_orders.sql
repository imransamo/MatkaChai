-- Adds online ordering to an existing Matka Chai Supabase project.
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  phone text not null,
  fulfilment_type text not null check (fulfilment_type in ('delivery','pickup')),
  delivery_phase text check (delivery_phase is null or delivery_phase in ('DHA Phase 4','DHA Phase 5','DHA Phase 6','DHA Phase 8')),
  delivery_address text,
  payment_method text not null default 'cash' check (payment_method = 'cash'),
  items jsonb not null check (jsonb_typeof(items) = 'array' and jsonb_array_length(items) > 0),
  subtotal numeric(12,2) not null check (subtotal >= 0),
  delivery_fee numeric(12,2) not null default 0 check (delivery_fee >= 0),
  total numeric(12,2) not null check (total >= 0),
  notes text,
  source text not null default 'website' check (source in ('website','chat')),
  status text not null default 'new' check (status in ('new','confirmed','preparing','ready','out_for_delivery','completed','cancelled')),
  notification_status text not null default 'pending' check (notification_status in ('pending','sent','not_configured','failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (fulfilment_type = 'pickup' and delivery_phase is null and delivery_address is null and delivery_fee = 0)
    or
    (fulfilment_type = 'delivery' and delivery_phase is not null and delivery_address is not null)
  )
);

create index if not exists orders_created_idx on public.orders(created_at desc);
create index if not exists orders_status_idx on public.orders(status, created_at desc);
drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at before update on public.orders for each row execute function public.set_updated_at();

alter table public.orders enable row level security;
drop policy if exists "admins_manage_orders" on public.orders;
create policy "admins_manage_orders" on public.orders for all to authenticated using (public.is_admin()) with check (public.is_admin());

update public.menu_items as item
set image_url = image.image_url
from (values
  ('chai-1','/images/matka-chai-fine-matka.webp'),
  ('chai-2','/images/elaichi-chai-fine-matka.webp'),
  ('chai-3','/images/malai-badam-chai-fine-matka.webp'),
  ('chai-4','/images/kashmiri-chai-fine-matka.webp'),
  ('chai-5','/images/chocolate-chai-fine-matka.webp'),
  ('chai-6','/images/green-tea-fine-matka.webp'),
  ('coffee-1','/images/hot-coffee-fine-matka.webp'),
  ('coffee-2','/images/caramel-iced-latte-glass.webp'),
  ('coffee-3','/images/mocha-iced-latte-glass.webp'),
  ('cooler-1','/images/mint-slush-art-matka.webp'),
  ('cooler-2','/images/pineapple-slush-art-matka.webp'),
  ('cooler-3','/images/blueberry-slush-art-matka.webp'),
  ('cooler-4','/images/lychee-slush-art-matka.webp'),
  ('cooler-5','/images/raspberry-slush-art-matka.webp'),
  ('cooler-6','/images/strawberry-slush-art-matka.webp'),
  ('cooler-7','/images/peach-slush-art-matka.webp'),
  ('fries-1','/images/classic-crispo-fine-matka.webp'),
  ('fries-2','/images/masala-fries-fine-matka.webp'),
  ('fries-3','/images/matka-fries-fine-matka.webp'),
  ('fries-4','/images/loaded-fries-fine-matka.webp'),
  ('fries-5','/images/pepperoni-pizza-fries-fine-matka.webp'),
  ('fries-6','/images/nuggets-fries-fine-matka.webp'),
  ('fries-7','/images/chicken-strips-fries-fine-matka.webp'),
  ('fries-8','/images/cheese-sticks-fries-fine-matka.webp'),
  ('main-1','/images/chicken-biryani-fine-handi.webp'),
  ('main-2','/images/beef-biryani-fine-handi.webp'),
  ('main-3','/images/beef-nalli-biryani-fine-handi.webp'),
  ('main-4','/images/chicken-handi-fine-handi.webp'),
  ('main-5','/images/chicken-reshmi-handi-fine-handi.webp'),
  ('main-6','/images/chicken-karahi-fine-handi.webp'),
  ('rosh-1','/images/lamb-rosh-fine-handi.webp'),
  ('rosh-2','/images/mutton-rosh-fine-handi.webp')
) as image(id, image_url)
where item.id = image.id;

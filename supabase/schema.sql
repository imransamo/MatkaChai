-- MATKA CHAI WEBSITE DATABASE
-- Run this entire file once in Supabase Dashboard > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.menu_categories (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id text primary key default gen_random_uuid()::text,
  category_id text not null references public.menu_categories(id) on delete cascade,
  name text not null,
  description text,
  price numeric(12,2) not null check (price >= 0),
  image_url text,
  badge text,
  is_signature boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.franchise_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text not null,
  city text not null,
  preferred_location text,
  investment_range text not null,
  experience text,
  has_property boolean not null default false,
  format_interest text not null,
  message text,
  source text not null default 'matkachai.pk',
  status text not null default 'new' check (status in ('new','reviewing','contacted','qualified','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  subject text not null default 'General enquiry',
  message text not null,
  source text not null default 'matkachai.pk',
  status text not null default 'new' check (status in ('new','read','replied','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  phone text not null,
  fulfilment_type text not null check (fulfilment_type in ('delivery','pickup')),
  delivery_phase text check (delivery_phase is null or delivery_phase in ('DHA Phase 4','DHA Phase 5','DHA Phase 6','DHA Phase 8')),
  delivery_address text,
  payment_method text not null default 'cash' check (payment_method in ('cash')),
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

create index if not exists menu_items_category_idx on public.menu_items(category_id, sort_order);
create index if not exists franchise_leads_created_idx on public.franchise_leads(created_at desc);
create index if not exists franchise_leads_status_idx on public.franchise_leads(status);
create index if not exists contact_messages_created_idx on public.contact_messages(created_at desc);
create index if not exists orders_created_idx on public.orders(created_at desc);
create index if not exists orders_status_idx on public.orders(status, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists menu_categories_updated_at on public.menu_categories;
create trigger menu_categories_updated_at before update on public.menu_categories for each row execute function public.set_updated_at();
drop trigger if exists menu_items_updated_at on public.menu_items;
create trigger menu_items_updated_at before update on public.menu_items for each row execute function public.set_updated_at();
drop trigger if exists franchise_leads_updated_at on public.franchise_leads;
create trigger franchise_leads_updated_at before update on public.franchise_leads for each row execute function public.set_updated_at();
drop trigger if exists contact_messages_updated_at on public.contact_messages;
create trigger contact_messages_updated_at before update on public.contact_messages for each row execute function public.set_updated_at();
drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at before update on public.orders for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

alter table public.admins enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.franchise_leads enable row level security;
alter table public.contact_messages enable row level security;
alter table public.orders enable row level security;

-- Admins can confirm their own administrator record.
drop policy if exists "admins_read_own" on public.admins;
create policy "admins_read_own" on public.admins for select to authenticated using (user_id = auth.uid());

-- Public users can only read active menu data.
drop policy if exists "public_read_active_categories" on public.menu_categories;
create policy "public_read_active_categories" on public.menu_categories for select to anon, authenticated using (is_active = true or public.is_admin());
drop policy if exists "public_read_active_items" on public.menu_items;
create policy "public_read_active_items" on public.menu_items for select to anon, authenticated using (is_active = true or public.is_admin());

-- Only registered administrators can edit menu data from the owner dashboard.
drop policy if exists "admins_manage_categories" on public.menu_categories;
create policy "admins_manage_categories" on public.menu_categories for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admins_manage_items" on public.menu_items;
create policy "admins_manage_items" on public.menu_items for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Enquiries are inserted by the server using the service-role key. Only admins may read/update them.
drop policy if exists "admins_manage_franchise_leads" on public.franchise_leads;
create policy "admins_manage_franchise_leads" on public.franchise_leads for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admins_manage_contact_messages" on public.contact_messages;
create policy "admins_manage_contact_messages" on public.contact_messages for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admins_manage_orders" on public.orders;
create policy "admins_manage_orders" on public.orders for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Seed categories.
insert into public.menu_categories (id, name, slug, description, sort_order, is_active) values
('cat-chai', 'Signature Chai', 'chai', 'Slow-brewed favourites served with the warmth of Pakistani hospitality.', 1, true),
('cat-coffee', 'Coffee', 'coffee', 'Comforting hot coffee and café-style favourites.', 2, true),
('cat-coolers', 'Coolers', 'coolers', 'Bright, refreshing drinks for Karachi evenings.', 3, true),
('cat-fries', 'Fries & Sides', 'fries-sides', 'Crunchy, loaded and made for sharing.', 4, true),
('cat-mains', 'Matka Biryani & Mains', 'mains', 'Hearty desi food served with bold flavour and warmth.', 5, true),
('cat-rosh', 'Rosh', 'rosh', 'Tender meat, clear broth and traditional comfort.', 6, true)
on conflict (id) do update set name = excluded.name, slug = excluded.slug, description = excluded.description, sort_order = excluded.sort_order;

-- Seed menu items. IDs remain stable so rerunning this script will not duplicate them.
insert into public.menu_items (id, category_id, name, description, price, image_url, badge, is_signature, is_active, sort_order) values
('chai-1','cat-chai','Matka Chai','Our signature creamy doodh patti served in an earthen matka.',250,'/images/hero-matka-photo.png','Signature',true,true,1),
('chai-2','cat-chai','Elachi Chai','Aromatic cardamom chai, rich and comforting.',300,null,null,false,true,2),
('chai-3','cat-chai','Malai Badam Chai','Creamy chai finished with delicate malai and almond slivers.',400,'/images/malai-badam-chai-fine-matka.webp','Favourite',true,true,3),
('chai-4','cat-chai','Kashmiri Chai','Pink tea with a delicate nutty finish.',400,null,null,false,true,4),
('chai-5','cat-chai','Chocolate Chai','A playful chocolate twist on classic chai.',400,null,null,false,true,5),
('chai-6','cat-chai','Green Tea','Light, clean and soothing.',250,null,null,false,true,6),
('coffee-1','cat-coffee','Coffee','Classic hot coffee.',300,null,null,false,true,1),
('coffee-2','cat-coffee','Caramel Latte','Chilled espresso and milk with caramel traced inside the glass.',650,'/images/caramel-iced-latte-glass.webp',null,false,true,2),
('coffee-3','cat-coffee','Mocha Latte','Chilled espresso, milk and cocoa with chocolate traced inside the glass.',650,'/images/mocha-iced-latte-glass.webp',null,false,true,3),
('cooler-1','cat-coolers','Mint Lemonade','Icy lime and fresh mint slush served in a hand-painted art matka.',500,'/images/mint-slush-art-matka.webp','Refreshing',true,true,1),
('cooler-2','cat-coolers','Pineapple','Tropical pineapple cooler.',500,null,null,false,true,2),
('cooler-3','cat-coolers','Blue Berry','Sweet-tart berry slush.',500,null,null,false,true,3),
('cooler-4','cat-coolers','Lychee','Floral lychee cooler.',500,null,null,false,true,4),
('cooler-5','cat-coolers','Raspberry','Bold raspberry slush.',500,null,null,false,true,5),
('cooler-6','cat-coolers','Strawberry','Classic strawberry cooler.',500,null,null,false,true,6),
('cooler-7','cat-coolers','Peach','Juicy peach slush.',500,null,null,false,true,7),
('fries-1','cat-fries','Classic Crispo','Crispy golden fries.',350,null,null,false,true,1),
('fries-2','cat-fries','Masala Fries','Fries tossed in our desi spice blend.',400,null,null,false,true,2),
('fries-3','cat-fries','Matka Fries','Seasoned fries served in a finely crafted terracotta matka.',400,'/images/matka-fries-fine-matka.webp','Signature',true,true,3),
('fries-4','cat-fries','Loaded Fries','Cheesy, saucy and generously loaded in a finely crafted terracotta matka.',650,'/images/loaded-fries-fine-matka.webp','Popular',true,true,4),
('fries-5','cat-fries','Peproni Pizza Fries','Pizza flavours, pepperoni and fries in one indulgent plate.',750,null,null,false,true,5),
('fries-6','cat-fries','Nuggets 6pcs with Fries','Golden chicken nuggets with fries.',850,null,null,false,true,6),
('fries-7','cat-fries','Chicken Strips with Fries','Crispy chicken strips with fries.',850,null,null,false,true,7),
('fries-8','cat-fries','Cheese Sticks with Fries','Crisp cheese sticks with fries.',1000,null,null,false,true,8),
('main-1','cat-mains','Matka Chicken Biryani','Karachi-style basmati rice and spiced chicken served in a finely crafted handi.',1200,'/images/chicken-biryani-fine-handi.webp','Signature',true,true,1),
('main-2','cat-mains','Matka Beef Biryani','Slow-cooked beef and aromatic basmati rice.',1500,null,null,false,true,2),
('main-3','cat-mains','Matka Nalli Biryani','Rich beef nalli biryani served in a finely crafted terracotta handi.',1800,'/images/beef-nalli-biryani-fine-handi.webp','Chef Pick',true,true,3),
('main-4','cat-mains','Chicken Handi','Creamy, comforting chicken handi.',1600,null,null,false,true,4),
('main-5','cat-mains','Chicken Reshmi Handi','Silky, rich and mildly spiced.',1800,null,null,false,true,5),
('main-6','cat-mains','Chicken Kadhai','Tomato, ginger and green chilli finished fresh.',1200,null,null,false,true,6),
('rosh-1','cat-rosh','Lamb Rosh','Tender bone-in lamb, potatoes and green chilli in a clear broth, served in a fine clay handi.',1500,'/images/lamb-rosh-fine-handi.webp','Signature',true,true,1),
('rosh-2','cat-rosh','Mutton Rosh','Traditional mutton rosh, slow-cooked and satisfying.',1500,null,null,false,true,2)
on conflict (id) do update set category_id=excluded.category_id, name=excluded.name, description=excluded.description, price=excluded.price, image_url=excluded.image_url, badge=excluded.badge, is_signature=excluded.is_signature, is_active=excluded.is_active, sort_order=excluded.sort_order;

-- Apply the approved serving photography to every existing seeded menu row.
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

-- AFTER creating your owner account in Authentication > Users, run this separately:
-- insert into public.admins (user_id, display_name) values ('PASTE-AUTH-USER-UUID-HERE', 'Imran Ali');

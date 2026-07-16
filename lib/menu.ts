import { seedMenu } from '@/lib/seed-menu';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { MenuCategory, MenuCategoryWithItems, MenuItem } from '@/lib/types';

const preferredMenuImages: Record<string, string> = {
  'chai-1': '/images/matka-chai-real-matka.webp',
  'chai-2': '/images/elaichi-chai-real-matka.webp',
  'chai-3': '/images/malai-badam-chai-real-matka.webp',
  'chai-4': '/images/kashmiri-chai-real-matka.webp',
  'chai-5': '/images/chocolate-chai-real-matka.webp',
  'chai-6': '/images/green-tea-real-matka.webp',
  'coffee-1': '/images/hot-coffee-fine-matka.webp',
  'coffee-2': '/images/caramel-iced-latte-glass.webp',
  'coffee-3': '/images/mocha-iced-latte-glass.webp',
  'cooler-1': '/images/mint-slush-art-matka.webp',
  'cooler-2': '/images/pineapple-slush-art-matka.webp',
  'cooler-3': '/images/blueberry-slush-art-matka.webp',
  'cooler-4': '/images/lychee-slush-art-matka.webp',
  'cooler-5': '/images/raspberry-slush-art-matka.webp',
  'cooler-6': '/images/strawberry-slush-art-matka.webp',
  'cooler-7': '/images/peach-slush-art-matka.webp',
  'fries-1': '/images/classic-crispo-fine-matka.webp',
  'fries-2': '/images/masala-fries-fine-matka.webp',
  'fries-3': '/images/matka-fries-fine-matka.webp',
  'fries-4': '/images/loaded-fries-fine-matka.webp',
  'fries-5': '/images/pepperoni-pizza-fries-fine-matka.webp',
  'fries-6': '/images/nuggets-fries-fine-matka.webp',
  'fries-7': '/images/chicken-strips-fries-fine-matka.webp',
  'fries-8': '/images/cheese-sticks-fries-fine-matka.webp',
  'main-1': '/images/chicken-biryani-fine-handi.webp',
  'main-2': '/images/beef-biryani-fine-handi.webp',
  'main-3': '/images/beef-nalli-biryani-fine-handi.webp',
  'main-4': '/images/chicken-handi-fine-handi.webp',
  'main-5': '/images/chicken-reshmi-handi-fine-handi.webp',
  'main-6': '/images/chicken-karahi-fine-handi.webp',
  'rosh-1': '/images/lamb-rosh-fine-handi.webp',
  'rosh-2': '/images/mutton-rosh-fine-handi.webp',
};

const legacyMenuImages = new Set([
  '/images/chai.svg',
  '/images/cooler.svg',
  '/images/fries.svg',
  '/images/biryani.svg',
  '/images/rosh.svg',
  '/images/hero-matka-photo.png',
  '/images/cooler-photo.png',
  '/images/fries-photo.png',
  '/images/biryani-photo.png',
  '/images/rosh-photo.png',
  '/images/matka-chai-fine-matka.webp',
  '/images/elaichi-chai-fine-matka.webp',
  '/images/malai-badam-chai-fine-matka.webp',
  '/images/kashmiri-chai-fine-matka.webp',
  '/images/chocolate-chai-fine-matka.webp',
  '/images/green-tea-fine-matka.webp',
]);

function withPreferredMenuImage(item: MenuItem): MenuItem {
  const preferredImage = preferredMenuImages[item.id];
  if (!preferredImage || (item.image_url && !legacyMenuImages.has(item.image_url))) return item;
  return { ...item, image_url: preferredImage };
}

export async function getMenu(): Promise<MenuCategoryWithItems[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return seedMenu;

  const [{ data: categories, error: categoryError }, { data: items, error: itemError }] = await Promise.all([
    supabase.from('menu_categories').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('menu_items').select('*').eq('is_active', true).order('sort_order'),
  ]);

  if (categoryError || itemError || !categories || !items) return seedMenu;

  return (categories as MenuCategory[]).map((category) => ({
    ...category,
    items: (items as MenuItem[])
      .filter((item) => item.category_id === category.id)
      .map(withPreferredMenuImage),
  }));
}

export async function getSignatureItems() {
  const menu = await getMenu();
  return menu.flatMap((category) => category.items).filter((item) => item.is_signature).slice(0, 6);
}

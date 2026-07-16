import { seedMenu } from '@/lib/seed-menu';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { MenuCategory, MenuCategoryWithItems, MenuItem } from '@/lib/types';

const preferredMenuImages: Record<string, string> = {
  'chai-3': '/images/malai-badam-chai-fine-matka.webp',
  'coffee-2': '/images/caramel-iced-latte-glass.webp',
  'coffee-3': '/images/mocha-iced-latte-glass.webp',
  'cooler-1': '/images/mint-slush-art-matka.webp',
  'fries-3': '/images/matka-fries-fine-matka.webp',
  'fries-4': '/images/loaded-fries-fine-matka.webp',
  'main-1': '/images/chicken-biryani-fine-handi.webp',
  'main-3': '/images/beef-nalli-biryani-fine-handi.webp',
  'rosh-1': '/images/lamb-rosh-fine-handi.webp',
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

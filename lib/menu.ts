import { seedMenu } from '@/lib/seed-menu';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { MenuCategory, MenuCategoryWithItems, MenuItem } from '@/lib/types';

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
    items: (items as MenuItem[]).filter((item) => item.category_id === category.id),
  }));
}

export async function getSignatureItems() {
  const menu = await getMenu();
  return menu.flatMap((category) => category.items).filter((item) => item.is_signature).slice(0, 6);
}

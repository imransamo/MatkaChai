'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin';

function value(formData: FormData, key: string, max = 500) {
  return String(formData.get(key) || '').trim().slice(0, max);
}

export async function signOutAction() {
  const { supabase } = await requireAdmin();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

export async function updateMenuItemAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = value(formData, 'id', 80);
  const price = Number(value(formData, 'price', 20));
  const sortOrder = Number(value(formData, 'sort_order', 10));
  if (!id || !Number.isFinite(price) || price < 0) return;

  const { error } = await supabase.from('menu_items').update({
    name: value(formData, 'name', 120),
    description: value(formData, 'description', 500) || null,
    price,
    badge: value(formData, 'badge', 50) || null,
    image_url: value(formData, 'image_url', 500) || null,
    is_signature: formData.get('is_signature') === 'on',
    is_active: formData.get('is_active') === 'on',
    sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
  }).eq('id', id);

  if (error) console.error('Update menu item:', error.message);
  revalidatePath('/menu');
  revalidatePath('/');
  revalidatePath('/admin/dashboard');
}

export async function createMenuItemAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const price = Number(value(formData, 'price', 20));
  if (!value(formData, 'category_id', 80) || !value(formData, 'name', 120) || !Number.isFinite(price)) return;

  const { error } = await supabase.from('menu_items').insert({
    category_id: value(formData, 'category_id', 80),
    name: value(formData, 'name', 120),
    description: value(formData, 'description', 500) || null,
    price,
    badge: value(formData, 'badge', 50) || null,
    image_url: value(formData, 'image_url', 500) || null,
    is_signature: formData.get('is_signature') === 'on',
    is_active: formData.get('is_active') === 'on',
    sort_order: Number(value(formData, 'sort_order', 10)) || 0,
  });

  if (error) console.error('Create menu item:', error.message);
  revalidatePath('/menu');
  revalidatePath('/');
  revalidatePath('/admin/dashboard');
}

export async function updateLeadStatusAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = value(formData, 'id', 80);
  const status = value(formData, 'status', 30);
  if (!id || !['new', 'reviewing', 'contacted', 'qualified', 'closed'].includes(status)) return;
  await supabase.from('franchise_leads').update({ status }).eq('id', id);
  revalidatePath('/admin/dashboard');
}

export async function updateMessageStatusAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = value(formData, 'id', 80);
  const status = value(formData, 'status', 30);
  if (!id || !['new', 'read', 'replied', 'archived'].includes(status)) return;
  await supabase.from('contact_messages').update({ status }).eq('id', id);
  revalidatePath('/admin/dashboard');
}

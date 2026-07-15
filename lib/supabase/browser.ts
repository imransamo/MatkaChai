'use client';

import { createBrowserClient } from '@supabase/ssr';
import { env } from '@/lib/env';

export function createSupabaseBrowserClient() {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error('Supabase is not configured. Add the public Supabase environment variables.');
  }
  return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
}

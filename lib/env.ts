export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://matkachai.pk',
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  mapsUrl: process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL || 'https://maps.google.com/?q=Creek+Walk+DHA+Phase+8+Karachi',
};

export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);
export const isSupabaseAdminConfigured = Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);

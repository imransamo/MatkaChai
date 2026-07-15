# Matka Chai — Production Website

A full Next.js 16 website for **matkachai.pk**, built for Vercel hosting and Supabase database/authentication.

## Included

- Premium responsive Matka Chai brand website
- Home, Menu, Story, Visit and Franchise pages
- Database-powered menu with safe fallback data
- Franchise application form saved to Supabase
- Contact form saved to Supabase
- Protected owner login and dashboard
- Edit prices, names, descriptions, signature badges and availability
- Add new menu items
- Review and update franchise lead statuses
- Review and update customer message statuses
- WhatsApp and Google Maps links
- SEO metadata, sitemap, robots file and local business structured data
- Security headers and Supabase Row Level Security policies

## Recommended stack

- **Vercel:** website hosting, server functions, CDN and domain
- **Supabase:** Postgres database, administrator authentication and future image storage

Vercel no longer offers first-party Vercel Postgres for new projects; database providers are installed through its Marketplace. Supabase remains easier here because it combines Postgres, Auth, Storage and a dashboard.

## 1. Create Supabase

1. Create a new Supabase project.
2. Open **SQL Editor**.
3. Paste and run the complete file: `supabase/schema.sql`.
4. Open **Authentication > Users > Add user**.
5. Create your owner email/password and mark the email confirmed.
6. Copy that user's UUID.
7. In SQL Editor run:

```sql
insert into public.admins (user_id, display_name)
values ('PASTE-AUTH-USER-UUID-HERE', 'Imran Ali');
```

## 2. Get Supabase keys

In Supabase open **Project Settings > API** and copy:

- Project URL
- Publishable/anon key
- Service role key

Never put the service-role key in a public variable or commit it to GitHub.

## 3. Configure website

Copy `.env.example` to `.env.local` and enter real values:

```env
NEXT_PUBLIC_SITE_URL=https://matkachai.pk
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SECRET_SERVICE_ROLE_KEY
NEXT_PUBLIC_WHATSAPP_NUMBER=923001234567
NEXT_PUBLIC_GOOGLE_MAPS_URL=https://maps.google.com/?q=Creek+Walk+DHA+Phase+8+Karachi
```

The WhatsApp number must use international format without `+`, spaces or dashes.

## 4. Test locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Owner dashboard: `http://localhost:3000/admin/login`

## 5. Deploy on Vercel

1. Upload this folder to a new GitHub repository.
2. In Vercel choose **Add New > Project** and import the repository.
3. Add all six environment variables from `.env.local` to Vercel.
4. Deploy.
5. Open **Project Settings > Domains** and add `matkachai.pk` and `www.matkachai.pk`.
6. Vercel will show the DNS records to add where the domain is registered.
7. Set `matkachai.pk` as the primary domain and redirect `www` to it.

## Important customisation before launch

- Replace the temporary WhatsApp number in Vercel environment variables.
- Replace Google Maps URL with the exact live pin.
- Replace the included SVG demonstration art in `public/images/` with real professional Matka Chai photographs using the same filenames, or change image paths in the dashboard.
- Confirm current opening hours.
- Check all menu prices in the owner dashboard.
- Replace `hello@matkachai.pk` after creating the mailbox.

## Image sizes recommended

- `hero.svg` replacement: 2000 × 1350 px, landscape
- Product images: 1200 × 900 px, 4:3
- `room.svg` replacement: 1600 × 1200 px
- Use WebP or AVIF for photographs where possible.

## Database safety

- Public users can read only active menu categories and items.
- Public forms do not receive the service-role key; inserts happen on secure server routes.
- Only authenticated users listed in `public.admins` can edit menu data or read leads/messages.
- Supabase RLS is enabled on every exposed table.

export type MenuCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
};

export type MenuItem = {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  badge: string | null;
  is_signature: boolean;
  is_active: boolean;
  sort_order: number;
};

export type MenuCategoryWithItems = MenuCategory & {
  items: MenuItem[];
};

export type FranchiseLead = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  city: string;
  preferred_location: string | null;
  investment_range: string;
  experience: string | null;
  has_property: boolean;
  format_interest: string;
  message: string | null;
  status: string;
  created_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  subject: string;
  message: string;
  status: string;
  created_at: string;
};

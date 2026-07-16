import type { MenuCategoryWithItems } from './types';

const makeId = (value: string) => value;

export const seedMenu: MenuCategoryWithItems[] = [
  {
    id: makeId('cat-chai'),
    name: 'Signature Chai',
    slug: 'chai',
    description: 'Slow-brewed favourites served with the warmth of Pakistani hospitality.',
    sort_order: 1,
    is_active: true,
    items: [
      { id: 'chai-1', category_id: 'cat-chai', name: 'Matka Chai', description: 'Our signature creamy doodh patti served in an earthen matka.', price: 250, image_url: '/images/hero-matka-photo.png', badge: 'Signature', is_signature: true, is_active: true, sort_order: 1 },
      { id: 'chai-2', category_id: 'cat-chai', name: 'Elachi Chai', description: 'Aromatic cardamom chai, rich and comforting.', price: 300, image_url: null, badge: null, is_signature: false, is_active: true, sort_order: 2 },
      { id: 'chai-3', category_id: 'cat-chai', name: 'Malai Badam Chai', description: 'Creamy chai finished with delicate malai and almond slivers.', price: 400, image_url: '/images/malai-badam-chai-fine-matka.webp', badge: 'Favourite', is_signature: true, is_active: true, sort_order: 3 },
      { id: 'chai-4', category_id: 'cat-chai', name: 'Kashmiri Chai', description: 'Pink tea with a delicate nutty finish.', price: 400, image_url: null, badge: null, is_signature: false, is_active: true, sort_order: 4 },
      { id: 'chai-5', category_id: 'cat-chai', name: 'Chocolate Chai', description: 'A playful chocolate twist on classic chai.', price: 400, image_url: null, badge: null, is_signature: false, is_active: true, sort_order: 5 },
      { id: 'chai-6', category_id: 'cat-chai', name: 'Green Tea', description: 'Light, clean and soothing.', price: 250, image_url: null, badge: null, is_signature: false, is_active: true, sort_order: 6 }
    ]
  },
  {
    id: makeId('cat-coffee'),
    name: 'Coffee',
    slug: 'coffee',
    description: 'Comforting hot coffee and café-style favourites.',
    sort_order: 2,
    is_active: true,
    items: [
      { id: 'coffee-1', category_id: 'cat-coffee', name: 'Coffee', description: 'Classic hot coffee.', price: 300, image_url: null, badge: null, is_signature: false, is_active: true, sort_order: 1 },
      { id: 'coffee-2', category_id: 'cat-coffee', name: 'Caramel Latte', description: 'Chilled espresso and milk with caramel traced inside the glass.', price: 650, image_url: '/images/caramel-iced-latte-glass.webp', badge: null, is_signature: false, is_active: true, sort_order: 2 },
      { id: 'coffee-3', category_id: 'cat-coffee', name: 'Mocha Latte', description: 'Chilled espresso, milk and cocoa with chocolate traced inside the glass.', price: 650, image_url: '/images/mocha-iced-latte-glass.webp', badge: null, is_signature: false, is_active: true, sort_order: 3 }
    ]
  },
  {
    id: makeId('cat-coolers'),
    name: 'Coolers',
    slug: 'coolers',
    description: 'Bright, refreshing drinks for Karachi evenings.',
    sort_order: 3,
    is_active: true,
    items: [
      { id: 'cooler-1', category_id: 'cat-coolers', name: 'Mint Lemonade', description: 'Icy lime and fresh mint slush served in a hand-painted art matka.', price: 500, image_url: '/images/mint-slush-art-matka.webp', badge: 'Refreshing', is_signature: true, is_active: true, sort_order: 1 },
      { id: 'cooler-2', category_id: 'cat-coolers', name: 'Pineapple', description: 'Tropical pineapple cooler.', price: 500, image_url: null, badge: null, is_signature: false, is_active: true, sort_order: 2 },
      { id: 'cooler-3', category_id: 'cat-coolers', name: 'Blue Berry', description: 'Sweet-tart berry slush.', price: 500, image_url: null, badge: null, is_signature: false, is_active: true, sort_order: 3 },
      { id: 'cooler-4', category_id: 'cat-coolers', name: 'Lychee', description: 'Floral lychee cooler.', price: 500, image_url: null, badge: null, is_signature: false, is_active: true, sort_order: 4 },
      { id: 'cooler-5', category_id: 'cat-coolers', name: 'Raspberry', description: 'Bold raspberry slush.', price: 500, image_url: null, badge: null, is_signature: false, is_active: true, sort_order: 5 },
      { id: 'cooler-6', category_id: 'cat-coolers', name: 'Strawberry', description: 'Classic strawberry cooler.', price: 500, image_url: null, badge: null, is_signature: false, is_active: true, sort_order: 6 },
      { id: 'cooler-7', category_id: 'cat-coolers', name: 'Peach', description: 'Juicy peach slush.', price: 500, image_url: null, badge: null, is_signature: false, is_active: true, sort_order: 7 }
    ]
  },
  {
    id: makeId('cat-fries'),
    name: 'Fries & Sides',
    slug: 'fries-sides',
    description: 'Crunchy, loaded and made for sharing.',
    sort_order: 4,
    is_active: true,
    items: [
      { id: 'fries-1', category_id: 'cat-fries', name: 'Classic Crispo', description: 'Crispy golden fries.', price: 350, image_url: null, badge: null, is_signature: false, is_active: true, sort_order: 1 },
      { id: 'fries-2', category_id: 'cat-fries', name: 'Masala Fries', description: 'Fries tossed in our desi spice blend.', price: 400, image_url: null, badge: null, is_signature: false, is_active: true, sort_order: 2 },
      { id: 'fries-3', category_id: 'cat-fries', name: 'Matka Fries', description: 'Seasoned fries served in a finely crafted terracotta matka.', price: 400, image_url: '/images/matka-fries-fine-matka.webp', badge: 'Signature', is_signature: true, is_active: true, sort_order: 3 },
      { id: 'fries-4', category_id: 'cat-fries', name: 'Loaded Fries', description: 'Cheesy, saucy and generously loaded in a finely crafted terracotta matka.', price: 650, image_url: '/images/loaded-fries-fine-matka.webp', badge: 'Popular', is_signature: true, is_active: true, sort_order: 4 },
      { id: 'fries-5', category_id: 'cat-fries', name: 'Peproni Pizza Fries', description: 'Pizza flavours, pepperoni and fries in one indulgent plate.', price: 750, image_url: null, badge: null, is_signature: false, is_active: true, sort_order: 5 },
      { id: 'fries-6', category_id: 'cat-fries', name: 'Nuggets 6pcs with Fries', description: 'Golden chicken nuggets with fries.', price: 850, image_url: null, badge: null, is_signature: false, is_active: true, sort_order: 6 },
      { id: 'fries-7', category_id: 'cat-fries', name: 'Chicken Strips with Fries', description: 'Crispy chicken strips with fries.', price: 850, image_url: null, badge: null, is_signature: false, is_active: true, sort_order: 7 },
      { id: 'fries-8', category_id: 'cat-fries', name: 'Cheese Sticks with Fries', description: 'Crisp cheese sticks with fries.', price: 1000, image_url: null, badge: null, is_signature: false, is_active: true, sort_order: 8 }
    ]
  },
  {
    id: makeId('cat-mains'),
    name: 'Matka Biryani & Mains',
    slug: 'mains',
    description: 'Hearty desi food served with bold flavour and warmth.',
    sort_order: 5,
    is_active: true,
    items: [
      { id: 'main-1', category_id: 'cat-mains', name: 'Matka Chicken Biryani', description: 'Karachi-style basmati rice and spiced chicken served in a finely crafted handi.', price: 1200, image_url: '/images/chicken-biryani-fine-handi.webp', badge: 'Signature', is_signature: true, is_active: true, sort_order: 1 },
      { id: 'main-2', category_id: 'cat-mains', name: 'Matka Beef Biryani', description: 'Slow-cooked beef and aromatic basmati rice.', price: 1500, image_url: null, badge: null, is_signature: false, is_active: true, sort_order: 2 },
      { id: 'main-3', category_id: 'cat-mains', name: 'Matka Nalli Biryani', description: 'Rich beef nalli biryani served in a finely crafted terracotta handi.', price: 1800, image_url: '/images/beef-nalli-biryani-fine-handi.webp', badge: 'Chef Pick', is_signature: true, is_active: true, sort_order: 3 },
      { id: 'main-4', category_id: 'cat-mains', name: 'Chicken Handi', description: 'Creamy, comforting chicken handi.', price: 1600, image_url: null, badge: null, is_signature: false, is_active: true, sort_order: 4 },
      { id: 'main-5', category_id: 'cat-mains', name: 'Chicken Reshmi Handi', description: 'Silky, rich and mildly spiced.', price: 1800, image_url: null, badge: null, is_signature: false, is_active: true, sort_order: 5 },
      { id: 'main-6', category_id: 'cat-mains', name: 'Chicken Kadhai', description: 'Tomato, ginger and green chilli finished fresh.', price: 1200, image_url: null, badge: null, is_signature: false, is_active: true, sort_order: 6 }
    ]
  },
  {
    id: makeId('cat-rosh'),
    name: 'Rosh',
    slug: 'rosh',
    description: 'Tender meat, clear broth and traditional comfort.',
    sort_order: 6,
    is_active: true,
    items: [
      { id: 'rosh-1', category_id: 'cat-rosh', name: 'Lamb Rosh', description: 'Tender bone-in lamb, potatoes and green chilli in a clear broth, served in a fine clay handi.', price: 1500, image_url: '/images/lamb-rosh-fine-handi.webp', badge: 'Signature', is_signature: true, is_active: true, sort_order: 1 },
      { id: 'rosh-2', category_id: 'cat-rosh', name: 'Mutton Rosh', description: 'Traditional mutton rosh, slow-cooked and satisfying.', price: 1500, image_url: null, badge: null, is_signature: false, is_active: true, sort_order: 2 }
    ]
  }
];

export const signatureItems = seedMenu.flatMap((category) => category.items).filter((item) => item.is_signature).slice(0, 6);

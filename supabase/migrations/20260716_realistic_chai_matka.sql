-- Keep every chai variety on the same approved handcrafted matka photography.
update public.menu_items as item
set image_url = image.image_url
from (values
  ('chai-1','/images/matka-chai-real-matka.webp'),
  ('chai-2','/images/elaichi-chai-real-matka.webp'),
  ('chai-3','/images/malai-badam-chai-real-matka.webp'),
  ('chai-4','/images/kashmiri-chai-real-matka.webp'),
  ('chai-5','/images/chocolate-chai-real-matka.webp'),
  ('chai-6','/images/green-tea-real-matka.webp')
) as image(id, image_url)
where item.id = image.id;

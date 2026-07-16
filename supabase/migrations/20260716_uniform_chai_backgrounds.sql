-- Apply the approved uniform warm-cream background and garnish styling.
update public.menu_items as item
set image_url = image.image_url
from (values
  ('chai-1','/images/matka-chai-uniform.webp'),
  ('chai-2','/images/elaichi-chai-uniform.webp'),
  ('chai-3','/images/malai-badam-chai-uniform.webp'),
  ('chai-4','/images/kashmiri-chai-uniform.webp'),
  ('chai-5','/images/chocolate-chai-uniform.webp'),
  ('chai-6','/images/green-tea-uniform.webp')
) as image(id, image_url)
where item.id = image.id;

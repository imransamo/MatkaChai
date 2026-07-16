-- Apply the approved cooler-style chai-room background to all chai photography.
update public.menu_items as item
set image_url = image.image_url
from (values
  ('chai-1','/images/matka-chai-cooler-scene.webp'),
  ('chai-2','/images/elaichi-chai-cooler-scene.webp'),
  ('chai-3','/images/malai-badam-chai-cooler-scene.webp'),
  ('chai-4','/images/kashmiri-chai-cooler-scene.webp'),
  ('chai-5','/images/chocolate-chai-cooler-scene.webp'),
  ('chai-6','/images/green-tea-cooler-scene.webp')
) as image(id, image_url)
where item.id = image.id;

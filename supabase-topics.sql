-- ===================================================================
-- Register the twelve lessons
--
-- attendance.topic_slug has a foreign key to this table. It was never
-- filled in for the eleven lessons written after the first, so typing
-- the garden word on any of them was silently refused by the database
-- and the lesson never unlocked. This fixes that for every family.
--
-- Safe to re-run.
-- ===================================================================

insert into public.topics (slug, name, blurb, sort_order, published) values
  ('seedbot', 'Design a Seed Traveller', 'Seeds cannot walk. Engineer one a way to move.', 1, true),
  ('sunpower', 'Catching the Sun', 'The same sunlight that feeds a plant can cook your lunch.', 2, true),
  ('plant', 'The Plant Life Cycle', 'Seed, sprout, plant, flower, fruit — and a seed again.', 3, true),
  ('seasons', 'What Grows When', 'Why lettuce loves February and okra loves July.', 4, true),
  ('myplate', 'Build a Plate', 'Five groups, one plate, and half of it coloured in.', 5, true),
  ('farmtotable', 'How Food Gets To You', 'Every strawberry has a journey. Most of it happens before you see it.', 6, true),
  ('drying', 'Drying the Harvest', 'Take the water out, and the harvest keeps for months.', 7, true),
  ('seedsaving', 'Saving Seeds for Next Year', 'The end of one plant is the start of the next.', 8, true),
  ('pollinators', 'Who Moves the Pollen', 'No pollinators, no fruit. It is that direct.', 9, true),
  ('habitat', 'Everybody Needs a Home', 'Food, water, shelter, space. Miss one and nothing lives there.', 10, true),
  ('compost', 'What Compost Eats', 'Rubbish in one end, soil out the other, and something alive doing the work.', 11, true),
  ('soillayers', 'Under Your Feet', 'Soil is not dirt. It has layers, and it is full of living things.', 12, true)
on conflict (slug) do update set
  name = excluded.name,
  blurb = excluded.blurb,
  sort_order = excluded.sort_order,
  published = true;

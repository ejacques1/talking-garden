/* ------------------------------------------------------------------
   The six DewLab worlds, straight from DHCG's guide sheet.

   ONE COLOUR, SIX GUIDES.
   An earlier version gave every world its own colour and themed the
   whole page in it, so Grow was green from top to bottom. That was
   wrong twice over: the DHCG brand sheet lists green as a highlight,
   not a ground, and three of the six colours were not on that sheet
   at all — they were invented here.

   So every world is now brand blue, and the guide character is what
   tells them apart. Root, Buzz, Wiggles, Tinker, Chef Sprout and
   Mason are DHCG's own artwork and are far more recognisable to a
   child than a hex value.

   `color` is kept on each world because pages read it, and every one
   now points at the brand blue.
------------------------------------------------------------------- */
var WORLDS = [
  { key:'grow', img:'img/guide-root.png',     guide:'Root',        subject:'Agriculture & Plant Science',
    name:'Grow', color:'#0071BC',
    blurb:'From seed to harvest. Plants, gardens, crops and the science of growing.',
    topics:['Seeds & germination','Plant parts','Garden systems','Harvesting'] },

  { key:'protect', img:'img/guide-buzz.png',  guide:'Buzz',        subject:'Conservation & Nature',
    name:'Protect', color:'#0071BC',
    blurb:'Care for living things and their homes. Pollinators, wildlife and habitats.',
    topics:['Pollinators & insects','Habitats','Water & air','Stewardship'] },

  { key:'soil', img:'img/guide-wiggles.png',     guide:'Wiggles',     subject:'Soil & Sustainability',
    name:'Soil', color:'#0071BC',
    blurb:'Build healthy soil, build a better future. Worms, compost and nutrient cycles.',
    topics:['Soil layers','Composting','Worms & microbes','Nutrient cycling'] },

  { key:'create', img:'img/guide-tinker.png',   guide:'Tinker',      subject:'STEAM & Innovation',
    name:'Create', color:'#0071BC',
    blurb:'Imagine, build and innovate. Science, technology, engineering, art and maths in action.',
    topics:['Experiments','Engineering & design','Simple machines','Problem solving'] },

  { key:'nourish', img:'img/guide-chefsprout.png',  guide:'Chef Sprout', subject:'Food, Health & Nutrition',
    name:'Nourish', color:'#0071BC',
    blurb:'Eat well. Live well. Be well. Nutrition, cooking and where food comes from.',
    topics:['MyPlate & nutrition','Farm to table','Cooking skills','Food safety'] },

  { key:'preserve', img:'img/guide-mason.png', guide:'Mason',       subject:'Preservation & Food Stewardship',
    name:'Preserve', color:'#0071BC',
    blurb:'Save today, savour tomorrow. Preserving harvests and reducing waste.',
    topics:['Canning & freezing','Drying & fermenting','Storage & safety','Seed saving'] }
];

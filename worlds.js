/* ------------------------------------------------------------------
   The six DewLab worlds, straight from DHCG's guide sheet.
   Colours are taken from their own chart, kept inside the brand
   palette so the six read as one family rather than six brands.
------------------------------------------------------------------- */
var WORLDS = [
  { key:'grow', img:'img/guide-root.png',     guide:'Root',        subject:'Agriculture & Plant Science',
    name:'Grow', color:'#639245',
    blurb:'From seed to harvest. Plants, gardens, crops and the science of growing.',
    topics:['Seeds & germination','Plant parts','Garden systems','Harvesting'] },

  { key:'protect', img:'img/guide-buzz.png',  guide:'Buzz',        subject:'Conservation & Nature',
    name:'Protect', color:'#C27A2C',
    blurb:'Care for living things and their homes. Pollinators, wildlife and habitats.',
    topics:['Pollinators & insects','Habitats','Water & air','Stewardship'] },

  { key:'soil', img:'img/guide-wiggles.png',     guide:'Wiggles',     subject:'Soil & Sustainability',
    name:'Soil', color:'#7A5230',
    blurb:'Build healthy soil, build a better future. Worms, compost and nutrient cycles.',
    topics:['Soil layers','Composting','Worms & microbes','Nutrient cycling'] },

  { key:'create', img:'img/guide-tinker.png',   guide:'Tinker',      subject:'STEAM & Innovation',
    name:'Create', color:'#0071BC',
    blurb:'Imagine, build and innovate. Science, technology, engineering, art and maths in action.',
    topics:['Experiments','Engineering & design','Simple machines','Problem solving'] },

  { key:'nourish', img:'img/guide-chefsprout.png',  guide:'Chef Sprout', subject:'Food, Health & Nutrition',
    name:'Nourish', color:'#4E7635',
    blurb:'Eat well. Live well. Be well. Nutrition, cooking and where food comes from.',
    topics:['MyPlate & nutrition','Farm to table','Cooking skills','Food safety'] },

  { key:'preserve', img:'img/guide-mason.png', guide:'Mason',       subject:'Preservation & Food Stewardship',
    name:'Preserve', color:'#8E5AA8',
    blurb:'Save today, savour tomorrow. Preserving harvests and reducing waste.',
    topics:['Canning & freezing','Drying & fermenting','Storage & safety','Seed saving'] }
];

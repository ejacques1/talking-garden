/* ------------------------------------------------------------------
   Shared project data — The Talking Garden
   ------------------------------------------------------------------
   ONE source of truth for every hands-on build. Used by:

     library.html  browsing everything, by track
     topic.html    stage 3, rendered inline so a family never
                   leaves the topic they are working through

   TOPIC_BUILDS below decides which projects a topic offers, and
   which standard each one carries there. The same project can serve
   several topics — the bee house belongs to both Plant Life Cycle
   and Butterfly — so it lives here once, not copied per topic.
------------------------------------------------------------------- */

var TRACKS=[
  {key:'kitchen', emoji:'🍓', name:'Garden to Kitchen', based:'Continues: Strawberry Full Circle · Berry Sweet Jam Fest · Freeze-Ahead Fries · Juice Shop · Nutty Pie Bake-Off · Gobble Good Lunch'},
  {key:'worm', emoji:'🪱', name:'Worm World', based:'Continues: Worm Farm Kickoff · Worm Exploration · Wiggle Worm Cast Harvest'},
  {key:'grow', emoji:'🌱', name:'Grow It', based:'Continues: Fun Fall Planting · Fall Garden Care · MLK Garden Day · Filling the Beds · Fall Harvest'},
  {key:'explore', emoji:'🦋', name:'Garden Explorers', based:'Continues: Cockrell Butterfly Center · Farm Visit · Garden Center Finds · Masterful Garden Visit'},
  {key:'tech', emoji:'💻', name:'Beyond the Garden', based:'A little something for the future builders'}
];

var PROJECTS=[
  { id:'jam', track:'kitchen', emoji:'🍓', color:'var(--berry-l)', flag:'Flagship project',
    title:'The Strawberry Jam Lab', blurb:'Turn fruit into jam — and discover why heat makes it set.',
    meta:{time:'45 min', diff:'Medium', mess:'Messy', help:'Grown-up at the stove'},
    materials:['2 cups strawberries','1 cup sugar','1 Tbsp lemon juice','Pot','Cooking thermometer','Clean jar','Spoon'],
    grownup:'A grown-up handles the hot stove and thermometer.',
    steps:[
      ['Mash the berries','Wash and mash the strawberries right in the pot. Notice how much juice comes out!'],
      ['Add sugar & lemon','Stir in the sugar and lemon juice. The lemon adds acid that helps it set and keeps it safe.'],
      ['Heat it up','Heat slowly, stirring, until it bubbles. Clip the thermometer to the side of the pot.'],
      ['Reach the gel point','Watch the number climb. When it hits 220°F, the jam is done — that’s the "gel point."'],
      ['Jar it','Let it cool, spoon into a clean jar, and keep it in the fridge. Spread on toast and enjoy!']
    ],
    science:'Water boils at 212°F — but jam isn’t done until 220°F! The sugar raises the boiling point, and tiny fruit fibers called <b>pectin</b> link up to trap the juice into a soft gel. That’s why jam jiggles instead of pouring.',
    learn:'boiling point · measurement · food safety & acidity · states of matter' },

  { id:'worm', track:'worm', emoji:'🪱', color:'#EDE3D6', flag:'The one you asked for',
    title:'Worm-in-a-Cup Observatory', blurb:'Take the worm farm home — a see-through habitat to watch all week.',
    meta:{time:'20 min', diff:'Easy', mess:'A little messy', help:'Kid-led'},
    materials:['Clear cup or jar','Soil','Sand','2–3 red wiggler worms','Small food scraps','Dark paper','Spray bottle'],
    grownup:'Kids can lead this one — grown-ups just help find worms.',
    steps:[
      ['Layer the home','Layer soil, a thin line of sand, then more soil. The sand lines help you spot the tunnels later.'],
      ['Add your worms','Gently place 2–3 red wigglers on top with a few tiny fruit or veggie peels.'],
      ['Give a drink','Lightly mist with water until it’s damp like a wrung-out sponge — never soaking wet.'],
      ['Wrap it up','Wrap the cup in dark paper. Worms love the dark, so they’ll tunnel along the glass where you can peek.'],
      ['Watch every day','Each day, unwrap and look. New tunnels? Scraps shrinking? Draw what you see in a journal.'],
      ['Say thank you','After about a week, return the worms to a garden or compost bin. They did important work!']
    ],
    science:'Worms are nature’s recyclers. They eat scraps and turn them into <b>castings</b> — the richest plant food there is. Their tunnels also let air and water reach plant roots. In a clear cup, you can actually <b>see</b> it happen.',
    learn:'decomposition · ecosystems · soil health · observation & journaling' },

  { id:'sunflower', track:'grow', emoji:'🌻', color:'var(--sage-l)', flag:'The whole life cycle',
    title:'The Sunflower Cup', blurb:'Plant one seed and watch every single stage happen on your windowsill.',
    meta:{time:'15 min to start', diff:'Easy', mess:'A little messy', help:'Kid-led'},
    materials:['A clear cup','Potting soil','1 sunflower seed','Water in a spray bottle','A sunny windowsill','A ruler','Paper for a growth journal'],
    grownup:'Kids can lead this one start to finish.',
    steps:[
      ['Fill the cup','Fill your cup about three quarters full with soil. Press it down gently — not too hard, roots need air.'],
      ['Plant the seed','Poke a hole as deep as your fingertip, drop the seed in, and cover it lightly.'],
      ['Water and wait','Mist until the soil is damp like a wrung-out sponge. Put it somewhere sunny.'],
      ['Watch for the sprout','In about a week a shoot appears. Draw what you see and measure it with your ruler.'],
      ['Measure every day','Write down the height each day. How much did it grow overnight?'],
      ['Find the parts','Once it has leaves, point to the roots, stem and leaves. What is each one doing?'],
      ['Plant it out','When it outgrows the cup, plant it in the garden and wait for the flower — then the new seeds.']
    ],
    science:'You are watching a whole life cycle: seed, seedling, plant, flower, and then fruit with new seeds inside. The seed already holds a tiny plant and a packed lunch. Once water wakes it up, roots go down for water, the stem lifts the leaves up, and the leaves catch sunlight to make food. The flower is the part that makes the next generation of seeds.',
    learn:'plant life cycle · plant parts and their jobs · what plants need · measuring change over time',
    teks:'Kindergarten K.13(C), K.12(A) · Grade 2 2.13(A)' },
  { id:'scrap', track:'grow', emoji:'🥬', color:'var(--sage-l)', flag:'Flagship project',
    title:'Grow a Plant from a Scrap', blurb:'No garden needed — regrow a green onion on the windowsill.',
    meta:{time:'10 min', diff:'Easy', mess:'Tidy', help:'Kid-led'},
    materials:['Green onion, lettuce, or celery base','Small glass','Water','A sunny windowsill','Ruler'],
    grownup:'Kids can do almost all of this themselves.',
    steps:[
      ['Save the root','Keep the root end (about 2 inches) when a grown-up trims the vegetable.'],
      ['Stand it in water','Put it root-down in a glass with just enough water to cover the roots.'],
      ['Find the sun','Set it on a sunny windowsill. Change the water every other day so it stays fresh.'],
      ['Measure each day','Use a ruler to measure the new growth every day and write it down.'],
      ['Plant or eat','In about a week, plant it in soil — or snip the new green onion right into dinner!']
    ],
    science:'Many plants store energy in their base and can grow all over again. Put the root end in water and it "wakes up," sending out new roots and leaves — the same regrowing power that fills a whole garden bed.',
    learn:'plant life cycle · roots & regrowth · what plants need · measuring change' },

  { id:'bee', track:'explore', emoji:'🐝', color:'var(--amber-l)', flag:'The bee house you wanted',
    title:'Build a Bee & Butterfly House', blurb:'Make a cozy home that brings real pollinators to your yard.',
    meta:{time:'30 min', diff:'Easy', mess:'Tidy', help:'Grown-up cuts'},
    materials:['Clean tin can or small box','Paper straws or hollow bamboo','Scissors','String','Flowers nearby'],
    grownup:'A grown-up does the cutting.',
    steps:[
      ['Cut the rooms','Cut the straws or bamboo to fit the depth of the can — these are the bee "rooms."'],
      ['Pack them in','Pack the tubes in tightly, open ends facing out, until the can is full.'],
      ['Make a hanger','Tie a string around the can so you can hang it up.'],
      ['Hang it well','Hang it on a sunny fence or tree, near flowers, about chest height.'],
      ['Watch who visits','Watch quietly over the weeks to see who moves in. Keep a pollinator journal!']
    ],
    science:'Most bees aren’t in big hives — they’re gentle <b>solitary bees</b> that nest alone in little tubes. Bees and butterflies are <b>pollinators</b>: they move pollen so plants can make fruit and seeds. No pollinators, no strawberries!',
    learn:'pollination · solitary bees vs. hives · habitats · observing wildlife' },

  { id:'web', track:'tech', emoji:'🌐', color:'var(--sky-l)', flag:'Bonus project',
    title:'Build Your First Web Page', blurb:'Make a one-page website about your garden — real code, kid-sized.',
    meta:{time:'30 min', diff:'Medium', mess:'No mess', help:'Grown-up signs up'},
    materials:['Any computer','A free account (Neocities or Glitch)','A grown-up to help sign up'],
    grownup:'A grown-up helps make the free account.',
    steps:[
      ['Make an account','With a grown-up, make a free account on a site like Neocities and start a new page.'],
      ['Add a big title','Type a title: <code>&lt;h1&gt;My Garden&lt;/h1&gt;</code>'],
      ['Write a sentence','Add a sentence about your favorite plant inside <code>&lt;p&gt; &lt;/p&gt;</code> tags.'],
      ['Add a photo','Add a photo of your garden with an image tag.'],
      ['Publish it!','Click publish — you made a real website. Share the link with your family!']
    ],
    science:'A website is just a text file the computer knows how to draw. With a few simple tags, your own words become a real web page anyone can visit.',
    learn:'how websites work · sequencing & structure · digital creativity' },
];

var SOON=[
  {track:'kitchen', ev:'From: Freeze-Ahead Fries', title:'Why freezing keeps food fresh'},
  {track:'kitchen', ev:'From: Gobble Good Lunch', title:'Bake bread from scratch'},
  {track:'worm', ev:'From: Wiggle Worm Cast Harvest', title:'Make worm-casting plant tea'},
  {track:'grow', ev:'From: Fall Garden Care', title:'The watering experiment'},
  {track:'explore', ev:'From: Cockrell Butterfly Center', title:'Butterfly life-cycle wheel'}
];



/* Which builds each topic offers, and the standard each serves there. */
var TOPIC_BUILDS = {
  plant: [
    { id:'sunflower', teks:'K.13(C)', why:'the whole life cycle, first-hand' },
    { id:'scrap',     teks:'2.13(A)', why:'roots, and what they do' },
    { id:'bee',       teks:'2.13(A)', why:'how flowers make seeds' },
    { id:'worm',      teks:'K.12(A)', why:'nutrients in the soil' }
  ],
  butterfly: [
    { id:'bee',       teks:'2.13(D)', why:'bring real pollinators to watch' }
  ],
  frog: []
};

function projectById(id){
  for (var i=0;i<PROJECTS.length;i++) if (PROJECTS[i].id===id) return PROJECTS[i];
  return null;
}

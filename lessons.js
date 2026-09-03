/* ------------------------------------------------------------------
   DewLab — the lessons themselves
   ------------------------------------------------------------------
   ONE record per lesson, holding everything that lesson needs:
   its skills, its question bank, its at-home build and its activities.

   Why one file rather than five: a lesson used to be spread across
   quiz.js, teks.js, projects.js and the page itself, so adding a
   lesson meant editing four places and getting all four right. Here a
   lesson is a single object. Adding the thirteenth means appending
   one entry — which is also the shape the admin authoring screens
   will read and write once content moves into the database.

   ---- STANDARDS, AND AN HONEST LINE ABOUT THEM ----
   Only codes carrying `verified:true` were read directly from
   TEKS Guide (teksguide.org) with their wording preserved. Those are
   the six in teks.js, covering the Plant Life Cycle lesson.

   All twelve lessons now carry `standards`, and every code in them was
   read from 19 TAC as published — science Chapter 112 (adopted 2021,
   in effect from 2024-25) and health Chapter 115 (adopted 2020). The
   wording lives in teks.js exactly as published; nothing is
   paraphrased and nothing is inferred from a code's number.

   Each competency also names the single expectation it maps to, so a
   funder report can say which standard a child actually demonstrated
   rather than listing the standards a lesson passes near.

   ---- ONE HARD RULE ----
   Food preservation safety numbers — times, temperatures, acidity —
   are never drafted here and never adapted. Where a lesson needs one,
   it links to the National Center for Home Food Preservation and the
   number stays on their page. The two Preserve lessons below were
   chosen partly because they teach real preservation without either
   of them depending on a safety threshold.
------------------------------------------------------------------- */

var LESSONS = {};

/* ==================================================================
   GROW · Root · lesson 1 of 2
   The one that already existed. Its questions live in quiz.js and its
   builds in projects.js; this record points at them rather than
   copying them, so there is still only one plant life cycle.
================================================================== */
LESSONS.plant = {
  slug:'plant', world:'grow', n:1,
  title:'The Plant Life Cycle',
  tagline:'Seed, sprout, plant, flower, fruit — and a seed again.',
  grades:'K–2',
  word:'sunflower',
  legacy:true,                 /* content still served by quiz.js + projects.js */
  page:'topic.html?t=plant',
  standards:['K.13(C)','K.12(A)','2.13(A)','K.13(D)'],
  safety:'Potting soil is for planting, not for tasting. Wash hands after.',
  sources:[
    {name:'Ag in the Classroom', url:'https://agclassroom.org/'},
    {name:'KidsGardening',       url:'https://kidsgardening.org/'}
  ]
};

/* ==================================================================
   GROW · Root · lesson 2 of 2
   Texas is the reason this lesson exists. A planting calendar written
   for the north of the country is actively wrong here — our hard
   season is the heat, not the frost, and a child who plants lettuce
   in July learns the wrong lesson about their own ability.
================================================================== */
LESSONS.seasons = {
  slug:'seasons', world:'grow', n:2,
  title:'What Grows When',
  tagline:'Why lettuce loves February and okra loves July.',
  grades:'K–3',
  word:'',
  standards:['K.10(B)','3.12(A)','K.12(A)','2.10(B)'],
  safety:'Garden soil goes on hands, not in mouths. Hats and water on hot Texas afternoons.',
  sources:[
    {name:'Aggie Horticulture — Texas planting guides', url:'https://aggie-hort.tamu.edu/'},
    {name:'KidsGardening', url:'https://kidsgardening.org/'}
  ],

  competencies:[
    {id:'when',  label:'Knows which crops belong to the cool season and which to the warm', teks:'K.10(B)'},
    {id:'why',   label:'Knows that temperature is what decides when a crop can grow', teks:'3.12(A)'},
    {id:'order', label:'Knows the order of work across a growing season', teks:'K.12(A)'},
    {id:'plan',  label:'Can choose something sensible to plant right now', teks:'2.10(B)'}
  ],

  bank:[
    {c:'when', q:'Which of these likes the cool weather best?',
      opts:[{e:'&#129388;',t:'Lettuce',ok:1},{e:'&#127813;',t:'Tomatoes'},{e:'&#127817;',t:'Watermelon'},{e:'&#127798;',t:'Peppers'}]},
    {c:'when', q:'Which one is happiest in a hot Texas summer?',
      opts:[{e:'&#127798;',t:'Okra and peppers',ok:1},{e:'&#129382;',t:'Broccoli'},{e:'&#129388;',t:'Spinach'},{e:'&#129365;',t:'Carrots'}]},
    {c:'when', q:'When would you plant broccoli in Texas?',
      opts:[{e:'&#127810;',t:'In the cool months',ok:1},{e:'&#9728;&#65039;',t:'In the hottest week of July'},{e:'&#128167;',t:'Only when it rains'},{e:'&#127795;',t:'It never grows here'}]},
    {c:'when', q:'A watermelon seed needs which kind of soil to start?',
      opts:[{e:'&#9728;&#65039;',t:'Warm soil',ok:1},{e:'&#10052;&#65039;',t:'Frozen soil'},{e:'&#129482;',t:'Cold soil'},{e:'&#128167;',t:'Flooded soil'}]},

    {c:'why', q:'What mostly decides when a crop can grow?',
      opts:[{e:'&#127777;&#65039;',t:'How warm or cool it is',ok:1},{e:'&#128197;',t:'The day of the week'},{e:'&#127765;',t:'The moon'},{e:'&#128176;',t:'How much the seeds cost'}]},
    {c:'why', q:'What happens to lettuce when it gets too hot?',
      opts:[{e:'&#128557;',t:'It turns bitter and shoots up tall',ok:1},{e:'&#127817;',t:'It turns into a watermelon'},{e:'&#128027;',t:'It grows twice as fast'},{e:'&#10052;&#65039;',t:'It freezes'}]},
    {c:'why', q:'Why do gardeners watch the weather forecast?',
      opts:[{e:'&#127780;&#65039;',t:'To know when it is safe to plant',ok:1},{e:'&#128250;',t:'To pick a TV show'},{e:'&#128300;',t:'To count clouds'},{e:'&#127925;',t:'For fun only'}]},
    {c:'why', q:'A late frost is bad news for which plant?',
      opts:[{e:'&#127813;',t:'A young tomato plant',ok:1},{e:'&#129388;',t:'Kale'},{e:'&#129365;',t:'Carrots'},{e:'&#129382;',t:'Broccoli'}]},

    {c:'order', q:'What comes first when you start a bed?',
      opts:[{e:'&#129508;',t:'Get the soil ready',ok:1},{e:'&#129530;',t:'Harvest'},{e:'&#127807;',t:'Pull the plants out'},{e:'&#128167;',t:'Water the empty ground for a week'}]},
    {c:'order', q:'After the seeds are in the ground, what is the daily job?',
      opts:[{e:'&#128167;',t:'Water and pull weeds',ok:1},{e:'&#128164;',t:'Nothing until harvest'},{e:'&#128269;',t:'Dig them back up to check'},{e:'&#129704;',t:'Cover them with rocks'}]},
    {c:'order', q:'What happens at the very end of a season?',
      opts:[{e:'&#9851;&#65039;',t:'Clear the bed and compost the old plants',ok:1},{e:'&#128293;',t:'Burn everything'},{e:'&#128683;',t:'Leave it and never return'},{e:'&#127970;',t:'Pour concrete over it'}]},
    {c:'order', q:'When is a crop ready to pick?',
      opts:[{e:'&#128064;',t:'When it looks and feels ready, not on a set date',ok:1},{e:'&#128197;',t:'Exactly 30 days after planting, always'},{e:'&#127801;',t:'As soon as it flowers'},{e:'&#127806;',t:'Never — you leave it'}]},

    {c:'plan', q:'It is October in Texas. What is a good thing to sow?',
      opts:[{e:'&#129388;',t:'Lettuce and spinach',ok:1},{e:'&#127817;',t:'Watermelon'},{e:'&#127798;',t:'Okra'},{e:'&#127805;',t:'Sweetcorn'}]},
    {c:'plan', q:'It is May and already hot. What would you plant?',
      opts:[{e:'&#127798;',t:'Peppers',ok:1},{e:'&#129382;',t:'Broccoli'},{e:'&#129365;',t:'Carrots'},{e:'&#129388;',t:'Lettuce'}]},
    {c:'plan', q:'You only have a sunny windowsill. What is the sensible choice?',
      opts:[{e:'&#127807;',t:'Something small like herbs or lettuce',ok:1},{e:'&#127817;',t:'A watermelon vine'},{e:'&#127805;',t:'A field of corn'},{e:'&#127794;',t:'A pecan tree'}]},
    {c:'plan', q:'Your first planting failed in the heat. What is the smart next move?',
      opts:[{e:'&#128260;',t:'Try again at the right time of year',ok:1},{e:'&#128683;',t:'Give up on gardening'},{e:'&#127798;',t:'Plant the exact same thing tomorrow'},{e:'&#128167;',t:'Water it ten times a day'}]}
  ],

  build:{
    title:'The Two-Season Windowsill',
    blurb:'Sow one cool-season seed and one warm-season seed side by side, and let the weather prove which was right.',
    time:'20 minutes, then two weeks of watching',
    help:'Kid-led',
    mess:'A little messy',
    materials:['2 clear cups or small pots','Potting soil','Lettuce seeds (cool season)','Bean or squash seeds (warm season)','A marker','Water'],
    steps:[
      ['Label your cups','Write COOL on one and WARM on the other, plus today’s date.'],
      ['Fill and sow','Fill both with soil. Lettuce seeds go just under the surface; the bean goes a finger-joint deep.'],
      ['Same spot, same water','Put them next to each other and give them exactly the same treatment. That is what makes it a fair test.'],
      ['Watch for two weeks','Draw what you see every few days. Which one came up first? Which one looked happier?'],
      ['Say why','Whichever did better, tell someone why — and what you would plant next.']
    ],
    why:'Two seeds, one windowsill, one difference: what temperature each seed was built for. Because everything else is identical, the result can only be about the season — which is exactly how a fair test works.'
  },

  /* The plant lesson gives a family four builds to choose from and
     this one gave them one. A windowsill, a bucket and a notebook are
     not the same household. */
  builds:[
    {
      title:'The Two-Season Windowsill',
      blurb:'Sow one cool-season seed and one warm-season seed side by side, and let the weather prove which was right.',
      time:'20 minutes, then two weeks of watching', help:'Kid-led', mess:'A little messy',
      teks:'K.10(B)', teksNote:'the seasons, tested rather than told',
      materials:['2 clear cups or small pots','Potting soil','Lettuce seeds (cool season)','Bean or squash seeds (warm season)','A marker','Water'],
      steps:[
        ['Label your cups','Write COOL on one and WARM on the other, plus today\u2019s date.'],
        ['Fill and sow','Fill both with soil. Lettuce seeds go just under the surface; the bean goes a finger-joint deep.'],
        ['Same spot, same water','Put them next to each other and give them exactly the same treatment. That is what makes it a fair test.'],
        ['Watch for two weeks','Draw what you see every few days. Which one came up first? Which one looked happier?'],
        ['Say why','Whichever did better, tell someone why \u2014 and what you would plant next.']
      ],
      why:'Two seeds, one windowsill, one difference: what temperature each seed was built for. Because everything else is identical, the result can only be about the season \u2014 which is exactly how a fair test works.'
    },
    {
      title:'The Frost Blanket Test',
      blurb:'Two thermometers, one old sheet, and proof that a cover really does hold warmth.',
      time:'10 minutes to set up, one night to wait', help:'Grown-up outside at night', mess:'Tidy',
      teks:'3.12(A)', teksNote:'why a cover works',
      materials:['2 outdoor thermometers','An old sheet or towel','2 sticks or garden stakes','A cold night'],
      steps:[
        ['Pick a cold evening','Check the forecast with a grown-up. You want a night going below about 45\u00b0F.'],
        ['Set both thermometers outside','Put them a few steps apart, both on the ground, both out of the wind.'],
        ['Cover one','Prop the sheet over one thermometer on two sticks so it makes a little tent. Leave the other bare.'],
        ['Read them at first light','Go out early, before the sun hits. Write both numbers down.'],
        ['Work out the gap','How many degrees warmer was the covered one? That gap is what saves a tomato plant.']
      ],
      why:'A sheet makes no heat of its own. What it does is trap the warmth the ground gives back overnight, which is usually a few degrees \u2014 and a few degrees is the whole difference between frost damage and none.'
    },
    {
      title:'The One-Year Garden Plan',
      blurb:'Draw twelve boxes and fill in what you would grow in your own space, month by month.',
      time:'30 minutes', help:'Kid-led, grown-up for ideas', mess:'Tidy',
      teks:'K.12(A)', teksNote:'planning around what a plant needs',
      materials:['A big sheet of paper','Coloured pencils','A ruler','What you learned in The Texas Year'],
      steps:[
        ['Draw twelve boxes','One for each month. Write the month at the top of each.'],
        ['Colour the weather','Blue for the cool months, orange for the hot ones, green in between. Use what you know about Texas.'],
        ['Fill in the cool boxes','Lettuce, spinach, carrots, broccoli, kale. Draw them or write them.'],
        ['Fill in the hot boxes','Okra, peppers, melons, southern peas.'],
        ['Circle this month','What could go in the ground right now? Circle it and tell a grown-up.'],
        ['Put it on the fridge','Come back to it when the month changes.']
      ],
      why:'A planting calendar handed to a child is a rule to obey. One they drew from what they worked out themselves is a plan they own \u2014 and the circled month turns it from a picture into something to do this week.'
    }
  ],

  activities:[
    {id:'seasonsort', type:'sort', title:'Cool or Warm?',
      teaches:'Sort Texas crops by the season they actually grow in',
      teks:'K.10(B)',
      prompt:'Tap each crop, then tap the season it belongs to.',
      bins:[{id:'cool',label:'Cool season',e:'&#127810;'},{id:'warm',label:'Warm season',e:'&#9728;&#65039;'}],
      items:[
        {e:'&#129388;',t:'Lettuce',bin:'cool'},{e:'&#129382;',t:'Broccoli',bin:'cool'},
        {e:'&#129365;',t:'Carrots',bin:'cool'},{e:'&#127807;',t:'Spinach',bin:'cool'},
        {e:'&#127813;',t:'Tomatoes',bin:'warm'},{e:'&#127798;',t:'Peppers',bin:'warm'},
        {e:'&#127817;',t:'Watermelon',bin:'warm'},{e:'&#129362;',t:'Okra',bin:'warm'}
      ]},

    {id:'seasonorder', type:'order', title:'A Season, Start to Finish',
      teaches:'Put the work of a growing season in order',
      teks:'2.10(B)',
      prompt:'What does a gardener do first? Tap them in order.',
      items:[
        {e:'&#129508;',t:'Get the soil ready'},
        {e:'&#127793;',t:'Sow the seeds'},
        {e:'&#128167;',t:'Water and weed'},
        {e:'&#129530;',t:'Harvest'},
        {e:'&#9851;&#65039;',t:'Clear and compost'}
      ]},

    /* Hand-built for this lesson. The generic sorter can ask which
       season a crop belongs to; it cannot let a child turn a dial and
       watch lettuce bolt, and watching it is the lesson. */
    {id:'texasyear', type:'custom', render:'texasYear', title:'The Texas Year',
      teaches:'Find the months a crop actually goes in the ground in Texas',
      teks:'K.10(B)',
      prompt:'Tap a month and see what a Texas gardener sows then.'},

    {id:'bolt', type:'custom', render:'bolt', title:'Too Hot for Lettuce',
      teaches:'See for yourself what heat does to a cool-season crop',
      teks:'3.12(A)',
      prompt:'Drag the thermometer and watch what each crop does.'},

    {id:'frost', type:'custom', render:'frost', title:'Frost Tonight',
      teaches:'Decide what to protect when the forecast turns cold',
      teks:'3.12(A)',
      prompt:'A forecast comes in. Cover them, or leave them?'},

    {id:'seasonpick', type:'pick', title:'What Would You Plant?',
      teaches:'Choose a crop that suits the month you are actually in',
      teks:'K.12(A)',
      questions:[
        {q:'It is February in Spring, Texas. Cool and bright.',
         opts:[{e:'&#129388;',t:'Lettuce',ok:1},{e:'&#127817;',t:'Watermelon'},{e:'&#127798;',t:'Okra'}],
         why:'February is cool-season weather here. Lettuce loves it; a watermelon seed would just sit in cold soil.'},
        {q:'It is late June. Ninety-five degrees by lunchtime.',
         opts:[{e:'&#129362;',t:'Okra',ok:1},{e:'&#129382;',t:'Broccoli'},{e:'&#129365;',t:'Carrots'}],
         why:'Okra was built for this. Broccoli in June would bolt — shoot up tall and turn bitter — before it ever made a head.'},
        {q:'A frost is forecast for tonight and your tomatoes are outside.',
         opts:[{e:'&#128737;',t:'Cover them tonight',ok:1},{e:'&#128167;',t:'Water them more'},{e:'&#128564;',t:'Do nothing'}],
         why:'Tomatoes are a warm-season crop with no defence against frost. A sheet over them holds enough warmth to get through one cold night.'}
      ]}
  ]
};

/* ==================================================================
   NOURISH · Chef Sprout · lesson 1 of 2
   MyPlate is used because it is the federal guidance, it is free to
   teach from, and its five groups are the vocabulary a Texas school
   nurse and a Texas cafeteria already use.
================================================================== */
LESSONS.myplate = {
  slug:'myplate', world:'nourish', n:1,
  title:'Build a Plate',
  tagline:'Five groups, one plate, and half of it coloured in.',
  grades:'K–3',
  word:'',
  standards:['H.2.6(B)','H.2.6(C)','H.2.6(A)','H.2.6(D)'],
  safety:'Talk about food as fuel, never as good or bad. Some children have allergies — always ask before sharing.',
  sources:[
    {name:'MyPlate — USDA',        url:'https://www.myplate.gov/'},
    {name:'USDA Team Nutrition',   url:'https://www.fns.usda.gov/tn'}
  ],

  competencies:[
    {id:'groups', label:'Can name the five food groups and sort food into them', teks:'H.2.6(B)'},
    {id:'half',   label:'Knows that half the plate should be fruit and vegetables', teks:'H.2.6(C)'},
    {id:'swap',   label:'Can swap a snack for one that fuels them better', teks:'H.2.6(A)'},
    {id:'drink',  label:'Knows what to drink most of the time', teks:'H.2.6(D)'}
  ],

  bank:[
    {c:'groups', q:'How many food groups are on MyPlate?',
      opts:[{e:'&#53;&#65039;&#8419;',t:'Five',ok:1},{e:'&#50;&#65039;&#8419;',t:'Two'},{e:'&#56;&#65039;&#8419;',t:'Eight'},{e:'&#49;&#65039;&#8419;',t:'One'}]},
    {c:'groups', q:'An apple belongs to which group?',
      opts:[{e:'&#127822;',t:'Fruits',ok:1},{e:'&#129371;',t:'Dairy'},{e:'&#127838;',t:'Grains'},{e:'&#129385;',t:'Protein'}]},
    {c:'groups', q:'Chicken and beans both belong to which group?',
      opts:[{e:'&#129385;',t:'Protein',ok:1},{e:'&#127822;',t:'Fruits'},{e:'&#129371;',t:'Dairy'},{e:'&#129388;',t:'Vegetables'}]},
    {c:'groups', q:'Brown rice belongs to which group?',
      opts:[{e:'&#127838;',t:'Grains',ok:1},{e:'&#129388;',t:'Vegetables'},{e:'&#129371;',t:'Dairy'},{e:'&#127822;',t:'Fruits'}]},

    {c:'half', q:'How much of your plate should be fruit and vegetables?',
      opts:[{e:'&#129367;',t:'About half',ok:1},{e:'&#127850;',t:'None'},{e:'&#127869;',t:'All of it'},{e:'&#129361;',t:'One bite'}]},
    {c:'half', q:'Your plate is all bread and cheese. What is missing?',
      opts:[{e:'&#129388;',t:'Fruit and vegetables',ok:1},{e:'&#127838;',t:'More bread'},{e:'&#129472;',t:'More cheese'},{e:'&#127850;',t:'A cookie'}]},
    {c:'half', q:'Which plate looks most like MyPlate?',
      opts:[{e:'&#129367;',t:'Salad, chicken, rice and an orange',ok:1},{e:'&#127839;',t:'Chips and a soda'},{e:'&#127850;',t:'Three cookies'},{e:'&#127838;',t:'Four slices of toast'}]},
    {c:'half', q:'Why does MyPlate want lots of colours?',
      opts:[{e:'&#127752;',t:'Different colours bring different nutrients',ok:1},{e:'&#127912;',t:'It looks pretty'},{e:'&#128247;',t:'For photos'},{e:'&#127917;',t:'No reason'}]},

    {c:'swap', q:'A better swap for a bag of sweets is…',
      opts:[{e:'&#127815;',t:'A piece of fruit',ok:1},{e:'&#127853;',t:'A bigger bag of sweets'},{e:'&#127848;',t:'Ice cream'},{e:'&#127856;',t:'Cake'}]},
    {c:'swap', q:'Instead of crisps with lunch, you could have…',
      opts:[{e:'&#129365;',t:'Carrot sticks',ok:1},{e:'&#127839;',t:'A second bag of crisps'},{e:'&#127850;',t:'Biscuits'},{e:'&#127853;',t:'A lollipop'}]},
    {c:'swap', q:'Does having a treat sometimes mean you ate badly?',
      opts:[{e:'&#128522;',t:'No — treats fit, most days just need fuel too',ok:1},{e:'&#128557;',t:'Yes, always'},{e:'&#128683;',t:'You should never have treats'},{e:'&#129300;',t:'Nobody knows'}]},
    {c:'swap', q:'Which snack keeps you going longest at the park?',
      opts:[{e:'&#129365;',t:'Apple slices and peanut butter',ok:1},{e:'&#127853;',t:'A lollipop'},{e:'&#129380;',t:'A fizzy drink'},{e:'&#127856;',t:'A slice of cake'}]},

    {c:'drink', q:'What should you drink most of the time?',
      opts:[{e:'&#128167;',t:'Water',ok:1},{e:'&#129380;',t:'Fizzy drinks'},{e:'&#129475;',t:'Sweet juice all day'},{e:'&#9749;',t:'Coffee'}]},
    {c:'drink', q:'You have been running outside in the Texas heat. What do you reach for?',
      opts:[{e:'&#128167;',t:'Water',ok:1},{e:'&#127848;',t:'A milkshake'},{e:'&#129380;',t:'A fizzy drink'},{e:'&#127853;',t:'Sweets'}]},
    {c:'drink', q:'Milk mostly gives you…',
      opts:[{e:'&#129460;',t:'Calcium for your bones',ok:1},{e:'&#127853;',t:'Sugar and nothing else'},{e:'&#128293;',t:'Spice'},{e:'&#127913;',t:'Magic'}]},
    {c:'drink', q:'How do you know your body wants water?',
      opts:[{e:'&#128069;',t:'You feel thirsty or your mouth is dry',ok:1},{e:'&#128064;',t:'Your eyes change colour'},{e:'&#128066;',t:'Your ears ring'},{e:'&#129504;',t:'You cannot tell'}]}
  ],

  build:{
    title:'Your Real Plate, Drawn',
    blurb:'Draw one meal you actually ate this week, then colour in how much of it was fruit and vegetables.',
    time:'20 minutes',
    help:'Kid-led',
    mess:'Tidy',
    materials:['Paper','A round object to draw around (a bowl works)','Coloured pencils','One real meal you remember'],
    steps:[
      ['Draw the plate','Trace around a bowl. Draw a line down the middle, then split one half in two — that is the MyPlate shape.'],
      ['Draw what you actually ate','Not a perfect meal. A real one, from this week. Be honest — it works better that way.'],
      ['Colour the fruit and veg green','Now look. Did the green reach halfway across?'],
      ['Add one thing','Draw one fruit or vegetable you would happily add next time. Just one.'],
      ['Show a grown-up','Tell them which one you added and why you picked that one.']
    ],
    why:'Nobody changes what they eat from a poster. They change it from noticing. Drawing a meal you really ate turns a rule into a picture of your own week — and adding one thing is a change small enough to actually happen.'
  },

  activities:[
    {id:'platesort', type:'sort', title:'Five Groups',
      teaches:'Sort real foods into the five MyPlate groups',
      prompt:'Tap a food, then tap the group it belongs to.',
      bins:[{id:'fruit',label:'Fruits',e:'&#127822;'},{id:'veg',label:'Vegetables',e:'&#129388;'},
            {id:'grain',label:'Grains',e:'&#127838;'},{id:'prot',label:'Protein',e:'&#129385;'},
            {id:'dairy',label:'Dairy',e:'&#129371;'}],
      items:[
        {e:'&#127820;',t:'Banana',bin:'fruit'},{e:'&#127817;',t:'Watermelon',bin:'fruit'},
        {e:'&#129365;',t:'Carrot',bin:'veg'},{e:'&#129382;',t:'Broccoli',bin:'veg'},
        {e:'&#127838;',t:'Bread',bin:'grain'},{e:'&#127834;',t:'Rice',bin:'grain'},
        {e:'&#129385;',t:'Chicken',bin:'prot'},{e:'&#129367;',t:'Beans',bin:'prot'},
        {e:'&#129371;',t:'Milk',bin:'dairy'},{e:'&#129472;',t:'Cheese',bin:'dairy'}
      ]},

    {id:'platehalf', type:'pick', title:'Half the Plate',
      teaches:'Judge whether a plate has enough fruit and vegetables',
      questions:[
        {q:'Pasta, garlic bread and a glass of milk. What is missing?',
         opts:[{e:'&#129388;',t:'Fruit and vegetables',ok:1},{e:'&#127838;',t:'More bread'},{e:'&#129371;',t:'More milk'}],
         why:'Grains and dairy are both there. Nothing on this plate is fruit or vegetable, so half of it is empty of the half that should be biggest.'},
        {q:'Chicken, rice, green beans and an orange. How does this plate do?',
         opts:[{e:'&#9989;',t:'That is close to MyPlate',ok:1},{e:'&#10060;',t:'Way off'},{e:'&#129300;',t:'Nothing is right'}],
         why:'Protein, grain, vegetable and fruit — and the fruit and veg together take up about half. That is the shape MyPlate is asking for.'},
        {q:'A whole plate of watermelon. Is that a full meal?',
         opts:[{e:'&#129300;',t:'It is a great start, but the other groups are missing',ok:1},{e:'&#9989;',t:'Yes, perfect'},{e:'&#10060;',t:'Watermelon is bad for you'}],
         why:'Watermelon is genuinely good food. But fruit alone will not give you the protein or grains your body wants for the rest of the afternoon.'}
      ]},

    {id:'plateswap', type:'match', title:'Make the Swap',
      teaches:'Match a snack to a swap that fuels you longer',
      prompt:'Tap a snack, then tap a swap that would keep you going longer.',
      pairs:[
        {a:{e:'&#127853;',t:'Lollipop'},        b:{t:'An apple'}},
        {a:{e:'&#127839;',t:'Bag of crisps'},   b:{t:'Carrot sticks'}},
        {a:{e:'&#129380;',t:'Fizzy drink'},     b:{t:'Water'}},
        {a:{e:'&#127856;',t:'Slice of cake'},   b:{t:'Yoghurt and berries'}}
      ]}
  ]
};

/* ==================================================================
   NOURISH · Chef Sprout · lesson 2 of 2
================================================================== */
LESSONS.farmtotable = {
  slug:'farmtotable', world:'nourish', n:2,
  title:'How Food Gets To You',
  tagline:'Every strawberry has a journey. Most of it happens before you see it.',
  grades:'2–5',
  word:'',
  standards:['3.11(A)','5.12(C)','5.11'],
  safety:'Wash all produce before tasting, even from your own garden.',
  sources:[
    {name:'Ag in the Classroom',  url:'https://agclassroom.org/'},
    {name:'Edible Schoolyard',    url:'https://edibleschoolyard.org/'}
  ],

  competencies:[
    {id:'journey', label:'Can put the farm-to-table journey in order', teks:'3.11(A)'},
    {id:'fresh',   label:'Knows why distance and time change how food tastes and keeps', teks:'5.12(C)'},
    {id:'label',   label:'Can find where a food came from and read it', teks:'3.11(A)'},
    {id:'waste',   label:'Knows where food waste goes and how to make less of it', teks:'5.11'}
  ],

  bank:[
    {c:'journey', q:'Where does the journey of a tomato begin?',
      opts:[{e:'&#127793;',t:'A seed on a farm',ok:1},{e:'&#128722;',t:'The shop shelf'},{e:'&#128666;',t:'A lorry'},{e:'&#127869;',t:'Your plate'}]},
    {c:'journey', q:'What happens right after a crop is harvested?',
      opts:[{e:'&#128230;',t:'It is packed and cooled',ok:1},{e:'&#127869;',t:'It is eaten immediately'},{e:'&#128465;',t:'It is thrown away'},{e:'&#127795;',t:'It is planted again'}]},
    {c:'journey', q:'How does most food travel a long way?',
      opts:[{e:'&#128666;',t:'By lorry, train or ship',ok:1},{e:'&#128694;',t:'People carry it'},{e:'&#128052;',t:'Animals bring it'},{e:'&#127755;',t:'It appears'}]},
    {c:'journey', q:'Who is the last person in the food journey?',
      opts:[{e:'&#129490;',t:'The person eating it — you',ok:1},{e:'&#128668;',t:'The farmer'},{e:'&#128666;',t:'The driver'},{e:'&#128722;',t:'The shopkeeper'}]},

    {c:'fresh', q:'A strawberry picked this morning nearby, versus one that travelled four days. Which usually tastes better?',
      opts:[{e:'&#127827;',t:'The one picked this morning',ok:1},{e:'&#128666;',t:'The one that travelled'},{e:'&#129335;',t:'No difference ever'},{e:'&#128683;',t:'Both taste bad'}]},
    {c:'fresh', q:'Why are some fruits picked before they are ripe?',
      opts:[{e:'&#128666;',t:'So they survive the journey',ok:1},{e:'&#127917;',t:'For fun'},{e:'&#128176;',t:'They cost more that way'},{e:'&#128027;',t:'Bugs like them green'}]},
    {c:'fresh', q:'What does "in season" mean?',
      opts:[{e:'&#128197;',t:'It is the time of year that food naturally grows near you',ok:1},{e:'&#127881;',t:'It is on sale'},{e:'&#128250;',t:'It is on television'},{e:'&#10052;&#65039;',t:'It is frozen'}]},
    {c:'fresh', q:'Food from your own garden skips which part of the journey?',
      opts:[{e:'&#128666;',t:'Nearly all the travelling',ok:1},{e:'&#127793;',t:'The growing'},{e:'&#128167;',t:'The watering'},{e:'&#129530;',t:'The picking'}]},

    {c:'label', q:'Where would you look to find out where a food came from?',
      opts:[{e:'&#127991;&#65039;',t:'The label or sticker on the package',ok:1},{e:'&#128064;',t:'Its colour'},{e:'&#128067;',t:'Its smell'},{e:'&#128176;',t:'Its price'}]},
    {c:'label', q:'A bag of apples says "Product of Washington". What does that tell you?',
      opts:[{e:'&#128506;&#65039;',t:'They were grown in Washington state',ok:1},{e:'&#128722;',t:'They were sold there'},{e:'&#128100;',t:'A person named Washington grew them'},{e:'&#128290;',t:'Nothing useful'}]},
    {c:'label', q:'Which food most likely travelled the shortest distance to a Texas kitchen?',
      opts:[{e:'&#127817;',t:'A watermelon from a Texas farm',ok:1},{e:'&#127821;',t:'A pineapple from Costa Rica'},{e:'&#129389;',t:'A mango from India'},{e:'&#127820;',t:'A banana from Ecuador'}]},
    {c:'label', q:'What is a farmers market?',
      opts:[{e:'&#128668;',t:'A place growers sell straight to people',ok:1},{e:'&#127981;',t:'A factory'},{e:'&#128666;',t:'A lorry park'},{e:'&#127968;',t:'A house'}]},

    {c:'waste', q:'What is the best thing to do with vegetable peelings?',
      opts:[{e:'&#9851;&#65039;',t:'Compost them',ok:1},{e:'&#128465;&#65039;',t:'Bin them'},{e:'&#128293;',t:'Burn them'},{e:'&#128167;',t:'Wash them down the sink'}]},
    {c:'waste', q:'Wasting food also wastes what?',
      opts:[{e:'&#128167;',t:'All the water, work and travel that grew it',ok:1},{e:'&#128220;',t:'Only the packaging'},{e:'&#8987;',t:'Only time'},{e:'&#128683;',t:'Nothing at all'}]},
    {c:'waste', q:'One easy way to waste less at home is…',
      opts:[{e:'&#129379;',t:'Take a smaller helping and go back for more',ok:1},{e:'&#127869;',t:'Fill the plate as high as it goes'},{e:'&#128465;&#65039;',t:'Bin whatever is left'},{e:'&#128722;',t:'Buy twice as much'}]},
    {c:'waste', q:'Slightly soft fruit is usually…',
      opts:[{e:'&#129379;',t:'Still fine — good for smoothies or baking',ok:1},{e:'&#128465;&#65039;',t:'Always rubbish'},{e:'&#9760;&#65039;',t:'Dangerous'},{e:'&#128027;',t:'Full of insects'}]}
  ],

  build:{
    title:'The Kitchen Map',
    blurb:'Find out how far five foods in your kitchen travelled, and put them on a map.',
    time:'30 minutes',
    help:'Grown-up helps read labels',
    mess:'Tidy',
    materials:['Five foods from your kitchen with labels','Paper','Coloured pencils','A map or a grown-up with a phone'],
    steps:[
      ['Pick five','Choose five foods with a country or state printed somewhere on them.'],
      ['Write the places','List each food and where it says it came from.'],
      ['Draw a rough map','It does not need to be accurate. Put your house in the middle.'],
      ['Draw the lines','Draw a line from each place to your house. Longest line wins the prize for furthest traveller.'],
      ['Find the closest','Which one came from nearest? Could anything on your list have been grown in Texas?']
    ],
    why:'The lines are the point. Once a child has drawn one from Ecuador to their own kitchen, "where food comes from" stops being an abstract idea and becomes a distance they can see.'
  },

  activities:[
    {id:'ftorder', type:'order', title:'The Journey',
      teaches:'Put the farm-to-table journey in the right order',
      prompt:'Tap them in the order a tomato actually travels.',
      items:[
        {e:'&#127793;',t:'Planted on a farm'},
        {e:'&#129530;',t:'Harvested'},
        {e:'&#128230;',t:'Packed and cooled'},
        {e:'&#128666;',t:'Driven to the shop'},
        {e:'&#128722;',t:'Bought'},
        {e:'&#127869;',t:'Eaten'}
      ]},

    {id:'ftnear', type:'sort', title:'Near or Far?',
      teaches:'Judge which foods travelled a long way to reach Texas',
      prompt:'Could this have been grown near Spring, Texas — or did it travel?',
      bins:[{id:'near',label:'Could be grown near you',e:'&#127968;'},{id:'far',label:'Travelled a long way',e:'&#9992;&#65039;'}],
      items:[
        {e:'&#127817;',t:'Watermelon',bin:'near'},{e:'&#129362;',t:'Okra',bin:'near'},
        {e:'&#127813;',t:'Tomatoes',bin:'near'},{e:'&#127827;',t:'Strawberries',bin:'near'},
        {e:'&#127821;',t:'Pineapple',bin:'far'},{e:'&#127820;',t:'Bananas',bin:'far'},
        {e:'&#129389;',t:'Mango',bin:'far'},{e:'&#127792;',t:'Cocoa beans',bin:'far'}
      ]},

    {id:'ftwaste', type:'pick', title:'Waste Less',
      teaches:'Choose the option that wastes the least food',
      questions:[
        {q:'You peeled a heap of carrots. What happens to the peelings?',
         opts:[{e:'&#9851;&#65039;',t:'Compost them',ok:1},{e:'&#128465;&#65039;',t:'Bin them'},{e:'&#128167;',t:'Sink'}],
         why:'Peelings still hold everything the soil gave them. Composting sends that back to the garden instead of to landfill.'},
        {q:'The bananas have gone spotty and soft.',
         opts:[{e:'&#129379;',t:'Make banana bread or a smoothie',ok:1},{e:'&#128465;&#65039;',t:'Throw them out'},{e:'&#128064;',t:'Wait until they are worse'}],
         why:'Spotty bananas are sweeter than yellow ones, which is exactly why bakers want them. Soft is a stage, not a failure.'},
        {q:'You are hungry and the serving spoon is huge.',
         opts:[{e:'&#129379;',t:'Take a small helping, go back if still hungry',ok:1},{e:'&#127869;',t:'Pile the plate high'},{e:'&#128683;',t:'Take nothing'}],
         why:'Food left on a plate is the most common way food gets wasted at home. Going back for seconds costs nothing; scraping a plate costs everything that grew it.'}
      ]}
  ]
};

/* ==================================================================
   PROTECT · Buzz · lesson 1 of 2
================================================================== */
LESSONS.pollinators = {
  slug:'pollinators', world:'protect', n:1,
  title:'Who Moves the Pollen',
  tagline:'No pollinators, no fruit. It is that direct.',
  grades:'K–3',
  word:'',
  standards:['2.12(C)','3.12(B)','5.12(C)'],
  safety:'Bees are working, not hunting. Watch from a step back, never swat, and tell a grown-up about any sting allergy before you go outside.',
  sources:[
    {name:'USDA NRCS',   url:'https://www.nrcs.usda.gov/'},
    {name:'Project WILD',url:'https://www.fishwildlife.org/projectwild'}
  ],

  competencies:[
    {id:'who',  label:'Can tell which animals are pollinators and which are not', teks:'2.12(C)'},
    {id:'how',  label:'Knows how pollen actually moves from flower to flower', teks:'2.12(C)'},
    {id:'why',  label:'Knows what would be missing without pollinators', teks:'3.12(B)'},
    {id:'help', label:'Can name real ways to help pollinators where they live', teks:'5.12(C)'}
  ],

  bank:[
    {c:'who', q:'Which of these is a pollinator?',
      opts:[{e:'&#128029;',t:'A bee',ok:1},{e:'&#128054;',t:'A dog'},{e:'&#128034;',t:'A tortoise'},{e:'&#128031;',t:'A fish'}]},
    {c:'who', q:'Butterflies help plants by…',
      opts:[{e:'&#129419;',t:'Carrying pollen while they drink nectar',ok:1},{e:'&#127807;',t:'Eating the leaves'},{e:'&#129003;',t:'Digging the roots'},{e:'&#128167;',t:'Watering them'}]},
    {c:'who', q:'Which surprising animal is also a pollinator?',
      opts:[{e:'&#128038;',t:'A hummingbird',ok:1},{e:'&#128058;',t:'A wolf'},{e:'&#129445;',t:'A sloth'},{e:'&#10060;',t:'None of these'}]},
    {c:'who', q:'Which one is NOT doing pollination work?',
      opts:[{e:'&#129713;',t:'An earthworm underground',ok:1},{e:'&#129419;',t:'A butterfly on a flower'},{e:'&#128029;',t:'A bee on a flower'},{e:'&#128038;',t:'A hummingbird at a bloom'}]},

    {c:'how', q:'How does pollen get from one flower to another?',
      opts:[{e:'&#128029;',t:'It sticks to a visiting animal and rides along',ok:1},{e:'&#128694;',t:'The flower walks over'},{e:'&#128663;',t:'People drive it'},{e:'&#127880;',t:'It teleports'}]},
    {c:'how', q:'What is the pollinator actually coming for?',
      opts:[{e:'&#127855;',t:'Nectar and pollen to eat',ok:1},{e:'&#128164;',t:'A place to sleep'},{e:'&#127917;',t:'Something to do'},{e:'&#128683;',t:'Nothing'}]},
    {c:'how', q:'Besides animals, what else can move pollen?',
      opts:[{e:'&#127788;&#65039;',t:'The wind',ok:1},{e:'&#128267;',t:'Electricity'},{e:'&#128266;',t:'Sound'},{e:'&#127760;',t:'Gravity only'}]},
    {c:'how', q:'Pollen has to reach which part for a seed to form?',
      opts:[{e:'&#127800;',t:'Another flower of the same kind',ok:1},{e:'&#129003;',t:'The roots'},{e:'&#127807;',t:'The leaves'},{e:'&#129717;',t:'The bark'}]},

    {c:'why', q:'If all the pollinators vanished, what would we lose?',
      opts:[{e:'&#127822;',t:'Most fruits, and many vegetables',ok:1},{e:'&#128167;',t:'Rain'},{e:'&#9728;&#65039;',t:'Sunlight'},{e:'&#128683;',t:'Nothing much'}]},
    {c:'why', q:'An apple tree with no pollinator visits will grow…',
      opts:[{e:'&#127807;',t:'Leaves and flowers, but hardly any apples',ok:1},{e:'&#127822;',t:'Twice as many apples'},{e:'&#127796;',t:'Into a palm tree'},{e:'&#128683;',t:'Nothing at all, ever'}]},
    {c:'why', q:'Roughly how much of our food depends on pollinators?',
      opts:[{e:'&#127822;',t:'A large share of fruits, nuts and vegetables',ok:1},{e:'&#48;&#65039;&#8419;',t:'None'},{e:'&#128683;',t:'Only flowers'},{e:'&#127838;',t:'Only bread'}]},
    {c:'why', q:'Why do farmers sometimes bring in beehives?',
      opts:[{e:'&#128029;',t:'To make sure the crop gets pollinated',ok:1},{e:'&#127925;',t:'For the noise'},{e:'&#128737;&#65039;',t:'To scare off birds'},{e:'&#127928;',t:'For decoration'}]},

    {c:'help', q:'What is a real way to help pollinators at home?',
      opts:[{e:'&#127804;',t:'Plant flowers they like',ok:1},{e:'&#129529;',t:'Spray everything with bug spray'},{e:'&#129529;',t:'Cut down all the flowers'},{e:'&#128683;',t:'Nothing works'}]},
    {c:'help', q:'A shallow dish of water with stones in it is for…',
      opts:[{e:'&#128029;',t:'Giving bees somewhere safe to land and drink',ok:1},{e:'&#128031;',t:'Keeping fish'},{e:'&#127810;',t:'Growing leaves'},{e:'&#127912;',t:'Decoration only'}]},
    {c:'help', q:'Which is better for pollinators?',
      opts:[{e:'&#127804;',t:'Many different flowers blooming at different times',ok:1},{e:'&#129001;',t:'One patch of grass, cut short'},{e:'&#129521;',t:'Concrete'},{e:'&#129363;',t:'Plastic flowers'}]},
    {c:'help', q:'You see a bee on a flower in your garden. What do you do?',
      opts:[{e:'&#128064;',t:'Watch it quietly and leave it to work',ok:1},{e:'&#129529;',t:'Spray it'},{e:'&#128584;',t:'Grab it'},{e:'&#128266;',t:'Shout at it'}]}
  ],

  build:{
    title:'The Bee Bath',
    blurb:'Ten minutes of work that gives every pollinator in your garden somewhere safe to drink.',
    time:'10 minutes',
    help:'Kid-led',
    mess:'Tidy',
    materials:['A shallow dish or plant saucer','A handful of pebbles or marbles','Water','A sunny spot near flowers'],
    steps:[
      ['Find your dish','Anything shallow works. A plant pot saucer is perfect.'],
      ['Add the stones','Fill it with pebbles so they poke above the surface. These are the landing pads.'],
      ['Add water','Pour water in until it reaches partway up the stones — not over them.'],
      ['Place it','Put it near flowers, somewhere you can see it. Low down is fine.'],
      ['Top it up','Check it every day or two, especially in summer. Watch who comes.']
    ],
    why:'Bees drown easily. Open water is a hazard to them; stones turn the same dish into a safe landing pad. It is the smallest possible change that makes a real difference to something living nearby — which is what stewardship actually looks like.'
  },

  activities:[
    {id:'pollwho', type:'sort', title:'Pollinator or Not?',
      teaches:'Tell pollinators apart from other animals',
      prompt:'Does this animal move pollen between flowers?',
      bins:[{id:'yes',label:'Pollinator',e:'&#127804;'},{id:'no',label:'Not a pollinator',e:'&#10060;'}],
      items:[
        {e:'&#128029;',t:'Honeybee',bin:'yes'},{e:'&#129419;',t:'Butterfly',bin:'yes'},
        {e:'&#128038;',t:'Hummingbird',bin:'yes'},{e:'&#129714;',t:'Beetle',bin:'yes'},
        {e:'&#128054;',t:'Dog',bin:'no'},{e:'&#128031;',t:'Fish',bin:'no'},
        {e:'&#129713;',t:'Earthworm',bin:'no'},{e:'&#128034;',t:'Tortoise',bin:'no'}
      ]},

    {id:'pollorder', type:'order', title:'From Flower to Fruit',
      teaches:'Sequence what happens between a bee landing and an apple growing',
      prompt:'Tap them in order, from the bee arriving to the fruit appearing.',
      items:[
        {e:'&#127800;',t:'A flower opens'},
        {e:'&#128029;',t:'A bee lands for nectar'},
        {e:'&#128168;',t:'Pollen sticks to the bee'},
        {e:'&#127804;',t:'The bee visits the next flower'},
        {e:'&#127793;',t:'A seed starts to form'},
        {e:'&#127822;',t:'Fruit grows around it'}
      ]},

    {id:'pollhelp', type:'pick', title:'Help the Pollinators',
      teaches:'Choose actions that genuinely help pollinators',
      questions:[
        {q:'Your family wants to help bees in the back garden.',
         opts:[{e:'&#127804;',t:'Plant flowers that bloom at different times',ok:1},{e:'&#129529;',t:'Spray for insects'},{e:'&#129529;',t:'Pave it'}],
         why:'Bees need food across the whole season, not one big week of it. Different bloom times keep the kitchen open from spring through autumn.'},
        {q:'A bee is drinking at your bee bath and you want a closer look.',
         opts:[{e:'&#128064;',t:'Crouch down and watch',ok:1},{e:'&#128584;',t:'Pick it up'},{e:'&#128168;',t:'Blow on it'}],
         why:'A bee that is drinking is not interested in you at all. Watching costs it nothing; handling it is how people and bees both get hurt.'},
        {q:'There are weeds with small flowers on the lawn.',
         opts:[{e:'&#127804;',t:'Leave some — they feed pollinators early in the year',ok:1},{e:'&#129529;',t:'Kill all of them'},{e:'&#128465;&#65039;',t:'Pull every one'}],
         why:'Clover and dandelion are among the first food available when little else is flowering. A perfectly tidy lawn is an empty one.'}
      ]}
  ]
};

/* ==================================================================
   PROTECT · Buzz · lesson 2 of 2
================================================================== */
LESSONS.habitat = {
  slug:'habitat', world:'protect', n:2,
  title:'Everybody Needs a Home',
  tagline:'Food, water, shelter, space. Miss one and nothing lives there.',
  grades:'K–3',
  word:'',
  standards:['K.12(B)','2.12(A)','3.12(C)','5.12(A)'],
  safety:'Look, do not collect. Wild animals and their homes stay where they are.',
  sources:[
    {name:'Project WILD', url:'https://www.fishwildlife.org/projectwild'},
    {name:'EPA Students', url:'https://www.epa.gov/students'}
  ],

  competencies:[
    {id:'four',   label:'Can name the four things every habitat must provide', teks:'K.12(B)'},
    {id:'match',  label:'Can match an animal to the habitat it needs', teks:'2.12(A)'},
    {id:'change', label:'Knows what happens when a habitat loses one of the four', teks:'3.12(C)'},
    {id:'build',  label:'Can improve a habitat where they actually live', teks:'5.12(A)'}
  ],

  bank:[
    {c:'four', q:'How many things must a habitat give an animal?',
      opts:[{e:'&#52;&#65039;&#8419;',t:'Four',ok:1},{e:'&#49;&#65039;&#8419;',t:'One'},{e:'&#55;&#65039;&#8419;',t:'Seven'},{e:'&#50;&#65039;&#8419;',t:'Two'}]},
    {c:'four', q:'Which of these is one of the four?',
      opts:[{e:'&#128167;',t:'Water',ok:1},{e:'&#128241;',t:'Wi-fi'},{e:'&#128176;',t:'Money'},{e:'&#127925;',t:'Music'}]},
    {c:'four', q:'"Shelter" in a habitat means…',
      opts:[{e:'&#127968;',t:'Somewhere safe to hide, rest and raise young',ok:1},{e:'&#127970;',t:'A tall building'},{e:'&#9924;',t:'A snow pile'},{e:'&#128663;',t:'A car'}]},
    {c:'four', q:'Why does an animal need space?',
      opts:[{e:'&#128506;&#65039;',t:'To find enough food without fighting everything else',ok:1},{e:'&#127939;',t:'To exercise'},{e:'&#128164;',t:'To sleep in'},{e:'&#127917;',t:'For no reason'}]},

    {c:'match', q:'Where does a frog need to live?',
      opts:[{e:'&#128167;',t:'Near water',ok:1},{e:'&#127964;&#65039;',t:'In a dry desert'},{e:'&#10052;&#65039;',t:'On ice'},{e:'&#128293;',t:'In fire'}]},
    {c:'match', q:'A woodpecker needs which habitat?',
      opts:[{e:'&#127794;',t:'Trees',ok:1},{e:'&#127754;',t:'The open ocean'},{e:'&#129482;',t:'Snowfields'},{e:'&#128739;&#65039;',t:'Bare rock'}]},
    {c:'match', q:'An earthworm needs…',
      opts:[{e:'&#129003;',t:'Damp soil',ok:1},{e:'&#127964;&#65039;',t:'Dry sand'},{e:'&#127754;',t:'Salt water'},{e:'&#127795;',t:'Treetops'}]},
    {c:'match', q:'Which animal would struggle in a garden with no flowers at all?',
      opts:[{e:'&#129419;',t:'A butterfly',ok:1},{e:'&#128034;',t:'A tortoise'},{e:'&#129713;',t:'An earthworm'},{e:'&#10060;',t:'None of them'}]},

    {c:'change', q:'A pond dries up. What happens to the frogs?',
      opts:[{e:'&#128546;',t:'They must move or they cannot survive',ok:1},{e:'&#128522;',t:'Nothing changes'},{e:'&#128200;',t:'They grow bigger'},{e:'&#128038;',t:'They turn into birds'}]},
    {c:'change', q:'All the trees in an area are cut down. Who loses their home?',
      opts:[{e:'&#128038;',t:'Birds, squirrels and insects that lived in them',ok:1},{e:'&#128031;',t:'Only fish'},{e:'&#128683;',t:'Nobody'},{e:'&#128054;',t:'Only pets'}]},
    {c:'change', q:'What is habitat loss?',
      opts:[{e:'&#127757;',t:'When a place stops giving animals what they need',ok:1},{e:'&#128269;',t:'When an animal gets lost'},{e:'&#128198;',t:'A change of season'},{e:'&#127769;',t:'Night falling'}]},
    {c:'change', q:'A habitat has food, water and space but no shelter. Can animals live there?',
      opts:[{e:'&#10060;',t:'Most cannot — all four are needed',ok:1},{e:'&#9989;',t:'Yes, three is plenty'},{e:'&#129300;',t:'Only in summer'},{e:'&#128683;',t:'It makes no difference'}]},

    {c:'build', q:'What could you add to a bare yard to start a habitat?',
      opts:[{e:'&#127804;',t:'Flowering plants and a water dish',ok:1},{e:'&#129521;',t:'More concrete'},{e:'&#129529;',t:'Bug spray'},{e:'&#128465;&#65039;',t:'Rubbish'}]},
    {c:'build', q:'A pile of logs or sticks in a corner gives animals…',
      opts:[{e:'&#127968;',t:'Shelter',ok:1},{e:'&#128167;',t:'Water'},{e:'&#9728;&#65039;',t:'Sunlight'},{e:'&#128266;',t:'Noise'}]},
    {c:'build', q:'Why leave a corner of the garden a bit wild?',
      opts:[{e:'&#128029;',t:'Wild corners give the most shelter and food',ok:1},{e:'&#128564;',t:'To avoid work'},{e:'&#128176;',t:'To save money'},{e:'&#128683;',t:'No good reason'}]},
    {c:'build', q:'You want birds to visit. What helps most?',
      opts:[{e:'&#128167;',t:'Water they can drink and bathe in',ok:1},{e:'&#128250;',t:'A television'},{e:'&#128266;',t:'Loud music'},{e:'&#128054;',t:'A dog off the lead'}]}
  ],

  build:{
    title:'The Four-Corner Habitat Survey',
    blurb:'Go outside and check whether the place you live actually gives animals all four things.',
    time:'25 minutes',
    help:'Grown-up comes along outside',
    mess:'Tidy',
    materials:['Paper folded into four boxes','A pencil','Somewhere outdoors — a yard, a park, a balcony'],
    steps:[
      ['Label the boxes','Food. Water. Shelter. Space. One in each box.'],
      ['Go and look','Walk slowly. In each box, draw or write what you actually find — not what should be there.'],
      ['Find the gap','Which box has the least in it? That is what this place is short of.'],
      ['Fix one thing','Decide on one thing you could add this week to fill that gap.'],
      ['Do it, then look again','Add it. Come back in a few days and see whether anything found it.']
    ],
    why:'Every habitat lesson risks becoming a poster about the rainforest. This one makes a child audit the six metres outside their own door — and the missing box is nearly always water, which happens to be the easiest of the four to add.'
  },

  activities:[
    {id:'habfour', type:'sort', title:'Does It Belong in a Habitat?',
      teaches:'Separate the four real needs from things that only sound important',
      prompt:'Is this one of the four things every habitat must provide?',
      bins:[{id:'yes',label:'One of the four',e:'&#9989;'},{id:'no',label:'Not one of the four',e:'&#10060;'}],
      items:[
        {e:'&#127822;',t:'Food',bin:'yes'},{e:'&#128167;',t:'Water',bin:'yes'},
        {e:'&#127968;',t:'Shelter',bin:'yes'},{e:'&#128506;&#65039;',t:'Space',bin:'yes'},
        {e:'&#128241;',t:'Wi-fi',bin:'no'},{e:'&#128176;',t:'Money',bin:'no'},
        {e:'&#128250;',t:'Television',bin:'no'},{e:'&#128663;',t:'A car',bin:'no'}
      ]},

    {id:'habmatch', type:'match', title:'Who Lives Where',
      teaches:'Match an animal to the habitat that meets its needs',
      prompt:'Tap an animal, then tap the home it needs.',
      pairs:[
        {a:{e:'&#128056;',t:'Frog'},        b:{t:'A pond'}},
        {a:{e:'&#128038;',t:'Woodpecker'},  b:{t:'A tree'}},
        {a:{e:'&#129713;',t:'Earthworm'},   b:{t:'Damp soil'}},
        {a:{e:'&#129419;',t:'Butterfly'},   b:{t:'A flower meadow'}},
        {a:{e:'&#128031;',t:'Fish'},        b:{t:'A creek'}}
      ]},

    {id:'habfix', type:'pick', title:'Fix the Habitat',
      teaches:'Work out which of the four is missing and add it',
      questions:[
        {q:'A yard has grass, flowers and plenty of room — but nothing to drink.',
         opts:[{e:'&#128167;',t:'Add water',ok:1},{e:'&#127822;',t:'Add food'},{e:'&#128506;&#65039;',t:'Add space'}],
         why:'Food, shelter and space are all there. Water is the missing one, and a shallow dish fixes it the same afternoon.'},
        {q:'A balcony has a water bowl and pots of flowers, but nowhere for anything to hide.',
         opts:[{e:'&#127968;',t:'Add shelter',ok:1},{e:'&#128167;',t:'Add more water'},{e:'&#127822;',t:'Add more food'}],
         why:'An animal that cannot hide will not stay, however good the food is. A dense plant or a small log pile is enough.'},
        {q:'A lawn is cut short every week and has nothing else on it.',
         opts:[{e:'&#127804;',t:'It is short of nearly all four — start with plants',ok:1},{e:'&#9989;',t:'It is a great habitat'},{e:'&#128736;&#65039;',t:'Pave it'}],
         why:'Short grass alone gives almost no food, no shelter and no water. Planting is the one move that starts to supply more than one of the four at once.'}
      ]}
  ]
};

/* ==================================================================
   SOIL · Wiggles · lesson 1 of 2
================================================================== */
LESSONS.compost = {
  slug:'compost', world:'soil', n:1,
  title:'What Compost Eats',
  tagline:'Rubbish in one end, soil out the other, and something alive doing the work.',
  grades:'K–4',
  word:'',
  standards:['2.11(B)','4.12(B)','3.10(B)','3.11(C)'],
  safety:'Compost is soil, not food. Gloves are good, washing hands afterwards is required. No meat or dairy in a home bin — it attracts animals.',
  sources:[
    {name:'Rodale Institute', url:'https://rodaleinstitute.org/'},
    {name:'EPA composting',   url:'https://www.epa.gov/students'}
  ],

  competencies:[
    {id:'in',    label:'Knows what belongs in a compost bin and what does not', teks:'2.11(B)'},
    {id:'who',   label:'Knows which living things break compost down', teks:'4.12(B)'},
    {id:'recipe',label:'Knows what a compost pile needs to work', teks:'3.10(B)'},
    {id:'why',   label:'Knows why compost matters to a garden', teks:'3.11(C)'}
  ],

  bank:[
    {c:'in', q:'Which of these can go in the compost?',
      opts:[{e:'&#127820;',t:'Banana peel',ok:1},{e:'&#128717;',t:'A plastic bag'},{e:'&#127831;',t:'Chicken bones'},{e:'&#128241;',t:'A phone'}]},
    {c:'in', q:'Which one should stay OUT of a home compost bin?',
      opts:[{e:'&#129472;',t:'Cheese and meat',ok:1},{e:'&#127810;',t:'Fallen leaves'},{e:'&#129365;',t:'Carrot tops'},{e:'&#9749;',t:'Coffee grounds'}]},
    {c:'in', q:'Grass clippings in the compost are…',
      opts:[{e:'&#9989;',t:'Fine, mixed with dry brown material',ok:1},{e:'&#10060;',t:'Never allowed'},{e:'&#128293;',t:'Dangerous'},{e:'&#9760;',t:'Poisonous'}]},
    {c:'in', q:'Why not compost plastic?',
      opts:[{e:'&#10060;',t:'Nothing alive can break it down',ok:1},{e:'&#128176;',t:'It costs too much'},{e:'&#127912;',t:'It is the wrong colour'},{e:'&#128266;',t:'It is too noisy'}]},

    {c:'who', q:'Who does most of the work in a compost pile?',
      opts:[{e:'&#129440;',t:'Tiny living things — microbes, worms and bugs',ok:1},{e:'&#129302;',t:'Robots'},{e:'&#127913;',t:'Magic'},{e:'&#128293;',t:'Fire'}]},
    {c:'who', q:'What is a decomposer?',
      opts:[{e:'&#129713;',t:'A living thing that breaks dead stuff down',ok:1},{e:'&#127793;',t:'A young plant'},{e:'&#128029;',t:'A pollinator'},{e:'&#128587;',t:'A gardener'}]},
    {c:'who', q:'Worms in compost are…',
      opts:[{e:'&#129713;',t:'Helping — they eat scraps and leave castings',ok:1},{e:'&#10060;',t:'A problem'},{e:'&#128027;',t:'Pests'},{e:'&#128683;',t:'Doing nothing'}]},
    {c:'who', q:'Why does a compost pile feel warm inside?',
      opts:[{e:'&#127777;&#65039;',t:'Microbes working give off heat',ok:1},{e:'&#9728;&#65039;',t:'The sun heats the middle first'},{e:'&#128293;',t:'It is on fire'},{e:'&#128267;',t:'Electricity'}]},

    {c:'recipe', q:'A compost pile needs greens, browns, air and…',
      opts:[{e:'&#128167;',t:'Water',ok:1},{e:'&#127853;',t:'Sugar'},{e:'&#129371;',t:'Milk'},{e:'&#128176;',t:'Money'}]},
    {c:'recipe', q:'"Browns" in compost means…',
      opts:[{e:'&#127810;',t:'Dry things — leaves, cardboard, straw',ok:1},{e:'&#127851;',t:'Chocolate'},{e:'&#9749;',t:'Coffee only'},{e:'&#128683;',t:'Anything brown-coloured'}]},
    {c:'recipe', q:'Why turn a compost pile?',
      opts:[{e:'&#128168;',t:'To get air into the middle',ok:1},{e:'&#127917;',t:'For exercise'},{e:'&#128064;',t:'To look at it'},{e:'&#128266;',t:'To wake it up'}]},
    {c:'recipe', q:'Your compost smells bad and is soggy. What does it need?',
      opts:[{e:'&#127810;',t:'More dry browns and a turn for air',ok:1},{e:'&#128167;',t:'More water'},{e:'&#129472;',t:'More food scraps'},{e:'&#128683;',t:'Nothing, that is normal'}]},

    {c:'why', q:'What does finished compost do for a garden?',
      opts:[{e:'&#129704;',t:'Feeds the soil so plants grow better',ok:1},{e:'&#128293;',t:'Keeps it warm'},{e:'&#128027;',t:'Kills every insect'},{e:'&#127912;',t:'Only makes it look nice'}]},
    {c:'why', q:'Composting keeps waste out of…',
      opts:[{e:'&#128465;&#65039;',t:'Landfill',ok:1},{e:'&#127754;',t:'The ocean only'},{e:'&#127968;',t:'Your house'},{e:'&#128666;',t:'Lorries'}]},
    {c:'why', q:'Finished compost looks and smells like…',
      opts:[{e:'&#129704;',t:'Dark crumbly earth that smells like a forest',ok:1},{e:'&#127820;',t:'The banana peel you put in'},{e:'&#128683;',t:'Rubbish'},{e:'&#129482;',t:'Ice'}]},
    {c:'why', q:'Composting is an example of…',
      opts:[{e:'&#9851;&#65039;',t:'A cycle — things going round again',ok:1},{e:'&#10145;&#65039;',t:'A one-way trip'},{e:'&#128683;',t:'Waste'},{e:'&#128176;',t:'Shopping'}]}
  ],

  build:{
    title:'The Compost Jar',
    blurb:'A jar on a windowsill that shows you decomposition happening, over two weeks, without a garden.',
    time:'15 minutes to build, two weeks to watch',
    help:'Kid-led, grown-up for the lid holes',
    mess:'A little messy',
    materials:['A large clear jar','Soil','Dry leaves or shredded brown paper','Fruit and vegetable scraps','Water in a spray bottle','A lid with holes, or cloth and a rubber band'],
    steps:[
      ['Layer it','Soil, then browns, then scraps. Repeat until the jar is about three-quarters full.'],
      ['Damp, not wet','Spray until it feels like a wrung-out sponge. Soggy compost goes smelly.'],
      ['Let it breathe','Punch holes in the lid or cover with cloth. Decomposers need air.'],
      ['Somewhere warm','A windowsill out of direct blazing sun is right.'],
      ['Draw it weekly','Draw the jar once a week. What is disappearing first? What is stubborn?']
    ],
    why:'Decomposition is invisible in a garden bin and obvious in a glass jar. Two weeks of drawings shows a child that soft wet things go first and dry woody things take far longer — which is the whole greens-and-browns idea, discovered rather than told.'
  },

  activities:[
    {id:'compsort', type:'sort', title:'In the Bin or Not?',
      teaches:'Sort what belongs in a home compost bin',
      prompt:'Would this go in a home compost bin?',
      bins:[{id:'yes',label:'Compost it',e:'&#9851;&#65039;'},{id:'no',label:'Keep it out',e:'&#10060;'}],
      items:[
        {e:'&#127820;',t:'Banana peel',bin:'yes'},{e:'&#127810;',t:'Dry leaves',bin:'yes'},
        {e:'&#9749;',t:'Coffee grounds',bin:'yes'},{e:'&#129365;',t:'Carrot tops',bin:'yes'},
        {e:'&#129472;',t:'Cheese',bin:'no'},{e:'&#127831;',t:'Chicken bones',bin:'no'},
        {e:'&#128717;',t:'Plastic bag',bin:'no'},{e:'&#129387;',t:'Metal can',bin:'no'}
      ]},

    {id:'compgb', type:'sort', title:'Greens and Browns',
      teaches:'Tell wet nitrogen-rich greens from dry carbon-rich browns',
      prompt:'Wet and fresh is a green. Dry and papery is a brown.',
      bins:[{id:'green',label:'Greens (wet)',e:'&#129388;'},{id:'brown',label:'Browns (dry)',e:'&#127810;'}],
      items:[
        {e:'&#129365;',t:'Vegetable scraps',bin:'green'},{e:'&#127807;',t:'Grass clippings',bin:'green'},
        {e:'&#127822;',t:'Fruit peel',bin:'green'},{e:'&#9749;',t:'Coffee grounds',bin:'green'},
        {e:'&#127810;',t:'Fallen leaves',bin:'brown'},{e:'&#128230;',t:'Cardboard',bin:'brown'},
        {e:'&#127806;',t:'Straw',bin:'brown'},{e:'&#128220;',t:'Shredded paper',bin:'brown'}
      ]},

    {id:'comporder', type:'order', title:'Peel to Soil',
      teaches:'Sequence what happens to a scrap in a compost pile',
      prompt:'Tap them in the order it actually happens.',
      items:[
        {e:'&#127820;',t:'A peel goes in'},
        {e:'&#129440;',t:'Microbes move in'},
        {e:'&#127777;&#65039;',t:'The pile heats up'},
        {e:'&#129713;',t:'Worms and bugs break it apart'},
        {e:'&#129704;',t:'Dark crumbly compost'},
        {e:'&#127793;',t:'It feeds a new plant'}
      ]},

    {id:'compfix', type:'pick', title:'Fix the Pile',
      teaches:'Diagnose a compost pile that is not working',
      questions:[
        {q:'The pile is soggy and smells sour.',
         opts:[{e:'&#127810;',t:'Add browns and turn it',ok:1},{e:'&#128167;',t:'Add more water'},{e:'&#129472;',t:'Add cheese'}],
         why:'A sour smell means the middle has run out of air. Dry browns open the pile up and turning it lets oxygen back in.'},
        {q:'Nothing has changed in a month. The pile is bone dry.',
         opts:[{e:'&#128167;',t:'Add water until it feels like a damp sponge',ok:1},{e:'&#127810;',t:'Add more leaves'},{e:'&#128465;&#65039;',t:'Throw it away'}],
         why:'Decomposers are alive, and nothing alive works without water. A dry pile is not broken — it is paused.'},
        {q:'Animals keep getting into the bin at night.',
         opts:[{e:'&#129472;',t:'Something went in that should not have — check for meat or dairy',ok:1},{e:'&#128167;',t:'Add water'},{e:'&#128266;',t:'Make noise at night'}],
         why:'Fruit and vegetable scraps rarely draw animals. Meat, dairy and oily food do, which is exactly why home bins leave them out.'}
      ]}
  ]
};

/* ==================================================================
   SOIL · Wiggles · lesson 2 of 2
================================================================== */
LESSONS.soillayers = {
  slug:'soillayers', world:'soil', n:2,
  title:'Under Your Feet',
  tagline:'Soil is not dirt. It has layers, and it is full of living things.',
  grades:'1–4',
  word:'',
  standards:['3.10(B)','4.12(B)','4.10(B)'],
  safety:'Wash hands after handling any soil. Never taste it, and keep cuts covered.',
  sources:[
    {name:'USDA NRCS',        url:'https://www.nrcs.usda.gov/'},
    {name:'Rodale Institute', url:'https://rodaleinstitute.org/'}
  ],

  competencies:[
    {id:'layers', label:'Can name the layers of soil in order from the top down', teks:'3.10(B)'},
    {id:'types',  label:'Can tell sand, silt and clay apart by how they feel and behave', teks:'3.10(B)'},
    {id:'life',   label:'Knows that soil is full of living things and what they do', teks:'4.12(B)'},
    {id:'care',   label:'Knows how soil is lost and how it is protected', teks:'4.10(B)'}
  ],

  bank:[
    {c:'layers', q:'What is the very top layer of soil called?',
      opts:[{e:'&#127807;',t:'Topsoil',ok:1},{e:'&#127956;',t:'Bedrock'},{e:'&#129003;',t:'Subsoil'},{e:'&#127810;',t:'Litter'}]},
    {c:'layers', q:'Which layer is solid rock?',
      opts:[{e:'&#129704;',t:'Bedrock, at the bottom',ok:1},{e:'&#127807;',t:'Topsoil'},{e:'&#127810;',t:'Leaf litter'},{e:'&#128167;',t:'Water table'}]},
    {c:'layers', q:'Where do most plant roots live?',
      opts:[{e:'&#127793;',t:'In the topsoil',ok:1},{e:'&#129704;',t:'In the bedrock'},{e:'&#127795;',t:'Above the ground'},{e:'&#128167;',t:'In water only'}]},
    {c:'layers', q:'What sits on top of the topsoil in a forest?',
      opts:[{e:'&#127810;',t:'Fallen leaves and twigs',ok:1},{e:'&#129704;',t:'Rock'},{e:'&#129521;',t:'Concrete'},{e:'&#10052;&#65039;',t:'Ice'}]},

    {c:'types', q:'Which soil feels gritty and lets water run straight through?',
      opts:[{e:'&#127958;&#65039;',t:'Sand',ok:1},{e:'&#129003;',t:'Clay'},{e:'&#129000;',t:'Silt'},{e:'&#127810;',t:'Compost'}]},
    {c:'types', q:'Which soil is sticky and holds water the longest?',
      opts:[{e:'&#129003;',t:'Clay',ok:1},{e:'&#127958;&#65039;',t:'Sand'},{e:'&#127810;',t:'Leaf litter'},{e:'&#129704;',t:'Gravel'}]},
    {c:'types', q:'You squeeze wet soil and it holds its shape like modelling clay. It is probably…',
      opts:[{e:'&#129003;',t:'Clay',ok:1},{e:'&#127958;&#65039;',t:'Sand'},{e:'&#128167;',t:'Water'},{e:'&#129704;',t:'Rock'}]},
    {c:'types', q:'Why do gardeners add compost to sandy soil?',
      opts:[{e:'&#128167;',t:'It helps the soil hold on to water and food',ok:1},{e:'&#127912;',t:'To change the colour'},{e:'&#128293;',t:'To warm it'},{e:'&#128266;',t:'No reason'}]},

    {c:'life', q:'A handful of healthy soil contains…',
      opts:[{e:'&#129440;',t:'Millions of living things',ok:1},{e:'&#128683;',t:'Nothing alive'},{e:'&#129704;',t:'Only rock'},{e:'&#128167;',t:'Only water'}]},
    {c:'life', q:'What do earthworms do for soil?',
      opts:[{e:'&#129713;',t:'Make tunnels for air and water, and leave castings',ok:1},{e:'&#10060;',t:'Eat the roots'},{e:'&#128293;',t:'Dry it out'},{e:'&#128683;',t:'Nothing'}]},
    {c:'life', q:'Fungi threads in soil help plants by…',
      opts:[{e:'&#127812;',t:'Reaching further than roots and passing water and food along',ok:1},{e:'&#10060;',t:'Attacking them'},{e:'&#128293;',t:'Burning them'},{e:'&#128164;',t:'Doing nothing'}]},
    {c:'life', q:'Why is soil life so important?',
      opts:[{e:'&#129704;',t:'It turns dead things into food plants can use',ok:1},{e:'&#127912;',t:'It makes soil brown'},{e:'&#128266;',t:'It makes noise'},{e:'&#128176;',t:'It is worth money'}]},

    {c:'care', q:'How long does it take nature to build an inch of topsoil?',
      opts:[{e:'&#8987;',t:'Hundreds of years',ok:1},{e:'&#128336;',t:'One hour'},{e:'&#128198;',t:'One week'},{e:'&#127881;',t:'Overnight'}]},
    {c:'care', q:'What is erosion?',
      opts:[{e:'&#128168;',t:'Soil carried away by water or wind',ok:1},{e:'&#127793;',t:'Soil growing'},{e:'&#129704;',t:'Soil turning to rock'},{e:'&#128167;',t:'Rain falling'}]},
    {c:'care', q:'What protects soil from washing away?',
      opts:[{e:'&#127807;',t:'Plants and their roots holding it together',ok:1},{e:'&#128736;&#65039;',t:'Digging it more often'},{e:'&#128167;',t:'More watering'},{e:'&#129529;',t:'Spraying it'}]},
    {c:'care', q:'A bare, dug-over slope in heavy rain will…',
      opts:[{e:'&#128168;',t:'Lose soil down the hill',ok:1},{e:'&#127793;',t:'Grow faster'},{e:'&#129704;',t:'Turn to stone'},{e:'&#128683;',t:'Stay exactly the same'}]}
  ],

  build:{
    title:'The Soil Shake Test',
    blurb:'One jar, one shake, one night of waiting — and your soil sorts itself into layers so you can read what it is made of.',
    time:'15 minutes, then overnight',
    help:'Kid-led',
    mess:'A little messy',
    materials:['A tall clear jar with a lid','Soil from your garden or a pot','Water','A ruler','A marker'],
    steps:[
      ['Half fill with soil','Scoop soil into the jar until it is about half full. Pick out stones and roots.'],
      ['Top up with water','Fill nearly to the top, leaving a gap for shaking.'],
      ['Shake hard','Lid on tight. Shake for a full minute — count it out.'],
      ['Leave it overnight','Do not touch it. Put it somewhere flat and go to bed.'],
      ['Read the layers','Sand settles first at the bottom, then silt, then clay on top. Measure each band and see which one your soil has most of.']
    ],
    why:'Heavy particles fall fastest, so the jar sorts itself by particle size while you sleep. In the morning the child is not being told what their soil is made of — they are measuring it, with a ruler, from their own back yard.'
  },

  activities:[
    {id:'soilorder', type:'order', title:'Top to Bottom',
      teaches:'Put the soil layers in order from the surface down',
      prompt:'Tap them in order, starting at the very top.',
      items:[
        {e:'&#127810;',t:'Leaf litter'},
        {e:'&#127793;',t:'Topsoil'},
        {e:'&#129003;',t:'Subsoil'},
        {e:'&#129704;',t:'Broken rock'},
        {e:'&#127956;',t:'Bedrock'}
      ]},

    {id:'soiltypes', type:'match', title:'Feel the Difference',
      teaches:'Match a soil type to how it behaves',
      prompt:'Tap a soil, then tap what it does.',
      pairs:[
        {a:{e:'&#127958;&#65039;',t:'Sand'},  b:{t:'Gritty — water runs straight through'}},
        {a:{e:'&#129003;',t:'Clay'},          b:{t:'Sticky — holds water, hard when dry'}},
        {a:{e:'&#129000;',t:'Silt'},          b:{t:'Smooth and soft, like flour'}},
        {a:{e:'&#9851;&#65039;',t:'Compost'},  b:{t:'Crumbly and dark — feeds the soil'}}
      ]},

    {id:'soillife', type:'sort', title:'Alive Down There',
      teaches:'Separate the living parts of soil from the non-living',
      prompt:'Is this part of soil alive?',
      bins:[{id:'alive',label:'Living',e:'&#129440;'},{id:'not',label:'Not living',e:'&#129704;'}],
      items:[
        {e:'&#129713;',t:'Earthworms',bin:'alive'},{e:'&#127812;',t:'Fungi',bin:'alive'},
        {e:'&#129440;',t:'Bacteria',bin:'alive'},{e:'&#129003;',t:'Plant roots',bin:'alive'},
        {e:'&#127958;&#65039;',t:'Sand grains',bin:'not'},{e:'&#128167;',t:'Water',bin:'not'},
        {e:'&#128168;',t:'Air',bin:'not'},{e:'&#129704;',t:'Small stones',bin:'not'}
      ]},

    {id:'soilcare', type:'pick', title:'Save the Soil',
      teaches:'Choose the action that keeps soil where it belongs',
      questions:[
        {q:'A bare slope in your yard washes muddy water onto the path every time it rains.',
         opts:[{e:'&#127807;',t:'Plant it, so roots hold the soil',ok:1},{e:'&#128736;&#65039;',t:'Dig it over again'},{e:'&#128167;',t:'Hose it down'}],
         why:'Roots are the cheapest erosion control there is. Bare soil moves; planted soil stays.'},
        {q:'The vegetable bed is empty for the winter.',
         opts:[{e:'&#127810;',t:'Cover it with mulch or a cover crop',ok:1},{e:'&#128683;',t:'Leave it bare'},{e:'&#128736;&#65039;',t:'Dig it every week'}],
         why:'Every rain on a bare bed carries topsoil away — the layer that took centuries to build. A cover is the difference between resting soil and losing it.'},
        {q:'Your soil is pure sand and nothing holds water.',
         opts:[{e:'&#9851;&#65039;',t:'Work compost into it',ok:1},{e:'&#128167;',t:'Water it ten times a day'},{e:'&#129704;',t:'Add gravel'}],
         why:'Compost acts like a sponge between the sand grains. It is the one addition that improves sandy soil and heavy clay in opposite directions at once.'}
      ]}
  ]
};

/* ==================================================================
   CREATE · Tinker · lesson 1 of 2
   The engineering design cycle is the real content. Seed dispersal is
   the excuse — a genuine natural-engineering problem with several
   working solutions already in the garden to copy from.
================================================================== */
LESSONS.seedbot = {
  slug:'seedbot', world:'create', n:1,
  title:'Design a Seed Traveller',
  tagline:'Seeds cannot walk. Engineer one a way to move.',
  grades:'2–5',
  word:'',
  standards:['2.12(C)','3.1(B)','2.2(D)'],
  safety:'Scissors are a grown-up job or a careful one. Test flights outdoors or over a clear table.',
  sources:[
    {name:'TeachEngineering', url:'https://www.teachengineering.org/'},
    {name:'Ag in the Classroom', url:'https://agclassroom.org/'}
  ],

  competencies:[
    {id:'why',    label:'Knows why a seed has to move away from its parent plant', teks:'2.12(C)'},
    {id:'ways',   label:'Can identify how different seeds travel', teks:'2.12(C)'},
    {id:'cycle',  label:'Can follow the engineering design cycle in order', teks:'3.1(B)'},
    {id:'improve',label:'Can change one thing at a time and test whether it helped', teks:'2.2(D)'}
  ],

  bank:[
    {c:'why', q:'Why does a seed need to travel away from its parent?',
      opts:[{e:'&#9728;&#65039;',t:'So it is not fighting the parent for light, water and space',ok:1},{e:'&#127917;',t:'For adventure'},{e:'&#128164;',t:'It gets bored'},{e:'&#128683;',t:'It does not need to'}]},
    {c:'why', q:'What happens if every seed drops straight down under the tree?',
      opts:[{e:'&#128533;',t:'Too many seedlings crowd each other and most fail',ok:1},{e:'&#127881;',t:'A perfect forest'},{e:'&#127793;',t:'They all grow huge'},{e:'&#128683;',t:'Nothing changes'}]},
    {c:'why', q:'Moving to new ground gives a seed a better chance at…',
      opts:[{e:'&#129704;',t:'Its own light, water and soil',ok:1},{e:'&#128176;',t:'Money'},{e:'&#128172;',t:'Friends'},{e:'&#127925;',t:'Music'}]},
    {c:'why', q:'Seed dispersal is the name for…',
      opts:[{e:'&#128168;',t:'How seeds get moved away from the parent plant',ok:1},{e:'&#127793;',t:'How seeds sprout'},{e:'&#128167;',t:'How seeds drink'},{e:'&#129530;',t:'How seeds are harvested'}]},

    {c:'ways', q:'A dandelion seed travels by…',
      opts:[{e:'&#127788;&#65039;',t:'Wind',ok:1},{e:'&#128167;',t:'Water'},{e:'&#128054;',t:'Sticking to fur'},{e:'&#128293;',t:'Fire'}]},
    {c:'ways', q:'A burr that sticks to your socks travels by…',
      opts:[{e:'&#128054;',t:'Hitching a ride on an animal',ok:1},{e:'&#127788;&#65039;',t:'Wind'},{e:'&#128167;',t:'Floating'},{e:'&#128163;',t:'Exploding'}]},
    {c:'ways', q:'A coconut crosses the sea by…',
      opts:[{e:'&#128167;',t:'Floating on water',ok:1},{e:'&#127788;&#65039;',t:'Blowing in the wind'},{e:'&#128038;',t:'Being carried by a bird'},{e:'&#128663;',t:'Being driven'}]},
    {c:'ways', q:'A berry eaten by a bird travels by…',
      opts:[{e:'&#128038;',t:'Passing through the bird and landing somewhere new',ok:1},{e:'&#127788;&#65039;',t:'Wind'},{e:'&#128167;',t:'Water'},{e:'&#128163;',t:'Popping'}]},

    {c:'cycle', q:'What is the first step when engineers solve a problem?',
      opts:[{e:'&#128269;',t:'Understand the problem',ok:1},{e:'&#128736;&#65039;',t:'Start building immediately'},{e:'&#127881;',t:'Celebrate'},{e:'&#128465;&#65039;',t:'Throw it away'}]},
    {c:'cycle', q:'After you build a prototype, what comes next?',
      opts:[{e:'&#129514;',t:'Test it',ok:1},{e:'&#127881;',t:'Finish and stop'},{e:'&#128465;&#65039;',t:'Bin it'},{e:'&#128564;',t:'Wait a year'}]},
    {c:'cycle', q:'Your first design failed. What does an engineer do?',
      opts:[{e:'&#128260;',t:'Change something and test again',ok:1},{e:'&#128546;',t:'Give up'},{e:'&#128683;',t:'Pretend it worked'},{e:'&#128465;&#65039;',t:'Throw out all the materials'}]},
    {c:'cycle', q:'What is a prototype?',
      opts:[{e:'&#128736;&#65039;',t:'A first try you expect to change',ok:1},{e:'&#127942;',t:'The finished perfect version'},{e:'&#128220;',t:'A drawing only'},{e:'&#128683;',t:'A mistake'}]},

    {c:'improve', q:'Your seed traveller falls too fast. What do you change?',
      opts:[{e:'&#129718;',t:'Make the wings bigger to catch more air',ok:1},{e:'&#129704;',t:'Add weight'},{e:'&#9986;&#65039;',t:'Cut the wings off'},{e:'&#128683;',t:'Nothing'}]},
    {c:'improve', q:'Why change only one thing between tests?',
      opts:[{e:'&#128269;',t:'So you know which change made the difference',ok:1},{e:'&#8987;',t:'To save time'},{e:'&#128176;',t:'To save money'},{e:'&#127917;',t:'For fun'}]},
    {c:'improve', q:'How do you tell whether the change helped?',
      opts:[{e:'&#128207;',t:'Measure both flights and compare',ok:1},{e:'&#128064;',t:'Guess'},{e:'&#129300;',t:'Ask a friend'},{e:'&#128302;',t:'You cannot tell'}]},
    {c:'improve', q:'Your second design flew worse than the first. That result is…',
      opts:[{e:'&#128218;',t:'Useful — now you know that change was wrong',ok:1},{e:'&#128546;',t:'A total failure'},{e:'&#128683;',t:'Worth ignoring'},{e:'&#128465;&#65039;',t:'A reason to stop'}]}
  ],

  build:{
    title:'The Flying Seed Challenge',
    blurb:'Build a paper seed that stays in the air the longest. Then build a better one.',
    time:'40 minutes',
    help:'Grown-up cuts if needed',
    mess:'Tidy',
    materials:['Paper','Scissors','Paperclips','Sticky tape','A tape measure or a marked wall','A stopwatch or a phone timer'],
    steps:[
      ['Look at the real thing','Find a maple key, a dandelion clock, or a picture of one. What is it doing to stay up?'],
      ['Build version one','Cut a paper strip, fold two wings out at the top, add one paperclip at the bottom. Drop it from as high as you can safely reach.'],
      ['Measure it','Time the fall, or mark where it lands. Write the number down. This is the number to beat.'],
      ['Change ONE thing','Longer wings. Or two paperclips. Or a wider body. One change only, or you will not know what worked.'],
      ['Test and record','Drop it from exactly the same height. Better or worse? Write it down.'],
      ['Go again','Three more rounds. Keep every version — the failures are the data.']
    ],
    why:'A maple key is a solved engineering problem, and copying it teaches more than being told about drag. The one-change rule is the real lesson: it is the difference between fiddling and testing, and it is the same rule behind every fair experiment a child will ever run.'
  },

  activities:[
    {id:'seedways', type:'sort', title:'How Does It Travel?',
      teaches:'Sort seeds by the way they move away from the parent plant',
      prompt:'How does this seed get around?',
      bins:[{id:'wind',label:'Wind',e:'&#127788;&#65039;'},{id:'animal',label:'Animal',e:'&#128054;'},
            {id:'water',label:'Water',e:'&#128167;'},{id:'pop',label:'It pops',e:'&#128163;'}],
      items:[
        {e:'&#127807;',t:'Dandelion',bin:'wind'},{e:'&#127810;',t:'Maple key',bin:'wind'},
        {e:'&#129718;',t:'Burr',bin:'animal'},{e:'&#127827;',t:'Berry',bin:'animal'},
        {e:'&#129381;',t:'Coconut',bin:'water'},{e:'&#127807;',t:'Water lily',bin:'water'},
        {e:'&#129362;',t:'Pea pod',bin:'pop'},{e:'&#127793;',t:'Touch-me-not',bin:'pop'}
      ]},

    {id:'seedcycle', type:'order', title:'The Design Cycle',
      teaches:'Put the engineering design steps in order',
      prompt:'Tap the steps in the order an engineer works.',
      items:[
        {e:'&#128269;',t:'Understand the problem'},
        {e:'&#128173;',t:'Imagine some ideas'},
        {e:'&#128221;',t:'Plan one of them'},
        {e:'&#128736;&#65039;',t:'Build a prototype'},
        {e:'&#129514;',t:'Test it'},
        {e:'&#128260;',t:'Improve and test again'}
      ]},

    {id:'seedimprove', type:'pick', title:'What Would You Change?',
      teaches:'Make one change at a time and predict its effect',
      questions:[
        {q:'Your paper seed drops like a stone.',
         opts:[{e:'&#129718;',t:'Make the wings bigger',ok:1},{e:'&#129704;',t:'Add three more paperclips'},{e:'&#9986;&#65039;',t:'Cut the wings shorter'}],
         why:'Bigger wings catch more air, which slows the fall. More weight or smaller wings would both make it drop faster — the opposite of what you want.'},
        {q:'You changed the wings AND added a clip. It flew better. What did you learn?',
         opts:[{e:'&#129300;',t:'Not much — you cannot tell which change helped',ok:1},{e:'&#9989;',t:'Both changes were good'},{e:'&#127942;',t:'You are finished'}],
         why:'Two changes at once means two possible explanations and no way to choose between them. This is why engineers and scientists change one variable at a time.'},
        {q:'Version four flew worse than version three.',
         opts:[{e:'&#128218;',t:'Keep the result and go back to version three',ok:1},{e:'&#128465;&#65039;',t:'Throw everything away'},{e:'&#128683;',t:'Pretend it did not happen'}],
         why:'A worse result is still information — it rules something out. Engineers keep failed versions precisely because they mark the edges of what works.'}
      ]}
  ]
};

/* ==================================================================
   CREATE · Tinker · lesson 2 of 2
================================================================== */
LESSONS.sunpower = {
  slug:'sunpower', world:'create', n:2,
  title:'Catching the Sun',
  tagline:'The same sunlight that feeds a plant can cook your lunch.',
  grades:'2–5',
  word:'',
  standards:['2.9(A)','5.8(C)','4.8(B)','3.1(G)'],
  safety:'A solar oven gets genuinely hot and the foil reflects strong light. A grown-up handles anything coming out of it, and nobody looks straight at the sun or the reflection.',
  sources:[
    {name:'NASA Climate Kids',  url:'https://climatekids.nasa.gov/'},
    {name:'TeachEngineering',   url:'https://www.teachengineering.org/'}
  ],

  competencies:[
    {id:'energy', label:'Knows that sunlight carries energy that becomes heat', teks:'2.9(A)'},
    {id:'colour', label:'Knows that dark surfaces absorb and light surfaces reflect', teks:'5.8(C)'},
    {id:'trap',   label:'Knows how a surface, a reflector and a cover work together to trap heat', teks:'4.8(B)'},
    {id:'test',   label:'Can measure a difference instead of guessing at it', teks:'3.1(G)'}
  ],

  bank:[
    {c:'energy', q:'Where does nearly all the energy on Earth start?',
      opts:[{e:'&#9728;&#65039;',t:'The sun',ok:1},{e:'&#128267;',t:'Batteries'},{e:'&#127755;',t:'Volcanoes'},{e:'&#128168;',t:'Wind, by itself'}]},
    {c:'energy', q:'Sunlight hitting your skin feels…',
      opts:[{e:'&#127777;&#65039;',t:'Warm — light turns into heat',ok:1},{e:'&#129482;',t:'Cold'},{e:'&#128266;',t:'Loud'},{e:'&#128683;',t:'Like nothing'}]},
    {c:'energy', q:'What do plants do with sunlight?',
      opts:[{e:'&#127807;',t:'Turn it into food they can use',ok:1},{e:'&#128164;',t:'Sleep in it'},{e:'&#128167;',t:'Drink it'},{e:'&#128683;',t:'Ignore it'}]},
    {c:'energy', q:'A solar panel turns sunlight into…',
      opts:[{e:'&#9889;',t:'Electricity',ok:1},{e:'&#128167;',t:'Water'},{e:'&#128168;',t:'Wind'},{e:'&#127822;',t:'Food'}]},

    {c:'colour', q:'On a hot day, which shirt gets warmer in the sun?',
      opts:[{e:'&#11035;',t:'A black one',ok:1},{e:'&#11036;',t:'A white one'},{e:'&#129335;',t:'They are identical'},{e:'&#128302;',t:'Nobody can tell'}]},
    {c:'colour', q:'Why do dark colours get hotter?',
      opts:[{e:'&#127759;',t:'They absorb more light instead of reflecting it',ok:1},{e:'&#128293;',t:'They make their own heat'},{e:'&#127912;',t:'The paint is hot'},{e:'&#128266;',t:'They vibrate'}]},
    {c:'colour', q:'What does shiny foil do to sunlight?',
      opts:[{e:'&#128161;',t:'Bounces it — you can aim it where you want',ok:1},{e:'&#128293;',t:'Absorbs all of it'},{e:'&#128167;',t:'Turns it into water'},{e:'&#128683;',t:'Nothing'}]},
    {c:'colour', q:'Why are lots of houses in hot places painted white?',
      opts:[{e:'&#11036;',t:'White reflects sunlight and stays cooler',ok:1},{e:'&#127912;',t:'It is the cheapest paint'},{e:'&#128064;',t:'It looks clean'},{e:'&#128683;',t:'No reason'}]},

    {c:'trap', q:'A clear lid on a solar oven is there to…',
      opts:[{e:'&#127777;&#65039;',t:'Let light in and stop the heat escaping',ok:1},{e:'&#128167;',t:'Keep rain out only'},{e:'&#128027;',t:'Keep bugs out only'},{e:'&#127912;',t:'Look nice'}]},
    {c:'trap', q:'Which inside colour makes a solar oven work best?',
      opts:[{e:'&#11035;',t:'Black on the bottom to absorb heat',ok:1},{e:'&#11036;',t:'White everywhere'},{e:'&#10024;',t:'Clear everywhere'},{e:'&#127752;',t:'It makes no difference'}]},
    {c:'trap', q:'What is the reflector flap for?',
      opts:[{e:'&#128161;',t:'Bouncing extra sunlight into the box',ok:1},{e:'&#128168;',t:'Keeping wind out'},{e:'&#127912;',t:'Decoration'},{e:'&#128737;&#65039;',t:'Protection'}]},
    {c:'trap', q:'A greenhouse stays warm for the same reason as…',
      opts:[{e:'&#128663;',t:'A car with the windows shut in the sun',ok:1},{e:'&#129482;',t:'A fridge'},{e:'&#128168;',t:'A fan'},{e:'&#10052;&#65039;',t:'A freezer'}]},

    {c:'test', q:'You want to know if black really heats faster. What do you do?',
      opts:[{e:'&#127777;&#65039;',t:'Put a thermometer in each and compare',ok:1},{e:'&#128064;',t:'Look at them'},{e:'&#129300;',t:'Guess'},{e:'&#128172;',t:'Ask a friend'}]},
    {c:'test', q:'For a fair test, the two boxes must be…',
      opts:[{e:'&#9878;&#65039;',t:'The same in every way except the one thing you are testing',ok:1},{e:'&#127912;',t:'Different sizes'},{e:'&#128336;',t:'Tested at different times'},{e:'&#127758;',t:'In different places'}]},
    {c:'test', q:'One reading is not enough because…',
      opts:[{e:'&#128202;',t:'You need to see the change over time',ok:1},{e:'&#8987;',t:'It takes too long'},{e:'&#128176;',t:'It costs money'},{e:'&#128683;',t:'It is always enough'}]},
    {c:'test', q:'Clouds came over halfway through your test. What should you write down?',
      opts:[{e:'&#128221;',t:'Exactly that — it explains your numbers',ok:1},{e:'&#128683;',t:'Nothing'},{e:'&#10060;',t:'Pretend it stayed sunny'},{e:'&#128465;&#65039;',t:'Throw the results away'}]}
  ],

  build:{
    title:'The Pizza Box Solar Oven',
    blurb:'Build an oven out of a pizza box and let the sun melt something for you.',
    time:'45 minutes to build, an hour in the sun',
    help:'Grown-up cuts the flap and handles anything hot',
    mess:'Tidy',
    materials:['A clean pizza box','Aluminium foil','Cling film or a clear plastic sheet','Black paper','Sticky tape','A ruler and a marker','A thermometer if you have one','Something to melt — chocolate on a cracker works'],
    steps:[
      ['Cut the flap','Draw a square on the lid, about an inch in from each edge. A grown-up cuts three sides and folds it up. That is your reflector.'],
      ['Foil the flap','Cover the underside of the flap with foil, shiny side out. Smooth it flat — wrinkles scatter the light.'],
      ['Seal the window','Tape cling film tightly across the hole you just made. This is the lid that lets light in and holds heat.'],
      ['Line the inside','Foil around the inside walls, black paper flat on the bottom. Foil bounces light down, black soaks it up.'],
      ['Aim it','Outside, in full sun. Prop the flap with a stick or a ruler until it throws the brightest patch into the box.'],
      ['Cook and measure','Put your snack in on a plate. Note the time and the temperature. Check every ten minutes and write down what you see.']
    ],
    why:'Three separate ideas in one box: foil reflects light in, black absorbs it as heat, and the clear window lets light through but traps the heat inside. Take away any one of the three and it barely warms up — which is the experiment worth doing next.'
  },

  activities:[
    {id:'sunabsorb', type:'sort', title:'Soak It Up or Bounce It Back',
      teaches:'Predict which surfaces absorb sunlight and which reflect it',
      prompt:'In bright sun, does this soak up the heat or bounce it away?',
      bins:[{id:'absorb',label:'Absorbs — gets hot',e:'&#128293;'},{id:'reflect',label:'Reflects — stays cool',e:'&#10024;'}],
      items:[
        {e:'&#11035;',t:'Black paper',bin:'absorb'},{e:'&#128308;',t:'Dark red car',bin:'absorb'},
        {e:'&#129003;',t:'Dark soil',bin:'absorb'},{e:'&#11035;',t:'Black tarmac',bin:'absorb'},
        {e:'&#11036;',t:'White wall',bin:'reflect'},{e:'&#10024;',t:'Foil',bin:'reflect'},
        {e:'&#10052;&#65039;',t:'Fresh snow',bin:'reflect'},{e:'&#129694;',t:'A mirror',bin:'reflect'}
      ]},

    {id:'sunparts', type:'match', title:'Every Part Has a Job',
      teaches:'Match each part of a solar oven to what it actually does',
      prompt:'Tap a part, then tap its job.',
      pairs:[
        {a:{e:'&#10024;',t:'Foil flap'},     b:{t:'Bounces extra sunlight in'}},
        {a:{e:'&#11035;',t:'Black paper'},    b:{t:'Absorbs light and turns it to heat'}},
        {a:{e:'&#129695;',t:'Clear window'},  b:{t:'Lets light in, keeps heat from escaping'}},
        {a:{e:'&#128230;',t:'Box walls'},     b:{t:'Hold the warm air in one place'}}
      ]},

    {id:'suntest', type:'pick', title:'Make It a Fair Test',
      teaches:'Spot what would spoil a fair test of a solar oven',
      questions:[
        {q:'You test the black-bottom box in the morning and the white-bottom box after lunch.',
         opts:[{e:'&#10060;',t:'Not fair — the sun changed between the two',ok:1},{e:'&#9989;',t:'Perfectly fair'},{e:'&#129300;',t:'It does not matter'}],
         why:'The sun is higher and stronger at midday. Any difference you measure might be the time of day rather than the colour — so the test cannot answer the question you asked.'},
        {q:'One box is in full sun, the other is half in the shade of a tree.',
         opts:[{e:'&#10060;',t:'Not fair — they are not getting the same light',ok:1},{e:'&#9989;',t:'Fair enough'},{e:'&#127796;',t:'Shade helps'}],
         why:'You set out to test the colour, but you have accidentally tested shade instead. Everything except the one thing being tested has to match.'},
        {q:'Both boxes are identical except one has black paper inside. Same spot, same time.',
         opts:[{e:'&#9989;',t:'That is a fair test',ok:1},{e:'&#10060;',t:'Still unfair'},{e:'&#129300;',t:'Impossible to say'}],
         why:'One difference, everything else matched. Whatever gap shows up on the thermometers can only be down to the black paper.'}
      ]}
  ]
};

/* ==================================================================
   PRESERVE · Mason · lesson 1 of 2
   Deliberately drying and not canning. Canning safety depends on
   tested times, temperatures and acidity, and this platform does not
   publish those — it points at the National Center for Home Food
   Preservation, where they are maintained. Drying herbs teaches the
   same principle with no safety threshold to get wrong.
================================================================== */
LESSONS.drying = {
  slug:'drying', world:'preserve', n:1,
  title:'Drying the Harvest',
  tagline:'Take the water out, and the harvest keeps for months.',
  grades:'2–5',
  word:'',
  standards:['4.12(B)','3.10(B)','H.5.2(E)'],
  safety:'This lesson dries herbs and does not can anything. Canning, pickling and anything low-acid needs tested times and temperatures — those live at the National Center for Home Food Preservation and are never guessed at, adjusted or copied out here.',
  sources:[
    {name:'National Center for Home Food Preservation', url:'https://nchfp.uga.edu/'},
    {name:'4-H / Cooperative Extension', url:'https://4-h.org/'}
  ],

  competencies:[
    {id:'why',   label:'Knows that removing water is what stops food spoiling', teks:'4.12(B)'},
    {id:'spoil', label:'Knows what makes food go bad in the first place', teks:'4.12(B)'},
    {id:'how',   label:'Knows the ways food is dried and what each one needs', teks:'3.10(B)'},
    {id:'store', label:'Knows how to store dried food and when to ask an adult', teks:'H.5.2(E)'}
  ],

  bank:[
    {c:'why', q:'Drying food works because it removes…',
      opts:[{e:'&#128167;',t:'Water',ok:1},{e:'&#127752;',t:'Colour'},{e:'&#128293;',t:'Heat'},{e:'&#128168;',t:'Air'}]},
    {c:'why', q:'Why does taking the water out help?',
      opts:[{e:'&#129440;',t:'The tiny things that spoil food need water to grow',ok:1},{e:'&#128176;',t:'It makes it cheaper'},{e:'&#127912;',t:'It looks better'},{e:'&#9878;&#65039;',t:'It weighs less'}]},
    {c:'why', q:'Dried herbs keep for months because…',
      opts:[{e:'&#128167;',t:'There is almost no water left in them',ok:1},{e:'&#10052;&#65039;',t:'They are frozen'},{e:'&#129529;',t:'Chemicals were added'},{e:'&#128274;',t:'The jar is sealed tight'}]},
    {c:'why', q:'People have been drying food for…',
      opts:[{e:'&#8987;',t:'Thousands of years',ok:1},{e:'&#128198;',t:'About ten years'},{e:'&#128241;',t:'Since fridges'},{e:'&#128198;',t:'Since last year'}]},

    {c:'spoil', q:'What actually makes food go bad?',
      opts:[{e:'&#129440;',t:'Mould, yeast and bacteria growing on it',ok:1},{e:'&#9200;',t:'Time by itself'},{e:'&#127765;',t:'Moonlight'},{e:'&#128168;',t:'Air alone'}]},
    {c:'spoil', q:'Those tiny living things need three things to grow. One is water. Another is…',
      opts:[{e:'&#127777;&#65039;',t:'Warmth',ok:1},{e:'&#128266;',t:'Noise'},{e:'&#127925;',t:'Music'},{e:'&#128161;',t:'Bright light'}]},
    {c:'spoil', q:'Why does the fridge slow food going bad?',
      opts:[{e:'&#129482;',t:'Cold slows the tiny things down',ok:1},{e:'&#128293;',t:'It dries the food'},{e:'&#129529;',t:'It cleans the food'},{e:'&#128274;',t:'It seals the food'}]},
    {c:'spoil', q:'You find fuzzy grey patches on bread. What do you do?',
      opts:[{e:'&#128465;&#65039;',t:'Throw it out and tell a grown-up',ok:1},{e:'&#9986;&#65039;',t:'Cut that bit off and eat the rest'},{e:'&#128167;',t:'Wash it'},{e:'&#128293;',t:'Toast it'}]},

    {c:'how', q:'Which of these is a way to dry food?',
      opts:[{e:'&#9728;&#65039;',t:'Hanging it somewhere warm and airy',ok:1},{e:'&#128167;',t:'Soaking it'},{e:'&#10052;&#65039;',t:'Freezing it in water'},{e:'&#127848;',t:'Covering it in cream'}]},
    {c:'how', q:'What does a food dehydrator do?',
      opts:[{e:'&#128168;',t:'Blows gently warm air over food for hours',ok:1},{e:'&#128293;',t:'Cooks it fast and hot'},{e:'&#129482;',t:'Freezes it'},{e:'&#128167;',t:'Adds water'}]},
    {c:'how', q:'Why do you cut fruit into thin slices before drying?',
      opts:[{e:'&#9986;&#65039;',t:'Thin slices dry all the way through',ok:1},{e:'&#127912;',t:'They look nicer'},{e:'&#128176;',t:'It is cheaper'},{e:'&#8987;',t:'It takes longer that way'}]},
    {c:'how', q:'Herbs hung to dry need…',
      opts:[{e:'&#128168;',t:'Moving air and somewhere out of direct sun',ok:1},{e:'&#128167;',t:'To be misted daily'},{e:'&#129482;',t:'A freezer'},{e:'&#128274;',t:'A sealed bag straight away'}]},

    {c:'store', q:'Properly dried herbs should be stored…',
      opts:[{e:'&#129387;',t:'In a clean, dry, closed jar out of the light',ok:1},{e:'&#128167;',t:'In water'},{e:'&#9728;&#65039;',t:'On a sunny windowsill'},{e:'&#128230;',t:'In an open bowl'}]},
    {c:'store', q:'There is moisture on the inside of your herb jar. That means…',
      opts:[{e:'&#9888;&#65039;',t:'They were not dry enough — take them out and dry them longer',ok:1},{e:'&#9989;',t:'They are perfect'},{e:'&#128167;',t:'Add more water'},{e:'&#128274;',t:'Seal it tighter'}]},
    {c:'store', q:'Why label a jar with what is in it and the date?',
      opts:[{e:'&#127991;&#65039;',t:'So you know what it is and how old it is',ok:1},{e:'&#127912;',t:'To decorate it'},{e:'&#128176;',t:'To sell it'},{e:'&#128683;',t:'No reason'}]},
    {c:'store', q:'You want to can vegetables in jars to keep on a shelf. What is the right move?',
      opts:[{e:'&#128104;&#8205;&#127859;',t:'Ask a grown-up and follow tested instructions exactly',ok:1},{e:'&#128302;',t:'Guess the time'},{e:'&#128241;',t:'Copy a recipe off social media'},{e:'&#128336;',t:'Boil it a bit longer to be safe'}]}
  ],

  build:{
    title:'The Herb Drying Bundle',
    blurb:'Hang a bunch of herbs in a paper bag and end up with a jar you seasoned yourself.',
    time:'15 minutes, then one to two weeks hanging',
    help:'Grown-up cuts the herbs',
    mess:'Tidy',
    materials:['Fresh herbs — mint, basil, rosemary or oregano','String or a rubber band','A paper bag','Scissors','A clean dry jar with a lid','A label and a pen'],
    steps:[
      ['Cut and check','Cut healthy stems. Throw out anything spotted or wilting — drying does not fix bad leaves.'],
      ['Rinse and dry well','Rinse gently, then pat completely dry. Wet leaves going into a bag is how you get mould instead of herbs.'],
      ['Bundle them','Gather the stems and tie them tight at the cut ends. The bundle will shrink as it dries, so tie firmly.'],
      ['Bag it','Punch a few holes in a paper bag, put the bundle in leaves-down, and tie the bag closed around the stems. The bag keeps dust and light off; the holes let the moisture out.'],
      ['Hang it up','Somewhere warm, dry and airy. Not the bathroom, not direct sun.'],
      ['Test after a week','Leaves are ready when they crumble instead of bending. Not quite? Give them longer.'],
      ['Jar and label','Crumble the leaves into a clean dry jar. Write what it is and today’s date. Check tomorrow for any moisture on the glass.']
    ],
    why:'Everything about this build is the same principle: water leaves, spoiling stops. The paper bag lets water vapour escape while blocking dust and light, and the crumble test is a real dryness check — a leaf that bends is still holding water, and water in the jar is where mould starts.'
  },

  activities:[
    {id:'drykeep', type:'sort', title:'Keeps or Spoils?',
      teaches:'Predict which foods keep at room temperature and which spoil',
      prompt:'Left in a cupboard for a month, what happens?',
      bins:[{id:'keeps',label:'Keeps',e:'&#9989;'},{id:'spoils',label:'Spoils',e:'&#9888;&#65039;'}],
      items:[
        {e:'&#127807;',t:'Dried herbs',bin:'keeps'},{e:'&#127792;',t:'Dried beans',bin:'keeps'},
        {e:'&#127834;',t:'Uncooked rice',bin:'keeps'},{e:'&#127815;',t:'Dried fruit',bin:'keeps'},
        {e:'&#129371;',t:'Fresh milk',bin:'spoils'},{e:'&#129385;',t:'Raw chicken',bin:'spoils'},
        {e:'&#129367;',t:'Fresh salad',bin:'spoils'},{e:'&#127827;',t:'Fresh strawberries',bin:'spoils'}
      ]},

    {id:'dryorder', type:'order', title:'Fresh to Jar',
      teaches:'Sequence the steps of drying herbs safely',
      prompt:'Tap the steps in the order you would actually do them.',
      items:[
        {e:'&#9986;&#65039;',t:'Cut healthy stems'},
        {e:'&#128167;',t:'Rinse and pat completely dry'},
        {e:'&#129525;',t:'Tie into a bundle'},
        {e:'&#128230;',t:'Hang in a paper bag somewhere airy'},
        {e:'&#127810;',t:'Wait until leaves crumble'},
        {e:'&#129387;',t:'Jar it and write the date'}
      ]},

    {id:'drysafe', type:'pick', title:'Ask or Carry On?',
      teaches:'Know which preserving jobs need a grown-up and tested instructions',
      questions:[
        {q:'You want to hang mint up to dry in the kitchen.',
         opts:[{e:'&#9989;',t:'Go ahead — this one is safe to do yourself',ok:1},{e:'&#9888;&#65039;',t:'Needs tested instructions'},{e:'&#10060;',t:'Never do this'}],
         why:'Drying herbs in the air has no safety threshold to get wrong. If they are not dry enough you get mould you can see, not a hidden danger.'},
        {q:'You want to put green beans in sealed jars to store in the cupboard.',
         opts:[{e:'&#9888;&#65039;',t:'Stop — a grown-up and tested canning instructions',ok:1},{e:'&#9989;',t:'Just boil them and seal'},{e:'&#128302;',t:'Guess a time'}],
         why:'Low-acid foods in sealed jars can grow something you cannot see, smell or taste. The times and temperatures that make it safe are tested and published — they are never estimated, and never adapted from a recipe online.'},
        {q:'A video online shows a shortcut for canning that skips a step.',
         opts:[{e:'&#128683;',t:'Do not use it — check the tested source instead',ok:1},{e:'&#9989;',t:'It had lots of views'},{e:'&#128064;',t:'Try it once'}],
         why:'Preservation is the one area of this whole platform where popular is worth nothing. The National Center for Home Food Preservation publishes the tested method, and that is the only one to follow.'}
      ]}
  ]
};

/* ==================================================================
   PRESERVE · Mason · lesson 2 of 2
   Seed saving closes the loop back to Grow, deliberately: the last
   lesson of the twelve ends where the first one started.
================================================================== */
LESSONS.seedsaving = {
  slug:'seedsaving', world:'preserve', n:2,
  title:'Saving Seeds for Next Year',
  tagline:'The end of one plant is the start of the next.',
  grades:'2–5',
  word:'',
  standards:['4.13(B)','3.13(B)','K.13(C)','K.13(D)'],
  safety:'Only save seeds from plants you know. Never taste unknown seeds or berries — some are poisonous.',
  sources:[
    {name:'KidsGardening',       url:'https://kidsgardening.org/'},
    {name:'Ag in the Classroom', url:'https://agclassroom.org/'}
  ],

  competencies:[
    {id:'which', label:'Knows which plants to save seed from and which to skip', teks:'4.13(B)'},
    {id:'ripe',  label:'Knows when a seed is actually ready to save', teks:'3.13(B)'},
    {id:'dry',   label:'Knows that seeds must be fully dry before storing', teks:'K.13(C)'},
    {id:'store', label:'Knows how to store and label seed so it grows next year', teks:'K.13(D)'}
  ],

  bank:[
    {c:'which', q:'Which plant would you save seed from?',
      opts:[{e:'&#127803;',t:'Your best, healthiest sunflower',ok:1},{e:'&#128533;',t:'The sickest plant in the bed'},{e:'&#10060;',t:'One you cannot identify'},{e:'&#127807;',t:'A weed'}]},
    {c:'which', q:'Why save from the strongest plant?',
      opts:[{e:'&#129516;',t:'Its seeds carry the traits that did well here',ok:1},{e:'&#127912;',t:'It looks nicer'},{e:'&#128176;',t:'It costs less'},{e:'&#128683;',t:'No reason'}]},
    {c:'which', q:'You find a seed pod and do not know the plant. What do you do?',
      opts:[{e:'&#128104;&#8205;&#127806;',t:'Leave it and ask a grown-up',ok:1},{e:'&#128069;',t:'Taste it'},{e:'&#127793;',t:'Plant it anyway'},{e:'&#128230;',t:'Put it in your pocket'}]},
    {c:'which', q:'Beans, sunflowers and tomatoes are all…',
      opts:[{e:'&#127793;',t:'Good plants for a first try at seed saving',ok:1},{e:'&#10060;',t:'Impossible to save'},{e:'&#9760;',t:'Poisonous'},{e:'&#128683;',t:'Seedless'}]},

    {c:'ripe', q:'When is a sunflower seed ready to save?',
      opts:[{e:'&#127806;',t:'When the head droops and the back turns brown',ok:1},{e:'&#127803;',t:'When the flower first opens'},{e:'&#127793;',t:'As soon as it sprouts'},{e:'&#128167;',t:'After rain'}]},
    {c:'ripe', q:'A bean pod ready for seed saving is…',
      opts:[{e:'&#127810;',t:'Dry, brown and rattling',ok:1},{e:'&#129362;',t:'Green and soft'},{e:'&#127801;',t:'Still flowering'},{e:'&#128167;',t:'Wet'}]},
    {c:'ripe', q:'What happens if you save seed too early?',
      opts:[{e:'&#128533;',t:'It is not finished, and often will not grow',ok:1},{e:'&#128027;',t:'It grows twice as fast'},{e:'&#9989;',t:'It is better that way'},{e:'&#128683;',t:'Nothing'}]},
    {c:'ripe', q:'Seeds get their food store for sprouting…',
      opts:[{e:'&#127793;',t:'While still on the parent plant',ok:1},{e:'&#129387;',t:'In the jar'},{e:'&#129530;',t:'After planting'},{e:'&#128722;',t:'At the shop'}]},

    {c:'dry', q:'Before storing, a seed must be…',
      opts:[{e:'&#127806;',t:'Completely dry',ok:1},{e:'&#128167;',t:'Damp'},{e:'&#10052;&#65039;',t:'Frozen wet'},{e:'&#128293;',t:'Warm and moist'}]},
    {c:'dry', q:'What happens to a damp seed in a sealed jar?',
      opts:[{e:'&#129440;',t:'It moulds and will not grow',ok:1},{e:'&#127793;',t:'It sprouts happily'},{e:'&#128274;',t:'Nothing, it is sealed'},{e:'&#129482;',t:'It freezes'}]},
    {c:'dry', q:'The best way to dry seeds is…',
      opts:[{e:'&#128168;',t:'Spread out in a single layer somewhere airy',ok:1},{e:'&#128293;',t:'In a hot oven'},{e:'&#9728;&#65039;',t:'In blazing direct sun all day'},{e:'&#128167;',t:'In a bowl of water'}]},
    {c:'dry', q:'How can you tell a bean seed is dry enough?',
      opts:[{e:'&#129295;',t:'It is hard and does not dent when you press a nail in',ok:1},{e:'&#127912;',t:'It changed colour'},{e:'&#9878;&#65039;',t:'It floats'},{e:'&#128064;',t:'You cannot tell'}]},

    {c:'store', q:'Where should saved seeds be kept?',
      opts:[{e:'&#129482;',t:'Somewhere cool, dark and dry',ok:1},{e:'&#9728;&#65039;',t:'A sunny windowsill'},{e:'&#128703;',t:'The bathroom'},{e:'&#128293;',t:'Next to the oven'}]},
    {c:'store', q:'What should go on the label?',
      opts:[{e:'&#127991;&#65039;',t:'What it is and the year you saved it',ok:1},{e:'&#127912;',t:'A drawing only'},{e:'&#128176;',t:'The price'},{e:'&#128683;',t:'Nothing needed'}]},
    {c:'store', q:'Why does the year matter?',
      opts:[{e:'&#128198;',t:'Seeds sprout less well as they get older',ok:1},{e:'&#127881;',t:'For birthdays'},{e:'&#128176;',t:'For selling'},{e:'&#127912;',t:'It looks tidy'}]},
    {c:'store', q:'Saving seed means next spring you can…',
      opts:[{e:'&#127793;',t:'Plant the garden again without buying seed',ok:1},{e:'&#128722;',t:'Buy more seed'},{e:'&#128164;',t:'Skip the garden'},{e:'&#128683;',t:'Nothing different'}]}
  ],

  build:{
    title:'The Seed Envelope',
    blurb:'Save seed from one plant, dry it properly, and make the envelope that gets it to next spring.',
    time:'20 minutes, plus a week of drying',
    help:'Grown-up helps identify the plant',
    mess:'Tidy',
    materials:['Seeds from a plant you can name — beans, sunflower or tomato','A plate or tray','Paper for the envelope','Glue or tape','A pen','A cool dark place to store it'],
    steps:[
      ['Pick the right plant','Choose the healthiest one you have, and one a grown-up can name for certain.'],
      ['Wait for ready','Beans want a dry rattling pod. Sunflowers want a drooping brown head. Tomatoes are ripe-to-soft.'],
      ['Collect and clean','Take the seeds out. Brush off any dry bits of pod or flower.'],
      ['Dry in a single layer','Spread them on a plate somewhere airy and out of direct sun. Give it a week. Stir them once or twice.'],
      ['Test one','Press a fingernail into a seed. It should not dent. If it does, keep drying.'],
      ['Fold the envelope','Fold and glue a paper envelope. Write the plant, the date and where it grew.'],
      ['Store it cool and dark','A drawer or a tin. Then put a note in a calendar for planting season.']
    ],
    why:'This is the same principle as the drying lesson, aimed at a living thing instead of a stored one: a seed is alive but resting, and water is what would wake it up too early or rot it. Dry, dark and cool keeps it asleep until you decide it is spring — which is why the label carries a date.'
  },

  activities:[
    {id:'seedready', type:'sort', title:'Ready or Not?',
      teaches:'Judge whether a seed is ready to save',
      prompt:'Is this seed ready to collect?',
      bins:[{id:'ready',label:'Ready to save',e:'&#9989;'},{id:'wait',label:'Wait longer',e:'&#8987;'}],
      items:[
        {e:'&#127806;',t:'Brown rattling bean pod',bin:'ready'},{e:'&#127803;',t:'Drooping brown sunflower head',bin:'ready'},
        {e:'&#127813;',t:'Fully ripe tomato',bin:'ready'},{e:'&#127810;',t:'Dry papery seed head',bin:'ready'},
        {e:'&#129362;',t:'Green soft bean pod',bin:'wait'},{e:'&#127803;',t:'Sunflower just opened',bin:'wait'},
        {e:'&#127801;',t:'Flower still blooming',bin:'wait'},{e:'&#127823;',t:'Hard green tomato',bin:'wait'}
      ]},

    {id:'seedsteps', type:'order', title:'Plant to Envelope',
      teaches:'Sequence seed saving from collection to storage',
      prompt:'Tap the steps in order.',
      items:[
        {e:'&#127806;',t:'Wait until the seed is ripe'},
        {e:'&#129530;',t:'Collect the seed'},
        {e:'&#129529;',t:'Clean off the bits'},
        {e:'&#128168;',t:'Dry in a single layer'},
        {e:'&#127991;&#65039;',t:'Label the envelope'},
        {e:'&#129482;',t:'Store somewhere cool and dark'}
      ]},

    {id:'seedstore', type:'pick', title:'Will It Grow Next Spring?',
      teaches:'Choose storage that keeps seed alive',
      questions:[
        {q:'Seeds in a sealed jar on a sunny kitchen windowsill.',
         opts:[{e:'&#10060;',t:'Too warm and too bright — move them',ok:1},{e:'&#9989;',t:'Perfect spot'},{e:'&#129300;',t:'Makes no difference'}],
         why:'Warmth and light both tell a seed it is time to wake up. A seed that starts and stops in a jar has spent the energy it needed for spring.'},
        {q:'Seeds that felt slightly soft, put straight into a sealed bag.',
         opts:[{e:'&#9888;&#65039;',t:'Not dry enough — mould is coming',ok:1},{e:'&#9989;',t:'Fine'},{e:'&#128167;',t:'Add water'}],
         why:'Soft means water still inside. Sealed in a bag, that water has nowhere to go, and mould gets the seed before you do.'},
        {q:'Hard dry seeds in a labelled envelope in a cool dark drawer.',
         opts:[{e:'&#9989;',t:'That is exactly right',ok:1},{e:'&#10060;',t:'Wrong'},{e:'&#129482;',t:'Should be frozen wet'}],
         why:'Dry, dark, cool and labelled. The seed stays asleep, and next spring you know what it is and how old it is.'}
      ]}
  ]
};

/* ---- derived helpers -------------------------------------------- */
LESSONS.list = function(){
  var out=[]; for (var k in LESSONS){ if (LESSONS[k] && LESSONS[k].slug) out.push(LESSONS[k]); }
  return out.sort(function(a,b){ return (a.world+a.n) < (b.world+b.n) ? -1 : 1; });
};
LESSONS.forWorld = function(world){
  return LESSONS.list().filter(function(l){ return l.world===world; })
                       .sort(function(a,b){ return a.n-b.n; });
};

/* ------------------------------------------------------------------
   TEKS alignment map — The Talking Garden
   ------------------------------------------------------------------
   Texas Essential Knowledge and Skills for Science.
   Current standards: 2021 adoption, August 2024 update.
   K §112.2 · 1st §112.3 · 2nd §112.4 · 3rd §112.5 · 4th §112.6 · 5th §112.7

   Every code and quotation below was read from TEKS Guide (teksguide.org),
   the TEA-affiliated standards resource. Verbatim wording is preserved.

   NOTE: 2.13(D) names butterflies and frogs explicitly. Two of the three
   launch topics map onto a single named standard.
------------------------------------------------------------------- */

window.TEKS = {

  // ---- the standards themselves, quoted verbatim ----
  se: {
    'K.12(A)': {
      grade:'Kindergarten', section:'§112.2',
      ks:'Organisms and environments. The student knows that plants and animals depend on the environment to meet their basic needs for survival.',
      text:'observe and identify the dependence of plants on air, sunlight, water, nutrients in the soil, and space to grow'
    },
    'K.13(C)': {
      grade:'Kindergarten', section:'§112.2',
      ks:'Organisms and environments. The student knows that organisms resemble their parents and have structures and undergo processes that help them interact and survive within their environments.',
      text:'identify and record the changes from seed, seedling, plant, flower, and fruit in a simple plant life cycle'
    },
    'K.13(D)': {
      grade:'Kindergarten', section:'§112.2',
      ks:'Organisms and environments. The student knows that organisms resemble their parents and have structures and undergo processes that help them interact and survive within their environments.',
      text:'identify ways that young plants resemble the parent plant'
    },
    '1.13(B)': {
      grade:'Grade 1', section:'§112.3',
      ks:'Organisms and environments. The student knows that organisms resemble their parents and have structures and undergo processes that help them interact and survive within their environments.',
      text:'record observations of and describe basic life cycles of animals, including a bird, a mammal, and a fish'
    },
    '2.13(A)': {
      grade:'Grade 2', section:'§112.4',
      ks:'Organisms and environments. The student knows that organisms have structures and undergo processes that help them interact and survive within their environments.',
      text:'identify the roots, stems, leaves, flowers, fruits, and seeds of plants and compare how those structures help different plants meet their basic needs for survival'
    },
    '2.13(D)': {
      grade:'Grade 2', section:'§112.4',
      ks:'Organisms and environments. The student knows that organisms have structures and undergo processes that help them interact and survive within their environments.',
      text:'investigate and describe some of the unique life cycles of animals where young animals do not resemble their parents, including butterflies and frogs'
    },

    /* ---- added when the other eleven lessons were verified ----
       Every entry below was read from 19 TAC as published (science
       Chapter 112 adopted 2021; health Chapter 115 adopted 2020) and
       the wording is preserved exactly. Sources are recorded in
       TEKS.readFrom at the bottom of this file. */

    'K.10(B)': { grade:'Kindergarten', section:'§112.2', subject:'Science',
      ks:'Earth and space. The student knows that there are recognizable patterns and objects in the sky.',
      text:'observe and describe weather changes from day to day and over seasons' },
    'K.11':    { grade:'Kindergarten', section:'§112.2', subject:'Science',
      ks:'Earth and space. The student knows that natural resources are important to everyday life.',
      text:'observe and generate examples of practical uses for rocks, soil, and water' },
    'K.12(B)': { grade:'Kindergarten', section:'§112.2', subject:'Science',
      ks:'Organisms and environments. The student knows that plants and animals depend on the environment to meet their basic needs for survival.',
      text:'observe and identify the dependence of animals on air, water, food, space, and shelter' },
    'K.8(A)':  { grade:'Kindergarten', section:'§112.2', subject:'Science',
      ks:'Force, motion, and energy. The student knows that energy is everywhere and can be observed in everyday life.',
      text:'communicate the idea that objects can only be seen when a light source is present and compare the effects of different amounts of light' },

    '2.2(D)':  { grade:'Grade 2', section:'§112.4', subject:'Science',
      ks:'Scientific and engineering practices. The student analyzes and interprets data to derive meaning, identify features and patterns, and discover relationships or correlations to develop evidence-based arguments or evaluate designs.',
      text:'evaluate a design or object using criteria to determine if it works as intended' },
    '2.9(A)':  { grade:'Grade 2', section:'§112.4', subject:'Science',
      ks:'Earth and space. The student knows the relationships between the Sun, Earth, and Moon.',
      text:'describe the Sun as a star that provides light and heat and explain that the Moon reflects the Sun\u2019s light' },
    '2.10(A)': { grade:'Grade 2', section:'§112.4', subject:'Science',
      ks:'Earth and space. The student knows that there are recognizable patterns and objects in the sky and predictable changes to Earth\u2019s surface.',
      text:'investigate and describe how wind and water move soil and rock particles across the Earth\u2019s surface' },
    '2.10(B)': { grade:'Grade 2', section:'§112.4', subject:'Science',
      ks:'Earth and space. The student knows that there are recognizable patterns and objects in the sky and predictable changes to Earth\u2019s surface.',
      text:'measure, record, and graph weather information, including temperature and precipitation' },
    '2.11(B)': { grade:'Grade 2', section:'§112.4', subject:'Science',
      ks:'Earth and space. The student knows that some natural resources are limited and can be conserved.',
      text:'describe how human impact can be limited by making choices to conserve and properly dispose of materials' },
    '2.12(A)': { grade:'Grade 2', section:'§112.4', subject:'Science',
      ks:'Organisms and environments. The student knows that living organisms have basic needs that must be met for them to survive within their environment.',
      text:'describe how the physical characteristics of environments, including the amount of rainfall, support plants and animals' },
    '2.12(C)': { grade:'Grade 2', section:'§112.4', subject:'Science',
      ks:'Organisms and environments. The student knows that living organisms have basic needs that must be met for them to survive within their environment.',
      text:'explain and demonstrate how some plants depend on other living things, wind, or water for pollination and to move their seeds' },

    '3.1(B)':  { grade:'Grade 3', section:'§112.5', subject:'Science',
      ks:'Scientific and engineering practices. The student asks questions, identifies problems, and plans and safely conducts classroom, laboratory, and field investigations.',
      text:'use scientific practices to plan and conduct descriptive investigations and use engineering practices to design solutions to problems' },
    '3.1(G)':  { grade:'Grade 3', section:'§112.5', subject:'Science',
      ks:'Scientific and engineering practices. The student asks questions, identifies problems, and plans and safely conducts classroom, laboratory, and field investigations.',
      text:'develop and use models to represent phenomena, objects, and processes or design a prototype for a solution to a problem' },
    '3.10(B)': { grade:'Grade 3', section:'§112.5', subject:'Science',
      ks:'Earth and space. The student knows there are recognizable patterns and systems in the Earth, Sun, and Moon system and Earth\u2019s surface.',
      text:'investigate and explain how soils such as sand and clay are formed by weathering of rock and by decomposition of plant and animal remains' },
    '3.11(A)': { grade:'Grade 3', section:'§112.5', subject:'Science',
      ks:'Earth and space. The student knows that some natural resources are limited and can be conserved.',
      text:'explore and explain how humans use natural resources such as in construction, in agriculture, in transportation, and to make products' },
    '3.11(C)': { grade:'Grade 3', section:'§112.5', subject:'Science',
      ks:'Earth and space. The student knows that some natural resources are limited and can be conserved.',
      text:'identify ways to conserve natural resources through reducing, reusing, or recycling' },
    '3.12(A)': { grade:'Grade 3', section:'§112.5', subject:'Science',
      ks:'Organisms and environments. The student describes patterns, cycles, systems, and relationships within environments.',
      text:'explain how temperature and precipitation affect animal growth and behavior through migration and hibernation and plant responses through dormancy' },
    '3.12(B)': { grade:'Grade 3', section:'§112.5', subject:'Science',
      ks:'Organisms and environments. The student describes patterns, cycles, systems, and relationships within environments.',
      text:'identify and describe the flow of energy in a food chain and predict how changes in a food chain such as removal of frogs from a pond or bees from a field affect the ecosystem' },
    '3.12(C)': { grade:'Grade 3', section:'§112.5', subject:'Science',
      ks:'Organisms and environments. The student describes patterns, cycles, systems, and relationships within environments.',
      text:'describe how natural changes to the environment such as floods and droughts cause some organisms to thrive and others to perish or move to new locations' },
    '3.13(B)': { grade:'Grade 3', section:'§112.5', subject:'Science',
      ks:'Organisms and environments. The student knows that organisms undergo similar life processes and have structures and behaviors that help them survive within their environments.',
      text:'explore, illustrate, and compare life cycles in organisms such as beetles, crickets, radishes, or lima beans' },

    '4.8(B)':  { grade:'Grade 4', section:'§112.6', subject:'Science',
      ks:'Force, motion, and energy. The student knows that energy is everywhere and can be observed in cycles, patterns, and systems.',
      text:'identify conductors and insulators of thermal and electrical energy' },
    '4.10(B)': { grade:'Grade 4', section:'§112.6', subject:'Science',
      ks:'Earth and space. The student knows that there are recognizable patterns and cycles in the Earth, Sun, and Moon system and on Earth\u2019s surface.',
      text:'model and describe slow changes to Earth\u2019s surface caused by weathering, erosion, and deposition from water, wind, and ice' },
    '4.11(A)': { grade:'Grade 4', section:'§112.6', subject:'Science',
      ks:'Earth and space. The student knows that natural resources can be renewable or nonrenewable.',
      text:'identify and explain advantages and disadvantages of using Earth\u2019s renewable and nonrenewable natural resources such as wind, water, sunlight, plants, animals, coal, oil, and natural gas' },
    '4.12(B)': { grade:'Grade 4', section:'§112.6', subject:'Science',
      ks:'Organisms and environments. The student knows and can describe patterns, cycles, systems, and relationships within environments.',
      text:'describe the cycling of matter and flow of energy through food webs, including the roles of the Sun, producers, consumers, and decomposers' },
    '4.13(B)': { grade:'Grade 4', section:'§112.6', subject:'Science',
      ks:'Organisms and environments. The student knows that organisms undergo similar life processes and have structures and behaviors that help them survive within their environments.',
      text:'differentiate between inherited and acquired physical traits of organisms' },

    '5.8(C)':  { grade:'Grade 5', section:'§112.7', subject:'Science',
      ks:'Force, motion, and energy. The student knows that energy occurs in many forms and can be observed in cycles, patterns, and systems.',
      text:'demonstrate and explain how light travels in a straight line and can be reflected, refracted, or absorbed' },
    '5.11':    { grade:'Grade 5', section:'§112.7', subject:'Science',
      ks:'Earth and space. The student knows that there are recognizable patterns and systems within Earth\u2019s surface and that natural resources can be conserved.',
      text:'design and explain solutions such as conservation, recycling, or proper disposal to minimize environmental impact of the use of natural resources' },
    '5.12(A)': { grade:'Grade 5', section:'§112.7', subject:'Science',
      ks:'Organisms and environments. The student knows the relationships of organisms and their interactions with the environment.',
      text:'observe and describe how a variety of organisms survive by interacting with biotic and abiotic factors in a healthy ecosystem' },
    '5.12(C)': { grade:'Grade 5', section:'§112.7', subject:'Science',
      ks:'Organisms and environments. The student knows the relationships of organisms and their interactions with the environment.',
      text:'describe a healthy ecosystem and how human activities can be beneficial or harmful to an ecosystem' },

    /* ---- Health, 19 TAC Chapter 115, adopted 2020 ---- */
    'H.2.6(A)': { grade:'Grade 2', section:'§115.14', subject:'Health',
      ks:'Physical health and hygiene \u2014 nutrition.',
      text:'identify types of nutrients' },
    'H.2.6(B)': { grade:'Grade 2', section:'§115.14', subject:'Health',
      ks:'Physical health and hygiene \u2014 nutrition.',
      text:'use familiar objects to identify healthy food portions from different food groups' },
    'H.2.6(C)': { grade:'Grade 2', section:'§115.14', subject:'Health',
      ks:'Physical health and hygiene \u2014 nutrition.',
      text:'identify healthy and unhealthy choices within the food groups' },
    'H.2.6(D)': { grade:'Grade 2', section:'§115.14', subject:'Health',
      ks:'Physical health and hygiene \u2014 nutrition.',
      text:'identify the benefits of making healthy beverage choices, including water and milk, and limiting sweetened beverages such as soda and sports drinks' },
    'H.2.8(A)': { grade:'Grade 2', section:'§115.14', subject:'Health',
      ks:'Physical health and hygiene \u2014 healthy habits.',
      text:'identify signs and symptoms of common food allergies' },
    'H.5.2(E)': { grade:'Grade 5', section:'§115.17', subject:'Health',
      ks:'Health behaviors \u2014 personal health and hygiene.',
      text:'analyze how personal hygiene helps prevent the spread of germs and communicable illnesses' }

  },

  // ---- topic-level alignment ----
  topics: {
    plant:     { primary:'K.13(C)',  also:['K.12(A)','2.13(A)','K.13(D)'] },
    butterfly: { primary:'2.13(D)',  also:['1.13(B)'] },
    frog:      { primary:'2.13(D)',  also:['1.13(B)'] }
  },

  // ---- activity-level alignment ----
  activities: {
    seq:   { se:'K.13(C)', skill:'Sequence the stages of a simple plant life cycle' },
    parts: { se:'2.13(A)', skill:'Identify plant structures and how each helps the plant survive' },
    eat:   { se:'2.13(A)', skill:'Relate edible foods to the plant structure they come from' },
    need:  { se:'K.12(A)', skill:'Identify what plants depend on to grow' },
    seed:  { se:'K.12(A)', skill:'Grow a plant by giving it what it needs' },
    worm:  { se:'K.12(A)', skill:'Sort what feeds the soil plants grow in' }
  },

  /* Where every code above was read from, so the next person can check
     the work instead of trusting it. */
  readFrom: [
    { what:'Science, 19 TAC Chapter 112 Subchapter A, adopted 2021, in effect from 2024-25',
      url:'https://www.law.cornell.edu/regulations/texas/19-Tex-Admin-Code-SS-112-2' },
    { what:'Health Education, 19 TAC Chapter 115 Subchapter A, adopted 2020',
      url:'http://txrules.elaws.us/rule/title19_chapter115_sec.115.14' },
    { what:'TEKS Guide (TEA), used for the original plant lesson codes',
      url:'https://teksguide.org/' }
  ],

  label: function (key) {
    var a = window.TEKS.activities[key]; if (!a) return '';
    var s = window.TEKS.se[a.se];
    return s.grade + ' TEKS ' + a.se;
  },

  topicLine: function (slug) {
    var t = window.TEKS.topics[slug]; if (!t) return '';
    var s = window.TEKS.se[t.primary];
    return { code:t.primary, grade:s.grade, section:s.section, text:s.text,
             also:t.also.map(function(c){ return c + ' (' + window.TEKS.se[c].grade + ')'; }) };
  }
};

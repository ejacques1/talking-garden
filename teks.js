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
    }
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

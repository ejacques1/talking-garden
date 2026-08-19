/* ------------------------------------------------------------------
   TEKS alignment map — The Talking Garden
   ------------------------------------------------------------------
   Texas Essential Knowledge and Skills for Science.
   Current standards: 2021 adoption, August 2024 update.
   Section numbering: K §112.2 · 1st §112.3 · 2nd §112.4
                      3rd §112.5 · 4th §112.6 · 5th §112.7

   VERIFIED   — grade-level placement confirmed against TEA materials.
   PENDING    — exact student-expectation codes (e.g. "2.13(B)") still
                need to be read off the official TEKS PDF and pasted
                into the `se` field below. Do not guess them: an
                unverifiable citation is worse than none, especially
                on a page used for grant reporting.

   Official source (download in a browser, TEA blocks scripted access):
   https://tea.texas.gov/about-tea/laws-and-rules/texas-administrative-code/19-tac-chapter-112
------------------------------------------------------------------- */

window.TEKS = {

  // ---- topic-level placement (VERIFIED) ----
  topics: {
    plant: {
      grade:   'Grade 2',
      section: '§112.4',
      strand:  'Organisms and environments',
      claim:   'Plant life cycles, and how the basic needs of plants are met through their structures.',
      status:  'verified'
    },
    butterfly: {
      grade:   'Grade 1',
      section: '§112.3',
      strand:  'Organisms and environments',
      claim:   'Animal life cycles, and likenesses between parents and young.',
      status:  'verified'
    },
    frog: {
      grade:   'Grade 1',
      section: '§112.3',
      strand:  'Organisms and environments',
      claim:   'Animal life cycles, and likenesses between parents and young.',
      status:  'verified'
    }
  },

  // ---- activity-level mapping ----
  // `se` stays empty until the exact code is read off the official PDF.
  activities: {
    seq:   { topic:'plant', grade:'Grade 2', section:'§112.4',
             skill:'Sequence the stages of a plant life cycle', se:'' },
    parts: { topic:'plant', grade:'Grade 2', section:'§112.4',
             skill:'Identify plant structures and the function of each', se:'' },
    eat:   { topic:'plant', grade:'Grade 2', section:'§112.4',
             skill:'Relate edible foods to the plant structure they come from', se:'' },
    need:  { topic:'plant', grade:'Grade 2', section:'§112.4',
             skill:'Identify the basic needs of plants', se:'' }
  },

  // Render a short, honest label. Shows the code only once it exists.
  label: function (key) {
    var a = window.TEKS.activities[key];
    if (!a) return '';
    return a.se ? (a.grade + ' TEKS ' + a.se) : (a.grade + ' science · ' + a.section);
  }
};

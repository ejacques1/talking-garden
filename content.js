/* ------------------------------------------------------------------
   Lesson content — the layer between lessons.js and the page
   ------------------------------------------------------------------
   lessons.js holds the twelve lessons as shipped. This loads anything
   edited in the admin panel and merges it on top, so DHCG can change
   a lesson without a developer.

   THE FLOOR RULE
   The shipped twelve are never removed, only covered. If the database
   is empty, unreachable, or a row is deleted, every page still has
   twelve working lessons. There is no sequence of admin actions that
   ends with a family looking at an empty world.

   VALIDATION HAPPENS HERE, NOT ONLY IN THE FORM
   A lesson can arrive from the form or pasted whole from an AI tool.
   Either way it passes the same checks before it is allowed to cover a
   working lesson, because a saved lesson that crashes topic pages is
   worse than an unedited one.
------------------------------------------------------------------- */
(function (global) {

  var client = null, loaded = false, overrides = {};

  function demo(){ return global.TG_DEMO; }

  async function sb(){
    if (client) return client;
    var mod = await import('https://esm.sh/@supabase/supabase-js@2');
    client = mod.createClient(global.TG_CONFIG.SUPABASE_URL, global.TG_CONFIG.SUPABASE_ANON_KEY);
    return client;
  }

  function localAll(){
    try { return JSON.parse(localStorage.getItem('dl_lessons')) || {}; }
    catch (e) { return {}; }
  }
  function localSave(all){
    try { localStorage.setItem('dl_lessons', JSON.stringify(all)); } catch (e) {}
  }

  /* ---------------- validation ----------------
     Returns [] when the record is safe to publish, otherwise a list of
     plain-English problems to show whoever is editing. */
  function check(L){
    var out = [];
    function need(c, m){ if (!c) out.push(m); }

    need(L && typeof L === 'object', 'This is not a lesson record.');
    if (!out.length === false) return out;
    if (!L || typeof L !== 'object') return out;

    need(L.slug && /^[a-z0-9]+$/.test(L.slug), 'The slug must be lower-case letters and numbers only.');
    need(L.world && (global.WORLDS||[]).some(function(w){ return w.key === L.world; }),
         'The world must be one of the six.');
    need(L.title && L.title.length > 2, 'A lesson needs a title.');
    need(L.grades, 'A lesson needs a grade band.');
    need(L.safety, 'A lesson needs a safety line. Every lesson has one, even the tidy ones.');

    var comps = L.competencies || [];
    need(comps.length >= 2, 'A lesson needs at least two skills.');
    var ids = comps.map(function(c){ return c.id; });
    comps.forEach(function(c){
      need(c.id && c.label, 'Every skill needs an id and a label.');
    });
    need(ids.length === ids.filter(function(v,i){ return ids.indexOf(v)===i; }).length,
         'Two skills share the same id.');

    var bank = L.bank || [];
    comps.forEach(function(c){
      var n = bank.filter(function(q){ return q.c === c.id; }).length;
      /* Pre and post draw different questions for the same skill, so
         four per skill is the floor — two each — or the after-check
         starts repeating the before-check. */
      need(n >= 4, 'Skill "'+(c.label||c.id)+'" has '+n+' questions. It needs at least 4 so the before and after checks can differ.');
    });
    bank.forEach(function(q, i){
      need(q.q, 'Question '+(i+1)+' has no text.');
      need(ids.indexOf(q.c) > -1, 'Question '+(i+1)+' is tagged with a skill that does not exist.');
      var ok = (q.opts||[]).filter(function(o){ return o.ok; }).length;
      need(ok === 1, 'Question '+(i+1)+' has '+ok+' correct answers. It needs exactly one.');
      need((q.opts||[]).length >= 3, 'Question '+(i+1)+' needs at least three options.');
    });

    /* A lesson may offer one build or several. */
    var builds = (L.builds && L.builds.length) ? L.builds : (L.build ? [L.build] : []);
    need(builds.length, 'A lesson needs at least one at-home build.');
    builds.forEach(function(b, bi){
      var nm = b.title || ('build '+(bi+1));
      need(b.title, 'Build '+(bi+1)+' needs a title.');
      need((b.materials||[]).length, '"'+nm+'" needs a materials list.');
      need((b.steps||[]).length >= 3, '"'+nm+'" needs at least three steps.');
      need(b.why, '"'+nm+'" needs a "why it works" note.');
      (b.steps||[]).forEach(function(st, i){
        need(Array.isArray(st) && st.length === 2 && st[0] && st[1],
             '"'+nm+'" step '+(i+1)+' should be a heading and a sentence.');
      });
    });

    if (L.movie && L.movie.url)
      need(/^https?:\/\//.test(L.movie.url), 'The film link should start with http.');

    if (L.session){
      var S = L.session;
      need(!S.url || /^https?:\/\//.test(S.url), 'The recording link should start with http.');
      need(!S.word || /^[a-z0-9 -]{3,24}$/i.test(S.word),
           'The secret word should be a few plain words — no punctuation.');
      need(!(S.url && !S.word),
           'A recording needs a secret word, or families cannot unlock the rest of the lesson.');
    }

    var acts = L.activities || [];
    need(acts.length >= 2, 'A lesson needs at least two activities.');
    acts.forEach(function(a){
      var nm = a.title || a.id || 'an activity';
      need(a.id && a.title && a.teaches, '"'+nm+'" needs an id, a title and a skill line.');
      if (a.type === 'sort'){
        var bins = (a.bins||[]).map(function(x){ return x.id; });
        need(bins.length >= 2, '"'+nm+'" needs at least two bins.');
        need((a.items||[]).length >= 4, '"'+nm+'" needs at least four things to sort.');
        (a.items||[]).forEach(function(it){
          need(bins.indexOf(it.bin) > -1, '"'+nm+'": "'+(it.t||'?')+'" is sorted into a bin that does not exist.');
        });
        bins.forEach(function(bn){
          need((a.items||[]).some(function(it){ return it.bin === bn; }),
               '"'+nm+'": one bin has nothing that belongs in it.');
        });
      } else if (a.type === 'order'){
        need((a.items||[]).length >= 3, '"'+nm+'" needs at least three steps to put in order.');
      } else if (a.type === 'match'){
        need((a.pairs||[]).length >= 3, '"'+nm+'" needs at least three pairs.');
        var answers = (a.pairs||[]).map(function(pr){ return pr.b && pr.b.t; });
        need(answers.length === answers.filter(function(v,i){ return answers.indexOf(v)===i; }).length,
             '"'+nm+'": two pairs have the same answer, so one can never be matched.');
      } else if (a.type === 'pick'){
        need((a.questions||[]).length >= 2, '"'+nm+'" needs at least two questions.');
        (a.questions||[]).forEach(function(q, i){
          var ok = (q.opts||[]).filter(function(o){ return o.ok; }).length;
          need(ok === 1, '"'+nm+'" question '+(i+1)+' needs exactly one correct answer.');
          need(q.why && q.why.length > 20, '"'+nm+'" question '+(i+1)+' needs an explanation of why.');
        });
      } else if (a.type === 'custom'){
        /* A lesson can bring a hand-built activity. All this layer can
           check is that a renderer by that name is actually loaded —
           if the page cannot draw it, the card would open on nothing. */
        need(a.render, '"'+nm+'" is a custom activity but does not say which one to draw.');
        need(!a.render || !global.TGPlay || global.TGPlay.custom[a.render],
             '"'+nm+'" needs the script that draws it, and it is not loaded.');
      } else {
        out.push('"'+nm+'" has type "'+(a.type||'none')+'". It must be order, sort, match, pick or custom.');
      }
    });

    return out;
  }

  var C = {

    check: check,

    /* Every page calls this once before it draws. Failure is silent on
       purpose: a family should get the shipped lesson, not an error. */
    async load(force){
      if (loaded && !force) return overrides;
      overrides = {};
      try{
        if (demo()){
          overrides = localAll();
        } else {
          var c = await sb();
          var r = await c.from('lessons').select('slug,data,published');
          (r.data || []).forEach(function(row){
            if (row && row.data) overrides[row.slug] = row.data;
          });
        }
      }catch(e){ overrides = {}; }

      Object.keys(overrides).forEach(function(slug){
        var L = overrides[slug];
        /* A row that would break a page never gets to cover one. */
        if (check(L).length){ delete overrides[slug]; return; }
        L.slug = slug;
        L.edited = true;
        global.LESSONS[slug] = L;
      });

      loaded = true;
      return overrides;
    },

    /* What the admin panel edits: the saved version if there is one,
       otherwise the shipped one. */
    current(slug){ return global.LESSONS[slug] || null; },

    /* The shipped version, whatever has been saved over it. Used by
       "start again from the original". */
    shipped(slug){ return C._original[slug] || null; },
    isEdited(slug){ return !!(global.LESSONS[slug] && global.LESSONS[slug].edited); },

    async save(L, publish){
      var problems = check(L);
      if (problems.length) return { ok:false, problems:problems };

      var row = { slug:L.slug, world:L.world, n:L.n||1, data:L, published: !!publish };
      if (demo()){
        var all = localAll(); all[L.slug] = L; localSave(all);
        global.LESSONS[L.slug] = L; L.edited = true;
        return { ok:true };
      }
      try{
        var c = await sb();
        var r = await c.from('lessons').upsert(row, { onConflict:'slug' }).select();
        if (r.error) throw r.error;
        /* An insert blocked by row level security comes back with no
           error and no rows. Saving nothing is a failure, not a save. */
        if (!r.data || !r.data.length)
          return { ok:false, problems:['The database accepted the request but saved nothing — usually means this account is not an admin.'] };
        await c.from('lesson_history').insert({ slug:L.slug, data:L });
        global.LESSONS[L.slug] = L; L.edited = true;
        return { ok:true };
      }catch(e){
        return { ok:false, problems:[String(e.message||e)] };
      }
    },

    /* Drop the edit and fall back to the shipped lesson. */
    async revert(slug){
      if (demo()){
        var all = localAll(); delete all[slug]; localSave(all);
      } else {
        try{ var c = await sb(); await c.from('lessons').delete().eq('slug', slug); }
        catch(e){ return String(e.message||e); }
      }
      if (C._original[slug]) global.LESSONS[slug] = C._original[slug];
      return true;
    },

    async history(slug){
      if (demo()) return [];
      try{
        var c = await sb();
        var r = await c.from('lesson_history').select('id,saved_at,data')
                       .eq('slug', slug).order('saved_at', { ascending:false }).limit(20);
        return r.data || [];
      }catch(e){ return []; }
    }
  };

  /* Snapshot the shipped twelve before anything covers them. */
  C._original = {};
  Object.keys(global.LESSONS || {}).forEach(function(k){
    var L = global.LESSONS[k];
    if (L && L.slug) C._original[k] = L;
  });

  global.TGContent = C;
})(window);

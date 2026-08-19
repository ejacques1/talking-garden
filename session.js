/* ------------------------------------------------------------------
   Sessions and progress — stored in Supabase
   ------------------------------------------------------------------
   Every session a topic has ever run is its own row. Nothing is
   overwritten, which is what makes the rest work:

     · old garden words keep unlocking, so a family watching September's
       recording in December can still get in
     · old recordings survive instead of being replaced each week
     · there is a real history to show a funder

   Activity and build completion moves here too, so a child who plays
   on the iPad sees the same progress on a laptop.

   Falls back to this browser's storage only when Supabase is not
   configured, so the prototype still runs unconfigured.
------------------------------------------------------------------- */
(function (global) {

  var client = null, cacheSessions = null, cacheProgress = null;

  function demo(){ return global.TG_DEMO; }

  async function sb(){
    if (client) return client;
    var mod = await import('https://esm.sh/@supabase/supabase-js@2');
    client = mod.createClient(global.TG_CONFIG.SUPABASE_URL, global.TG_CONFIG.SUPABASE_ANON_KEY);
    return client;
  }

  /* ---------- local fallback ---------- */
  function localSessions(){
    try { return JSON.parse(localStorage.getItem('tg_sessions')) || []; }
    catch (e) { return []; }
  }
  function saveLocalSessions(rows){
    try { localStorage.setItem('tg_sessions', JSON.stringify(rows)); } catch (e) {}
  }
  function localProgress(){
    try { return JSON.parse(localStorage.getItem('tg_progress')) || []; }
    catch (e) { return []; }
  }

  function norm(r){
    return { id: r.id, topic: r.topic_slug || r.topic, starts_at: r.starts_at,
             word: (r.garden_word || r.word || '').trim(),
             join_url: r.join_url || '', recording_url: r.recording_url || '',
             movie_url: r.movie_url || '', host_name: r.host_name || '',
             repeat_weekly: !!r.repeat_weekly };
  }

  var S = {

    /* ---------- loading ---------- */
    async loadAll(force){
      if (cacheSessions && !force) return cacheSessions;
      if (demo()){ cacheSessions = localSessions().map(norm); return cacheSessions; }
      try{
        var c = await sb();
        var r = await c.from('sessions').select('*').order('starts_at', { ascending: true });
        cacheSessions = (r.data || []).map(norm);
      }catch(e){ cacheSessions = []; }
      return cacheSessions;
    },

    all(){ return cacheSessions || []; },

    forTopic(slug){
      return (cacheSessions || [])
        .filter(function(s){ return s.topic === slug && s.starts_at; })
        .sort(function(a,b){ return new Date(a.starts_at) - new Date(b.starts_at); });
    },

    /* The next one still to come. */
    next(slug){
      var now = new Date();
      return S.forTopic(slug).filter(function(s){ return new Date(s.starts_at) > now; })[0] || null;
    },

    /* Sessions that have already run, newest first. */
    past(slug){
      var now = new Date();
      return S.forTopic(slug).filter(function(s){ return new Date(s.starts_at) <= now; }).reverse();
    },

    /* Every word this topic has ever used. An old recording never
       stops working because its word is still on the list. */
    words(slug){
      return S.forTopic(slug)
        .map(function(s){ return (s.word||'').toLowerCase(); })
        .filter(Boolean);
    },

    accepts(slug, typed){
      var v = String(typed||'').trim().toLowerCase();
      if (!v) return false;
      var list = S.words(slug);
      if (!list.length) return v === 'sunflower';   // nothing scheduled yet
      return list.indexOf(v) > -1;
    },

    /* The soonest upcoming session across several topics. */
    soonest(slugs){
      var best = null;
      (slugs||[]).forEach(function(slug){
        var n = S.next(slug);
        if (n && (!best || new Date(n.starts_at) < new Date(best.starts_at))) best = n;
      });
      return best;
    },

    /* ---------- writing ---------- */
    async save(row){
      var payload = {
        topic_slug: row.topic,
        starts_at:  row.starts_at,
        garden_word: (row.word||'').trim().toLowerCase(),
        join_url: row.join_url || null,
        recording_url: row.recording_url || null,
        host_name: row.host_name || null,
        repeat_weekly: !!row.repeat_weekly
      };
      if (demo()){
        var rows = localSessions();
        if (row.id){
          rows = rows.map(function(r){ return r.id === row.id ? Object.assign({}, r, payload, {id:row.id}) : r; });
        } else {
          payload.id = 'l_' + rows.length + '_' + payload.topic_slug + '_' + payload.starts_at;
          rows.push(payload);
        }
        saveLocalSessions(rows);
        cacheSessions = null; await S.loadAll(true);
        return true;
      }
      try{
        var c = await sb();
        var r = row.id
          ? await c.from('sessions').update(payload).eq('id', row.id)
          : await c.from('sessions').insert(payload);
        if (r.error) throw r.error;
        cacheSessions = null; await S.loadAll(true);
        return true;
      }catch(e){ return String(e.message||e); }
    },

    async remove(id){
      if (demo()){
        saveLocalSessions(localSessions().filter(function(r){ return r.id !== id; }));
        cacheSessions = null; await S.loadAll(true); return true;
      }
      try{
        var c = await sb();
        await c.from('sessions').delete().eq('id', id);
        cacheSessions = null; await S.loadAll(true); return true;
      }catch(e){ return String(e.message||e); }
    },

    /* ---------- formatting ---------- */
    d: function(s){ if(!s||!s.starts_at) return null; var d=new Date(s.starts_at); return isNaN(d)?null:d; },
    long: function(s){ var d=S.d(s); return d && d.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}); },
    short: function(s){ var d=S.d(s); return d && d.toLocaleDateString('en-US',{month:'long',day:'numeric'}); },
    time: function(s){ var d=S.d(s); return d && d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}); },
    line: function(s, host){
      var d=S.d(s); if(!d) return null;
      return S.long(s)+' · '+S.time(s)+(host||s.host_name ? ' · with '+(s.host_name||host) : '');
    },
    countdown: function(s){
      var d=S.d(s); if(!d) return null;
      var ms=d-new Date(); if(ms<=0) return null;
      return { days:Math.floor(ms/86400000), hrs:Math.floor(ms/3600000)%24, mins:Math.floor(ms/60000)%60 };
    },
    passed: function(s){ var d=S.d(s); return d ? (new Date()>d) : false; }
  };

  /* ================= activity progress ================= */
  var P = {
    async load(childId, force){
      if (cacheProgress && !force) return cacheProgress;
      if (demo() || !childId){ cacheProgress = localProgress(); return cacheProgress; }
      try{
        var c = await sb();
        var r = await c.from('progress').select('activity_key').eq('child_id', childId);
        cacheProgress = (r.data||[]).map(function(x){ return x.activity_key; });
      }catch(e){ cacheProgress = localProgress(); }
      return cacheProgress;
    },
    done(key){ return (cacheProgress||[]).indexOf(key) > -1; },
    async mark(childId, topicSlug, key){
      if (!cacheProgress) cacheProgress = [];
      if (cacheProgress.indexOf(key) < 0) cacheProgress.push(key);
      /* Always keep a local copy so a dropped connection never loses a
         child's work mid-activity. */
      try{ localStorage.setItem('tg_progress', JSON.stringify(cacheProgress)); }catch(e){}
      if (demo() || !childId) return true;
      try{
        var c = await sb();
        await c.from('progress').upsert(
          { child_id: childId, topic_slug: topicSlug, activity_key: key },
          { onConflict: 'child_id,activity_key' });
      }catch(e){}
      return true;
    }
  };

  global.TGSession = S;
  global.TGProgress = P;
})(window);

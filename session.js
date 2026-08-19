/* ------------------------------------------------------------------
   Session schedule — one source of truth
   ------------------------------------------------------------------
   Every place a date appears — the dashboard's next-session card, the
   countdown, the topic tiles, "see you on the 3rd" after the
   before-check, the live tab — reads from here.

   Ms. Nia sets a date once per topic. Nothing else hardcodes a day of
   the week, which is how "Saturday" ended up stale in four places.

   Stored per topic so she can reschedule week to week.
------------------------------------------------------------------- */
(function (global) {

  function read(slug){
    try { return JSON.parse(localStorage.getItem('tg_session_' + slug)) || {}; }
    catch (e) { return {}; }
  }
  function write(slug, cfg){
    try { localStorage.setItem('tg_session_' + slug, JSON.stringify(cfg)); } catch (e) {}
  }
  function when(slug){
    var v = read(slug).when;
    if (!v) return null;
    var d = new Date(v);
    return isNaN(d) ? null : d;
  }

  global.TGSession = {
    get: read,
    set: write,
    date: when,

    /* "Thursday 3 September" — long enough to be unambiguous. */
    long: function (slug){
      var d = when(slug); if (!d) return null;
      return d.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });
    },
    /* "September 3" — for tight spaces like a tile. */
    short: function (slug){
      var d = when(slug); if (!d) return null;
      return d.toLocaleDateString('en-US', { month:'long', day:'numeric' });
    },
    time: function (slug){
      var d = when(slug); if (!d) return null;
      return d.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit' });
    },
    /* "Thursday 3 September · 10:00 AM · with Ms. Nia" */
    line: function (slug, host){
      var d = when(slug); if (!d) return null;
      return global.TGSession.long(slug) + ' · ' + global.TGSession.time(slug) +
             (host ? ' · with ' + host : '');
    },

    /* Days, hours and minutes until it starts. Null once it has passed. */
    countdown: function (slug){
      var d = when(slug); if (!d) return null;
      var ms = d - new Date();
      if (ms <= 0) return null;
      return { days: Math.floor(ms/86400000),
               hrs:  Math.floor(ms/3600000) % 24,
               mins: Math.floor(ms/60000) % 60 };
    },
    passed: function (slug){
      var d = when(slug); return d ? (new Date() > d) : false;
    },

    /* The soonest upcoming session across every topic given. */
    next: function (slugs){
      var best = null;
      (slugs||[]).forEach(function (s){
        var d = when(s);
        if (d && d > new Date() && (!best || d < best.date)) best = { slug:s, date:d };
      });
      return best;
    }
  };
})(window);

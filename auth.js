/* ------------------------------------------------------------------
   The Talking Garden — auth layer
   ------------------------------------------------------------------
   One small API used by every page. It talks to Supabase when
   config.js has credentials, and falls back to a self-contained
   demo running in localStorage when it doesn't — so the whole
   flow is clickable before the Supabase project exists.

   TG.signUp({email,password,parentName,children})
   TG.signIn({email,password})
   TG.sendMagicLink(email)
   TG.signOut()
   TG.session()        -> {user:{id,email}, profile:{...}} | null
   TG.requireAuth()    -> redirects to login.html if signed out
   TG.children()       -> [{id,name,grade}]
   TG.unlock(topic)    -> mark a topic unlocked for this family
   TG.isUnlocked(topic)
------------------------------------------------------------------- */
(function (global) {

  var DEMO_KEY = 'tg_demo_auth_v1';
  var client = null;

  function demo() { return global.TG_DEMO; }

  /* ---------- demo store ---------- */
  function readDemo() {
    try { return JSON.parse(localStorage.getItem(DEMO_KEY)) || { users: {}, current: null }; }
    catch (e) { return { users: {}, current: null }; }
  }
  function writeDemo(d) {
    try { localStorage.setItem(DEMO_KEY, JSON.stringify(d)); } catch (e) {}
  }
  function uid() {
    return 'u_' + Math.abs(Date.now() ^ (performance.now() * 1000 | 0)).toString(36);
  }

  /* ---------- supabase client (lazy) ---------- */
  async function sb() {
    if (client) return client;
    var mod = await import('https://esm.sh/@supabase/supabase-js@2');
    client = mod.createClient(global.TG_CONFIG.SUPABASE_URL, global.TG_CONFIG.SUPABASE_ANON_KEY);
    return client;
  }

  var TG = {

    isDemo: demo,

    async signUp(o) {
      if (demo()) {
        var d = readDemo();
        var key = (o.email || '').trim().toLowerCase();
        if (!key || !o.password) throw new Error('Please fill in an email and a password.');
        if (d.users[key]) throw new Error('That email already has an account. Try logging in instead.');
        d.users[key] = {
          id: uid(),
          email: key,
          password: o.password,
          parentName: o.parentName || '',
          children: (o.children || []).filter(function (c) { return c.name; }),
          unlocked: []
        };
        d.current = key;
        writeDemo(d);
        return { user: d.users[key], needsConfirmation: false };
      }
      var s = await sb();
      var res = await s.auth.signUp({
        email: o.email,
        password: o.password,
        options: { data: { parent_name: o.parentName } }
      });
      if (res.error) throw res.error;

      var kids = (o.children || []).filter(function (c) { return c.name; });

      if (res.data.session) {
        // Confirmation is off: we already have a session, write the children now.
        if (kids.length) {
          await s.from('children').insert(kids.map(function (c) {
            return { parent_id: res.data.user.id, name: c.name, grade: c.grade };
          }));
        }
        return { user: res.data.user, needsConfirmation: false };
      }

      // Confirmation is on: no session yet. Park the children and write them
      // on first successful sign-in instead of silently losing them.
      try { localStorage.setItem('tg_pending_children', JSON.stringify(kids)); } catch (e) {}
      return { user: res.data.user, needsConfirmation: true };
    },

    async signIn(o) {
      if (demo()) {
        var d = readDemo();
        var key = (o.email || '').trim().toLowerCase();
        var u = d.users[key];
        if (!u) throw new Error('No account found for that email.');
        if (u.password !== o.password) throw new Error('That password does not match.');
        d.current = key; writeDemo(d);
        return u;
      }
      var s = await sb();
      var res = await s.auth.signInWithPassword({ email: o.email, password: o.password });
      if (res.error) throw res.error;
      return res.data.user;
    },

    async sendMagicLink(email) {
      if (demo()) throw new Error('Magic links need the real Supabase project connected.');
      var s = await sb();
      var res = await s.auth.signInWithOtp({ email: email });
      if (res.error) throw res.error;
      return true;
    },

    async signOut() {
      if (demo()) { var d = readDemo(); d.current = null; writeDemo(d); return; }
      var s = await sb(); await s.auth.signOut();
    },

    /* Synchronous in demo; pages call sessionAsync() when real. */
    session() {
      if (demo()) {
        var d = readDemo();
        if (!d.current || !d.users[d.current]) return null;
        var u = d.users[d.current];
        return { user: { id: u.id, email: u.email }, profile: u };
      }
      return global.__tg_session || null;
    },

    async sessionAsync() {
      if (demo()) return TG.session();
      var s = await sb();
      var res = await s.auth.getSession();
      if (!res.data.session) { global.__tg_session = null; return null; }
      var user = res.data.session.user;
      // flush children parked during an unconfirmed signup
      try {
        var pending = JSON.parse(localStorage.getItem('tg_pending_children') || '[]');
        if (pending.length) {
          var existing = await s.from('children').select('id').eq('parent_id', user.id).limit(1);
          if (!existing.data || !existing.data.length) {
            await s.from('children').insert(pending.map(function (c) {
              return { parent_id: user.id, name: c.name, grade: c.grade };
            }));
          }
          localStorage.removeItem('tg_pending_children');
        }
      } catch (e) {}

      var kids = await s.from('children').select('*').eq('parent_id', user.id);
      var prof = {
        parentName: (user.user_metadata && user.user_metadata.parent_name) || '',
        email: user.email,
        children: kids.data || [],
        unlocked: []
      };
      var unl = await s.from('attendance').select('topic_slug').eq('parent_id', user.id);
      prof.unlocked = (unl.data || []).map(function (r) { return r.topic_slug; });
      global.__tg_session = { user: { id: user.id, email: user.email }, profile: prof };
      return global.__tg_session;
    },

    children() {
      var s = TG.session();
      return (s && s.profile && s.profile.children) || [];
    },

    async unlock(topic) {
      if (demo()) {
        var d = readDemo();
        var u = d.users[d.current];
        if (!u) return false;
        if (u.unlocked.indexOf(topic) < 0) u.unlocked.push(topic);
        writeDemo(d);
        return true;
      }
      var s = await sb();
      var sess = TG.session();
      if (!sess) return false;
      await s.from('attendance').insert({ parent_id: sess.user.id, topic_slug: topic, method: 'garden_word' });
      sess.profile.unlocked.push(topic);
      return true;
    },

    /* Staff can switch between what they see and what a family sees.
       Kept per browser rather than on the account, because it is a way
       of looking at the site for a minute, not a setting about a
       person — and Ms. Nia checking the family view on her laptop
       should not change what Kiara sees on hers. */
    viewAsFamily(){
      try { return localStorage.getItem('dl_view_family') === '1'; }
      catch (e) { return false; }
    },
    setViewAsFamily(on){
      try { on ? localStorage.setItem('dl_view_family','1')
               : localStorage.removeItem('dl_view_family'); } catch (e) {}
    },

    isUnlocked(topic) {
      /* An admin sees every lesson open. Ms. Nia and Kiara have to be
         able to walk the whole thing to plan a term, show a funder, or
         check a lesson before it runs — and the gate exists to stop a
         family wandering into a workshop that has not happened, not to
         stop the people running it from looking at their own work.

         This reads a flag rather than calling isAdmin(), because
         isAdmin() is async and this is called during painting. Pages
         set it once at boot. */
      if (global.__tg_admin === true && !TG.viewAsFamily()) return true;
      var s = TG.session();
      return !!(s && s.profile && s.profile.unlocked.indexOf(topic) > -1);
    },

    /* Is this account an admin? Demo mode grants it so the panel can be
       walked through before the Supabase role is set up. */
    async isAdmin() {
      if (demo()) { global.__tg_admin = true; return true; }
      var sess = TG.session() || await TG.sessionAsync();
      if (!sess) return false;
      if (global.__tg_admin != null) return global.__tg_admin;
      try {
        var s = await sb();
        /* Ask the database, so an admin named only by email still counts. */
        var r = await s.rpc('is_admin');
        global.__tg_admin = r.data === true;
      } catch (e) { global.__tg_admin = false; }
      return global.__tg_admin;
    },

    async requireAdmin() {
      var sess = await TG.requireAuth();
      if (!sess) return null;
      if (!(await TG.isAdmin())) { location.replace('dashboard.html'); return null; }
      return sess;
    },

    async requireAuth() {
      var s = demo() ? TG.session() : await TG.sessionAsync();
      if (!s) {
        location.replace('login.html?next=' + encodeURIComponent(location.pathname.split('/').pop() || 'dashboard.html'));
        return null;
      }
      return s;
    }
  };

  global.TG = TG;
})(window);

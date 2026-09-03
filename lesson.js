/* ------------------------------------------------------------------
   lesson.html — one page, twelve lessons
   ------------------------------------------------------------------
   Everything on the page comes from the lesson record in lessons.js
   and the world record in worlds.js. Nothing about plants, worms or
   jam is written here.

   The gates, in order:
     · the before-check must be done before the secret word will work,
       so a baseline always exists to measure against
     · the secret word unlocks stages 3, 4 and 5, and any word the
       lesson has ever used still works — a family catching up on an
       old recording is not locked out by a newer session
     · the after-check needs some play and one build first, so the
       certificate means something happened in between
------------------------------------------------------------------- */
(function (global) {

  var qs   = new URLSearchParams(location.search);
  var SLUG = qs.get('t') || '';
  var L    = (global.LESSONS || {})[SLUG];

  /* A lesson we have not written yet, or a bad link. */
  if (!L || !L.slug){ location.replace('dashboard.html?soon=' + encodeURIComponent(SLUG)); return; }

  /* The plant lesson predates this page and has its own hand-built
     activities. Send it home rather than showing a thinner version. */
  if (L.legacy && L.page){ location.replace(L.page); return; }

  var W = (global.WORLDS || []).filter(function(w){ return w.key === L.world; })[0] || {};

  var NEED_PLAY = Math.min(2, (L.activities || []).length);
  var PRE_KEY   = 'dl_pre_'  + SLUG;
  var BUILD_KEY = 'dl_built_'+ SLUG;

  function el(id){ return document.getElementById(id); }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function set(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }

  function preDone(){ return get(PRE_KEY) === '1'; }
  function built(){   return get(BUILD_KEY) === '1'; }
  function playedCount(){
    return (L.activities||[]).filter(function(a){
      return global.TGProgress && TGProgress.done(SLUG+':'+a.id); }).length;
  }
  function child(){
    var s = TG.session(), k = (s && s.profile && s.profile.children) || [];
    return k[0] || null;
  }

  /* ---------------- shading the page in the world's colour --------- */
  function shade(hex, amt){
    var n = parseInt(String(hex).replace('#',''),16);
    var r = (n>>16)&255, g = (n>>8)&255, b = n&255;
    r = Math.round(r + (amt<0 ? r*amt : (255-r)*amt));
    g = Math.round(g + (amt<0 ? g*amt : (255-g)*amt));
    b = Math.round(b + (amt<0 ? b*amt : (255-b)*amt));
    return '#'+[r,g,b].map(function(v){ return ('0'+v.toString(16)).slice(-2); }).join('');
  }

  function paintBrand(){
    var c = W.color || '#0071BC';
    var root = document.documentElement.style;
    root.setProperty('--w',  c);
    root.setProperty('--wd', shade(c,-0.28));
    root.setProperty('--wl', shade(c, 0.86));
    document.title = L.title + ' — DewLab';
    var tc = document.querySelector('meta[name=theme-color]'); if (tc) tc.content = c;

    if (W.img) el('guideImg').src = W.img;
    el('guideImg').alt = W.guide ? W.guide + ', your guide in ' + W.name : '';
    el('eyebrow').textContent = (W.name||'') + (W.guide ? ' · with ' + W.guide : '');
    el('lTitle').textContent  = L.title;
    el('lTag').textContent    = L.tagline || '';
    /* The crumb goes back to the world, not all the way home — a
       family reading lesson 1 usually wants lesson 2 next. */
    var cr = el('crumb');
    if (cr){
      cr.innerHTML = '&larr; ' + (W.name ? 'Back to ' + esc(W.name) : 'All worlds');
      cr.href = W.key ? 'world.html?w=' + W.key : 'dashboard.html';
    }

    var chips = [];
    if (L.grades) chips.push('Grades ' + L.grades);
    chips.push('Lesson ' + L.n + ' of ' + (global.LESSONS.forWorld(L.world).length));
    if (L.competencies) chips.push(L.competencies.length + ' skills');
    el('lChips').innerHTML = chips.map(function(c){ return '<span class="chip">'+esc(c)+'</span>'; }).join('');
  }

  /* The row of facts under each stage heading. The plant lesson has
     always had these and they answer the question a parent asks first
     — how long is this going to take? */
  function paintPills(){
    var n = (L.competencies||[]).length * 2;
    var b = L.build || {};
    var rows = {
      p1:['&#9201; About four minutes', '&#128444;&#65039; '+n+' picture questions', '&#128218; Read aloud'],
      p2:['&#9201; About 45 minutes', '&#128100; Live, not a recording', '&#128273; The secret word is said here'],
      p3:['&#9201; '+(b.time||''), '&#128101; '+(b.help||''), '&#129529; '+(b.mess||'')],
      p4:[(L.activities||[]).length+' games', '&#128260; Play them as often as you like',
          '&#127793; Each one names the skill it builds'],
      p5:['&#9201; About four minutes', '&#128200; The same skills, different questions',
          '&#127942; Ends with a certificate']
    };
    Object.keys(rows).forEach(function(id){
      var host = el(id); if (!host) return;
      host.innerHTML = rows[id].filter(function(t){ return t && t.trim().slice(-1) !== ';'; })
        .map(function(t){ return '<span class="mini">'+t+'</span>'; }).join('');
    });
  }

  /* ---------------- stage 3: the build ---------------- */
  function paintBuild(){
    var b = L.build; if (!b) return;
    el('buildSlot').innerHTML =
      '<div class="build">'+
        '<div class="build-hd">'+
          '<h3>'+esc(b.title)+'</h3><p>'+esc(b.blurb)+'</p>'+
          '<div class="meta">'+
            ['&#9201; '+esc(b.time), '&#128101; '+esc(b.help), '&#129529; '+esc(b.mess)]
              .map(function(m){ return '<span>'+m+'</span>'; }).join('')+
          '</div>'+
        '</div>'+
        '<div class="build-bd">'+
          '<h4>What you need</h4>'+
          '<ul class="mats">'+ b.materials.map(function(m){ return '<li>'+esc(m)+'</li>'; }).join('') +'</ul>'+
          '<h4>How to do it</h4>'+
          '<ol class="steps">'+ b.steps.map(function(s){
              return '<li><div><b>'+esc(s[0])+'</b><span>'+esc(s[1])+'</span></div></li>'; }).join('') +'</ol>'+
          '<div class="why"><b>Why it works</b>'+esc(b.why)+'</div>'+
          (L.safety ? '<div class="safety"><b>Safety.</b> '+esc(L.safety)+'</div>' : '')+
          '<div style="margin-top:18px">'+
            (built()
              ? '<div class="statusline">&#9989; You made it. Nice work.</div>'
              : '<button class="btn btn-primary" id="builtBtn">We made it &#127881;</button>')+
          '</div>'+
        '</div>'+
      '</div>';
    if (el('builtBtn')) el('builtBtn').onclick = function(){ set(BUILD_KEY,'1'); paint(); };
  }

  /* ---------------- stage 4: the activities ---------------- */
  function paintActivities(){
    el('actCards').innerHTML = (L.activities||[]).map(function(a){
      var done = global.TGProgress && TGProgress.done(SLUG+':'+a.id);
      var art  = a.type==='order' ? '&#128207;' : a.type==='sort' ? '&#129388;' :
                 a.type==='match' ? '&#128279;' : '&#129300;';
      return '<button class="card'+(done?' done':'')+'" data-a="'+esc(a.id)+'">'+
               '<span class="ce">'+art+'</span>'+
               '<b>'+esc(a.title)+'</b>'+
               '<span>'+esc(a.prompt || '')+'</span>'+
               '<span class="skill">&#127793; '+esc(a.teaches)+'</span>'+
             '</button>';
    }).join('');

    [].forEach.call(el('actCards').querySelectorAll('.card'), function(btn){
      btn.onclick = function(){
        if (!TG.isUnlocked(SLUG)) return;
        var a = L.activities.filter(function(x){ return x.id === btn.dataset.a; })[0];
        TGPlay.open(a, async function(id){
          var k = child();
          await TGProgress.mark(k && k.id, SLUG, SLUG+':'+id);
          paint();
        });
      };
    });
  }

  /* ---------------- the certificate ---------------- */
  function paintCert(){
    var k = child(), name = k ? k.name : 'A DewLab learner';
    var gained = TGQuiz.gained(SLUG, name) || [];
    var comps  = (L.competencies||[]);
    var before = TGQuiz.result(SLUG,'pre',  name);
    var after  = TGQuiz.result(SLUG,'post', name);
    var when   = new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});

    el('certWrap').innerHTML =
      '<div class="cert" id="certCard">'+
        (W.img ? '<img class="certseal" src="'+esc(W.img)+'" alt="">' : '')+
        '<div class="certkick">Dew of Heaven Children&rsquo;s Garden</div>'+
        '<div class="certname">'+esc(name)+'</div>'+
        '<div class="certfor">finished</div>'+
        '<div class="certline">'+esc(L.title)+'</div>'+
        '<ul class="certskills">'+
          comps.map(function(c){
            var isNew = gained.filter(function(g){ return g.id===c.id; }).length > 0;
            return '<li class="'+(isNew?'':'kept')+'">'+esc(c.label)+'</li>';
          }).join('')+
        '</ul>'+
        '<div class="certfoot"><span>'+esc(W.name||'')+(W.guide?' · with '+esc(W.guide):'')+'</span>'+
          '<span>'+esc(when)+'</span></div>'+
      '</div>'+
      '<div class="certbtns">'+
        '<button class="btn btn-primary" id="shareCert">Share it</button>'+
        '<button class="btn btn-ghost" id="printCert">Print</button>'+
      '</div>';

    el('rBefore').textContent = before || '—';
    el('rAfter').textContent  = after  || '—';

    el('printCert').onclick = function(){ window.print(); };
    el('shareCert').onclick = async function(){
      var txt = name + ' just finished ' + L.title + ' at DewLab, with Dew of Heaven Children’s Garden.';
      if (navigator.share){ try{ await navigator.share({ title:'DewLab', text:txt }); return; }catch(e){} }
      try{ await navigator.clipboard.writeText(txt); this.textContent = 'Copied!'; }
      catch(e){ this.textContent = 'Press and hold to copy'; }
    };
  }

  /* ---------------- the whole page ---------------- */
  var RAIL = ['Before','Live','At home','Play','Show it'];

  function paint(){
    var unlocked = TG.isUnlocked(SLUG), pre = preDone();

    /* stage 1 */
    var k = child();
    if (pre){
      el('preBtn').style.display = 'none';
      var r = TGQuiz.result(SLUG,'pre', k && k.name);
      el('preDone').style.display = 'flex';
      el('preDone').innerHTML = '&#9989; Done' + (r ? ' — starting point: <b style="margin-left:4px">'+r+' skills</b>' : '');
    } else {
      el('preBtn').style.display = '';
      el('preDone').style.display = 'none';
    }

    /* stage 2 */
    var when = TGSession.nextLine(SLUG);
    el('sessTitle').textContent = L.title + ' — live session';
    el('sessWhen').textContent  = when || 'Ms. Nia will post the date here';
    var next = TGSession.next(SLUG) || TGSession.past(SLUG)[0];
    var join = el('joinBtn');
    if (next && next.join_url){ join.href = next.join_url; join.style.display=''; }
    else { join.style.display='none'; }

    var wi = el('wordIn'), wb = el('wordBtn');
    wi.disabled = wb.disabled = (!pre || unlocked);
    if (unlocked){
      el('wordP').textContent = 'Unlocked. Everything below is open to you.';
      el('wordMsg').className = 'wordmsg yes';
      el('wordMsg').textContent = '✅ The lesson is open.';
    } else if (!pre){
      el('wordP').textContent = 'Do the before-check first — that is what the after-check gets compared against.';
    }
    el('wordHint').textContent = TGSession.words(SLUG).length
      ? 'Every word this lesson has ever used still works, so an older recording is never a dead end.'
      : 'No session scheduled yet. The word appears once one is.';

    /* stages 3–5 */
    ['s3','s4','s5'].forEach(function(id){
      el(id).classList.toggle('lock', !unlocked);
    });

    var played = playedCount();
    var ready  = unlocked && played >= NEED_PLAY && built();
    el('postBtn').disabled = !ready;
    el('postGate').textContent = !unlocked
      ? 'Opens once you have the secret word.'
      : ready
        ? 'You are ready. This one counts.'
        : 'Play ' + NEED_PLAY + ' game' + (NEED_PLAY===1?'':'s') + ' and do the build first — ' +
          'you have played ' + played + ' and ' + (built() ? 'done the build' : 'not done the build yet') + '.';

    var post = TGQuiz.result(SLUG,'post', k && k.name);
    if (post){ el('postBtn').style.display='none'; el('certWrap').style.display='block'; paintCert(); }

    /* rail */
    var now = post ? 5
            : !pre ? 0 : (!unlocked ? 1 : (!built() ? 2 : (played < NEED_PLAY ? 3 : 4)));
    el('rail').innerHTML = RAIL.map(function(t,i){
      var cls = i < now ? 'was' : (i === now ? 'now' : '');
      return '<button class="rstep '+cls+'" data-s="'+(i+1)+'"><i>'+(i<now?'&#10003;':(i+1))+'</i>'+esc(t)+'</button>';
    }).join('');
    [].forEach.call(el('rail').querySelectorAll('.rstep'), function(b){
      b.onclick = function(){
        var t = el('s'+b.dataset.s);
        if (t) window.scrollTo({ top: t.offsetTop - 96, behavior:'smooth' });
      };
    });

    paintPills();
    paintBuild();
    paintActivities();
  }

  /* ---------------- word entry ---------------- */
  async function tryWord(){
    var v = el('wordIn').value.trim().toLowerCase();
    var m = el('wordMsg');
    if (!v){ m.className='wordmsg no'; m.textContent='Type the word first.'; return; }
    if (!preDone()){ m.className='wordmsg no'; m.textContent='Do the before-check first.'; return; }
    if (TGSession.accepts(SLUG, v)){
      await TG.unlock(SLUG);
      m.className='wordmsg yes'; m.textContent='✅ That is it — the lesson is open!';
      paint();
      setTimeout(function(){ el('s3').scrollIntoView({behavior:'smooth'}); }, 500);
    } else {
      m.className='wordmsg no';
      m.textContent = 'Not quite. Listen again — your guide says it during the session.';
    }
  }

  /* ---------------- boot ---------------- */
  (async function(){
    var s = await TG.requireAuth();
    if (!s) return;                                  /* requireAuth redirects */

    paintBrand();

    var kids = (s.profile && s.profile.children) || [];
    el('whoName').textContent = (s.profile && (s.profile.parentName || s.profile.parent_name)) || kids[0] && kids[0].name || 'You';
    el('av').textContent = ((kids[0] && kids[0].name) || 'D').charAt(0).toUpperCase();

    await TGSession.loadAll();
    await TGProgress.load(kids[0] && kids[0].id);

    el('outBtn').onclick = async function(){ await TG.signOut(); location.href='login.html'; };
    el('playX').onclick  = function(){ TGPlay.close(); TGQuiz.close(); };
    el('wordBtn').onclick = tryWord;
    el('wordIn').addEventListener('keydown', function(e){ if (e.key === 'Enter') tryWord(); });

    el('preBtn').onclick = function(){
      TGQuiz.open(SLUG, 'pre', kids, function(){ set(PRE_KEY,'1'); paint(); });
    };
    el('postBtn').onclick = function(){
      if (el('postBtn').disabled) return;
      TGQuiz.open(SLUG, 'post', kids, function(){ paint(); });
    };
    el('resetBtn').onclick = function(){
      if (!confirm('Clear this lesson’s progress on this device?')) return;
      try{
        [PRE_KEY, BUILD_KEY].forEach(function(k){ localStorage.removeItem(k); });
        Object.keys(localStorage).forEach(function(k){
          if (k.indexOf('tg_comp_'+SLUG+'_') === 0) localStorage.removeItem(k);
        });
      }catch(e){}
      location.reload();
    };

    if (global.TGAudio && TGAudio.button) el('sndSlot').appendChild(TGAudio.button());

    paint();
    el('boot').style.display = 'none';
    el('app').style.display  = '';
  })();

})(window);

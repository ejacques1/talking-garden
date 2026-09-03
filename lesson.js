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
  function built(){
    if (get(BUILD_KEY) === '1') return true;
    /* Any one of the builds is enough — the point is hands in the
       soil, not a particular jar. */
    return buildList().some(function(_, i){
      return global.TGProgress && TGProgress.done(SLUG+':build'+i); });
  }
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
    /* Blue leads on every page and the ground stays beige, exactly as
       the DHCG brand sheet specifies. The world is told apart by its
       guide, not by re-tinting the whole interface. */
    root.setProperty('--w',  c);
    root.setProperty('--wd', shade(c,-0.28));
    root.setProperty('--wl', '#E4F1FA');
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
    if (L.standards && L.standards.length) chips.push('TEKS aligned');
    el('lChips').innerHTML = chips.map(function(c){ return '<span class="chip">'+esc(c)+'</span>'; }).join('');
  }

  /* The row of facts under each stage heading. The plant lesson has
     always had these and they answer the question a parent asks first
     — how long is this going to take? */
  function paintPills(){
    var n = (L.competencies||[]).length * 2;
    var b = buildList()[0] || L.build || {};
    var rows = {
      p1:['&#9201; About four minutes', '&#128444;&#65039; '+n+' picture questions', '&#128218; Read aloud'],
      p2:['&#9201; About 45 minutes', '&#128100; Live, not a recording', '&#128273; The secret word is said here'],
      /* Play comes before the build now, so 3 is the games and 4 is
         the thing they make. */
      p3:[(L.activities||[]).length+' games', '&#128260; Play them as often as you like',
          '&#127793; Each one names the skill it builds'],
      p4:['&#9201; '+(b.time||''), '&#128101; '+(b.help||''), '&#129529; '+(b.mess||'')],
      p5:['&#9201; About four minutes', '&#128200; The same skills, different questions',
          '&#127942; Ends with a certificate']
    };
    Object.keys(rows).forEach(function(id){
      var host = el(id); if (!host) return;
      host.innerHTML = rows[id].filter(function(t){ return t && t.trim().slice(-1) !== ';'; })
        .map(function(t){ return '<span class="mini">'+t+'</span>'; }).join('');
    });
  }

  /* ---------------- stage 2: the video ----------------
     Restored from the plant lesson, which has had it since the start.
     The new lesson page shipped with only a join button, so a
     recording Ms. Nia pasted into the admin panel went nowhere on
     eleven of the twelve lessons. */
  var mode = null, recIdx = 0;

  /* The recorded session. A lesson can now open on day one instead of
     waiting for a date in the diary, and it stays as catch-up once
     live sessions start running. */
  function recording(){
    var r = L.session && L.session.url;
    return r ? { url:r, minutes:(L.session.minutes||5) } : null;
  }

  function isVideoFile(u){ return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(String(u||'')); }

  function embedUrl(u){
    if (!u) return null;
    u = String(u).trim();
    var m;
    if ((m = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{6,})/)))
      return 'https://www.youtube.com/embed/' + m[1];
    if ((m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/)))
      return 'https://player.vimeo.com/video/' + m[1];
    return null;   /* Zoom share links cannot be framed; we link out instead */
  }

  /* Both versions of the opener can exist at once — the filmed one and
     the one drawn in code — so the two can be put in front of someone
     and judged rather than argued about. */
  var showCoded = false;

  function otherVersionLink(){
    var mv2 = L.movie && global.TGMovies && global.TGMovies[L.movie.render];
    if (!(L.movie && L.movie.url) || !mv2) return '';
    return ' &middot; <a href="#" id="flipVersion" style="color:var(--wd);font-weight:700">'+
           (showCoded ? 'see the filmed one' : 'see the simple version') + '</a>';
  }

  function wireFlip(){
    var a = el('flipVersion');
    if (a) a.onclick = function(e){ e.preventDefault(); showCoded = !showCoded; paintVideo(); wireFlip(); };
  }

  function paintVideo(){
    var slot = el('videoSlot'); if (!slot) return;
    var rec = recording();

    /* Show the tabs that have something behind them, and open on the
       most useful one: the live session if one is coming, otherwise
       the recording. */
    var haveLive = !!TGSession.next(SLUG);
    var mv = L.movie && global.TGMovies && global.TGMovies[L.movie.render];
    var haveFilm = !!(L.movie && L.movie.url);
    var tMov = el('tabMovie'), tRec = el('tabRecorded'), tLive = el('tabLive');
    if (tMov){
      tMov.style.display = (mv || haveFilm) ? '' : 'none';
      if (mv) tMov.textContent = (L.movie.guide || (W && W.guide) || 'Your guide') + ' explains';
    }
    if (tRec)  tRec.style.display  = rec ? '' : 'none';
    if (tLive) tLive.style.display = (haveLive || (!rec && !mv)) ? '' : 'none';
    /* Open on the animation when there is one — it is the shortest way
       in, and it is what the rest of the lesson builds on. */
    if (mode === null) mode = (mv || haveFilm) ? 'movie' : (haveLive ? 'live' : (rec ? 'recorded' : 'live'));
    [].forEach.call(document.querySelectorAll('.stog'), function(b){
      b.className = 'stog' + (b.dataset.mode === mode ? ' on' : '');
    });

    /* ---- the animation ---- */
    if (mode === 'movie'){
      el('joinBtn').style.display = 'none';
      var g = L.movie.guide || (W && W.guide) || 'your guide';
      el('sessTitle').textContent = L.title + ' — ' + g + ' explains';
      if (!preDone()){
        slot.innerHTML = '<div class="slotmsg"><div class="big">&#128274;</div>'+
          '<b>Finish the before-check first</b>'+
          '<span>Then '+esc(g)+' will show you how it works. We ask first so we can see what you learn.</span></div>';
        el('sessWhen').textContent = 'Opens once you have done the before-check';
        return;
      }
      /* A film made properly — in Canva or anywhere else — replaces the
         one drawn in code. The code version is a placeholder that means
         the lesson works before anything has been animated, not the
         thing we are aiming for. */
      /* An uploaded file plays straight from the page — no YouTube, no
         processing wait, which matters when the point is to look at it
         in the next five minutes. */
      if (isVideoFile(L.movie.url)){
        slot.innerHTML = '<video src="'+esc(L.movie.url)+'" controls playsinline '+
                         'style="width:100%;height:100%;display:block;background:#000"></video>';
        el('sessWhen').innerHTML = 'Watch it as often as you like' + otherVersionLink();
        return;
      }
      var filmed = embedUrl(L.movie.url);
      if (filmed){
        slot.innerHTML = '<iframe src="'+filmed+'" allowfullscreen title="'+esc(L.title)+'"></iframe>';
        el('sessWhen').innerHTML = 'Watch it as often as you like' + otherVersionLink();
        return;
      }
      if (L.movie.url && !filmed){
        /* A link we cannot frame — a Canva share link, say. Send them
           out to it rather than showing an empty black box. */
        slot.innerHTML = '<div class="slotmsg"><div class="big">&#9654;&#65039;</div>'+
          '<b>'+esc(g)+' explains '+esc(L.title)+'</b>'+
          '<span>It opens in a new tab</span></div>';
        el('joinBtn').href = L.movie.url;
        el('joinBtn').textContent = 'Watch it';
        el('joinBtn').style.display = 'inline-flex';
        el('sessWhen').textContent = 'A short film with ' + esc(g);
        return;
      }
      if (showCoded && mv){
        mv.mount(slot, g, (W && W.img) || null);
        el('sessWhen').innerHTML = 'The simple version, drawn in code' + otherVersionLink();
        return;
      }
      if (!mv){
        slot.innerHTML = '<div class="slotmsg"><div class="big">&#127916;</div>'+
          '<b>Not animated yet</b><span>'+esc(g)+'&rsquo;s film is on its way</span></div>';
        el('sessWhen').textContent = 'Coming soon';
        return;
      }
      mv.mount(slot, g, (W && W.img) || null);
      el('sessWhen').textContent = 'A short animation · narrated · about a minute';
      return;
    }

    /* ---- the recorded session ---- */
    if (mode === 'recorded'){
      el('joinBtn').style.display = 'none';
      el('sessTitle').textContent = L.title + ' — with ' + ((W && W.guide) || 'your guide');
      if (!preDone()){
        slot.innerHTML = '<div class="slotmsg"><div class="big">&#128274;</div>'+
          '<b>Finish the before-check first</b>'+
          '<span>Then you can watch it as many times as you like</span></div>';
        el('sessWhen').textContent = 'Opens once you have done the before-check';
        return;
      }
      var e = embedUrl(rec && rec.url);
      slot.innerHTML = e
        ? '<iframe src="'+e+'" allowfullscreen title="'+esc(L.title)+'"></iframe>'
        : '<div class="slotmsg"><div class="big">&#127909;</div><b>Ms. Nia has not recorded this one yet</b>'+
          '<span>It will appear here when she does</span></div>';
      el('sessWhen').textContent = rec
        ? 'About ' + rec.minutes + ' minutes · watch it whenever you like'
        : 'Coming soon';
      return;
    }

    var title = el('sessTitle'), when = el('sessWhen'), join = el('joinBtn');
    var upcoming = TGSession.next(SLUG);
    var history  = TGSession.past(SLUG);

    /* ---- past sessions: every recording, never overwritten ---- */
    if (mode === 'rec'){
      join.style.display = 'none';
      title.textContent = 'Past sessions';
      if (!preDone()){
        slot.innerHTML = '<div class="slotmsg"><div class="big">&#128274;</div>'+
          '<b>Finish the before-check first</b>'+
          '<span>Then you can watch any session you missed, any time</span></div>';
        when.textContent = 'Opens once you have done the before-check';
        return;
      }
      var withRec = history.filter(function(x){ return x.recording_url; });
      if (!withRec.length){
        /* Empty for a reason, so give the reason. An unexplained empty
           tab looks broken and Ms. Nia gets asked about it. */
        var why, sub;
        if (upcoming){
          why = 'The first recording lands after ' + TGSession.long(upcoming);
          sub = 'Recordings are added once a session has run';
        } else if (history.length){
          why = 'Ms. Nia has not added the recording yet';
          sub = 'Last session was ' + TGSession.long(history[0]);
        } else {
          why = 'No sessions have run yet';
          sub = 'Recordings appear here after the first one';
        }
        slot.innerHTML = '<div class="slotmsg"><div class="big">&#127909;</div><b>'+esc(why)+'</b>'+
          '<span>Every session stays here once it is added, so you can always catch up</span></div>';
        when.textContent = sub;
        return;
      }
      var cur = withRec[recIdx] || withRec[0];
      var rEmb = embedUrl(cur.recording_url);
      slot.innerHTML = rEmb
        ? '<iframe src="'+rEmb+'" allowfullscreen title="Session recording"></iframe>'
        : '<div class="slotmsg"><div class="big">&#9654;&#65039;</div><b>Watch the recording</b>'+
          '<span>It opens in a new tab</span></div>';
      when.innerHTML = withRec.map(function(x,i){
        return '<button class="reclink'+(i===recIdx?' on':'')+'" data-r="'+i+'">'+esc(TGSession.short(x))+'</button>';
      }).join('');
      [].forEach.call(el('videoSlot').parentNode.querySelectorAll('.reclink'), function(b){
        b.onclick = function(){ recIdx = +b.dataset.r; paintVideo(); };
      });
      if (!rEmb){
        join.href = cur.recording_url; join.textContent = 'Watch the recording';
        join.style.display = 'inline-flex';
      }
      return;
    }

    /* ---- the live session ---- */
    title.textContent = L.title + ' — live session';
    var movie = embedUrl((upcoming && upcoming.movie_url) || (history[0] && history[0].movie_url));
    if (movie && preDone()){
      /* A film Ms. Nia has recorded for this lesson plays here. */
      slot.innerHTML = '<iframe src="'+movie+'" allowfullscreen title="'+esc(L.title)+'"></iframe>';
    } else if (upcoming){
      slot.innerHTML = '<span class="livebadge"><i></i>Coming up</span>'+
        '<div class="slotmsg"><div class="big">&#127793;</div><b>We are in the garden</b>'+
        '<span>'+(upcoming.join_url ? 'Tap join to come with us' : 'Ms. Nia adds the link in the admin panel')+'</span></div>';
    } else {
      slot.innerHTML = '<div class="slotmsg"><div class="big">&#128197;</div>'+
        '<b>'+(history.length ? 'That session has finished' : 'No live session scheduled yet')+'</b>'+
        '<span>'+(history.length
          ? 'Watch it under Past sessions — Ms. Nia will post the next date here'
          : rec ? 'Watch the recorded one instead — it is the same lesson'
                : 'Ms. Nia will post the next live session here')+'</span></div>';
    }

    if (upcoming){
      when.textContent = TGSession.line(upcoming, 'Ms. Nia');
      join.href = upcoming.join_url || '#';
      join.textContent = 'Join the session';
      join.style.display = upcoming.join_url ? 'inline-flex' : 'none';
    } else {
      when.textContent = history.length
        ? 'Last session · ' + TGSession.long(history[0])
        : 'Ms. Nia will post the date here';
      join.style.display = 'none';
    }
  }

  /* ---------------- read aloud ----------------
     One button per card and tap-any-sentence, rather than an icon
     beside every line. The icons were noise, and noise is why nobody
     used them.

     What each card says is composed here rather than scraped from the
     page, so the voice reads the lesson and not the button labels,
     and reads the build in the order a person would say it. */
  function spoken(stage){
    var n = (L.competencies||[]).length * 2;
    var b = buildList()[0] || {};
    if (stage === 1)
      return 'Before we start. A few picture questions, read out loud. '+
             'There is no pass or fail — it just marks where you are starting from. '+
             'There are ' + n + ' questions and it takes about four minutes.';
    if (stage === 2){
      var nx = TGSession.next(SLUG), lastOne = TGSession.past(SLUG)[0];
      return 'Meet us live. Join the live session with your guide. '+
             'Somewhere in the middle they will say the secret word. '+
             (nx ? 'The next session is ' + TGSession.long(nx) + '.'
                 : lastOne ? 'The last session was ' + TGSession.long(lastOne) +
                             '. You can watch it under past sessions.'
                           : 'No session is scheduled yet.') +
             ' When you have the secret word, type it in the yellow box to open the rest of the lesson.';
    }
    if (stage === 4){
      var b = curBuild || buildList()[0] || {};
      return [b.title, b.blurb,
              'You will need: ' + (b.materials||[]).join(', ') + '.',
              'Here are the steps.']
        .concat((b.steps||[]).map(function(st, i){
          return 'Step ' + (i+1) + '. ' + st[0] + '. ' + st[1]; }))
        .concat(['Why it works. ' + b.why])
        .concat(L.safety ? ['Safety. ' + L.safety] : [])
        .join(' ');
    }
    if (stage === 3)
      return 'Play and practise. Short games you can play as many times as you like. '+
             'There are ' + (L.activities||[]).length + '. ' +
             (L.activities||[]).map(function(a){ return a.title + '. ' + a.teaches + '.'; }).join(' ');
    return 'Show what you grew. The same skills, different questions. '+
           'This is the one that goes on the certificate.';
  }

  function paintRead(){
    if (!global.TGAudio || !TGAudio.supported) return;

    [1,2,3,4,5].forEach(function(n){
      var head = el('s'+n).querySelector('.sn');
      if (!head || head.querySelector('.readcard')) return;
      var b = document.createElement('button');
      b.className = 'readcard';
      b.type = 'button';
      b.innerHTML = '&#128266; Read to me';
      b.onclick = function(){
        var already = b.classList.contains('on');
        stopReading();
        if (already) return;                    /* second press stops it */
        if (!TGAudio.enabled()) TGAudio.setEnabled(true);
        b.classList.add('on');
        b.innerHTML = '&#128266; Stop ';
        TGAudio.sayThen(spoken(n), function(){ stopReading(); });
      };
      head.appendChild(b);
    });

    /* Tap any sentence to hear just that one. */
    [].forEach.call(document.querySelectorAll(
      '.stage > p.lede, .build-hd h3, .build-hd p, .steps b, .steps span, '+
      '.mats li, .why, .safety, .wordbox p, .card .skill'), function(t){
        if (t.dataset.speak) return;
        t.dataset.speak = '1';
        t.classList.add('speak');
        t.addEventListener('click', function(e){
          e.stopPropagation();
          stopReading();
          if (!TGAudio.enabled()) TGAudio.setEnabled(true);
          t.classList.add('saying');
          TGAudio.sayThen(t.innerText, function(){ t.classList.remove('saying'); });
        });
      });

    /* Said once, then never again. */
    if (!get('dl_read_hint')){
      var host = el('s1');
      var h = document.createElement('div');
      h.className = 'readhint';
      h.innerHTML = '<span>&#128266;</span><span>Tap <b>Read to me</b> on any card, or tap a sentence to hear just that one.</span>'+
                    '<button type="button">Got it</button>';
      h.querySelector('button').onclick = function(){ set('dl_read_hint','1'); h.remove(); };
      host.parentNode.insertBefore(h, host);
    }
  }

  function stopReading(){
    if (global.TGAudio) TGAudio.stop();
    [].forEach.call(document.querySelectorAll('.readcard.on'), function(x){
      x.classList.remove('on'); x.innerHTML = '&#128266; Read to me';
    });
    [].forEach.call(document.querySelectorAll('.saying'), function(x){
      x.classList.remove('saying');
    });
  }

  /* ---------------- stage 3: the build ---------------- */
  /* A lesson can offer several builds. Whichever is showing is the one
     that counts for the gate; doing any one of them is enough, because
     the point is hands in the soil, not a particular jar. */
  function buildList(){ return (L.builds && L.builds.length) ? L.builds : (L.build ? [L.build] : []); }

  function paintBuild(){
    var list = buildList(); if (!list.length) return;

    /* Cards, not a document. Seven steps laid out at once is something
       to read; one step at a time is something to do — which is what
       the plant lesson has always done and what this was missing. */
    el('buildSlot').innerHTML =
      '<div class="cards">'+ list.map(function(b, i){
        var done = global.TGProgress && TGProgress.done(SLUG+':build'+i);
        return '<button class="card'+(done?' done':'')+'" data-b="'+i+'">'+
          '<span class="ce">'+(b.emoji || '&#128736;&#65039;')+'</span>'+
          '<b>'+esc(b.title)+'</b>'+
          '<span>'+esc(b.blurb)+'</span>'+
          (b.teks && window.TEKS && TEKS.se[b.teks]
            ? '<span class="skill">&#127793; '+esc(b.teks)+' &middot; '+esc(b.teksNote||'')+'</span>' : '')+
        '</button>';
      }).join('') +'</div>'+
      (L.safety ? '<div class="safety"><b>Safety.</b> '+esc(L.safety)+'</div>' : '');

    [].forEach.call(el('buildSlot').querySelectorAll('.card'), function(btn){
      btn.onclick = function(){
        if (!TG.isUnlocked(SLUG)) return;
        openBuild(+btn.dataset.b);
      };
    });
  }

  /* ---------------- build mode ----------------
     Ported from the plant lesson, which had it from the start. */
  var curBuild = null, buildStep = 0, spokeKey = null;

  /* The build data stores "Kid-led" as a label for the card. On its
     own in a sentence it reads like a form field, so say it properly. */
  function helpLine(h){
    var t = String(h||'').toLowerCase();
    if (t.indexOf('kid') === 0)      return 'Kids can lead this one start to finish.';
    if (t.indexOf('grown-up') === 0) return 'A grown-up is needed for one part: ' +
                                             h.replace(/^Grown-up\s*/i,'').replace(/^./, function(c){ return c.toLowerCase(); }) + '.';
    return h ? h + '.' : '';
  }

  function openBuild(i){
    curBuild = buildList()[i]; if (!curBuild) return;
    curBuild.__i = i;
    buildStep = 0; spokeKey = null;
    el('playTitle').textContent = curBuild.title;
    el('ovl').classList.add('on');
    document.body.style.overflow = 'hidden';
    drawBuild();
  }

  function drawBuild(){
    var p = curBuild, body = el('playBd');

    if (buildStep === 0){
      body.innerHTML =
        '<div class="q" style="text-align:center">'+(p.emoji||'&#128736;&#65039;')+' '+esc(p.title)+'</div>'+
        '<div class="qs" style="text-align:center">'+esc(p.blurb)+'</div>'+
        '<div class="bmeta">'+
          ['&#9201; '+esc(p.time), '&#128101; '+esc(p.help), '&#129529; '+esc(p.mess)]
            .map(function(m){ return '<span class="mini">'+m+'</span>'; }).join('')+
        '</div>'+
        '<div class="blist"><b>What you need</b><ul>'+
          (p.materials||[]).map(function(m){ return '<li>'+esc(m)+'</li>'; }).join('')+
        '</ul></div>'+
        '<div class="say">'+esc(helpLine(p.help))+'</div>'+
        '<div class="brow"><button class="btn btn-primary" id="bNext" style="width:auto">Start building &rarr;</button></div>';

    } else if (buildStep <= p.steps.length){
      var st = p.steps[buildStep-1];
      /* Read each step once as it appears. Guarded by a key because
         redrawing on Back would otherwise say it all over again. */
      if (global.TGAudio && spokeKey !== 'b'+p.__i+'_'+buildStep){
        spokeKey = 'b'+p.__i+'_'+buildStep;
        TGAudio.say(st[0] + '. ' + st[1]);
      }
      body.innerHTML =
        '<div class="bprog">'+ p.steps.map(function(x,i){
          return '<i class="'+(i<buildStep?'on':'')+'"></i>'; }).join('') +'</div>'+
        '<div class="qs" style="margin-bottom:4px">Step '+buildStep+' of '+p.steps.length+'</div>'+
        '<div class="q">'+esc(st[0])+'</div>'+
        '<p style="margin-top:10px;font-size:15px">'+esc(st[1])+'</p>'+
        '<div class="brow">'+
          '<button class="btn btn-ghost" id="bBack" style="width:auto">&larr; Back</button>'+
          '<button class="btn btn-primary" id="bNext" style="width:auto">'+
            (buildStep === p.steps.length ? 'Finish' : 'Next step &rarr;')+'</button>'+
        '</div>';

    } else {
      (async function(){
        var k = child();
        await TGProgress.mark(k && k.id, SLUG, SLUG+':build'+p.__i);
        set(BUILD_KEY,'1');
        paint();
      })();
      body.innerHTML =
        '<div class="win"><div class="m">&#127881;</div><h3>You built it!</h3>'+
        '<div class="blist" style="text-align:left"><b>Why it works</b>'+
          '<p style="font-size:14.5px;margin-top:6px">'+esc(p.why)+'</p></div>'+
        (p.teks && window.TEKS && TEKS.se[p.teks]
          ? '<p style="font-size:13px;color:var(--muted);margin:12px 0 16px">You practised: '+
            esc(TEKS.se[p.teks].text)+'</p>' : '')+
        '<button class="btn btn-primary" id="bDone" style="width:auto">Back to the lesson</button></div>';
      el('bDone').onclick = function(){
        TGPlay.close();
        el('s4').scrollIntoView({ behavior:'smooth', block:'start' });
      };
      return;
    }

    var n = el('bNext'), bk = el('bBack');
    if (n)  n.onclick  = function(){ buildStep++; drawBuild(); };
    if (bk) bk.onclick = function(){ buildStep--; spokeKey = null; drawBuild(); };
  }

  /* ---------------- stage 4: the activities ---------------- */
  function paintActivities(){
    el('actCards').innerHTML = (L.activities||[]).map(function(a){
      var done = global.TGProgress && TGProgress.done(SLUG+':'+a.id);
      var art  = a.emoji ? a.emoji
               : a.type==='order' ? '&#128207;' : a.type==='sort' ? '&#129388;'
               : a.type==='match' ? '&#128279;' : a.type==='custom' ? '&#10024;'
               : '&#129300;';
      return '<button class="card'+(done?' done':'')+'" data-a="'+esc(a.id)+'">'+
               '<span class="ce">'+art+'</span>'+
               '<b>'+esc(a.title)+'</b>'+
               '<span>'+esc(a.prompt || '')+'</span>'+
               '<span class="skill">&#127793; '+esc(a.teaches)+'</span>'+
               (a.teks && window.TEKS && TEKS.se[a.teks]
                 ? '<span class="acode">'+esc(TEKS.se[a.teks].grade)+' TEKS '+esc(a.teks)+'</span>'
                 : '')+
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
    var ORG = global.DHCG || { name:'Dew of Heaven Children\u2019s Garden', signer:{name:'',title:''} };
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
        /* Signed by the organisation, not by whoever happened to run
           the session. No grade band and no standards code: a fourth
           grader was handed a certificate saying Kindergarten, which
           is the opposite of what this is for. */
        '<div class="certsign">'+
          '<div class="certsigline"></div>'+
          '<b>'+esc(ORG.signer.name)+'</b>'+
          '<span>'+esc(ORG.signer.title)+' &middot; '+esc(ORG.name)+'</span>'+
        '</div>'+
        '<div class="certfoot"><span>'+esc(W.name||'')+(W.guide?' &middot; with '+esc(W.guide):'')+'</span>'+
          '<span>'+esc(when)+'</span></div>'+
      '</div>'+
      '<div class="certbtns">'+
        '<button class="btn btn-primary" id="shareCert">Share it</button>'+
        '<button class="btn btn-ghost" id="saveCert">Save as a picture</button>'+
        '<button class="btn btn-ghost" id="printCert">Print</button>'+
      '</div>'+
      '<p style="font-size:12.5px;color:var(--muted);margin-top:9px">Sharing sends a picture of the certificate, not a link.</p>';

    /* These are SKILLS, not questions, and the two used to sit next to
       "you answered 6 of 8" with no way to tell them apart. */
    var rawBefore = TGQuiz.raw(SLUG,'pre',  name);
    var rawAfter  = TGQuiz.raw(SLUG,'post', name);
    el('rBefore').innerHTML = (before || '&mdash;') +
      (rawBefore ? '<em>'+esc(rawBefore)+' questions</em>' : '');
    el('rAfter').innerHTML  = (after  || '&mdash;') +
      (rawAfter  ? '<em>'+esc(rawAfter)+' questions</em>'  : '');

    el('printCert').onclick = function(){ window.print(); };

    /* Share used to send a sentence, so a text message showed words
       where a certificate should be. Draw the real thing instead. */
    async function certImage(){
      var card = el('certCard');
      /* Measure the card, but never trust a degenerate measurement —
         a hidden tab reports zero and would produce a one-pixel-wide
         certificate. */
      var ratio = (card && card.offsetWidth > 40)
        ? card.offsetHeight / card.offsetWidth : 0.72;
      ratio = Math.max(0.55, Math.min(1.4, ratio));
      var W2 = 1200, H2 = Math.round(1200 * ratio);
      var cv = document.createElement('canvas');
      cv.width = W2; cv.height = H2;
      var g = cv.getContext('2d');
      var css = getComputedStyle(document.documentElement);
      var blue = (css.getPropertyValue('--blue') || '#0071BC').trim();
      var ink  = (css.getPropertyValue('--ink')  || '#16283A').trim();

      g.fillStyle = '#FFFFFF'; g.fillRect(0,0,W2,H2);
      g.strokeStyle = blue; g.lineWidth = 14;
      g.strokeRect(7,7,W2-14,H2-14);

      function line(text, y, size, weight, colour, font){
        g.fillStyle = colour; g.textAlign = 'center';
        g.font = weight+' '+size+'px '+(font||'Montserrat, system-ui, sans-serif');
        g.fillText(text, W2/2, y);
      }
      var y = 130;
      line(ORG.name.toUpperCase(), y, 30, '800', blue); y += 96;
      line(name, y, 92, '900', ink); y += 62;
      line('finished', y, 32, '400', '#7A8892', 'Nunito, sans-serif'); y += 68;
      line(L.title, y, 52, '800', ink); y += 76;

      g.font = '400 28px Nunito, sans-serif'; g.fillStyle = '#4A5A66'; g.textAlign = 'left';
      (L.competencies||[]).forEach(function(c){
        g.fillText('\u2605  ' + c.label, 130, y); y += 46;
      });

      y = H2 - 150;
      g.strokeStyle = '#D2CCC0'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(W2/2-190, y); g.lineTo(W2/2+190, y); g.stroke();
      line(ORG.signer.name, y + 46, 34, '800', ink);
      line(ORG.signer.title, y + 84, 24, '400', '#7A8892', 'Nunito, sans-serif');
      line(when, H2 - 40, 24, '400', '#A9B3BA', 'Nunito, sans-serif');

      return new Promise(function(res){ cv.toBlob(res, 'image/png'); });
    }

    el('saveCert').onclick = async function(){
      var blob = await certImage(); if (!blob) return;
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = name.replace(/\s+/g,'-') + '-' + L.slug + '.png';
      a.click();
      setTimeout(function(){ URL.revokeObjectURL(a.href); }, 4000);
    };

    el('shareCert').onclick = async function(){
      var btn = this;
      var txt = name + ' just finished ' + L.title + ' at DewLab.';
      try {
        var blob = await certImage();
        var file = new File([blob], name.replace(/\s+/g,'-')+'.png', { type:'image/png' });
        if (navigator.canShare && navigator.canShare({ files:[file] })){
          await navigator.share({ files:[file], text:txt });
          return;
        }
        /* No file sharing here — hand them the picture to send instead
           of quietly falling back to a sentence. */
        el('saveCert').click();
        btn.textContent = 'Saved — attach it';
      } catch(e){
        btn.textContent = 'Try Save as a picture';
      }
      setTimeout(function(){ btn.textContent = 'Share it'; }, 4000);
    };
  }

  /* ---------------- the whole page ---------------- */
  var RAIL = ['Before','Live','Play','At home','Show it'];

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
    paintVideo();
    wireFlip();

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
        ? 'You have done everything. Ready when you are.'
        : 'A few more things first: ' +
          (NEED_PLAY - played > 0 ? (NEED_PLAY - played) + ' more game' + ((NEED_PLAY-played)===1?'':'s') : '') +
          (NEED_PLAY - played > 0 && !built() ? ', and ' : '') +
          (!built() ? 'one thing made at home' : '') + '.';

    var sl = el('stdList');
    if (sl && window.TEKS){
      sl.innerHTML = (L.competencies||[]).map(function(c){
        var se = TEKS.se[c.teks]; if (!se) return '';
        return '<div class="stdrow"><b>'+esc(c.teks)+'</b>'+
               '<span>'+esc(c.label)+'<em>'+esc(se.subject||'Science')+' &middot; '+esc(se.grade)+
               ' &middot; '+esc(se.section)+'</em></span></div>';
      }).join('');
    }

    /* What to do next, on the stage they are standing on. They finished
       two games and had no idea whether that was enough. */
    var needBuild = !built(), needPlay = Math.max(0, NEED_PLAY - played);
    var nu = el('nextUp'), nu2 = el('nextUp2');
    if (nu){
      if (!unlocked) nu.style.display = 'none';
      else {
        nu.style.display = '';
        nu.className = 'nextup' + (needPlay ? '' : ' done');
        nu.innerHTML = needPlay
          ? '<span class="big">'+played+' of '+NEED_PLAY+'</span>'+
            '<span>games played<small>'+needPlay+' more, then one thing to make at home.</small></span>'
          : '<span class="big">&#9989;</span>'+
            '<span>That is enough playing<small>'+
            (needBuild ? 'Next: make one thing at home, just below.'
                       : 'You have done everything. Go and show what you grew.')+'</small></span>';
      }
    }
    if (nu2){
      if (!unlocked) nu2.style.display = 'none';
      else {
        nu2.style.display = '';
        nu2.className = 'nextup' + (needBuild ? '' : ' done');
        nu2.innerHTML = needBuild
          ? '<span class="big">&#128736;&#65039;</span>'+
            '<span>Pick any one and make it<small>Just one. Then you are ready for the last part.</small></span>'
          : '<span class="big">&#9989;</span>'+
            '<span>You made it<small>'+
            (needPlay ? needPlay+' more game'+(needPlay===1?'':'s')+' to play first.'
                      : 'Everything is done. Go and show what you grew.')+'</small></span>';
      }
    }

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

    paintRead();
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


/* The staff/family switch. Reloads rather than repainting, because
   the lock state is read in a dozen places while a page draws and a
   half-switched page is worse than a slower one. */
  function wireViewToggle(){
  var bar = document.getElementById('adminBar');
  if (!bar) return;
  bar.style.display = 'flex';
  var fam = TG.viewAsFamily();
  document.getElementById('adminBarTxt').textContent = fam
    ? 'You are seeing exactly what a family sees. Locked worlds are locked for you too.'
    : 'You are seeing this as DewLab staff, so every lesson is open.';
  var btn = document.getElementById('viewToggle');
  btn.textContent = fam ? 'Back to staff view' : 'See it as a family';
  btn.onclick = function(){ TG.setViewAsFamily(!fam); location.reload(); };
}

  /* ---------------- boot ---------------- */
  (async function(){
    var s = await TG.requireAuth();
    if (!s) return;                                  /* requireAuth redirects */

    /* Anything DHCG has edited in the admin panel covers the shipped
       lesson. Done before the first paint so a family never sees the
       old wording flash and then change. */
    /* Resolve the admin flag before painting, so an admin never sees
       the page draw locked and then unlock a moment later. */
    var admin = await TG.isAdmin();

    if (global.TGContent){
      await TGContent.load();
      var edited = global.LESSONS[SLUG];
      if (edited && edited !== L && !edited.legacy) L = edited;
    }

    paintBrand();

    var kids = (s.profile && s.profile.children) || [];
    el('whoName').textContent = (s.profile && (s.profile.parentName || s.profile.parent_name)) || kids[0] && kids[0].name || 'You';
    el('av').textContent = ((kids[0] && kids[0].name) || 'D').charAt(0).toUpperCase();

    await TGSession.loadAll();
    await TGProgress.load(kids[0] && kids[0].id);

    el('outBtn').onclick = async function(){ await TG.signOut(); location.href='login.html'; };
    el('playX').onclick  = function(){ TGPlay.close(); TGQuiz.close(); };
    el('wordBtn').onclick = tryWord;
    [].forEach.call(document.querySelectorAll('.stog'), function(b){
      b.onclick = function(){
        [].forEach.call(document.querySelectorAll('.stog'), function(x){ x.className='stog'; });
        b.className = 'stog on'; mode = b.dataset.mode; recIdx = 0; paintVideo(); wireFlip();
      };
    });
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

    if (admin) wireViewToggle();

    paint();
    el('boot').style.display = 'none';
    el('app').style.display  = '';
  })();

})(window);

/* ------------------------------------------------------------------
   Dewey the guide — DewLab
   ------------------------------------------------------------------
   Two jobs, both for children who cannot read the page yet.

   1. ON THE LESSON PAGE Dewey waits in the bottom-right corner, and
      pops up to say what to do in a short HeyGen clip (film/dewey/):
        - EVERY time a lesson is opened: his "Meet Dewey!" intro from
          the beginning, then the line for the stage they are on
        - whenever a stage opens: that stage's line
      Tap him any time to hear it again. Browsers will not always start
      sound without a tap, so if a clip cannot start by itself a big
      play button waits instead.

   2. INSIDE A GAME the hint strip at the bottom (.say) gets a small
      Dewey whose face follows what just happened:
        happy     waiting
        wink      right answer
        thinking  not yet — never a sad face after a wrong answer
      A game can say which face it wants with data-mood="ok" / "hm";
      without it the face is read from the words, which covers the
      plant lesson's hand-built games too.

   The lesson pages call TGGuide.stage(n, {lesson, kid}) every
   time they repaint their stages. n is 1-5, or 6 when all is done.
------------------------------------------------------------------- */
(function (global) {

  var BASE = 'film/dewey/';
  var IMG  = 'img/';

  var CLIPS = {
    0: { file:'dewey-0-intro.mp4',
         text:'Hi! I’m Dewey. I’ll help you in every lesson. When you’re not sure what to do, tap me and I’ll tell you!' },
    1: { file:'dewey-1-before-check.mp4',
         text:'Hi, friend! Let’s see what you already know. Tap the picture you think is right.' },
    2: { file:'dewey-2-video.mp4',
         text:'Now let’s watch the video together. Tap the big play button.' },
    3: { file:'dewey-3-games.mp4',
         text:'You watched the whole video! Now it’s time to play. Pick a game, and I’ll show you how to play it.' },
    4: { file:'dewey-4-make-at-home.mp4',
         text:'You played so well! Now let’s make something at home. Ask a grown-up to help you.' },
    5: { file:'dewey-5-after-check.mp4',
         text:'You did so much today! Let’s see what you learned. Tap the picture you think is right.' }
  };
  var DONE_TEXT = 'You finished this lesson! Thank you for learning with me.';

  var CSS =
  /* ---- corner ---- */
  '.dgc{position:fixed;right:16px;bottom:16px;z-index:90;font-family:inherit}'+
  'body{padding-bottom:112px}'+
  'body:has(.ovl.on) .dgc{display:none}'+
  '.dgc-dot{width:84px;height:84px;border-radius:50%;background:#fff;border:3px solid var(--blue,#0071BC);'+
    'box-shadow:0 6px 18px rgba(0,0,0,.18);display:grid;place-items:center;position:relative;cursor:pointer;padding:0}'+
  '.dgc-dot img{width:62px;height:70px;object-fit:contain;animation:dgBreathe 4.4s ease-in-out infinite;transform-origin:50% 90%}'+
  '.dgc-dot .spk{position:absolute;right:-4px;bottom:-4px;width:30px;height:30px;border-radius:50%;'+
    'background:var(--yellow-warm,#F2D64F);display:grid;place-items:center;font-size:15px;border:2px solid #fff}'+
  '.dgc-dot:focus-visible{outline:3px solid var(--yellow-warm,#F2D64F);outline-offset:3px}'+
  /* ---- the talking card ---- */
  '.dg-card{width:300px;max-width:calc(100vw - 32px);background:#fff;border-radius:22px;'+
    'box-shadow:0 14px 40px rgba(0,0,0,.25);overflow:hidden;border:3px solid var(--blue,#0071BC);'+
    'animation:dgUp .35s cubic-bezier(.2,.9,.3,1.2) both}'+
  '.dg-vid{position:relative;background:#fff;aspect-ratio:1/1;max-height:34vh;margin:0 auto;display:block}'+
  '@media (max-width:480px){.dgc .dg-card{width:260px}.dg-cap{font-size:14.5px}}'+
  '.dg-vid video,.dg-vid img{width:100%;height:100%;object-fit:contain;display:block}'+
  '.dg-go{position:absolute;right:10px;bottom:10px;width:64px;height:64px;border-radius:50%;border:3px solid #fff;'+
    'background:var(--blue,#0071BC);color:#fff;font-size:28px;box-shadow:0 6px 16px rgba(0,0,0,.3);cursor:pointer;'+
    'animation:dgPulse 1.6s ease-in-out infinite}'+
  '@keyframes dgPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}'+
  '.dg-cap{padding:10px 16px 2px;font-size:15.5px;line-height:1.4;font-weight:600;color:var(--ink,#16283A)}'+
  '.dg-bar{height:6px;background:#eee;margin:10px 16px 0;border-radius:3px;overflow:hidden}'+
  '.dg-bar i{display:block;height:100%;width:0;background:var(--blue,#0071BC)}'+
  '.dg-row{display:flex;gap:8px;padding:12px 16px 16px}'+
  '.dg-row button{flex:1;border-radius:14px;padding:11px;font-weight:700;font-size:15px;'+
    'border:2px solid var(--line,#ddd);background:#fff;color:var(--ink,#16283A);cursor:pointer;font-family:inherit}'+
  '.dg-row button.go{background:var(--blue,#0071BC);color:#fff;border-color:var(--blue,#0071BC)}'+
  /* ---- first time: meet Dewey ---- */
  '.dg-back{position:fixed;inset:0;background:rgba(22,40,58,.55);z-index:95}'+
  '.dg-mid{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:96}'+
  '.dg-mid .dg-card{width:340px}'+
  '.dg-hello{text-align:center;margin-bottom:12px}'+
  '.dg-hello span{display:inline-block;background:var(--yellow-warm,#F2D64F);color:var(--ink,#16283A);'+
    'font-size:20px;font-weight:800;padding:8px 18px;border-radius:20px}'+
  '.dg-skip{display:block;margin:0 auto 14px;background:none;border:0;color:var(--muted,#6B7785);'+
    'font-size:13px;text-decoration:underline;cursor:pointer;font-family:inherit}'+
  /* ---- Dewey in a game's hint strip ---- */
  '.say.dg{display:flex;align-items:center;justify-content:flex-start;gap:10px;text-align:left;'+
    'padding-top:6px;padding-bottom:6px;padding-left:6px;min-height:62px;transition:background .25s}'+
  '.say.dg>img.dgf{width:48px;height:56px;object-fit:contain;flex:none}'+
  '.say.dg>img.dgf.pop{animation:dgPop .45s cubic-bezier(.2,.9,.3,1.4) both}'+
  '.say.dg>.dgt{flex:1;min-width:0}'+
  '.say.dg.ok{background:#EAF1E5;color:#2F5A1C}'+
  '.say.dg.hm{background:#FBF3D1;color:#5A4A10}'+
  '@keyframes dgBreathe{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px) scale(1.02)}}'+
  '@keyframes dgUp{0%{transform:translateY(16px) scale(.9);opacity:0}100%{transform:none;opacity:1}}'+
  '@keyframes dgPop{0%{transform:scale(.6) translateY(8px)}100%{transform:none}}'+
  '@media (prefers-reduced-motion:reduce){.dgc-dot img,.dg-card,.say.dg>img.dgf.pop{animation:none!important}}';

  function injectCSS(){
    if (document.getElementById('dg-css')) return;
    var s = document.createElement('style'); s.id = 'dg-css'; s.textContent = CSS;
    document.head.appendChild(s);
  }

  function get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }
  function set(k,v){ try { localStorage.setItem(k, v); } catch(e){} }
  function hush(){ if (global.TGAudio && TGAudio.stop) TGAudio.stop(); }

  /* ================= the corner guide ================= */

  var ctx = { lesson:'', kid:'' };
  var cur = null;          /* stage Dewey is on */
  var corner, video, cardEl, backEl, queue = [];

  function mountCorner(){
    if (corner) return;
    injectCSS();
    corner = document.createElement('div');
    corner.className = 'dgc';
    corner.innerHTML =
      '<button class="dgc-dot" type="button" aria-label="Tap Dewey to hear what to do">'+
        '<img src="'+IMG+'dewey-happy.png" alt=""><span class="spk" aria-hidden="true">&#128266;</span>'+
      '</button>';
    document.body.appendChild(corner);
    corner.querySelector('button').onclick = function(){ openCard(cur, true); };

    /* a game opening covers the page: stop talking */
    var ovl = document.getElementById('ovl');
    if (ovl && global.MutationObserver){
      new MutationObserver(function(){
        if (ovl.classList.contains('on')) closeAll();
        else greet();              /* a stage may have opened while the game was up */
      }).observe(ovl, { attributes:true, attributeFilter:['class'] });
    }
  }

  function setFace(){
    if (!corner) return;
    corner.querySelector('img').src = IMG + 'dewey-' + (cur === 6 ? 'thankful' : 'happy') + '.png';
  }

  var spare = null;   /* a video a tap already started, handed to the next card */

  function closeAll(){
    queue = [];
    if (video){ try { video.pause(); } catch(e){} }
    if (cardEl){ cardEl.remove(); cardEl = null; }
    if (backEl){ backEl.remove(); backEl = null; }
    if (corner) corner.style.display = '';
    video = null;
  }

  /* Plays clip n inside the open card.

     Browsers usually refuse to start sound on their own. When that
     happens Dewey still moves, silently, and the one big button on the
     card becomes "Hear Dewey". A child tapping the blue button always
     hears him — there is no way to close the card thinking you pressed
     play, which is what happened in testing. */
  function playClip(n, auto){
    var c = CLIPS[n]; if (!c || !cardEl) return;
    var box  = cardEl.querySelector('.dg-vid');
    var cap  = cardEl.querySelector('.dg-cap');
    var bar  = cardEl.querySelector('.dg-bar i');
    var main = cardEl.querySelector('.go');
    var again = cardEl.querySelector('.again');
    cap.textContent = c.text;
    if (bar) bar.style.width = '0%';
    /* One <video> per card, reused for the next clip: a phone lets an
       element that a tap already started play again, but would block a
       brand-new one — so the line after the intro would go silent. */
    var v = box.querySelector('video');
    if (!v){
      box.innerHTML = '<button class="dg-go" type="button" aria-label="Hear Dewey">&#128266;</button>';
      v = spare || document.createElement('video');
      spare = null;
      v.setAttribute('playsinline', ''); v.preload = 'auto';
      box.insertBefore(v, box.firstChild);
    }
    v.src = BASE + c.file;
    video = v;
    var go = box.querySelector('.dg-go');

    function needTap(){
      go.style.display = '';
      main.innerHTML = '&#128266; Hear Dewey';
      main.onclick = withSound;
      if (again) again.style.visibility = 'hidden';
    }
    function talking(){
      go.style.display = 'none';
      if (!cardEl) return;
      main.textContent = cardEl.getAttribute('data-done') || 'Got it';
      main.onclick = cardEl.onDone || closeAll;
      if (again) again.style.visibility = '';
    }
    function withSound(){
      hush();
      v.loop = false; v.muted = false;
      try { v.currentTime = 0; } catch(e){}
      var p = v.play();
      talking();
      if (p && p.catch) p.catch(function(){ needTap(); });
    }
    function silently(){
      v.muted = true; v.loop = true;
      var p = v.play();
      if (p && p.catch) p.catch(function(){});
      needTap();
    }

    go.onclick = withSound;
    v.onclick = function(){ if (v.muted || v.paused) withSound(); };
    v.ontimeupdate = function(){
      if (bar && v.duration && !v.muted) bar.style.width = (v.currentTime / v.duration * 100) + '%';
    };
    v.onended = function(){
      if (v.muted) return;
      if (bar) bar.style.width = '100%';
      if (queue.length) { playClip(queue.shift(), true); return; }
      if (cardEl && cardEl.onEnded) { cardEl.onEnded(); return; }
      /* Done talking: shrink back to the corner so the card is not
         covering the very thing he just told them to tap. */
      var mine = cardEl;
      setTimeout(function(){ if (cardEl === mine && v.paused) closeAll(); }, 1600);
    };

    if (!auto) { silently(); return; }
    hush();
    var p = v.play();
    talking();
    if (p && p.catch) p.catch(function(){ if (cardEl && video === v) silently(); });
  }

  function cardHTML(withAgain){
    return '<div class="dg-card" role="dialog" aria-label="Dewey">'+
             '<div class="dg-vid"></div>'+
             '<div class="dg-cap"></div>'+
             '<div class="dg-bar"><i></i></div>'+
             '<div class="dg-row">'+
               (withAgain ? '<button type="button" class="again">&#8635; Again</button>' : '')+
               '<button type="button" class="go">Got it</button>'+
             '</div>'+
           '</div>';
  }

  /* The card for the stage they are on. auto = try to start the sound. */
  function openCard(n, auto){
    if (n == null) return;
    closeAll();
    mountCorner();
    corner.style.display = 'none';

    cardEl = document.createElement('div');
    cardEl.className = 'dgc';
    cardEl.innerHTML = cardHTML(n !== 6);
    document.body.appendChild(cardEl);
    cardEl.querySelector('.go').onclick = closeAll;

    if (n === 6){
      cardEl.querySelector('.dg-vid').innerHTML = '<img src="'+IMG+'dewey-thankful.png" alt="">';
      cardEl.querySelector('.dg-cap').textContent = DONE_TEXT;
      cardEl.querySelector('.dg-bar').style.display = 'none';
      return;
    }
    cardEl.querySelector('.again').onclick = function(){ playClip(n, true); };
    playClip(n, auto);
  }

  /* First time in a lesson: Meet Dewey, then this stage's line. */
  function openIntro(n){
    closeAll();
    mountCorner();
    corner.style.display = 'none';

    backEl = document.createElement('div');
    backEl.className = 'dg-back';
    document.body.appendChild(backEl);

    cardEl = document.createElement('div');
    cardEl.className = 'dg-mid';
    cardEl.innerHTML = '<div class="dg-hello"><span>Meet Dewey!</span></div>' + cardHTML(false);
    document.body.appendChild(cardEl);
    cardEl.setAttribute('data-done', 'Let’s go!');
    var row = cardEl.querySelector('.dg-row');
    row.insertAdjacentHTML('afterend', '<button type="button" class="dg-skip">Not now</button>');
    /* The intro is on its own in the middle. When it finishes (or they
       press "Let's go", which only appears once he is talking) Dewey
       moves to the corner and says the line for their stage there,
       next to the button he is telling them to press. (Erin, 2026-09-14) */
    var mine = cardEl;
    function toCorner(){
      if (cardEl !== mine) return;
      spare = video;                        /* keep the tap-started player */
      if (spare && spare.parentNode) spare.parentNode.removeChild(spare);
      video = null;
      closeAll();
      if (n >= 1 && n <= 5) openCard(n, true);
    }
    cardEl.onDone = toCorner;
    cardEl.onEnded = function(){ setTimeout(toCorner, 700); };
    cardEl.querySelector('.dg-skip').onclick = closeAll;

    playClip(0, true);
  }

  /* What Dewey has to say once nothing is covering the page:
     'intro' each time a lesson is opened, 'line' when a stage opens. */
  var wantGreet = null;

  function stage(n, opts){
    opts = opts || {};
    var fresh = cur === null || opts.kid !== ctx.kid || opts.lesson !== ctx.lesson;
    var moved = !fresh && n > cur;
    ctx.lesson = opts.lesson || ''; ctx.kid = opts.kid || '';

    mountCorner();
    if (fresh) closeAll();
    cur = n;
    setFace();
    if (fresh) wantGreet = 'intro';
    else if (moved) wantGreet = 'line';     /* repaints alone stay quiet */
    greet();
  }

  /* EVERY time a lesson is opened, Dewey plays his intro from the
     beginning and then the line for the stage they are on (Erin,
     2026-09-14). Staff get exactly the same, so what they test is what
     a child gets. */
  function greet(){
    if (!wantGreet || cur === null || backEl) return;   /* never over the intro */
    var ovl = document.getElementById('ovl');
    if (ovl && ovl.classList.contains('on')) return;   /* a game is up; wait */

    var what = wantGreet; wantGreet = null;
    if (what === 'intro') openIntro(cur);
    else if (cur <= 5) openCard(cur, true);
  }

  /* ================= Dewey in a game's hint strip ================= */

  var THINK = /\b(not|try|another go|have another|the answer is|isn’t|isn't|goes in|earlier)\b/i;
  var WINK  = /(that[’']?s right|that is right|^\s*yes\b|got it|great job|nice|well done|keep going|you did it)/i;

  function moodOf(sayEl, text){
    var m = sayEl.getAttribute('data-mood');
    if (m) return m === 'wait' ? '' : m;     /* the game said so */
    if (THINK.test(text)) return 'hm';
    if (WINK.test(text))  return 'ok';
    return '';
  }

  function decorate(sayEl){
    var img = sayEl.firstElementChild;
    var hasImg = img && img.classList && img.classList.contains('dgf');
    var textSpan = hasImg ? img.nextElementSibling : null;
    var ready = hasImg && textSpan && textSpan.classList.contains('dgt') && sayEl.childNodes.length === 2;

    if (!ready){
      var t = document.createElement('span'); t.className = 'dgt';
      while (sayEl.firstChild){
        var c = sayEl.firstChild;
        if (c.classList && c.classList.contains('dgf')) { sayEl.removeChild(c); continue; }
        t.appendChild(c);
      }
      img = document.createElement('img'); img.className = 'dgf'; img.alt = '';
      sayEl.appendChild(img); sayEl.appendChild(t);
      textSpan = t;
      sayEl.removeAttribute('data-shown');
    }
    var mood = moodOf(sayEl, textSpan.textContent);
    var face = mood === 'ok' ? 'wink' : mood === 'hm' ? 'thinking' : 'happy';
    if (sayEl.getAttribute('data-shown') !== face){
      sayEl.setAttribute('data-shown', face);
      img.src = IMG + 'dewey-' + face + '.png';
      img.classList.remove('pop'); void img.offsetWidth; img.classList.add('pop');
    }
    sayEl.classList.add('dg');
    sayEl.classList.toggle('ok', mood === 'ok');
    sayEl.classList.toggle('hm', mood === 'hm');
  }

  var busy = false;
  function sweep(root){
    if (busy) return;
    busy = true;
    try {
      [].forEach.call(root.querySelectorAll('.say'), function(s){
        if (s.closest('.win')) return;
        if (!s.textContent.trim() && !s.querySelector('.dgt')) return;
        decorate(s);
      });
    } finally { busy = false; }
  }

  function watchGames(){
    var ovl = document.getElementById('ovl');
    if (!ovl || !global.MutationObserver) return;
    injectCSS();
    new MutationObserver(function(){ sweep(ovl); })
      .observe(ovl, { childList:true, subtree:true, characterData:true, attributes:true, attributeFilter:['data-mood'] });
    sweep(ovl);
  }

  /* A game sets the face explicitly: TGGuide.mood(el, 'ok' | 'hm' | 'wait') */
  function mood(sayEl, m){
    if (sayEl) sayEl.setAttribute('data-mood', m || 'wait');
  }

  if (document.readyState !== 'loading') watchGames();
  else document.addEventListener('DOMContentLoaded', watchGames);

  global.TGGuide = { stage: stage, mood: mood, open: function(){ openCard(cur, true); }, close: closeAll };
})(window);

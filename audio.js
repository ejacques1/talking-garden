/* ------------------------------------------------------------------
   Read-aloud — The Talking Garden
   ------------------------------------------------------------------
   Most of our children cannot yet read the questions. Every prompt is
   spoken automatically, so a kindergartener can play without a
   grown-up sitting beside them reading the screen.

   Uses the browser's built-in speech synthesis: no audio files, no
   API key, no cost, and it reads whatever text is on the page — so
   changing a question never leaves stale audio behind.

   PHASE TWO: swap individual lines for Ms. Nia's own recorded voice
   by adding a `clip` to a question and having speak() prefer it.
   The children have just met her; her voice will beat any robot.
------------------------------------------------------------------- */
(function (global) {

  var ON_KEY = 'tg_audio_on';
  var supported = 'speechSynthesis' in global;
  var voice = null, primed = false;

  function enabled(){
    try { return localStorage.getItem(ON_KEY) !== '0'; } catch(e){ return true; }
  }
  function setEnabled(v){
    try { localStorage.setItem(ON_KEY, v ? '1' : '0'); } catch(e){}
    if (!v) stop();
  }

  /* ---------------- choosing a voice ----------------
     Browsers ship anything from genuinely good neural voices to the
     1980s novelty ones still bundled with macOS. Left to itself the
     browser often picks the worst available, which is what made this
     sound cheap.

     So: score every voice and take the best. Modern neural voices
     announce themselves in their name — Natural, Neural, Premium,
     Enhanced, Online — and those are worth a lot. The novelty voices
     (Zarvox, Bubbles, Bad News and friends) are actively excluded,
     because one of them turning up in front of a five-year-old is
     worse than no sound at all. */

  var VOICE_KEY = 'dl_voice';

  /* macOS ships these as jokes. Never speak to a child with one. */
  var NOVELTY = /albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|junior|ralph|fred|kathy|princess|hysterical|pipe organ|grandma|grandpa|rocko|shelley|sandy|eddy|flo|reed|rishi/i;

  function scoreVoice(v){
    var n = (v.name||'') + ' ' + (v.voiceURI||'');
    var lang = (v.lang||'').toLowerCase();

    if (NOVELTY.test(n)) return -1;
    if (!/^en/.test(lang)) return -1;

    var s = 0;
    /* The generation of voice matters more than anything else. */
    if (/natural|neural/i.test(n))   s += 60;
    if (/premium|enhanced/i.test(n)) s += 45;
    if (/online/i.test(n))           s += 25;   /* Microsoft's cloud voices */
    if (/google/i.test(n))           s += 35;
    if (/siri/i.test(n))             s += 30;
    if (/compact/i.test(n))          s -= 30;   /* the low-quality fallbacks */

    /* Named voices that are reliably decent where they exist. */
    if (/samantha|ava|allison|zoe|aria|jenny|serena|karen|moira|nicky|evan/i.test(n)) s += 18;

    /* Match the audience: American English first, then other English. */
    if (lang === 'en-us') s += 14;
    else if (/^en-(gb|au|ca)/.test(lang)) s += 6;

    /* A local voice always works; a network one can fail offline. Only
       a tie-breaker, because the network ones usually sound better. */
    if (v.localService) s += 3;

    return s;
  }

  function allVoices(){
    if (!supported) return [];
    var vs = [];
    try { vs = speechSynthesis.getVoices() || []; } catch(e){}
    return vs;
  }

  function pickVoice(){
    var vs = allVoices();
    if (!vs.length) return null;

    /* An explicit choice always wins. */
    try {
      var saved = localStorage.getItem(VOICE_KEY);
      if (saved){
        var hit = vs.filter(function(v){ return v.voiceURI === saved || v.name === saved; })[0];
        if (hit) return hit;
      }
    } catch(e){}

    var best = null, bestScore = -1;
    vs.forEach(function(v){
      var sc = scoreVoice(v);
      if (sc > bestScore){ bestScore = sc; best = v; }
    });
    /* Everything scored below zero means only novelty or non-English
       voices exist. Speaking in one of those is worse than silence. */
    return bestScore >= 0 ? best : null;
  }

  function refreshVoice(){ voice = pickVoice(); return voice; }

  if (supported){
    refreshVoice();                       /* often empty on first call */
    try { speechSynthesis.onvoiceschanged = refreshVoice; } catch(e){}
    /* Some browsers never fire voiceschanged. Look again shortly. */
    setTimeout(refreshVoice, 400);
    setTimeout(refreshVoice, 1600);
  }

  function stop(){ if (supported) try { speechSynthesis.cancel(); } catch(e){} }

  /* iOS will not speak until synthesis has run inside a real tap. */
  function prime(){
    if (!supported || primed) return;
    try {
      var u = new SpeechSynthesisUtterance(' ');
      u.volume = 0; speechSynthesis.speak(u); primed = true;
    } catch(e){}
  }
  document.addEventListener('pointerdown', prime, { once:true });

  function say(text, opts){
    if (!supported || !enabled() || !text) return null;
    opts = opts || {};
    var u = new SpeechSynthesisUtterance(String(text).replace(/\s+/g,' ').trim());
    if (!voice) voice = pickVoice();
    if (voice) u.voice = voice;
    u.rate   = opts.rate   || 0.92;   // a little slow, for small children
    u.pitch  = opts.pitch  || 1.05;
    u.volume = opts.volume == null ? 1 : opts.volume;
    try { speechSynthesis.speak(u); } catch(e){}
    return u;
  }

  global.TGAudio = {
    supported: supported,

    /* Every usable voice on this device, best first — for a picker. */
    voices: function(){
      return allVoices()
        .map(function(v){ return { v:v, s:scoreVoice(v) }; })
        .filter(function(x){ return x.s >= 0; })
        .sort(function(a,b){ return b.s - a.s; })
        .map(function(x){ return { name:x.v.name, lang:x.v.lang, uri:x.v.voiceURI, score:x.s }; });
    },
    voiceName: function(){ return voice ? voice.name : null; },
    setVoice: function(uriOrName){
      try {
        if (uriOrName) localStorage.setItem(VOICE_KEY, uriOrName);
        else localStorage.removeItem(VOICE_KEY);
      } catch(e){}
      return refreshVoice();
    },
    enabled: enabled,
    setEnabled: setEnabled,
    stop: stop,
    say: function(t, o){ stop(); return say(t, o); },

    /* Say something, then run cb when the voice actually finishes.
       Falls back to a timer when speech is muted or unsupported, so
       callers never stall waiting for an event that will not fire. */
    sayThen: function(text, cb, fallbackMs){
      var done = false;
      var finish = function(){ if (!done){ done = true; cb && cb(); } };
      if (!supported || !enabled()){ setTimeout(finish, fallbackMs || 900); return; }
      stop();
      var u = say(text);
      if (!u){ setTimeout(finish, fallbackMs || 900); return; }
      u.onend = finish;
      u.onerror = finish;
      /* Safety net: some browsers never fire onend if the tab is hidden. */
      setTimeout(finish, Math.max(fallbackMs || 0, 1200 + String(text).length * 55));
    },

    /* Read a question, then its choices, as one flowing prompt. */
    readQuestion: function(question, choices){
      if (!supported || !enabled()) return;
      stop();
      say(question);
      if (choices && choices.length){
        var joined = choices.map(function(c, i){
          return (i === choices.length-1 ? 'or ' : '') + c;
        }).join(', ');
        say(joined, { rate: 0.88 });
      }
    },

    /* A small "read this to me" button attached to a block of text.
       Different job from button() below: that one mutes the whole
       page, this one reads one specific thing on demand.

       Why it exists: the platform claims read-aloud on every prompt,
       and the quiz and activities did it — but the at-home build, the
       longest text in a lesson, was silent. A five-year-old could not
       read the thing they were supposed to go and make. */
    readBtn: function(getText, label){
      var b = document.createElement('button');
      b.className = 'readbtn';
      b.type = 'button';
      b.innerHTML = '&#128266;';
      b.title = label || 'Read this out loud';
      b.setAttribute('aria-label', b.title);
      b.onclick = function(e){
        e.preventDefault(); e.stopPropagation();
        if (!enabled()) setEnabled(true);
        var t = typeof getText === 'function' ? getText() : getText;
        stop();
        say(String(t||'').replace(/\s+/g,' ').trim());
      };
      return b;
    },

    /* Attach a read-aloud button to every element matching a selector.
       Called after each paint, so freshly drawn text gets one too. */
    attach: function(root, selector){
      var host = root || document;
      [].forEach.call(host.querySelectorAll(selector), function(el){
        if (el.dataset.readable) return;      /* already has one */
        el.dataset.readable = '1';
        var b = global.TGAudio.readBtn(function(){ return el.innerText || el.textContent; });
        el.appendChild(b);
      });
    },

    /* A speaker button that mutes and unmutes, wherever it is placed. */
    button: function(){
      var b = document.createElement('button');
      b.className = 'sndbtn';
      b.type = 'button';
      var paint = function(){
        b.innerHTML = enabled() ? '&#128266;' : '&#128263;';
        b.title = enabled() ? 'Sound on — tap to mute' : 'Sound off — tap to turn on';
        b.setAttribute('aria-label', b.title);
      };
      b.onclick = function(e){
        e.stopPropagation();
        setEnabled(!enabled());
        paint();
        if (enabled()) say('Sound on');
      };
      paint();
      return b;
    }
  };
})(window);

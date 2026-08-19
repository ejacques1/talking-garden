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

  /* Prefer a natural, English voice. Falls back to whatever exists. */
  function pickVoice(){
    if (!supported) return null;
    var vs = speechSynthesis.getVoices();
    if (!vs.length) return null;
    var prefer = ['Samantha','Google US English','Microsoft Aria','Karen','Moira'];
    for (var i=0;i<prefer.length;i++){
      var hit = vs.filter(function(v){ return v.name.indexOf(prefer[i]) > -1; })[0];
      if (hit) return hit;
    }
    return vs.filter(function(v){ return /^en/i.test(v.lang); })[0] || vs[0];
  }
  if (supported){
    pickVoice();
    speechSynthesis.onvoiceschanged = function(){ voice = pickVoice(); };
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

/* ------------------------------------------------------------------
   "Root explains" — the animated opener for What Grows When
   ------------------------------------------------------------------
   Same idea as Sunny's film on the plant lesson: drawn in code, so it
   exists today rather than waiting on a filming day, and Ms. Nia's
   real footage can sit alongside it later without replacing it.

   The picture here is a thermometer and two beds. As Root talks, the
   sun climbs, the temperature rises, and the two crops react in
   opposite directions — lettuce bolting as the okra finally takes
   off. That opposition IS the lesson, and it is the one thing a
   sorting activity cannot show.

   RECORDING OVER IT
   Every scene carries `say`, which the built-in voice reads. When
   DHCG records a real narration the same scenes carry `at` timings
   instead and the film follows the audio. Nothing else changes.
------------------------------------------------------------------- */
(function (global) {

  var SCENES = [
    { t:55,  cap:'Every seed has weather it likes.',
      say:'Hi, I am Root. Today we are not asking what to plant. We are asking when. Every seed has weather it likes.',
      lettuce:'happy', okra:'seed', month:'February' },

    { t:55,  cap:'Lettuce likes it cool.',
      say:'This is lettuce. Lettuce likes it cool. In February it is happy — crisp, sweet, ready to pick.',
      lettuce:'happy', okra:'seed', month:'February' },

    { t:72,  cap:'But watch what happens in July…',
      say:'But watch what happens when the months go by, and Texas turns the heat up.',
      lettuce:'stressed', okra:'sprout', month:'May' },

    { t:95,  cap:'It shoots up tall and turns bitter. That is bolting.',
      say:'The lettuce shoots up tall and goes bitter. Gardeners call that bolting. It is not your fault. It is the wrong month.',
      lettuce:'bolted', okra:'growing', month:'July' },

    { t:95,  cap:'Okra is the opposite. It loves this.',
      say:'Now look at the okra. Same garden. Same water. This one loves the heat, and it is finally taking off.',
      lettuce:'bolted', okra:'happy', month:'July' },

    { t:48,  cap:'Same garden. Different month.',
      say:'Same garden, same water, different month. So before you plant, ask what weather this seed wants. Get the month right, and the garden does the rest.',
      lettuce:'happy', okra:'seed', month:'October' }
  ];

  var CSS = ''+
  '.rtm{position:relative;width:100%;height:100%;overflow:hidden;transition:background 1.2s ease}'+
  '.rtm svg{display:block;width:100%;height:100%}'+
  '.rtm .fade{transition:opacity .55s ease, transform .9s cubic-bezier(.2,.8,.3,1)}'+
  '.rtm .hid{opacity:0}'+
  '.rtm .sun{transition:transform 1.2s cubic-bezier(.3,.7,.3,1), fill .9s ease}'+
  '.rtm .merc{transition:height .9s ease, y .9s ease, fill .9s ease}'+
  '.rtm .stalk{transition:transform 1s cubic-bezier(.2,.8,.3,1);transform-origin:96px 150px}'+
  '.rtm-dots{position:absolute;top:11px;left:13px;display:flex;gap:5px;z-index:3}'+
  '.rtm-dots i{width:18px;height:4px;border-radius:99px;background:rgba(255,255,255,.55);display:block;transition:.3s}'+
  '.rtm-dots i.on{background:#E3612B}'+
  '.rtm-ctl{position:absolute;top:9px;right:11px;z-index:3}'+
  '.rtm-ctl button{background:rgba(255,255,255,.94);border:none;border-radius:99px;padding:6px 13px;'+
    'font-family:inherit;font-size:12px;font-weight:700;color:#16283A;cursor:pointer}'+
  '.rtm-cap{position:absolute;left:0;right:0;bottom:0;z-index:3;padding:30px 18px 12px;color:#fff;'+
    'font-family:inherit;font-size:17px;font-weight:700;line-height:1.3;'+
    'background:linear-gradient(transparent,rgba(10,20,30,.72))}'+
  '.rtm-month{position:absolute;top:11px;left:50%;transform:translateX(-50%);z-index:3;'+
    'background:rgba(255,255,255,.94);border-radius:99px;padding:5px 15px;'+
    'font-family:inherit;font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#16283A}'+
  '.rtm-start{position:absolute;inset:0;z-index:4;display:grid;place-items:center;cursor:pointer;'+
    'background:rgba(10,20,30,.42)}'+
  '.rtm-start div{background:#fff;border-radius:99px;padding:13px 24px;font-family:inherit;'+
    'font-size:15px;font-weight:800;color:#16283A;display:flex;align-items:center;gap:9px}'+
  /* The guide stands in the frame while he talks. Sunny IS the plant
     in the other film, so he was always on screen; Root is a separate
     character and had been left out of his own explainer. */
  '.rtm-guide{position:absolute;left:10px;bottom:34px;z-index:4;width:21%;max-width:96px;'+
    'transition:transform .5s cubic-bezier(.2,.8,.3,1);pointer-events:none}'+
  '.rtm-guide img{width:100%;height:auto;display:block;'+
    'filter:drop-shadow(0 6px 10px rgba(20,30,20,.28))}'+
  '.rtm-guide.talk{animation:rtmBob 1.7s ease-in-out infinite}'+
  '@keyframes rtmBob{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-5px) rotate(1deg)}}'+
  /* A speech tail, so it reads as him saying the caption rather than
     him standing next to a subtitle. */
  '.rtm-cap{padding-left:29%!important}'+
  '@media(max-width:520px){.rtm-guide{width:25%;bottom:30px}.rtm-cap{padding-left:31%!important;font-size:14.5px}}';

  /* ---- the picture ---- */
  function lettuce(state){
    if (state === 'bolted')
      return '<g>'+
        '<path d="M96,150 L96,74" stroke="#6E8F4E" stroke-width="7" stroke-linecap="round"/>'+
        '<ellipse cx="96" cy="70" rx="9" ry="7" fill="#C9D66B"/>'+
        '<ellipse cx="86" cy="96" rx="12" ry="6" fill="#8FAE63" transform="rotate(-24 86 96)"/>'+
        '<ellipse cx="106" cy="112" rx="12" ry="6" fill="#8FAE63" transform="rotate(22 106 112)"/>'+
        '<ellipse cx="96" cy="146" rx="20" ry="9" fill="#9BB471"/>'+
      '</g>';
    if (state === 'stressed')
      return '<g>'+
        '<ellipse cx="96" cy="140" rx="25" ry="15" fill="#9DB870"/>'+
        '<ellipse cx="84" cy="133" rx="14" ry="10" fill="#AFC684"/>'+
        '<ellipse cx="108" cy="133" rx="14" ry="10" fill="#AFC684"/>'+
        '<path d="M96,126 L96,112" stroke="#8FAE63" stroke-width="5" stroke-linecap="round"/>'+
      '</g>';
    return '<g>'+
      '<ellipse cx="96" cy="140" rx="29" ry="18" fill="#7FA84E"/>'+
      '<ellipse cx="81" cy="131" rx="17" ry="12" fill="#95BE62"/>'+
      '<ellipse cx="111" cy="131" rx="17" ry="12" fill="#95BE62"/>'+
      '<ellipse cx="96" cy="124" rx="15" ry="11" fill="#A8CE74"/>'+
    '</g>';
  }

  function okra(state){
    if (state === 'seed')
      return '<g><ellipse cx="224" cy="150" rx="5" ry="4" fill="#6B5640"/></g>';
    if (state === 'sprout')
      return '<g>'+
        '<path d="M224,152 L224,132" stroke="#5C8A3E" stroke-width="4" stroke-linecap="round"/>'+
        '<ellipse cx="217" cy="130" rx="7" ry="4" fill="#6FA24C" transform="rotate(-28 217 130)"/>'+
        '<ellipse cx="231" cy="130" rx="7" ry="4" fill="#6FA24C" transform="rotate(28 231 130)"/>'+
      '</g>';
    if (state === 'growing')
      return '<g>'+
        '<path d="M224,152 L224,104" stroke="#4E7635" stroke-width="5" stroke-linecap="round"/>'+
        '<ellipse cx="211" cy="118" rx="13" ry="8" fill="#639245" transform="rotate(-26 211 118)"/>'+
        '<ellipse cx="237" cy="112" rx="13" ry="8" fill="#639245" transform="rotate(24 237 112)"/>'+
      '</g>';
    return '<g>'+
      '<path d="M224,152 L224,78" stroke="#4E7635" stroke-width="6" stroke-linecap="round"/>'+
      '<ellipse cx="207" cy="112" rx="16" ry="9" fill="#639245" transform="rotate(-26 207 112)"/>'+
      '<ellipse cx="241" cy="102" rx="16" ry="9" fill="#639245" transform="rotate(24 241 102)"/>'+
      '<ellipse cx="205" cy="90" rx="14" ry="8" fill="#6FA24C" transform="rotate(-20 205 90)"/>'+
      /* the pods — the point of growing okra at all */
      '<path d="M232,92 L240,72" stroke="#7FAE4A" stroke-width="6" stroke-linecap="round"/>'+
      '<path d="M216,86 L209,68" stroke="#7FAE4A" stroke-width="6" stroke-linecap="round"/>'+
    '</g>';
  }

  function svg(sc){
    var hot = sc.month === 'July';
    var mercH = { 'February':16, 'May':34, 'July':52, 'October':22 }[sc.month] || 20;
    return '<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">'+
      /* sun, climbing and reddening as the year heats up */
      '<circle class="sun" cx="278" cy="'+(hot?34:56)+'" r="'+(hot?24:19)+'" fill="'+(hot?'#F2A13C':'#F6D66B')+'"/>'+
      /* soil */
      '<rect x="0" y="152" width="320" height="28" fill="#7A5230"/>'+
      '<rect x="0" y="152" width="320" height="5" fill="#8B5F39"/>'+
      /* the two beds */
      '<g class="fade">'+lettuce(sc.lettuce)+'</g>'+
      '<g class="fade">'+okra(sc.okra)+'</g>'+
      /* Labels sit up in the sky, not on the soil: the caption bar
         covers the bottom of the frame and was hiding them. */
      '<text x="96" y="30" text-anchor="middle" font-family="Nunito,sans-serif" font-size="11.5" font-weight="800" fill="#16283A" opacity=".45" letter-spacing="1.4">LETTUCE</text>'+
      '<text x="224" y="30" text-anchor="middle" font-family="Nunito,sans-serif" font-size="11.5" font-weight="800" fill="#16283A" opacity=".45" letter-spacing="1.4">OKRA</text>'+
      /* thermometer */
      '<rect x="24" y="34" width="13" height="64" rx="6.5" fill="rgba(255,255,255,.85)"/>'+
      '<rect class="merc" x="27" y="'+(98-mercH)+'" width="7" height="'+mercH+'" rx="3.5" fill="'+(hot?'#E3612B':'#4E9BD1')+'"/>'+
      '<circle cx="30.5" cy="103" r="9" fill="'+(hot?'#E3612B':'#4E9BD1')+'"/>'+
    '</svg>';
  }

  function injectCSS(){
    if (document.getElementById('rtm-css')) return;
    var st = document.createElement('style'); st.id='rtm-css'; st.textContent = CSS;
    document.head.appendChild(st);
  }

  function mount(host, guideName, guideImg){
    if (!host) return;
    injectCSS();
    var i = 0, playing = false;

    host.innerHTML =
      '<div class="rtm">'+ svg(SCENES[0]) +
        '<div class="rtm-guide"><img src="'+(guideImg||'img/guide-root.png')+'" alt="'+(guideName||'Root')+'"></div>'+
        '<div class="rtm-dots">'+ SCENES.map(function(){ return '<i></i>'; }).join('') +'</div>'+
        '<div class="rtm-month"></div>'+
        '<div class="rtm-ctl"><button data-a="replay">Start again</button></div>'+
        '<div class="rtm-cap"></div>'+
        '<div class="rtm-start"><div>&#9654;&nbsp; Watch '+(guideName||'Root')+' explain</div></div>'+
      '</div>';

    var root  = host.querySelector('.rtm');
    var guide = root.querySelector('.rtm-guide');
    var cap   = root.querySelector('.rtm-cap');
    var month = root.querySelector('.rtm-month');
    var dots  = root.querySelectorAll('.rtm-dots i');
    var start = root.querySelector('.rtm-start');

    function paint(){
      var sc = SCENES[i];
      /* Redraw the picture rather than toggling layers: the two crops
         move in opposite directions, so there is no single stack of
         things to switch on. */
      var old = root.querySelector('svg');
      old.insertAdjacentHTML('beforebegin', svg(sc));
      old.remove();
      root.style.background = sc.month === 'July'
        ? 'linear-gradient(#FBE0C6,#F6EFD9 62%)'
        : 'linear-gradient(#DCEDF7,#EAF4E6 62%)';
      cap.textContent   = sc.cap;
      month.textContent = sc.month;
      for (var d=0; d<dots.length; d++) dots[d].classList.toggle('on', d <= i);
    }

    function advance(){
      if (!playing) return;
      if (i >= SCENES.length - 1){
        playing = false;
        if (guide) guide.classList.remove('talk');
        return;
      }
      i++; paint(); narrate();
    }

    function narrate(){
      var sc = SCENES[i];
      if (global.TGAudio && TGAudio.supported && TGAudio.enabled())
        TGAudio.sayThen(sc.say, advance, sc.t * 60);
      else
        setTimeout(advance, sc.t * 55);
    }

    function play(){
      start.style.display = 'none';
      playing = true; i = 0;
      if (guide) guide.classList.add('talk');
      paint(); narrate();
    }

    start.onclick = play;
    root.querySelector('[data-a="replay"]').onclick = function(){
      if (global.TGAudio) TGAudio.stop();
      play();
    };
    /* Tap the picture to move on at your own pace. */
    root.onclick = function(e){
      if (!playing || e.target.closest('button')) return;
      if (global.TGAudio) TGAudio.stop();
      advance();
    };

    paint();
  }

  global.TGMovies = global.TGMovies || {};
  global.TGMovies.seasons = { mount: mount, scenes: SCENES.length };
})(window);

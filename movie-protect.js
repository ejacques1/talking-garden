/* ------------------------------------------------------------------
   "Buzz explains" — the animated openers for the Protect world
   ------------------------------------------------------------------
   Two films, same machinery as Root's. Drawn in code so they exist
   before anything is filmed, and Ms. Nia's real footage sits alongside
   rather than replacing them.
------------------------------------------------------------------- */
(function (global) {

  var CSS = ''+
  '.pmv{position:relative;width:100%;height:100%;overflow:hidden;transition:background 1s ease}'+
  '.pmv svg{display:block;width:100%;height:100%}'+
  '.pmv-dots{position:absolute;top:11px;left:13px;display:flex;gap:5px;z-index:3}'+
  '.pmv-dots i{width:18px;height:4px;border-radius:99px;background:rgba(255,255,255,.55);display:block;transition:.3s}'+
  '.pmv-dots i.on{background:#E3612B}'+
  '.pmv-ctl{position:absolute;top:9px;right:11px;z-index:3}'+
  '.pmv-ctl button{background:rgba(255,255,255,.94);border:none;border-radius:99px;padding:6px 13px;'+
    'font-family:inherit;font-size:12px;font-weight:700;color:#16283A;cursor:pointer}'+
  '.pmv-cap{position:absolute;left:0;right:0;bottom:0;z-index:3;padding:30px 18px 12px 29%;color:#fff;'+
    'font-family:inherit;font-size:17px;font-weight:700;line-height:1.3;'+
    'background:linear-gradient(transparent,rgba(10,20,30,.72))}'+
  '.pmv-guide{position:absolute;left:10px;bottom:34px;z-index:4;width:21%;max-width:96px;pointer-events:none}'+
  '.pmv-guide img{width:100%;height:auto;display:block;filter:drop-shadow(0 6px 10px rgba(20,30,20,.28))}'+
  '.pmv-start{position:absolute;inset:0;z-index:5;display:grid;place-items:center;cursor:pointer;background:rgba(10,20,30,.42)}'+
  '.pmv-start div{background:#fff;border-radius:99px;padding:13px 24px;font-family:inherit;'+
    'font-size:15px;font-weight:800;color:#16283A;display:flex;align-items:center;gap:9px}'+
  '@media(max-width:520px){.pmv-guide{width:25%;bottom:30px}.pmv-cap{padding-left:31%;font-size:14.5px}}';

  function injectCSS(){
    if (document.getElementById('pmv-css')) return;
    var st = document.createElement('style'); st.id='pmv-css'; st.textContent = CSS;
    document.head.appendChild(st);
  }

  /* ---- a tiny scene language, so both films share one player ---- */
  function bee(x,y,s){ return '<text x="'+x+'" y="'+y+'" font-size="'+(s||18)+'" text-anchor="middle">&#128029;</text>'; }
  function bloom(x,y,c,s){
    s = s || 1;
    return '<g transform="translate('+x+','+y+') scale('+s+')">'+
      [0,60,120,180,240,300].map(function(a){
        return '<ellipse cx="0" cy="-9" rx="5" ry="9" fill="'+c+'" transform="rotate('+a+')"/>'; }).join('')+
      '<circle r="5" fill="#F2C14E"/></g>';
  }
  function fruit(x,y,c){ return '<circle cx="'+x+'" cy="'+y+'" r="9" fill="'+c+'"/>'+
    '<path d="M'+x+','+(y-9)+' l0,-5" stroke="#5C7A3E" stroke-width="2.4" stroke-linecap="round"/>'; }

  /* ================= film 1: Who Moves the Pollen ================= */
  var POLLEN = [
    { cap:'Every flower is waiting for a visitor.',
      say:'Hi, I am Buzz. Every flower you see is waiting for a visitor. It cannot walk to another flower, so it needs someone to come to it.',
      draw:function(){ return bloom(110,110,'#E9A0C4')+bloom(210,104,'#E9A0C4'); } },
    { cap:'Bees come for the nectar. Not for us.',
      say:'Bees come for the nectar — the sweet drink inside. They are not doing us a favour. They are getting their dinner.',
      draw:function(){ return bloom(110,110,'#E9A0C4')+bloom(210,104,'#E9A0C4')+bee(112,96,20); } },
    { cap:'Pollen sticks to them without them noticing.',
      say:'While they drink, yellow pollen sticks all over them. They do not even notice they are carrying it.',
      draw:function(){ return bloom(110,110,'#E9A0C4')+bloom(210,104,'#E9A0C4')+bee(112,96,20)+
        '<circle cx="104" cy="90" r="2.6" fill="#F2C14E"/><circle cx="120" cy="92" r="2.2" fill="#F2C14E"/>'+
        '<circle cx="112" cy="84" r="2" fill="#F2C14E"/>'; } },
    { cap:'They carry it to the next flower.',
      say:'Then off they go to the next flower, and some of that pollen rubs off. That is the whole trick.',
      draw:function(){ return bloom(110,110,'#E9A0C4')+bloom(210,104,'#E9A0C4')+bee(206,90,20)+
        '<path d="M126,96 Q165,66 196,88" stroke="#F2C14E" stroke-width="2.4" fill="none" stroke-dasharray="5 5"/>'+
        '<circle cx="200" cy="86" r="2.4" fill="#F2C14E"/><circle cx="214" cy="88" r="2.2" fill="#F2C14E"/>'; } },
    { cap:'And that is how a fruit starts.',
      say:'Once the pollen arrives, a seed can start to grow, and a fruit grows around it. No visit, no fruit.',
      draw:function(){ return bloom(110,110,'#E9A0C4')+fruit(210,104,'#E3612B'); } },
    { cap:'No pollinators, no apples. It is that direct.',
      say:'So when we plant flowers for bees and leave the spray in the shed, we are not being kind. We are keeping our own dinner growing.',
      draw:function(){ return fruit(110,110,'#E3612B')+fruit(210,104,'#E3612B')+bee(160,72,18); } }
  ];

  /* ================= film 2: Everybody Needs a Home ================= */
  function box(x,y,w,h,c){ return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="7" fill="'+c+'"/>'; }
  var HOME = [
    { cap:'Every animal needs four things.',
      say:'Hi, I am Buzz. Every animal alive needs the same four things. Not three. Four.',
      draw:function(){ return '<text x="180" y="104" font-size="30" text-anchor="middle">&#127968;</text>'; } },
    { cap:'Food. Water. Shelter. Space.',
      say:'Food to eat. Water to drink. Shelter to hide in. And space — room enough to find it all.',
      draw:function(){ return '<text x="112" y="86" font-size="24">&#127822;</text>'+
        '<text x="184" y="86" font-size="24">&#128167;</text>'+
        '<text x="112" y="132" font-size="24">&#127968;</text>'+
        '<text x="184" y="132" font-size="24">&#128506;</text>'; } },
    { cap:'A place with all four is a habitat.',
      say:'A place that has all four is called a habitat. Not a house. A habitat can be a pond, a log pile, or one good hedge.',
      draw:function(){ return box(96,88,148,54,'#7FA84E')+
        '<text x="126" y="122" font-size="22">&#128056;</text>'+
        '<text x="164" y="122" font-size="22">&#128029;</text>'+
        '<text x="202" y="122" font-size="22">&#128038;</text>'; } },
    { cap:'Take one away, and it stops working.',
      say:'Now watch. Take away just the water, and it does not matter how good the rest is. They have to leave.',
      draw:function(){ return box(96,88,148,54,'#A9B79A')+
        '<text x="164" y="122" font-size="22" opacity=".3">&#128029;</text>'+
        '<text x="200" y="82" font-size="20">&#10060;</text>'+
        '<text x="184" y="82" font-size="20">&#128167;</text>'; } },
    { cap:'Most of the time, the missing one is water.',
      say:'And here is the useful bit. In most gardens, the one that is missing is water — which happens to be the easiest of the four to add.',
      draw:function(){ return '<text x="160" y="112" font-size="40" text-anchor="middle">&#128167;</text>'; } },
    { cap:'A dish of water is a habitat you built.',
      say:'A shallow dish with stones in it. That is all. Put it out, and something will find it. Then you have not just learned about a habitat. You made one.',
      draw:function(){ return box(96,88,148,54,'#7FA84E')+
        '<text x="126" y="122" font-size="22">&#128056;</text>'+
        '<text x="164" y="122" font-size="22">&#128029;</text>'+
        '<text x="202" y="122" font-size="22">&#129419;</text>'+
        '<text x="160" y="80" font-size="20" text-anchor="middle">&#128167;</text>'; } }
  ];

  var SKY = { pollen:'linear-gradient(#E7F0FA,#EFF6E7 62%)', home:'linear-gradient(#E4F1FA,#EAF4E6 62%)' };

  function player(SCENES, sky){
    return function mount(host, guideName, guideImg){
      if (!host) return;
      injectCSS();
      var i = 0, playing = false;

      host.innerHTML =
        '<div class="pmv" style="background:'+sky+'">'+
          '<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid meet"></svg>'+
          '<div class="pmv-guide"><img src="'+(guideImg||'img/guide-buzz.png')+'" alt="'+(guideName||'Buzz')+'"></div>'+
          '<div class="pmv-dots">'+ SCENES.map(function(){ return '<i></i>'; }).join('') +'</div>'+
          '<div class="pmv-ctl"><button data-a="replay">Start again</button></div>'+
          '<div class="pmv-cap"></div>'+
          '<div class="pmv-start"><div>&#9654;&nbsp; Watch '+(guideName||'Buzz')+' explain</div></div>'+
        '</div>';

      var root = host.querySelector('.pmv');
      var svg  = root.querySelector('svg');
      var cap  = root.querySelector('.pmv-cap');
      var dots = root.querySelectorAll('.pmv-dots i');
      var start= root.querySelector('.pmv-start');

      var MIN_SCENE = 2600, sceneAt = 0;

      function paint(){
        var sc = SCENES[i];
        svg.innerHTML = sc.draw();
        cap.textContent = sc.cap;
        for (var d=0; d<dots.length; d++) dots[d].classList.toggle('on', d <= i);
      }
      function advance(){
        if (!playing) return;
        /* A scene has to stay up long enough to read. Where audio is
           blocked until the first tap, the speech API reports the line
           as finished immediately and the whole film raced past. */
        var since = Date.now() - sceneAt;
        if (since < MIN_SCENE){ setTimeout(advance, MIN_SCENE - since); return; }
        if (i >= SCENES.length - 1){ playing = false; if (lipStop){ lipStop(); lipStop = null; } return; }
        i++; paint(); narrate();
      }
      function narrate(){
        sceneAt = Date.now();
        if (global.TGLip && lipImg){ if (lipStop) lipStop(); lipStop = TGLip.start(lipImg); }
        var sc = SCENES[i];
        if (global.TGAudio && TGAudio.supported && TGAudio.enabled())
          TGAudio.sayThen(sc.say, advance, 4200);
        else setTimeout(advance, 4000);
      }
      function play(){ start.style.display='none'; playing = true; i = 0; paint(); narrate(); }

      start.onclick = play;
      root.querySelector('[data-a="replay"]').onclick = function(){
        if (global.TGAudio) TGAudio.stop(); play();
      };
      root.onclick = function(e){
        if (!playing || e.target.closest('button')) return;
        if (global.TGAudio) TGAudio.stop();
        advance();
      };
      paint();
    };
  }

  global.TGMovies = global.TGMovies || {};
  global.TGMovies.pollinators = { mount: player(POLLEN, SKY.pollen), scenes: POLLEN.length };
  global.TGMovies.habitat     = { mount: player(HOME,   SKY.home),   scenes: HOME.length };
})(window);

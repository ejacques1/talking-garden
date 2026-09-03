/* ------------------------------------------------------------------
   "Wiggles explains" — the two Soil films
   ------------------------------------------------------------------
   Reuses the Protect player, so there is one film engine rather than
   three. Only the scenes differ.
------------------------------------------------------------------- */
(function (global) {

  function band(y,h,c){ return '<rect x="40" y="'+y+'" width="240" height="'+h+'" fill="'+c+'"/>'; }
  function at(x,y,ch,s){ return '<text x="'+x+'" y="'+y+'" font-size="'+(s||22)+'" text-anchor="middle">'+ch+'</text>'; }

  /* ---- What Compost Eats ---- */
  var COMPOST = [
    { cap:'This is a banana peel. Watch it.',
      say:'Hi, I am Wiggles. This is a banana peel. Most people call it rubbish. Give me twelve weeks and I will show you what it really is.',
      draw:function(){ return at(160,110,'&#127820;',44); } },
    { cap:'Something alive comes to eat it.',
      say:'The moment it lands, things arrive. Bacteria you cannot see. Fungi. Then bugs, and then me.',
      draw:function(){ return at(160,108,'&#127820;',40)+at(118,86,'&#129440;',18)+at(204,90,'&#129440;',18)+at(160,142,'&#129713;',20); } },
    { cap:'They are eating. That is all decomposing is.',
      say:'Decomposing sounds complicated. It is not. It is a lot of small things eating, and the pile gets warm because of it.',
      draw:function(){ return at(160,108,'&#127820;',32)+at(120,90,'&#129440;',18)+at(202,94,'&#129440;',18)+
        at(160,142,'&#129713;',22)+at(250,80,'&#127777;',24); } },
    { cap:'Soft things go first. Woody things take months.',
      say:'The soft wet things vanish in days. A dry twig can still be there months later. That is why gardeners mix wet greens with dry browns.',
      draw:function(){ return at(112,112,'&#129388;',20)+at(160,112,'&#127810;',26)+at(212,110,'&#129717;',30); } },
    { cap:'And what is left is soil.',
      say:'What you are left with is dark, crumbly, and smells like a forest floor. That is compost, and plants grow better in it than in anything you can buy.',
      draw:function(){ return band(96,44,'#5C4025')+at(160,128,'&#129704;',26); } },
    { cap:'Rubbish in one end. Soil out the other.',
      say:'So nothing was thrown away. It went round. That peel is going to be a tomato, and it never left your garden.',
      draw:function(){ return band(112,32,'#5C4025')+at(160,100,'&#127813;',30)+at(160,66,'&#9851;',22); } }
  ];

  /* ---- Under Your Feet ---- */
  var LAYERS = [
    { cap:'Soil is not dirt. It has layers.',
      say:'Hi, I am Wiggles. People say dirt like it is one thing. It is not. Dig down and it changes, over and over.',
      draw:function(){ return band(60,24,'#8B6B3E')+band(84,32,'#5C4025')+band(116,26,'#8A6642')+band(142,22,'#9A8B7A'); } },
    { cap:'The top is only this year.',
      say:'The very top is just this year. Leaves, twigs, whatever fell. Come back in a season and it will have joined the layer below.',
      draw:function(){ return band(60,24,'#8B6B3E')+band(84,32,'#5C4025')+band(116,26,'#8A6642')+band(142,22,'#9A8B7A')+
        at(160,78,'&#127810;',18)+'<text x="292" y="76" font-size="10" text-anchor="end" fill="#16283A" font-family="Nunito">this year</text>'; } },
    { cap:'Under it: topsoil. Everything grows here.',
      say:'Under that is topsoil. Dark, crumbly and completely alive. Almost every root you have ever seen was in this one layer.',
      draw:function(){ return band(60,24,'#8B6B3E')+band(84,32,'#3F2C19')+band(116,26,'#8A6642')+band(142,22,'#9A8B7A')+
        at(130,106,'&#129713;',16)+at(190,104,'&#127793;',18); } },
    { cap:'An inch of it takes about five hundred years.',
      say:'And here is the part that stops people. One inch of topsoil takes something like five hundred years to make. One inch.',
      draw:function(){ return band(60,24,'#8B6B3E')+band(84,32,'#3F2C19')+band(116,26,'#8A6642')+band(142,22,'#9A8B7A')+
        '<text x="160" y="106" font-size="15" text-anchor="middle" fill="#fff" font-family="Nunito" font-weight="800">500 YEARS</text>'; } },
    { cap:'Rain can take it away in an afternoon.',
      say:'And if the ground is bare, a single heavy rain can wash it down the hill in an afternoon. Five hundred years, gone in one storm.',
      draw:function(){ return band(60,20,'#8B6B3E')+band(80,14,'#3F2C19')+band(94,44,'#8A6642')+band(138,26,'#9A8B7A')+
        at(120,58,'&#128167;',16)+at(180,52,'&#128167;',16)+at(150,46,'&#128167;',16); } },
    { cap:'Which is why we cover it.',
      say:'That is the whole reason gardeners mulch, and plant cover crops, and hate bare ground. Roots hold it. Nothing else does.',
      draw:function(){ return band(60,24,'#7FA84E')+band(84,32,'#3F2C19')+band(116,26,'#8A6642')+band(142,22,'#9A8B7A')+
        at(120,76,'&#127807;',18)+at(160,74,'&#127807;',18)+at(200,76,'&#127807;',18); } }
  ];

  /* A minimal copy of the Protect player, kept here so this file works
     even if load order changes. */
  function makeMount(SCENES){
    return function (host, guideName, guideImg){
      if (!host) return;
      host.innerHTML =
        '<div class="pmv" style="background:linear-gradient(#EFE7DC,#EAF1E5 62%)">'+
          '<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid meet"></svg>'+
          '<div class="pmv-guide"><img src="'+(guideImg||'img/guide-wiggles.png')+'" alt="'+(guideName||'Wiggles')+'"></div>'+
          '<div class="pmv-dots">'+ SCENES.map(function(){ return '<i></i>'; }).join('') +'</div>'+
          '<div class="pmv-ctl"><button data-a="replay">Start again</button></div>'+
          '<div class="pmv-cap"></div>'+
          '<div class="pmv-start"><div>&#9654;&nbsp; Watch '+(guideName||'Wiggles')+' explain</div></div>'+
        '</div>';
      var root = host.querySelector('.pmv'), svg = root.querySelector('svg');
      var cap = root.querySelector('.pmv-cap'), dots = root.querySelectorAll('.pmv-dots i');
      var start = root.querySelector('.pmv-start'), i = 0, playing = false;
      var lipImg = root.querySelector('.pmv-guide img'), lipStop = null;

      var MIN_SCENE = 2600, sceneAt = 0;

      function paint(){
        svg.innerHTML = SCENES[i].draw();
        cap.textContent = SCENES[i].cap;
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
        if (global.TGAudio && TGAudio.supported && TGAudio.enabled())
          TGAudio.sayThen(SCENES[i].say, advance, 4400);
        else setTimeout(advance, 4200);
      }
      function play(){ start.style.display='none'; playing = true; i = 0; paint(); narrate(); }
      start.onclick = play;
      root.querySelector('[data-a="replay"]').onclick = function(){
        if (global.TGAudio) TGAudio.stop(); play(); };
      root.onclick = function(e){
        if (!playing || e.target.closest('button')) return;
        if (global.TGAudio) TGAudio.stop(); advance(); };
      paint();
    };
  }

  global.TGMovies = global.TGMovies || {};
  global.TGMovies.compost    = { scenes: COMPOST.length, mount: makeMount(COMPOST) };
  global.TGMovies.soillayers = { scenes: LAYERS.length,  mount: makeMount(LAYERS) };
})(window);

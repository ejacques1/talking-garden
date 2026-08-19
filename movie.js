/* ------------------------------------------------------------------
   The garden movie — an animated explainer, drawn in code
   ------------------------------------------------------------------
   BrainPOP opens every topic with a short animated film. This is ours:
   Sunny narrating the plant life cycle over an SVG scene that grows as
   he talks. No footage, no studio, no files to host — which means it
   exists today rather than waiting on a filming day.

   Six scenes with pause points between them, like BrainPOP's. It
   auto-advances when the narration finishes, and a child can tap
   through at their own pace. Ms. Nia's real garden film can sit
   alongside this later; it does not replace it.
------------------------------------------------------------------- */
(function (global) {

  var SCENES = [
    { key:'seed',
      cap:'This is a seed.',
      say:'This is a seed. It does not look like much. But everything I am is already curled up inside it.' },
    { key:'roots',
      cap:'First come the roots.',
      say:'First come the roots. They push down into the dark, drinking up water and holding me steady.' },
    { key:'shoot',
      cap:'Then a shoot pushes up.',
      say:'Then a little shoot pushes up through the soil, reaching for the light.' },
    { key:'leaves',
      cap:'Leaves catch the sunshine.',
      say:'My leaves open wide and catch the sunshine, and turn it into food. That is my superpower.' },
    { key:'flower',
      cap:'And then — a flower!',
      say:'And then a flower opens. That is me, Sunny! Bees come to visit, and they help me make seeds.' },
    { key:'seeds',
      cap:'The seeds fall, and it starts again.',
      say:'My seeds drop down into the soil. And then the whole thing begins all over again.' }
  ];

  var CSS = ''+
  '.tgm{position:relative;width:100%;height:100%;background:linear-gradient(#DCEDF7,#EAF4E6 62%);overflow:hidden}'+
  '.tgm svg{display:block;width:100%;height:100%}'+
  '.tgm .g{opacity:0;transition:opacity .5s ease, transform .8s cubic-bezier(.2,.8,.3,1)}'+
  '.tgm .g.on{opacity:1}'+
  '.tgm .grow{transform:scaleY(0);transform-origin:160px 158px}'+
  '.tgm .grow.on{transform:scaleY(1)}'+
  '.tgm .rootg{transform:scaleY(0);transform-origin:160px 160px}'+
  '.tgm .rootg.on{transform:scaleY(1)}'+
  '.tgm .leaf{transform:scale(0);transform-origin:160px 120px}'+
  '.tgm .leaf.on{transform:scale(1)}'+
  '.tgm .bloom{transform:scale(0);transform-origin:160px 78px}'+
  '.tgm .bloom.on{transform:scale(1)}'+
  '.tgm .fall{animation:tgmFall 2.4s ease-in infinite}'+
  '@keyframes tgmFall{0%{transform:translate(0,0);opacity:0}20%{opacity:1}100%{transform:translate(-14px,74px);opacity:0}}'+
  '.tgm .fall2{animation-delay:.8s}.tgm .fall3{animation-delay:1.5s}'+
  '.tgm-cap{position:absolute;left:0;right:0;bottom:0;padding:14px 16px;background:linear-gradient(transparent,rgba(31,35,32,.82));'+
    'color:#fff;font-family:Fraunces,Georgia,serif;font-size:19px;line-height:1.25;text-shadow:0 1px 3px rgba(0,0,0,.4)}'+
  '.tgm-dots{position:absolute;top:12px;left:14px;display:flex;gap:5px;z-index:3}'+
  '.tgm-dots i{width:20px;height:4px;border-radius:99px;background:rgba(255,255,255,.55);display:block}'+
  '.tgm-dots i.on{background:#F2B233}'+
  '.tgm-ctl{position:absolute;top:10px;right:12px;display:flex;gap:6px;z-index:3}'+
  '.tgm-ctl button{border:none;border-radius:99px;background:rgba(255,255,255,.9);cursor:pointer;'+
    'font-family:Inter,sans-serif;font-size:12.5px;font-weight:600;padding:6px 12px;color:#1F2320}'+
  '.tgm-start{position:absolute;inset:0;display:grid;place-items:center;z-index:4;background:rgba(31,35,32,.34);cursor:pointer}'+
  '.tgm-start div{background:#fff;border-radius:99px;padding:13px 24px;font-family:Inter,sans-serif;'+
    'font-weight:700;font-size:15px;color:#33512F;box-shadow:0 6px 20px rgba(0,0,0,.25)}'+
  '@media (prefers-reduced-motion:reduce){.tgm .g,.tgm .grow,.tgm .leaf,.tgm .bloom{transition:none}.tgm .fall{animation:none}}';

  function petals(cx, cy, r){
    var out=''; for(var i=0;i<12;i++){
      out += '<ellipse cx="'+cx+'" cy="'+(cy-r)+'" rx="'+(r*0.36)+'" ry="'+(r*0.72)+'" '+
             'fill="'+(i%2?'#F2B233':'#F7C34E')+'" transform="rotate('+(30*i)+' '+cx+' '+cy+')"/>';
    } return out;
  }

  function scene(){
    return '<svg viewBox="0 0 320 220" role="img" aria-label="How a plant grows">'+
      '<circle cx="278" cy="36" r="20" fill="#F7C34E"/>'+
      '<g stroke="#F7C34E" stroke-width="3" stroke-linecap="round">'+
        '<path d="M278,6 L278,-2"/><path d="M304,20 L311,15"/><path d="M304,52 L311,57"/><path d="M252,20 L245,15"/>'+
      '</g>'+
      '<rect x="0" y="150" width="320" height="70" fill="#6B5640"/>'+
      '<rect x="0" y="150" width="320" height="7" fill="#5A4634"/>'+

      '<g class="g rootg" id="tgm-roots">'+
        '<path d="M160,160 C154,176 146,184 138,196" stroke="#EFE2CE" stroke-width="3" fill="none" stroke-linecap="round"/>'+
        '<path d="M160,160 C166,178 174,186 182,198" stroke="#EFE2CE" stroke-width="3" fill="none" stroke-linecap="round"/>'+
        '<path d="M160,160 L160,204" stroke="#EFE2CE" stroke-width="3" fill="none" stroke-linecap="round"/>'+
      '</g>'+

      '<g class="g" id="tgm-seed"><ellipse cx="160" cy="160" rx="8" ry="6" fill="#7A5230"/></g>'+

      '<g class="g grow" id="tgm-stem">'+
        '<path d="M160,158 L160,86" stroke="#4F7C4A" stroke-width="6" stroke-linecap="round" fill="none"/>'+
      '</g>'+

      '<g class="g leaf" id="tgm-leaves">'+
        '<path d="M160,124 C140,118 128,124 124,134 C140,140 154,134 160,126 Z" fill="#5C8F56"/>'+
        '<path d="M160,110 C180,104 192,110 196,120 C180,126 166,120 160,112 Z" fill="#4F7C4A"/>'+
      '</g>'+

      '<g class="g bloom" id="tgm-flower">'+
        petals(160,78,26)+
        '<circle cx="160" cy="78" r="16" fill="#7A5230"/>'+
        '<circle cx="160" cy="78" r="12.5" fill="#8A5E38"/>'+
        '<ellipse cx="154" cy="76" rx="3.6" ry="4" fill="#fff"/><ellipse cx="166" cy="76" rx="3.6" ry="4" fill="#fff"/>'+
        '<circle cx="154.6" cy="77" r="2" fill="#2B1D12"/><circle cx="166.6" cy="77" r="2" fill="#2B1D12"/>'+
        '<path d="M154,85 Q160,90 166,85" stroke="#2B1D12" stroke-width="2" fill="none" stroke-linecap="round"/>'+
      '</g>'+

      '<g class="g" id="tgm-seeds">'+
        '<ellipse class="fall"  cx="176" cy="92" rx="3.4" ry="2.6" fill="#5A4634"/>'+
        '<ellipse class="fall fall2" cx="182" cy="88" rx="3.4" ry="2.6" fill="#5A4634"/>'+
        '<ellipse class="fall fall3" cx="170" cy="94" rx="3.4" ry="2.6" fill="#5A4634"/>'+
      '</g>'+
    '</svg>';
  }

  var VISIBLE = {
    seed:   ['tgm-seed'],
    roots:  ['tgm-seed','tgm-roots'],
    shoot:  ['tgm-seed','tgm-roots','tgm-stem'],
    leaves: ['tgm-seed','tgm-roots','tgm-stem','tgm-leaves'],
    flower: ['tgm-seed','tgm-roots','tgm-stem','tgm-leaves','tgm-flower'],
    seeds:  ['tgm-seed','tgm-roots','tgm-stem','tgm-leaves','tgm-flower','tgm-seeds']
  };

  function injectCSS(){
    if (document.getElementById('tgm-css')) return;
    var st=document.createElement('style'); st.id='tgm-css'; st.textContent=CSS;
    document.head.appendChild(st);
  }

  global.TGMovie = {
    mount: function (host){
      if (!host) return;
      injectCSS();
      var i = 0, playing = false;

      host.innerHTML =
        '<div class="tgm">'+ scene() +
          '<div class="tgm-dots">'+ SCENES.map(function(){ return '<i></i>'; }).join('') +'</div>'+
          '<div class="tgm-ctl"><button data-a="replay">Start again</button></div>'+
          '<div class="tgm-cap"></div>'+
          '<div class="tgm-start"><div>&#9654;&nbsp; Watch Sunny explain</div></div>'+
        '</div>';

      var root = host.querySelector('.tgm');
      var cap  = root.querySelector('.tgm-cap');
      var dots = root.querySelectorAll('.tgm-dots i');
      var start= root.querySelector('.tgm-start');

      function paint(){
        var sc = SCENES[i], on = VISIBLE[sc.key];
        ['tgm-seed','tgm-roots','tgm-stem','tgm-leaves','tgm-flower','tgm-seeds'].forEach(function(id){
          var el = root.querySelector('#'+id);
          if (el) el.classList.toggle('on', on.indexOf(id) > -1);
        });
        cap.textContent = sc.cap;
        for (var d=0; d<dots.length; d++) dots[d].classList.toggle('on', d <= i);
      }

      function advance(){
        if (!playing) return;
        if (i >= SCENES.length - 1){ playing = false; return; }
        i++; paint(); narrate();
      }

      function narrate(){
        var sc = SCENES[i];
        if (global.TGAudio && TGAudio.supported && TGAudio.enabled())
          TGAudio.sayThen(sc.say, advance, 3200);
        else
          setTimeout(advance, 3000);
      }

      function play(){
        start.style.display='none';
        playing = true; i = 0; paint(); narrate();
      }

      start.onclick = play;
      root.querySelector('[data-a="replay"]').onclick = function(){
        if (global.TGAudio) TGAudio.stop();
        play();
      };
      /* Tap the picture to jump ahead at your own pace. */
      root.querySelector('svg').onclick = function(){
        if (!playing) return;
        if (global.TGAudio) TGAudio.stop();
        advance();
      };

      i = 0; paint();
    },
    scenes: SCENES.length
  };
})(window);

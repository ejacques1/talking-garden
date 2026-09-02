/* ------------------------------------------------------------------
   Dewey the Dew Drop — DewLab's guide
   ------------------------------------------------------------------
   Drawn as inline SVG so he scales from a 44px avatar to a full
   illustration with nothing to host, and changes expression in code.

   Built to match DHCG's character sheet as closely as flat vector
   allows. The cuteness lives in five things, in this order:
     1. eyes about a third of the face, set wide and low
     2. eyebrows on EVERY expression, floating high
     3. an open mouth with a tongue, not a drawn line
     4. a small nose bump between the eyes
     5. a heavy round body with a fine, slightly curved tip

   Outfit is the lab coat with collar, lapels, buttons and the DewLab
   logo, a green shirt at the neck, a two-strap backpack, blue gloves,
   striped socks and green high-tops.

   Expressions: happy · wink · thinking · excited · curious · thankful
   There is deliberately no sad face — after a wrong answer a child
   sees "thinking", never disappointment.
------------------------------------------------------------------- */
(function (global) {

  var C = {
    body:'#3FA9E8', bodyMid:'#2E97D8', bodyDk:'#1B7FBE', shine:'#A5DDF9',
    brand:'#0071BC', green:'#639245', greenDk:'#4E7635', greenLt:'#7FAE5F',
    coat:'#FFFFFF', coatSh:'#DCE8F0', coatLn:'#C3D4E0',
    ink:'#123A57', mouth:'#0E2E45', tongue:'#F08098',
    blush:'#E3612B', glove:'#2E97D8'
  };

  /* ---------- eyes: big, wide, low ---------- */
  function eyes(kind){
    var L=50, R=80, cy=94, rx=14, ry=16;      // large, set wide, low on the face
    if (kind === 'wink'){
      return lid(L,cy,rx) +
        '<ellipse cx="'+L+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="#fff"/>'+
        pupil(L,cy) + lid(R,cy,rx) +
        '<path d="M'+(R-12)+','+cy+' q12,-10 24,0" fill="none" stroke="'+C.ink+'" stroke-width="4.4" stroke-linecap="round"/>';
    }
    if (kind === 'thankful'){
      return '<path d="M'+(L-12)+','+(cy+1)+' q12,-11 24,0" fill="none" stroke="'+C.ink+'" stroke-width="4.4" stroke-linecap="round"/>'+
             '<path d="M'+(R-12)+','+(cy+1)+' q12,-11 24,0" fill="none" stroke="'+C.ink+'" stroke-width="4.4" stroke-linecap="round"/>';
    }
    var look = (kind==='thinking'||kind==='curious') ? -3 : 0;
    var big  = (kind==='excited') ? 1.12 : 1;
    return lid(L,cy,rx) + lid(R,cy,rx) +
      '<ellipse cx="'+L+'" cy="'+cy+'" rx="'+(rx*big)+'" ry="'+(ry*big)+'" fill="#fff"/>'+
      '<ellipse cx="'+R+'" cy="'+cy+'" rx="'+(rx*big)+'" ry="'+(ry*big)+'" fill="#fff"/>'+
      pupil(L,cy+look) + pupil(R,cy+look);
  }
  /* the dark lash line above each eye — small detail, lot of life */
  function lid(cx,cy,rx){
    return '<path d="M'+(cx-rx-1)+','+(cy-6)+' q'+(rx+1)+',-11 '+(2*rx+2)+',0" fill="none" '+
           'stroke="'+C.ink+'" stroke-width="2.4" stroke-linecap="round" opacity=".55"/>';
  }
  function pupil(cx,cy){
    return '<circle cx="'+cx+'" cy="'+(cy+1)+'" r="7.2" fill="'+C.ink+'"/>'+
           '<circle cx="'+(cx+2.6)+'" cy="'+(cy-2.4)+'" r="3.1" fill="#fff"/>'+
           '<circle cx="'+(cx-3)+'" cy="'+(cy+3.4)+'" r="1.5" fill="#fff" opacity=".8"/>';
  }

  /* ---------- brows: on every face ---------- */
  function brows(kind){
    var y = 71, tilt = 0, lift = 0;
    if (kind==='thinking'){ tilt = 5; }
    if (kind==='curious'){ lift = -3; }
    if (kind==='excited'){ lift = -4; }
    return '<path d="M36,'+(y+tilt+lift)+' q14,-10 28,-2" fill="none" stroke="'+C.ink+'" stroke-width="5" stroke-linecap="round"/>'+
           '<path d="M66,'+(y-2+lift)+' q14,-8 28,'+(2+tilt)+'" fill="none" stroke="'+C.ink+'" stroke-width="5" stroke-linecap="round"/>';
  }

  /* ---------- mouths: open, with a tongue ---------- */
  function mouth(kind){
    if (kind==='excited')
      return '<path d="M48,118 q17,27 34,0 q-17,8 -34,0 Z" fill="'+C.mouth+'"/>'+
             '<path d="M57,130 q8,10 16,0 q-8,-5 -16,0 Z" fill="'+C.tongue+'"/>';
    if (kind==='curious')
      return '<ellipse cx="65" cy="122" rx="8" ry="9.5" fill="'+C.mouth+'"/>'+
             '<ellipse cx="65" cy="126" rx="5" ry="4.4" fill="'+C.tongue+'"/>';
    if (kind==='thinking')
      return '<path d="M56,122 q10,5 19,-2" fill="none" stroke="'+C.mouth+'" stroke-width="4" stroke-linecap="round"/>';
    if (kind==='thankful')
      return '<path d="M52,120 q13,14 26,0 q-13,6 -26,0 Z" fill="'+C.mouth+'"/>';
    if (kind==='wink')
      return '<path d="M50,119 q15,18 30,0 q-15,7 -30,0 Z" fill="'+C.mouth+'"/>'+
             '<path d="M58,128 q7,8 14,0 q-7,-4 -14,0 Z" fill="'+C.tongue+'"/>';
    /* happy */
    return '<path d="M49,118 q16,21 32,0 q-16,8 -32,0 Z" fill="'+C.mouth+'"/>'+
           '<path d="M47,102 q7,8 14,0 q-7,-4 -14,0 Z" fill="'+C.tongue+'"/>';
  }

  function prop(kind){
    if (kind==='curious')
      return '<g class="dewey-prop">'+
        '<circle cx="104" cy="120" r="15" fill="#CFE9F8" opacity=".5"/>'+
        '<circle cx="104" cy="120" r="15" fill="none" stroke="#8A93A0" stroke-width="4.5"/>'+
        '<path d="M114,131 L125,144" stroke="#7A5230" stroke-width="6" stroke-linecap="round"/>'+
      '</g>';
    if (kind==='thinking')
      return '<circle cx="102" cy="64" r="4.5" fill="#fff" opacity=".9"/>'+
             '<circle cx="113" cy="50" r="7" fill="#fff" opacity=".9"/>';
    return '';
  }

  function svg(expr, size){
    var e = ['happy','wink','thinking','excited','curious','thankful'].indexOf(expr) > -1 ? expr : 'happy';
    var waving = (e==='happy' || e==='excited');
    var uid = 'dw'+Math.random().toString(36).slice(2,8);
    return '<svg class="dewey dewey-'+e+'" viewBox="0 0 140 232" width="'+size+'" height="'+(size*232/140)+'" '+
           'role="img" aria-label="Dewey the Dew Drop">'+
      '<defs>'+
        '<radialGradient id="'+uid+'b" cx="36%" cy="30%" r="78%">'+
          '<stop offset="0" stop-color="'+C.shine+'"/>'+
          '<stop offset="55%" stop-color="'+C.body+'"/>'+
          '<stop offset="100%" stop-color="'+C.bodyDk+'"/>'+
        '</radialGradient>'+
      '</defs>'+
      '<g class="dewey-bob">'+

        /* ---- legs, striped socks, high-tops ---- */
        '<path d="M52,186 L52,200" stroke="'+C.bodyMid+'" stroke-width="9" stroke-linecap="round"/>'+
        '<path d="M84,186 L84,200" stroke="'+C.bodyMid+'" stroke-width="9" stroke-linecap="round"/>'+
        '<rect x="47" y="192" width="10" height="4" rx="2" fill="#fff"/>'+
        '<rect x="79" y="192" width="10" height="4" rx="2" fill="#fff"/>'+
        '<rect x="47" y="198" width="10" height="4" rx="2" fill="#fff"/>'+
        '<rect x="79" y="198" width="10" height="4" rx="2" fill="#fff"/>'+
        '<path d="M40,218 q0,-15 13,-15 h6 q6,0 6,8 v7 z" fill="'+C.green+'"/>'+
        '<path d="M72,218 q0,-15 13,-15 h6 q6,0 6,8 v7 z" fill="'+C.green+'"/>'+
        '<rect x="40" y="214" width="25" height="6" rx="3" fill="#fff"/>'+
        '<rect x="72" y="214" width="25" height="6" rx="3" fill="#fff"/>'+
        '<path d="M50,208 h11 M50,212 h11" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>'+
        '<path d="M82,208 h11 M82,212 h11" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>'+

        /* ---- backpack behind him, both straps ---- */
        '<path d="M22,138 q-10,13 -6,32 q11,5 18,-2 z" fill="'+C.greenDk+'"/>'+
        '<path d="M108,138 q10,13 6,32 q-11,5 -18,-2 z" fill="'+C.greenDk+'"/>'+

        /* ---- the drop: heavy body, fine curved tip ---- */
        '<path d="M65,34 C65,36 63,46 56,58 C40,76 25,86 25,102 a40,40 0 0 0 80,0 '+
               'C105,86 90,76 74,58 C67,47 65,37 65,34 Z" fill="url(#'+uid+'b)"/>'+
        '<path d="M58,56 C46,74 36,88 36,102 a29,29 0 0 0 11,23 C34,108 38,78 58,56 Z" fill="#fff" opacity=".30"/>'+
        '<ellipse cx="47" cy="82" rx="10" ry="13" fill="#fff" opacity=".40" transform="rotate(-20 47 82)"/>'+

        /* ---- green shirt at the neck ---- */
        '<path d="M53,140 q12,13 24,0 v15 h-24 z" fill="'+C.green+'"/>'+

        /* ---- lab coat: lapels, buttons, sleeves ---- */
        '<path d="M30,144 q14,11 30,13 v30 q-18,4 -32,-2 z" fill="'+C.coat+'"/>'+
        '<path d="M100,144 q-14,11 -30,13 v30 q18,4 32,-2 z" fill="'+C.coat+'"/>'+
        '<path d="M30,144 q14,11 30,13 l-9,11 q-16,-7 -22,-17 z" fill="'+C.coatSh+'"/>'+
        '<path d="M100,144 q-14,11 -30,13 l9,11 q16,-7 22,-17 z" fill="'+C.coatSh+'"/>'+
        '<path d="M65,157 v28" stroke="'+C.coatLn+'" stroke-width="2"/>'+
        '<circle cx="70" cy="167" r="2.4" fill="'+C.coatLn+'"/>'+
        '<circle cx="70" cy="176" r="2.4" fill="'+C.coatLn+'"/>'+
        /* chest pocket with the DewLab mark */
        '<rect x="76" y="162" width="18" height="15" rx="2" fill="'+C.coat+'" stroke="'+C.coatLn+'" stroke-width="1.4"/>'+
        '<path d="M81,172 q3.5,-7 7,0 q-3.5,3 -7,0 z" fill="'+C.green+'"/>'+
        '<circle cx="84.5" cy="167" r="2.5" fill="'+C.brand+'"/>'+

        /* ---- face ---- */
        brows(e) + eyes(e) +
        '<ellipse cx="65" cy="108" rx="6" ry="5" fill="'+C.bodyDk+'" opacity=".26"/>'+  /* nose bump */
        mouth(e) +
        '<ellipse cx="34" cy="112" rx="8" ry="5" fill="'+C.blush+'" opacity=".26"/>'+
        '<ellipse cx="96" cy="112" rx="8" ry="5" fill="'+C.blush+'" opacity=".26"/>'+

        /* ---- waving arm with sleeve and glove ---- */
        '<g class="'+(waving ? 'dewey-wave' : '')+'">'+
          '<path d="M100,150 q17,-15 21,-36" stroke="'+C.coat+'" stroke-width="13" stroke-linecap="round" fill="none"/>'+
          '<path d="M113,128 q8,-9 8,-15" stroke="'+C.glove+'" stroke-width="11" stroke-linecap="round" fill="none"/>'+
          '<circle cx="122" cy="106" r="10.5" fill="'+C.glove+'"/>'+
          '<path d="M118,98 v-7 M123,96 v-8 M128,98 v-6" stroke="'+C.glove+'" stroke-width="4.5" stroke-linecap="round"/>'+
        '</g>'+
        prop(e) +
      '</g>'+
    '</svg>';
  }

  var CSS =
  '.dewey{display:block;overflow:visible}'+
  '.dewey-bob{transform-origin:70px 218px;animation:deweyBob 4.2s ease-in-out infinite}'+
  '@keyframes deweyBob{0%,100%{transform:translateY(0) rotate(-1.4deg)}50%{transform:translateY(-5px) rotate(1.4deg)}}'+
  '.dewey-wave{transform-origin:102px 150px;animation:deweyWave 1.1s ease-in-out 3}'+
  '@keyframes deweyWave{0%,100%{transform:rotate(0)}30%{transform:rotate(-22deg)}70%{transform:rotate(14deg)}}'+
  '.dewey-excited .dewey-bob{animation:deweyHop .68s ease-in-out 2}'+
  '@keyframes deweyHop{0%,100%{transform:translateY(0)}42%{transform:translateY(-11px)}}'+
  '.dewey-prop{transform-origin:104px 120px;animation:deweyPeer 2.8s ease-in-out infinite}'+
  '@keyframes deweyPeer{0%,100%{transform:translate(0,0)}50%{transform:translate(-6px,5px)}}'+
  '@media (prefers-reduced-motion:reduce){.dewey-bob,.dewey-wave,.dewey-prop{animation:none}}'+
  '.dewey-row{display:flex;align-items:flex-start;gap:14px}'+
  '.dewey-row .dewey{flex:none}'+
  '.dewey-bubble{position:relative;background:#fff;border:2px solid var(--line,#E4E0D8);'+
    'border-radius:18px;padding:12px 16px;font-size:15px;line-height:1.45;color:var(--ink,#16283A);max-width:22em}'+
  '.dewey-bubble::after{content:"";position:absolute;left:-9px;top:22px;width:14px;height:14px;background:#fff;'+
    'border-left:2px solid var(--line,#E4E0D8);border-bottom:2px solid var(--line,#E4E0D8);transform:rotate(45deg)}';

  function injectCSS(){
    if (document.getElementById('dewey-css')) return;
    var s=document.createElement('style'); s.id='dewey-css'; s.textContent=CSS;
    document.head.appendChild(s);
  }

  global.Dewey = {
    expressions: ['happy','wink','thinking','excited','curious','thankful'],
    html: function(expr,size){ injectCSS(); return svg(expr||'happy', size||100); },
    el: function(expr,size){
      injectCSS();
      var d=document.createElement('div'); d.innerHTML=svg(expr||'happy', size||100);
      return d.firstChild;
    },
    say: function(text,expr,size){
      injectCSS();
      return '<div class="dewey-row">'+svg(expr||'happy', size||78)+
             '<div class="dewey-bubble">'+text+'</div></div>';
    }
  };

  if (document.readyState !== 'loading') injectCSS();
  else document.addEventListener('DOMContentLoaded', injectCSS);
})(window);

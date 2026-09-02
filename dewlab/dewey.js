/* ------------------------------------------------------------------
   Dewey the Dew Drop — DewLab's guide
   ------------------------------------------------------------------
   Drawn as inline SVG rather than image files, so he scales from a
   40px avatar to a full illustration with nothing to host, loads
   instantly, and changes expression in code.

   The six expressions are the ones on DHCG's character sheet:
   happy · wink · thinking · excited · curious · thankful

   Dewey.html(expression, size)  -> markup string
   Dewey.el(expression, size)    -> an <svg> element
   Dewey.say(text, expression)   -> Dewey with a speech bubble

   A note on what is missing: no sad face, and no frown. After a wrong
   answer a child sees "thinking", never disappointment — children read
   a frown as having let the character down.
------------------------------------------------------------------- */
(function (global) {

  var C = {
    body:   '#3FA9E8',   /* dewey blue, lighter than brand blue so he reads on it */
    bodyD:  '#0071BC',   /* DHCG brand blue                                       */
    shine:  '#8FD3F7',
    coat:   '#FFFFFF',
    coatSh: '#E3EDF3',
    pack:   '#639245',   /* DHCG green                                            */
    packD:  '#4A6E33',
    shoe:   '#639245',
    ink:    '#0E3550',
    blush:  '#E3612B'
  };

  function eyes(kind){
    if (kind === 'wink')
      return '<ellipse cx="42" cy="60" rx="7" ry="8" fill="#fff"/>'+
             '<circle cx="43" cy="61" r="4" fill="'+C.ink+'"/>'+
             '<circle cx="44.6" cy="59.2" r="1.5" fill="#fff"/>'+
             '<path d="M55,60 Q61,54 67,60" fill="none" stroke="'+C.ink+'" stroke-width="3" stroke-linecap="round"/>';
    if (kind === 'excited')
      return '<ellipse cx="42" cy="59" rx="8" ry="9.5" fill="#fff"/>'+
             '<ellipse cx="61" cy="59" rx="8" ry="9.5" fill="#fff"/>'+
             '<circle cx="43" cy="60" r="4.6" fill="'+C.ink+'"/>'+
             '<circle cx="62" cy="60" r="4.6" fill="'+C.ink+'"/>'+
             '<circle cx="44.8" cy="57.8" r="1.9" fill="#fff"/>'+
             '<circle cx="63.8" cy="57.8" r="1.9" fill="#fff"/>';
    if (kind === 'thankful')
      return '<path d="M35,61 Q42,55 49,61" fill="none" stroke="'+C.ink+'" stroke-width="3" stroke-linecap="round"/>'+
             '<path d="M54,61 Q61,55 68,61" fill="none" stroke="'+C.ink+'" stroke-width="3" stroke-linecap="round"/>';
    var up = (kind === 'thinking' || kind === 'curious') ? -2 : 0;
    return '<ellipse cx="42" cy="60" rx="7.4" ry="8.4" fill="#fff"/>'+
           '<ellipse cx="61" cy="60" rx="7.4" ry="8.4" fill="#fff"/>'+
           '<circle cx="43" cy="'+(61+up)+'" r="4.1" fill="'+C.ink+'"/>'+
           '<circle cx="62" cy="'+(61+up)+'" r="4.1" fill="'+C.ink+'"/>'+
           '<circle cx="44.6" cy="'+(59.2+up)+'" r="1.6" fill="#fff"/>'+
           '<circle cx="63.6" cy="'+(59.2+up)+'" r="1.6" fill="#fff"/>';
  }

  var MOUTHS = {
    happy:    '<path d="M44,76 Q52,84 60,76" fill="none" stroke="'+C.ink+'" stroke-width="3" stroke-linecap="round"/>',
    wink:     '<path d="M44,76 Q52,83 60,76" fill="none" stroke="'+C.ink+'" stroke-width="3" stroke-linecap="round"/>',
    thinking: '<path d="M48,78 Q52,80 57,77" fill="none" stroke="'+C.ink+'" stroke-width="3" stroke-linecap="round"/>',
    excited:  '<path d="M42,74 Q52,88 62,74 Z" fill="'+C.ink+'"/>'+
              '<path d="M47,81 Q52,85 57,81 Z" fill="#E86A7C"/>',
    curious:  '<ellipse cx="52" cy="78" rx="5" ry="6" fill="'+C.ink+'"/>',
    thankful: '<path d="M45,76 Q52,82 59,76" fill="none" stroke="'+C.ink+'" stroke-width="3" stroke-linecap="round"/>'
  };

  function brows(kind){
    if (kind === 'thinking')
      return '<path d="M35,46 Q42,42 49,45" fill="none" stroke="'+C.ink+'" stroke-width="2.6" stroke-linecap="round"/>'+
             '<path d="M55,44 Q62,41 69,45" fill="none" stroke="'+C.ink+'" stroke-width="2.6" stroke-linecap="round"/>';
    if (kind === 'curious')
      return '<path d="M35,45 Q42,40 49,44" fill="none" stroke="'+C.ink+'" stroke-width="2.6" stroke-linecap="round"/>'+
             '<path d="M55,44 Q62,40 69,44" fill="none" stroke="'+C.ink+'" stroke-width="2.6" stroke-linecap="round"/>';
    return '';
  }

  /* Held props, matching the character sheet. */
  function prop(kind){
    if (kind === 'curious')
      return '<g class="dewey-prop">'+
        '<circle cx="90" cy="86" r="13" fill="none" stroke="#8A93A0" stroke-width="4"/>'+
        '<circle cx="90" cy="86" r="10" fill="#DCEEF9" opacity=".55"/>'+
        '<path d="M99,96 L108,107" stroke="#7A5230" stroke-width="5" stroke-linecap="round"/>'+
      '</g>';
    if (kind === 'thinking')
      return '<circle cx="86" cy="40" r="4" fill="#fff" opacity=".85"/>'+
             '<circle cx="95" cy="30" r="6" fill="#fff" opacity=".85"/>';
    return '';
  }

  function svg(expr, size){
    var e = MOUTHS[expr] ? expr : 'happy';
    var waving = (e === 'happy' || e === 'excited');
    return '<svg class="dewey dewey-'+e+'" viewBox="0 0 120 170" width="'+size+'" height="'+(size*170/120)+'" '+
           'role="img" aria-label="Dewey the Dew Drop">'+
      '<g class="dewey-bob">'+

        /* legs and shoes */
        '<path d="M46,132 L46,146" stroke="'+C.bodyD+'" stroke-width="7" stroke-linecap="round"/>'+
        '<path d="M64,132 L64,146" stroke="'+C.bodyD+'" stroke-width="7" stroke-linecap="round"/>'+
        '<path d="M36,152 q0,-8 10,-8 h4 q4,0 4,5 v3 z" fill="'+C.shoe+'"/>'+
        '<path d="M56,152 q0,-8 10,-8 h4 q4,0 4,5 v3 z" fill="'+C.shoe+'"/>'+
        '<rect x="36" y="150" width="22" height="4" rx="2" fill="#fff"/>'+
        '<rect x="56" y="150" width="22" height="4" rx="2" fill="#fff"/>'+

        /* backpack strap behind the body */
        '<path d="M30,96 q-8,10 -4,24 q12,4 18,-2" fill="'+C.packD+'"/>'+

        /* the drop */
        '<path d="M60,6 C60,6 22,58 22,86 a38,38 0 0 0 76,0 C98,58 60,6 60,6 Z" fill="'+C.body+'"/>'+
        '<path d="M60,18 C60,18 34,60 34,84 a26,26 0 0 0 12,21 C36,92 40,66 60,18 Z" fill="'+C.shine+'" opacity=".55"/>'+

        /* lab coat */
        '<path d="M32,104 q28,14 56,0 v26 q-28,10 -56,0 Z" fill="'+C.coat+'"/>'+
        '<path d="M60,110 v22" stroke="'+C.coatSh+'" stroke-width="2.5"/>'+
        '<path d="M44,104 q16,12 32,0" fill="none" stroke="'+C.coatSh+'" stroke-width="2.5"/>'+
        '<circle cx="72" cy="120" r="2.4" fill="'+C.pack+'"/>'+

        /* face */
        brows(e) + eyes(e) + MOUTHS[e] +
        '<ellipse cx="33" cy="72" rx="5" ry="3.4" fill="'+C.blush+'" opacity=".30"/>'+
        '<ellipse cx="71" cy="72" rx="5" ry="3.4" fill="'+C.blush+'" opacity=".30"/>'+

        /* waving arm */
        '<g class="'+(waving ? 'dewey-wave' : '')+'">'+
          '<path d="M92,104 q12,-10 14,-24" stroke="'+C.body+'" stroke-width="9" stroke-linecap="round" fill="none"/>'+
          '<circle cx="107" cy="76" r="8" fill="'+C.body+'"/>'+
        '</g>'+
        prop(e) +
      '</g>'+
    '</svg>';
  }

  var CSS =
  '.dewey{display:block;overflow:visible}'+
  '.dewey-bob{transform-origin:60px 154px;animation:deweyBob 4s ease-in-out infinite}'+
  '@keyframes deweyBob{0%,100%{transform:translateY(0) rotate(-1.5deg)}50%{transform:translateY(-4px) rotate(1.5deg)}}'+
  '.dewey-wave{transform-origin:94px 104px;animation:deweyWave 1.1s ease-in-out 3}'+
  '@keyframes deweyWave{0%,100%{transform:rotate(0)}30%{transform:rotate(-20deg)}70%{transform:rotate(14deg)}}'+
  '.dewey-excited .dewey-bob{animation:deweyHop .7s ease-in-out 2}'+
  '@keyframes deweyHop{0%,100%{transform:translateY(0)}40%{transform:translateY(-10px)}}'+
  '.dewey-prop{transform-origin:90px 86px;animation:deweyPeer 2.6s ease-in-out infinite}'+
  '@keyframes deweyPeer{0%,100%{transform:translate(0,0)}50%{transform:translate(-5px,4px)}}'+
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
      var d=document.createElement('div');
      d.innerHTML=svg(expr||'happy', size||100);
      return d.firstChild;
    },
    say: function(text,expr,size){
      injectCSS();
      return '<div class="dewey-row">'+svg(expr||'happy', size||74)+
             '<div class="dewey-bubble">'+text+'</div></div>';
    }
  };

  if (document.readyState !== 'loading') injectCSS();
  else document.addEventListener('DOMContentLoaded', injectCSS);
})(window);

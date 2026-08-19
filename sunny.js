/* ------------------------------------------------------------------
   Sunny the Sprout — The Talking Garden
   ------------------------------------------------------------------
   The recurring character. Drawn as inline SVG rather than image
   files so he scales from a 40px avatar to a full illustration
   without assets, loads instantly, and can change expression in code.

   Sunny.el(expression, size)   -> an <svg> element
   Sunny.html(expression, size) -> the same as a markup string
   Sunny.say(text, expression)  -> Sunny with a speech bubble

   Expressions: happy · cheer · think · gentle · wave · sleepy

   A note on `gentle`: it is what a child sees after a wrong answer.
   Sunny is never sad, never disappointed, never frowning. Children
   read a frown as "I let him down". Gentle is warm and encouraging.
------------------------------------------------------------------- */
(function (global) {

  var FACES = {
    happy:  { mouth:'M50,64 Q60,72 70,64', eyes:'open',   brow:null,  cheek:1 },
    cheer:  { mouth:'M48,62 Q60,76 72,62 Z', eyes:'joy',  brow:null,  cheek:1 },
    think:  { mouth:'M55,66 Q60,68 65,65',  eyes:'up',    brow:1,     cheek:0 },
    gentle: { mouth:'M52,66 Q60,70 68,66',  eyes:'open',  brow:null,  cheek:1 },
    wave:   { mouth:'M50,64 Q60,73 70,64',  eyes:'open',  brow:null,  cheek:1 },
    sleepy: { mouth:'M56,67 Q60,70 64,67',  eyes:'shut',  brow:null,  cheek:1 }
  };

  function eyes(kind){
    if (kind === 'joy')
      return '<path d="M46,50 Q51,44 56,50" fill="none" stroke="#2B1D12" stroke-width="2.6" stroke-linecap="round"/>'+
             '<path d="M64,50 Q69,44 74,50" fill="none" stroke="#2B1D12" stroke-width="2.6" stroke-linecap="round"/>';
    if (kind === 'shut')
      return '<path d="M46,51 Q51,55 56,51" fill="none" stroke="#2B1D12" stroke-width="2.4" stroke-linecap="round"/>'+
             '<path d="M64,51 Q69,55 74,51" fill="none" stroke="#2B1D12" stroke-width="2.4" stroke-linecap="round"/>';
    var dy = kind === 'up' ? -2 : 0;
    return '<ellipse cx="51" cy="51" rx="6.4" ry="7" fill="#fff"/>'+
           '<ellipse cx="69" cy="51" rx="6.4" ry="7" fill="#fff"/>'+
           '<circle cx="51.8" cy="'+(52+dy)+'" r="3.4" fill="#2B1D12"/>'+
           '<circle cx="69.8" cy="'+(52+dy)+'" r="3.4" fill="#2B1D12"/>'+
           '<circle cx="53.2" cy="'+(50.2+dy)+'" r="1.2" fill="#fff"/>'+
           '<circle cx="71.2" cy="'+(50.2+dy)+'" r="1.2" fill="#fff"/>';
  }

  function petals(){
    var out = '', n = 12;
    for (var i = 0; i < n; i++){
      var a = (360 / n) * i;
      out += '<ellipse cx="60" cy="24" rx="7.5" ry="15" fill="'+(i % 2 ? '#F2B233' : '#F7C34E')+'" '+
             'transform="rotate('+a+' 60 55)"/>';
    }
    return out;
  }

  function svg(expr, size){
    var f = FACES[expr] || FACES.happy;
    var waving = expr === 'wave';
    return '<svg class="sunny sunny-'+expr+'" viewBox="0 0 120 150" width="'+size+'" height="'+(size*1.25)+'" '+
      'role="img" aria-label="Sunny the Sprout">'+
      '<g class="sunny-sway">'+
        '<path d="M60,86 L60,138" stroke="#4F7C4A" stroke-width="6" stroke-linecap="round"/>'+
        '<path d="M60,112 C44,110 36,118 34,126 C46,128 56,122 60,114 Z" fill="#5C8F56"/>'+
        '<path class="'+(waving ? 'sunny-wave' : '')+'" '+
              'd="M60,102 C76,100 84,108 86,116 C74,118 64,112 60,104 Z" fill="#4F7C4A"/>'+
        '<g class="sunny-head">'+
          petals()+
          '<circle cx="60" cy="55" r="26" fill="#7A5230"/>'+
          '<circle cx="60" cy="55" r="21" fill="#8A5E38"/>'+
          (f.cheek ? '<ellipse cx="43" cy="60" rx="5" ry="3.4" fill="#C25A36" opacity=".38"/>'+
                     '<ellipse cx="77" cy="60" rx="5" ry="3.4" fill="#C25A36" opacity=".38"/>' : '')+
          eyes(f.eyes)+
          (f.brow ? '<path d="M45,42 Q51,39 57,41" fill="none" stroke="#2B1D12" stroke-width="2.2" stroke-linecap="round"/>' : '')+
          '<path d="'+f.mouth+'" fill="'+(expr === 'cheer' ? '#2B1D12' : 'none')+'" '+
                'stroke="#2B1D12" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'+
        '</g>'+
      '</g>'+
    '</svg>';
  }

  var CSS = ''+
  '.sunny{display:block;overflow:visible}'+
  '.sunny-sway{transform-origin:60px 138px;animation:sunnySway 4.5s ease-in-out infinite}'+
  '@keyframes sunnySway{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}'+
  '.sunny-head{transform-origin:60px 60px}'+
  '.sunny-cheer .sunny-head{animation:sunnyBounce .7s ease-in-out 2}'+
  '@keyframes sunnyBounce{0%,100%{transform:translateY(0) scale(1)}40%{transform:translateY(-7px) scale(1.05)}}'+
  '.sunny-wave{transform-origin:62px 104px;animation:sunnyWave 1s ease-in-out 3}'+
  '@keyframes sunnyWave{0%,100%{transform:rotate(0)}25%{transform:rotate(-18deg)}75%{transform:rotate(12deg)}}'+
  '@media (prefers-reduced-motion:reduce){.sunny-sway,.sunny-head,.sunny-wave{animation:none}}'+
  '.sunny-bubble{position:relative;background:#fff;border:2px solid var(--line,#E8E1D2);border-radius:16px;'+
    'padding:11px 15px;font-size:14.5px;color:var(--ink,#1F2320);max-width:22em;line-height:1.45}'+
  '.sunny-bubble::after{content:"";position:absolute;left:-9px;top:20px;width:14px;height:14px;'+
    'background:#fff;border-left:2px solid var(--line,#E8E1D2);border-bottom:2px solid var(--line,#E8E1D2);'+
    'transform:rotate(45deg)}'+
  '.sunny-row{display:flex;align-items:flex-start;gap:12px}'+
  '.sunny-row .sunny{flex:none}';

  function injectCSS(){
    if (document.getElementById('sunny-css')) return;
    var st = document.createElement('style');
    st.id = 'sunny-css'; st.textContent = CSS;
    document.head.appendChild(st);
  }

  global.Sunny = {
    html: function (expr, size){ injectCSS(); return svg(expr || 'happy', size || 90); },
    el: function (expr, size){
      injectCSS();
      var d = document.createElement('div');
      d.innerHTML = svg(expr || 'happy', size || 90);
      return d.firstChild;
    },
    say: function (text, expr, size){
      injectCSS();
      return '<div class="sunny-row">'+svg(expr || 'happy', size || 66)+
             '<div class="sunny-bubble">'+text+'</div></div>';
    }
  };

  if (document.readyState !== 'loading') injectCSS();
  else document.addEventListener('DOMContentLoaded', injectCSS);
})(window);

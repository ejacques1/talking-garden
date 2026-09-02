/* ------------------------------------------------------------------
   Dewey the Dew Drop — DewLab's guide
   ------------------------------------------------------------------
   Uses DHCG's own artwork rather than a redrawn vector. The six
   expressions are cropped from their character sheet with the white
   background removed, so Dewey looks exactly as their illustrator
   made him.

   Expressions: happy · wink · thinking · excited · curious · thankful

   Deliberately no sad face — after a wrong answer a child sees
   "thinking", never disappointment. Children read a frown on a
   character as having let it down.

   Dewey.html(expression, size)  -> markup string
   Dewey.el(expression, size)    -> an element
   Dewey.say(text, expression)   -> Dewey with a speech bubble

   The images are raster, so Dewey does not change colour or animate
   his features. He does breathe gently, and waves on arrival, which
   is enough life for a page. Anything more would need the vector
   version, which never matched the illustration.
------------------------------------------------------------------- */
(function (global) {

  var LIST = ['happy','wink','thinking','excited','curious','thankful'];
  var BASE = 'img/';            /* override with Dewey.base('/dewlab/img/') */

  var CSS =
  '.dewey{display:inline-block;line-height:0;position:relative}'+
  '.dewey img{display:block;width:100%;height:auto;user-select:none;-webkit-user-drag:none}'+
  '.dewey-breathe img{animation:deweyBreathe 4.4s ease-in-out infinite;transform-origin:50% 92%}'+
  '@keyframes deweyBreathe{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-3px) scale(1.02)}}'+
  '.dewey-enter img{animation:deweyEnter .7s cubic-bezier(.2,.9,.3,1.2) 1 both, deweyBreathe 4.4s ease-in-out .7s infinite}'+
  '@keyframes deweyEnter{0%{transform:translateY(14px) scale(.86);opacity:0}100%{transform:translateY(0) scale(1);opacity:1}}'+
  '@media (prefers-reduced-motion:reduce){.dewey img{animation:none !important}}'+
  '.dewey-row{display:flex;align-items:flex-start;gap:14px}'+
  '.dewey-row .dewey{flex:none}'+
  '.dewey-bubble{position:relative;background:#fff;border:2px solid var(--line,#E4E0D8);'+
    'border-radius:20px;padding:13px 17px;font-size:15.5px;line-height:1.45;'+
    'color:var(--ink,#16283A);max-width:23em}'+
  '.dewey-bubble::after{content:"";position:absolute;left:-9px;top:24px;width:14px;height:14px;'+
    'background:#fff;border-left:2px solid var(--line,#E4E0D8);'+
    'border-bottom:2px solid var(--line,#E4E0D8);transform:rotate(45deg)}';

  function injectCSS(){
    if (document.getElementById('dewey-css')) return;
    var s=document.createElement('style'); s.id='dewey-css'; s.textContent=CSS;
    document.head.appendChild(s);
  }

  function pick(expr){ return LIST.indexOf(expr) > -1 ? expr : 'happy'; }

  function svg(expr, size, opts){
    opts = opts || {};
    var e = pick(expr);
    var cls = 'dewey ' + (opts.enter ? 'dewey-enter' : 'dewey-breathe');
    return '<span class="'+cls+'" style="width:'+size+'px">'+
             '<img src="'+BASE+'dewey-'+e+'.png" alt="Dewey the Dew Drop" '+
                  'width="'+size+'" loading="lazy" decoding="async">'+
           '</span>';
  }

  global.Dewey = {
    expressions: LIST,
    base: function(path){ BASE = path; },
    html: function(expr,size,opts){ injectCSS(); return svg(expr, size||110, opts); },
    el: function(expr,size,opts){
      injectCSS();
      var d=document.createElement('div');
      d.innerHTML=svg(expr, size||110, opts);
      return d.firstChild;
    },
    say: function(text,expr,size){
      injectCSS();
      return '<div class="dewey-row">'+svg(expr||'happy', size||86)+
             '<div class="dewey-bubble">'+text+'</div></div>';
    }
  };

  if (document.readyState !== 'loading') injectCSS();
  else document.addEventListener('DOMContentLoaded', injectCSS);
})(window);

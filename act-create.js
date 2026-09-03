/* ------------------------------------------------------------------
   Hand-built activities for the Create world
   ------------------------------------------------------------------
   Design a Seed Traveller, and Catching the Sun. Both are engineering
   lessons, so both let a child change ONE thing and measure what
   happened — which is the actual content.
------------------------------------------------------------------- */
(function (global) {

  function reg(name, fn){
    if (!global.TGPlay) return;
    global.TGPlay.custom = global.TGPlay.custom || {};
    global.TGPlay.custom[name] = fn;
  }

  /* ================================================================
     THE DROP TEST
     Build a paper seed from three dials, drop it, get a time. The
     rule that matters is enforced by the interface: change more than
     one thing between drops and it tells you the result is useless.
  ================================================================ */
  reg('dropTest', function(body, act, finish, H){
    var wing = 2, clips = 1, width = 2;
    var last = null, runs = [], warned = false;

    function fall(){
      /* Bigger wings and less weight fall slower. Rough, but it
         behaves the way a real paper seed does. */
      var t = 1.1 + wing * 0.42 + width * 0.16 - clips * 0.34;
      return Math.max(0.4, Math.round(t * 10) / 10);
    }

    function draw(msg){
      body.innerHTML =
        '<div class="q">'+H.esc(act.title)+'</div>'+
        '<div class="qs">Set it up, drop it, write down the time. Then change ONE thing.</div>'+
        '<div class="rig">'+
          '<svg viewBox="0 0 120 130">'+
            '<rect x="'+(60-width*4)+'" y="46" width="'+(width*8)+'" height="56" rx="3" fill="#C9B48F"/>'+
            '<path d="M60,48 L'+(60-wing*13)+',22" stroke="#E0CBA4" stroke-width="9" stroke-linecap="round"/>'+
            '<path d="M60,48 L'+(60+wing*13)+',22" stroke="#E0CBA4" stroke-width="9" stroke-linecap="round"/>'+
            (clips ? '<rect x="54" y="100" width="12" height="'+(clips*7)+'" rx="3" fill="#7A8892"/>' : '')+
            (clips>1 ? '<rect x="54" y="'+(100+clips*7)+'" width="12" height="6" rx="3" fill="#7A8892"/>' : '')+
          '</svg>'+
        '</div>'+
        '<div class="dials">'+
          dial('Wing length', 'wing', wing, 1, 3)+
          dial('Body width',  'width', width, 1, 3)+
          dial('Paperclips',  'clips', clips, 0, 3)+
        '</div>'+
        '<button class="btn btn-primary" id="dropBtn" style="width:100%;margin-top:6px">Drop it</button>'+
        (runs.length ? '<div class="runs">'+runs.map(function(r,i){
            return '<div class="run'+(r.best?' best':'')+'"><b>#'+(i+1)+'</b>'+
                   '<span>w'+r.wing+' b'+r.width+' c'+r.clips+'</span><i>'+r.t.toFixed(1)+'s</i></div>';
          }).join('')+'</div>' : '')+
        '<div class="say" id="pSay">'+H.esc(msg || 'Three dials. Set them however you like for the first drop.')+'</div>';

      [].forEach.call(body.querySelectorAll('[data-d]'), function(b){
        b.onclick = function(){
          var k = b.dataset.d, dir = +b.dataset.v;
          if (k==='wing')  wing  = Math.max(1, Math.min(3, wing + dir));
          if (k==='width') width = Math.max(1, Math.min(3, width + dir));
          if (k==='clips') clips = Math.max(0, Math.min(3, clips + dir));
          draw();
        };
      });

      body.querySelector('#dropBtn').onclick = function(){
        var t = fall();
        var changes = last
          ? (wing!==last.wing) + (width!==last.width) + (clips!==last.clips)
          : 0;
        var best = !runs.length || t > Math.max.apply(null, runs.map(function(r){ return r.t; }));
        runs.forEach(function(r){ r.best = false; });
        runs.push({ wing:wing, width:width, clips:clips, t:t, best:best });
        var m;
        if (last && changes === 0) m = 'Same setup, same result. Change something.';
        else if (last && changes > 1){
          warned = true;
          m = t.toFixed(1)+' seconds — but you changed '+changes+' things at once, so you cannot tell which one did it.';
        }
        else if (last) m = t.toFixed(1)+' seconds. '+(t > last.t ? 'Better than last time.' : 'Worse than last time — but now you know.');
        else m = t.toFixed(1)+' seconds. That is the number to beat.';
        last = { wing:wing, width:width, clips:clips, t:t };
        H.say(m);
        draw(m);
        var good = runs.filter(function(r){ return r.t >= 2.6; }).length;
        if (runs.length >= 4 && good) setTimeout(function(){
          finish(warned ? 'You found a slow one — and you found out why one-at-a-time matters.'
                        : 'Four drops, one change at a time. That is how engineers work.', '&#129718;');
        }, 2400);
      };
    }

    function dial(label, key, val, lo, hi){
      return '<div class="dial"><span>'+label+'</span>'+
        '<div class="dialrow">'+
          '<button data-d="'+key+'" data-v="-1"'+(val<=lo?' disabled':'')+'>&minus;</button>'+
          '<b>'+val+'</b>'+
          '<button data-d="'+key+'" data-v="1"'+(val>=hi?' disabled':'')+'>+</button>'+
        '</div></div>';
    }
    draw();
  });

  /* ================================================================
     BUILD THE OVEN
     Three parts, and the child can leave any of them out. The
     temperature responds, so they discover that all three are doing
     different jobs rather than being told so.
  ================================================================ */
  var PARTS = [
    { id:'black', e:'&#11035;', t:'Black paper inside', gain:26,
      job:'Dark surfaces absorb light and turn it into heat.' },
    { id:'foil',  e:'&#10024;', t:'Foil reflector flap', gain:18,
      job:'Foil bounces extra sunlight down into the box.' },
    { id:'lid',   e:'&#129695;', t:'Clear plastic lid', gain:22,
      job:'Lets light in, stops the warm air escaping.' }
  ];

  reg('solarBuild', function(body, act, finish, H){
    var on = {}, tried = {};

    function temp(){
      var t = 78;
      PARTS.forEach(function(p){ if (on[p.id]) t += p.gain; });
      return t;
    }

    function draw(){
      var t = temp(), all = PARTS.every(function(p){ return on[p.id]; });
      tried[Object.keys(on).sort().join('-')] = 1;

      body.innerHTML =
        '<div class="q">'+H.esc(act.title)+'</div>'+
        '<div class="qs">Add and remove parts. Watch the thermometer decide which ones matter.</div>'+
        '<div class="oven'+(all?' hot':'')+'">'+
          '<div class="ovenbox">'+
            (on.foil  ? '<span class="ofoil">&#10024;</span>' : '')+
            (on.lid   ? '<span class="olid"></span>' : '')+
            (on.black ? '<span class="oblack"></span>' : '')+
            '<span class="osnack">'+(t >= 130 ? '&#127851;' : '&#127851;')+'</span>'+
          '</div>'+
          '<div class="ovtemp"><b>'+t+'&deg;F</b><span>'+
            (t >= 144 ? 'Hot enough to melt chocolate' : t >= 96 ? 'Warmer, but not there yet' : 'Barely warmer than the air')+
          '</span></div>'+
        '</div>'+
        '<div class="tray">'+
          PARTS.map(function(p){
            return '<button class="tile'+(on[p.id]?' ok':'')+'" data-p="'+p.id+'">'+
                   '<span class="e">'+p.e+'</span>'+H.esc(p.t)+'</button>';
          }).join('')+
        '</div>'+
        '<div class="say" id="pSay">'+
          (all ? 'All three, and it is hot enough. Each one was doing a different job.'
               : Object.keys(on).length ? PARTS.filter(function(p){ return on[p.id]; })
                   .map(function(p){ return p.job; }).join(' ')
               : 'An empty pizza box in the sun. Add a part and see what it does.')+
        '</div>'+
        '<div class="pbar"><i style="width:'+Math.min(100, Object.keys(tried).length/5*100)+'%"></i></div>';

      [].forEach.call(body.querySelectorAll('.tile'), function(b){
        b.onclick = function(){
          var p = PARTS.filter(function(x){ return x.id === b.dataset.p; })[0];
          if (on[p.id]) delete on[p.id]; else on[p.id] = 1;
          H.say(on[p.id] ? p.t + ' added. ' + p.job : p.t + ' removed.');
          draw();
          if (PARTS.every(function(x){ return on[x.id]; }) && Object.keys(tried).length >= 4)
            setTimeout(function(){ finish('You worked out what each part is for.','&#9728;&#65039;'); }, 2200);
        };
      });
    }
    draw();
  });

})(window);

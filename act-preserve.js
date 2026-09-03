/* ------------------------------------------------------------------
   Hand-built activities for the Preserve world
   ------------------------------------------------------------------
   Drying the Harvest, and Saving Seeds for Next Year.

   SAFETY: neither of these states a canning time, temperature or
   acidity, and neither ever should. Where a real number is needed the
   lesson sends you to the National Center for Home Food Preservation.
   These two topics were chosen partly because they teach genuine
   preservation without depending on a safety threshold.
------------------------------------------------------------------- */
(function (global) {

  function reg(name, fn){
    if (!global.TGPlay) return;
    global.TGPlay.custom = global.TGPlay.custom || {};
    global.TGPlay.custom[name] = fn;
  }

  /* ================================================================
     TAKE THE WATER OUT
     A moisture dial. Slide it down and the mould stops growing. The
     principle of every preservation method there is, in one control.
  ================================================================ */
  reg('dryOut', function(body, act, finish, H){
    var water = 90, low = 90, high = 90;

    function state(){
      if (water > 70) return { m:'&#129440;&#129440;&#129440;', s:'Mould within days. There is plenty for it to drink.', ok:false };
      if (water > 45) return { m:'&#129440;&#129440;', s:'Still spoiling, just more slowly.', ok:false };
      if (water > 25) return { m:'&#129440;', s:'Nearly. A little water is still enough for some of them.', ok:false };
      return { m:'&#10060;', s:'Nothing can grow. No water, no mould, no bacteria. This will keep for months.', ok:true };
    }

    function draw(){
      var st = state();
      low = Math.min(low, water); high = Math.max(high, water);
      body.innerHTML =
        '<div class="q">'+H.esc(act.title)+'</div>'+
        '<div class="qs">Drag the water out of the herbs and watch what stops growing.</div>'+
        '<div class="dryrow">'+
          '<div class="dryleaf" style="opacity:'+(0.45 + water/180)+';transform:scale('+(0.72 + water/300)+')">&#127807;</div>'+
          '<div class="drymould">'+st.m+'</div>'+
        '</div>'+
        '<div class="weeks">'+
          '<b>'+water+'% water left</b>'+
          '<input type="range" id="wIn" min="5" max="90" value="'+water+'">'+
          '<div class="thermoKey"><span>Bone dry</span><span>Fresh picked</span></div>'+
        '</div>'+
        '<div class="say" id="pSay">'+H.esc(st.s)+'</div>'+
        '<div class="pbar"><i style="width:'+(st.ok?100:Math.max(0,(90-water)/65*100))+'%"></i></div>';

      body.querySelector('#wIn').oninput = function(){ water = +this.value; draw(); };
      body.querySelector('#wIn').onchange = function(){
        var s2 = state();
        H.say(water + ' percent water left. ' + s2.s);
        if (s2.ok && high > 60) setTimeout(function(){
          finish('That is what drying is. Take the water, and nothing can eat it.','&#127807;'); }, 2000);
      };
    }
    draw();
  });

  /* ================================================================
     READY OR NOT
     Judge four seeds by what they look like, then find out. Ripeness
     is a judgement a child has to practise, not a fact to memorise.
  ================================================================ */
  var SEEDS = [
    { e:'&#127806;', t:'Bean pod, brown and rattling', ready:true,
      why:'Dry, brown and it rattles. That is the sound of loose seed inside. Take it.' },
    { e:'&#129362;', t:'Bean pod, green and soft',     ready:false,
      why:'Green means the plant is still filling it. Take it now and the seed has no food store to sprout with.' },
    { e:'&#127803;', t:'Sunflower head, drooping and brown at the back', ready:true,
      why:'The droop and the brown back are the plant saying it is finished. That is your signal.' },
    { e:'&#127803;', t:'Sunflower, bright yellow and facing the sun', ready:false,
      why:'Still flowering. It has not even made the seeds yet, let alone finished them.' }
  ];

  reg('readyOrNot', function(body, act, finish, H){
    var i = 0, right = 0, showing = null;

    function draw(){
      if (i >= SEEDS.length){
        finish(right === SEEDS.length ? 'Every one called right.'
             : 'You got '+right+' of '+SEEDS.length+' — and now you know what to look for.', '&#127793;');
        return;
      }
      var s = SEEDS[i];
      body.innerHTML =
        '<div class="q">'+H.esc(act.title)+'</div>'+
        '<div class="qs">'+(i+1)+' of '+SEEDS.length+'</div>'+
        '<div class="seedcard"><div class="seedart">'+s.e+'</div><b>'+H.esc(s.t)+'</b></div>'+
        (showing
          ? '<div class="outcome '+(showing.ok?'good':'bad')+'">'+
              '<b>'+(showing.ok?'&#9989; Right':'&#128533; Not this one')+'</b>'+
              '<span>'+H.esc(s.why)+'</span></div>'
          : '<div class="grid2">'+
              '<button class="opt" data-r="1"><span class="e">&#9989;</span>Ready to save</button>'+
              '<button class="opt" data-r="0"><span class="e">&#8987;</span>Wait longer</button>'+
            '</div>')+
        '<div class="say" id="pSay">'+(showing?'':'Look at it. Would you take that seed?')+'</div>'+
        '<div class="pbar"><i style="width:'+(i/SEEDS.length*100)+'%"></i></div>';

      if (showing) return;
      H.say(s.t + '. Ready to save, or wait longer?');
      [].forEach.call(body.querySelectorAll('.opt'), function(b){
        b.onclick = function(){
          var said = b.dataset.r === '1';
          var ok = said === s.ready;
          if (ok) right++;
          showing = { ok: ok };
          draw();
          H.say(s.why);
          setTimeout(function(){ i++; showing = null; draw(); }, 3400);
        };
      });
    }
    draw();
  });

})(window);

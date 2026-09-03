/* ------------------------------------------------------------------
   Hand-built activities for the Soil world
   ------------------------------------------------------------------
   Both of these turn on TIME, which is the thing soil lessons usually
   have to ask a child to imagine. Here they can drag it.
------------------------------------------------------------------- */
(function (global) {

  function reg(name, fn){
    if (!global.TGPlay) return;
    global.TGPlay.custom = global.TGPlay.custom || {};
    global.TGPlay.custom[name] = fn;
  }

  /* ================================================================
     THE COMPOST JAR, SPED UP
     Twelve weeks on a slider. Soft wet things vanish in days; a
     woody twig is still there at the end. That difference IS the
     greens-and-browns rule, discovered rather than told.
  ================================================================ */
  var SCRAPS = [
    { e:'&#129388;', t:'Lettuce leaf',  gone:2,  kind:'green' },
    { e:'&#127820;', t:'Banana peel',   gone:5,  kind:'green' },
    { e:'&#9749;',   t:'Coffee grounds',gone:3,  kind:'green' },
    { e:'&#127810;', t:'Dry leaves',    gone:9,  kind:'brown' },
    { e:'&#128230;', t:'Cardboard',     gone:11, kind:'brown' },
    { e:'&#129717;', t:'A woody twig',  gone:99, kind:'brown' }
  ];

  reg('compostJar', function(body, act, finish, H){
    var week = 0, reached = 0;

    function draw(){
      reached = Math.max(reached, week);
      var left = SCRAPS.filter(function(s){ return week < s.gone; });

      body.innerHTML =
        '<div class="q">'+H.esc(act.title)+'</div>'+
        '<div class="qs">Drag the weeks forward and watch what disappears first.</div>'+
        '<div class="jar">'+
          '<div class="jarglass">'+
            SCRAPS.map(function(s){
              var gone = week >= s.gone;
              return '<span class="scrap'+(gone?' gone':'')+'" title="'+H.esc(s.t)+'">'+s.e+'</span>';
            }).join('')+
            '<div class="jarsoil" style="height:'+(18 + week*3.4)+'%"></div>'+
          '</div>'+
        '</div>'+
        '<div class="weeks">'+
          '<b>Week '+week+'</b>'+
          '<input type="range" id="wkIn" min="0" max="12" value="'+week+'">'+
          '<div class="thermoKey"><span>Just made</span><span>12 weeks</span></div>'+
        '</div>'+
        '<div class="say" id="pSay">'+
          (week === 0 ? 'Six things go in. Which do you think goes first?'
           : left.length === 1 ? 'Only the twig is left. Woody things take months, not weeks — that is why you chop them small.'
           : left.length === 0 ? 'All of it is soil now.'
           : left.length + ' still there. The soft wet ones went first.')+
        '</div>'+
        '<div class="pbar"><i style="width:'+(reached/12*100)+'%"></i></div>';

      body.querySelector('#wkIn').oninput = function(){ week = +this.value; draw(); };
      body.querySelector('#wkIn').onchange = function(){
        var l = SCRAPS.filter(function(s){ return week < s.gone; });
        H.say('Week ' + week + '. ' + (l.length ? l.length + ' things still there.' : 'It is all soil now.'));
        if (reached >= 11) setTimeout(function(){
          finish('You watched it turn into soil.','&#129704;'); }, 1600);
      };
    }
    draw();
  });

  /* ================================================================
     DIG DOWN
     Tap through the layers. Each one says what it is and how long it
     took to make — which is where "hundreds of years for an inch"
     stops being a number and starts being a shock.
  ================================================================ */
  var LAYERS = [
    { id:'litter', name:'Leaf litter', e:'&#127810;', col:'#8B6B3E',
      says:'Leaves and twigs that fell this year. Give it a season and it will be part of the layer below.',
      age:'This year' },
    { id:'top', name:'Topsoil', e:'&#127793;', col:'#5C4025',
      says:'Dark, crumbly, alive. Almost every root you have ever seen was in here.',
      age:'About 500 years per inch' },
    { id:'sub', name:'Subsoil', e:'&#129704;', col:'#8A6642',
      says:'Paler and harder. Fewer living things, more clay and minerals washed down from above.',
      age:'Thousands of years' },
    { id:'rock', name:'Broken rock', e:'&#127956;', col:'#9A8B7A',
      says:'Bedrock that has cracked and crumbled. This is where soil comes from in the first place.',
      age:'Tens of thousands of years' },
    { id:'bed', name:'Bedrock', e:'&#128739;', col:'#6E6459',
      says:'Solid rock. Nothing grows here. Everything above it started out as this.',
      age:'Millions of years' }
  ];

  reg('digDown', function(body, act, finish, H){
    var seen = {}, at = null;

    function draw(){
      var cur = at != null ? LAYERS[at] : null;
      body.innerHTML =
        '<div class="q">'+H.esc(act.title)+'</div>'+
        '<div class="qs">Tap each layer, from the top down.</div>'+
        '<div class="ground">'+
          LAYERS.map(function(l,i){
            return '<button class="layer'+(at===i?' on':'')+(seen[i]?' seen':'')+
                   '" data-i="'+i+'" style="background:'+l.col+';height:'+(i===0?15:i===4?30:18)+'%">'+
                   '<span>'+l.e+' '+H.esc(l.name)+'</span>'+
                   (seen[i]?'<i>&#10003;</i>':'')+'</button>';
          }).join('')+
        '</div>'+
        '<div class="say" id="pSay">'+
          (cur ? '<b>'+H.esc(cur.name)+'</b> &middot; '+H.esc(cur.age)+'<br>'+H.esc(cur.says)
               : 'Five layers. Start at the top.')+
        '</div>'+
        '<div class="pbar"><i style="width:'+(Object.keys(seen).length/5*100)+'%"></i></div>';

      [].forEach.call(body.querySelectorAll('.layer'), function(b){
        b.onclick = function(){
          at = +b.dataset.i; seen[at] = 1;
          H.say(LAYERS[at].name + '. ' + LAYERS[at].says);
          if (Object.keys(seen).length === 5){
            draw();
            setTimeout(function(){
              finish('All the way down to the rock.','&#129704;'); }, 1800);
            return;
          }
          draw();
        };
      });
    }
    draw();
  });

})(window);

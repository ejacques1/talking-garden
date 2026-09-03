/* ------------------------------------------------------------------
   Hand-built activities for the Protect world
   ------------------------------------------------------------------
   Who Moves the Pollen, and Everybody Needs a Home. Written for these
   two lessons only, the way the plant lesson's six are written for
   that one.
------------------------------------------------------------------- */
(function (global) {

  function reg(name, fn){
    if (!global.TGPlay) return;
    global.TGPlay.custom = global.TGPlay.custom || {};
    global.TGPlay.custom[name] = fn;
  }

  /* ================================================================
     POLLEN RUN
     Fly a bee from flower to flower and watch pollen actually move.
     Visit two flowers of the SAME kind and fruit forms; hop between
     different kinds and nothing happens. That is the bit children get
     wrong, and no sorting question can show it.
  ================================================================ */
  var FLOWERS = [
    { id:'a1', kind:'apple',  x:18, y:30, e:'&#127804;' },
    { id:'a2', kind:'apple',  x:72, y:24, e:'&#127804;' },
    { id:'p1', kind:'pumpkin',x:44, y:58, e:'&#127799;' },
    { id:'a3', kind:'apple',  x:82, y:66, e:'&#127804;' },
    { id:'p2', kind:'pumpkin',x:14, y:70, e:'&#127799;' }
  ];

  reg('pollenRun', function(body, act, finish, H){
    var carrying = null, fruited = {}, at = null, msg = 'Tap a flower to land on it.';

    function draw(){
      body.innerHTML =
        '<div class="q">'+H.esc(act.title)+'</div>'+
        '<div class="qs">Land on a flower, pick up pollen, then find another flower of the SAME kind.</div>'+
        '<div class="meadow">'+
          FLOWERS.map(function(f){
            return '<button class="bloom'+(at===f.id?' here':'')+(fruited[f.id]?' fruited':'')+
                   '" data-f="'+f.id+'" style="left:'+f.x+'%;top:'+f.y+'%">'+
                   (fruited[f.id] ? (f.kind==='apple'?'&#127822;':'&#127875;') : f.e)+'</button>';
          }).join('')+
          '<div class="beeflag'+(carrying?' loaded':'')+'">&#128029;'+
            (carrying ? '<i>carrying '+carrying+' pollen</i>' : '<i>no pollen yet</i>')+'</div>'+
        '</div>'+
        '<div class="say" id="pSay">'+H.esc(msg)+'</div>'+
        '<div class="pbar"><i style="width:'+(Object.keys(fruited).length/4*100)+'%"></i></div>';

      [].forEach.call(body.querySelectorAll('.bloom'), function(b){
        b.onclick = function(){
          var f = FLOWERS.filter(function(x){ return x.id === b.dataset.f; })[0];
          at = f.id;
          if (!carrying){
            carrying = f.kind;
            msg = 'You picked up ' + f.kind + ' pollen. Now find another ' + f.kind + ' flower.';
          } else if (carrying === f.kind && !fruited[f.id]){
            fruited[f.id] = 1;
            msg = 'Pollen delivered — ' + (/^[aeiou]/.test(f.kind) ? 'an ' : 'a ') +
                  f.kind + ' is growing! Pick up more.';
            carrying = null;
          } else if (carrying !== f.kind){
            msg = 'Wrong kind. ' + carrying + ' pollen is no use to a ' + f.kind + ' flower.';
          } else {
            msg = 'This one already has fruit. Try another.';
          }
          H.say(msg);
          if (Object.keys(fruited).length >= 3){
            draw();
            setTimeout(function(){ finish('You grew fruit that would not exist without you!','&#127822;'); }, 1500);
            return;
          }
          draw();
        };
      });
    }
    draw();
  });

  /* ================================================================
     THE GARDEN WITH NO BEES
     A switch. Turn the pollinators off and the same garden empties —
     the flowers stay, the fruit does not. Shows what "we would lose
     most fruit" actually means.
  ================================================================ */
  reg('noBees', function(body, act, finish, H){
    var bees = true, flipped = 0;

    function draw(){
      body.innerHTML =
        '<div class="q">'+H.esc(act.title)+'</div>'+
        '<div class="qs">Same garden, same soil, same water. Turn the pollinators off and on.</div>'+
        '<div class="orchard'+(bees?'':' empty')+'">'+
          ['&#127822;','&#127818;','&#127817;','&#129373;','&#127827;','&#129744;'].map(function(fruit,i){
            return '<div class="tree">'+
              '<div class="crown">'+(bees?fruit:'&#127807;')+'</div>'+
              (bees ? '<span class="bz b'+i+'">&#128029;</span>' : '')+
            '</div>';
          }).join('')+
        '</div>'+
        '<div class="switchrow">'+
          '<button class="swbtn'+(bees?' on':'')+'" data-b="1">&#128029; Pollinators here</button>'+
          '<button class="swbtn'+(bees?'':' on')+'" data-b="0">&#10060; No pollinators</button>'+
        '</div>'+
        '<div class="say" id="pSay">'+
          (bees ? 'Six crops, all fruiting. The bees are doing the work you cannot see.'
                : 'Same plants. Same care. No fruit — just leaves. This is what losing pollinators looks like.')+
        '</div>';

      [].forEach.call(body.querySelectorAll('.swbtn'), function(b){
        b.onclick = function(){
          var want = b.dataset.b === '1';
          if (want === bees) return;
          bees = want; flipped++;
          H.say(bees ? 'The pollinators are back, and so is the fruit.'
                     : 'No pollinators. The flowers are still there, but no fruit grows.');
          draw();
          if (flipped >= 2) setTimeout(function(){
            finish('Now you know what they are for.','&#128029;'); }, 2200);
        };
      });
    }
    draw();
  });

  /* ================================================================
     BUILD A HOME
     Four needs, one empty yard. Add things and the animals arrive —
     but only once ALL FOUR are met, which is the actual rule and the
     thing a list of four words never lands.
  ================================================================ */
  var ADDABLE = [
    { id:'flowers', e:'&#127804;', label:'Flowering plants', gives:['food'] },
    { id:'dish',    e:'&#128167;', label:'Shallow water dish', gives:['water'] },
    { id:'logs',    e:'&#129717;', label:'Log pile',          gives:['shelter'] },
    { id:'wild',    e:'&#127807;', label:'A corner left wild', gives:['space','shelter'] },
    { id:'paving',  e:'&#129521;', label:'More paving',        gives:[] },
    { id:'spray',   e:'&#129529;', label:'Bug spray',          gives:[], harms:true }
  ];
  var NEEDS = [
    { id:'food',    label:'Food',    e:'&#127822;' },
    { id:'water',   label:'Water',   e:'&#128167;' },
    { id:'shelter', label:'Shelter', e:'&#127968;' },
    { id:'space',   label:'Space',   e:'&#128506;&#65039;' }
  ];

  reg('buildHome', function(body, act, finish, H){
    var added = {}, sprayed = false;

    function met(){
      var have = {};
      Object.keys(added).forEach(function(id){
        var a = ADDABLE.filter(function(x){ return x.id === id; })[0];
        (a.gives||[]).forEach(function(g){ have[g] = 1; });
      });
      return have;
    }

    function draw(){
      var have = met();
      var count = NEEDS.filter(function(n){ return have[n.id]; }).length;
      var done = count === 4 && !sprayed;

      body.innerHTML =
        '<div class="q">'+H.esc(act.title)+'</div>'+
        '<div class="qs">An empty yard. Add things until it can actually keep an animal alive.</div>'+
        '<div class="yard'+(done?' alive':'')+(sprayed?' sprayed':'')+'">'+
          Object.keys(added).map(function(id){
            var a = ADDABLE.filter(function(x){ return x.id === id; })[0];
            return '<span class="thing">'+a.e+'</span>';
          }).join('')+
          (done ? '<span class="visitor v1">&#129419;</span><span class="visitor v2">&#128029;</span>'+
                  '<span class="visitor v3">&#128038;</span>' : '')+
          (!Object.keys(added).length ? '<span class="yardhint">Nothing lives here yet</span>' : '')+
        '</div>'+
        '<div class="needrow">'+
          NEEDS.map(function(n){
            return '<span class="need'+(have[n.id]?' got':'')+'">'+n.e+' '+n.label+'</span>';
          }).join('')+
        '</div>'+
        '<div class="tray">'+
          ADDABLE.map(function(a){
            return '<button class="tile'+(added[a.id]?' ok':'')+'" data-a="'+a.id+'">'+
                   '<span class="e">'+a.e+'</span>'+H.esc(a.label)+'</button>';
          }).join('')+
        '</div>'+
        '<div class="say" id="pSay">'+
          (sprayed ? 'The spray killed the insects. Everything that ate them left too — take it away.'
           : done  ? 'All four. Look who turned up.'
           : count ? count + ' of 4. Still missing: ' +
                     NEEDS.filter(function(n){ return !have[n.id]; }).map(function(n){ return n.label.toLowerCase(); }).join(', ') + '.'
           : 'Tap something to add it.')+
        '</div>'+
        '<div class="pbar"><i style="width:'+(count/4*100)+'%"></i></div>';

      [].forEach.call(body.querySelectorAll('.tile'), function(b){
        b.onclick = function(){
          var a = ADDABLE.filter(function(x){ return x.id === b.dataset.a; })[0];
          if (added[a.id]){ delete added[a.id]; if (a.harms) sprayed = false; }
          else { added[a.id] = 1; if (a.harms) sprayed = true; }
          var have2 = met();
          var c2 = NEEDS.filter(function(n){ return have2[n.id]; }).length;
          H.say(a.harms && added[a.id] ? 'Bug spray. Now nothing has anything to eat.'
                : (a.gives||[]).length ? a.label + ' added. That is ' + a.gives.join(' and ') + '.'
                : a.label + ' does not give an animal anything.');
          draw();
          if (c2 === 4 && !sprayed) setTimeout(function(){
            finish('You built a habitat.','&#127968;'); }, 2000);
        };
      });
    }
    draw();
  });

})(window);

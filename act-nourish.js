/* ------------------------------------------------------------------
   Hand-built activities for the Nourish world
   ------------------------------------------------------------------
   Build a Plate, and How Food Gets To You.
------------------------------------------------------------------- */
(function (global) {

  function reg(name, fn){
    if (!global.TGPlay) return;
    global.TGPlay.custom = global.TGPlay.custom || {};
    global.TGPlay.custom[name] = fn;
  }

  /* ================================================================
     FILL YOUR OWN PLATE
     A real plate that fills as you add food, with the MyPlate outline
     showing underneath. The child sees their halves being wrong while
     they are building it, not afterwards in a mark.
  ================================================================ */
  var FOODS = [
    { e:'&#127822;', t:'Apple',       g:'fruit' },
    { e:'&#127826;', t:'Banana',      g:'fruit' },
    { e:'&#129365;', t:'Carrots',     g:'veg'   },
    { e:'&#129382;', t:'Broccoli',    g:'veg'   },
    { e:'&#129388;', t:'Salad',       g:'veg'   },
    { e:'&#127834;', t:'Rice',        g:'grain' },
    { e:'&#127838;', t:'Bread',       g:'grain' },
    { e:'&#129385;', t:'Chicken',     g:'prot'  },
    { e:'&#129367;', t:'Beans',       g:'prot'  },
    { e:'&#129371;', t:'Milk',        g:'dairy' },
    { e:'&#129472;', t:'Cheese',      g:'dairy' }
  ];
  var GROUPS = { fruit:'Fruit', veg:'Vegetables', grain:'Grains', prot:'Protein', dairy:'Dairy' };
  var GCOL   = { fruit:'#E3612B', veg:'#639245', grain:'#C27A2C', prot:'#8E5AA8', dairy:'#0071BC' };

  reg('fillPlate', function(body, act, finish, H){
    var on = [];

    function counts(){
      var c = {}; on.forEach(function(f){ c[f.g] = (c[f.g]||0) + 1; });
      return c;
    }

    function draw(){
      var c = counts();
      var total = on.length;
      var fv = (c.fruit||0) + (c.veg||0);
      var half = total >= 4 && fv >= Math.ceil(total/2);
      var groups = Object.keys(c).length;
      var good = half && groups >= 4;

      body.innerHTML =
        '<div class="q">'+H.esc(act.title)+'</div>'+
        '<div class="qs">Build a meal you would actually eat. Watch the two bars as you go.</div>'+
        '<div class="plate'+(good?' good':'')+'">'+
          (total ? on.map(function(f,i){
            return '<span class="onplate" data-i="'+i+'" style="background:'+GCOL[f.g]+'22">'+f.e+'</span>';
          }).join('') : '<span class="plateempty">An empty plate</span>')+
        '</div>'+
        '<div class="gauges">'+
          '<div class="gauge"><span>Half the plate fruit &amp; veg</span>'+
            '<div class="gbar"><i class="'+(half?'ok':'')+'" style="width:'+
              (total ? Math.min(100, fv/Math.max(1,total/2)*100) : 0)+'%"></i></div>'+
            '<b>'+fv+' of '+total+'</b></div>'+
          '<div class="gauge"><span>Groups on the plate</span>'+
            '<div class="gbar"><i class="'+(groups>=4?'ok':'')+'" style="width:'+(groups/5*100)+'%"></i></div>'+
            '<b>'+groups+' of 5</b></div>'+
        '</div>'+
        '<div class="tray">'+
          FOODS.map(function(f,i){
            return '<button class="tile" data-f="'+i+'"><span class="e">'+f.e+'</span>'+H.esc(f.t)+'</button>';
          }).join('')+
        '</div>'+
        '<div class="say" id="pSay">'+
          (!total ? 'Tap food to put it on. Tap it again on the plate to take it off.'
           : good ? 'That is a MyPlate meal. Half of it is fruit and veg, and four groups are there.'
           : !half ? 'Not half yet. Add more fruit or veg — or take something else off.'
           : 'Half is right. Now you are missing '+
             Object.keys(GROUPS).filter(function(g){ return !c[g]; }).map(function(g){ return GROUPS[g].toLowerCase(); }).join(' and ')+'.')+
        '</div>';

      [].forEach.call(body.querySelectorAll('.tile'), function(b){
        b.onclick = function(){
          var f = FOODS[+b.dataset.f];
          on.push(f);
          H.say(f.t + ' added.');
          var c2 = counts(), fv2 = (c2.fruit||0)+(c2.veg||0);
          draw();
          if (on.length >= 4 && fv2 >= Math.ceil(on.length/2) && Object.keys(c2).length >= 4)
            setTimeout(function(){ finish('That is a plate that would keep you going.','&#127869;&#65039;'); }, 2000);
        };
      });
      [].forEach.call(body.querySelectorAll('.onplate'), function(b){
        b.onclick = function(){ on.splice(+b.dataset.i, 1); draw(); };
      });
    }
    draw();
  });

  /* ================================================================
     HOW FAR DID IT COME?
     Pick a food, see the journey drawn as stops. The point is not the
     miles; it is how many hands it passed through before yours.
  ================================================================ */
  var JOURNEYS = [
    { t:'Strawberries from a Texas farm', e:'&#127827;', days:2,
      stops:[['&#127793;','Grown 40 miles away'],['&#129530;','Picked Tuesday morning'],
             ['&#128230;','Cooled and boxed'],['&#128666;','Driven two hours'],['&#128722;','On the shelf Wednesday']] },
    { t:'Bananas from Ecuador', e:'&#127820;', days:21,
      stops:[['&#127793;','Grown in Ecuador'],['&#129530;','Picked green, on purpose'],['&#128230;','Boxed and chilled'],
             ['&#128674;','Two weeks on a ship'],['&#128666;','Trucked from the port'],
             ['&#127777;&#65039;','Warmed in a ripening room'],['&#128722;','On the shelf, yellow']] },
    { t:'Tomatoes from your garden', e:'&#127813;', days:0,
      stops:[['&#127793;','Grown in your bed'],['&#129530;','Picked when you wanted it'],['&#127869;&#65039;','Eaten']] }
  ];

  reg('howFar', function(body, act, finish, H){
    var pick = null, seen = {};

    function draw(){
      var j = pick != null ? JOURNEYS[pick] : null;
      body.innerHTML =
        '<div class="q">'+H.esc(act.title)+'</div>'+
        '<div class="qs">Pick a food and follow it back to where it started.</div>'+
        '<div class="picks">'+
          JOURNEYS.map(function(x,i){
            return '<button class="pickf'+(pick===i?' on':'')+(seen[i]?' seen':'')+'" data-j="'+i+'">'+
                   '<span class="e">'+x.e+'</span>'+H.esc(x.t)+'</button>';
          }).join('')+
        '</div>'+
        (j ? '<div class="journey">'+
              j.stops.map(function(st,n){
                return '<div class="stop"><span class="se">'+st[0]+'</span>'+
                       '<span class="st">'+H.esc(st[1])+'</span></div>'+
                       (n < j.stops.length-1 ? '<div class="arrow">&darr;</div>' : '');
              }).join('')+
             '</div>'+
             '<div class="say" id="pSay"><b>'+j.stops.length+' stops'+
               (j.days ? ', about '+j.days+' day'+(j.days===1?'':'s') : ', same day')+'.</b> '+
               (j.days > 14 ? 'That is why it was picked green — it had to survive the journey.'
                : j.days ? 'Short journey, so it could be picked ripe.'
                : 'No journey at all. Nothing was picked early, and nothing was refrigerated.')+
             '</div>'
           : '<div class="say" id="pSay">Three foods. One travelled 3,000 miles and one travelled three metres.</div>')+
        '<div class="pbar"><i style="width:'+(Object.keys(seen).length/3*100)+'%"></i></div>';

      [].forEach.call(body.querySelectorAll('.pickf'), function(b){
        b.onclick = function(){
          pick = +b.dataset.j; seen[pick] = 1;
          var j2 = JOURNEYS[pick];
          H.say(j2.t + '. ' + j2.stops.length + ' stops.');
          if (Object.keys(seen).length === 3){
            draw();
            setTimeout(function(){ finish('You followed all three back.','&#128506;&#65039;'); }, 2200);
            return;
          }
          draw();
        };
      });
    }
    draw();
  });

})(window);

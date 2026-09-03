/* ------------------------------------------------------------------
   Hand-built activities for "What Grows When"
   ------------------------------------------------------------------
   The generic sorter can ask which season a crop belongs to. It cannot
   let a child turn a dial and watch lettuce bolt, and watching it is
   the lesson. These three are written for this lesson only, the way
   the plant lesson's six are written for that one.

   Everything here is Texas-specific on purpose. A planting calendar
   written for the north of the country is actively wrong in Spring —
   our hard season is the heat, not the frost — and a child who plants
   lettuce in July learns the wrong thing about their own ability.
------------------------------------------------------------------- */
(function (global) {

  function reg(name, fn){
    if (!global.TGPlay) return;
    global.TGPlay.custom = global.TGPlay.custom || {};
    global.TGPlay.custom[name] = fn;
  }

  /* ================================================================
     1. THE TEXAS YEAR
     Tap a month, see what a Texas gardener would sow. The child has
     to find the months for a given crop rather than be told them.
  ================================================================ */
  var MONTHS = [
    { m:'Jan', temp:'cool',  sow:['Onions','Lettuce','Spinach'] },
    { m:'Feb', temp:'cool',  sow:['Lettuce','Carrots','Potatoes'] },
    { m:'Mar', temp:'mild',  sow:['Beans','Squash','Tomatoes'] },
    { m:'Apr', temp:'mild',  sow:['Peppers','Cucumbers','Melons'] },
    { m:'May', temp:'warm',  sow:['Okra','Sweet potatoes','Melons'] },
    { m:'Jun', temp:'hot',   sow:['Okra','Southern peas'] },
    { m:'Jul', temp:'hot',   sow:['Okra','Southern peas','Pumpkins'] },
    { m:'Aug', temp:'hot',   sow:['Pumpkins','Fall tomatoes'] },
    { m:'Sep', temp:'mild',  sow:['Broccoli','Carrots','Lettuce'] },
    { m:'Oct', temp:'cool',  sow:['Spinach','Kale','Garlic'] },
    { m:'Nov', temp:'cool',  sow:['Garlic','Onions','Lettuce'] },
    { m:'Dec', temp:'cool',  sow:['Onions','Kale'] }
  ];
  var TEMPCOL = { cool:'#BFDFF2', mild:'#D9E9CF', warm:'#F7E3B5', hot:'#F6C6A8' };

  reg('texasYear', function(body, act, finish, H){
    var seen = {};
    function draw(pick){
      body.innerHTML =
        '<div class="q">'+H.esc(act.title)+'</div>'+
        '<div class="qs">Tap a month to see what a Texas gardener sows then.</div>'+
        '<div class="yearGrid">'+
          MONTHS.map(function(x,i){
            return '<button class="mon'+(pick===i?' on':'')+(seen[i]?' seen':'')+
                   '" data-i="'+i+'" style="background:'+TEMPCOL[x.temp]+'">'+x.m+'</button>';
          }).join('')+
        '</div>'+
        '<div class="yearKey">'+
          '<span><i style="background:'+TEMPCOL.cool+'"></i>Cool</span>'+
          '<span><i style="background:'+TEMPCOL.mild+'"></i>Mild</span>'+
          '<span><i style="background:'+TEMPCOL.warm+'"></i>Warm</span>'+
          '<span><i style="background:'+TEMPCOL.hot+'"></i>Hot</span>'+
        '</div>'+
        (pick == null
          ? '<div class="say">Twelve months. Find out which ones are for lettuce and which are for okra.</div>'
          : '<div class="say"><b>'+MONTHS[pick].m+'</b> is '+MONTHS[pick].temp+
            '. Sow: '+MONTHS[pick].sow.join(', ')+'.</div>')+
        '<div class="pbar"><i style="width:'+(Object.keys(seen).length/12*100)+'%"></i></div>';

      [].forEach.call(body.querySelectorAll('.mon'), function(b){
        b.onclick = function(){
          var i = +b.dataset.i;
          seen[i] = 1;
          H.say(MONTHS[i].m + ' is ' + MONTHS[i].temp + '. Sow ' + MONTHS[i].sow.join(', '));
          if (Object.keys(seen).length === 12){
            draw(i);
            setTimeout(function(){
              finish('You have been round the whole year!', '&#128197;');
            }, 1400);
            return;
          }
          draw(i);
        };
      });
    }
    draw(null);
  });

  /* ================================================================
     2. TOO HOT FOR LETTUCE
     A temperature dial. Drag it up and the lettuce bolts — shoots up
     tall and turns bitter — while the okra finally gets going. This
     is the whole lesson in one control, and no sorting activity can
     show it.
  ================================================================ */
  reg('bolt', function(body, act, finish, H){
    var temp = 60, tried = {};

    function stage(t, crop){
      /* Rough but real: lettuce bolts in sustained heat, okra sulks
         until the soil is properly warm. */
      if (crop === 'lettuce'){
        if (t < 45) return { art:'&#127793;', txt:'Too cold to do much. It is just sitting there.', ok:false };
        if (t <= 75) return { art:'&#129388;', txt:'Happy. Crisp leaves, sweet, ready to pick.', ok:true };
        if (t <= 85) return { art:'&#127807;', txt:'Getting stressed. The leaves taste sharper.', ok:false };
        return { art:'&#127804;', txt:'Bolted — shot up tall and flowered. Bitter now.', ok:false };
      }
      if (t < 60) return { art:'&#129700;', txt:'The seed will not even come up in cold soil.', ok:false };
      if (t < 75) return { art:'&#127793;', txt:'Alive, but sulking. Barely growing.', ok:false };
      if (t <= 95) return { art:'&#129362;', txt:'Loving it. Pods every few days.', ok:true };
      return { art:'&#129362;', txt:'Still going. Okra does not mind Texas at all.', ok:true };
    }

    function draw(){
      var L = stage(temp,'lettuce'), O = stage(temp,'okra');
      if (L.ok) tried.lettuce = 1;
      if (O.ok) tried.okra = 1;

      body.innerHTML =
        '<div class="q">'+H.esc(act.title)+'</div>'+
        '<div class="qs">Drag the thermometer. Watch what each one does.</div>'+
        '<div class="beds">'+
          '<div class="bed'+(L.ok?' good':'')+'"><div class="bedart">'+L.art+'</div>'+
            '<b>Lettuce</b><span>'+L.txt+'</span></div>'+
          '<div class="bed'+(O.ok?' good':'')+'"><div class="bedart">'+O.art+'</div>'+
            '<b>Okra</b><span>'+O.txt+'</span></div>'+
        '</div>'+
        '<div class="thermo">'+
          '<b>'+temp+'&deg;F</b>'+
          '<input type="range" id="tempIn" min="35" max="105" value="'+temp+'">'+
          '<div class="thermoKey"><span>Cold</span><span>Texas July</span></div>'+
        '</div>'+
        '<div class="say" id="pSay">'+
          (tried.lettuce && tried.okra
            ? 'You found both. They want completely different weather — that is why the calendar matters.'
            : 'Find a temperature where each one is happy. They are not the same.')+
        '</div>';

      body.querySelector('#tempIn').oninput = function(){
        temp = +this.value; draw();
      };
      body.querySelector('#tempIn').onchange = function(){
        var s = stage(temp,'lettuce');
        H.say('At ' + temp + ' degrees, the lettuce is ' +
              (s.ok ? 'happy' : 'not happy') + '.');
        if (tried.lettuce && tried.okra){
          setTimeout(function(){
            finish('You found what each one wants!', '&#127777;&#65039;');
          }, 1500);
        }
      };
    }
    draw();
  });

  /* ================================================================
     3. FROST TONIGHT
     A forecast comes in and the child decides what to do. Every
     choice has a real consequence shown on the plant afterwards,
     because a warning nobody acts on teaches nothing.
  ================================================================ */
  var NIGHTS = [
    { low:28, crop:'Tomatoes', e:'&#127813;', warm:false,
      right:'cover', why:'Tomatoes are a warm-season crop with no defence against frost. A sheet holds enough warmth to get them through one cold night.' },
    { low:52, crop:'Tomatoes', e:'&#127813;', warm:false,
      right:'leave', why:'Fifty-two is chilly but nowhere near freezing. Covering every cool night just makes work and blocks the light in the morning.' },
    { low:30, crop:'Kale', e:'&#129388;', warm:true,
      right:'leave', why:'Kale is built for this. A frost actually makes it sweeter — the plant makes sugars to protect itself.' },
    { low:26, crop:'Pepper plants', e:'&#127798;', warm:false,
      right:'cover', why:'Twenty-six is a hard freeze. Peppers will not survive it uncovered, and a cover is the difference between losing them and not.' }
  ];

  reg('frost', function(body, act, finish, H){
    var i = 0, got = 0;

    function draw(result){
      var n = NIGHTS[i];
      body.innerHTML =
        '<div class="q">'+H.esc(act.title)+'</div>'+
        '<div class="qs">Night '+(i+1)+' of '+NIGHTS.length+'</div>'+
        '<div class="forecast">'+
          '<div class="fcast"><span>Tonight&rsquo;s low</span><b>'+n.low+'&deg;F</b></div>'+
          '<div class="fcrop">'+n.e+'<span>'+n.crop+'</span></div>'+
        '</div>'+
        (result
          ? '<div class="outcome '+(result.ok?'good':'bad')+'">'+
              '<b>'+(result.ok?'&#9989; Good call':'&#128533; Not this time')+'</b>'+
              '<span>'+H.esc(n.why)+'</span></div>'
          : '<div class="grid2">'+
              '<button class="opt" data-d="cover"><span class="e">&#128737;&#65039;</span>Cover them tonight</button>'+
              '<button class="opt" data-d="leave"><span class="e">&#128564;</span>Leave them be</button>'+
            '</div>')+
        '<div class="say" id="pSay">'+(result ? '' : 'What would you do?')+'</div>'+
        '<div class="pbar"><i style="width:'+(i/NIGHTS.length*100)+'%"></i></div>';

      if (result) return;
      H.say(n.crop + '. Tonight it will drop to ' + n.low + ' degrees. Cover them, or leave them?');

      [].forEach.call(body.querySelectorAll('.opt'), function(b){
        b.onclick = function(){
          var ok = b.dataset.d === n.right;
          if (ok) got++;
          b.classList.add(ok ? 'right' : 'wrong');
          draw({ ok: ok });
          H.say(n.why);
          setTimeout(function(){
            i++;
            if (i >= NIGHTS.length){
              finish(got === NIGHTS.length
                ? 'Every night called right!'
                : 'You got ' + got + ' of ' + NIGHTS.length + ' — now you know why.',
                '&#10052;&#65039;');
              return;
            }
            draw(null);
          }, 3600);
        };
      });
    }
    draw(null);
  });

})(window);

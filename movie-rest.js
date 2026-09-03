/* ------------------------------------------------------------------
   The remaining films: Chef Sprout, Tinker and Mason
   ------------------------------------------------------------------
   Six scenes each, same player as the others.
------------------------------------------------------------------- */
(function (global) {

  function at(x,y,ch,s){ return '<text x="'+x+'" y="'+y+'" font-size="'+(s||24)+'" text-anchor="middle">'+ch+'</text>'; }
  function box(x,y,w,h,c,r){ return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(r||8)+'" fill="'+c+'"/>'; }
  function plate(cx,cy,r,segs){
    var out = '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="#fff" stroke="#D2CCC0" stroke-width="2"/>';
    (segs||[]).forEach(function(s){ out += s; });
    return out;
  }

  var FILMS = {
    /* ---------------- Build a Plate ---------------- */
    myplate: { guide:'Chef Sprout', img:'img/guide-chefsprout.png',
      sky:'linear-gradient(#FBF3E2,#EFF4E6 62%)', scenes:[
      { cap:'Your plate is a picture of your afternoon.',
        say:'Hi, I am Chef Sprout. What goes on your plate decides how you feel at four o clock. Not next year. This afternoon.',
        draw:function(){ return plate(160,100,52); } },
      { cap:'There are five groups. Only five.',
        say:'There are five food groups. Fruit. Vegetables. Grains. Protein. And dairy. That is the whole list.',
        draw:function(){ return at(80,74,'&#127822;')+at(125,74,'&#129388;')+at(170,74,'&#127838;')+
          at(215,74,'&#129385;')+at(258,74,'&#129371;'); } },
      { cap:'Half the plate is fruit and vegetables.',
        say:'And here is the only rule you need to remember. Half the plate. Fruit and vegetables. Half.',
        draw:function(){ return plate(160,100,52,[
          '<path d="M160,48 A52,52 0 0,0 160,152 Z" fill="#639245" opacity=".55"/>',
          at(133,92,'&#129388;',20), at(133,120,'&#127822;',20)]); } },
      { cap:'The other half does the rest of the job.',
        say:'The other half is grains and protein. They are not the enemy. They are just not half.',
        draw:function(){ return plate(160,100,52,[
          '<path d="M160,48 A52,52 0 0,0 160,152 Z" fill="#639245" opacity=".55"/>',
          '<path d="M160,48 A52,52 0 0,1 160,152 Z" fill="#C27A2C" opacity=".45"/>',
          at(133,92,'&#129388;',20), at(133,120,'&#127822;',20),
          at(188,92,'&#127838;',20), at(188,120,'&#129385;',20)]); } },
      { cap:'A treat is not a mistake.',
        say:'And a biscuit is not a crime. Most days need fuel. Some days have a biscuit in them too. Both things are true.',
        draw:function(){ return plate(160,100,52,[at(160,110,'&#127850;',30)]); } },
      { cap:'Draw the meal you really ate. Then add one thing.',
        say:'So do not aim for a perfect plate. Draw the one you actually ate this week, and add one fruit or one vegetable next time. One.',
        draw:function(){ return plate(160,100,52,[
          '<path d="M160,48 A52,52 0 0,0 160,152 Z" fill="#639245" opacity=".55"/>',
          at(133,100,'&#129365;',24), at(188,92,'&#127834;',20), at(188,122,'&#129385;',20)]); } }
    ]},

    /* ---------------- How Food Gets To You ---------------- */
    farmtotable: { guide:'Chef Sprout', img:'img/guide-chefsprout.png',
      sky:'linear-gradient(#E7F0FA,#F3EEE2 62%)', scenes:[
      { cap:'Somebody grew this. Somebody picked it.',
        say:'Hi, I am Chef Sprout. Pick up any food in your kitchen. Somebody grew that. Somebody picked it, by hand, on a particular morning.',
        draw:function(){ return at(160,106,'&#127813;',46); } },
      { cap:'Then it gets packed and cooled.',
        say:'Then it gets packed, and cooled, because the clock starts the moment it leaves the plant.',
        draw:function(){ return at(110,104,'&#129530;',30)+at(160,104,'&#128230;',30)+at(212,104,'&#129482;',30); } },
      { cap:'Then it travels. Sometimes very far.',
        say:'Then it travels. A tomato from a Texas farm might drive for two hours. A banana spends two weeks on a ship.',
        draw:function(){ return at(96,100,'&#128666;',30)+at(160,100,'&#128674;',30)+at(224,100,'&#9992;&#65039;',30); } },
      { cap:'That is why some fruit is picked green.',
        say:'And that is the bit worth knowing. Fruit that has to travel gets picked before it is ripe, so it survives the trip. That is why a shop tomato tastes different from yours.',
        draw:function(){ return at(120,102,'&#127823;',36)+at(200,102,'&#127813;',36)+
          '<text x="120" y="140" font-size="11" text-anchor="middle" font-family="Nunito" font-weight="800" fill="#16283A">picked green</text>'+
          '<text x="200" y="140" font-size="11" text-anchor="middle" font-family="Nunito" font-weight="800" fill="#16283A">picked ripe</text>'; } },
      { cap:'Every step costs something.',
        say:'Every step costs fuel, and water, and somebody’s work. Which is why throwing food away wastes far more than the food.',
        draw:function(){ return at(160,100,'&#128465;&#65039;',40)+at(112,86,'&#128167;',18)+at(208,86,'&#128666;',18)+at(160,60,'&#9203;',18); } },
      { cap:'The shortest journey is from your own garden.',
        say:'And the shortest journey in the world is from your garden to your plate. No lorry, no ship, no picking it early. Three metres.',
        draw:function(){ return at(112,104,'&#127793;',34)+at(160,104,'&#10145;&#65039;',24)+at(210,104,'&#127869;&#65039;',34); } }
    ]},

    /* ---------------- Design a Seed Traveller ---------------- */
    seedbot: { guide:'Tinker', img:'img/guide-tinker.png',
      sky:'linear-gradient(#E4F1FA,#EFF4E6 62%)', scenes:[
      { cap:'A seed has a problem. It cannot walk.',
        say:'Hi, I am Tinker. Every seed has the same problem, and it is a good one. It has to get away from its parent, and it cannot walk.',
        draw:function(){ return at(160,80,'&#127794;',40)+at(160,130,'&#127792;',20); } },
      { cap:'Drop straight down and you fight your own parent.',
        say:'If it just drops, it lands in its parent’s shadow and fights it for light and water. It will probably lose.',
        draw:function(){ return at(160,74,'&#127794;',40)+at(148,126,'&#127793;',16)+at(160,130,'&#127793;',16)+at(172,126,'&#127793;',16); } },
      { cap:'So seeds are engineered to travel.',
        say:'So seeds are built to move. And every one of them is a solved engineering problem you can copy.',
        draw:function(){ return at(96,100,'&#127807;',28)+at(160,100,'&#129532;',28)+at(224,100,'&#129381;',28); } },
      { cap:'Wind. Animals. Water. Some just explode.',
        say:'A dandelion catches the wind. A burr hooks onto a dog. A coconut floats. And some pods just dry out and fire the seeds across the garden.',
        draw:function(){ return at(80,96,'&#127788;&#65039;',26)+at(133,96,'&#128054;',26)+at(187,96,'&#128167;',26)+at(240,96,'&#128163;',26); } },
      { cap:'Engineers do the same thing: try, measure, change one thing.',
        say:'When you build your own, do what engineers do. Try it. Measure it. Change one thing. Try again. Not two things. One.',
        draw:function(){ return at(96,100,'&#128736;&#65039;',26)+at(160,100,'&#128207;',26)+at(224,100,'&#128260;',26); } },
      { cap:'A worse result is still an answer.',
        say:'And if it flies worse, that is not a failure. That is you finding out something that does not work, which is exactly as useful.',
        draw:function(){ return at(160,100,'&#128218;',40); } }
    ]},

    /* ---------------- Catching the Sun ---------------- */
    sunpower: { guide:'Tinker', img:'img/guide-tinker.png',
      sky:'linear-gradient(#FBECD2,#F3EFE2 62%)', scenes:[
      { cap:'Sunlight is not just light. It is energy.',
        say:'Hi, I am Tinker. When sunlight lands on something, it does not just light it up. It heats it. That is energy arriving.',
        draw:function(){ return '<circle cx="160" cy="70" r="26" fill="#F2A13C"/>'+
          '<path d="M160,104 L160,130" stroke="#F2A13C" stroke-width="4" stroke-linecap="round"/>'; } },
      { cap:'Dark things soak it up. Light things bounce it.',
        say:'Dark things soak that energy up and get hot. Light and shiny things bounce it away and stay cool. That is the whole trick.',
        draw:function(){ return box(88,86,58,44,'#16283A')+box(176,86,58,44,'#FFFFFF')+
          '<text x="117" y="146" font-size="11" text-anchor="middle" font-family="Nunito" font-weight="800" fill="#16283A">hot</text>'+
          '<text x="205" y="146" font-size="11" text-anchor="middle" font-family="Nunito" font-weight="800" fill="#16283A">cool</text>'; } },
      { cap:'Foil lets you aim it.',
        say:'Which means foil is useful. It does not absorb the sunlight, it bounces it, so you can point it wherever you want.',
        draw:function(){ return '<circle cx="248" cy="56" r="18" fill="#F2A13C"/>'+
          '<path d="M232,72 L120,116" stroke="#F2C14E" stroke-width="3" stroke-dasharray="6 5"/>'+
          box(84,104,64,26,'#C8D4DE',5); } },
      { cap:'Glass lets light in and traps the heat.',
        say:'And clear plastic or glass does something clever. Light goes straight through it, but once that light has become heat, it cannot get back out.',
        draw:function(){ return box(96,84,128,52,'#DCEAF4',7)+
          '<path d="M118,70 L136,84" stroke="#F2C14E" stroke-width="3"/>'+
          at(160,118,'&#127777;&#65039;',22); } },
      { cap:'Put all three together and you have an oven.',
        say:'Black to absorb, foil to aim, and a lid to trap. Put all three in a pizza box and you have built something that cooks with no fuel at all.',
        draw:function(){ return box(84,80,152,58,'#C9A46B',8)+box(96,90,128,40,'#16283A',5)+
          '<circle cx="262" cy="52" r="16" fill="#F2A13C"/>'+at(160,118,'&#127851;',20); } },
      { cap:'Take one away and it barely warms up.',
        say:'And here is your experiment. Take any one of the three away, and it hardly warms at all. Try it, and you will know exactly what each part was for.',
        draw:function(){ return box(84,80,152,58,'#C9A46B',8)+box(96,90,128,40,'#EDE6D8',5)+at(160,118,'&#10060;',20); } }
    ]},

    /* ---------------- Drying the Harvest ---------------- */
    drying: { guide:'Mason', img:'img/guide-mason.png',
      sky:'linear-gradient(#F1E9F5,#F3EFE4 62%)', scenes:[
      { cap:'Food does not just go bad on its own.',
        say:'Hi, I am Mason. Food does not rot because time passed. It rots because something moved in and started eating it.',
        draw:function(){ return at(160,102,'&#127807;',40)+at(120,78,'&#129440;',18)+at(200,80,'&#129440;',18); } },
      { cap:'Mould and bacteria need three things.',
        say:'Mould and bacteria need three things to grow. Warmth. Food. And water. Take away any one of them and they stop.',
        draw:function(){ return at(104,100,'&#127777;&#65039;',26)+at(160,100,'&#127859;',26)+at(216,100,'&#128167;',26); } },
      { cap:'Warmth and food are hard to remove. Water is not.',
        say:'You cannot take the food away, obviously. And keeping everything cold takes a fridge. But the water? The water you can just let leave.',
        draw:function(){ return at(160,100,'&#128167;',40)+at(160,60,'&#10060;',22); } },
      { cap:'That is all drying is.',
        say:'So you hang your herbs somewhere warm and airy, and the water walks out into the air. Nothing left to drink. Nothing can grow.',
        draw:function(){ return at(112,96,'&#127807;',30)+at(160,96,'&#127807;',30)+at(208,96,'&#127807;',30)+
          '<path d="M84,72 L236,72" stroke="#8A6642" stroke-width="3"/>'; } },
      { cap:'Dry enough means it crumbles, not bends.',
        say:'And here is how you know it is done. A dry leaf crumbles. A leaf that bends is still holding water, and water in the jar is where mould starts.',
        draw:function(){ return at(120,102,'&#127807;',34)+at(206,102,'&#129386;',30)+
          '<text x="120" y="140" font-size="11" text-anchor="middle" font-family="Nunito" font-weight="800" fill="#16283A">crumbles</text>'+
          '<text x="206" y="140" font-size="11" text-anchor="middle" font-family="Nunito" font-weight="800" fill="#16283A">bends</text>'; } },
      { cap:'Canning is different. That one needs a grown-up.',
        say:'One last thing, and I mean it. Drying herbs is safe to do yourself. Putting food in sealed jars is not. That needs a grown-up and tested instructions, every single time.',
        draw:function(){ return at(160,100,'&#129387;',40)+at(160,58,'&#9888;&#65039;',22); } }
    ]},

    /* ---------------- Saving Seeds ---------------- */
    seedsaving: { guide:'Mason', img:'img/guide-mason.png',
      sky:'linear-gradient(#EFE7DC,#EAF1E5 62%)', scenes:[
      { cap:'A seed is alive. It is just asleep.',
        say:'Hi, I am Mason. A seed is not a thing. It is a plant, alive, and asleep. Everything it needs to wake up is already packed inside.',
        draw:function(){ return at(160,102,'&#127792;',44)+at(160,62,'&#128164;',20); } },
      { cap:'Save from your best plant, not your worst.',
        say:'So take your seed from the best plant you grew. The one that did well here, in your soil, in your heat. Those are the traits you are keeping.',
        draw:function(){ return at(108,100,'&#127803;',36)+at(212,104,'&#129761;',28)+
          '<text x="108" y="140" font-size="11" text-anchor="middle" font-family="Nunito" font-weight="800" fill="#16283A">this one</text>'; } },
      { cap:'Wait until the plant says it is finished.',
        say:'And wait. A brown rattling pod. A sunflower head that has drooped. The plant tells you when the seed is finished. Take it early and it will not grow.',
        draw:function(){ return at(112,100,'&#127806;',32)+at(208,100,'&#129362;',32)+
          '<text x="112" y="140" font-size="11" text-anchor="middle" font-family="Nunito" font-weight="800" fill="#16283A">ready</text>'+
          '<text x="208" y="140" font-size="11" text-anchor="middle" font-family="Nunito" font-weight="800" fill="#16283A">not yet</text>'; } },
      { cap:'Then dry it properly. Really properly.',
        say:'Spread them out somewhere airy for a week. Press a fingernail in. If it dents, it is not dry, and a damp seed in a sealed jar turns to mould.',
        draw:function(){ return at(120,98,'&#127792;',22)+at(150,98,'&#127792;',22)+at(180,98,'&#127792;',22)+at(210,98,'&#127792;',22)+
          '<path d="M100,120 L230,120" stroke="#C9B48F" stroke-width="4"/>'; } },
      { cap:'Cool, dark, dry — and write the year on it.',
        say:'Then a paper envelope, somewhere cool and dark. Write what it is and the year, because seeds get less reliable as they age and next spring you will not remember.',
        draw:function(){ return box(112,84,96,54,'#EDE2CB',6)+
          '<text x="160" y="108" font-size="12" text-anchor="middle" font-family="Nunito" font-weight="800" fill="#16283A">SUNFLOWER</text>'+
          '<text x="160" y="124" font-size="11" text-anchor="middle" font-family="Nunito" fill="#7A8892">saved this year</text>'; } },
      { cap:'And next spring, you do not buy anything.',
        say:'And that is the whole point. Next spring you open a drawer instead of a shop, and the garden starts again from a plant you chose yourself.',
        draw:function(){ return at(112,100,'&#129379;',30)+at(160,100,'&#10145;&#65039;',22)+at(210,100,'&#127793;',32); } }
    ]}
  };

  function makeMount(F){
    return function (host, guideName, guideImg){
      if (!host) return;
      var SCENES = F.scenes;
      host.innerHTML =
        '<div class="pmv" style="background:'+F.sky+'">'+
          '<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid meet"></svg>'+
          '<div class="pmv-guide"><img src="'+(guideImg||F.img)+'" alt="'+(guideName||F.guide)+'"></div>'+
          '<div class="pmv-dots">'+ SCENES.map(function(){ return '<i></i>'; }).join('') +'</div>'+
          '<div class="pmv-ctl"><button data-a="replay">Start again</button></div>'+
          '<div class="pmv-cap"></div>'+
          '<div class="pmv-start"><div>&#9654;&nbsp; Watch '+(guideName||F.guide)+' explain</div></div>'+
        '</div>';
      var root = host.querySelector('.pmv'), svg = root.querySelector('svg');
      var cap = root.querySelector('.pmv-cap'), dots = root.querySelectorAll('.pmv-dots i');
      var start = root.querySelector('.pmv-start'), i = 0, playing = false;

      function paint(){
        svg.innerHTML = SCENES[i].draw();
        cap.textContent = SCENES[i].cap;
        for (var d=0; d<dots.length; d++) dots[d].classList.toggle('on', d <= i);
      }
      function advance(){
        if (!playing) return;
        if (i >= SCENES.length - 1){ playing = false; return; }
        i++; paint(); narrate();
      }
      function narrate(){
        if (global.TGAudio && TGAudio.supported && TGAudio.enabled())
          TGAudio.sayThen(SCENES[i].say, advance, 4600);
        else setTimeout(advance, 4400);
      }
      function play(){ start.style.display='none'; playing = true; i = 0; paint(); narrate(); }
      start.onclick = play;
      root.querySelector('[data-a="replay"]').onclick = function(){
        if (global.TGAudio) TGAudio.stop(); play(); };
      root.onclick = function(e){
        if (!playing || e.target.closest('button')) return;
        if (global.TGAudio) TGAudio.stop(); advance(); };
      paint();
    };
  }

  global.TGMovies = global.TGMovies || {};
  Object.keys(FILMS).forEach(function(k){
    global.TGMovies[k] = { scenes: FILMS[k].scenes.length, mount: makeMount(FILMS[k]) };
  });
})(window);

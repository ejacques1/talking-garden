/* ------------------------------------------------------------------
   Competency check — The Talking Garden
   ------------------------------------------------------------------
   Measures COMPETENCIES GAINED, not a raw score.

   Every question is tagged with a competency, and every competency is
   tied to a TEKS student expectation. The report says which competencies
   a child did not have before the session and does have after — which is
   a far better answer for a funder than "went from 2/6 to 4/6".

   TEACHER SETTINGS — the two decisions below belong to the educator,
   not to the software. Both are safe to change.

     MODE  'same'    pre and post ask the identical questions.
                     Cleanest comparison, but children may recall answers.
           'matched' pre and post draw DIFFERENT questions covering the
                     SAME competencies. Comparison stays valid because
                     it is per-competency, not per-item. Default.

     PER_COMPETENCY  how many questions test each competency.
                     More questions = more reliable, but more fatigue for
                     a kindergartener. Start at 2 and let the teacher tune.

   To add questions: drop more entries into BANK with a `c` competency id.
   Nothing else needs to change — length is derived, never hard-coded.
------------------------------------------------------------------- */
(function (global) {

  var MODE = 'matched';
  var PER_COMPETENCY = 2;

  /* ---- competencies, each tied to a real TEKS expectation ---- */
  var COMPETENCIES = {
    plant: [
      { id:'cycle',  label:'Knows the order of a plant’s life cycle', teks:'K.13(C)' },
      { id:'needs',  label:'Knows what a plant depends on to grow',   teks:'K.12(A)' },
      { id:'parts',  label:'Knows plant parts and what each one does', teks:'2.13(A)' },
      { id:'weeat',  label:'Can tell which plant part a food comes from', teks:'2.13(A)' }
    ]
  };

  /* ---- question bank: several per competency so pre and post can differ ---- */
  var BANK = {
    plant: [
      { c:'cycle', q:'What comes first in a plant’s life?',
        opts:[{e:'&#129700;',t:'A seed',ok:1},{e:'&#127803;',t:'A flower'},{e:'&#127793;',t:'A sprout'},{e:'&#127822;',t:'A fruit'}] },
      { c:'cycle', q:'What comes right after the flower?',
        opts:[{e:'&#127822;',t:'Fruit and seeds',ok:1},{e:'&#129700;',t:'A seedling'},{e:'&#127807;',t:'A new stem'},{e:'&#129003;',t:'New roots'}] },
      { c:'cycle', q:'A tiny sprout grows into what next?',
        opts:[{e:'&#127807;',t:'A plant with leaves',ok:1},{e:'&#129700;',t:'A seed again'},{e:'&#127822;',t:'A fruit straight away'},{e:'&#129003;',t:'Nothing at all'}] },

      { c:'cycle', q:'After the fruit, what starts the cycle all over again?',
        opts:[{e:'&#129700;',t:'A new seed',ok:1},{e:'&#127803;',t:'Another flower'},{e:'&#127807;',t:'More leaves'},{e:'&#129003;',t:'Deeper roots'}] },

      { c:'needs', q:'Which one does a plant NOT need?',
        opts:[{e:'&#9728;&#65039;',t:'Sunlight'},{e:'&#128167;',t:'Water'},{e:'&#127853;',t:'Candy',ok:1},{e:'&#129704;',t:'Good soil'}] },
      { c:'needs', q:'What does a plant drink to stay alive?',
        opts:[{e:'&#128167;',t:'Water',ok:1},{e:'&#129371;',t:'Milk'},{e:'&#127862;',t:'Juice'},{e:'&#9749;',t:'Coffee'}] },
      { c:'needs', q:'Where does a plant get its energy?',
        opts:[{e:'&#9728;&#65039;',t:'The sun',ok:1},{e:'&#128161;',t:'A lamp at night'},{e:'&#128266;',t:'Music'},{e:'&#127788;&#65039;',t:'The wind'}] },

      { c:'needs', q:'What do roots take from the soil besides water?',
        opts:[{e:'&#129704;',t:'Nutrients',ok:1},{e:'&#129001;',t:'Rocks'},{e:'&#128028;',t:'Worms'},{e:'&#127810;',t:'Sticks'}] },

      { c:'parts', q:'What do a plant’s roots do?',
        opts:[{e:'&#128167;',t:'Drink water',ok:1},{e:'&#9728;&#65039;',t:'Catch sunlight'},{e:'&#128029;',t:'Call the bees'},{e:'&#127807;',t:'Make seeds'}] },
      { c:'parts', q:'Which part catches the sunlight?',
        opts:[{e:'&#129003;',t:'Roots'},{e:'&#127807;',t:'Leaves',ok:1},{e:'&#127807;',t:'Stem'},{e:'&#127793;',t:'Seed'}] },
      { c:'parts', q:'What is the stem’s job?',
        opts:[{e:'&#127807;',t:'Carry water up the plant',ok:1},{e:'&#128167;',t:'Store the rain'},{e:'&#127803;',t:'Attract the bees'},{e:'&#129003;',t:'Hold the seeds'}] },

      { c:'parts', q:'Which part makes the seeds for new plants?',
        opts:[{e:'&#127800;',t:'The flower',ok:1},{e:'&#129003;',t:'The roots'},{e:'&#127807;',t:'The leaves'},{e:'&#127807;',t:'The stem'}] },

      { c:'weeat', q:'A carrot is which part of the plant?',
        opts:[{e:'&#129003;',t:'Root',ok:1},{e:'&#127807;',t:'Leaf'},{e:'&#127800;',t:'Flower'},{e:'&#127793;',t:'Seed'}] },
      { c:'weeat', q:'Broccoli is which part of the plant?',
        opts:[{e:'&#127800;',t:'Flower',ok:1},{e:'&#129003;',t:'Root'},{e:'&#127807;',t:'Leaf'},{e:'&#127793;',t:'Seed'}] },
      { c:'weeat', q:'Lettuce is which part of the plant?',
        opts:[{e:'&#127807;',t:'Leaf',ok:1},{e:'&#129003;',t:'Root'},{e:'&#127800;',t:'Flower'},{e:'&#127793;',t:'Seed'}] },
      { c:'weeat', q:'Corn is which part of the plant?',
        opts:[{e:'&#127793;',t:'Seed',ok:1},{e:'&#129003;',t:'Root'},{e:'&#127807;',t:'Leaf'},{e:'&#127800;',t:'Flower'}] }
    ]
  };

  var st = null;
  function el(id){ return document.getElementById(id); }
  function key(topic, phase, child){ return 'tg_comp_'+topic+'_'+phase+'_'+(child||'me'); }

  function save(topic, phase, child, per){
    try{ localStorage.setItem(key(topic,phase,child), JSON.stringify(per)); }catch(e){}
  }
  function read(topic, phase, child){
    try{ return JSON.parse(localStorage.getItem(key(topic,phase,child))); }catch(e){ return null; }
  }

  /* Build the question set. In 'matched' mode the post-test takes
     different items covering the same competencies. */
  function build(topic, phase){
    var comps = COMPETENCIES[topic], bank = BANK[topic], out = [];
    comps.forEach(function(c){
      var pool = bank.filter(function(q){ return q.c === c.id; });
      var offset = (MODE === 'matched' && phase === 'post') ? PER_COMPETENCY : 0;
      for (var i = 0; i < PER_COMPETENCY; i++){
        out.push(pool[(offset + i) % pool.length]);
      }
    });
    return out;
  }

  async function saveRemote(topic, phase, childId, score, outOf){
    if (global.TG_DEMO || !childId) return;
    try{
      var mod = await import('https://esm.sh/@supabase/supabase-js@2');
      var c = mod.createClient(global.TG_CONFIG.SUPABASE_URL, global.TG_CONFIG.SUPABASE_ANON_KEY);
      await c.from('quiz_results').upsert(
        { child_id: childId, topic_slug: topic, phase: phase, score: score, out_of: outOf },
        { onConflict: 'child_id,topic_slug,phase' });
    }catch(e){}
  }

  function render(){
    var body = el('playBd'), Q = st.qs;

    if (st.stage === 'who'){
      if (global.TGAudio) TGAudio.say('Who is playing?');
      body.innerHTML = '<div class="q">Who’s playing?</div><div class="qs">So we can save your progress.</div>'+
        '<div class="grid2">'+ st.kids.map(function(k,i){
          return '<button class="opt" data-k="'+i+'"><span class="e">&#127803;</span>'+k.name+'</button>'; }).join('') +'</div>';
      [].forEach.call(body.querySelectorAll('.opt'), function(b){
        b.onclick=function(){ st.child=st.kids[+b.dataset.k]; st.stage='ask'; render(); }; });
      return;
    }

    if (st.i >= Q.length){
      // tally per competency: a competency counts as held when ALL its items are right
      var per = {};
      COMPETENCIES[st.topic].forEach(function(c){
        var items = Q.map(function(q,i){ return {q:q,i:i}; }).filter(function(x){ return x.q.c===c.id; });
        per[c.id] = items.every(function(x){ return st.right[x.i]; });
      });
      var correct = st.right.filter(Boolean).length;
      per.__correct = correct; per.__of = Q.length;
      save(st.topic, st.phase, st.child && st.child.name, per);
      var score = COMPETENCIES[st.topic].filter(function(c){ return per[c.id]; }).length;
      saveRemote(st.topic, st.phase, st.child && st.child.id, score, COMPETENCIES[st.topic].length);

      if (st.phase === 'pre'){
        body.innerHTML = '<div class="win"><div class="m">&#127793;</div><h3>All done!</h3>'+
          '<p>Thanks '+(st.child?st.child.name:'')+' — that’s our starting point. '+
          'You answered <b>'+correct+' of '+Q.length+'</b> questions right today.</p>'+
          '<p style="font-size:13.5px;color:var(--muted);margin-top:8px">We’ll ask about the same four skills again after the live session.</p>'+
          '<button class="btn btn-primary" id="qDone" style="width:auto">See you Saturday &rarr;</button></div>';
      } else {
        var before = read(st.topic,'pre', st.child && st.child.name) || {};
        var rows = COMPETENCIES[st.topic].map(function(c){
          var had = !!before[c.id], has = !!per[c.id];
          var state = has && !had ? 'gained' : (has ? 'kept' : 'notyet');
          var icon  = state==='gained' ? '&#11088;' : (state==='kept' ? '&#9989;' : '&#8226;');
          var note  = state==='gained' ? 'New!' : (state==='kept' ? 'Already knew it' : 'Keep practising');
          return '<div class="crow '+state+'"><span class="ci">'+icon+'</span>'+
                 '<span class="cl">'+c.label+'<em>'+c.teks+' &middot; '+note+'</em></span></div>';
        }).join('');
        var gained = COMPETENCIES[st.topic].filter(function(c){ return per[c.id] && !before[c.id]; }).length;
        body.innerHTML = '<div class="win"><div class="m">&#127775;</div>'+
          '<h3>'+(gained ? 'You gained '+gained+' new '+(gained===1?'skill':'skills')+'!' : 'Nice work!')+'</h3>'+
          '<p style="font-size:14px;color:var(--muted);margin-bottom:4px">'+
            'You answered <b>'+correct+' of '+Q.length+'</b> questions right. '+
            'A skill counts once you get <b>both</b> of its questions.</p>'+
          '<div class="crows">'+rows+'</div>'+
          '<button class="btn btn-primary" id="qDone" style="width:auto">Get my certificate &rarr;</button></div>';
      }
      el('qDone').onclick = function(){ global.TGQuiz.close(); if (st.onDone) st.onDone(st); };
      return;
    }

    var q = Q[st.i];
    if (global.TGAudio) TGAudio.readQuestion(q.q, q.opts.map(function(o){ return o.t; }));
    body.innerHTML = '<div class="q">'+q.q+'</div>'+
      '<div class="qs">Question '+(st.i+1)+' of '+Q.length+'</div>'+
      '<div class="grid2">'+ q.opts.map(function(o,i){
        return '<button class="opt" data-i="'+i+'"><span class="e">'+o.e+'</span>'+o.t+'</button>'; }).join('') +'</div>'+
      '<div class="say" id="qSay">'+(st.phase==='pre'?'Just pick the one you think is right.':'Give it your best go!')+'</div>'+
      '<div class="pbar"><i style="width:'+(st.i/Q.length*100)+'%"></i></div>';

    [].forEach.call(body.querySelectorAll('.opt'), function(b){
      b.onclick=function(){
        var picked=q.opts[+b.dataset.i], right=!!picked.ok;
        st.right[st.i]=right;
        if(st.phase==='pre'){ b.classList.add('right'); el('qSay').textContent='Got it — next one!'; if(global.TGAudio) TGAudio.say('Got it! Next one.'); }
        else{
          b.classList.add(right?'right':'wrong');
          if(!right){
            [].forEach.call(body.querySelectorAll('.opt'),function(x){ if(q.opts[+x.dataset.i].ok) x.classList.add('right'); });
            var corr='The answer is '+q.opts.filter(function(o){return o.ok})[0].t+'.';
            el('qSay').textContent=corr;
            if(global.TGAudio) TGAudio.say(corr);
          } else { el('qSay').textContent='That’s right!'; if(global.TGAudio) TGAudio.say('That is right!'); }
        }
        [].forEach.call(body.querySelectorAll('.opt'),function(x){ x.style.pointerEvents='none'; });
        setTimeout(function(){ st.i++; render(); }, st.phase==='pre'?450:1100);
      };
    });
  }

  global.TGQuiz = {
    settings: { mode:MODE, perCompetency:PER_COMPETENCY,
                competencies:function(t){ return COMPETENCIES[t]||[]; } },
    open: function(topic, phase, kids, onDone){
      if(!BANK[topic]) return;
      var qs = build(topic, phase);
      st = { topic:topic, phase:phase, qs:qs, i:0, right:[], kids:kids||[],
             child:(kids&&kids.length===1)?kids[0]:null,
             stage:(kids&&kids.length>1)?'who':'ask', onDone:onDone };
      el('playTitle').textContent = (phase==='pre'?'Before we start':'Show what you grew');
      el('ovl').classList.add('on'); document.body.style.overflow='hidden';
      render();
    },
    close: function(){ el('ovl').classList.remove('on'); document.body.style.overflow=''; },
    /* "2 of 4 skills" rather than a raw mark */
    result: function(topic, phase, child){
      var per = read(topic, phase, child); if(!per) return null;
      var comps = COMPETENCIES[topic]||[];
      return comps.filter(function(c){ return per[c.id]; }).length + '/' + comps.length;
    },
    /* "6 of 8 questions" — the number a parent expects to see. */
    raw: function(topic, phase, child){
      var per = read(topic, phase, child);
      if(!per || per.__of == null) return null;
      return per.__correct + '/' + per.__of;
    },
    gained: function(topic, child){
      var a = read(topic,'pre',child), b = read(topic,'post',child);
      if(!a||!b) return null;
      return (COMPETENCIES[topic]||[]).filter(function(c){ return b[c.id] && !a[c.id]; });
    }
  };
})(window);

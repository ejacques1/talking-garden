/* ------------------------------------------------------------------
   The activity engine
   ------------------------------------------------------------------
   Four kinds of activity, driven entirely by the data in lessons.js:

     order   put things in the right sequence
     sort    drop things into two or more bins
     match   pair a thing with what it does
     pick    choose an answer, with a real explanation when you miss

   Adding a thirty-sixth activity means adding data, not code. The
   plant lesson's original six are hand-built inside topic.html and
   stay there; this engine covers every lesson written since.

   READ-ALOUD RULE: only ever speak what just changed. An earlier
   version re-read the entire question and all its options after every
   single tap, which made the activity slower the further you got.
------------------------------------------------------------------- */
(function (global) {

  var st = null;

  function el(id){ return document.getElementById(id); }
  function say(t){ if (global.TGAudio && t) TGAudio.say(t); }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

  /* Entities are written as &#nnn; in the data so the source stays
     readable in any editor. Kept as-is for HTML, decoded for speech. */
  function plain(s){ return String(s||'').replace(/&#(\d+);/g, ''); }

  function shuffle(a){
    var r = a.slice();
    for (var i=r.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=r[i]; r[i]=r[j]; r[j]=t; }
    return r;
  }

  function finish(msg, emoji){
    var b = el('playBd');
    b.innerHTML = '<div class="win"><div class="m">'+(emoji||'&#127881;')+'</div>'+
      '<h3>'+esc(msg||'You did it!')+'</h3>'+
      '<p>'+esc(st.act.teaches)+'</p>'+
      '<button class="btn btn-primary" id="pDone" style="width:auto">Done &rarr;</button></div>';
    say(msg||'You did it!');
    /* Read the callback and the id BEFORE closing — close() clears the
       state, so reaching for them afterwards found nothing and no
       activity was ever recorded as finished. */
    var done = st.onDone, id = st.act.id;
    el('pDone').onclick = function(){
      global.TGPlay.close();
      if (done) done(id);
    };
  }

  /* ================= order ================= */
  function renderOrder(){
    var a = st.act;
    if (!st.pool){ st.pool = shuffle(a.items); st.placed = []; }
    var done = st.placed.length === a.items.length;

    el('playBd').innerHTML =
      '<div class="q">'+esc(a.title)+'</div>'+
      '<div class="qs">'+esc(a.prompt)+'</div>'+
      '<div class="slots">'+
        (st.placed.length
          ? st.placed.map(function(i,n){ return '<span class="slot full">'+i.e+' '+esc(i.t)+'</span>'; }).join('')
          : '<span class="slot">Start here</span>')+
      '</div>'+
      '<div class="tray">'+
        st.pool.map(function(i,n){
          var used = st.placed.indexOf(i) > -1;
          return used ? '' :
            '<button class="tile" data-n="'+n+'"><span class="e">'+i.e+'</span>'+esc(i.t)+'</button>';
        }).join('')+
      '</div>'+
      '<div class="say" id="pSay">'+(done?'':'Tap what comes next.')+'</div>'+
      '<div class="pbar"><i style="width:'+(st.placed.length/a.items.length*100)+'%"></i></div>';

    [].forEach.call(el('playBd').querySelectorAll('.tile'), function(b){
      b.onclick = function(){
        var item = st.pool[+b.dataset.n];
        var want = a.items[st.placed.length];
        if (item === want){
          st.placed.push(item);
          /* speak only the new item, never the whole list again */
          say(item.t);
          if (st.placed.length === a.items.length){ finish('That is the right order!','&#9989;'); return; }
          renderOrder();
        } else {
          b.classList.add('no');
          var hint = 'Not yet — something else comes first.';
          el('pSay').textContent = hint; say(hint);
          setTimeout(function(){ b.classList.remove('no'); }, 400);
        }
      };
    });
  }

  /* ================= sort ================= */
  function renderSort(){
    var a = st.act;
    if (!st.queue){ st.queue = shuffle(a.items); st.at = 0; st.wrong = 0; }
    var item = st.queue[st.at];

    el('playBd').innerHTML =
      '<div class="q">'+esc(a.title)+'</div>'+
      '<div class="qs">'+esc(a.prompt)+'</div>'+
      '<div class="big">'+item.e+'</div>'+
      '<div class="q" style="text-align:center;font-size:21px;margin-bottom:14px">'+esc(item.t)+'</div>'+
      '<div class="bins">'+
        a.bins.map(function(bn){
          return '<button class="bin" data-b="'+bn.id+'"><span class="e">'+bn.e+'</span>'+esc(bn.label)+'</button>';
        }).join('')+
      '</div>'+
      '<div class="say" id="pSay"></div>'+
      '<div class="pbar"><i style="width:'+(st.at/a.items.length*100)+'%"></i></div>';

    say(item.t);

    [].forEach.call(el('playBd').querySelectorAll('.bin'), function(b){
      b.onclick = function(){
        if (b.dataset.b === item.bin){
          b.classList.add('sel');
          st.at++;
          if (st.at >= st.queue.length){ finish('All sorted!','&#127881;'); return; }
          setTimeout(renderSort, 240);
        } else {
          st.wrong++;
          b.classList.add('no');
          var right = a.bins.filter(function(x){ return x.id===item.bin; })[0];
          var msg = st.wrong >= 2 && right
            ? esc(item.t)+' goes in '+esc(right.label)+'.'
            : 'Not that one — have another go.';
          el('pSay').innerHTML = msg; say(plain(msg));
          setTimeout(function(){ b.classList.remove('no'); }, 400);
        }
      };
    });
  }

  /* ================= match ================= */
  function renderMatch(){
    var a = st.act;
    if (!st.left){
      st.left  = shuffle(a.pairs);
      st.right = shuffle(a.pairs);
      st.made  = [];
      st.sel   = null;
    }
    el('playBd').innerHTML =
      '<div class="q">'+esc(a.title)+'</div>'+
      '<div class="qs">'+esc(a.prompt)+'</div>'+
      '<div class="cols">'+
        '<div class="col"><h5>This</h5>'+
          st.left.map(function(p,i){
            var done = st.made.indexOf(p) > -1;
            return '<button class="tile'+(done?' ok':'')+(st.sel===p?' sel':'')+'" data-l="'+i+'"'+(done?' disabled':'')+'>'+
                   '<span class="e">'+p.a.e+'</span>'+esc(p.a.t)+'</button>';
          }).join('')+
        '</div>'+
        '<div class="col"><h5>Goes with</h5>'+
          st.right.map(function(p,i){
            var done = st.made.indexOf(p) > -1;
            return '<button class="tile'+(done?' ok':'')+'" data-r="'+i+'"'+(done?' disabled':'')+'>'+
                   esc(p.b.t)+'</button>';
          }).join('')+
        '</div>'+
      '</div>'+
      '<div class="say" id="pSay">'+(st.sel?'Now tap what it goes with.':'Tap one on the left first.')+'</div>'+
      '<div class="pbar"><i style="width:'+(st.made.length/a.pairs.length*100)+'%"></i></div>';

    [].forEach.call(el('playBd').querySelectorAll('[data-l]'), function(b){
      b.onclick = function(){ st.sel = st.left[+b.dataset.l]; say(st.sel.a.t); renderMatch(); };
    });
    [].forEach.call(el('playBd').querySelectorAll('[data-r]'), function(b){
      b.onclick = function(){
        var pick = st.right[+b.dataset.r];
        if (!st.sel){ el('pSay').textContent = 'Tap one on the left first.'; return; }
        if (pick === st.sel){
          st.made.push(pick); st.sel = null;
          if (st.made.length === a.pairs.length){ finish('Every one matched!','&#11088;'); return; }
          renderMatch();
        } else {
          b.classList.add('no');
          var msg = 'Not a match — try another.';
          el('pSay').textContent = msg; say(msg);
          setTimeout(function(){ b.classList.remove('no'); }, 400);
        }
      };
    });
  }

  /* ================= pick ================= */
  function renderPick(){
    var a = st.act;
    if (st.i == null){ st.i = 0; st.miss = 0; }
    if (st.i >= a.questions.length){ finish('Nicely worked out!','&#127942;'); return; }
    var q = a.questions[st.i];

    el('playBd').innerHTML =
      '<div class="q">'+esc(q.q)+'</div>'+
      '<div class="qs">'+esc(a.title)+' &middot; '+(st.i+1)+' of '+a.questions.length+'</div>'+
      '<div class="grid2">'+
        q.opts.map(function(o,i){
          return '<button class="opt" data-i="'+i+'"><span class="e">'+o.e+'</span>'+esc(o.t)+'</button>';
        }).join('')+
      '</div>'+
      '<div class="say" id="pSay">What do you think?</div>'+
      '<div class="pbar"><i style="width:'+(st.i/a.questions.length*100)+'%"></i></div>';

    if (global.TGAudio) TGAudio.readQuestion(q.q, q.opts.map(function(o){ return o.t; }));

    [].forEach.call(el('playBd').querySelectorAll('.opt'), function(b){
      b.onclick = function(){
        var o = q.opts[+b.dataset.i];
        if (o.ok){
          b.classList.add('right');
          el('pSay').textContent = q.why; say(q.why);
          [].forEach.call(el('playBd').querySelectorAll('.opt'), function(x){ x.style.pointerEvents='none'; });
          setTimeout(function(){ st.i++; st.miss=0; renderPick(); }, 2400);
        } else {
          st.miss++;
          b.classList.add('wrong');
          b.style.pointerEvents = 'none';
          if (st.miss >= 2){
            /* Second miss: stop guessing and show the answer with the
               reason. Children were getting stuck on "Actually…" with
               nothing following it. */
            [].forEach.call(el('playBd').querySelectorAll('.opt'), function(x){
              if (q.opts[+x.dataset.i].ok) x.classList.add('right');
              x.style.pointerEvents='none';
            });
            el('pSay').textContent = q.why; say(q.why);
            setTimeout(function(){ st.i++; st.miss=0; renderPick(); }, 2800);
          } else {
            var msg = 'Not that one. Have another go.';
            el('pSay').textContent = msg; say(msg);
          }
        }
      };
    });
  }

  global.TGPlay = {
    open: function(act, onDone){
      st = { act:act, onDone:onDone };
      el('playTitle').textContent = act.title;
      el('ovl').classList.add('on');
      document.body.style.overflow = 'hidden';
      if (act.type === 'order')      renderOrder();
      else if (act.type === 'sort')  renderSort();
      else if (act.type === 'match') renderMatch();
      else                           renderPick();
    },
    close: function(){
      el('ovl').classList.remove('on');
      document.body.style.overflow = '';
      if (global.TGAudio && TGAudio.stop) TGAudio.stop();
      st = null;
    }
  };
})(window);

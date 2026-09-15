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

  /* The hint strip. mood picks Dewey's face beside it (guide.js):
     'ok' wink for a right answer, 'hm' thinking for not yet, 'wait'
     happy while they choose. */
  function tell(html, mood){
    var s = el('pSay'); if (!s) return;
    s.setAttribute('data-mood', mood || 'wait');
    s.innerHTML = html;
  }
  /* ---------- NEW GAME STYLES, ON TRIAL ----------
     Children found tap-only games repetitive. Drag and drop and a
     catch game are on trial in one lesson first, so Erin can see them
     before they spread. Add a lesson slug here to switch them on. */
  var TRY_NEW = ['compost'];
  function trying(){
    var t = new URLSearchParams(location.search).get('t') || '';
    return TRY_NEW.indexOf(t) > -1;
  }

  var GAME_CSS =
    '.dragme{touch-action:none;cursor:grab;user-select:none;-webkit-user-select:none}'+
    '.big.dragme{display:block;width:max-content;margin:0 auto 6px;padding:4px 18px;border-radius:22px;'+
      'border:3px dashed var(--line-d,#cfc9bd);background:#fff;animation:wiggle 2.4s ease-in-out infinite}'+
    '.drag-ghost{position:fixed;z-index:400;pointer-events:none;transform:translate(-50%,-50%) scale(1.08);'+
      'filter:drop-shadow(0 10px 16px rgba(0,0,0,.25));opacity:.95}'+
    '.drop-on{border-color:var(--w,#0071BC)!important;background:var(--wl,#E4F1FA)!important;transform:scale(1.04)}'+
    '.dragging{opacity:.3}'+
    '.hand{display:block;text-align:center;font-size:13px;font-weight:700;color:var(--muted,#6B7785);margin:-2px 0 10px}'+
    '@keyframes wiggle{0%,86%,100%{transform:rotate(0)}90%{transform:rotate(-5deg)}95%{transform:rotate(5deg)}}'+
    /* catch */
    '.sky{position:relative;height:min(380px,52vh);border-radius:18px;overflow:hidden;'+
      'background:linear-gradient(#E4F1FA,#EAF1E5);margin-bottom:12px;touch-action:manipulation}'+
    '.faller{position:absolute;top:0;left:0;border:0;background:rgba(255,255,255,.85);border-radius:50%;'+
      'width:84px;height:84px;font-size:52px;line-height:1;display:grid;place-items:center;cursor:pointer;'+
      'box-shadow:0 4px 10px rgba(0,0,0,.12);padding:0;will-change:transform}'+
    '.faller.got{transition:transform .45s ease-in,opacity .45s;opacity:0}'+
    '.faller .fi{display:block}'+
    '.faller.nope{background:#FBF3D1}.faller.nope .fi{animation:shake .3s}'+
    '.catcher{position:absolute;left:50%;bottom:6px;transform:translateX(-50%);font-size:58px;line-height:1;'+
      'text-align:center;pointer-events:none}'+
    '.catcher small{display:block;font-size:12px;font-weight:800;color:var(--ink,#16283A);background:#fff;'+
      'border-radius:10px;padding:2px 8px;margin-top:2px}'+
    '.catchcount{text-align:center;font-weight:800;font-size:15px;margin-bottom:8px;color:var(--ink,#16283A)}'+
    '@media (prefers-reduced-motion:reduce){.big.dragme{animation:none}}';
  function gameCSS(){
    if (document.getElementById('game-css')) return;
    var c = document.createElement('style'); c.id = 'game-css'; c.textContent = GAME_CSS;
    document.head.appendChild(c);
  }

  /* Drag with a finger or a mouse. Dropping on a target calls its
     onclick, so dragging and tapping share one set of rules — a child
     who taps instead of dragging still gets it right. */
  var justDragged = false;
  function draggable(src, targets){
    src.classList.add('dragme');
    src.addEventListener('pointerdown', function(e){
      if (e.button > 0) return;
      var sx = e.clientX, sy = e.clientY, ghost = null, over = null;
      function hit(x, y){
        var t = document.elementFromPoint(x, y);
        var list = targets();
        for (var i = 0; t && i < list.length; i++) if (list[i].contains(t)) return list[i];
        return null;
      }
      function move(ev){
        if (!ghost){
          if (Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) < 8) return;
          ghost = src.cloneNode(true);
          ghost.classList.add('drag-ghost'); ghost.classList.remove('dragme');
          ghost.style.width = src.offsetWidth + 'px';
          document.body.appendChild(ghost);
          src.classList.add('dragging');
        }
        ev.preventDefault();
        ghost.style.left = ev.clientX + 'px'; ghost.style.top = ev.clientY + 'px';
        var h = hit(ev.clientX, ev.clientY);
        if (h !== over){ if (over) over.classList.remove('drop-on'); over = h; if (over) over.classList.add('drop-on'); }
      }
      function up(ev){
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);
        document.removeEventListener('pointercancel', up);
        if (!ghost) return;                      /* no movement: a tap */
        ghost.remove(); src.classList.remove('dragging');
        if (over) over.classList.remove('drop-on');
        justDragged = true; setTimeout(function(){ justDragged = false; }, 50);
        var h = ev.type === 'pointerup' ? hit(ev.clientX, ev.clientY) : null;
        if (h && h.onclick) h.onclick();
      }
      document.addEventListener('pointermove', move, { passive:false });
      document.addEventListener('pointerup', up);
      document.addEventListener('pointercancel', up);
    });
    /* the click that follows a drag is not a tap */
    src.addEventListener('click', function(e){
      if (justDragged){ e.stopImmediatePropagation(); e.preventDefault(); }
    }, true);
  }

  function strip(text, mood){
    return '<div class="say" id="pSay" data-mood="'+(mood||'wait')+'">'+text+'</div>';
  }
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
    if (st.timer) clearInterval(st.timer);

    /* WHICH BUTTON IS BLUE MATTERS.
       This screen used to make "Play again" the blue one, and a child
       testing it pressed it over and over because blue reads as "this
       is the button". He wanted to leave. So the button that moves
       forward is the loud one now, and repeating is the quiet one.

       Forward also means the NEXT GAME rather than a list of cards to
       re-read and choose from again. */
    var done = st.onDone, id = st.act.id, act = st.act;
    var nxt  = st.next || null;          /* set by the caller, if any */

    b.innerHTML = '<div class="win"><div class="m">'+(emoji||'&#127881;')+'</div>'+
      '<h3>'+esc(msg||'You did it!')+'</h3>'+
      '<p>'+esc(act.teaches)+'</p>'+
      '<div class="winrow">'+
        '<button class="btn btn-primary" id="pNext" style="width:auto">'+
          esc(nxt ? 'Next game' : 'I&rsquo;m done')+' &rarr;</button>'+
        '<button class="btn btn-ghost" id="pAgain" style="width:auto">Play again</button>'+
      '</div></div>';
    say(msg||'You did it!');

    el('pNext').onclick = function(){
      global.TGPlay.close();
      if (done) done(id, nxt);           /* the page decides what next means */
    };
    el('pAgain').onclick = function(){
      /* Record it as finished first — they earned it — then restart. */
      if (done) done(id, null, true);
      global.TGPlay.open(act, done, nxt);
    };
  }

  /* ================= order ================= */
  function renderOrder(){
    var a = st.act;
    if (!st.pool){ st.pool = shuffle(a.items); st.placed = []; }
    var done = st.placed.length === a.items.length;

    el('playBd').innerHTML =
      '<div class="q">'+esc(a.title)+'</div>'+
      '<div class="qs">'+(trying() ? 'Drag them up in the order it happens.' : esc(a.prompt))+'</div>'+
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
      strip(done ? '' : st.placed.length ? 'Yes! What comes next?'
                     : trying() ? 'Drag what comes first up to the line.' : 'Tap what comes next.',
            st.placed.length ? 'ok' : 'wait')+
      '<div class="pbar"><i style="width:'+(st.placed.length/a.items.length*100)+'%"></i></div>';

    var line = el('playBd').querySelector('.slots');
    [].forEach.call(el('playBd').querySelectorAll('.tile'), function(b){
      if (trying()){
        gameCSS();
        draggable(b, function(){ return [line]; });
        /* the line is where it lands: dropping there counts as choosing b */
      }
      b.addEventListener('pointerdown', function(){ st.dragFrom = b; });
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
          tell(hint, 'hm'); say(hint);
          setTimeout(function(){ b.classList.remove('no'); }, 400);
        }
      };
    });
    if (trying()) line.onclick = function(){ if (st.dragFrom) st.dragFrom.onclick(); };
  }

  /* ================= sort ================= */
  function renderSort(){
    var a = st.act;
    if (!st.line){ st.line = shuffle(a.items); st.at = 0; st.wrong = 0; }
    var item = st.line[st.at];

    el('playBd').innerHTML =
      '<div class="q">'+esc(a.title)+'</div>'+
      '<div class="qs">'+esc(a.prompt)+'</div>'+
      '<div class="big" id="sortItem">'+item.e+'</div>'+
      '<div class="q" style="text-align:center;font-size:21px;margin-bottom:'+(trying()?'4px':'14px')+'">'+esc(item.t)+'</div>'+
      (trying() ? '<span class="hand">&#9995; Drag me into a box</span>' : '')+
      '<div class="bins">'+
        a.bins.map(function(bn){
          return '<button class="bin" data-b="'+bn.id+'"><span class="e">'+bn.e+'</span>'+esc(bn.label)+'</button>';
        }).join('')+
      '</div>'+
      strip(st.at ? 'Yes! Where does this one go?'
                  : trying() ? 'Drag it into the right box.' : 'Where does it go? Tap one.', st.at ? 'ok' : 'wait')+
      '<div class="pbar"><i style="width:'+(st.at/a.items.length*100)+'%"></i></div>';

    say(item.t);

    if (trying()){
      gameCSS();
      draggable(el('sortItem'), function(){ return [].slice.call(el('playBd').querySelectorAll('.bin')); });
    }

    [].forEach.call(el('playBd').querySelectorAll('.bin'), function(b){
      b.onclick = function(){
        if (b.dataset.b === item.bin){
          b.classList.add('sel');
          st.at++;
          if (st.at >= st.line.length){ finish('All sorted!','&#127881;'); return; }
          setTimeout(renderSort, 240);
        } else {
          st.wrong++;
          b.classList.add('no');
          var right = a.bins.filter(function(x){ return x.id===item.bin; })[0];
          var msg = st.wrong >= 2 && right
            ? esc(item.t)+' goes in '+esc(right.label)+'.'
            : 'Not that one — have another go.';
          tell(msg, 'hm'); say(plain(msg));
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
      (st.sel ? strip('Now tap what it goes with.')
              : st.made.length ? strip('Yes, a match! Tap another one on the left.', 'ok')
              : strip('Tap one on the left first.'))+
      '<div class="pbar"><i style="width:'+(st.made.length/a.pairs.length*100)+'%"></i></div>';

    [].forEach.call(el('playBd').querySelectorAll('[data-l]'), function(b){
      b.onclick = function(){ st.sel = st.left[+b.dataset.l]; say(st.sel.a.t); renderMatch(); };
    });
    [].forEach.call(el('playBd').querySelectorAll('[data-r]'), function(b){
      b.onclick = function(){
        var pick = st.right[+b.dataset.r];
        if (!st.sel){ tell('Tap one on the left first.'); return; }
        if (pick === st.sel){
          st.made.push(pick); st.sel = null;
          if (st.made.length === a.pairs.length){ finish('Every one matched!','&#11088;'); return; }
          renderMatch();
        } else {
          b.classList.add('no');
          var msg = 'Not a match — try another.';
          tell(msg, 'hm'); say(msg);
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
      strip('What do you think?')+
      '<div class="pbar"><i style="width:'+(st.i/a.questions.length*100)+'%"></i></div>';

    if (global.TGAudio) TGAudio.readQuestion(q.q, q.opts.map(function(o){ return o.t; }));

    [].forEach.call(el('playBd').querySelectorAll('.opt'), function(b){
      b.onclick = function(){
        var o = q.opts[+b.dataset.i];
        if (o.ok){
          b.classList.add('right');
          tell(esc(q.why), 'ok'); say(q.why);
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
            tell(esc(q.why), 'hm'); say(q.why);
            setTimeout(function(){ st.i++; st.miss=0; renderPick(); }, 2800);
          } else {
            var msg = 'Not that one. Have another go.';
            tell(msg, 'hm'); say(msg);
          }
        }
      };
    });
  }

  /* ================= catch =================
     Built from a sort game: the pictures float down, and the child taps
     the ones that belong in one box. The rest just fall away. Slow on
     purpose — this is for five-year-olds, not a reflex test. A good one
     that falls past comes round again, so nobody can lose. */
  function renderCatch(){
    var a = st.act;
    gameCSS();
    var goods = a.items.filter(function(i){ return i.bin === a.want; });
    var box = a.bins.filter(function(b){ return b.id === a.want; })[0] || {};
    var me = st;
    me.caught = []; me.live = 0;

    el('playBd').innerHTML =
      '<div class="q">'+esc(a.title)+'</div>'+
      '<div class="qs">'+esc(a.prompt)+'</div>'+
      '<div class="catchcount" id="cCount"></div>'+
      '<div class="sky" id="sky"><div class="catcher">'+(box.e||'&#129530;')+'<small>'+esc(box.label||'')+'</small></div></div>'+
      strip('Tap the things that go in the '+esc((box.label||'box').toLowerCase().replace(/^(compost it)$/,'compost'))+'!')+
      '<div class="pbar"><i id="cBar" style="width:0%"></i></div>';

    var sky = el('sky');
    function count(){
      el('cCount').innerHTML = '&#11088; '+me.caught.length+' of '+goods.length;
      el('cBar').style.width = (me.caught.length/goods.length*100)+'%';
    }
    count();

    var deck = [];
    function draw(){
      if (!deck.length) deck = shuffle(a.items.filter(function(i){ return me.caught.indexOf(i) < 0; }));
      return deck.shift();
    }

    function drop(){
      if (st !== me) return;
      if (me.live >= 2) return;
      var item = draw(); if (!item) return;
      var good = item.bin === a.want;
      var b = document.createElement('button');
      b.className = 'faller'; b.type = 'button';
      b.innerHTML = '<span class="fi">'+item.e+'</span>'; b.setAttribute('aria-label', item.t);
      var W = sky.clientWidth - 84, H = sky.clientHeight;
      var x = Math.round(Math.random() * Math.max(W, 0));
      b.style.transform = 'translate('+x+'px,-90px)';
      sky.appendChild(b);
      me.live++;

      var t0 = performance.now(), ms = 7000, gone = false;
      function fall(now){
        if (gone || st !== me) return;
        var y = -90 + (H + 90) * Math.min(1, (now - t0) / ms);
        b.style.transform = 'translate('+x+'px,'+y+'px)';
        if (now - t0 >= ms){ gone = true; b.remove(); me.live--; return; }
        requestAnimationFrame(fall);
      }
      requestAnimationFrame(fall);

      b.onclick = function(){
        if (gone) return;
        if (good){
          gone = true; me.live--;
          me.caught.push(item); count();
          tell('Yes! You caught it!', 'ok'); say(item.t);
          var r = b.getBoundingClientRect(), s = sky.getBoundingClientRect();
          b.classList.add('got');
          b.style.transform = 'translate('+(s.width/2-42)+'px,'+(s.height-70)+'px) scale(.4)';
          setTimeout(function(){ b.remove(); }, 460);
          if (me.caught.length >= goods.length){
            setTimeout(function(){ if (st === me) finish('You caught them all!','&#129530;'); }, 600);
          }
        } else {
          b.classList.remove('nope'); void b.offsetWidth; b.classList.add('nope');
          var msg = 'Not that one. Let it fall.';
          tell(msg, 'hm'); say(msg);
        }
      };
    }

    drop();
    me.timer = setInterval(drop, 2300);
  }

  /* Catch games made from a lesson's sort games, for lessons on trial. */
  function extras(L){
    if (!L || TRY_NEW.indexOf(L.slug) < 0) return [];
    var out = [];
    (L.activities||[]).forEach(function(a){
      if (a.type !== 'sort' || !a.bins || !a.items || out.length) return;
      var want = a.bins[0];
      out.push({
        id: a.id + 'catch', type:'catch', after: a.id,
        title: 'Catch It!', emoji:'&#129530;',
        teaches: a.teaches,
        prompt: 'Tap the things that go in the box as they fall.',
        want: want.id, bins: a.bins, items: a.items
      });
    });
    return out;
  }

  /* HOW TO PLAY, said out loud the moment a game opens (Erin, 2026-09-14:
     kids opened a game and did not know what to do). Robot voice for
     now; one Dewey clip per game type could replace these later. */
  function howTo(a){
    if (a.type === 'sort')  return trying() ? 'Drag each picture into the box where it belongs.'
                                            : 'Tap the box where each picture belongs.';
    if (a.type === 'order') return trying() ? 'Drag the pictures up in the order they happen. Start with what happens first.'
                                            : 'Tap the pictures in the order they happen. Start with what happens first.';
    if (a.type === 'match') return 'Tap a picture on the left. Then tap the one on the right that goes with it.';
    if (a.type === 'catch') return 'Tap the things that go in the box as they fall. Let the others fall.';
    if (a.type === 'custom') return plain(a.prompt) || 'Tap to play.';
    return 'Tap the answer you think is right.';
  }

  /* Passed to custom renderers so they do not each reinvent speech,
     shuffling or escaping. */
  var helpers = { say: say, esc: esc, shuffle: shuffle, plain: plain };

  global.TGPlay = {
    custom: {},
    open: function(act, onDone, next){
      st = { act:act, onDone:onDone, next:next || null };
      if (global.TGAudio && TGAudio.lead) TGAudio.lead(howTo(act));
      el('playTitle').textContent = act.title;
      el('ovl').classList.add('on');
      document.body.style.overflow = 'hidden';
      /* A lesson can bring its own activity — the plant lesson has
         always had hand-built ones, and a generic sorter is not always
         the truest way to teach a thing. A custom renderer registers
         itself in TGPlay.custom and gets the same finish() and the same
         progress tracking as the four built-in types. */
      if (act.type === 'custom' && global.TGPlay.custom[act.render])
        global.TGPlay.custom[act.render](el('playBd'), act, finish, helpers);
      else if (act.type === 'order')      renderOrder();
      else if (act.type === 'sort')  renderSort();
      else if (act.type === 'match') renderMatch();
      else if (act.type === 'catch') renderCatch();
      else                           renderPick();
    },
    extras: extras,
    close: function(){
      if (st && st.timer) clearInterval(st.timer);
      el('ovl').classList.remove('on');
      document.body.style.overflow = '';
      if (global.TGAudio && TGAudio.stop) TGAudio.stop();
      st = null;
    }
  };
})(window);

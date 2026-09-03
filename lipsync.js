/* ------------------------------------------------------------------
   Lip sync for the guides
   ------------------------------------------------------------------
   Each guide has two frames: mouth closed and mouth open. Swapping
   between them while the narration plays is how hand-drawn animation
   has always done speech, and it is far more convincing than moving
   the whole character around.

   The open frames were made from DHCG's own artwork by stretching the
   mouth down and taking the extra height out of the chin just below,
   so the picture stays the same size and nothing outside the mouth
   moves. Six mouth boxes, measured by hand off a coordinate grid,
   because at 110 pixels across the automatic detectors kept finding
   eye-whites and jar lids instead.

   The timing is deliberately irregular. A steady swap reads as a
   machine; real speech has pauses in it, so this holds the mouth
   closed now and then the way a person stops between words.
------------------------------------------------------------------- */
(function (global) {

  function talkSrc(src){
    return String(src||'').replace(/\.png(\?.*)?$/, '-talk.png$1');
  }

  var Lip = {

    /* Preload the open frame so the first swap is not a blank flash. */
    preload: function (src){
      var i = new Image(); i.src = talkSrc(src); return i;
    },

    /* Start mouthing on an <img>. Returns a stop function. */
    start: function (img){
      if (!img) return function(){};
      var closed = img.getAttribute('src');
      var open   = talkSrc(closed);
      if (open === closed) return function(){};
      Lip.preload(closed);

      var on = false, timer = null, alive = true;
      function tick(){
        if (!alive) return;
        /* A pause every so often, so it reads as speech and not a
           flapping puppet. */
        var pause = Math.random() < 0.18;
        on = pause ? false : !on;
        img.setAttribute('src', on ? open : closed);
        timer = setTimeout(tick, pause ? 220 + Math.random()*180
                                       : 95  + Math.random()*95);
      }
      tick();

      return function stop(){
        alive = false;
        if (timer) clearTimeout(timer);
        img.setAttribute('src', closed);
      };
    }
  };

  global.TGLip = Lip;
})(window);

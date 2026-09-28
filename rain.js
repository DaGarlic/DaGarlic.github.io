(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  var canvas = document.createElement('canvas');
  canvas.className = 'rain-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(canvas, document.body.firstChild);

  var ctx = canvas.getContext('2d');
  var CHARS = '01ABCDEFHKLMNPQRSTXYZΔΣΞ<>/\\|+-*'.split('');
  var FONT_SIZE = 15;
  var STEP_MS = 60;

  var cols, drops, w, h;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / FONT_SIZE);
    drops = new Array(cols).fill(0).map(function () {
      return Math.random() * -h / FONT_SIZE;
    });
    ctx.clearRect(0, 0, w, h);
  }

  function tick() {
    ctx.fillStyle = 'rgba(5, 6, 8, 0.16)';
    ctx.fillRect(0, 0, w, h);

    ctx.font = FONT_SIZE + 'px "JetBrains Mono", monospace';
    ctx.textBaseline = 'top';

    for (var i = 0; i < cols; i++) {
      var char = CHARS[(Math.random() * CHARS.length) | 0];
      var x = i * FONT_SIZE;
      var y = drops[i] * FONT_SIZE;

      if (y >= 0) {
        ctx.fillStyle = 'rgba(43, 228, 214, 0.85)';
        ctx.shadowColor = 'rgba(43, 228, 214, 0.8)';
        ctx.shadowBlur = 6;
        ctx.fillText(char, x, y);
        ctx.shadowBlur = 0;
      }

      if (y > h && Math.random() > 0.975) {
        drops[i] = 0;
      } else {
        drops[i]++;
      }
    }
  }

  resize();
  window.addEventListener('resize', resize);
  window.setInterval(tick, STEP_MS);
})();

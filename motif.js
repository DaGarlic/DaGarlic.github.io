(function () {
  var el = document.querySelector('.motif');
  if (!el) return;

  var COLS = 48;
  var ROWS = 3;
  var seed = 7;

  function rnd() {
    seed = (seed + 0x6d2b79f5) | 0;
    var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  var frag = document.createDocumentFragment();
  for (var y = 0; y < ROWS; y++) {
    for (var x = 0; x < COLS; x++) {
      var cell = document.createElement('i');
      var reach = x / (COLS - 1);
      if (rnd() < 0.25 + 0.7 * reach) {
        var fitness = 0.25 + 0.75 * Math.abs(Math.sin(x * 0.31 + y * 1.3)) * (0.5 + 0.5 * rnd());
        cell.className = 'on';
        cell.style.setProperty('--o', fitness.toFixed(2));
        cell.style.animationDelay = Math.round(x * 28 + rnd() * 500) + 'ms';
      }
      frag.appendChild(cell);
    }
  }
  el.appendChild(frag);
})();

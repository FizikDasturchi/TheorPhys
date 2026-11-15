/* Light-theme backdrop: a sheet of spacetime.
 *
 * A fine grid on warm paper, bent by two masses: a heavy one on the right (with a small "shadow" and a
 * glowing ring, like the hero above) and a light one that follows the pointer. When the pointer is
 * idle, or on a touch screen, the light mass orbits the heavy one. A few faint stars are bent as well.
 * It is drawn on a fixed canvas behind the page, only in the light theme, and never blocks clicks.
 * With "reduce motion" switched on, it is drawn once and stays still. Without canvas support the
 * warm paper gradient from style.css is all that remains.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var mqDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var mqReduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var cv = null, ctx = null, W = 0, H = 0, dpr = 1, raf = 0, last = 0;
  var STEP = 44;                              /* grid spacing, css px */
  var stars = [];
  var ptr = { x: 0, y: 0, ax: 0, ay: 0, t: -1e9 };   /* pointer target, smoothed position, last move time */

  function isLight() {
    var th = root.getAttribute('data-theme');
    if (th === 'light') return true;
    if (th === 'dark') return false;
    return !(mqDark && mqDark.matches);
  }
  function reduce() { return !!(mqReduce && mqReduce.matches); }

  function setup() {
    if (cv) return true;
    cv = document.createElement('canvas');
    cv.id = 'spacetime';
    cv.setAttribute('aria-hidden', 'true');
    /* inline, so a stale cached style.css can never let the canvas push the page around */
    cv.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:100%;z-index:-1;pointer-events:none;display:block;';
    ctx = cv.getContext && cv.getContext('2d');
    if (!ctx) { cv = null; return false; }
    document.body.insertBefore(cv, document.body.firstChild);
    var seed = 20261015;                       /* the same stars on every visit */
    function rnd() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
    for (var i = 0; i < 70; i++) stars.push({ x: rnd(), y: rnd(), r: 0.6 + rnd() * 1.1, a: 0.18 + rnd() * 0.32, hot: rnd() < 0.3 });
    return true;
  }

  function resize() {
    if (!cv) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!ptr.ax) { ptr.x = ptr.ax = W * 0.35; ptr.y = ptr.ay = H * 0.6; }
    draw(performance.now());
  }

  /* pull a point towards a mass: near the mass the sheet is squeezed, far away it is untouched */
  function bend(p, m) {
    var dx = p.x - m.x, dy = p.y - m.y, f = m.a / (1 + (dx * dx + dy * dy) / (m.s * m.s));
    p.x -= dx * f; p.y -= dy * f;
  }

  function draw(now) {
    if (!cv) return;
    var sc = window.pageYOffset || 0, calm = reduce();
    var u = Math.min(W, H);
    var tt = calm ? 0 : now / 1000;
    /* heavy mass: right side, drifting a little */
    var big = { x: W * 0.84 + Math.sin(tt * 0.11) * 14, y: H * 0.34 + Math.cos(tt * 0.09) * 10 - Math.min(sc, 600) * 0.05, a: 0.62, s: u * 0.2 };
    /* light mass: follows the pointer while it moves, otherwise orbits the heavy one */
    var idle = (now - ptr.t) > 5000 || calm;
    var orb = { x: big.x + Math.cos(tt * 0.32) * u * 0.36, y: big.y + Math.sin(tt * 0.32) * u * 0.2 };
    var tx = idle ? orb.x : ptr.x, ty = idle ? orb.y : ptr.y;
    ptr.ax += (tx - ptr.ax) * 0.06; ptr.ay += (ty - ptr.ay) * 0.06;
    var small = { x: ptr.ax, y: ptr.ay, a: 0.42, s: 120 };

    ctx.clearRect(0, 0, W, H);

    /* warm glow around the heavy mass */
    var g = ctx.createRadialGradient(big.x, big.y, 0, big.x, big.y, u * 0.55);
    g.addColorStop(0, 'rgba(242,145,90,0.34)'); g.addColorStop(0.35, 'rgba(242,145,90,0.12)'); g.addColorStop(1, 'rgba(242,145,90,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    /* the grid; the sheet slides slowly under the page when it is scrolled */
    var off = (sc * 0.18) % STEP, i, x, y, p, k;
    ctx.lineWidth = 1;
    for (k = 0; k < 2; k++) {                  /* k = 0: horizontal lines, k = 1: vertical lines */
      var n = Math.ceil((k ? W : H) / STEP) + 2;
      for (i = -1; i < n; i++) {
        var major = k ? (i % 4 === 0) : (((i + Math.floor(sc * 0.18 / STEP)) % 4 + 4) % 4 === 0);
        ctx.strokeStyle = major ? 'rgba(35,66,196,0.17)' : 'rgba(35,66,196,0.085)';
        ctx.beginPath();
        var along = (k ? H : W) + 24;
        for (var j = -12; j <= along; j += 11) {
          p = k ? { x: i * STEP, y: j } : { x: j, y: i * STEP + off };
          bend(p, big); bend(p, small);
          if (j === -12) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }
    }

    /* stars, bent by the same masses */
    for (i = 0; i < stars.length; i++) {
      var s = stars[i];
      p = { x: s.x * W, y: s.y * H };
      bend(p, big); bend(p, small);
      ctx.fillStyle = s.hot ? 'rgba(194,65,12,' + s.a + ')' : 'rgba(35,66,196,' + s.a + ')';
      ctx.beginPath(); ctx.arc(p.x, p.y, s.r, 0, 6.2832); ctx.fill();
    }

    /* orbit rings, a shadow and a photon ring on the heavy mass (the hero's black hole, in miniature) */
    ctx.setLineDash([2, 6]);
    for (i = 1; i <= 3; i++) {
      ctx.strokeStyle = 'rgba(194,65,12,' + (0.2 - i * 0.04) + ')';
      ctx.beginPath(); ctx.ellipse(big.x, big.y, u * 0.1 * i + 20, (u * 0.1 * i + 20) * 0.42, -0.31, 0, 6.2832); ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(194,65,12,0.7)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(big.x, big.y, 17, 0, 6.2832); ctx.stroke();
    ctx.fillStyle = 'rgba(11,16,32,0.88)';
    ctx.beginPath(); ctx.arc(big.x, big.y, 11, 0, 6.2832); ctx.fill();
    /* the small mass: a tiny warm dot */
    ctx.fillStyle = 'rgba(194,65,12,0.55)';
    ctx.beginPath(); ctx.arc(small.x, small.y, 3, 0, 6.2832); ctx.fill();
  }

  function frame(now) {
    raf = 0;
    if (!cv || !isLight() || document.hidden) return;
    if (!reduce()) {
      if (now - last >= 33) { last = now; draw(now); }  /* about 30 frames per second is plenty for a backdrop */
      raf = window.requestAnimationFrame(frame);
    }
  }

  function cssReady() { /* the new style.css defines --bg-art; an old cached one does not */
    try { return !!window.getComputedStyle(root).getPropertyValue('--bg-art').trim(); } catch (e) { return false; }
  }
  function sync() {
    var on = isLight() && cssReady();
    if (on && !cv && !setup()) on = false;
    if (cv) cv.style.display = on ? 'block' : 'none';
    if (on) { root.setAttribute('data-spacetime', 'on'); resize(); if (!raf) raf = window.requestAnimationFrame(frame); }
    else { root.removeAttribute('data-spacetime'); if (raf) { window.cancelAnimationFrame(raf); raf = 0; } }
  }

  function start() {
    sync();
    window.addEventListener('resize', function () { if (cv && isLight()) resize(); });
    window.addEventListener('pointermove', function (e) { ptr.x = e.clientX; ptr.y = e.clientY; ptr.t = performance.now(); }, { passive: true });
    window.addEventListener('scroll', function () { if (cv && isLight() && reduce() && !raf) raf = window.requestAnimationFrame(function () { raf = 0; draw(performance.now()); }); }, { passive: true });
    document.addEventListener('visibilitychange', function () { if (!document.hidden && cv && isLight() && !raf) raf = window.requestAnimationFrame(frame); });
    if (window.MutationObserver) new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    if (mqDark && mqDark.addEventListener) mqDark.addEventListener('change', sync);
    if (mqReduce && mqReduce.addEventListener) mqReduce.addEventListener('change', sync);
  }

  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();

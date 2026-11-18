/* Page backdrop: a sheet of spacetime, in both themes.
 *
 * Two masses bend a fine grid and a field of stars: a heavy one on the right (with a shadow and a glowing
 * ring, like the hero's black hole in miniature) and a light one that follows the pointer. When the pointer
 * is idle, or on a touch screen, the light mass orbits the heavy one.
 *   light theme: warm paper, cobalt grid, a few faint pencil-mark stars
 *   dark theme : deep space, a faint indigo grid, a lensed field of twinkling stars, an ember glow
 * Drawn on a fixed canvas behind the page; it never blocks clicks. With "reduce motion" switched on it is
 * drawn once and stays still. If the canvas or the new stylesheet is missing, the CSS gradient is all you see.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var mqDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var mqReduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var cv = null, ctx = null, W = 0, H = 0, dpr = 1, raf = 0, last = 0;
  var STEP = 44;
  var stars = [];
  var ptr = { x: 0, y: 0, ax: 0, ay: 0, t: -1e9 };

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
    for (var i = 0; i < 220; i++) stars.push({ x: rnd(), y: rnd(), r: 0.5 + Math.pow(rnd(), 3) * 1.6, a: 0.2 + rnd() * 0.5, hot: rnd() < 0.3, ph: rnd() * 6.28, sp: 0.4 + rnd() * 1.4 });
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

  /* pull a point towards a mass: near it the sheet is squeezed, far away it is untouched */
  function bend(p, m) {
    var dx = p.x - m.x, dy = p.y - m.y, f = m.a / (1 + (dx * dx + dy * dy) / (m.s * m.s));
    p.x -= dx * f; p.y -= dy * f;
  }

  function draw(now) {
    if (!cv) return;
    var light = isLight(), sc = window.pageYOffset || 0, calm = reduce();
    var u = Math.min(W, H), tt = calm ? 0 : now / 1000;
    /* on the home page the heavy mass sits exactly behind the hero black hole, so there is only one black hole */
    var hb = document.getElementById('bh'), hr = null;
    if (hb) { var rc = hb.getBoundingClientRect(); if (rc.width > 0 && rc.bottom > -300 && rc.top < H + 300) hr = rc; }
    var big = hr ? { x: hr.left + hr.width / 2, y: hr.top + hr.height / 2, a: 0.62, s: u * 0.2 } : { x: W * 0.84 + Math.sin(tt * 0.11) * 14, y: H * 0.34 + Math.cos(tt * 0.09) * 10 - Math.min(sc, 600) * 0.05, a: 0.62, s: u * 0.2 };
    var idle = (now - ptr.t) > 5000 || calm;
    var tx = idle ? big.x + Math.cos(tt * 0.32) * u * 0.36 : ptr.x, ty = idle ? big.y + Math.sin(tt * 0.32) * u * 0.2 : ptr.y;
    ptr.ax += (tx - ptr.ax) * 0.06; ptr.ay += (ty - ptr.ay) * 0.06;
    var small = { x: ptr.ax, y: ptr.ay, a: 0.42, s: 120 };
    var i, k, j, p, g;

    ctx.clearRect(0, 0, W, H);

    /* glow around the heavy mass */
    g = ctx.createRadialGradient(big.x, big.y, 0, big.x, big.y, u * 0.55);
    if (light) { g.addColorStop(0, 'rgba(242,145,90,0.34)'); g.addColorStop(0.35, 'rgba(242,145,90,0.12)'); g.addColorStop(1, 'rgba(242,145,90,0)'); }
    else { g.addColorStop(0, 'rgba(255,170,100,0.26)'); g.addColorStop(0.3, 'rgba(214,110,60,0.10)'); g.addColorStop(1, 'rgba(214,110,60,0)'); }
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    /* the grid; the sheet slides slowly under the page when it is scrolled */
    var off = (sc * 0.18) % STEP;
    ctx.lineWidth = 1;
    for (k = 0; k < 2; k++) {                  /* k = 0: horizontal lines, k = 1: vertical lines */
      var n = Math.ceil((k ? W : H) / STEP) + 2;
      for (i = -1; i < n; i++) {
        var major = k ? (i % 4 === 0) : (((i + Math.floor(sc * 0.18 / STEP)) % 4 + 4) % 4 === 0);
        ctx.strokeStyle = light ? (major ? 'rgba(35,66,196,0.17)' : 'rgba(35,66,196,0.085)') : (major ? 'rgba(139,165,255,0.13)' : 'rgba(139,165,255,0.06)');
        ctx.beginPath();
        var along = (k ? H : W) + 24;
        for (j = -12; j <= along; j += 11) {
          p = k ? { x: i * STEP, y: j } : { x: j, y: i * STEP + off };
          bend(p, big); bend(p, small);
          if (j === -12) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }
    }

    /* stars, bent by the same masses (light: 70 faint marks, dark: the whole field, twinkling) */
    var ns = light ? 70 : stars.length;
    for (i = 0; i < ns; i++) {
      var s = stars[i];
      p = { x: s.x * W, y: s.y * H };
      bend(p, big); bend(p, small);
      if (light) {
        ctx.fillStyle = (s.hot ? 'rgba(194,65,12,' : 'rgba(35,66,196,') + Math.min(0.5, s.a * 0.8) + ')';
      } else {
        var tw = calm ? 1 : 0.7 + 0.3 * Math.sin(tt * s.sp + s.ph);
        ctx.fillStyle = (s.hot ? 'rgba(255,205,160,' : 'rgba(200,214,255,') + Math.min(0.95, s.a * tw + 0.1) + ')';
      }
      ctx.beginPath(); ctx.arc(p.x, p.y, s.r, 0, 6.2832); ctx.fill();
    }

    /* orbit rings, shadow and photon ring on the heavy mass */
    ctx.setLineDash([2, 6]);
    for (i = 1; i <= 3; i++) {
      ctx.strokeStyle = light ? 'rgba(194,65,12,' + (0.2 - i * 0.04) + ')' : 'rgba(255,170,100,' + (0.17 - i * 0.04) + ')';
      ctx.beginPath(); ctx.ellipse(big.x, big.y, u * 0.1 * i + 20, (u * 0.1 * i + 20) * 0.42, -0.31, 0, 6.2832); ctx.stroke();
    }
    ctx.setLineDash([]);
    if (light) {
      if (!hr) {
        ctx.strokeStyle = 'rgba(194,65,12,0.7)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(big.x, big.y, 17, 0, 6.2832); ctx.stroke();
        ctx.fillStyle = 'rgba(11,16,32,0.88)';
        ctx.beginPath(); ctx.arc(big.x, big.y, 11, 0, 6.2832); ctx.fill();
      }
      ctx.fillStyle = 'rgba(194,65,12,0.55)';
      ctx.beginPath(); ctx.arc(small.x, small.y, 3, 0, 6.2832); ctx.fill();
    } else {
      /* a thin lensed ring with a hot spot, around a true-black shadow */
      if (!hr) {
        g = ctx.createRadialGradient(big.x, big.y, 10, big.x, big.y, 30);
        g.addColorStop(0, 'rgba(255,190,120,0)'); g.addColorStop(0.55, 'rgba(255,190,120,0.55)'); g.addColorStop(1, 'rgba(255,190,120,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(big.x, big.y, 30, 0, 6.2832); ctx.fill();
        ctx.strokeStyle = 'rgba(255,214,160,0.8)'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(big.x, big.y, 17, 0, 6.2832); ctx.stroke();
        ctx.fillStyle = '#02030a';
        ctx.beginPath(); ctx.arc(big.x, big.y, 14, 0, 6.2832); ctx.fill();
      }
      g = ctx.createRadialGradient(small.x, small.y, 0, small.x, small.y, 14);
      g.addColorStop(0, 'rgba(190,210,255,0.55)'); g.addColorStop(1, 'rgba(190,210,255,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(small.x, small.y, 14, 0, 6.2832); ctx.fill();
    }
  }

  function frame(now) {
    raf = 0;
    if (!cv || !cssReady() || document.hidden) return;
    if (!reduce()) {
      if (now - last >= 33 && !document.body.classList.contains('modal-open')) { last = now; draw(now); } /* frozen behind an open dialog */  /* about 30 frames per second is plenty for a backdrop */
      raf = window.requestAnimationFrame(frame);
    }
  }

  function cssReady() { /* the new style.css defines --bg-art; an old cached one does not */
    try { return !!window.getComputedStyle(root).getPropertyValue('--bg-art').trim(); } catch (e) { return false; }
  }
  function sync() {
    var on = cssReady();
    if (on && !cv && !setup()) on = false;
    if (cv) cv.style.display = on ? 'block' : 'none';
    if (on) {
      root.setAttribute('data-spacetime', isLight() ? 'light' : 'dark');
      resize();
      if (!raf) raf = window.requestAnimationFrame(frame);
    } else {
      root.removeAttribute('data-spacetime');
      if (raf) { window.cancelAnimationFrame(raf); raf = 0; }
    }
  }

  function start() {
    sync();
    window.addEventListener('resize', function () { if (cv && cssReady()) resize(); });
    window.addEventListener('pointermove', function (e) { ptr.x = e.clientX; ptr.y = e.clientY; ptr.t = performance.now(); }, { passive: true });
    window.addEventListener('scroll', function () { if (cv && reduce() && !raf) raf = window.requestAnimationFrame(function () { raf = 0; draw(performance.now()); }); }, { passive: true });
    document.addEventListener('visibilitychange', function () { if (!document.hidden && cv && !raf) raf = window.requestAnimationFrame(frame); });
    if (window.MutationObserver) new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    if (mqDark && mqDark.addEventListener) mqDark.addEventListener('change', sync);
    if (mqReduce && mqReduce.addEventListener) mqReduce.addEventListener('change', sync);
  }

  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();

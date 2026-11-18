/* Live ray-traced Schwarzschild black hole with a thin accretion disc.
 *
 * Light rays are traced backwards from the camera. In Schwarzschild spacetime a null geodesic obeys
 *   d²u/dφ² + u = (3/2) r_s u²,   u = 1/r,
 * which is the same orbit as a Newtonian particle with acceleration a = −(3/2) r_s h² x / r⁵
 * (h = |x × v| is conserved). Units: r_s = 2GM/c² = 1, so the photon sphere is at r = 1.5
 * and the shadow edge at b = 3√3/2 ≈ 2.6.
 */
(function () {
  'use strict';

  var VERT = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';

  var FRAG = [
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    'precision highp float;',
    '#else',
    'precision mediump float;',
    '#endif',
    'uniform vec2 uRes; uniform float uTime; uniform float uEl; uniform float uDark;',
    'const float RIN = 3.0;',
    'const float ROUT = 9.0;',
    'float hash13(vec3 p){ p = fract(p * 0.1031); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y) * p.z); }',
    'float hash12(vec2 p){ vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }',
    'float vnoise(vec2 p){',
    '  vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);',
    '  return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), f.x), mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), f.x), f.y);',
    '}',
    'vec3 stars(vec3 d){',
    '  vec3 q = d * 70.0; vec3 id = floor(q); vec3 f = q - id;',
    '  float h = hash13(id);',
    '  vec3 c = vec3(hash13(id + 11.1), hash13(id + 23.7), hash13(id + 37.3));',
    '  float s = step(0.975, h) * smoothstep(0.17, 0.0, length(f - c)) * (0.45 + 0.9 * hash13(id + 5.5));',
    '  vec3 tint = mix(vec3(1.0, 0.82, 0.62), vec3(0.7, 0.8, 1.0), hash13(id + 9.1));',
    '  float band = exp(-7.0 * abs(dot(d, normalize(vec3(0.3, 0.8, 0.5)))));',
    '  return s * tint + 0.035 * band * vec3(0.5, 0.6, 1.0);',
    '}',
    'vec3 palette(float t){',
    '  t = clamp(t, 0.0, 2.2);',
    '  vec3 c1 = vec3(1.0, 0.30, 0.06); vec3 c2 = vec3(1.0, 0.72, 0.32); vec3 c3 = vec3(1.0, 0.95, 0.86);',
    '  return mix(mix(c1, c2, smoothstep(0.15, 0.8, t)), c3, smoothstep(0.8, 1.7, t));',
    '}',
    'void main(){',
    '  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y) * 2.0;',
    '  vec3 cam = 24.0 * vec3(0.0, sin(uEl), cos(uEl));',
    '  vec3 fwd = -normalize(cam);',
    '  vec3 right = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)));',
    '  vec3 upv = cross(right, fwd);',
    '  vec3 v = normalize(fwd + (uv.x * right + uv.y * upv) * 0.50);',
    '  vec3 p = cam;',
    '  vec3 hv = cross(p, v); float h2 = dot(hv, hv);',
    '  vec3 col = vec3(0.0); float tr = 1.0; bool captured = false;',
    '  for (int i = 0; i < 320; i++) {',
    '    float r2 = dot(p, p); float r = sqrt(r2);',
    '    if (r < 1.0) { captured = true; break; }',
    '    if (r > 60.0 && dot(p, v) > 0.0) break;',
    '    float dt = clamp(0.045 * r, 0.025, 0.9);',
    '    v += (-1.5 * h2 / (r2 * r2 * r)) * p * dt;',
    '    vec3 pn = p + v * dt;',
    '    if (p.y * pn.y < 0.0) {',
    '      float s = p.y / (p.y - pn.y);',
    '      vec3 hp = mix(p, pn, s);',
    '      float hr = length(hp.xz);',
    '      if (hr > RIN - 0.2 && hr < ROUT) {',
    '        float beta = sqrt(0.5 / max(hr - 1.0, 0.2));',
    '        vec3 vd = normalize(vec3(-hp.z, 0.0, hp.x));',
    '        vec3 nph = -normalize(v);',
    '        float dop = sqrt(1.0 - beta * beta) / (1.0 - beta * dot(vd, nph));',
    '        float grav = sqrt(max(1.0 - 1.0 / hr, 0.02));',
    '        float g = dop * grav;',
    '        float om = 1.1 * pow(RIN / hr, 1.5);',
    '        float ca = cos(uTime * om); float sa = sin(uTime * om);',
    '        vec2 q = vec2(ca * hp.x + sa * hp.z, -sa * hp.x + ca * hp.z);',
    '        float n = 0.55 * vnoise(q * 1.7) + 0.3 * vnoise(q * 4.3 + 7.0) + 0.15 * vnoise(q * 11.0 + 3.0);',
    '        float edge = smoothstep(RIN - 0.2, RIN + 0.3, hr) * (1.0 - smoothstep(ROUT - 2.5, ROUT, hr));',
    '        float emis = 2.0 * pow(RIN / hr, 2.0) * pow(g, 3.0) * (0.45 + 1.1 * n);',
    '        col += tr * edge * emis * palette(g * pow(RIN / hr, 0.75));',
    '        tr *= 0.32;',
    '      }',
    '    }',
    '    p = pn;',
    '  }',
    '  if (!captured) col += tr * stars(normalize(v)) * uDark;',
    '  col = vec3(1.0) - exp(-col * 1.5);',
    '  col = pow(col, vec3(0.92));',
    '  float m = max(max(col.r, col.g), col.b);',
    '  float a = captured ? 1.0 : clamp(m * 1.6, 0.0, 1.0);',
    '  gl_FragColor = vec4(col, a);',
    '}'
  ].join('\n');

  var running = null;

  function compile(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      var log = gl.getShaderInfoLog(s);
      gl.deleteShader(s);
      throw new Error(log || 'shader compile failed');
    }
    return s;
  }

  function stop() {
    if (running) { running.destroy(); running = null; }
  }

  function mount(canvas, slider, readout) {
    stop();
    var gl = null;
    try {
      gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: 'low-power' }) ||
           canvas.getContext('experimental-webgl');
    } catch (e) { gl = null; }
    if (!gl) { canvas.parentNode.classList.add('no-webgl'); return; }

    var prog;
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    } catch (err) {
      if (window.console) console.warn('Black hole shader unavailable:', err);
      canvas.parentNode.classList.add('no-webgl');
      return;
    }
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var uRes = gl.getUniformLocation(prog, 'uRes');
    var uTime = gl.getUniformLocation(prog, 'uTime');
    var uEl = gl.getUniformLocation(prog, 'uEl');
    var uDark = gl.getUniformLocation(prog, 'uDark');
    var root = document.documentElement;
    function isDark() {
      var t = root.getAttribute('data-theme');
      if (t) return t === 'dark';
      return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var touch = (navigator.maxTouchPoints || 0) > 0;
    var quality = touch ? 0.6 : 0.85;
    var MAXPIX = touch ? 260000 : 520000;
    var incl = slider ? parseFloat(slider.value) : 78;
    var visible = true, alive = true, dirty = true, raf = 0;
    var t0 = performance.now(), frames = 0, acc = 0, last = t0;

    function size() {
      var r = canvas.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      var w = Math.max(200, r.width * dpr * quality);
      var h = Math.max(200, r.height * dpr * quality);
      var k = Math.sqrt(Math.min(1, MAXPIX / (w * h)));
      canvas.width = Math.round(w * k);
      canvas.height = Math.round(h * k);
      gl.viewport(0, 0, canvas.width, canvas.height);
      dirty = true;
    }

    function draw(now) {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, reduce ? 2.0 : (now - t0) / 1000);
      gl.uniform1f(uEl, (90 - incl) * Math.PI / 180);
      gl.uniform1f(uDark, 1.0); /* stars show on the dark sky patch in both themes */
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    function frame(now) {
      raf = 0;
      if (!alive) return;
      if (visible && !document.hidden && !document.body.classList.contains('modal-open') && (!reduce || dirty)) {
        draw(now);
        dirty = false;
        frames++; acc += now - last;
        if (frames === 24) {
          var avg = acc / frames;
          if (avg > 30 && quality > 0.4) { quality *= 0.8; size(); }
          else if (avg < 12 && quality < 1) { quality = Math.min(1, quality * 1.12); size(); }
          frames = 0; acc = 0;
        }
      }
      last = now;
      if (!reduce || dirty) raf = requestAnimationFrame(frame);
    }
    function kick() { dirty = true; if (!raf && alive) raf = requestAnimationFrame(frame); }

    function setIncl(v) {
      incl = Math.max(5, Math.min(88, v));
      if (slider) slider.value = String(incl);
      if (readout) readout.textContent = Math.round(incl) + '°';
      kick();
    }

    function onSlider() { setIncl(parseFloat(slider.value)); }
    if (slider) slider.addEventListener('input', onSlider);
    if (readout) readout.textContent = Math.round(incl) + '°';

    var dragY = null;
    function down(e) { if (e.pointerType === 'touch') return; dragY = e.clientY; canvas.setPointerCapture(e.pointerId); canvas.classList.add('dragging'); }
    function move(e) { if (dragY === null) return; var dy = e.clientY - dragY; dragY = e.clientY; setIncl(incl - dy * 0.35); }
    function up() { dragY = null; canvas.classList.remove('dragging'); }
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);

    var ro = null, io = null;
    if (window.ResizeObserver) { ro = new ResizeObserver(function () { size(); kick(); }); ro.observe(canvas); }
    else window.addEventListener('resize', size);
    if (window.IntersectionObserver) {
      io = new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) kick(); });
      io.observe(canvas);
    }
    function onLost(e) { e.preventDefault(); alive = false; canvas.parentNode.classList.add('no-webgl'); }
    canvas.addEventListener('webglcontextlost', onLost);
    document.addEventListener('visibilitychange', kick);
    var mo = null;
    if (window.MutationObserver) { mo = new MutationObserver(kick); mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] }); }

    size();
    kick();

    running = {
      destroy: function () {
        alive = false;
        if (raf) cancelAnimationFrame(raf);
        if (slider) slider.removeEventListener('input', onSlider);
        if (ro) ro.disconnect(); else window.removeEventListener('resize', size);
        if (io) io.disconnect();
        if (mo) mo.disconnect();
        document.removeEventListener('visibilitychange', kick);
        canvas.removeEventListener('pointerdown', down);
        canvas.removeEventListener('pointermove', move);
        canvas.removeEventListener('pointerup', up);
        canvas.removeEventListener('pointercancel', up);
        canvas.removeEventListener('webglcontextlost', onLost);
        var ext = gl.getExtension && gl.getExtension('WEBGL_lose_context');
        if (ext) ext.loseContext();
      }
    };
  }

  window.SiteHero = { mount: mount, stop: stop };
})();

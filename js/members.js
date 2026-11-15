/* Members area: sign-in, registration, members' library and shared playlists.
 *
 * Talks to the Google Apps Script web app described in backend/code.gs (or, when
 * members.demo is true, to the in-browser stand-in in demo-api.js). Page rendering for the
 * rest of the site lives in app.js; this file owns accounts, data and the dialogs.
 */
(function () {
  'use strict';

  var CFG = window.SITE_CONFIG, M = CFG.members || {}, I = window.SITE_I18N, ui = I.ui;
  var enabled = !!(M.api || M.demo);
  var PROTECT = M.protect || [];
  var CH = 3932160; /* upload chunk: multiple of 256 KB and of 3 (base64), as the backend expects */

  var S = { tok: '', name: '', role: '' };
  var DB = null, dbState = 'idle', dbErr = '', loadPromise = null, fetchedOnce = false;
  var libQ = '';
  var out = { onChange: function () {}, onSignOut: function () {}, onData: function () {}, onSubject: function () {} };

  /* ---------- small helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function store(key, val) {
    try {
      if (val === undefined) return window.localStorage.getItem('bhg.' + key);
      if (val === null) window.localStorage.removeItem('bhg.' + key); else window.localStorage.setItem('bhg.' + key, val);
    } catch (e) { /* storage unavailable: the session then lives in memory only */ }
    return null;
  }
  function changed(why) { try { out.onChange(why); } catch (e) { if (window.console) console.error(e); } }

  var ICON_USER = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8.5" r="3.6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4.5 20c.9-4 4-5.6 7.5-5.6s6.6 1.6 7.5 5.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  var ICON_LOCK = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="9.5" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  var ICON_EXT = '<svg class="ico" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3h7v7M13 3 5 11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ICON_PLAY = '<svg class="ico" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.2v9.6L13 8z" fill="currentColor"/></svg>';

  /* ---------- session ---------- */
  S.tok = store('tok') || ''; S.name = store('nm') || ''; S.role = store('rl') || '';
  if (S.tok) {
    try { var cached = JSON.parse(store('dc') || 'null'); if (cached && cached.books) { DB = cached; dbState = 'ok'; } } catch (e) { DB = null; }
  }
  function isAdmin() { return S.role === 'admin'; }
  function setSession(r) {
    S.tok = r.token; S.name = r.name; S.role = r.role;
    store('tok', S.tok); store('nm', S.name); store('rl', S.role);
  }
  function signOut() {
    S.tok = S.name = S.role = '';
    ['tok', 'nm', 'rl', 'dc'].forEach(function (k) { store(k, null); });
    DB = null; dbState = 'idle'; fetchedOnce = false; libQ = '';
    try { out.onSignOut(); } catch (e) { /* ignore */ }
    changed('signout');
  }

  /* ---------- backend calls ---------- */
  var ERRMAP = [
    [/^auth$/, 'm.errAuth'], [/^Ism yoki parol/, 'm.errCreds'], [/^Ko'p urinish/, 'm.errTries'],
    [/^Bunday a'zo bor/, 'm.errExists'], [/^Parol kamida/, 'm.errPass'], [/^Ism va familiyani/, 'm.errName'],
    [/^Juda ko'p urinish/, 'm.errReg'], [/^Faqat adminlar|^Ruxsat yo'q/, 'm.errPerm']
  ];
  function mapErr(msg) {
    for (var i = 0; i < ERRMAP.length; i++) if (ERRMAP[i][0].test(msg)) return ui(ERRMAP[i][1]);
    return msg;
  }
  function fetchApi(q, ms, keepalive) {
    var ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var to = setTimeout(function () { if (ctl) ctl.abort(); }, ms || 30000);
    return fetch(M.api, {
      method: 'POST', signal: ctl ? ctl.signal : undefined, keepalive: !!keepalive,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(q)
    }).then(function (r) { return r.json(); }).then(function (j) { clearTimeout(to); return j; }, function (e) { clearTimeout(to); throw e; });
  }
  function call(action, payload, ms, keepalive) {
    var q = { action: action, token: S.tok };
    Object.keys(payload || {}).forEach(function (k) { q[k] = payload[k]; });
    var p = (M.demo && window.SiteDemoApi) ? window.SiteDemoApi.run(q) : fetchApi(q, ms, keepalive);
    return p.then(function (r) {
      if (r && r.err) {
        var m = String(r.err);
        if (m === 'auth') signOut();
        throw new Error(mapErr(m));
      }
      return r;
    }, function (e) {
      throw new Error(e && e.name === 'AbortError' ? ui('m.timeout') : ui('m.network'));
    });
  }

  /* ---------- data: books, shared playlists, progress ---------- */
  function refresh() {
    if (!S.tok) return Promise.resolve(null);
    if (dbState === 'loading' && loadPromise) return loadPromise;
    dbState = 'loading'; dbErr = ''; fetchedOnce = true;
    loadPromise = call('data').then(function (r) {
      DB = r; dbState = 'ok'; store('dc', JSON.stringify(r));
      try { out.onData(r); } catch (e) { /* ignore */ }
      changed('data');
      return r;
    }, function (e) {
      if (!S.tok) return null;
      dbState = DB ? 'ok' : 'err'; dbErr = e.message;
      changed('data');
      return null;
    });
    return loadPromise;
  }
  function ensureData() { if (S.tok && !fetchedOnce && dbState !== 'loading') refresh(); }
  function saveProg(key, i, t, beacon) {
    if (!S.tok || !key) return;
    var p = call('prog', { pl: key, i: i, t: Math.floor(t) }, 20000, !!beacon);
    p.then(function () { /* saved */ }, function () { /* progress is also kept locally */ });
  }

  /* ---------- modal plumbing ---------- */
  var modalEl = null, lastFocus = null, uploading = false;
  function openModal(html) {
    closeModal(true);
    lastFocus = document.activeElement;
    var o = document.createElement('div');
    o.className = 'modal';
    o.innerHTML = '<div class="modal__box" role="dialog" aria-modal="true" aria-labelledby="mTitle">' +
      '<button type="button" class="modal__x" data-m="close" aria-label="' + esc(ui('m.close')) + '">&times;</button>' + html + '</div>';
    o.addEventListener('mousedown', function (e) { if (e.target === o) closeModal(); });
    document.body.appendChild(o);
    document.body.classList.add('modal-open');
    modalEl = o;
    var f = $('input:not([type=hidden]), select', o) || $('button.btn', o);
    if (f) setTimeout(function () { try { f.focus(); } catch (e) { /* ignore */ } }, 30);
    return o;
  }
  function closeModal(keepFocus) {
    if (!modalEl) return;
    modalEl.remove(); modalEl = null;
    document.body.classList.remove('modal-open');
    if (!keepFocus && lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) { /* ignore */ } }
  }
  function showErr(msg) { var el = $('#mErr', modalEl); if (el) { el.textContent = msg; el.hidden = !msg; } }
  function busy(on, label) {
    if (!modalEl) return;
    $$all('button[type=submit], .modal__box input', modalEl).forEach(function (b) { b.disabled = on; });
    var sub = $('button[type=submit]', modalEl);
    if (sub) { if (on) { sub.setAttribute('data-label', sub.textContent); sub.textContent = label || ui('m.wait'); } else if (sub.getAttribute('data-label')) sub.textContent = sub.getAttribute('data-label'); }
  }
  function $$all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function demoNote() { return M.demo ? '<p class="demo-note">' + esc(ui('m.demo')) + '</p>' : ''; }
  function pwField(id, label, auto) {
    return '<label class="fld"><span>' + esc(label) + '</span><span class="pw"><input id="' + id + '" type="password" autocomplete="' + auto + '" required minlength="6">' +
      '<button type="button" class="pw__eye" data-m="eye" data-for="' + id + '" aria-label="' + esc(ui('m.show')) + '" aria-pressed="false">&#128065;</button></span></label>';
  }

  /* ---------- sign in / register ---------- */
  function signInBox(mode) {
    var up = mode === 'up';
    openModal('<h2 id="mTitle">' + esc(ui(up ? 'm.register' : 'm.signin')) + '</h2>' + demoNote() +
      '<form id="mForm" class="mform" data-mode="' + (up ? 'up' : 'in') + '" novalidate>' +
        '<label class="fld"><span>' + esc(ui('m.first')) + '</span><input id="mFirst" autocomplete="given-name" required></label>' +
        '<label class="fld"><span>' + esc(ui('m.last')) + '</span><input id="mLast" autocomplete="family-name" required></label>' +
        pwField('mPass', ui('m.pass'), up ? 'new-password' : 'current-password') +
        (up ? '<p class="hint">' + esc(ui('m.passHint')) + '</p>' : '') +
        (up && M.invite ? '<label class="fld"><span>' + esc(ui('m.code')) + '</span><input id="mCode" autocomplete="off" required></label><p class="hint">' + esc(ui('m.codeHint')) + '</p>' : '') +
        '<p class="mform__err" id="mErr" role="alert" hidden></p>' +
        '<button type="submit" class="btn">' + esc(ui(up ? 'm.register' : 'm.signin')) + '</button>' +
      '</form>' +
      '<p class="mswitch">' + esc(ui(up ? 'm.haveAcct' : 'm.noAcct')) + ' <button type="button" class="linkbtn" data-m="' + (up ? 'signin' : 'signup') + '">' + esc(ui(up ? 'm.signin' : 'm.register')) + '</button></p>');
  }
  function onAuthSubmit(form) {
    var up = form.getAttribute('data-mode') === 'up';
    var a = ($('#mFirst', form).value || '').trim(), b = ($('#mLast', form).value || '').trim(), p = $('#mPass', form).value;
    if (!a || !b) { showErr(ui('m.errName')); return; }
    if (String(p).length < 6) { showErr(ui('m.errPass')); return; }
    var name = a + ' ' + b, code = up && M.invite ? ($('#mCode', form).value || '').trim() : '';
    if (up && M.invite && !code) { showErr(ui('m.errCode')); return; }
    showErr(''); busy(true);
    var first = up ? call('register', { name: name, pass: p, code: code }) : Promise.resolve();
    first.then(function () { return call('login', { name: name, pass: p }); }).then(function (r) {
      setSession(r); closeModal(); fetchedOnce = false; changed('auth'); refresh();
    }).then(null, function (e) { busy(false); showErr(e.message); });
  }

  /* ---------- account dialog ---------- */
  function accountBox() {
    openModal('<h2 id="mTitle">' + esc(ui('m.account')) + '</h2>' +
      '<p class="who">' + esc(ui('m.signedAs', { name: S.name })) + (isAdmin() ? ' <span class="tag">' + esc(ui('m.admin')) + '</span>' : '') + '</p>' +
      '<form id="mPassForm" class="mform" novalidate><h3>' + esc(ui('m.change')) + '</h3>' +
        pwField('mOld', ui('m.passOld'), 'current-password') + pwField('mNew', ui('m.passNew'), 'new-password') +
        '<p class="mform__err" id="mErr" role="alert" hidden></p><p class="mform__ok" id="mOk" role="status" hidden></p>' +
        '<button type="submit" class="btn btn--sm">' + esc(ui('m.change')) + '</button></form>' +
      '<div class="mrow">' + (isAdmin() ? '<button type="button" class="btn btn--sm" data-m="members">' + esc(ui('m.members')) + '</button>' : '') +
      '<button type="button" class="btn btn--sm" data-m="signout">' + esc(ui('m.signout')) + '</button></div>');
  }
  function onPassSubmit() {
    var o = $('#mOld').value, n = $('#mNew').value;
    if (String(n).length < 6) { showErr(ui('m.errPass')); return; }
    showErr(''); busy(true);
    call('changePass', { old: o, pass: n }).then(function () {
      busy(false); $('#mOld').value = ''; $('#mNew').value = '';
      var ok = $('#mOk'); if (ok) { ok.textContent = ui('m.saved'); ok.hidden = false; }
    }).then(null, function (e) { busy(false); showErr(e.message); });
  }

  /* ---------- admin: members list ---------- */
  function membersBox() {
    openModal('<h2 id="mTitle">' + esc(ui('m.members')) + '</h2><div id="mList" class="mlist"><p class="muted">' + esc(ui('m.wait')) + '</p></div>');
    call('users').then(function (r) {
      var el = $('#mList'); if (!el) return;
      el.innerHTML = r.users.map(function (u) {
        var adm = u.role === 'admin', self = String(u.name).toLowerCase() === String(S.name).toLowerCase();
        return '<div class="mlist__row"><span>' + esc(u.name) + (adm ? ' <span class="tag">' + esc(ui('m.admin')) + '</span>' : '') + '</span>' +
          (self ? '' : '<span class="mlist__act"><button type="button" class="btn btn--sm" data-m="setrole" data-name="' + esc(u.name) + '" data-role="' + (adm ? 'member' : 'admin') + '">' + esc(ui(adm ? 'm.removeAdmin' : 'm.makeAdmin')) + '</button>' +
          '<button type="button" class="btn btn--sm btn--danger" data-m="del-user" data-name="' + esc(u.name) + '" data-sure="' + esc(ui('m.sure')) + '">' + esc(ui('m.delete')) + '</button></span>') + '</div>';
      }).join('') || '<p class="muted">' + esc(ui('m.lib.empty')) + '</p>';
    }).then(null, function (e) { var el = $('#mList'); if (el) el.innerHTML = '<p class="mform__err">' + esc(e.message) + '</p>'; });
  }

  /* two-step confirmation without browser dialogs */
  function armed(btn) {
    if (btn.getAttribute('data-armed')) return true;
    btn.setAttribute('data-armed', '1'); btn.setAttribute('data-orig', btn.textContent);
    btn.textContent = btn.getAttribute('data-sure') || ui('m.sure'); btn.classList.add('is-armed');
    setTimeout(function () {
      if (btn.isConnected && btn.getAttribute('data-armed')) { btn.removeAttribute('data-armed'); btn.textContent = btn.getAttribute('data-orig'); btn.classList.remove('is-armed'); }
    }, 3500);
    return false;
  }

  /* ---------- gating and header ---------- */
  function needsLogin(route) { return enabled && !S.tok && PROTECT.indexOf(route) >= 0; }
  function lockHtml(route) {
    var key = route === 'lectures' ? 'm.lock.lectures' : route === 'books' ? 'm.lock.books' : 'm.lock.generic';
    return '<section class="wrap section"><div class="lock"><span class="lock__ico">' + ICON_LOCK + '</span><div>' +
      '<h2>' + esc(ui('m.lockTitle')) + '</h2><p>' + esc(ui(key)) + '</p><p class="muted">' + esc(ui('m.lockNote')) + '</p>' + demoNote() +
      '<p class="lock__act"><button type="button" class="btn" data-m="signin">' + esc(ui('m.signin')) + '</button> ' +
      '<button type="button" class="btn btn--ghost" data-m="signup">' + esc(ui('m.register')) + '</button></p></div></div></section>';
  }
  function accountButton() {
    if (!enabled) return '';
    if (!S.tok) {
      return '<button type="button" class="iconbtn acct" data-m="signin" title="' + esc(ui('m.signin')) + '" aria-label="' + esc(ui('m.signin')) + '">' + ICON_USER + '</button>';
    }
    var ini = String(S.name || '?').trim().charAt(0).toUpperCase();
    return '<button type="button" class="iconbtn acct acct--on" data-m="account" title="' + esc(S.name) + '" aria-label="' + esc(ui('m.account') + ': ' + S.name) + '"><b>' + esc(ini) + '</b></button>';
  }

  /* ---------- library ---------- */
  /* Subjects, in the order shown. A file's subject is the digit in its title ("4::Title"). The digits 0-3 keep the
   * meaning they had on the older site (0 vectors, 1 mechanics, 2 relativity, 3 other), so files uploaded there still sort
   * correctly; 4-7 are the newer subjects. */
  var SUBJ = ['vt', 'mech', 'em', 'gr', 'qm', 'math', 'bh'];
  var CODE = { vt: 0, mech: 1, gr: 2, em: 4, qm: 5, math: 6, bh: 7 };
  var KEY = ['vt', 'mech', 'gr', 'other', 'em', 'qm', 'math', 'bh'];
  var curSub = 'gr';
  var CG = [[/tenzor|vektor|vector|tensor|тензор|вектор/i, 0], [/mexanika|mechanic|lagranj|gamilton|механик/i, 1], [/nisbiylik|relativ|gravit|einstein|относительн/i, 2],
    [/elektro|electro|maksvell|maxwell|электро|максвелл/i, 4], [/kvant|quantum|квант/i, 5], [/matematik|mathemat|математ/i, 6], [/qora tuynuk|black hole|lensing|linzalan|shadow|чёрн|черн|линзир/i, 7]];
  function codeOf(d) { d = +d; return d >= 0 && d <= 7 ? d : 3; }
  function subjName(k) { return k === 'other' ? ui('m.lib.cat3') : ui('books.tab.' + k); }
  function parseBook(x) {
    var m = /^(\d)::([\s\S]*)$/.exec(x.title || '');
    if (m) return { c: codeOf(m[1]), ti: m[2] };
    var g = null, hay = (x.title || '') + ' ' + (x.author || '');
    CG.forEach(function (r) { if (!g && r[0].test(hay)) g = r; });
    return { c: g ? g[1] : 3, ti: x.title || '' };
  }
  function isStub(fileId) { return M.demo || /^demo/.test(String(fileId)); }
  function driveView(id) { return 'https://drive.google.com/file/d/' + encodeURIComponent(id) + '/view'; }
  function driveDl(id) { return 'https://drive.google.com/uc?export=download&id=' + encodeURIComponent(id); }
  function libCover(b) {
    var img = isStub(b.fileId) ? '' : '<img class="cover__img" data-cover loading="lazy" referrerpolicy="no-referrer" alt="" src="https://drive.google.com/thumbnail?id=' + encodeURIComponent(b.fileId) + '&amp;sz=w480">';
    return '<span class="cover cover--' + b.s + '" aria-hidden="true"><span class="cover__tile"><b>' + esc(b.ti) + '</b>' + (b.author ? '<small>' + esc(b.author) + '</small>' : '') + '</span>' + img + '</span>';
  }
  function libCard(b) {
    var stub = isStub(b.fileId);
    var cover = stub ? libCover(b) : '<a class="cover-link" target="_blank" rel="noopener noreferrer" href="' + driveView(b.fileId) + '" tabindex="-1">' + libCover(b) + '</a>';
    var actions = stub ? '' : '<a class="btn btn--sm" target="_blank" rel="noopener noreferrer" href="' + driveView(b.fileId) + '">' + esc(ui('m.lib.open')) + '</a>' +
      '<a class="btn btn--sm" href="' + driveDl(b.fileId) + '">' + esc(ui('m.lib.download')) + '</a>';
    if (b.mine) actions += '<button type="button" class="btn btn--sm btn--danger" data-m="del-book" data-id="' + esc(b.id) + '" data-sure="' + esc(ui('m.sure')) + '">' + esc(ui('m.delete')) + '</button>';
    return '<article class="libcard">' + cover + '<div class="libcard__body"><h4>' + esc(b.ti) + '</h4>' +
      (b.author ? '<p class="by">' + esc(b.author) + '</p>' : '') +
      (b.by ? '<p class="muted small">' + esc(ui('m.lib.addedBy', { name: b.by })) + '</p>' : '') +
      '<div class="libcard__act">' + actions + '</div></div></article>';
  }
  function libItems() {
    return ((DB && DB.books) || []).map(function (x) { var p = parseBook(x); return { id: x.id, fileId: x.fileId, author: x.author, by: x.by, mine: x.mine, c: p.c, s: KEY[p.c], ti: p.ti }; });
  }
  /* Without a search the chosen subject is shown. A search looks in every subject, because a book may have been filed elsewhere. */
  function libGrid() {
    var q = libQ.toLowerCase();
    var items = libItems().filter(function (b) { return (b.ti + ' ' + (b.author || '')).toLowerCase().indexOf(q) >= 0; });
    if (!q) {
      var one = items.filter(function (b) { return b.s === curSub; });
      return one.length ? '<div class="libgrid">' + one.map(libCard).join('') + '</div>' : '<p class="muted">' + esc(ui('m.lib.emptySub')) + '</p>';
    }
    var html = SUBJ.concat('other').map(function (k) {
      var r = items.filter(function (b) { return b.s === k; });
      return r.length ? '<h3 class="cat">' + esc(subjName(k)) + ' <small>' + r.length + '</small></h3><div class="libgrid">' + r.map(libCard).join('') + '</div>' : '';
    }).join('');
    return html || '<p class="muted">' + esc(ui('m.lib.empty')) + '</p>';
  }
  function libraryHtml() {
    if (!S.tok) return lockHtml('books');
    var body;
    if (dbState === 'err' && !DB) body = '<p class="mform__err">' + esc(dbErr) + '</p><p><button type="button" class="btn btn--sm" data-m="retry">' + esc(ui('m.lib.retry')) + '</button></p>';
    else if (!DB) body = '<p class="muted">' + esc(ui('m.lib.loading')) + '</p>';
    else body = libGrid();
    return '<div class="lib"><p class="muted lib__intro">' + esc(ui('m.lib.intro')) + '</p>' + demoNote() +
      '<div class="lib__bar"><label class="sr" for="libQ">' + esc(ui('m.lib.search')) + '</label>' +
      '<input id="libQ" class="search" type="search" autocomplete="off" placeholder="' + esc(ui('m.lib.search')) + '" value="' + esc(libQ) + '">' +
      '<button type="button" class="btn btn--sm" data-m="upload">' + esc(ui('m.lib.upload')) + '</button></div>' +
      '<div id="libGrid">' + body + '</div></div>';
  }

  /* ---------- upload ---------- */
  var UPQ = [];
  function uploadBox() {
    openModal('<h2 id="mTitle">' + esc(ui('m.lib.upload')) + '</h2>' + demoNote() +
      '<form id="mUpForm" class="mform" novalidate>' +
        '<label class="fld"><span>' + esc(ui('m.lib.fTitle')) + '</span><input id="upTitle" autocomplete="off"></label>' +
        '<label class="fld"><span>' + esc(ui('m.lib.fAuthor')) + '</span><input id="upAuthor" autocomplete="off"></label>' +
        '<label class="fld"><span>' + esc(ui('m.lib.fCat')) + '</span><select id="upCat">' + SUBJ.map(function (k) { return '<option value="' + CODE[k] + '"' + (k === curSub ? ' selected' : '') + '>' + esc(subjName(k)) + '</option>'; }).join('') + '</select></label>' +
        '<label class="fld"><span>' + esc(ui('m.lib.fFiles')) + '</span><input id="upFiles" type="file" multiple></label>' +
        '<p class="mform__err" id="mErr" role="alert" hidden></p>' +
        '<div id="upList" class="uplist" aria-live="polite"></div>' +
        '<button type="submit" class="btn">' + esc(ui('m.lib.go')) + '</button></form>');
    paintUploads();
  }
  function mb(n) { return (n / 1048576).toFixed(1); }
  function paintUploads() {
    var el = $('#upList'); if (!el) return;
    el.innerHTML = UPQ.map(function (u) {
      var pct = u.size ? Math.round(u.done / u.size * 100) : 100;
      var tx = u.st === 'err' ? '&#9888; ' + esc(u.msg) : u.st === 'ok' ? '&#10003; ' + mb(u.size) + ' MB' : u.st === 'wait' ? mb(u.size) + ' MB' : mb(u.done) + ' / ' + mb(u.size) + ' MB &middot; ' + pct + '%';
      return '<div class="up"><span>' + esc(u.name) + '</span><b>' + tx + '</b><div class="up__bar"><i style="width:' + (u.st === 'ok' ? 100 : pct) + '%"' + (u.st === 'err' ? ' class="bad"' : '') + '></i></div></div>';
    }).join('');
  }
  function toB64(blob) {
    return new Promise(function (res, rej) { var r = new FileReader(); r.onload = function () { res(String(r.result).split(',')[1] || ''); }; r.onerror = rej; r.readAsDataURL(blob); });
  }
  function retry(fn, n) {
    return fn().then(null, function (e) { if (n > 0 && S.tok) return retry(fn, n - 1); throw e; });
  }
  function uploadFile(u) {
    var title = u.cat + '::' + ((u.one && u.title) || u.name.replace(/\.[^.]+$/, ''));
    return call('upStart', { fileName: u.name, mime: u.f.type, size: u.f.size }).then(function (r) {
      if (M.demo) return call('upPart', { url: r.url, start: 0, size: u.f.size, b64: '', title: title, author: u.author });
      var pos = 0;
      function part() {
        var end = Math.min(pos + CH, u.f.size);
        return toB64(u.f.slice(pos, end)).then(function (data) {
          return retry(function () { return call('upPart', { url: r.url, start: pos, size: u.f.size, b64: data, title: title, author: u.author }, 300000); }, 2);
        }).then(function () { pos = end; u.done = pos; paintUploads(); if (pos < u.f.size) return part(); });
      }
      return part();
    });
  }
  var upRunning = false;
  function runUploads() {
    if (upRunning) return; upRunning = true; uploading = true;
    (function next() {
      var u = UPQ.filter(function (x) { return x.st === 'wait'; })[0];
      if (!u) {
        upRunning = false; uploading = false; fetchedOnce = false;
        var done = UPQ.filter(function (x) { return x.st === 'ok'; })[0];
        if (done) { curSub = KEY[codeOf(done.cat)]; try { out.onSubject(curSub); } catch (e) { /* ignore */ } }
        refresh(); return;
      }
      u.st = 'run'; paintUploads();
      uploadFile(u).then(function () { u.st = 'ok'; u.done = u.size; paintUploads(); next(); }, function (e) { u.st = 'err'; u.msg = e.message; paintUploads(); next(); });
    })();
  }
  function onUploadSubmit() {
    var files = Array.prototype.slice.call($('#upFiles').files || []);
    if (!files.length) { showErr(ui('m.lib.pick')); return; }
    showErr('');
    var meta = { title: ($('#upTitle').value || '').trim(), author: ($('#upAuthor').value || '').trim(), cat: $('#upCat').value, one: files.length === 1 };
    UPQ = files.map(function (f) { return { f: f, name: f.name, size: f.size, done: 0, st: 'wait', title: meta.title, author: meta.author, cat: meta.cat, one: meta.one }; });
    $('#upFiles').value = ''; paintUploads(); runUploads();
  }
  window.addEventListener('beforeunload', function (e) { if (uploading) { e.preventDefault(); e.returnValue = ''; } });

  /* ---------- shared playlists (lectures page) ---------- */
  function parseYT(u) {
    var l = u.match(/[?&]list=([\w-]+)/), v = u.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/);
    return l ? l[1] : v ? 'v:' + v[1] : /^[\w-]{11}$/.test(u) ? 'v:' + u : /^[\w-]{13,}$/.test(u) ? u : '';
  }
  function ytUrl(pl) { return String(pl).indexOf('v:') === 0 ? 'https://www.youtube.com/watch?v=' + pl.slice(2) : 'https://www.youtube.com/playlist?list=' + pl; }
  function ytTitle(pl) {
    if (M.demo) return Promise.resolve('');
    return new Promise(function (resolve) {
      var done = false, to = setTimeout(function () { if (!done) { done = true; resolve(''); } }, 6000);
      try {
        fetch('https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent(ytUrl(pl))).then(function (r) { return r.json(); })
          .then(function (j) { if (!done) { done = true; clearTimeout(to); resolve(j.title || ''); } }, function () { if (!done) { done = true; clearTimeout(to); resolve(''); } });
      } catch (e) { clearTimeout(to); resolve(''); }
    });
  }
  function allLists() { return (DB && DB.lists) || []; }
  /* The sheet has one table for shared entries. Rows whose link starts with "u:" are web links for the Books page; the rest are YouTube items. */
  function lists() { return allLists().filter(function (x) { return String(x.pl).indexOf('u:') !== 0; }); }
  function listById(id) { return lists().filter(function (x) { return x.id === id; })[0]; }
  function listByPl(pl) { return lists().filter(function (x) { return x.pl === pl; })[0]; }
  /* The sheet appends a row each time progress is saved, so the last row is the most recent thing watched. */
  function lastKey() {
    var p = (DB && DB.prog) || [];
    for (var i = p.length - 1; i >= 0; i--) if (p[i] && p[i].pl && String(p[i].pl).charAt(0) !== '@') return String(p[i].pl);
    return '';
  }
  function serverProg() { var m = {}; ((DB && DB.prog) || []).forEach(function (p) { m[p.pl] = { i: +p.i || 0, t: +p.t || 0 }; }); return m; }
  function playlistsHtml(embed, curId) {
    if (!S.tok) return '';
    var rows;
    if (!DB) rows = '<p class="muted">' + esc(dbState === 'err' ? dbErr : ui('m.lib.loading')) + '</p>' + (dbState === 'err' ? '<p><button type="button" class="btn btn--sm" data-m="retry">' + esc(ui('m.lib.retry')) + '</button></p>' : '');
    else if (!lists().length) rows = '<p class="muted">' + esc(ui('m.pl.empty')) + '</p>';
    else rows = '<ol class="lecs mls">' + lists().map(function (x) {
      var single = String(x.pl).indexOf('v:') === 0;
      var inner = '<span class="lec__n">' + ICON_PLAY + '</span><span class="lec__t"><b>' + esc(x.title) + '</b><small>' + esc(ui(single ? 'm.pl.kindVideo' : 'm.pl.kindList')) + (x.by ? ' &middot; ' + esc(x.by) : '') + '</small></span>';
      var main = embed
        ? '<button type="button" class="lec" data-mplay="' + esc(x.id) + '" data-key="' + esc(x.pl) + '" data-list="' + (single ? '0' : '1') + '"' + (curId === x.id ? ' aria-current="true"' : '') + '>' + inner + '<span class="lec__d"></span><span class="lec__bar" aria-hidden="true"></span></button>'
        : '<a class="lec" data-last="' + esc(x.pl) + '" href="' + esc(ytUrl(x.pl)) + '" target="_blank" rel="noopener noreferrer">' + inner + '<span class="lec__d"></span><span class="lec__go">' + ICON_EXT + '</span></a>';
      return '<li>' + main + (x.mine ? '<button type="button" class="mls__del" data-m="del-list" data-id="' + esc(x.id) + '" data-sure="' + esc(ui('m.sure')) + '" aria-label="' + esc(ui('m.delete') + ': ' + x.title) + '" title="' + esc(ui('m.delete')) + '">&times;</button>' : '') + '</li>';
    }).join('') + '</ol>';
    return '<section class="course pls" id="course-members"><div class="pls__head"><h2>' + esc(ui('m.pl.title')) + '</h2>' +
      '<button type="button" class="btn btn--sm" data-m="addlist">' + esc(ui('m.pl.add')) + '</button></div><p>' + esc(ui('m.pl.intro')) + '</p>' + rows + '</section>';
  }
  function addListBox() {
    openModal('<h2 id="mTitle">' + esc(ui('m.pl.add')) + '</h2>' +
      '<form id="mListForm" class="mform" novalidate>' +
        '<label class="fld"><span>' + esc(ui('m.pl.url')) + '</span><input id="plUrl" autocomplete="off" inputmode="url" placeholder="https://youtu.be/…"></label>' +
        '<label class="fld"><span>' + esc(ui('m.pl.name')) + '</span><input id="plName" autocomplete="off"></label>' +
        '<p class="mform__err" id="mErr" role="alert" hidden></p>' +
        '<button type="submit" class="btn">' + esc(ui('m.pl.save')) + '</button></form>');
  }
  function onListSubmit() {
    var pl = parseYT(($('#plUrl').value || '').trim());
    if (!pl) { showErr(ui('m.pl.bad')); return; }
    showErr(''); busy(true);
    var typed = ($('#plName').value || '').trim();
    (typed ? Promise.resolve(typed) : ytTitle(pl)).then(function (ti) {
      return call('addList', { title: ti || ui(pl.indexOf('v:') === 0 ? 'm.pl.kindVideo' : 'm.pl.kindList') + ' (YouTube)', pl: pl });
    }).then(function () { closeModal(); fetchedOnce = false; refresh(); }).then(null, function (e) { busy(false); showErr(e.message); });
  }

  /* ---------- internet resources added by members (Books page) ---------- */
  function safeUrl(u) { return /^https?:\/\/[^\s<>"']+$/i.test(String(u)); }
  function hostOf(u) { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return ''; } }
  function webItems() {
    return allLists().filter(function (x) { return String(x.pl).indexOf('u:') === 0; }).map(function (x) {
      var m = /^(\d)::([\s\S]*)$/.exec(x.title || ''), url = String(x.pl).slice(2);
      return { id: x.id, url: url, ti: m ? m[2] : (x.title || hostOf(url)), by: x.by, mine: x.mine, s: KEY[m ? codeOf(m[1]) : 3] };
    }).filter(function (w) { return safeUrl(w.url); });
  }
  function webRow(w) {
    var sub = esc(hostOf(w.url)) + (w.by ? ' &middot; ' + esc(ui('m.lib.addedBy', { name: w.by })) : '');
    return '<li class="weblink"><a class="weblink__a" href="' + esc(w.url) + '" target="_blank" rel="noopener noreferrer"><span class="weblink__t"><b>' + esc(w.ti) + '</b><small>' + sub + '</small></span><span class="weblink__go">' + ICON_EXT + '</span></a>' +
      (w.mine ? '<button type="button" class="mls__del" data-m="del-list" data-id="' + esc(w.id) + '" data-sure="' + esc(ui('m.sure')) + '" aria-label="' + esc(ui('m.delete') + ': ' + w.ti) + '" title="' + esc(ui('m.delete')) + '">&times;</button>' : '') + '</li>';
  }
  function webHtml() {
    if (!S.tok) return '';
    var body;
    if (dbState === 'err' && !DB) body = '<p class="mform__err">' + esc(dbErr) + '</p>';
    else if (!DB) body = '<p class="muted">' + esc(ui('m.lib.loading')) + '</p>';
    else {
      var r = webItems().filter(function (w) { return w.s === curSub; });
      body = r.length ? '<ul class="weblinks">' + r.map(webRow).join('') + '</ul>' : '<p class="muted">' + esc(ui('m.web.empty')) + '</p>';
    }
    return '<section class="shelf" id="webLinks"><div class="shelf__bar"><h3 class="shelf__h">' + esc(ui('m.web.title')) + '</h3>' +
      '<button type="button" class="btn btn--sm" data-m="addlink">' + esc(ui('m.web.add')) + '</button></div><p class="muted small">' + esc(ui('m.web.intro')) + '</p>' + body + '</section>';
  }
  function addLinkBox() {
    var cur = curSub === 'other' ? 'gr' : curSub;
    openModal('<h2 id="mTitle">' + esc(ui('m.web.add')) + '</h2>' + demoNote() +
      '<form id="mLinkForm" class="mform" novalidate>' +
        '<label class="fld"><span>' + esc(ui('m.web.url')) + '</span><input id="wlUrl" autocomplete="off" inputmode="url" placeholder="https://…"></label>' +
        '<label class="fld"><span>' + esc(ui('m.web.name')) + '</span><input id="wlName" autocomplete="off"></label>' +
        '<label class="fld"><span>' + esc(ui('m.lib.fCat')) + '</span><select id="wlSub">' + SUBJ.map(function (k) { return '<option value="' + k + '"' + (k === cur ? ' selected' : '') + '>' + esc(subjName(k)) + '</option>'; }).join('') + '</select></label>' +
        '<p class="mform__err" id="mErr" role="alert" hidden></p>' +
        '<button type="submit" class="btn">' + esc(ui('m.pl.save')) + '</button></form>');
  }
  function onLinkSubmit() {
    var u = ($('#wlUrl').value || '').trim();
    if (u && !/^[a-z][a-z0-9+.-]*:/i.test(u)) u = 'https://' + u;
    var host = hostOf(u), sub = $('#wlSub').value;
    if (!safeUrl(u) || host.indexOf('.') < 0 || !CODE.hasOwnProperty(sub)) { showErr(ui('m.web.bad')); return; }
    showErr(''); busy(true);
    var ti = ($('#wlName').value || '').trim() || host;
    call('addList', { title: CODE[sub] + '::' + ti, pl: 'u:' + u }).then(function () {
      curSub = sub; try { out.onSubject(sub); } catch (e) { /* ignore */ } closeModal(); fetchedOnce = false; refresh();
    }).then(null, function (e) { busy(false); showErr(e.message); });
  }

  /* ---------- events ---------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-m]') : null;
    if (!el) return;
    var act = el.getAttribute('data-m');
    if (act === 'signin') { signInBox('in'); return; }
    if (act === 'signup') { signInBox('up'); return; }
    if (act === 'account') { accountBox(); return; }
    if (act === 'close') { closeModal(); return; }
    if (act === 'signout') { closeModal(true); signOut(); return; }
    if (act === 'members') { membersBox(); return; }
    if (act === 'upload') { uploadBox(); return; }
    if (act === 'addlist') { addListBox(); return; }
    if (act === 'addlink') { addLinkBox(); return; }
    if (act === 'retry') { fetchedOnce = false; dbState = 'idle'; refresh(); return; }
    if (act === 'eye') {
      var inp = document.getElementById(el.getAttribute('data-for'));
      if (inp) { var show = inp.type === 'password'; inp.type = show ? 'text' : 'password'; el.setAttribute('aria-pressed', String(show)); el.setAttribute('aria-label', ui(show ? 'm.hide' : 'm.show')); }
      return;
    }
    if (act === 'setrole') {
      call('setRole', { name: el.getAttribute('data-name'), role: el.getAttribute('data-role') }).then(membersBox, function (er) { showErr(er.message); });
      return;
    }
    if (act === 'del-user') {
      if (!armed(el)) return;
      call('delUser', { name: el.getAttribute('data-name') }).then(membersBox, function () { /* shown by next load */ });
      return;
    }
    if (act === 'del-book') {
      if (!armed(el)) return;
      call('delBook', { id: el.getAttribute('data-id') }).then(function () { fetchedOnce = false; refresh(); }, function () { /* ignore */ });
      return;
    }
    if (act === 'del-list') {
      if (!armed(el)) return;
      call('delList', { id: el.getAttribute('data-id') }).then(function () { fetchedOnce = false; refresh(); }, function () { /* ignore */ });
      return;
    }
  });
  document.addEventListener('submit', function (e) {
    var f = e.target, id = f && f.id;
    if (id === 'mForm') { e.preventDefault(); onAuthSubmit(f); }
    else if (id === 'mPassForm') { e.preventDefault(); onPassSubmit(); }
    else if (id === 'mUpForm') { e.preventDefault(); onUploadSubmit(); }
    else if (id === 'mListForm') { e.preventDefault(); onListSubmit(); }
    else if (id === 'mLinkForm') { e.preventDefault(); onLinkSubmit(); }
  });
  document.addEventListener('input', function (e) {
    if (e.target && e.target.id === 'libQ') { libQ = e.target.value; var g = $('#libGrid'); if (g && DB) g.innerHTML = libGrid(); }
  });
  document.addEventListener('keydown', function (e) {
    if (!modalEl) return;
    if (e.key === 'Escape' && !uploading) { closeModal(); return; }
    if (e.key === 'Tab') {
      var f = $$all('button:not([disabled]), input:not([disabled]):not([type=hidden]), select:not([disabled]), a[href]', modalEl);
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  window.SiteMembers = {
    enabled: enabled,
    demo: !!M.demo,
    out: out,
    signedIn: function () { return !!S.tok; },
    user: function () { return { name: S.name, role: S.role }; },
    needsLogin: needsLogin,
    lockHtml: lockHtml,
    accountButton: accountButton,
    ensureData: ensureData,
    libraryHtml: libraryHtml,
    setSearch: function (q) { libQ = String(q || ''); },
    setSubject: function (k) { if (k === 'other' || CODE.hasOwnProperty(k)) curSub = k; },
    groupCount: function (k) { return DB ? libItems().filter(function (b) { return b.s === k; }).length : null; },
    webHtml: webHtml,
    webCount: function (k) { return DB ? webItems().filter(function (w) { return w.s === k; }).length : 0; },
    playlistsHtml: playlistsHtml,
    listById: listById,
    listByPl: listByPl,
    lastKey: lastKey,
    serverProg: serverProg,
    saveProg: saveProg,
    ytUrl: ytUrl,
    open: function (mode) { signInBox(mode === 'up' ? 'up' : 'in'); }
  };
})();

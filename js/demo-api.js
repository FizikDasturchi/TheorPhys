/* In-browser stand-in for the Google Apps Script backend (backend/code.gs).
 *
 * It speaks the same request/response protocol, so the site can be previewed and tested without
 * a server. Used only when members.demo is true in config.js. Accounts and files live in this
 * browser's storage; passwords are NOT protected here. Never use this for real accounts.
 */
(function (root) {
  'use strict';

  var KEY = 'bhg.demo.db';
  var mem = null;
  var fails = {}, regCount = 0;

  function load() {
    try { var s = root.localStorage && root.localStorage.getItem(KEY); if (s) return JSON.parse(s); } catch (e) { /* storage unavailable */ }
    return mem ? JSON.parse(JSON.stringify(mem)) : null;
  }
  function save(db) {
    mem = JSON.parse(JSON.stringify(db));
    try { if (root.localStorage) root.localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { /* storage unavailable */ }
  }
  function norm(s) { return String(s).toLowerCase().replace(/[ʻʼ'`’‘]/g, "'").replace(/\s+/g, ' ').trim(); }
  function uid() { var s = ''; for (var i = 0; i < 32; i++) s += Math.floor(Math.random() * 16).toString(16); return s; }
  function hs(p, salt) { /* demo only: a toy hash */
    var h = 2166136261, str = salt + p + salt, i;
    for (i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h.toString(36);
  }
  function seed() {
    var db = { Users: [], Sessions: [], Books: [], Lists: [], Prog: [] };
    var salt = uid();
    db.Users.push({ name: 'Demo Admin', key: 'demo admin', salt: salt, hash: hs('demo1234', salt), role: 'admin' });
    db.Lists.push({ id: uid(), title: 'Theoretical mechanics, lecture I (sample)', pl: 'v:k0jBnoogwVA', by: 'Demo Admin' });
    db.Books.push({ id: uid(), title: '0::Sample notes on vectors and tensors', author: 'Demo Admin', fileId: 'demo-1', by: 'Demo Admin', at: 0 });
    db.Books.push({ id: uid(), title: '2::Sample notes on general relativity', author: 'Demo Admin', fileId: 'demo-2', by: 'Demo Admin', at: 0 });
    return db;
  }

  function handle(q) {
    var db = load() || seed(), a = q.action, dirty = false;
    function done(r) { if (dirty) save(db); return r; }
    if (!load()) { dirty = true; }

    function addUser(name, pass, role) {
      var key = norm(name);
      if (!key || String(pass).length < 6) throw 'Parol kamida 6 belgi';
      if (db.Users.some(function (u) { return u.key === key; })) throw "Bunday a'zo bor";
      var salt = uid(); db.Users.push({ name: String(name).trim(), key: key, salt: salt, hash: hs(pass, salt), role: role || 'member' }); dirty = true;
    }
    if (a === 'login') {
      var k = norm(q.name), n = fails[k] || 0;
      if (n >= 8) throw "Ko'p urinish. 10 daqiqadan so'ng qayta urining";
      var u0 = db.Users.filter(function (x) { return x.key === k; })[0];
      if (!u0 || hs(q.pass, u0.salt) !== u0.hash) { fails[k] = n + 1; throw "Ism yoki parol noto'g'ri"; }
      delete fails[k];
      var token = uid() + uid(); db.Sessions.push({ token: token, key: k, exp: Date.now() + 30 * 864e5 }); dirty = true;
      return done({ token: token, name: u0.name, role: u0.role });
    }
    if (a === 'register') {
      if (regCount >= 40) throw "Juda ko'p urinish. Keyinroq qayta urining";
      if (norm(q.name).split(' ').length < 2) throw 'Ism va familiyani kiriting';
      regCount++; addUser(q.name, q.pass, 'member'); return done({ ok: 1 });
    }
    if (a === 'about') return { about: { uz: '', en: '', ru: '' } };

    var sess = db.Sessions.filter(function (x) { return x.token === q.token && x.exp > Date.now(); })[0];
    var user = sess && db.Users.filter(function (x) { return x.key === sess.key; })[0];
    if (!user) throw 'auth';
    var admin = user.role === 'admin', team = admin || user.role === 'team';
    function must() { if (!admin) throw 'Faqat adminlar uchun'; }
    function needTeam() { if (!team) throw "Ruxsat yo'q"; }

    switch (a) {
      case 'data':
        return {
          role: user.role,
          books: team ? db.Books.map(function (b) { return { id: b.id, title: b.title, author: b.author, fileId: b.fileId, by: b.by, mine: admin || b.by === user.name }; }) : [],
          lists: db.Lists.filter(function (l) { return team || String(l.pl).indexOf('u:') !== 0; }).map(function (l) { return { id: l.id, title: l.title, pl: l.pl, by: l.by, mine: team && (admin || l.by === user.name) }; }),
          prog: db.Prog.filter(function (p) { return p.key === user.key; }).map(function (p) { return { pl: p.pl, i: p.i, t: p.t }; })
        };
      case 'upStart':
        needTeam();
        if (!(+q.size > 0)) throw "Fayl bo'sh";
        return { url: 'https://www.googleapis.com/upload/drive/v3/files?demo=1' };
      case 'upPart':
        needTeam();
        if (!/^https:\/\/www\.googleapis\.com\/upload\/drive\/v3\/files\?/.test(q.url)) throw "Noto'g'ri so'rov";
        var got = q.b64 ? Math.floor(String(q.b64).length * 3 / 4) - (String(q.b64).slice(-2) === '==' ? 2 : String(q.b64).slice(-1) === '=' ? 1 : 0) : (+q.size || 0);
        if ((+q.start || 0) + got < (+q.size || 0)) return done({ ok: 1 }); /* more chunks to come */
        db.Books.push({ id: uid(), title: q.title || 'file', author: q.author || '', fileId: 'demo-' + uid().slice(0, 6), by: user.name, at: Date.now() }); dirty = true;
        return done({ ok: 1, done: 1 });
      case 'delBook': {
        needTeam();
        var b = db.Books.filter(function (x) { return x.id === q.id; })[0];
        if (!b || !(admin || b.by === user.name)) throw "Ruxsat yo'q";
        db.Books = db.Books.filter(function (x) { return x.id !== q.id; }); dirty = true; return done({ ok: 1 });
      }
      case 'addList': needTeam(); db.Lists.push({ id: uid(), title: q.title, pl: q.pl, by: user.name }); dirty = true; return done({ ok: 1 });
      case 'delList': {
        needTeam();
        var l = db.Lists.filter(function (x) { return x.id === q.id; })[0];
        if (!l || !(admin || l.by === user.name)) throw "Ruxsat yo'q";
        db.Lists = db.Lists.filter(function (x) { return x.id !== q.id; }); dirty = true; return done({ ok: 1 });
      }
      case 'prog':
        db.Prog = db.Prog.filter(function (p) { return !(p.key === user.key && p.pl === q.pl); });
        db.Prog.push({ key: user.key, pl: q.pl, i: q.i, t: q.t, at: Date.now() }); dirty = true; return done({ ok: 1 });
      case 'changePass': {
        var r = db.Users.filter(function (x) { return x.key === user.key; })[0];
        if (hs(q.old, r.salt) !== r.hash) throw "Joriy parol noto'g'ri";
        if (String(q.pass).length < 6) throw 'Parol kamida 6 belgi';
        r.salt = uid(); r.hash = hs(q.pass, r.salt); dirty = true; return done({ ok: 1 });
      }
      case 'users': must(); return { users: db.Users.map(function (x) { return { name: x.name, role: x.role }; }) };
      case 'setRole': {
        must(); var kk = norm(q.name);
        if (kk === user.key) throw "O'z rolingizni o'zgartira olmaysiz";
        if (q.role !== 'team' && q.role !== 'member') throw "Noto'g'ri rol";
        var t = db.Users.filter(function (x) { return x.key === kk; })[0]; if (!t) throw "A'zo topilmadi";
        if (t.role === 'admin') throw "Ruxsat yo'q";
        t.role = q.role; dirty = true; return done({ ok: 1 });
      }
      case 'delUser': {
        must(); var dk = norm(q.name);
        if (dk === user.key) throw "O'zingizni o'chira olmaysiz";
        db.Users = db.Users.filter(function (x) { return x.key !== dk; }); db.Sessions = db.Sessions.filter(function (x) { return x.key !== dk; }); dirty = true; return done({ ok: 1 });
      }
    }
    throw "Noma'lum amal";
  }

  function run(q) {
    try { return handle(q); } catch (x) { return { err: String(x) }; }
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { run: run };
  else root.SiteDemoApi = { run: function (q) { return new Promise(function (resolve) { setTimeout(function () { resolve(run(q)); }, 120); }); } };
})(typeof window !== 'undefined' ? window : globalThis);

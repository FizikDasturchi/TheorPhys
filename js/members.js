/* RTP sayti backendi. Google Sheets'da ochilgan Apps Script (Extensions > Apps Script) ichiga qo'ying.
   Eski kod o'rniga to'liq almashtiring, so'ng: Deploy > Manage deployments > Edit > New version > Deploy.
   (ADMINS parollari va FOLDER_ID ni o'zingiznikiga moslang.) */
/* ROLLAR: 'member' = mehmon (yangi ro'yxatdan o'tgan): Ma'ruzalarni, Kitoblarni va havolalarni ko'radi/yuklab oladi, lekin hech narsa QO'SHA OLMAYDI,
           'ask'    = mehmon, "Jamoaga qo'shilish" so'rovi yuborgan (huquqlari mehmonnikidek, adminlar tasdiqlashini kutmoqda),
           'team'   = jamoa a'zosi (kitob yuklaydi, video-playlist va havola qo'shadi; uni adminlar tasdiqlaydi),
           'admin'  = ADMINS ro'yxatidagi ikki kishi (hammasi + jamoa a'zolarini tasdiqlash). */
const ADMINS = [['Muhammadsodiq Shamsiddinov', 'Fizika2026'], ['Bakhodir Shodikulov', 'demo1234']];
const SS = SpreadsheetApp.getActive(), FOLDER = 'RTP_Resurslar';
const COLS = {Users:['name','key','salt','hash','role'], Sessions:['token','key','exp'], Books:['id','title','author','fileId','by','at'],
  Lists:['id','title','pl','by'], Prog:['key','pl','i','t','at'], Cfg:['k','v']};
const norm = s => String(s).toLowerCase().replace(/[ʻʼ'`’‘]/g, "'").replace(/\s+/g, ' ').trim();
const hs = (p, s) => { let h = s + p; for (let i = 0; i < 300; i++) h = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, h + s)); return h; };
const sh = n => SS.getSheetByName(n) || (() => { const s = SS.insertSheet(n); s.appendRow(COLS[n]); return s; })();
const rows = n => { const v = sh(n).getDataRange().getValues(), h = v.shift(); return v.map(r => Object.fromEntries(h.map((k, i) => [k, r[i]]))); };
const add = (n, o) => sh(n).appendRow(COLS[n].map(k => o[k] === undefined ? '' : o[k]));
const del = (n, col, val) => { const s = sh(n), v = s.getDataRange().getValues(), c = v[0].indexOf(col);
  for (let i = v.length - 1; i > 0; i--) if (String(v[i][c]) === String(val)) s.deleteRow(i + 1); };
const uid = () => Utilities.getUuid().replace(/-/g, '');

function setup() { Object.keys(COLS).forEach(sh); ADMINS.forEach(a => addUser(a[0], a[1], 'admin')); }
function addUser(name, pass, role) {
  const key = norm(name); if (!key || String(pass).length < 6) throw 'Parol kamida 6 belgi';
  if (rows('Users').some(u => u.key === key)) throw 'Bunday a\'zo bor';
  CacheService.getScriptCache().remove('x' + key); const salt = uid(); add('Users', {name: name.trim(), key, salt, hash: hs(pass, salt), role: role || 'member'});
}
function auth(t) {
  const c = CacheService.getScriptCache(), h = c.get('s' + t);
  if (h) { const o = JSON.parse(h); if (c.get('x' + o.key)) throw 'auth'; o.role = c.get('r' + o.key) || o.role; return o; }
  const s = rows('Sessions').find(x => x.token === t && x.exp > Date.now()); if (!s) throw 'auth';
  const u = rows('Users').find(x => x.key === s.key); if (!u) throw 'auth';
  const o = {key: u.key, name: u.name, role: u.role}; c.put('s' + t, JSON.stringify(o), 21600); return o;
}
function login(name, pass) {
  const key = norm(name), c = CacheService.getScriptCache(), n = +c.get('f' + key) || 0;
  if (n >= 8) throw 'Ko\'p urinish. 10 daqiqadan so\'ng qayta urining';
  const u = rows('Users').find(x => x.key === key);
  if (!u || hs(pass, u.salt) !== u.hash) { c.put('f' + key, n + 1, 600); throw 'Ism yoki parol noto\'g\'ri'; }
  c.remove('f' + key); const token = uid() + uid(); add('Sessions', {token, key, exp: Date.now() + 30 * 864e5});
  return {token, name: u.name, role: u.role};
}
const ALLOWED_ORIGINS = ['https://fizikdasturchi.github.io', 'https://theorphys.uz', 'https://www.theorphys.uz']; // brauzerdan to'g'ridan-to'g'ri yuklashga ruxsat etilgan sayt manzillari
const FOLDER_ID = '1aVA3li3etS2lVcFJbOmQIeYbFGGnVOEL'; // Drive papkasi ID (bo'sh bo'lsa RTP_Resurslar papkasi o'zi yaratiladi)
function folder() { if (FOLDER_ID) return DriveApp.getFolderById(FOLDER_ID); const f = DriveApp.getFoldersByName(FOLDER); return f.hasNext() ? f.next() : DriveApp.createFolder(FOLDER); }
const getCfg = k => (rows('Cfg').find(r => r.k === k) || {}).v || '';
function setCfg(k, v) { del('Cfg', 'k', k); add('Cfg', {k, v}); }

/* Faqat o'qish so'rovlari (data, about) va fayl bo'laklari (upPart) qulfsiz ishlaydi, shuning uchun katta fayl yuklanayotganda sayt qotib qolmaydi */
function doPost(e) {
  let lock = null;
  try {
    const q = JSON.parse(e.postData.contents);
    if (q.action !== 'data' && q.action !== 'about' && q.action !== 'upPart' && q.action !== 'upStart') { lock = LockService.getScriptLock(); lock.waitLock(30000); }
    return out(run(q));
  } catch (x) { return out({err: String(x)}); } finally { if (lock) lock.releaseLock(); }
}
const out = o => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);

function run(q) {
  const a = q.action;
  if (a === 'login') return login(q.name, q.pass);
  if (a === 'register') { // ro'yxatdan o'tish: hamma uchun ochiq, doim oddiy a'zo
    const c = CacheService.getScriptCache(), n = +c.get('reg') || 0;
    if (n >= 40) throw 'Juda ko\'p urinish. Keyinroq qayta urining';
    if (norm(q.name).split(' ').length < 2) throw 'Ism va familiyani kiriting';
    c.put('reg', n + 1, 3600); addUser(q.name, q.pass, 'member'); return {ok: 1};
  }
  if (a === 'about') return {about: {uz: getCfg('about_uz'), en: getCfg('about_en'), ru: getCfg('about_ru')}};
  const u = auth(q.token), admin = u.role === 'admin', team = admin || u.role === 'team',
    must = () => { if (!admin) throw 'Faqat adminlar uchun'; },
    needTeam = () => { if (!team) throw 'Ruxsat yo\'q'; }; // kitoblar va playlist qo'shish/o'chirish: faqat jamoa a'zolari va adminlar
  switch (a) {
    case 'data': return {
      role: u.role, // sayt shu orqali rol o'zgarganini darrov biladi
      waiting: admin ? rows('Users').filter(x => x.role === 'ask').length : 0, // adminlar uchun: tasdiqlashni kutayotganlar soni
      books: rows('Books').map(b => ({id: b.id, title: b.title, author: b.author, fileId: b.fileId, by: b.by, mine: team && (admin || b.by === u.name)})), // hamma kira oladi; qo'shish/o'chirish faqat jamoa
      lists: rows('Lists').map(l => ({id: l.id, title: l.title, pl: l.pl, by: l.by, mine: team && (admin || l.by === u.name)})), // 'u:' = Kitoblar bo'limidagi internet havolalar
      prog: rows('Prog').filter(p => p.key === u.key).map(p => ({pl: p.pl, i: p.i, t: p.t}))};
    case 'upload': { needTeam();
      const blob = Utilities.newBlob(Utilities.base64Decode(q.b64), q.mime || 'application/octet-stream', q.fileName);
      const f = folder().createFile(blob); f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      add('Books', {id: uid(), title: q.title || q.fileName, author: q.author || '', fileId: f.getId(), by: u.name, at: new Date()}); return {ok: 1};
    }
    /* Katta fayllar: Drive "resumable upload" sessiyasi. Hajm cheklovi yo'q, fayl bo'laklab to'g'ridan-to'g'ri Drive'ga yoziladi */
    case 'upStart': { needTeam();
      if (!(+q.size > 0)) throw 'Fayl bo\'sh';
      const origin = ALLOWED_ORIGINS.indexOf(q.origin) >= 0 ? q.origin : null;
      const init = org => {
        const hd = {Authorization: 'Bearer ' + ScriptApp.getOAuthToken(), 'X-Upload-Content-Type': q.mime || 'application/octet-stream', 'X-Upload-Content-Length': String(q.size)};
        if (org) hd['Origin'] = org;
        return UrlFetchApp.fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable', {method: 'post', contentType: 'application/json; charset=UTF-8',
          headers: hd, payload: JSON.stringify({name: q.fileName, parents: [folder().getId()]}), muteHttpExceptions: true, followRedirects: false});
      };
      let r = null, direct = false;
      if (origin) { try { r = init(origin); direct = r.getResponseCode() === 200; } catch (e) { r = null; } } // Origin bilan ochilgan sessiyani brauzer Drive'ga to'g'ridan-to'g'ri yuboradi
      if (!direct) r = init(null); // bo'lmasa oddiy sessiya (Apps Script orqali bo'laklab)
      if (r.getResponseCode() !== 200) throw 'Drive sessiyasi ochilmadi (' + r.getResponseCode() + '): ' + r.getContentText().slice(0, 150);
      const h = r.getHeaders(); return {url: h['Location'] || h['location'], direct}; }
    /* Brauzer faylni Drive'ga o'zi yuklab bo'lgach: ulashish ruxsati + Books jadvaliga yozuv (qulf ichida, chunki 'upDone' qulfsiz ro'yxatda yo'q) */
    case 'upDone': { needTeam();
      if (!q.fileId) throw 'fileId berilmagan';
      const f = DriveApp.getFileById(q.fileId), fid = folder().getId(); let ok = false;
      for (const it = f.getParents(); it.hasNext();) if (it.next().getId() === fid) ok = true;
      if (!ok) throw 'Fayl kutubxona papkasida emas';
      if (rows('Books').some(b => b.fileId === q.fileId)) return {ok: 1, done: 1}; // qayta so'rov bo'lsa ikki marta yozilmasin
      f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      add('Books', {id: uid(), title: q.title || q.fileName, author: q.author || '', fileId: q.fileId, by: u.name, at: new Date()}); return {ok: 1, done: 1}; }
    case 'upPart': { needTeam();
      if (!/^https:\/\/www\.googleapis\.com\/upload\/drive\/v3\/files\?/.test(q.url)) throw 'Noto\'g\'ri so\'rov';
      const bytes = Utilities.base64Decode(q.b64), end = +q.start + bytes.length - 1;
      const r = UrlFetchApp.fetch(q.url, {method: 'put', contentType: 'application/octet-stream', payload: bytes, followRedirects: false, muteHttpExceptions: true,
        headers: {'Content-Range': 'bytes ' + q.start + '-' + end + '/' + q.size}});
      const c = r.getResponseCode();
      if (c === 308) return {ok: 1};
      if (c === 200 || c === 201) {
        const id = JSON.parse(r.getContentText()).id; DriveApp.getFileById(id).setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        const lk = LockService.getScriptLock(); lk.waitLock(30000);
        try { add('Books', {id: uid(), title: q.title || q.fileName, author: q.author || '', fileId: id, by: u.name, at: new Date()}); } finally { lk.releaseLock(); }
        return {ok: 1, done: 1}; }
      throw 'Drive xatosi (' + c + '): ' + r.getContentText().slice(0, 150); }
    case 'delBook': { needTeam(); const b = rows('Books').find(x => x.id === q.id); if (!b || !(admin || b.by === u.name)) throw 'Ruxsat yo\'q';
      try { DriveApp.getFileById(b.fileId).setTrashed(true); } catch (e) {} del('Books', 'id', q.id); return {ok: 1}; }
    case 'addList': needTeam(); add('Lists', {id: uid(), title: q.title, pl: q.pl, by: u.name}); return {ok: 1};
    case 'delList': { needTeam(); const l = rows('Lists').find(x => x.id === q.id); if (!l || !(admin || l.by === u.name)) throw 'Ruxsat yo\'q'; del('Lists', 'id', q.id); return {ok: 1}; }
    case 'prog': { const s = sh('Prog'), v = s.getDataRange().getValues();
      for (let i = v.length - 1; i > 0; i--) if (v[i][0] === u.key && v[i][1] === q.pl) s.deleteRow(i + 1);
      add('Prog', {key: u.key, pl: q.pl, i: q.i, t: q.t, at: new Date()}); return {ok: 1}; }
    case 'askJoin': { // mehmon "Jamoaga qo'shilish" ni bosadi: so'rov adminlarga ko'rinadi, huquqlar o'zgarmaydi
      if (team) return {ok: 1};
      const s = sh('Users'), v = s.getDataRange().getValues(), i = v.findIndex((r, j) => j > 0 && r[1] === u.key); if (i < 0) throw 'A\'zo topilmadi';
      if (v[i][4] === 'member') { s.getRange(i + 1, 5).setValue('ask'); CacheService.getScriptCache().put('r' + u.key, 'ask', 21600); }
      setCfg('ask:' + u.key, String(q.note || '').trim().slice(0, 200)); return {ok: 1}; }
    case 'saveAbout': must(); setCfg('about_' + q.lang, q.text); return {ok: 1};
    case 'changePass': { const r = rows('Users').find(x => x.key === u.key); if (hs(q.old, r.salt) !== r.hash) throw 'Joriy parol noto\'g\'ri'; setPass(u.name, q.pass); return {ok: 1}; }
    case 'users': { must(); const cf = rows('Cfg');
      return {users: rows('Users').map(x => ({name: x.name, role: x.role, note: x.role === 'ask' ? ((cf.find(r => r.k === 'ask:' + x.key) || {}).v || '') : ''}))}; }
    case 'addUser': must(); if (['member', 'team', 'admin'].indexOf(q.role || 'member') < 0) throw 'Noto\'g\'ri rol'; addUser(q.name, q.pass, q.role); return {ok: 1};
    case 'setRole': { must(); const k = norm(q.name); if (k === u.key) throw 'O\'z rolingizni o\'zgartira olmaysiz';
      if (q.role !== 'team' && q.role !== 'member') throw 'Noto\'g\'ri rol'; // adminlikni bu tugma bermaydi va olmaydi: adminlar faqat ADMINS ro'yxatida
      const s = sh('Users'), v = s.getDataRange().getValues(), i = v.findIndex((r, j) => j > 0 && r[1] === k); if (i < 0) throw 'A\'zo topilmadi';
      if (v[i][4] === 'admin') throw 'Ruxsat yo\'q';
      s.getRange(i + 1, 5).setValue(q.role); CacheService.getScriptCache().put('r' + k, q.role, 21600); del('Cfg', 'k', 'ask:' + k); return {ok: 1}; } // tasdiqlash ('team') yoki rad etish ('member'): so'rov izohi o'chadi
    case 'delUser': { must(); const k = norm(q.name); if (k === u.key) throw 'O\'zingizni o\'chira olmaysiz'; del('Users', 'key', k); del('Sessions', 'key', k); del('Cfg', 'k', 'ask:' + k); CacheService.getScriptCache().put('x' + k, '1', 21600); return {ok: 1}; }
  }
  throw 'Noma\'lum amal';
}

/* Tiklash / sinxronlash: ADMINS ro'yxati o'zgarganda (yangi admin, yangi parol) shu funksiyani bir marta Run qiling.
   - ADMINS dagi har bir kishi: akkaunt bo'lmasa yaratiladi, bo'lsa paroli ADMINS dagi parolga o'rnatiladi va roli 'admin' bo'ladi;
   - ADMINS da yo'q, lekin hali 'admin' bo'lib turgan eski qatorlar oddiy akkauntga (member) tushiriladi.
   Parollarni saytga kirgach almashtiring. */
function tiklash() {
  const keys = ADMINS.map(a => norm(a[0]));
  ADMINS.forEach(a => { try { setPass(a[0], a[1]); } catch (e) { addUser(a[0], a[1], 'admin'); } setRoleByKey(norm(a[0]), 'admin'); });
  rows('Users').forEach(u => { if (u.role === 'admin' && keys.indexOf(u.key) < 0) setRoleByKey(u.key, 'member'); });
}
function setRoleByKey(k, role) {
  const s = sh('Users'), v = s.getDataRange().getValues();
  for (let i = 1; i < v.length; i++) if (v[i][1] === k && v[i][4] !== role) { s.getRange(i + 1, 5).setValue(role); CacheService.getScriptCache().put('r' + k, role, 21600); }
}
function setPass(name, pass) {
  const s = sh('Users'), v = s.getDataRange().getValues(), i = v.findIndex((r, j) => j > 0 && r[1] === norm(name));
  if (i < 0) throw 'A\'zo topilmadi'; if (String(pass).length < 6) throw 'Parol kamida 6 belgi';
  const salt = uid(); s.getRange(i + 1, 3, 1, 2).setValues([[salt, hs(pass, salt)]]);
}

/* BIR MARTA: yangi ruxsatlarni (UrlFetch + Drive) tasdiqlash uchun shu funksiyani editorda Run qiling, so'ng New version deploy qiling. */
function ruxsat() { DriveApp.getRootFolder(); UrlFetchApp.fetch('https://www.googleapis.com/drive/v3/about?fields=user', {headers: {Authorization: 'Bearer ' + ScriptApp.getOAuthToken()}}); }

/* Page rendering, routing and interaction. */
(function () {
  'use strict';

  var CFG = window.SITE_CONFIG, D = window.SITE_DATA, I = window.SITE_I18N;
  var t = I.t, ui = I.ui;
  var SM = window.SiteMembers;
  var SY = window.SiteYT;

  var ROUTES = ['home', 'people', 'research', 'publications', 'lectures', 'books', 'start', 'join'];
  var FLAGS = {
    uz: '<svg class="flag" viewBox="0 0 30 20" aria-hidden="true" focusable="false"><rect width="30" height="20" fill="#1eb53a"/><rect width="30" height="6.2" fill="#0099b5"/><rect y="6.2" width="30" height="7.6" fill="#ce1126"/><rect y="6.9" width="30" height="6.2" fill="#fff"/><circle cx="5.6" cy="3.1" r="2.1" fill="#fff"/><circle cx="6.5" cy="3.1" r="1.8" fill="#0099b5"/><g fill="#fff"><circle cx="9.2" cy="1.8" r=".5"/><circle cx="11" cy="1.8" r=".5"/><circle cx="12.8" cy="1.8" r=".5"/><circle cx="10.1" cy="3.4" r=".5"/><circle cx="11.9" cy="3.4" r=".5"/><circle cx="11" cy="5" r=".5"/></g></svg>',
    ru: '<svg class="flag" viewBox="0 0 30 20" aria-hidden="true" focusable="false"><rect width="30" height="20" fill="#fff"/><rect y="6.67" width="30" height="6.67" fill="#0039a6"/><rect y="13.33" width="30" height="6.67" fill="#d52b1e"/></svg>',
    en: '<svg class="flag" viewBox="0 0 60 40" preserveAspectRatio="none" aria-hidden="true" focusable="false"><rect width="60" height="40" fill="#012169"/><path d="M0 0 60 40M60 0 0 40" stroke="#fff" stroke-width="8"/><path d="M0 0 60 40M60 0 0 40" stroke="#c8102e" stroke-width="3"/><path d="M30 0v40M0 20h60" stroke="#fff" stroke-width="13"/><path d="M30 0v40M0 20h60" stroke="#c8102e" stroke-width="8"/></svg>'
  };
  var LANGS = [
    { code: 'uz', label: 'UZ', name: "O'zbekcha" },
    { code: 'ru', label: 'RU', name: 'Русский' },
    { code: 'en', label: 'EN', name: 'English' }
  ];
  var state = { route: 'home', pubTheme: 'all', pubQ: '', pplLevel: 'all', booksTab: 'gr', booksMode: 'group', play: null, mlist: null, wantKey: null, picked: false, scrollTo: null };

  var PROG = {};          /* lecture progress, this browser only: { videoId: {t, d, done} } */
  var lect = { ctl: null, key: null, force: false };
  var autoNext = true;

  /* ---------- helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function store(key, val) {
    try { if (val === undefined) return window.localStorage.getItem('bhg.' + key); window.localStorage.setItem('bhg.' + key, val); } catch (e) { /* storage unavailable */ }
    return null;
  }
  function ext(url, html, cls) {
    return '<a' + (cls ? ' class="' + cls + '"' : '') + ' href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + html + ICON.ext + '</a>';
  }
  try { PROG = JSON.parse(store('vp') || '{}') || {}; } catch (e) { PROG = {}; }
  autoNext = store('autonext') !== '0';
  function themeById(id) { return D.THEMES.filter(function (x) { return x.id === id; })[0]; }
  function bookById(id) { return D.BOOKS.filter(function (x) { return x.id === id; })[0]; }
  function initials(name) {
    var parts = String(name).replace(/[^\p{L}\s]/gu, '').split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '·';
    var a = parts[0].charAt(0), b = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
    return (a + b).toUpperCase();
  }
  var MONTHS = {
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    ru: ['янв.', 'февр.', 'мар.', 'апр.', 'мая', 'июн.', 'июл.', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'],
    uz: ['yan.', 'fev.', 'mar.', 'apr.', 'may', 'iyun', 'iyul', 'avg.', 'sen.', 'okt.', 'noy.', 'dek.']
  };
  function fmtDate(iso) {
    var p = iso.split('-');
    return (+p[2]) + ' ' + MONTHS[I.lang][+p[1] - 1] + ' ' + p[0];
  }
  function fmtDur(min) {
    var h = Math.floor(min / 60), m = min % 60;
    return (h ? h + ' ' + ui('lect.h') + ' ' : '') + m + ' ' + ui('lect.min');
  }
  function ytWatch(id) { return 'https://www.youtube.com/watch?v=' + id; }
  function scholarUrl(c) {
    var surname = String(c.authors).split(',')[0].replace(/\./g, ' ').trim().split(/\s+/).pop();
    return 'https://scholar.google.com/scholar?q=' + encodeURIComponent('"' + c.title + '" ' + surname);
  }
  function countPapers(themeId) {
    return D.PUBLICATIONS.filter(function (p) { return p.themes.indexOf(themeId) >= 0; }).length;
  }
  var ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'];
  /* A video of a members' playlist, shaped like a course lecture, so the player treats both the same way. */
  function plVideo(id) {
    var v = SY && SY.video(id);
    if (!v) return null;
    var m = SM && SM.listByPl ? SM.listByPl(v.pl) : null;
    var min = v.s ? Math.max(1, Math.round(v.s / 60)) : 0;
    return { id: v.id, n: v.count <= 20 ? ROMAN[v.i] : String(v.i + 1), title: v.t || (ui('m.pl.kindVideo') + ' ' + (v.i + 1)), min: min,
      sub: (m ? m.title : '') + (m && min ? ' · ' : '') + (min ? fmtDur(min) : '') };
  }
  function lectureById(id) { return allLectures().filter(function (x) { return x.id === id; })[0] || plVideo(id); }
  function nextLecture(id) {
    for (var i = 0; i < D.COURSES.length; i++) {
      var ls = D.COURSES[i].lectures;
      for (var j = 0; j < ls.length; j++) if (ls[j].id === id) return ls[j + 1] || null;
    }
    return SY ? SY.next(id) : null; /* the next topic of a members' playlist */
  }
  function embedOn() { return CFG.embedVideos !== false && !!(window.SitePlayer && window.SitePlayer.ok); }
  function fmtClock(sec) {
    sec = Math.max(0, Math.floor(sec));
    var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return (h ? h + ':' + (m < 10 ? '0' : '') + m : m) + ':' + (s < 10 ? '0' : '') + s;
  }
  function portrait(p, cls) {
    var name = t(p.name), ini = initials(name);
    if (p.photo) {
      return '<img class="avatar ' + cls + '" src="' + esc(p.photo) + '" alt="' + esc(name) + '" data-initials="' + esc(ini) + '" loading="lazy" decoding="async">';
    }
    return '<span class="avatar ' + cls + '" aria-hidden="true">' + esc(ini) + '</span>';
  }
  function band() { return CFG.ornament ? '<div class="band" aria-hidden="true"></div>' : ''; }
  function lectureCount() { return D.COURSES.reduce(function (n, c) { return n + c.lectures.length; }, 0); }
  function allLectures() { return D.COURSES.reduce(function (a, c) { return a.concat(c.lectures); }, []); }

  /* ---------- icons ---------- */
  var ICON = {
    pdf: '<svg class="ico" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2v8M4.8 7.2 8 10.4l3.2-3.2M3 13h10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    ext: '<svg class="ico" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3h7v7M13 3 5 11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    play: '<svg class="ico" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.2v9.6L13 8z" fill="currentColor"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    theme: '<svg class="sunmoon" viewBox="0 0 24 24" aria-hidden="true"><defs><mask id="smMask"><rect width="24" height="24" fill="#fff"/><circle class="sm-cut" cx="12" cy="12" r="7.4" fill="#000"/></mask></defs><circle class="sm-body" cx="12" cy="12" r="8.2" mask="url(#smMask)" fill="currentColor"/><g class="sm-rays" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><line x1="12" y1="2.6" x2="12" y2="4.9" transform="rotate(0 12 12)"/><line x1="12" y1="2.6" x2="12" y2="4.9" transform="rotate(45 12 12)"/><line x1="12" y1="2.6" x2="12" y2="4.9" transform="rotate(90 12 12)"/><line x1="12" y1="2.6" x2="12" y2="4.9" transform="rotate(135 12 12)"/><line x1="12" y1="2.6" x2="12" y2="4.9" transform="rotate(180 12 12)"/><line x1="12" y1="2.6" x2="12" y2="4.9" transform="rotate(225 12 12)"/><line x1="12" y1="2.6" x2="12" y2="4.9" transform="rotate(270 12 12)"/><line x1="12" y1="2.6" x2="12" y2="4.9" transform="rotate(315 12 12)"/></g><g class="sm-stars" fill="currentColor"><circle cx="18.6" cy="5.4" r="1"/><circle cx="20.6" cy="10.2" r=".65"/><circle cx="15.2" cy="3.6" r=".55"/></g></svg>',
    logo: '<svg viewBox="0 0 48 48" aria-hidden="true"><defs><radialGradient id="bhBg" cx="50%" cy="55%" r="70%"><stop offset="0" stop-color="#111a38"/><stop offset="1" stop-color="#04060c"/></radialGradient><radialGradient id="bhGlow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ff9a55" stop-opacity=".5"/><stop offset="1" stop-color="#ff9a55" stop-opacity="0"/></radialGradient><linearGradient id="bhArc" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#f2915a" stop-opacity="0"/><stop offset=".2" stop-color="#f2915a"/><stop offset=".5" stop-color="#fff0cf"/><stop offset=".8" stop-color="#f2915a"/><stop offset="1" stop-color="#f2915a" stop-opacity="0"/></linearGradient><linearGradient id="bhDisk" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#e8703a" stop-opacity="0"/><stop offset=".18" stop-color="#f2915a"/><stop offset=".42" stop-color="#ffd9a0"/><stop offset=".5" stop-color="#fffaf0"/><stop offset=".62" stop-color="#ffd9a0"/><stop offset=".85" stop-color="#f2915a"/><stop offset="1" stop-color="#e8703a" stop-opacity="0"/></linearGradient></defs><rect width="48" height="48" rx="11" fill="url(#bhBg)"/><g fill="#fff"><circle cx="8" cy="9" r=".7" opacity=".7"/><circle cx="40.5" cy="8" r=".55" opacity=".55"/><circle cx="38" cy="41" r=".6" opacity=".6"/><circle cx="9.5" cy="40" r=".5" opacity=".45"/></g><circle cx="24" cy="26.5" r="18" fill="url(#bhGlow)"/><path d="M12 27a12 12 0 0 1 24 0" fill="none" stroke="url(#bhArc)" stroke-width="3.4" stroke-linecap="round"/><path d="M12.5 29a11.5 11.5 0 0 0 23 0" fill="none" stroke="url(#bhArc)" stroke-width="2" stroke-linecap="round" opacity=".42"/><circle cx="24" cy="26" r="8.6" fill="#03050a"/><circle cx="24" cy="26" r="8.6" fill="none" stroke="#ffe2b8" stroke-width=".9" opacity=".95"/><ellipse class="bh-disk" cx="24" cy="27.3" rx="21.5" ry="2.3" fill="url(#bhDisk)"/></svg>',
    lensing: '<svg viewBox="0 0 48 48" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 13c12 0 19 4 19 11"/><path d="M5 35c12 0 19-4 19-11"/><path d="M43 13c-12 0-19 4-19 11"/><path d="M43 35c-12 0-19-4-19-11"/></g><circle cx="24" cy="24" r="4" fill="currentColor"/></svg>',
    shadow: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="9" fill="currentColor"/><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 28a15 15 0 0 1 4-14"/><path d="M38 20a15 15 0 0 1-4 14"/><path d="M17 38a15 15 0 0 0 14 4"/></g></svg>',
    motion: '<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="24" cy="24" rx="19" ry="8" transform="rotate(-24 24 24)" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="24" cy="24" r="3.5" fill="currentColor"/><circle cx="39" cy="14.5" r="3" fill="currentColor"/></svg>',
    spinning: '<svg viewBox="0 0 48 48" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="24" cy="21" rx="15" ry="5"/><path d="M9 21 24 43 39 21"/><path d="M24 4v12"/></g></svg>',
    perturbations: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M3 24c3-17 6-17 9 0s5 14 8 0 4-9 6 0 3 6 5 0 2-3 4 0 2 2 4 0 2-1 4 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  };

  /* ---------- chrome ---------- */
  function renderChrome() {
    var langBtns = LANGS.map(function (l) {
      return '<button type="button" data-lang="' + l.code + '" aria-pressed="' + (I.lang === l.code) + '" lang="' + l.code + '" title="' + esc(l.code === 'uz' ? I.uzConvert(l.name, I.alpha) : l.name) + '">' + FLAGS[l.code] + '<span class="lab">' + l.label + '</span></button>';
    }).join('');
    var nav = ROUTES.map(function (r) {
      var lock = SM && SM.needsLogin(r) ? '<svg class="nav__lock" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="9.5" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' : '';
      return '<a href="#' + r + '"' + (state.route === r ? ' aria-current="page"' : '') + '>' + esc(ui('nav.' + r)) + lock + '</a>';
    }).join('');
    $('#site-header').innerHTML =
      '<div class="bar wrap">' +
        '<a class="brand" href="#home"><span class="brand__logo">' + ICON.logo + '</span><span class="brand__text"><b>' + esc(ui('nav.brand')) + '</b><small>' + esc(ui('nav.sub')) + '</small></span></a>' +
        '<nav class="nav" id="nav" aria-label="' + esc(ui('menu')) + '">' + nav + '</nav>' +
        '<div class="tools">' +
          '<div class="seg" role="group" aria-label="' + esc(ui('langLabel')) + '">' + langBtns + '</div>' +
          '<button type="button" class="iconbtn" data-act="theme" aria-label="' + esc(ui('theme')) + '">' + ICON.theme + '</button>' +
          (SM ? SM.accountButton() : '') +
          '<button type="button" class="iconbtn menubtn" data-act="menu" aria-expanded="false" aria-controls="nav" aria-label="' + esc(ui('menu')) + '">' + ICON.menu + '</button>' +
        '</div>' +
      '</div>';

    var alphaBtn = '';
    if (I.lang === 'uz') {
      alphaBtn = '<button type="button" class="linkbtn" data-act="alpha">' + esc(ui(I.alpha === 'new' ? 'footer.toLegacy' : 'footer.toNew')) + '</button>';
    }
    $('#site-footer').innerHTML = band() +
      '<div class="wrap foot">' +
        '<div class="foot__brand"><span class="brand__logo">' + ICON.logo + '</span><b>' + esc(ui('nav.brand')) + '</b></div>' +
        '<p>' + esc(ui('footer.text', { date: fmtDate(CFG.lastUpdated) })) + '</p>' +
        (I.lang === 'uz' ? '<p class="foot__law">' + esc(ui('footer.law')) + ' ' + alphaBtn + '</p>' : '') +
      '</div>';
    $('#skipbtn').textContent = ui('skip');
  }

  function pageHead(key, introKey) {
    return '<header class="pagehead"><div class="wrap"><h1>' + esc(ui(key)) + '</h1>' +
      (introKey ? '<p class="lead">' + esc(ui(introKey)) + '</p>' : '') + '</div></header>';
  }

  /* ---------- pages ---------- */
  var pages = {};

  pages.home = function () {
    var first = D.COURSES[0].lectures[0];
    var news = D.NEWS.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    var cards = D.THEMES.map(function (th) {
      return '<a class="card theme" href="#research" data-scroll="theme-' + th.id + '">' +
        '<span class="theme__ico">' + ICON[th.id] + '</span>' +
        '<h3>' + esc(t(th.title)) + '</h3><p>' + esc(t(th.short)) + '</p>' +
        '<span class="more">' + esc(ui('home.more')) + ' →</span></a>';
    }).join('');
    var leaders = D.LEADERS.map(function (p) {
      return '<a class="mini" href="#people">' + portrait(p, '') +
        '<span><b>' + esc(t(p.name)) + '</b><small>' + esc(ui(p.role === 'lead' ? 'people.roleLead' : 'people.roleCo')) + '</small></span></a>';
    }).join('');
    var newsHtml = news.map(function (n) {
      return '<article class="news"><time>' + esc(n.when ? t(n.when) : fmtDate(n.date)) + '</time><h3>' + esc(t(n.title)) + '</h3><p>' + esc(t(n.text)) + '</p>' +
        (n.link ? ext(n.link, 'DOI', 'inline') : '') + '</article>';
    }).join('');
    return '' +
      '<section class="hero" aria-labelledby="h-title"><div class="wrap hero__grid">' +
        '<div class="hero__text">' +
          '<p class="eyebrow">' + esc(ui('hero.eyebrow')) + '</p>' +
          '<h1 id="h-title">' + esc(ui('hero.title')) + '</h1>' +
          '<p class="hero__lead">' + esc(ui('hero.lead')) + '</p>' +
          '<div class="cta"><a class="btn btn--hot" href="#start">' + esc(ui('hero.cta1')) + '</a><a class="btn btn--ghost" href="#people">' + esc(ui('hero.cta2')) + '</a></div>' +
        '</div>' +
        '<figure class="hero__fig">' +
          '<div class="bhwrap"><canvas id="bh" role="img" aria-label="' + esc(ui('hero.fig')) + '"></canvas><div class="bhfallback" aria-hidden="true"></div></div>' +
          '<label class="incl" for="bhAngle"><span>' + esc(ui('hero.incl')) + '</span><input id="bhAngle" type="range" min="5" max="88" value="78" step="1"><output id="bhOut" for="bhAngle">78°</output></label>' +
          '<figcaption>' + esc(ui('hero.caption')) + '</figcaption>' +
        '</figure>' +
      '</div></section>' +

      band() +
      '<section class="wrap"><div class="stats" aria-label=""' + esc(ui('nav.brand')) + '">' +
        '<div><b>50+</b><span>' + esc(ui('stats.members')) + '</span></div>' +
        '<div><b>' + D.THEMES.length + '</b><span>' + esc(ui('stats.themes')) + '</span></div>' +
        '<div><b>' + lectureCount() + '</b><span>' + esc(ui('stats.lectures')) + '</span></div>' +
        '<div><b>' + D.BOOKS.length + '</b><span>' + esc(ui('stats.books')) + '</span></div>' +
      '</div></section>' +

      '<section class="wrap section"><div class="sechead"><h2>' + esc(ui('home.themes')) + '</h2><p>' + esc(ui('home.themesSub')) + '</p></div>' +
        '<div class="grid5">' + cards + '</div></section>' +

      '<section class="wrap section split">' +
        '<div class="panel"><h2>' + esc(ui('home.startTitle')) + '</h2><p>' + esc(ui('home.startText')) + '</p>' +
          '<p><a class="btn" href="#start">' + esc(ui('home.startCta')) + '</a></p>' +
          '<h3 class="sub">' + esc(ui('home.leaders')) + '</h3><div class="minis">' + leaders + '</div></div>' +
        '<div class="newscol"><h2>' + esc(ui('home.news')) + '</h2>' + newsHtml + '</div>' +
      '</section>' +

      '<section class="wrap section"><div class="feature">' +
        '<div class="feature__text"><h2>' + esc(ui('home.lectTitle')) + '</h2><p>' + esc(ui('home.lectText')) + '</p>' +
          '<p class="meta">' + esc(ui('lect.lang')) + ' · ' + lectureCount() + ' · ' + esc(ui('lect.mech')) + ', ' + esc(ui('lect.em')) + ', Wolfram Mathematica</p>' +
          '<p><a class="btn" href="#lectures">' + esc(ui('home.lectCta')) + '</a></p></div>' +
        '<a class="feature__play' + (CFG.embedVideos !== false ? ' feature__play--cover' : '') + '" href="#lectures" aria-label="' + esc(t(first.title)) + '">' +
          (CFG.embedVideos !== false ? '<img class="feature__img" data-yt="' + esc(first.id) + '" src="https://i.ytimg.com/vi/' + esc(first.id) + '/maxresdefault.jpg" alt="" loading="lazy">' : '') +
          '<span class="playglyph">' + ICON.play + '</span>' +
          '<span class="feature__cap"><small>' + esc(ui('lect.mech')) + ' · ' + esc(first.n) + '</small><b>' + esc(t(first.title)) + '</b><small>' + esc(fmtDur(first.min)) + '</small></span></a>' +
      '</div></section>';
  };

  function paperCount(m) {
    if (!m.key) return 0;
    return D.PUBLICATIONS.filter(function (p) { return p.authors && p.authors.indexOf(m.key) >= 0; }).length;
  }

  function memberCard(m) {
    var name = m.placeholder ? ui('people.phName') : t(m.name);
    var links = (m.links || []).map(function (l) { return ext(l.url, esc(l.label), 'inline'); }).join(' ');
    var n = m.placeholder ? 0 : paperCount(m);
    if (n) links = '<a class="inline" href="#publications" data-pub-q="' + esc(m.key) + '">' + esc(ui(n === 1 ? 'people.paper1' : 'people.papers', { n: n })) + '</a> ' + (links ? '<span class="sep" aria-hidden="true">·</span> ' + links : '');
    return '<article class="member' + (m.placeholder ? ' is-template' : '') + '">' +
      (m.photo ? '<img class="avatar sm" src="' + esc(m.photo) + '" alt="">' : '<span class="avatar sm" aria-hidden="true">' + esc(m.placeholder ? '··' : initials(name)) + '</span>') +
      '<div><p class="badge">' + esc(ui('role.' + m.level)) + (m.year ? ' · ' + esc(m.year) : '') + '</p>' +
      '<h3>' + esc(name) + '</h3>' + (links ? '<p class="links">' + links + '</p>' : '') + '</div></article>';
  }

  function memberGrid() {
    var list = D.MEMBERS.filter(function (m) {
      return state.pplLevel === 'all' || m.level === state.pplLevel;
    });
    return list.length ? '<div class="members">' + list.map(memberCard).join('') + '</div>' : '<p class="empty">' + esc(ui('people.noMatch')) + '</p>';
  }

  function chip(attr, value, label, pressed) {
    return '<button type="button" class="chip" ' + attr + '="' + esc(value) + '" aria-pressed="' + pressed + '">' + esc(label) + '</button>';
  }

  pages.people = function () {
    var leaders = D.LEADERS.map(function (p) {
      var name = t(p.name);
      var affil = p.affil.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('');
      var links = p.links.map(function (l) { return '<li>' + ext(l.url, esc(l.label)) + '</li>'; }).join('');
      return '<article class="leader">' +
        portrait(p, 'lg') +
        '<div class="leader__body"><p class="badge">' + esc(ui(p.role === 'lead' ? 'people.roleLead' : 'people.roleCo')) + '</p>' +
        '<h3>' + esc(name) + '</h3>' + (p.alt ? '<p class="alt">' + esc(ui('people.alt')) + ': ' + esc(p.alt) + '</p>' : '') +
        '<h4>' + esc(ui('people.interests')) + '</h4><p>' + esc(t(p.interests)) + '</p>' +
        '<h4>' + esc(ui('people.affil')) + '</h4><ul class="plain">' + affil + '</ul><p class="note">' + esc(ui('people.affilNote')) + '</p>' +
        '<ul class="linklist">' + links + '</ul></div></article>';
    }).join('');
    var hasTpl = D.MEMBERS.some(function (m) { return m.placeholder; });
    var levels = ['postdoc', 'doc', 'phd', 'msc', 'bsc'].filter(function (k) { return D.MEMBERS.some(function (m) { return m.level === k; }); });
    var lvl = levels.length ? [['all', ui('people.all')]].concat(levels.map(function (k) { return [k, ui('lvl.' + k)]; })).map(function (x) {
      return chip('data-ppl-level', x[0], x[1], state.pplLevel === x[0]);
    }).join('') : '';
    if (!levels.length) state.pplLevel = 'all';
    return pageHead('people.title', 'people.intro') +
      '<section class="wrap section"><h2>' + esc(ui('people.leaders')) + '</h2><div class="leaders">' + leaders + '</div></section>' +
      '<section class="wrap section"><div class="sechead"><h2>' + esc(ui('people.members')) + '</h2><p>' + esc(ui('people.total')) + '</p></div>' +
        (hasTpl ? '<p class="notice">' + esc(ui('people.template')) + '</p>' : '') +
        '<div class="filters">' + (lvl ? '<div class="filter"><span class="filter__label">' + esc(ui('people.level')) + '</span><div class="chips" id="pplLevel">' + lvl + '</div></div>' : '') +
        '</div>' +
        '<div id="memberGrid">' + memberGrid() + '</div>' +
        (hasTpl ? '' : '<p class="note">' + esc(ui('people.profileNote')) + '</p>') + '</section>' +
      '<section class="wrap section"><div class="cta-band"><div><h2>' + esc(ui('people.joinTitle')) + '</h2><p>' + esc(ui('people.joinText')) + '</p></div>' +
        '<a class="btn btn--hot" href="#join">' + esc(ui('people.joinCta')) + '</a></div></section>';
  };

  pages.research = function () {
    var secs = D.THEMES.map(function (th) {
      var reads = D.CLASSICS.filter(function (c) { return c.theme === th.id; }).slice(0, 3).map(function (c) {
        return '<li>' + esc(c.authors) + ', <i>' + esc(c.title) + '</i>, ' + esc(c.venue) + '</li>';
      }).join('');
      var kws = t(th.kw).split(';').map(function (k) { return '<li class="tag">' + esc(k.trim()) + '</li>'; }).join('');
      var n = countPapers(th.id);
      return '<section class="wrap theme-sec" id="theme-' + th.id + '"><div class="theme-sec__grid">' +
        '<div class="theme-sec__main"><span class="theme__ico">' + ICON[th.id] + '</span><h2>' + esc(t(th.title)) + '</h2>' +
        th.body.map(function (b) { return '<p>' + esc(t(b)) + '</p>'; }).join('') +
        '<h3 class="sub">' + esc(ui('research.kw')) + '</h3><ul class="tags">' + kws + '</ul></div>' +
        '<aside class="theme-sec__side"><div class="eqbox"><h3 class="sub">' + esc(ui('research.eq')) + '</h3>' +
          th.eq.map(function (e) { return '<div class="eq">' + e + '</div>'; }).join('') + '<p class="eqnote">' + esc(t(th.eqNote)) + '</p></div>' +
        '<h3 class="sub">' + esc(ui('research.read')) + '</h3><ul class="reads">' + reads + '</ul>' +
        '<a class="btn" href="#publications" data-pub-theme="' + th.id + '">' + esc(ui('research.papers')) + ' (' + n + ')</a></aside></div></section>';
    }).join('');
    return pageHead('research.title', 'research.intro') + secs +
      '<section class="wrap section"><div class="cta-band"><div><h2>' + esc(ui('research.beyondTitle')) + '</h2><p>' + esc(ui('research.beyondText')) + '</p></div></div></section>';
  };

  function pubItem(p) {
    var by = p.authors ? esc(p.authors) : esc(ui('pubs.coauth', { name: p.co.join(', ') }));
    var venue = [p.venue, p.year].filter(Boolean).join(', ');
    var links = '';
    if (p.doi) links += ext('https://doi.org/' + p.doi, 'DOI', 'pill');
    if (p.arxiv) links += ext('https://arxiv.org/abs/' + p.arxiv, 'arXiv', 'pill');
    if (p.url) links += ext(p.url, esc(ui('pubs.page')), 'pill');
    var tags = p.themes.map(function (id) { var th = themeById(id); return th ? '<span class="tag">' + esc(t(th.title)) + '</span>' : ''; }).join('');
    return '<li class="pub"><div class="pub__main"><h3 class="pub__title">' + esc(p.title) + '</h3><p class="pub__by">' + by + '</p>' +
      '<p class="pub__venue">' + (p.preprint ? '<span class="tag tag--solid">' + esc(ui('pubs.preprint')) + '</span> ' : '') + esc(venue) + '</p></div>' +
      '<div class="pub__side">' + links + (tags ? '<span class="pub__tags">' + tags + '</span>' : '') + '</div></li>';
  }

  function pubList() {
    var q = state.pubQ.trim().toLowerCase();
    var list = D.PUBLICATIONS.filter(function (p) {
      if (state.pubTheme !== 'all' && p.themes.indexOf(state.pubTheme) < 0) return false;
      if (!q) return true;
      var hay = (p.title + ' ' + (p.authors || '') + ' ' + (p.co || []).join(' ') + ' ' + p.venue + ' ' + (p.year || '')).toLowerCase();
      return hay.indexOf(q) >= 0;
    });
    var count = '<p class="count" aria-live="polite">' + esc(ui('pubs.shown', { a: list.length, b: D.PUBLICATIONS.length })) + '</p>';
    if (!list.length) return count + '<p class="empty">' + esc(ui('pubs.none')) + '</p>';
    var groups = {}, order = [];
    list.forEach(function (p) {
      var k = p.year == null ? 'pre' : String(p.year);
      if (!groups[k]) { groups[k] = []; order.push(k); }
      groups[k].push(p);
    });
    order.sort(function (a, b) { if (a === 'pre') return 1; if (b === 'pre') return -1; return +b - +a; });
    return count + order.map(function (k) {
      return '<section class="yeargroup"><h2 class="yr">' + (k === 'pre' ? esc(ui('pubs.preprint')) + ' · arXiv' : k) + '</h2><ul class="pubs">' + groups[k].map(pubItem).join('') + '</ul></section>';
    }).join('');
  }

  pages.publications = function () {
    var chips = [chip('data-pub-theme', 'all', ui('pubs.all'), state.pubTheme === 'all')].concat(D.THEMES.map(function (th) {
      return chip('data-pub-theme', th.id, t(th.title), state.pubTheme === th.id);
    })).join('');
    var prof = D.LEADERS.map(function (p) {
      return '<div class="prof"><b>' + esc(t(p.name)) + '</b><ul class="linklist">' +
        p.links.map(function (l) {
          var lab = l.label === 'ORCID' ? ui('pubs.orcid') : l.label === 'INSPIRE-HEP' ? ui('pubs.inspire') : l.url.indexOf('/citations?') >= 0 ? ui('pubs.scholarProfile') : ui('pubs.scholar');
          return '<li>' + ext(l.url, esc(lab)) + '</li>';
        }).join('') + '</ul></div>';
    }).join('');
    return pageHead('pubs.title', 'pubs.intro') +
      '<section class="wrap section"><div class="panel panel--row"><h2>' + esc(ui('pubs.profiles')) + '</h2><div class="profs">' + prof + '</div></div></section>' +
      '<section class="wrap section"><div class="filters"><div class="filter"><span class="filter__label">' + esc(ui('pubs.theme')) + '</span><div class="chips" id="pubThemes">' + chips + '</div></div>' +
        '<div class="filter filter--grow"><label class="sr" for="pubQ">' + esc(ui('pubs.search')) + '</label><input id="pubQ" class="search" type="search" placeholder="' + esc(ui('pubs.search')) + '" value="' + esc(state.pubQ) + '" autocomplete="off"></div></div>' +
        '<div id="pubList">' + pubList() + '</div></section>';
  };

  /* ---------- lectures: course lectures and members' playlists ---------- */
  /* The topics of a members' playlist, drawn exactly like the lectures of a course. */
  function plRows(items, curVid) {
    var embed = embedOn(), roman = items.length <= 20;
    return items.map(function (v, i) {
      var n = roman ? ROMAN[i] : String(i + 1);
      var title = v.t || (ui('m.pl.kindVideo') + ' ' + (i + 1));
      var min = v.s ? Math.max(1, Math.round(v.s / 60)) : 0;
      var inner = '<span class="lec__n">' + esc(n) + '</span><span class="lec__t"><b>' + esc(title) + '</b></span><span class="lec__d">' + esc(min ? fmtDur(min) : '') + '</span>';
      if (embed) {
        return '<li><button type="button" class="lec" data-play="' + esc(v.id) + '" data-key="v:' + esc(v.id) + '" data-min="' + min + '"' + (min ? '' : ' data-learn="1"') + (curVid === v.id ? ' aria-current="true"' : '') + '>' + inner + '<span class="lec__bar" aria-hidden="true"></span></button></li>';
      }
      return '<li><a class="lec" data-last="v:' + esc(v.id) + '" href="' + esc(ytWatch(v.id)) + '" target="_blank" rel="noopener noreferrer">' + inner + '<span class="lec__go">' + ICON.ext + '</span></a></li>';
    }).join('');
  }
  function membersHtml() {
    return SM && SM.signedIn() ? SM.playlistsHtml(embedOn(), state.mlist, state.mlist ? '' : state.play, plRows) : '';
  }
  function currentLecture() {
    var all = allLectures();
    return all.filter(function (x) { return x.id === state.play; })[0] || plVideo(state.play) || all[0];
  }
  /* The item shown in the player: a course lecture ('lec') or a members' video/playlist ('mem'). */
  function curItem() {
    if (state.mlist && SM) {
      var m = SM.listById(state.mlist);
      if (m) {
        var single = String(m.pl).indexOf('v:') === 0;
        return { kind: 'mem', id: m.id, key: m.pl, title: m.title, sub: ui(single ? 'm.pl.kindVideo' : 'm.pl.kindList') + (m.by ? ' · ' + m.by : ''),
          video: single ? String(m.pl).slice(2) : null, list: single ? null : m.pl, isList: !single, watch: SM.ytUrl(m.pl) };
      }
      state.mlist = null;
    }
    var l = currentLecture();
    return { kind: 'lec', id: l.id, key: 'v:' + l.id, title: l.n + '. ' + t(l.title), sub: l.sub != null ? l.sub : fmtDur(l.min), video: l.id, list: null, isList: false, watch: ytWatch(l.id) };
  }
  function startSpec(it) {
    var r = PROG[it.key], fresh = !r || r.done;
    if (it.isList) return { list: it.list, index: fresh ? 0 : (r.i || 0), start: fresh ? 0 : Math.max(0, r.t - 3) };
    return { video: it.video, start: !fresh && r.t > 15 ? Math.max(0, r.t - 3) : 0 };
  }
  function playerMeta(it) {
    var r = PROG[it.key];
    var resumable = r && !r.done && (r.t > 15 || r.i > 0);
    var resume = resumable ? '<span class="player__resume">' + esc(ui('lect.resume', { t: (it.isList ? '#' + (r.i + 1) + ' · ' : '') + fmtClock(r.t) })) + '</span>' : '';
    return '<b>' + esc(it.title) + '</b>' + (it.sub ? '<span>' + esc(it.sub) + '</span>' : '') + resume +
      '<span class="player__err" id="playerErr" role="alert" hidden></span>' + ext(it.watch, esc(ui('lect.watch')), 'inline');
  }
  function playerPanel() {
    var it = curItem();
    if (embedOn()) {
      return '<div class="player"><div class="player__frame"><div id="ytHost"></div></div>' +
        '<div class="player__meta" id="playerMeta">' + playerMeta(it) + '</div></div>' +
        '<label class="auto"><input type="checkbox" id="autoNext"' + (autoNext ? ' checked' : '') + '> ' + esc(ui('lect.auto')) + '</label>';
    }
    return '<a class="player player--link" data-last="' + esc(it.key) + '" href="' + esc(it.watch) + '" target="_blank" rel="noopener noreferrer"><span class="player__frame player__frame--poster"><span class="playglyph">' + ICON.play + '</span></span>' +
      '<span class="player__meta"><b>' + esc(it.title) + '</b>' + (it.sub ? '<span>' + esc(it.sub) + '</span>' : '') + '<span class="inline">' + esc(ui('lect.watch')) + ICON.ext + '</span></span></a>';
  }

  /* ---------- lecture progress and playback ---------- */
  var SYNC = {};
  function saveLocal() { store('vp', JSON.stringify(PROG)); }
  function paintKey(key) {
    $$('.lec[data-key]').forEach(function (b) {
      if (b.getAttribute('data-key') !== key) return;
      var r = PROG[key], part = !!(r && !r.done && (r.t > 15 || r.i > 0));
      var total = r && r.d > 0 ? r.d : (+b.getAttribute('data-min') || 60) * 60;
      b.style.setProperty('--p', (!r ? 0 : r.done ? 100 : Math.min(99, Math.round(r.t / total * 100))) + '%');
      b.classList.toggle('lec--done', !!(r && r.done));
      b.classList.toggle('lec--part', part);
      if (b.hasAttribute('data-learn')) {
        var ld = b.querySelector('.lec__d');
        if (ld && !ld.textContent && r && r.d > 0) ld.textContent = fmtDur(Math.max(1, Math.round(r.d / 60)));
      }
      if (b.hasAttribute('data-mplay')) {
        var d = b.querySelector('.lec__d');
        if (d) d.textContent = part ? (b.getAttribute('data-list') === '1' ? '#' + (r.i + 1) + ' · ' : '') + fmtClock(r.t) : (r && r.done ? '✓' : '');
      }
    });
  }
  function paintAll() { $$('.lec[data-key]').forEach(function (b) { paintKey(b.getAttribute('data-key')); }); }
  function syncProg(key, rec, force) {
    if (!SM || !SM.signedIn()) return;
    var now = Date.now();
    if (!force && SYNC[key] && now - SYNC[key] < 25000) return;
    SYNC[key] = now;
    SM.saveProg(key, rec.i || 0, rec.t || 0, force === 'beacon');
  }
  function recordProgress(key, tm, du, ix, force) {
    if (!key) return;
    var prev = PROG[key], isList = !!(curItem().isList && curItem().key === key), rec;
    if (!isList && du > 120 && tm >= du - 25) rec = { t: 0, i: 0, d: Math.floor(du), done: true };
    else if (tm > 5 || (ix || 0) > 0) rec = { t: Math.floor(tm), i: ix || 0, d: du > 0 ? Math.floor(du) : (prev && prev.d) || 0, done: !!(prev && prev.done) };
    else return;
    PROG[key] = rec; saveLocal(); rememberLast(key); paintKey(key); syncProg(key, rec, force);
  }
  function flushNow(why) {
    lect.force = why || true;
    if (lect.ctl) lect.ctl.flush();
    lect.force = false;
  }
  function stopLectures() {
    flushNow();
    if (lect.ctl) { try { lect.ctl.destroy(); } catch (e) { /* ignore */ } }
    lect.ctl = null;
  }
  function onLectureEnd() {
    var it = curItem();
    if (it.isList) return; /* playlists move on by themselves */
    var du = lect.ctl ? lect.ctl.duration() : 0;
    PROG[it.key] = { t: 0, i: 0, d: Math.floor(du), done: true };
    saveLocal(); paintKey(it.key); syncProg(it.key, PROG[it.key], true);
    if (it.kind === 'lec' && autoNext) {
      var nx = nextLecture(it.id);
      if (nx) selectItem('lec', nx.id, true, true);
    }
  }
  function onPlayerError() {
    var el = $('#playerErr');
    if (!el) return;
    var msg = ui('lect.err');
    if (window.location.protocol === 'file:') msg += ' ' + ui('lect.fileHint');
    el.textContent = msg; el.hidden = false;
  }
  /* ---------- remember what was watched last, so a returning visitor lands on it ---------- */
  function rememberLast(key) { if (key) store('last', key); }
  function isFinished(key) {
    var r = PROG[key];
    return !!(r && (r.done || (!r.t && !r.i)));
  }
  /* Point the lectures page at the item with this progress key. False when it cannot be resolved (yet). */
  function applyLast(key) {
    if (!key) return false;
    if (key.indexOf('v:') === 0 && lectureById(key.slice(2))) {
      var l = lectureById(key.slice(2));
      if (isFinished(key) && autoNext && nextLecture(l.id)) l = nextLecture(l.id);
      state.mlist = null; state.play = l.id; return true;
    }
    var m = SM && SM.signedIn() ? SM.listByPl(key) : null;
    if (m) { state.mlist = m.id; return true; }
    return false;
  }
  function selectItem(kind, id, autoplay, scroll) {
    flushNow();
    state.picked = true;
    if (kind === 'mem') state.mlist = id; else { state.mlist = null; state.play = id; }
    var it = curItem();
    lect.key = it.key;
    rememberLast(it.key);
    $$('.lec[data-play], .lec[data-mplay]').forEach(function (c) {
      var mem = c.hasAttribute('data-mplay'), cid = c.getAttribute(mem ? 'data-mplay' : 'data-play');
      if ((mem ? 'mem' : 'lec') === kind && cid === id) c.setAttribute('aria-current', 'true'); else c.removeAttribute('aria-current');
    });
    var meta = $('#playerMeta');
    if (lect.ctl && meta) {
      meta.innerHTML = playerMeta(it);
      lect.ctl.load(startSpec(it), autoplay);
      if (scroll || window.matchMedia('(max-width: 980px)').matches) {
        var pn = $('#playerPanel');
        if (pn && pn.scrollIntoView) { try { pn.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { pn.scrollIntoView(); } }
      }
    } else {
      $('#playerPanel').innerHTML = playerPanel();
    }
  }
  function afterLectures() {
    if (SM && SM.signedIn()) SM.ensureData();
    var SPl = window.SitePlayer;
    if (CFG.embedVideos === false || !SPl) return;
    if (!SPl.ok) {
      SPl.load().then(function (ok) { if (ok && state.route === 'lectures' && !lect.ctl) renderMain(false); });
      return;
    }
    if (!$('#ytHost')) return;
    var it = curItem();
    lect.key = it.key;
    lect.ctl = SPl.create('ytHost', startSpec(it), {
      onEnd: onLectureEnd,
      onProgress: function (tm, du, ix) { recordProgress(lect.key, tm, du, ix, lect.force); },
      onError: onPlayerError
    });
    paintAll();
  }

  pages.lectures = function () {
    var all = allLectures();
    if (!state.play) state.play = all[0].id;
    var embed = embedOn();
    var courses = D.COURSES.map(function (c) {
      var items = c.lectures.map(function (l) {
        var inner = '<span class="lec__n">' + esc(l.n) + '</span><span class="lec__t"><b>' + esc(t(l.title)) + '</b>' +
          (l.topics ? '<small>' + esc(t(l.topics)) + '</small>' : '') + '</span><span class="lec__d">' + esc(fmtDur(l.min)) + '</span>';
        if (embed) {
          return '<li><button type="button" class="lec" data-play="' + l.id + '" data-key="v:' + l.id + '" data-min="' + l.min + '"' + (!state.mlist && state.play === l.id ? ' aria-current="true"' : '') + '>' + inner + '<span class="lec__bar" aria-hidden="true"></span></button></li>';
        }
        return '<li><a class="lec" data-last="v:' + l.id + '" href="' + ytWatch(l.id) + '" target="_blank" rel="noopener noreferrer"' + (!state.mlist && state.play === l.id && store('last') ? ' aria-current="true"' : '') + '>' + inner + '<span class="lec__go">' + ICON.ext + '</span></a></li>';
      }).join('');
      return '<section class="course" id="course-' + c.id + '"><h2>' + esc(ui(c.title)) + '</h2><p>' + esc(ui(c.text)) + '</p><ol class="lecs">' + items + '</ol></section>';
    }).join('');
    var members = membersHtml();
    var notes = D.BOOKS.filter(function (b) { return b.free && (b.pdf || b.url) && b.cat !== 'bh'; });
    var notesHtml = notes.map(function (b) {
      return '<li>' + ext(b.pdf || b.url, esc(b.title)) + '<small>' + esc(b.authors) + (b.pdf ? ' · PDF' : '') + '</small></li>';
    }).join('');
    return pageHead('lect.title', 'lect.intro') +
      '<section class="wrap section lect' + (embed ? ' lect--embed' : '') + '"><div class="lect__main">' +
        '<p class="meta">' + ext(CFG.youtubeChannel, esc(ui('lect.channel')), 'inline') + ' · ' + esc(ui('lect.lang')) + '</p>' + courses + members +
        '<section class="course"><h2>' + esc(ui('lect.notes')) + '</h2><p>' + esc(ui('lect.notesText')) + '</p><ul class="notes">' + notesHtml + '</ul></section>' +
      '</div><aside class="lect__side" id="playerPanel">' + playerPanel() + '</aside></section>';
  };

  var COVER_CLASS = { vt: 'vt', gr: 'gr', mech: 'mech', em: 'em', qm: 'qm', bh: 'bh', math: 'math' };
  function shortTitle(title) { return String(title).replace(/\s*[:(].*$/, '').trim(); }
  function shortAuthors(authors) {
    var names = String(authors).split(/,\s*/).map(function (n) { return n.trim().split(/\s+/).pop(); });
    return names.length > 3 ? names[0] + ' et al.' : names.join(', ');
  }
  function coverHtml(b, big) {
    var src = b.cover || (b.isbn ? 'https://covers.openlibrary.org/b/isbn/' + b.isbn + '-M.jpg?default=false' : '');
    var img = src ? '<img class="cover__img" data-cover loading="lazy" decoding="async" referrerpolicy="no-referrer" alt="" src="' + esc(src) + '">' : '';
    return '<span class="cover cover--' + (COVER_CLASS[b.cat] || 'gr') + (big ? ' cover--lg' : '') + '" aria-hidden="true"><span class="cover__tile"><b>' + esc(shortTitle(b.title)) + '</b>' +
      '<small>' + esc(shortAuthors(b.authors)) + '</small>' + (b.free && !b.isbn && !b.cover ? '<i>' + esc(ui(b.level === 'review' ? 'books.cover.review' : 'books.cover.notes')) + '</i>' : '') + '</span>' + img + '</span>';
  }
  function bookItem(b) {
    var by = esc(b.authors) + (b.year ? ', ' + b.year : '') + (b.publisher ? ' · ' + esc(b.publisher) : '');
    var badges = '<span class="lvl lvl--' + b.level + '">' + esc(ui('books.lvl.' + b.level)) + '</span>' + (b.free ? '<span class="lvl lvl--free">' + esc(ui('books.free')) + '</span>' : '');
    var link = b.pdf || b.url;
    var title = link ? ext(link, esc(b.title), 'booklink') : esc(b.title);
    return '<li class="book">' + coverHtml(b) + '<div class="book__body"><div class="book__main"><h3 class="book__title">' + title + '</h3><p class="book__by">' + by + '</p>' + (b.note ? '<p class="book__note">' + esc(t(b.note)) + '</p>' : '') + bookActions(b) + '</div>' +
      '<div class="book__badges">' + badges + '</div></div></li>';
  }
  /* A free PDF opens in one click. A copyrighted book cannot be hosted on a public site, so members are pointed to the group library. */
  function bookActions(b) {
    var out = '';
    if (b.pdf) out = '<a class="btn btn--sm btn--hot btn--pdf" href="' + esc(b.pdf) + '" target="_blank" rel="noopener noreferrer">' + ICON.pdf + esc(ui('books.pdf')) + '</a>';
    else if (b.free && b.url) out = '<a class="btn btn--sm btn--hot btn--pdf" href="' + esc(b.url) + '" target="_blank" rel="noopener noreferrer">' + ICON.pdf + esc(ui('books.page')) + '</a>';
    else {
      if (SM && SM.enabled) out += '<button type="button" class="btn btn--sm btn--ghost" data-find="' + esc(shortTitle(b.title)) + '">' + esc(ui('books.find')) + '</button>';
      out += ext(copyUrl(b), esc(ui('books.copy')), 'btn btn--sm btn--ghost');
    }
    return out ? '<p class="book__act">' + out + '</p>' : '';
  }
  /* Open Library lists legal copies, including borrowable scans. */
  function copyUrl(b) {
    return b.isbn ? 'https://openlibrary.org/isbn/' + b.isbn : 'https://openlibrary.org/search?q=' + encodeURIComponent(shortTitle(b.title) + ' ' + shortAuthors(b.authors));
  }
  function isFreeBook(b) { return !!(b.free && (b.pdf || b.url)); }

  /* ---- Books: a subject row, and under it Group resources and Internet resources ----
   * Group resources: files that members uploaded for the subject (members area).
   * Internet resources: free texts, textbooks to find a copy of, and links that members added. */
  function subjectKeys() {
    var k = D.BOOK_TABS.slice();
    if (SM && SM.enabled && SM.groupCount('other') > 0) k.push('other');
    return k;
  }
  function subjLabel(k) { return k === 'other' ? ui('m.lib.cat3') : ui('books.tab.' + k); }
  function booksSubjects() {
    return '<p class="books__lab" id="booksSubLab">' + esc(ui('books.subjects')) + '</p><div class="tabs subjects" role="tablist" aria-labelledby="booksSubLab" id="booksSubjects">' + subjectKeys().map(function (k) {
      return '<button type="button" role="tab" class="tab" data-book-tab="' + k + '" aria-selected="' + (state.booksTab === k) + '">' + esc(subjLabel(k)) + '</button>';
    }).join('') + '</div>';
  }
  function groupPane() {
    if (!(SM && SM.enabled)) return '<p class="books__legal">' + esc(ui('books.groupOff')) + '</p>';
    SM.setSubject(state.booksTab);
    return '<section class="shelf" id="groupFiles"><h3 class="shelf__h">' + esc(subjLabel(state.booksTab)) + '</h3><div id="groupLib">' + SM.libraryHtml() + '</div></section>';
  }
  function webPane() {
    var tab = state.booksTab;
    var free = D.BOOKS.filter(function (b) { return b.cat === tab && isFreeBook(b); });
    var paid = D.BOOKS.filter(function (b) { return b.cat === tab && !isFreeBook(b); });
    var featured = '', math = '';
    if (tab === 'gr') {
      var b = bookById('bambi');
      featured = '<article class="featured">' + coverHtml(b, true) + '<div class="featured__body"><p class="badge badge--hot">' + esc(ui('books.startHere')) + '</p><h3>' + ext(b.url, esc(b.title), 'booklink') + '</h3>' +
        '<p class="book__by">' + esc(b.authors) + ', ' + b.year + ' · ' + esc(b.publisher) + '</p><p>' + esc(t(b.note)) + '</p>' +
        '<p class="book__act">' + (SM && SM.enabled ? '<button type="button" class="btn btn--sm" data-find="' + esc(shortTitle(b.title)) + '">' + esc(ui('books.getBook')) + '</button>' : '') + ext(b.url, esc(ui('books.publisher')), 'btn btn--sm btn--ghost') + '</p>' +
        '<details><summary>' + esc(ui('books.chapters')) + ' (' + b.chapters.length + ')</summary><ol class="chapters">' + b.chapters.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ol></details></div></article>';
      paid = paid.filter(function (x) { return x.id !== 'bambi'; });
    }
    if (tab === 'math') {
      math = '<div class="callout"><div><h3>' + esc(ui('books.mathTitle')) + '</h3><p>' + esc(ui('books.mathText')) + '</p></div><a class="btn" href="#lectures" data-scroll="course-math">' + esc(ui('books.mathCta')) + '</a></div>';
    }
    var shelf = function (key, items) {
      return items.length ? '<section class="shelf"><h3 class="shelf__h">' + esc(ui(key)) + '</h3>' + (key === 'books.sec.copy' ? '<p class="books__legal">' + esc(ui('books.listNote')) + '</p>' : '') + '<ul class="books">' + items.map(bookItem).join('') + '</ul></section>' : '';
    };
    return '<p class="books__legal">' + esc(ui('books.webNote')) + '</p>' + (SM && SM.enabled ? SM.webHtml() : '') + featured + math + shelf('books.sec.free', free) + shelf('books.sec.copy', paid);
  }
  function booksPane() { return state.booksMode === 'web' ? webPane() : groupPane(); }
  function booksModes() {
    var tab = state.booksTab;
    var nWeb = D.BOOKS.filter(function (b) { return b.cat === tab; }).length + (SM && SM.enabled ? SM.webCount(tab) : 0);
    var nGroup = SM && SM.enabled ? SM.groupCount(tab) : null;
    return ['group', 'web'].map(function (m) {
      var n = m === 'web' ? nWeb : nGroup;
      return '<button type="button" class="bmode__b" data-book-mode="' + m + '" aria-pressed="' + (state.booksMode === m) + '">' + esc(ui('books.mode.' + m)) + (n === null ? '' : '<span>' + n + '</span>') + '</button>';
    }).join('');
  }
  function booksBody() {
    if (SM) SM.setSubject(state.booksTab);
    return '<div id="booksSubjectsBox">' + booksSubjects() + '</div><div class="bmode" role="group" aria-label="' + esc(ui('books.title')) + '" id="booksModes">' + booksModes() + '</div><div id="booksPane">' + booksPane() + '</div>';
  }

  /* Redraw the subject row, the two options and the pane after any change of subject, option or data. */
  function repaintBooks() {
    var box = $('#booksSubjectsBox'), modes = $('#booksModes'), pane = $('#booksPane');
    if (!box || !modes || !pane) return;
    if (SM) SM.setSubject(state.booksTab);
    box.innerHTML = booksSubjects(); modes.innerHTML = booksModes(); pane.innerHTML = booksPane();
  }

  pages.books = function () {
    return pageHead('books.title', 'books.intro') + '<section class="wrap section" id="booksBody">' + booksBody() + '</section>';
  };

  pages.start = function () {
    var steps = D.STEPS.map(function (s, i) {
      var books = s.books.map(function (id) { var b = bookById(id); return b ? '<li>' + (isFreeBook(b) ? ext(b.pdf || b.url, esc(b.title)) : esc(b.title)) + '<small>' + esc(b.authors) + '</small></li>' : ''; }).join('');
      var action = s.course ? '<a class="btn btn--sm" href="#lectures" data-scroll="course-' + s.course + '">' + esc(ui('start.watch')) + '</a>' : '';
      if (!action && s.booksTab) action = '<a class="btn btn--sm" href="#books" data-book-tab="' + s.booksTab + '" data-book-web="1">' + esc(ui('nav.books')) + '</a>';
      if (s.research) action = '<a class="btn btn--sm" href="#research">' + esc(ui('nav.research')) + '</a>';
      return '<li class="step"><span class="step__n" aria-hidden="true">' + (i + 1) + '</span><div class="step__body"><h3><span class="sr">' + esc(ui('start.step')) + ' ' + (i + 1) + '. </span>' + esc(t(s.title)) + '</h3><p>' + esc(t(s.text)) + '</p>' +
        '<h4>' + esc(ui('start.books')) + '</h4><ul class="plain plain--books">' + books + '</ul>' + (action ? '<p>' + action + '</p>' : '') + '</div></li>';
    }).join('');
    var classics = D.THEMES.map(function (th, idx) {
      var items = D.CLASSICS.filter(function (c) { return c.theme === th.id; }).map(function (c) {
        return '<li><span>' + esc(c.authors) + ', <i>' + esc(c.title) + '</i>, ' + esc(c.venue) + '</span>' + ext(scholarUrl(c), esc(ui('start.find')), 'pill') + '</li>';
      }).join('');
      return '<details class="acc"' + (idx === 0 ? ' open' : '') + '><summary>' + esc(t(th.title)) + '</summary><ul class="cites">' + items + '</ul></details>';
    }).join('');
    var tools = D.TOOLS.map(function (x) {
      return '<a class="card tool" href="' + esc(x.url) + '" target="_blank" rel="noopener noreferrer"><h3>' + esc(x.name) + ICON.ext + '</h3><p>' + esc(t(x.note)) + '</p></a>';
    }).join('');
    return pageHead('start.title', 'start.intro') +
      '<section class="wrap section"><ol class="steps">' + steps + '</ol></section>' +
      '<section class="wrap section"><div class="sechead"><h2>' + esc(ui('start.classics')) + '</h2><p>' + esc(ui('start.classicsText')) + '</p></div>' + classics + '</section>' +
      '<section class="wrap section"><div class="sechead"><h2>' + esc(ui('start.tools')) + '</h2><p>' + esc(ui('start.toolsText')) + '</p></div><div class="grid3">' + tools + '</div></section>';
  };

  pages.join = function () {
    var steps = [1, 2, 3].map(function (n) {
      return '<li class="step"><span class="step__n" aria-hidden="true">' + n + '</span><div class="step__body"><h3>' + esc(ui('join.s' + n + 't')) + '</h3><p>' + esc(ui('join.s' + n + 'd')) + '</p></div></li>';
    }).join('');
    var lead = D.LEADERS[0];
    return pageHead('join.title', 'join.intro') +
      '<section class="wrap section split split--even"><div><h2>' + esc(ui('join.how')) + '</h2><ol class="steps steps--compact">' + steps + '</ol>' +
        '<p><a class="btn" href="#start">' + esc(ui('nav.start')) + '</a></p></div>' +
      '<div class="panel"><h2>' + esc(ui('join.contact')) + '</h2><p class="badge">' + esc(ui('people.roleLead')) + '</p><h3 class="contactname">' + esc(t(lead.name)) + '</h3>' +
        '<p class="meta">' + esc(ui('join.email')) + '</p><p class="email"><a href="mailto:' + esc(CFG.email) + '">' + esc(CFG.email) + '</a> ' +
        '<button type="button" class="btn btn--sm" data-copy="' + esc(CFG.email) + '">' + esc(ui('join.copy')) + '</button></p>' +
        '<ul class="linklist">' + lead.links.map(function (l) { return '<li>' + ext(l.url, esc(l.label)) + '</li>'; }).join('') + '</ul></div></section>';
  };

  /* ---------- render ---------- */
  var PAGE_TITLE = { people: 'people.title', research: 'research.title', publications: 'pubs.title', lectures: 'lect.title', books: 'books.title', start: 'start.title', join: 'join.title' };
  function gatedPage(route) {
    return pageHead(PAGE_TITLE[route] || 'nav.' + route, null) + SM.lockHtml(route);
  }

  function renderMain(top) {
    if (window.SiteHero) window.SiteHero.stop();
    stopLectures();
    var main = $('#main');
    main.innerHTML = SM && SM.needsLogin(state.route) ? gatedPage(state.route) : pages[state.route]();
    var key = state.route === 'home' ? 'nav.brand' : 'nav.' + state.route;
    document.title = (state.route === 'home' ? '' : ui(key) + ' · ') + ui('nav.brand');
    if (state.route === 'home' && window.SiteHero) {
      window.SiteHero.mount($('#bh'), $('#bhAngle'), $('#bhOut'));
    }
    if (state.route === 'lectures' && !(SM && SM.needsLogin('lectures'))) afterLectures();
    if (state.route === 'books' && SM && SM.signedIn()) SM.ensureData();
    if (top) { window.scrollTo(0, 0); }
    flushScroll();
  }

  function flushScroll() {
    if (!state.scrollTo) return;
    var el = document.getElementById(state.scrollTo);
    state.scrollTo = null;
    if (el) { try { el.scrollIntoView({ behavior: 'auto', block: 'start' }); } catch (e) { el.scrollIntoView(); } }
  }

  function renderAll(top) {
    document.documentElement.lang = I.lang === 'uz' ? 'uz-Latn' : I.lang;
    renderChrome();
    renderMain(top);
  }

  function routeFromHash() {
    var h = (window.location.hash || '').replace(/^#/, '');
    return ROUTES.indexOf(h) >= 0 ? h : 'home';
  }

  /* ---------- events ---------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-lang],[data-act],[data-ppl-level],[data-pub-theme],[data-pub-q],[data-book-tab],[data-book-mode],[data-find],[data-play],[data-mplay],[data-copy],[data-scroll],#skipbtn,.nav a') : null;
    if (!el) return;

    if (el.hasAttribute('data-lang')) {
      I.lang = el.getAttribute('data-lang'); store('lang', I.lang); renderAll(false); return;
    }
    if (el.getAttribute('data-act') === 'theme') {
      var root = document.documentElement;
      var cur = root.getAttribute('data-theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var next = cur === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next); store('theme', next); return;
    }
    if (el.getAttribute('data-act') === 'menu') {
      var open = document.body.classList.toggle('navopen');
      el.setAttribute('aria-expanded', String(open)); return;
    }
    if (el.getAttribute('data-act') === 'alpha') {
      I.alpha = I.alpha === 'new' ? 'legacy' : 'new'; store('alpha', I.alpha); renderAll(false); return;
    }
    if (el.id === 'skipbtn') { var m = $('#main'); m.focus(); m.scrollIntoView(); return; }
    if (el.matches('.nav a')) { document.body.classList.remove('navopen'); var mb = $('.menubtn'); if (mb) mb.setAttribute('aria-expanded', 'false'); return; }

    if (el.hasAttribute('data-ppl-level')) {
      state.pplLevel = el.getAttribute('data-ppl-level');
      $$('#pplLevel .chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c === el)); });
      $('#memberGrid').innerHTML = memberGrid(); return;
    }
    if (el.hasAttribute('data-pub-q')) { state.pubQ = el.getAttribute('data-pub-q'); state.pubTheme = 'all'; return; /* follow the href */ }
    if (el.hasAttribute('data-pub-theme')) {
      state.pubTheme = el.getAttribute('data-pub-theme');
      if (el.classList.contains('chip')) {
        $$('#pubThemes .chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c === el)); });
        $('#pubList').innerHTML = pubList(); return;
      }
      state.pubQ = ''; return; /* link from the research page: follow the href */
    }
    if (el.hasAttribute('data-book-tab')) {
      state.booksTab = el.getAttribute('data-book-tab');
      if (el.hasAttribute('data-book-web')) state.booksMode = 'web'; /* the start page links to the free books of the subject */
      if (SM && SM.setSearch) SM.setSearch('');
      repaintBooks(); return;
    }
    if (el.hasAttribute('data-book-mode')) {
      state.booksMode = el.getAttribute('data-book-mode');
      repaintBooks(); return;
    }
    if (el.hasAttribute('data-find')) {
      if (SM && SM.setSearch) SM.setSearch(el.getAttribute('data-find'));
      state.booksMode = 'group';
      repaintBooks();
      var gf = $('#groupFiles'); if (gf && gf.scrollIntoView) gf.scrollIntoView({ block: 'start' });
      return;
    }
    if (el.hasAttribute('data-play')) { selectItem('lec', el.getAttribute('data-play'), true, false); return; }
    if (el.hasAttribute('data-mplay')) { selectItem('mem', el.getAttribute('data-mplay'), true, false); return; }
    if (el.hasAttribute('data-copy')) {
      var text = el.getAttribute('data-copy'), btn = el;
      var done = function () { var old = btn.textContent; btn.textContent = ui('join.copied'); setTimeout(function () { btn.textContent = old; }, 1600); };
      try { navigator.clipboard.writeText(text).then(done, function () { /* clipboard refused */ }); } catch (err) { /* clipboard unavailable */ }
      return;
    }
    if (el.hasAttribute('data-scroll')) {
      state.scrollTo = el.getAttribute('data-scroll');
      var target = (el.getAttribute('href') || '').replace(/^#/, '');
      if (target === state.route) { e.preventDefault(); flushScroll(); }
    }
  });

  document.addEventListener('input', function (e) {
    if (e.target && e.target.id === 'pubQ') { state.pubQ = e.target.value; $('#pubList').innerHTML = pubList(); }
  });

  document.addEventListener('change', function (e) {
    if (e.target && e.target.id === 'autoNext') { autoNext = !!e.target.checked; store('autonext', autoNext ? '1' : '0'); }
  });
  document.addEventListener('visibilitychange', function () { if (document.hidden && lect.ctl) flushNow('beacon'); });
  window.addEventListener('pagehide', function () { if (lect.ctl) flushNow('beacon'); });
  /* a portrait that fails to load falls back to the initials badge */
  function ytFallback(img) { /* cover chain: maxresdefault -> hqdefault -> nothing (the dark poster stays) */
    var id = img.getAttribute('data-yt');
    if (img.getAttribute('data-step') !== 'hq') { img.setAttribute('data-step', 'hq'); img.src = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg'; }
    else if (img.parentNode) { img.parentNode.classList.remove('feature__play--cover'); img.parentNode.removeChild(img); }
  }
  document.addEventListener('load', function (e) {
    var img = e.target;
    if (img && img.tagName === 'IMG' && img.hasAttribute('data-yt') && img.naturalWidth <= 120) { ytFallback(img); return; } /* a cover service answers with a 1-pixel image when it has no cover: show the tile instead */
    if (img && img.tagName === 'IMG' && img.hasAttribute('data-cover') && img.naturalWidth < 40 && img.parentNode) img.parentNode.removeChild(img);
  }, true);
  document.addEventListener('error', function (e) {
    var img = e.target;
    if (img && img.tagName === 'IMG' && img.hasAttribute('data-yt')) { ytFallback(img); return; }
    if (img && img.tagName === 'IMG' && img.hasAttribute('data-cover')) { if (img.parentNode) img.parentNode.removeChild(img); return; }
    if (!img || img.tagName !== 'IMG' || !img.hasAttribute('data-initials')) return;
    var sp = document.createElement('span');
    sp.className = img.className; sp.setAttribute('aria-hidden', 'true');
    sp.textContent = img.getAttribute('data-initials');
    if (img.parentNode) img.parentNode.replaceChild(sp, img);
  }, true);

  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[data-last]') : null;
    if (a) { rememberLast(a.getAttribute('data-last')); }
  }, true);

  window.addEventListener('hashchange', function () {
    state.route = routeFromHash();
    document.body.classList.remove('navopen');
    renderAll(!state.scrollTo);
  });

  /* ---------- start ---------- */
  function init() {
    var params = {};
    try { params = new URLSearchParams(window.location.search); } catch (e) { params = { get: function () { return null; } }; }
    var codes = LANGS.map(function (l) { return l.code; });
    var lang = params.get('lang') || store('lang');
    if (codes.indexOf(lang) < 0) {
      lang = CFG.defaultLang !== 'auto' ? CFG.defaultLang : null;
      if (!lang) {
        var nav = String(navigator.language || 'en').toLowerCase();
        lang = nav.indexOf('uz') === 0 ? 'uz' : nav.indexOf('ru') === 0 ? 'ru' : 'en';
      }
    }
    I.lang = lang;
    var alpha = params.get('alpha') || store('alpha') || CFG.uzAlphabet;
    I.alpha = alpha === 'legacy' ? 'legacy' : 'new';
    var theme = params.get('theme') || store('theme');
    if (theme === 'dark' || theme === 'light') document.documentElement.setAttribute('data-theme', theme);
    state.route = routeFromHash();
    var last = store('last');
    if (last && !applyLast(last)) state.wantKey = last;
    if (SM) {
      SM.out.onChange = function (why) {
        if (why === 'data' && state.restored) { state.restored = false; if (state.route === 'lectures') { renderAll(false); return; } }
        if (why === 'data') { /* refresh in place so a playing video is not interrupted */
          if (state.route === 'lectures' && lect.ctl) {
            var sec = $('#course-members');
            if (sec) { sec.outerHTML = membersHtml(); paintAll(); return; }
          }
          if (state.route === 'books' && $('#booksPane')) {
            var ae = document.activeElement;
            if (ae && ae.id === 'libQ' && $('#groupLib')) { $('#booksModes').innerHTML = booksModes(); $('#groupLib').innerHTML = SM.libraryHtml(); return; } /* keep the search box focused while typing */
            repaintBooks(); return;
          }
        }
        renderAll(false);
      };
      if (SY) SY.onUpdate = function () { /* a playlist finished loading its topics */
        if (state.route !== 'lectures') return;
        var started = lect.ctl && lect.ctl.time && lect.ctl.time() > 1;
        if (!state.picked && !started && state.wantKey && applyLast(state.wantKey)) { state.wantKey = null; renderAll(false); return; }
        var sec = $('#course-members');
        if (sec) { sec.outerHTML = membersHtml(); paintAll(); }
      };
      SM.out.onSubject = function (k) { state.booksTab = k; }; /* after adding a file or link, show the subject it went into */
      SM.out.onSignOut = function () { PROG = {}; SYNC = {}; store('vp', '{}'); store('last', ''); state.mlist = null; state.wantKey = null; state.picked = false; };
      SM.out.onData = function () { /* progress saved on the server wins over this browser's copy */
        if (SY && SM.lists) SM.lists().forEach(function (x) { if (String(x.pl).indexOf('v:') !== 0) SY.cached(x.pl); }); /* playlist topics from the browser's copy first, so "last watched" can resolve */
        var sp = SM.serverProg();
        Object.keys(sp).forEach(function (k) {
          var l = PROG[k];
          if (l && l.done) return;
          var fin = k.indexOf('v:') === 0 && !sp[k].t && !sp[k].i;
          PROG[k] = fin ? { t: 0, i: 0, d: (l && l.d) || 0, done: true } : { t: sp[k].t, i: sp[k].i, d: (l && l.d) || 0, done: false };
        });
        saveLocal();
        /* a returning visitor lands on what they watched last, unless they already chose or started something */
        var started = lect.ctl && lect.ctl.time && lect.ctl.time() > 1;
        if (!state.picked && !started) {
          var key = state.wantKey || (store('last') ? '' : SM.lastKey());
          if (key && applyLast(key)) { state.wantKey = null; state.restored = true; }
        }
      };
    }
    renderAll(false);
    if (SM && SM.signedIn() && (state.route === 'lectures' || state.route === 'books')) SM.ensureData();
  }

  init();
})();

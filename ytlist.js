/* The topics (videos) of a YouTube playlist, so that a playlist can be shown like a course.
 *
 * Two sources, tried in this order:
 *   1. YouTube Data API v3, when config.js has youtubeApiKey: gives every title AND its duration.
 *   2. The YouTube player + oEmbed, no key needed: gives the video ids (hidden player) and the titles
 *      (oEmbed). Durations are not available this way; a row shows its duration after the video was watched.
 * Results are kept in the browser (localStorage) so a playlist is read once, then refreshed once a day.
 *
 * API:  SiteYT.ensure(pl)   -> { state: 'loading' | 'ok' | 'err', items: [{ id, t, s }] }  (starts loading if needed)
 *       SiteYT.peek(pl)     -> the same, without starting anything (null if unknown)
 *       SiteYT.video(id)    -> { id, t, s, i, count, pl } for a video of any loaded playlist, or null
 *       SiteYT.next(id)     -> the next video in the same playlist, or null
 *       SiteYT.onUpdate     -> set a function; called after a playlist finished loading
 */
(function () {
  'use strict';

  var CFG = window.SITE_CONFIG || {};
  var KEY = String(CFG.youtubeApiKey || '');
  var DAY = 864e5;
  var R = {};      /* playlist id -> { state, items } */
  var BYID = {};   /* video id -> { pl, i } */
  var SY = { onUpdate: function () {}, hasKey: !!KEY };

  function lget(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function lset(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }

  function register(pl, items) {
    items.forEach(function (v, i) { if (!BYID[v.id] || BYID[v.id].pl === pl) BYID[v.id] = { pl: pl, i: i }; });
  }
  function isoSec(d) {
    var m = /^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(String(d || ''));
    return m ? (+m[1] || 0) * 86400 + (+m[2] || 0) * 3600 + (+m[3] || 0) * 60 + (+m[4] || 0) : 0;
  }

  /* ---- source 1: YouTube Data API ---- */
  function api(path, params) {
    var q = Object.keys(params).filter(function (k) { return params[k]; }).map(function (k) { return k + '=' + encodeURIComponent(params[k]); }).join('&');
    return fetch('https://www.googleapis.com/youtube/v3/' + path + '?' + q + '&key=' + encodeURIComponent(KEY))
      .then(function (r) { return r.json(); })
      .then(function (j) { if (j.error) throw new Error((j.error && j.error.message) || 'api'); return j; });
  }
  function viaApi(pl) {
    var items = [];
    function page(token) {
      return api('playlistItems', { part: 'snippet,contentDetails', maxResults: 50, playlistId: pl, pageToken: token }).then(function (j) {
        (j.items || []).forEach(function (it) {
          var id = it.contentDetails && it.contentDetails.videoId, t = it.snippet && it.snippet.title;
          if (id && t !== 'Private video' && t !== 'Deleted video') items.push({ id: id, t: t || '', s: 0 });
        });
        if (j.nextPageToken && items.length < 500) return page(j.nextPageToken);
      });
    }
    return page('').then(function () {
      var chunks = [], i, known = {};
      for (i = 0; i < items.length; i += 50) chunks.push(items.slice(i, i + 50));
      return Promise.all(chunks.map(function (ch) {
        return api('videos', { part: 'contentDetails', maxResults: 50, id: ch.map(function (x) { return x.id; }).join(',') }).then(function (j) {
          (j.items || []).forEach(function (v) { known[v.id] = isoSec(v.contentDetails && v.contentDetails.duration); });
        });
      })).then(function () {
        items = items.filter(function (x) { return known[x.id] !== undefined; }); /* videos that are no longer available drop out */
        items.forEach(function (x) { x.s = known[x.id] || 0; });
        return items;
      });
    });
  }

  /* ---- source 2: the player gives the ids, oEmbed gives the titles ---- */
  function oembedTitle(id) {
    return new Promise(function (resolve) {
      var done = false, to = setTimeout(function () { if (!done) { done = true; resolve(''); } }, 8000);
      try {
        fetch('https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + id))
          .then(function (r) { return r.json(); })
          .then(function (j) { if (!done) { done = true; clearTimeout(to); resolve(j.title || ''); } }, function () { if (!done) { done = true; clearTimeout(to); resolve(''); } });
      } catch (e) { clearTimeout(to); resolve(''); }
    });
  }
  function fillTitles(items) {
    var next = 0, workers = [], n = Math.min(6, items.length);
    function work() {
      if (next >= items.length) return Promise.resolve();
      var v = items[next++];
      return oembedTitle(v.id).then(function (t) { v.t = t; return work(); });
    }
    for (var i = 0; i < n; i++) workers.push(work());
    return Promise.all(workers);
  }
  function viaPlayer(pl) {
    var SP = window.SitePlayer;
    if (!SP || CFG.embedVideos === false) return Promise.reject(new Error('no player'));
    return SP.load().then(function (ok) {
      if (!ok) throw new Error('no player');
      return SP.playlistIds(pl);
    }).then(function (ids) {
      var items = ids.map(function (id) { return { id: id, t: '', s: 0 }; });
      return fillTitles(items).then(function () { return items; });
    });
  }

  function fetchItems(pl) {
    if (KEY) return viaApi(pl).then(null, function () { return viaPlayer(pl); }); /* bad key or quota: still try the player */
    return viaPlayer(pl);
  }

  function load(pl, quiet) {
    return fetchItems(pl).then(function (items) {
      if (!items.length) throw new Error('empty');
      R[pl] = { state: 'ok', items: items, at: Date.now(), k: KEY ? 1 : 0, checked: true };
      register(pl, items);
      if (items.some(function (v) { return v.t; })) lset('ytpl.' + pl, JSON.stringify({ at: Date.now(), k: KEY ? 1 : 0, items: items }));
      try { SY.onUpdate(pl); } catch (e) { if (window.console) console.error(e); }
    }, function () {
      if (quiet && R[pl] && R[pl].state === 'ok') return; /* a failed refresh keeps what is already shown */
      R[pl] = { state: 'err', items: [], checked: true };
      try { SY.onUpdate(pl); } catch (e) { if (window.console) console.error(e); }
    });
  }

  /* Reads the browser's saved copy only; never contacts YouTube. */
  function fromCache(pl) {
    if (R[pl]) return R[pl];
    var c = null;
    try { c = JSON.parse(lget('ytpl.' + pl) || 'null'); } catch (e) { c = null; }
    if (!(c && c.items && c.items.length)) return null;
    R[pl] = { state: 'ok', items: c.items, at: c.at || 0, k: c.k, checked: false };
    register(pl, c.items);
    return R[pl];
  }
  SY.cached = function (pl) { return fromCache(pl); };
  /* Saved copy if there is one (refreshed quietly when older than a day), otherwise load from YouTube. */
  SY.ensure = function (pl) {
    var r = fromCache(pl);
    if (r) {
      if (!r.checked) {
        r.checked = true;
        if (Date.now() - r.at > DAY || r.k !== (KEY ? 1 : 0)) load(pl, true);
      }
      return r;
    }
    R[pl] = { state: 'loading', items: [], checked: true };
    load(pl, false);
    return R[pl];
  };
  SY.peek = function (pl) { return R[pl] || null; };
  SY.video = function (id) {
    var h = BYID[id];
    if (!h || !R[h.pl]) return null;
    var it = R[h.pl].items[h.i];
    return it ? { id: it.id, t: it.t, s: it.s, i: h.i, count: R[h.pl].items.length, pl: h.pl } : null;
  };
  SY.next = function (id) {
    var h = BYID[id];
    if (!h || !R[h.pl]) return null;
    var it = R[h.pl].items[h.i + 1];
    return it ? SY.video(it.id) : null;
  };

  window.SiteYT = SY;
})();

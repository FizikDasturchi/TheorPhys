/* In-page YouTube player (YouTube IFrame API).
 *
 * The API script is requested only when the lectures page is opened. If it cannot load
 * (blocked by a content-security policy, offline, ad blocker) SitePlayer.ok stays false
 * and the lectures page shows plain "watch on YouTube" links instead, so nothing breaks.
 */
(function () {
  'use strict';

  var apiPromise = null;
  var SP = { ok: false };

  SP.load = function () {
    if (apiPromise) return apiPromise;
    apiPromise = new Promise(function (resolve) {
      if (window.YT && window.YT.Player) { SP.ok = true; resolve(true); return; }
      var settled = false, timer = null;
      function finish(ok) {
        if (ok) SP.ok = true;
        if (settled) return;
        settled = true; clearTimeout(timer); resolve(ok);
      }
      var prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = function () {
        try { if (typeof prev === 'function') prev(); } catch (e) { /* ignore */ }
        finish(true);
      };
      var s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      s.async = true;
      s.onerror = function () { finish(false); };
      document.head.appendChild(s);
      timer = setTimeout(function () { finish(false); }, 8000);
    });
    return apiPromise;
  };

  /* Creates a player inside the element with id hostId.
   * spec: { video: id, start } for one video, or { list: playlistId, index, start } for a playlist
   * opts: onEnd(), onProgress(seconds, duration, playlistIndex), onError(code)
   * Returns { load(spec, autoplay), flush(), time(), duration(), destroy() } */
  SP.create = function (hostId, spec, opts) {
    var player = null, timer = 0, ready = false, queued = null, isList = !!spec.list;
    opts = opts || {};

    function tick() {
      if (!player || !ready) return;
      try {
        var tm = player.getCurrentTime(), du = player.getDuration();
        var ix = isList && player.getPlaylistIndex ? player.getPlaylistIndex() : 0;
        if (tm >= 0 && opts.onProgress) opts.onProgress(tm, du, ix);
      } catch (e) { /* ignore */ }
    }
    function startTimer() { if (!timer) timer = setInterval(tick, 4000); }
    function stopTimer() { if (timer) { clearInterval(timer); timer = 0; } }

    var vars = { rel: 0, playsinline: 1, modestbranding: 1 };
    var cfg = { width: '100%', height: '100%', playerVars: vars };
    if (isList) { vars.listType = 'playlist'; vars.list = spec.list; }
    else { cfg.videoId = spec.video; vars.start = Math.max(0, Math.floor(spec.start || 0)); }
    cfg.events = {
      onReady: function () {
        ready = true;
        if (isList && (spec.index || spec.start)) api.load(spec, false);
        if (queued) { var q = queued; queued = null; api.load(q.spec, q.autoplay); }
      },
      onStateChange: function (e) {
        var YTS = window.YT.PlayerState;
        if (e.data === YTS.PLAYING) startTimer();
        else { stopTimer(); if (e.data === YTS.PAUSED) tick(); }
        if (e.data === YTS.ENDED) { tick(); if (opts.onEnd) opts.onEnd(); }
      },
      onError: function (e) { if (opts.onError) opts.onError(e.data); }
    };
    player = new window.YT.Player(hostId, cfg);

    var api = {
      load: function (sp, autoplay) {
        if (!ready) { queued = { spec: sp, autoplay: autoplay }; return; }
        try {
          if (sp.list) {
            var o = { listType: 'playlist', list: sp.list, index: sp.index || 0, startSeconds: Math.max(0, Math.floor(sp.start || 0)) };
            if (autoplay) player.loadPlaylist(o); else player.cuePlaylist(o);
            isList = true;
          } else {
            var v = { videoId: sp.video, startSeconds: Math.max(0, Math.floor(sp.start || 0)) };
            if (autoplay) player.loadVideoById(v); else player.cueVideoById(v);
            isList = false;
          }
        } catch (e) { /* ignore */ }
      },
      time: function () { try { return player.getCurrentTime(); } catch (e) { return 0; } },
      duration: function () { try { return player.getDuration(); } catch (e) { return 0; } },
      flush: tick,
      destroy: function () {
        tick(); stopTimer();
        try { player.destroy(); } catch (e) { /* ignore */ }
        player = null; ready = false;
      }
    };
    return api;
  };

  window.SitePlayer = SP;
})();

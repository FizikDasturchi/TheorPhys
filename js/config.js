/* Site settings. Edit this file first.
 *
 * embedVideos   'auto' -> lectures play inside the page whenever the browser can load the
 *                         YouTube player; otherwise they fall back to "Watch on YouTube" links
 *               false  -> always use links (never contact YouTube from this site)
 * ornament      true   -> show the Uzbek tile band (img/naqsh.png) under the home hero and above the footer
 * members       Sign-in and the members' library (backend: your Google Apps Script web app, see README)
 *               api      address of the deployed Apps Script web app ('' = accounts switched off, whole site public)
 *               demo     true  -> accounts are simulated inside the browser (for previews and tests only)
 *               invite   true  -> the sign-up form asks for a group access code and sends it as `code`;
 *                        your backend must check it (README shows the one-line change)
 *               protect  pages that need a signed-in account: any of 'people', 'research', 'publications',
 *                        'lectures', 'start', 'join'  (use [] to keep every page public).
 *                        The Books page is NOT listed here: it is hidden completely from everyone except
 *                        group members (role 'team') and admins, see README "Roles".
 * uzAlphabet    'new'    -> Ş Ç Ö Ğ  (alphabet law signed 21 Oct 2026, in force from 22 Apr 2027)
 *               'legacy' -> sh ch oʻ gʻ (1995 alphabet)
 *               Uzbek strings in the source files are written in the 1995 spelling and converted
 *               automatically, so you can type new text the way you normally do.
 * youtubeApiKey  '' -> a playlist added on the Lectures page is split into its topics by asking the YouTube
 *                        player for the video ids and oEmbed for the titles (no key, no durations)
 *               'AIza...' -> a YouTube Data API v3 key: the topics come with their durations too (README: "Playlists")
 * defaultLang   'auto' picks the browser language (uz / ru / en), or force 'uz', 'ru', 'en'.
 */
window.SITE_CONFIG = {
  embedVideos: 'auto',
  ornament: true,
  members: {
    api: 'https://script.google.com/macros/s/AKfycbyRxXY7MZahAD_lwPG0rXuuH4XYSKXz5U4ycC9HoGVOwaYkTjWVUzdJxyN6gPU3Pg/exec',
    demo: false,
    invite: false,
    protect: ['lectures']
  },
  uzAlphabet: 'new',
  defaultLang: 'auto',
  youtubeApiKey: '',
  email: 'ahmadjon@astrin.uz',
  youtubeChannel: 'https://www.youtube.com/@nazariyastrofizika',
  lastUpdated: '2026-11-15'
};

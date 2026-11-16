# Research Group Theoretical Physics: website

Plain HTML, CSS and JavaScript. No build step, no dependencies.

## Run it
First extract the whole zip (right-click, Extract All). Opening `index.html` from inside the zip shows an empty page, because the other files are not extracted with it.
Upload the whole folder to any web host. To test on your computer, use a local web server
(do NOT double-click index.html: YouTube refuses to play videos from a local file, and sign-in needs a web address):

    python3 -m http.server 8000     # then open http://localhost:8000

## Sign-in and members-only pages
The site has real accounts (first name + last name + password). It talks to the same Google Apps Script
backend as the AstroPhysics site, so accounts, shared books and playlists are the same on both sites. The newest `code.gs` (with the `ask` role and the `askJoin` action) must be deployed as a new version for the approval flow to work. If the other site shares this backend, check it still works after the update (it does not know the new `ask` role).
`js/config.js` already holds that backend's address (`members.api`).

Roles (the backend enforces them, the pages only follow):

| Role | Who | What they get |
|---|---|---|
| visitor | not signed in | public pages; Lectures and the group's files are locked |
| guest (`member`) | anybody who signs up | **Reads everything**: video courses, the group's playlists, the Books page, opens and downloads the group's files, sees the links members added. **Adds nothing**: no upload, no playlist, no link |
| asked to join (`ask`) | a guest who pressed *Ask to join* (or filled the note at sign-up) | exactly the same as a guest, until an admin decides; sees "waiting for approval" |
| group member (`team`) | approved by an admin | everything above, plus uploading files, adding links and adding / deleting their own YouTube videos and playlists |
| admin | the names in `ADMINS` | everything, can delete any file or playlist, and approve or decline join requests |

### How someone becomes a group member (no codes)
1. A new person signs up. The form has an optional line, "Are you in the group?": a professor or group member writes the
   supervisor's name or a Scopus ID there. (Anybody who skipped it can press **Ask to join the group** later, on the Books or Lectures page or in the account dialog.)
2. They can read everything straight away. Their account shows "waiting for approval".
3. Admins see a small dot on the account button and a number on the **Members** button. In Members, the **Waiting for approval** box is at the top:
   each request shows the name and the note, a tick when the name is on the People page, and **Approve** / **Decline**.
   Only admins see this box, and the backend refuses everybody else.
4. After **Approve** the person is a group member (on their next page load or refresh they get the upload and add buttons).
   **Remove from group** (or **Make member** for someone who never asked) works at any time in the same list.

The tick is only a hint for the admin, because the names on the People page are public. The decision is always the admin's.
Upload, link and playlist dialogs remind everybody: "Only add material you have the right to share."
Admin rights themselves are only given in `ADMINS` inside `code.gs` (add a professor there and run `tiklash` once if they should approve requests too; note that `tiklash` sets every listed admin's password back to the one written in the script).

- progress ("continue where you stopped") is saved on the server for every signed-in account and follows them to another device;
- account dialog: change password.

Choose which pages need sign-in in `js/config.js`:

    protect: ['lectures']      // add 'people', 'publications', ... or use [] to keep everything public (the group's files inside Books always need sign-in)

### Setting up your own backend (only if you do not want to share the AstroPhysics one)
1. Make a new Google Sheet, then Extensions > Apps Script. Paste your `code.gs` over the old code.
2. At the top of `code.gs`, put your own names and strong passwords in `ADMINS`, and your Drive folder id in `FOLDER_ID`.
3. Run the `setup` function once (it creates the sheets and the admin accounts).
4. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone. Copy the address that ends in `/exec`.
5. Put that address into `members.api` in `js/config.js`.
After you change `code.gs` later: Deploy > Manage deployments > Edit > New version > Deploy.

### Keep in mind
- **Never put `code.gs` in the folder you upload.** It holds the admin passwords and the Drive folder id,
  and everything in the site folder is public.
- **Change the admin passwords.** Sign in as each admin, open the account dialog (your initial in the top bar) and change the password.
  Then replace the passwords written in `ADMINS` in the script, so they no longer match.
- **Sign-up is open by default.** Anyone who finds the site can create an account. To limit it to your group, turn on the access code:
  set `invite: true` in `js/config.js`, and in `code.gs` add one line at the start of the `register` branch of `run`:

      if (q.code !== 'YOUR-GROUP-CODE') throw 'Kod noto\'g\'ri';

  Then give the code to new members yourself. (Checking the code in the browser alone would not protect anything.)
- The lecture list lives in `js/data.js`, so the YouTube video ids of the course lectures can be read by anyone who
  looks at the page source. The sign-in gate keeps casual visitors out; it does not hide the videos. Make the videos "unlisted" on YouTube,
  or keep them only in members' playlists, if they must stay private.
- Files in the members' library are shared on Google Drive as "anyone with the link". Only signed-in people are shown the links.
- **Copyright:** because only approved group members can add files, videos and links, the group knows who put what on the site. The responsibility for what is shared stays with the group; remove anything you do not have the right to share (admins can delete any item).

## Lectures play inside the page
On a normal web server the lectures play on the Lectures page, with:
- a playlist (click a lecture to switch),
- "continue from where you stopped" (kept in the browser, and on the server for signed-in members),
- the page remembers the last lecture or playlist item you opened: if you leave the site and come back, it
  reopens that lecture (or the next one, if you had finished it) instead of starting at lecture 1; a signed-in
  member gets the same on another device,
- a check mark on lectures already watched,
- automatic start of the next lecture (the visitor can switch this off).
If the YouTube player cannot load (blocked, offline, or a sandboxed preview), the page shows
"Watch on YouTube" links instead. Set `embedVideos: false` in `js/config.js` to always use links.

## Books
The Books page opens with a **Subject** row: Vectors and tensors, Classical mechanics, Electrodynamics, General
relativity, Quantum mechanics, Mathematical methods, Black holes and lensing. Under it are two options, which
show whatever belongs to the chosen subject:

**Group resources** are the files group members uploaded. Any signed-in person can open and download them; only group members can upload a book or notes under any of
the seven subjects (the dialog preselects the subject being viewed). Files are stored on the group's Google Drive.
The search box looks in every subject, because a book may have been filed elsewhere. Older uploads that had no
subject, or the old "Other" section, appear under an extra **Other** chip that is only shown when such files exist.

**Internet resources** have three parts for the subject:
- *Free to read online*: books with `free: true` and `pdf:` (or `url:`) in `js/data.js`; one click opens the PDF.
  Nearing's *Mathematical Tools for Physics* and Corral's *Vector Calculus* link to the author's page, which has the full PDF.
- *Textbooks: find a copy*: books under copyright (Landau, Jackson, Goldstein, Carroll's textbook, Bambi's book and so on).
  They are listed, not hosted, because a public website may not give away copyrighted books. Each has
  **Find in Group resources** (jumps to Group resources with the search filled in) and **Find a copy** (Open Library).
- *Links from members*: any group member can press **Add a link**, give the web address, an optional title and a
  subject. Only `http://` and `https://` addresses are accepted. Members can delete their own links; admins can delete any.

To add a curated book, copy an entry in `BOOKS` in `js/data.js` and set `cat` to `vt`, `mech`, `em`, `gr`, `qm`, `math` or `bh`.

If the group wants a particular copyrighted book on the site (for example the Bambi PDF), upload it under Group
resources, which only signed-in people can see. (Only do this if the group has the right to share the file.)

### How subjects and links are stored (backend) A file's subject is the digit in front of its title: `0::` vectors and tensors,
`1::` mechanics, `2::` relativity, `3::` other (these four are what the older site used, so old files still sort),
`4::` electrodynamics, `5::` quantum mechanics, `6::` mathematical methods, `7::` black holes and lensing.
A member's link is saved with the existing `addList` action: the title is `<digit>::<title>` and the link is
`u:<web address>`. The Lectures page ignores any entry whose link starts with `u:`, so web links never show up as
playlists here. The older site, which shares this backend, would show such an entry in its playlist list.
If your `code.gs` checks the `pl` value of `addList` and refuses addresses, loosen that check to accept values that start with `u:`.

## Book covers
Every book has a cover. Each one has a designed cover tile (colour by subject, title, author) that always works.
For most of the books the site also asks Open Library for the real cover by ISBN and shows it when one exists
(`isbn:` in `js/data.js`). A book without a cover, or an offline visitor, simply keeps the tile.
To use your own picture for a book, save it in `img/` (for example `img/covers/wald.jpg`) and add `cover: 'img/covers/wald.jpg'` to that book in `js/data.js`; it takes priority over the Open Library lookup.
Group resources files use the Google Drive thumbnail of the uploaded file, or a tile if Drive has none.

## Photos of the group leaders
Put two photos in the `img/` folder with these exact names and they appear automatically
(initials are shown until then):

    img/abdujabbarov.jpg     img/atamurotov.jpg

Portrait photos work best, about 600 x 750 px. To use other file names, change `photo:` in `LEADERS` in `js/data.js`.

## Edit it
- `js/data.js`   members, publications, courses and videos, books, news, reading roadmap
- `js/config.js` contact email, YouTube channel, "last updated" date, Uzbek alphabet default,
                 tile band on/off (`ornament`), sign-in settings (`members`)
- `js/i18n.js`   interface text in Uzbek / Russian / English, including the group name (`nav.brand`)

Uzbek text is written in the 1995 Latin spelling and converted automatically to the new
alphabet (Ş Ç Ö Ğ). Visitors can switch to the old spelling with the toggle in the footer.
To keep a word unchanged (for example an English title), wrap it in ⟦ ⟧.

## Add a member
The 18 current members are already in `js/data.js` under `MEMBERS`. To add one, copy an entry:

    { key: 'A. Surname', level: 'phd',
      name: L('Given Surname', 'Имя Фамилия', 'Given Surname'),
      photo: 'img/surname.jpg',
      links: [{ label: 'Scopus', url: 'https://www.scopus.com/authid/detail.uri?authorId=...' }] }

- `level` is one of: `postdoc` (PhD (Post-Doc)), `doc` (PhD), `phd` (PhD student), `msc` (Master student),
  `bsc` (Bachelor student). The People page shows a filter for the levels that are in use.
- Cards show the name, level, number of papers and links. They carry no research-area text.
- `photo` and `links` are optional.
- `key` is the name as it appears in the author lists of `PUBLICATIONS` ("K. Karshiboev"). The card counts
  papers with it and links to them. Use the first initial, so two people with the same surname are not mixed up.

Papers: add them to `PUBLICATIONS` with `authors`, `title`, `venue`, `year`, `doi` and/or `arxiv`
(or `url` for a journal page) and `themes`. A paper added there is shown on the Publications page and
counted on each author's card.

## Notes
- The Bambi GR textbook is linked to the publisher, not hosted here (copyright).
- `img/naqsh.png` is the tile from the AstroPhysics site, scaled down for the band.
- `js/demo-api.js` is a stand-in backend used only by the preview (`members.demo: true`). It is harmless to leave in.


## Light theme backdrop
In the light theme the page sits on warm paper with a grid of spacetime bent by two masses (`js/bg.js`, drawn on a fixed canvas;
the paper colours are the `--bg`, `--bg-art`, `--sunken`, `--line` tokens in `css/style.css`). In the dark theme the same sheet is a deep-space field with a lensed star field and an ember glow around the heavy mass.
With "reduce motion" switched on in the system, the picture is drawn once and does not move.

## Playlists on the Lectures page
A playlist added by a member is shown like a course: its title, then one row per video with its title (and duration), each playing
on the page, with the watched check mark and "continue where you stopped". The topics come from `js/ytlist.js`:
- **with** `youtubeApiKey` in `js/config.js` (a YouTube Data API v3 key; restrict it to your site address in Google Cloud): titles and durations;
- **without** a key: the video ids from the YouTube player and the titles from oEmbed; a duration appears after the video has been watched.
If the topics cannot be read (private playlist, offline), the playlist falls back to one row that plays the whole list.

## Search in Books
The search box finds Cyrillic and Latin spellings of the same word (`fold()` in `js/members.js`), in both directions.

## Uploads
Books are uploaded in the background: a small panel in the corner shows the progress even when the dialog is closed, the dialog
closes by itself when every file is uploaded (it stays open if a file failed), and more files can be added while others upload.

## Home page
The card "Video lectures" shows the cover of the first lecture (from YouTube, with a fallback to the dark poster). With `embedVideos: false` no image is requested.

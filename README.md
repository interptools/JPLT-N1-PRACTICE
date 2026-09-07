# N1 漢字練習帳 — Kanji Reviewer

A study app for the 1,504-kanji N1 list: animated stroke order, tracing practice with
per-stroke feedback, a free-writing square, search across readings and meanings, and a
spaced-review deck. Installs to a phone home screen and works without a connection.

## Files

```
index.html              the whole app, including all 1,504 entries
manifest.webmanifest    name, icons and colours used when installed
sw.js                   service worker: makes the app work offline
icons/                  app icons (192, 512, maskable, apple-touch, favicon)
```

All four must sit in the same folder. `sw.js` has to be at the same level as
`index.html` or it cannot cache the app.

## Publish on GitHub Pages

1. Create a public repository, e.g. `n1-kanji`.
2. Upload `index.html`, `manifest.webmanifest`, `sw.js` and the `icons` folder,
   keeping the folder structure above.
3. Settings → Pages → Source: *Deploy from a branch* → branch `main`, folder `/ (root)` → Save.
4. Open `https://<your-username>.github.io/n1-kanji/`.

Pages serves over HTTPS, which is what the offline service worker needs. Opening
`index.html` straight off the file system still works, but without install or offline.

## Install on a phone

- **Android / Chrome / Edge** — an **Install** button appears in the header; or use the
  browser menu → *Install app* / *Add to Home screen*.
- **iPhone / iPad (Safari)** — Share button → **Add to Home Screen**. The header's
  Install button shows the same reminder.

It then opens full screen, with its own icon, no address bar.

## Make it work offline

Readings, meanings and your review history are inside the app already. Stroke paths
download per character the first time you see them, so grab them in advance:

**Progress → Offline stroke data** → pick *All 1,504* (about 9 MB) or one set of 100 →
**Download for offline**. The counter shows how many are stored.

After that, everything runs with no signal: practice, tracing, search and reviews.

## Using it

- **Practice** — the writing square re-measures itself whenever its size changes, so ink lands
  under the finger; the header steps out of the way while you are writing. *Watch* the animated
  stroke order, *Trace* it (every stroke is checked
  for direction and start point, and misses are named by stroke number), or *Draw* it
  from memory over a faint guide you can switch off. Underneath, the character is broken
  into numbered squares, one stroke added each time, new stroke in red. Swipe left and
  right to move between kanji; double-tap the square to wipe your writing.
- **Browse** — search matches kanji, kana, romaji, English or entry number; filter by set
  of 100 or by status.
- **Review** — spaced repetition (SM-2). Mixed direction by default: kanji → meaning,
  meaning → kanji, kanji → reading. Again / Hard / Good / Easy.
- **Exam** — a full N1 practice paper from the official workbook, sat on screen: 69 questions
  across 問題1–13 (文字・語彙 25, 文法 20, 読解 24), with the reading passages included, an
  optional 110-minute clock, an answer sheet you can jump around in, and a **Submit** button.
  Marking comes straight back: score overall and per section, then every question again with
  your choice, the right answer and a note on why it is right. Past attempts are listed on the
  exam's opening card. There is no listening section.
- **ローマ字 and 英訳 EN** — two switches in the exam toolbar (and on the results card), both off
  to begin with so the paper reads as it would on the day. **ローマ字** puts the reading under
  every question stem and every choice; **英訳 EN** puts an English rendering under those and
  under each paragraph of the reading passages as well. With both on the order is Japanese,
  romaji, English. The passages are not romanised — several hundred characters of romaji is
  harder to read than the Japanese. Marked answers also carry a 語彙 line with the vocabulary
  worth keeping, and 問題4 and 問題6 get their word notes and assembled sentence there, kept out
  of sight while the paper is still being sat.
- **Progress** — mastery per set of 100, offline downloads, and progress export/import.

Keyboard, on a desktop: `←` `→` move · `R` replay · `T` trace · `S` star ·
`Space` reveal · `1`–`4` rate.

## Notes

- The exam answer key and explanations were worked out from the questions themselves — the
  workbook carries no key — so an item you disagree with is worth checking against a
  published key.
- Exam answers are kept separately from review history (`n1kanji.exam.v1`), so they are not
  part of the progress export. Leaving the tab pauses the exam clock; a part-finished paper
  is picked up where it was left.
- Review history lives in this browser's local storage, and an installed app has its own
  storage separate from the browser tab. Export a copy before clearing site data or
  moving devices, then import it on the other side.
- Stroke paths come from the KanjiVG-derived `hanzi-writer-data-jp` set, so the forms
  follow Japanese handwriting rather than Chinese. A few rare characters have no stroke
  data and fall back to freehand tracing over the outline.
- Updating: replace the files, and the app offers a **Reload** prompt the next time it is
  opened online. If you change `index.html` a lot, bump `VERSION` at the top of `sw.js`
  so old copies are cleared; downloaded stroke data survives that.

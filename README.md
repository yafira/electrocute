# electrocute.io 🌸 ⚡️

### a digital space at the intersection of art, design and engineering

hi, i'm yafira. i'm a design engineer and creative technologist, and this is the home of my independent practice, [electrocute lab](https://www.instagram.com/electrocutelab/). i build soft circuits, web tools, and what i like to call poetronics: electronics made with the sensibility of a poem.

electrocute is where i document my creative endeavors, experiments, craft, and cool findings. it's a place to show a bit of me, and hopefully spark some inspiration, growth, and all around magic ϟ

## what lives here

- **[soft interfaces](https://electrocute.io/soft-interfaces)** · a portfolio of projects rendered as pastel swatch cards pinned to a graph paper wall
- **[computer art](https://electrocute.io/computer-art)** · a dark, directory-indexed gallery of generative p5.js sketches and plotter prints; click any piece to view it full screen
- **[electronic text](https://electrocute.io/electronic-text)** · generative poems and poetry objects in black and white, including a computer of ___, a live poem readers can write into
- **[poetronics](https://electrocute.io/poetronics)** · electronics made with the sensibility of a poem
- **[electrodex](https://electrocute.io/electrodex)** · a community directory of creative tech spaces, makerspaces, and textile/craft communities, styled as a singly linked list (hex memory addresses, pointer wires and all)
- **[punch card archive](https://electrocute.io/punch-card-archive)** · every communal punch card visitors have finished, with the swatch each one knit
- **[colophon](https://electrocute.io/colophon)** · how the site is made, written like a bill of materials
- **poemdeck** · a little generative poetry gadget powered by tracery grammars
- **about + contact** · who i am and how to reach me
- and much more!

## tiny tools & interactions

the site is a little workbench, full of things to poke at:

**on the homepage**

- **index cards** · the project grid is data-driven (`src/data/projects.js`) and each project is a small index card that lifts out of the box on hover, running stitch showing along its edge
- **soft circuit** (under the nav) · a sewable coin cell, switch, and LED joined by conductive thread. close the switch and the running stitches become the current: the dashes flow around the loop and the LED glows. the site remembers if you left the light on
- **breadboard + power cable** · a mini breadboard with a cable plugged into the "b" of the logo. press its button and current runs up the cable, the logo flickers on like a neon sign, and you hear a hum and a little beep
- **dial-up modem** (under the logo) · the front panel of an old external modem. its data lights blink whenever you click around the page, and clicking it dials in, screech and all
- **tiny moth** (under the logo) · rests near the "e". when the breadboard powers the logo, it flies up to the light and flutters around it until the power goes off
- **communal punch card** · a 24-stitch knitting machine card (in honor of the KH-930). every visitor punches one hole in carriage order, bottom row first, and the fabric below knits itself live: punched holes become contrast stitches. when the last hole lands, the card is saved to the [archive](https://electrocute.io/punch-card-archive)
- **punchi** (beside the punch card) · a pastel egg pet whose mood follows the current card: sleepy on a fresh one, cheering as it fills up, all hearts when it's finished. A feeds it, B pets it, C asks how it's doing
- **soft potentiometer** (bottom left) · slides the page through paper → blush → butter → matcha → wisteria → evening

**around the site**

- **felt button** (footer, every page) · squishes, hums a soft two-note tone, and counts every press across all visitors
- **fortune chip** (contact) · a little 8-pin chip that prints a generated fortune with your lucky resistor values. click again to tear it off and print another
- **guest receipt** (contact) · leave a note and it prints onto a thermal receipt, newest at the bottom. every note stays on the paper, so the receipt grows longer as visitors sign it (up to the last 200)
- **stitch borders** · `<StitchBox>` is a reusable wrapper that sews a dashed border around anything when it scrolls into view
- **self-hosted sketch gallery** (`/computer-art`) · each generative piece lives as its own tiny static bundle under `public/sketches/`, not embedded from the p5 editor, so there's no editor chrome and the canvas always scales to fit

## built with

- [next.js](https://nextjs.org/) + react
- vanilla css (no framework, just vibes)
- [framer motion](https://www.framer.com/motion/) for micro-interactions
- [tracery](https://github.com/galaxykate/tracery) for generative text
- the web audio api for every click, hum, and screech
- [upstash redis](https://upstash.com/) for the shared counters, cards, and notes
- font awesome for icons
- deployed on [vercel](https://vercel.com/)

## running it locally

```bash
npm install
npm run dev
```

then open [localhost:3000](http://localhost:3000).

### shared state

the felt button, punch card, archive, and guest receipt share state through
four tiny api routes (`/api/press`, `/api/punch`, `/api/punch-archive`,
`/api/notes`) backed by upstash redis. copy `.env.example` to `.env.local`
(or add the two vars in vercel) and fill in your own database's url and
token to turn sharing on. without them, everything still works using
per-device localStorage, so nothing breaks in dev or preview deploys.
`.env.local` is ignored by git, so real keys never belong in a committed file.

punch card archive: a card is saved the moment its last hole is punched,
with the date it was finished. each saved card keeps its own copy of its
pattern, so editing the motifs in `src/data/punchMotifs.js` never changes
cards that are already in the archive.

guestbook housekeeping: notes are lightly sanitized, capped at 140
characters, one per visitor per device, and the list is trimmed to the
last 200. to remove a note, edit the `electrocute:notes` list in the
upstash console.

## find me elsewhere

- website: [electrocute.io](https://electrocute.io)
- instagram: [@electrocutelab](https://instagram.com/electrocutelab)

---

crafted with care (soft shell, live wire) ✿

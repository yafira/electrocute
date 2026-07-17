# electrocute.io 🌸 ⚡️

### a digital space at the intersection of art, design and engineering

hi, i'm yafira. i'm a design engineer and creative technologist, and this is the home of my independent practice, [electrocute lab](https://www.instagram.com/electrocutelab/). i build soft circuits, web tools, and what i like to call poetronics: electronics made with the sensibility of a poem.

electrocute is where i document my creative endeavors, experiments, craft, and cool findings. it's a place to show a bit of me, and hopefully spark some inspiration, growth, and all around magic ϟ

## what lives here

- **[soft interfaces](https://electrocute.io/soft-interfaces)** — a portfolio of projects rendered as pastel swatch cards pinned to a graph paper wall
- **[electrodex](https://electrocute.io/electrodex)** — a community directory of creative tech spaces, makerspaces, and textile/craft communities, styled as a singly linked list (hex memory addresses, pointer wires and all)
- **poemdeck** — a little generative poetry gadget powered by tracery grammars
- **about + contact** — who i am and how to reach me
- and much more!

## built with

- [next.js](https://nextjs.org/) + react
- vanilla css (no framework, just vibes)
- [framer motion](https://www.framer.com/motion/) for micro-interactions
- [tracery](https://github.com/galaxykate/tracery) for generative text
- font awesome for icons
- deployed on [vercel](https://vercel.com/)

## running locally

```bash
# clone the repo
git clone https://github.com/yafira/electrocute.git
cd electrocute

# install dependencies
npm install

# start the dev server
npm run dev
```

then open [http://localhost:3000](http://localhost:3000) in your browser.

## project structure

```
electrocute/
├── public/     # static assets (images, fonts, favicons)
├── src/        # pages, components, and styles
└── ...
```

## find me elsewhere

- website: [electrocute.io](https://electrocute.io)
- instagram: [@electrocutelab](https://instagram.com/electrocutelab)

---

crafted with care (soft shell, live wire) ✿

## little tools & interactions

the site now has a few small toys, in the spirit of a living space:

- **index cards** · the project grid is data-driven (`src/data/projects.js`) and each project is a small index card that lifts out of the box on hover, running stitch showing along its edge
- **felt button** (footer, every page) · squishes, hums a soft two-note tone, and counts every press across all visitors
- **communal punch card** (homepage) · a 24-stitch knitting machine card (in honor of the KH-930). every visitor punches one hole in carriage order, bottom row first, and the fabric below knits itself live: punched holes become contrast stitches. finished cards are counted
- **guest receipt** (contact) · leave a note and it prints onto a thermal receipt, newest at the bottom
- **soft potentiometer** (bottom left, homepage) · slides the page through paper → blush → butter → matcha → wisteria → evening
- **soft circuit** (under the nav) · a sewable coin cell, switch, and LED joined by conductive thread. close the switch and the running stitches become the current: the dashes flow around the loop and the LED glows. the site remembers if you left the light on
- **stitch borders** · `<StitchBox>` is a reusable wrapper that sews a dashed border around anything when it scrolls into view

### shared state

the felt counter, punch card, and receipt share state through three tiny api
routes (`/api/press`, `/api/punch`, `/api/notes`) backed by upstash redis.
copy `.env.example` to `.env.local` (or add the two vars in vercel) to turn
sharing on. without them, everything still works using per-device
localStorage, so nothing breaks in dev or preview deploys.

guestbook housekeeping: notes are lightly sanitized, capped at 140
characters, one per visitor per device, and the list is trimmed to the
last 200. to remove a note, edit the `electrocute:notes` list in the
upstash console.

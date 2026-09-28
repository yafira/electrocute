# a computer of ___

A generative poem that builds soft computers: imaginary machines made of fabric, powered gently, and built without urgency. The reader can help build them.

Each stanza assembles one machine in a seven-line cascade: material, binding, power, interface, place, inhabitant, promise. Each line steps further in, like something being carefully layered. Every visit opens with a finished machine, and each click or press of the space bar builds another one line by line.

```
A computer of moss
     held by snaps and patience
          powered by a long nap
               with a screen that refuses urgency
                    resting in the studio after critique
                         inhabited by a shy machine spirit
                              and it will wait for you.
```

## Two ways to build

**my words** builds from seven lists of phrases I wrote from my own design practice: "laced with ribbon logic", "a screen that refuses urgency", "it will never ask for your attention twice".

**our words** braids the reader's phrases in with mine. The reader writes into seven fields, and each field finishes the words above it ("a computer of ___", "powered by ___", "and ___"). For each line the generator tosses a coin between my phrases and the reader's; a part they leave empty comes from mine. A reader who writes a single phrase has the same chance of appearing as my whole list. The reader's phrases are underlined, so you can see where their words sit next to mine.

## Why the web

The poem started as a Python notebook that printed seven stanzas and stopped. In the browser it keeps going, and it can take in the reader's words. The machine stops being something I describe to you and becomes something we build together, one line mine, the next yours.

## How it works

Each line of the cascade is a prefix, a slot, and an ending:

```js
const CASCADE = [
  ["A computer of ", "material", ""],
  ["", "structure", ""],
  ["powered by ", "power", ""],
  ["with ", "interface", ""],
  ["resting ", "location", ""],
  ["inhabited by ", "inhabitant", ""],
  ["and ", "promise", "."]
];
```

Each slot is filled from my vocabulary, or in **our words**, from a coin toss between my phrases and the reader's:

```js
function fill(slot) {
  const yours = yourWords(slot);
  if (state.src === "mine") return { word: pick(MINE[slot]), mine: false };
  // an even chance either way, so a single phrase of theirs is as likely as my whole list
  if (yours.length && Math.random() < 0.5) return { word: pick(yours), mine: true };
  return { word: pick(MINE[slot]), mine: false };
}
```

The stepped indentation is one CSS rule. Each line gets its position in the cascade as `--i`:

```css
.line { padding-left: calc(var(--i) * var(--step)); }
```

`--step` is `5ch` on wide screens and `2ch` on phones, so the cascade fits a narrow screen without scrolling sideways.

## Files

- `index.html` holds the markup: the poem, the mode buttons, and the reader's form.
- `style.css` holds the black-and-white styling, the cascade, and the light and dark themes.
- `script.js` holds the vocabulary, the generator, the line-by-line reveal, and the saving of the reader's phrases.

## Running it

Open `index.html` in a browser, with `style.css` and `script.js` in the same folder. No build step, no server, and no libraries.

The only external resource is IBM Plex Mono from Google Fonts. Without a connection it falls back to the system monospace font.

## Origin

The generator began as Assignment #1 in Reading and Writing Electronic Text at NYU ITP, taught by Allison Parrish. The notebook is `poetry_generator.ipynb` in [electronic-txt](https://github.com/yafira/electronic-txt). The vocabulary, the seven-line structure, and the stepped indentation all come from that notebook. The web version adds the reader.

## Privacy

Phrases typed into the fields are saved only in that reader's own browser, so they're still there on the next visit. Nothing is sent anywhere, and "clear" empties them.

## Credits

Yafira Martinez, 2026.

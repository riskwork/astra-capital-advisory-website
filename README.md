# Astra Capital Advisory website

Plain HTML, CSS and JavaScript. No build step, no dependencies.

## Run it

Option 1: double-click `index.html`.

Option 2 (a local server):
```bash
python -m http.server 8080
```
then open http://localhost:8080

## What to fill in

| Where | What |
|---|---|
| `js/site-config.js` | Address, email, phone, social links, client login URL. Empty values show a placeholder or are hidden. |
| `js/site-config.js` | `heroVideo.enabled`: already `true`; the hero intro video is included. |
| `js/site-config.js` | `formEndpoint`: a URL that accepts a JSON POST so the consultation form sends real requests. Until set, the form runs in demo mode and sends nothing. |
| `assets/img/placeholder-how-we-work.svg`, `placeholder-why-choose-us.svg` | Replace with your photos. Easiest: change the `src` in `index.html`. |
| Logo | The wordmark is text (`.brand` in the header and footer of each page). Swap it for an `<img>` if you have a logo. |
| Font | Outfit is loaded from Google Fonts. To use Gilroy, add `@font-face` rules to `css/styles.css` and put `'Gilroy'` first in `--font`. |
| `terms.html`, `privacy.html`, `refund.html`, `accessibility.html` | Short neutral placeholder text. Replace with reviewed legal text. |

Every `TODO` in the code marks something still to do.

## Content notes

- All copy comes from the Astra Capital Advisory corporate profile PDF. The three "How We Work" lines (Investable, Compliant, Sustainable) are derived from the PDF's closing line.
- The PDF has no contact details, statistics or location, so none are shown.

## Hosting

This repo is deployed with GitHub Pages from the `main` branch root: https://riskwork.github.io/astra-capital-advisory-website/

## Pages

`index.html`, `about.html`, `consultation.html`, `terms.html`, `privacy.html`, `refund.html`, `accessibility.html`.

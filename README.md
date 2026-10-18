# Ethercat / $ECAT

A single scrolling Next.js site for Ethercat on Ethereum mainnet. The page is a fantasy kingdom told through ordinary cat behavior: silver-white fur, violet eyes, and far too much paperwork.

## Requirements

Node.js 20.9 or later. Node 22 is what the GitHub Pages workflow uses.

## Run locally

```bash
npm ci
npm run dev
```

Open http://localhost:3000. Do not open the source files with `file://`.

## Check and export

```bash
npm run typecheck
npm run build
```

`out/` is the static site. This project uses `output: 'export'`, so `next start` is not the production server. Preview the export with any static server, for example `npx serve out`.

## Edit before launch

`lib/config.ts` is the only file to edit for live values:

- token name, ticker, total supply, and tax
- contract address
- Telegram, X, and official swap URLs
- LP burn and ownership status, plus evidence links

Empty or non-HTTPS links stay unavailable. They do not point at `#` or invented accounts. Copy always copies the contract line that is on screen, including `Coming Soon..` before a real address is set. The swap control stays off the page until you choose to add one. Leave burn and renunciation as `Planned` until there is on-chain evidence. Do not describe those settings as a safety guarantee.

Set `NEXT_PUBLIC_SITE_URL` to the deployed HTTPS origin when you want absolute social images. Set `NEXT_PUBLIC_BASE_PATH` only for a project subdirectory such as `/ECAT`, with no trailing slash. The GitHub Pages workflow sets both from the Pages environment.

## Where things live

- `app/`: page composition, metadata, and the visual system
- `components/`: header, hero, origin, royal affairs, vault, entry, gallery, court, footer, the silent visit beacon, and the private dashboard
- `lib/config.ts`: token values, official links, asset helper, and meme captions
- `public/assets/`: original artwork, local fonts, SVG effects, and WebP/AVIF display derivatives
- `design-reference/`: the seven desktop section previews
- `docs/`: story, motion notes, and captions

Meme downloads use the original PNGs. On-screen scenes, the mascot, the logo, and the gallery use the smaller AVIF/WebP files beside them.

## Visitor dashboard

The public page does not show attendance. A silent beacon records each browser session, and `/dashboard` opens after the password `NeverSMILE`.

The dashboard shows who is active, unique visitors, visits, page views, copy and social clicks, an hourly or daily trend, referrals, campaigns, and a visit history with place, browser, path, and section. Development traffic stays hidden until that filter is turned on. IP addresses are not stored.

## Validation

Checked with Next.js 16.4.2:

- `npm run typecheck`
- `npm run build` (static export)
- browser comparison at 1440, 1280, 768, 390, and 320
- navigation, crystal taps, decree keyboard tabs, meme filters, lightbox, downloads, and reduced motion
- missing contract and social links stay disabled

The section previews guided composition. Website copy follows `docs/WEBSITE-STORY-AND-LAYOUT.md` and `lib/config.ts` where the preview microcopy disagrees. This is a close implementation, not a certified pixel-identical copy.

## Deployment

The workflow in `.github/workflows/pages.yml` builds `out/` and deploys with GitHub Actions. In the repository settings, set Pages to GitHub Actions. A project site is published at `https://<user>.github.io/ECAT/`.

## Font licenses

The display face is URW P052 (AGPL-3.0 with a font embedding exception). The body face is DejaVu Sans. License files are in `public/assets/fonts/licenses/`.

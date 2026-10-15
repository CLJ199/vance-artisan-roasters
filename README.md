# Vance Artisan Coffee Roasters: Website Draft

Practice portfolio project. Simulated client brief (Elena Vance, Owner & Head Roaster), plain HTML/CSS/JS, no framework and no build step.

## Run it
Open `index.html` in a browser. That's it.

## Structure
```
index.html        page markup (header, hero, beans, craft, wholesale, find us, footer)
css/styles.css    design tokens (client palette), layout, responsive rules
js/main.js        coffee data, roast/flavour filter, wholesale calculator, form validation
assets/img/photos/ supplied photography (hero, craft, 3 bag shots, 2 spare scenes used for social tiles)
assets/img/logo/  client logo (original + transparent light/dark variants, emblem, favicons)
assets/img/og-image.jpg  1200x630 social share image
assets/img/       earlier SVG illustrations kept for reference (not in use)
tools/make-logo-assets.py  rebuilds logo variants, favicons and og-image from the original logo (needs pillow + numpy)
tools/gen-assets.js  old SVG illustration generator (not in use)
backups/          snapshots: v1-placeholder-draft (grey slots), v2-illustrated-draft (SVG illustrations), v3-photos-draft (photos, before logo)
```

## Client brief → what was built
| Client asked for | Implemented |
|---|---|
| Interactive catalog, filter by roast (Light/Medium/Dark) or flavour | Two chip filter rows; combine roast + flavour; live result count |
| Wholesale inquiry form with order calculator | Form with kg/week slider, coffee, delivery location, equipment; live monthly estimate panel |
| Clear CTAs ("Inquire for Wholesale", "Find Our Beans") | Hero buttons, bean-card wholesale links (pre-select the coffee) |
| Warm, earthy, minimalist; espresso / terracotta / cream | Palette `#FDFBF7 #1C1613 #C85A32 #8C827A`, subtle noise texture on dark sections |
| Instagram feed near footer + social icons in header & footer | Placeholder tile grid + icons in both places |
| Fast and easy on phones | No dependencies besides Google Fonts; mobile nav; responsive grid |

## How to test (for the client email)
1. **Filter:** under *Our Beans*, tap **Light / Medium / Dark**, then add a flavour such as **Chocolatey**. Reset with "Reset filters" if nothing matches.
2. **Calculator:** under *Wholesale*, drag the volume slider and change the coffee and delivery. The estimate panel updates instantly; 10 kg+ and 25 kg+ trigger volume discounts.
3. **Form:** submit empty to see validation; fill it in to see the (mock) confirmation.

## Feedback to ask for at this stage
- Overall look and feel: colours, spacing, tone of the copy
- Layout and order of sections
- Calculator fields: are these the right questions? Are the tiers sensible?
- Which photos should go where (hero, craft section)

## Placeholders still to replace
- Logo is a raster (JPG) supplied by the client; transparent PNG variants are derived from it. Ask for the true vector (SVG) before launch for perfectly crisp scaling
- `photos/bag-highland.jpg` has the wrong brand mark (shows the Athi River logo) and garbled label text. Re-generate before launch
- `photos/counter-espresso.jpg` and `photos/table-pourover.jpg` carry other roasters' names (Archer & Oak, Oak & Ash); only cropped sections without the names are used (social tiles)
- Photos are AI-generated stand-ins; swap for the client's real photography when available
- Prices (retail and wholesale), delivery fees and discount tiers are invented for the demo
- Fonts: client's actual header/body fonts (currently Archivo + Inter)
- Form handler: set `data-endpoint` on `#wholesale-form` in `index.html` (see Going live)
- Instagram feed is static placeholder tiles; social URLs are generic
- Email address and address details need the real business info

## Going live (GitHub Pages + Formspree)

**1. Form endpoint (Formspree, free tier)**
1. Sign up at formspree.io and create a new form. Set the notification email to the address that should receive wholesale inquiries.
2. Copy the form URL, which looks like `https://formspree.io/f/xxxxxxxx`.
3. In `index.html`, paste it into `data-endpoint=""` on `<form id="wholesale-form">`.
4. Submit the form once on the live site to confirm Formspree's activation email, then test again.

**2. Publish on GitHub Pages**
1. Create a new **public** repository on GitHub named `vance-artisan-roasters` (leave it empty: no README, licence or .gitignore).
2. From this folder:
   ```bash
   git remote add origin https://github.com/<your-username>/vance-artisan-roasters.git
   git branch -M main
   git push -u origin main
   ```
3. On GitHub: **Settings -> Pages -> Build and deployment -> Deploy from a branch -> `main` / `(root)` -> Save**.
4. After a minute the site is live at `https://<your-username>.github.io/vance-artisan-roasters/`.

**3. Final touches after the first deploy**
- In `index.html`, replace `https://example.com` (the `og:image` and JSON-LD `image`) with the live URL, e.g. `https://<your-username>.github.io/vance-artisan-roasters`, then commit and push.
- Pin the repo on your GitHub profile and add the live URL in the repo's "About" box.
- Optional: share the link in a LinkedIn/Facebook post to check the social preview card.

All asset paths are relative, so the site works from the `/vance-artisan-roasters/` sub-path without changes. `backups/` is git-ignored (kept locally, not published).

**Other things still open:** Instagram live feed, real photography and logo vector, real prices (see "Placeholders still to replace").

## Change log
- 2026-10-15: Initial draft built from the Gemini "Coffee Roaster Website Consultation" brief.
- 2026-10-15: Added illustrated imagery (hero roaster, pour-over scene, product bags, Instagram tiles, emblem, favicon). Pre-illustration version kept in `backups/v1-placeholder-draft/`. Replaced the inline bag SVG and photo-slot placeholders with `<img>` assets.
- 2026-10-15: Replaced illustrations with supplied photography: hero (roastery), craft (barista pour-over), product cards (3 bag shots, 4:5 crop), Instagram tiles (square CSS crops). Prior version in `backups/v2-illustrated-draft/`.
- 2026-10-15: Added client logo (header emblem, footer lockup, favicons, apple-touch icon), generated transparent variants and og-image via `tools/make-logo-assets.py`. Added Open Graph/Twitter meta and JSON-LD. Form now posts to a configurable endpoint (demo mode when empty) with honeypot and error state. Fixed desktop form layout (checkbox labels, phone field height). Prior version in `backups/v3-photos-draft/`.
- 2026-10-15: Prepared for GitHub Pages: added `.gitignore` (excludes `backups/`), `.nojekyll`, and step-by-step Formspree + Pages instructions.

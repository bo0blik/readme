# VLESS VPN design showcase

Four static homepage concepts with a shared selection page. No installation or build is required.

The first concept includes a compact palette button beside the bot link. It offers twenty coordinated color themes and remembers the selection in local browser storage. The original colors remain the default. Theme controls support keyboard navigation, reduced motion, and browsers where storage is blocked. The palette panel scrolls to keep all twenty choices accessible on small screens.

## Pages

- `index.html`: concept selector.
- `variant1/`: first concept, including local fonts.
- `variant2/`: second concept, converted to plain HTML, CSS and JavaScript.
- `variant3/`: third concept, using its existing standalone HTML page.
- `variant4/`: a separate copy of the first concept with the supplied geometric lynx logo, warm graphite/orange branding and its own saved color preference.

The deployed copies use relative asset URLs and local pricing anchors so they work beneath a GitHub Pages repository path. Links to secondary pages not included in these concepts point to `https://vpn-vless.com`. Telegram destinations are retained from each concept.

## Local preview

Run `python3 -m http.server 8000` from this directory and open `http://localhost:8000/`.

## Hosting

GitHub Pages publishes the `main` branch from the repository root. `.nojekyll` keeps these files static. This repository is public, and published pages can be viewed without signing in. Search-engine indexing is discouraged with a robots meta tag; this does not restrict access.

The original development files, package dependencies and archive restoration files are not needed for this presentation. Other than the first concept's local heading font, web fonts may require network access. External service links and payment flows are not part of the preview checks.

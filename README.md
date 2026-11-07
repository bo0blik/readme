# VLESS VPN design showcase

PUBG PC store mockup: [open the published site](https://bo0blik.github.io/readme/pubg/).

Five static homepage concepts with a shared selection page. No installation or build is required.

The first concept includes a compact palette button beside the bot link. It offers twenty coordinated color themes and remembers the selection in local browser storage. The original colors remain the default. Theme controls support keyboard navigation, reduced motion, and browsers where storage is blocked. The palette panel scrolls to keep all twenty choices accessible on small screens.

## Pages

- `index.html`: concept selector.
- `variant1/`: first concept, including local fonts.
- `variant2/`: second concept, converted to plain HTML, CSS and JavaScript.
- `variant3/`: third concept, using its existing standalone HTML page.
- `variant4/`: a separate copy of the first concept with the supplied geometric lynx logo, warm graphite/orange branding and its own saved color preference.

Variant 4 contains five hero concepts on one page. Use the arrows or dots above the first screen to compare the gaze, leap, typographic mark, terrain and onboarding compositions. Selection is remembered locally; `variant4/?hero=1` through `variant4/?hero=5` can be shared directly. There is no autoplay. The full-body leap illustration was generated using the supplied logo as a visual reference. The onboarding scene is an illustration, not an active VPN client or usable QR key.

The deployed copies use relative asset URLs and local pricing anchors so they work beneath a GitHub Pages repository path. Links to secondary pages not included in these concepts point to `https://vpn-vless.com`. Telegram destinations are retained from each concept.

## Local preview

Run `python3 -m http.server 8000` from this directory and open `http://localhost:8000/`.

## Hosting

GitHub Pages publishes the `main` branch from the repository root. `.nojekyll` keeps these files static. This repository is public, and published pages can be viewed without signing in. Variants 1–4 discourage search-engine indexing with a robots meta tag. Variant 5 permits indexing; all variants are publicly accessible.

The original development files, package dependencies and archive restoration files are not needed for this presentation. Other than the first concept's local heading font, web fonts may require network access. External service links and payment flows are not part of the preview checks.

- `variant5/`: refined iris-colored layout with onboarding cards, animated trial ticket, responsive navigation, location rotation and blog cards. Static HTML/CSS/JS; no build required.

## Р¤Р‘РљРљ вЂ” С‡РµС‚С‹СЂРµ РІР°СЂРёР°РЅС‚Р° СЃР°Р№С‚Р°

[РћС‚РєСЂС‹С‚СЊ РєР°С‚Р°Р»РѕРі РґРёР·Р°Р№РЅРѕРІ Р¤Р‘РљРљ](https://bo0blik.github.io/readme/fbkk-designs/)

| Р’Р°СЂРёР°РЅС‚ | GitHub Pages |
| --- | --- |
| 01 вЂ” РќРµРѕРЅРѕРІР°СЏ СЂРµРґР°РєС†РёСЏ | [РћС‚РєСЂС‹С‚СЊ](https://bo0blik.github.io/readme/fbkk-designs/01-neon-editorial-krasnoyarsk/) |
| 02 вЂ” Р“РѕСЂРѕРґСЃРєРёРµ Р±Р°С‚С‚Р»С‹ | [РћС‚РєСЂС‹С‚СЊ](https://bo0blik.github.io/readme/fbkk-designs/02-urban-breaking-events/) |
| 03 вЂ” РўРёРїРѕРіСЂР°С„РёС‡РµСЃРєРёР№ РјР°РЅРёС„РµСЃС‚ | [РћС‚РєСЂС‹С‚СЊ](https://bo0blik.github.io/readme/fbkk-designs/03-bold-typography-manifest/) |
| 04 вЂ” РљСЂР°Р№ РІ РґРІРёР¶РµРЅРёРё | [РћС‚РєСЂС‹С‚СЊ](https://bo0blik.github.io/readme/fbkk-designs/04-krai-v-dvizhenii/) |

РЎС‚Р°С‚РёС‡РµСЃРєРёРµ HTML-РІРµСЂСЃРёРё РёСЃС…РѕРґРЅС‹С… РґРёР·Р°Р№РЅ-РєРѕРЅС†РµРїС†РёР№. Р’Р°СЂРёР°РЅС‚ 04 СЃРѕРґРµСЂР¶РёС‚ Р»РѕРєР°Р»СЊРЅС‹Рµ С„РѕС‚РѕРіСЂР°С„РёРё Рё SVG-Р»РѕРіРѕС‚РёРї. РџРµСЂРµРґ РїСѓР±Р»РёС‡РЅС‹Рј РёСЃРїРѕР»СЊР·РѕРІР°РЅРёРµРј С„РѕС‚РѕРіСЂР°С„РёР№ РЅРµРѕР±С…РѕРґРёРјРѕ РїСЂРѕРІРµСЂРёС‚СЊ Рё РІС‹РїРѕР»РЅРёС‚СЊ С‚СЂРµР±РѕРІР°РЅРёСЏ РёС… Р»РёС†РµРЅР·РёР№ Рё Р°С‚СЂРёР±СѓС†РёРё.

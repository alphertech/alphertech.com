# TODO - Seytrons sitemap & redirects

- [x] Add `https://alphertech.com/seytrons-landing/seytrons.html` to `sitemap.xml`
- [x] Search repo for existing redirect/hosting config files
- [x] Validate sitemap.xml is well-formed

## Keyword search redirects -> index.html (brand / person / location / top searches)
Hosting is GitHub Pages (CNAME present) which has NO server-side 301s, so these are
static landing pages that auto-forward (meta refresh + JS) to `index.html` and declare
`index.html` as canonical. For an Apache host, replace with real 301s in `.htaccess`.

- [x] Generate 17 keyword landing pages in repo root, each redirecting to `index.html`:
      alphertech-solutions, twale, twale-james, massete, twale-james-massete,
      web-developers-in-kampala, tech-engineers, tech-engneers (typo catch),
      web-design-kampala, website-developers-uganda, app-developers-kampala,
      software-company-kampala, it-company-kampala, web-designers-kampala,
      software-developers-kampala, digital-marketing-kampala, best-web-designers-uganda
- [x] Expand `index.html` meta keywords + add Twale James / Kampala mention in footer
- [x] Expand `about.html` meta keywords for Twale James / Massete terms
- [ ] (Optional) Add `.htaccess` 301s if/when deployed on Apache






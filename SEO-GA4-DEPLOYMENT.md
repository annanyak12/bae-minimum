# BAE MINIMUM — SEO + GA4 update

## Included
- GA4 Google tag using Measurement ID `G-BNZRLLJYRD` on all HTML pages.
- Unique titles, meta descriptions and canonical URLs.
- Additional explanatory, useful static content on the Home, Shop and Contact pages.
- `sitemap.xml`, `robots.txt`, and Netlify redirects for `/about` and `/products` aliases.
- Cart, checkout, login, signup and wishlist marked `noindex,follow`.
- Existing CSS and JavaScript preserved.

## Deploy
1. Extract this ZIP. Open the `bae-minimum` folder.
2. Deploy the contents of that folder to the existing Netlify site (or replace the project files in the connected GitHub repository and push once). Do not upload the ZIP as a single static file.
3. After deployment, open the live home page and visit About, Shop, Contact and at least one utility page to check navigation and layout.
4. Use https://tagassistant.google.com/ to test `https://bae-minimum.netlify.app/`; confirm the Google tag `G-BNZRLLJYRD` is detected.
5. Open GA4 → Reports → Realtime and visit the live site in another tab. Confirm your visit/page_view events appear.
6. Recrawl the domain in Ubersuggest and compare against the saved baseline. Audit results can take time to refresh.

## Notes
- The products, prices and checkout/account interactions remain fictional demo features.
- This package cannot guarantee a specific Ubersuggest score or Google ranking. Confirm live redirect behavior and GA4 collection after deployment.
- The Google tag was copied from the supplied GA4 setup flow; if your property ID has changed, replace it consistently across all HTML pages.

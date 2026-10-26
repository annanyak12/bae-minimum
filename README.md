# BAE MINIMUM — college skincare brand website

Frontend-only project built with HTML5, CSS3 and vanilla JavaScript. **Everything is a demonstration:** products, prices, accounts, checkout and contact form are fictional.

## Run it
```
cd bae-minimum
python3 -m http.server 8000
```
Open http://localhost:8000. (Fonts load from Google Fonts; fallbacks are used offline.)

## Files
`index, about, products, contact, cart, wishlist, checkout, login, signup .html` · `style.css` (design system; palette and fonts from the PPT) · `script.js` (all behaviour) · `assets/images/` (the four photographs from the presentation).

## Editing products
Open `script.js` and edit the `PRODUCTS` array (id, name, category, price, size, desc, `art` shape and `color`). Every page reads from it, and cart totals are recalculated from it, never from stored prices.

## localStorage keys
| Key | Contents |
|---|---|
| `bae_cart` | `[{id, qty}]` |
| `bae_wishlist` | list of product ids |
| `bae_demo_accounts` | demo accounts: name, email, non-secure demo hash |
| `bae_demo_session` | active demo session (name, email) |

Invalid or tampered data is ignored safely. Login and logout never touch the cart or wishlist. Clear site data in browser dev tools to reset.

## Demo authentication: limitations
Sign-up, login and logout are a **simulation**. With no backend, anything in localStorage can be read or edited by the visitor. The "hash" is a simple non-cryptographic function for matching in the demo, **not security**. Do not use real emails or passwords. There is no password recovery, email verification or OAuth. Browsing, cart and wishlist need no login; the only account-only action is "Save wishlist to my account" on the Wishlist page, which redirects to Login and returns afterwards.

## Checkout
Validates name, email, Indian mobile number and 6-digit PIN, then shows a generated `BAE-DEMO-…` reference and empties the cart. No payment, order or fulfilment happens.

## Sources and limits
Content comes from the PPT (story, values, persona, team names). Product images are drawn as inline SVG so they never fail to load. No clinical or medical claims are made.

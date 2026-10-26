/* BAE MINIMUM — shared script. Frontend-only demo: no backend, no real payments, no real authentication. */
(function () {
'use strict';

/* ========== 1. PRODUCT DATA (single source of truth — edit here) ========== */
const PRODUCTS = [
  { id:'bm-001', name:'Soft Start Gel Cleanser', category:'Cleanser', price:299, size:'100 ml', image:'images/gel_cleanser.jpeg', art:'pump', color:'#B9C27A', desc:'A light, gentle gel cleanser for a quick morning and evening wash.', long:'Illustrative product: a simple one-step cleanse designed to fit into a busy day. Sample data only.' },
  { id:'bm-002', name:'Everyday Cloud Moisturiser', category:'Moisturiser', price:449, size:'50 g', image:'images/cloud_moisturiser.jpeg', art:'jar', color:'#C2A57F', desc:'A soft, lightweight cream for daily comfort.', long:'Illustrative product: one moisturiser to keep your routine short. Sample data only.' },
  { id:'bm-003', name:'Sun Minimum SPF Fluid', category:'Sunscreen', price:549, size:'50 ml', image:'images/sunscreen.jpeg', art:'tube', color:'#F1D9A0', desc:'A sheer, easy-to-wear daily sunscreen concept.', long:'Illustrative product: a no-fuss daytime step. Sample data only; no SPF or protection claim is made.' },
  { id:'bm-004', name:'Glow Drop Vitamin Serum', category:'Serum', price:649, size:'30 ml', image:'images/vitamin_serum.jpeg', art:'dropper', color:'#C98A3B', desc:'A single-step brightening-style serum concept for busy mornings.', long:'Illustrative product: sample data only. No clinical or medical benefit is claimed.' },
  { id:'bm-005', name:'Quench Hydra Serum', category:'Serum', price:599, size:'30 ml', image:'images/hydra_serum.jpeg', art:'dropper', color:'#9AA06A', desc:'A water-light hydrating serum concept.', long:'Illustrative product: sample data only. No clinical or medical benefit is claimed.' },
  { id:'bm-006', name:'First Me Lip Balm', category:'Lip Balm', price:199, size:'5 g', image:'images/lip_balm.jpeg', art:'stick', color:'#B5764F', desc:'A small, pocket-friendly balm for a moment of care.', long:'Illustrative product: sample data only.' },
  { id:'bm-007', name:'Pause Rose Face Mist', category:'Face Mist', price:349, size:'100 ml', image:'images/face_mist.jpeg', art:'spray', color:'#D8B4A0', desc:'A cooling mist for a 10-second reset between meetings.', long:'Illustrative product: sample data only.' },
  { id:'bm-008', name:'Night Off Overnight Jar', category:'Moisturiser', price:499, size:'50 g', image:'images/overnight.jpeg', art:'jar', color:'#816F0F', desc:'A richer evening cream concept for winding down.', long:'Illustrative product: sample data only.' }
];

const FREE_SHIP_AT = 499, SHIP_FEE = 49;
const KEYS = { cart:'bae_cart', wish:'bae_wishlist', accounts:'bae_demo_accounts', session:'bae_demo_session' };

/* ========== 2. HELPERS ========== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const inr = n => '₹' + Number(n).toLocaleString('en-IN');
const byId = id => PRODUCTS.find(p => p.id === id);

function load(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v == null ? fallback : v;
  } catch (e) {
    return fallback;
  }
}

function save(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    toast('Storage is unavailable in this browser.');
  }
}

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

function toast(msg) {
  let box = $('.toasts');
  if (!box) {
    box = el('div', 'toasts');
    box.setAttribute('role', 'status');
    box.setAttribute('aria-live', 'polite');
    document.body.appendChild(box);
  }
  const t = el('div', 'toast', msg);
  box.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

const ICON = {
  heart:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.600-9 9-9 9z"/></svg>',
  bag:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12H6zM9 8a3 3 0 0 1 6 0"/></svg>',
  user:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 15-5 16 0"/></svg>',
  menu:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>'
};

/* Product photos with fallback illustrations */
function productArt(p) {
  if (p.image) {
    const src = p.image.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    const alt = p.name.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

    return '<img class="product-photo" src="' + src + '" alt="' + alt + '" loading="lazy" onerror="this.hidden=true;this.parentElement.classList.add(&quot;image-missing&quot;)">';
  }

  const c = p.color, d = '#5B2210', w = '#FAF6F0';

  const shapes = {
    pump:`<rect x="38" y="48" width="44" height="100" rx="10" fill="${c}"/><rect x="50" y="20" width="20" height="30" fill="${d}"/><rect x="50" y="20" width="40" height="8" rx="3" fill="${d}"/><rect x="44" y="84" width="32" height="30" rx="3" fill="${w}"/>`,
    jar:`<rect x="22" y="70" width="76" height="60" rx="12" fill="${c}"/><rect x="18" y="46" width="84" height="28" rx="6" fill="${w}" stroke="${d}"/><rect x="34" y="92" width="52" height="20" rx="3" fill="${w}" opacity=".85"/>`,
    tube:`<path d="M36 30h48l6 105H30z" fill="${c}"/><rect x="36" y="18" width="48" height="16" rx="3" fill="${d}"/><rect x="40" y="76" width="40" height="28" rx="3" fill="${w}" opacity=".9"/>`,
    dropper:`<rect x="36" y="64" width="48" height="76" rx="10" fill="${c}"/><rect x="48" y="48" width="24" height="18" fill="${d}"/><path d="M52 48V24a8 8 0 0 1 16 0v24z" fill="${d}"/><rect x="42" y="90" width="36" height="28" rx="3" fill="${w}" opacity=".9"/>`,
    stick:`<rect x="42" y="70" width="36" height="70" rx="6" fill="${d}"/><rect x="46" y="30" width="28" height="44" rx="12" fill="${c}"/><rect x="46" y="96" width="28" height="16" rx="2" fill="${w}" opacity=".9"/>`,
    spray:`<rect x="38" y="56" width="44" height="86" rx="12" fill="${c}"/><rect x="50" y="38" width="20" height="20" fill="${d}"/><rect x="44" y="26" width="36" height="14" rx="4" fill="${d}"/><rect x="44" y="88" width="32" height="26" rx="3" fill="${w}" opacity=".9"/>`
  };

  return '<svg viewBox="0 0 120 160" role="img" aria-label="' + p.name.replace(/"/g, '') + ' illustration">' + (shapes[p.art] || shapes.jar) + '</svg>';
}

/* ========== 3. STATE: CART, WISHLIST ========== */
function getCart() {
  const raw = load(KEYS.cart, []);
  if (!Array.isArray(raw)) return [];
  return raw.filter(i => i && byId(i.id) && Number.isInteger(i.qty) && i.qty > 0)
    .map(i => ({ id:i.id, qty:Math.min(i.qty, 10) }));
}

function getWish() {
  const raw = load(KEYS.wish, []);
  return Array.isArray(raw) ? raw.filter(id => byId(id)) : [];
}

function addToCart(id, n = 1) {
  const cart = getCart(), it = cart.find(i => i.id === id);
  if (it) it.qty = Math.min(it.qty + n, 10);
  else cart.push({ id, qty:n });
  save(KEYS.cart, cart);
  updateCounts();
  toast(byId(id).name + ' added to cart');
}

function setQty(id, q) {
  let cart = getCart();
  const it = cart.find(i => i.id === id);
  if (!it) return;
  it.qty = q;
  cart = cart.filter(i => i.qty > 0);
  save(KEYS.cart, cart);
  updateCounts();
  renderCart();
}

function toggleWish(id) {
  let w = getWish();
  const had = w.includes(id);
  w = had ? w.filter(x => x !== id) : w.concat(id);
  save(KEYS.wish, w);
  updateCounts();
  toast(had ? 'Removed from wishlist' : 'Saved to wishlist ♥');
  $$('.heart[data-id="' + id + '"]').forEach(h => h.setAttribute('aria-pressed', String(!had)));
  renderWishlist();
}

function totals() {
  const cart = getCart();
  const sub = cart.reduce((s, i) => s + byId(i.id).price * i.qty, 0);
  const ship = sub === 0 ? 0 : (sub >= FREE_SHIP_AT ? 0 : SHIP_FEE);
  return {
    cart,
    sub,
    ship,
    total: sub + ship,
    count: cart.reduce((s, i) => s + i.qty, 0)
  };
}

function updateCounts() {
  const c = totals().count, w = getWish().length;
  $$('[data-cart-count]').forEach(e => {
    e.textContent = c;
    e.hidden = c === 0;
  });
  $$('[data-wish-count]').forEach(e => {
    e.textContent = w;
    e.hidden = w === 0;
  });
}
/* ========== 4. DEMO AUTH (client-side simulation — NOT secure) ========== */
// Not a real hash and not secure. Exists only so the classroom demo can match a password.
function demoHash(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return 'demo-' + h.toString(16);
}

function getAccounts() {
  const a = load(KEYS.accounts, []);
  return Array.isArray(a) ? a.filter(x => x && typeof x.email === 'string') : [];
}

function getSession() {
  const s = load(KEYS.session, null);
  return s && typeof s.email === 'string' && typeof s.name === 'string' ? s : null;
}

function register(name, email, pw) {
  const accts = getAccounts();
  if (accts.some(a => a.email === email)) return false;
  accts.push({ name, email, pwDemoHash: demoHash(pw) });
  save(KEYS.accounts, accts);
  return true;
}

function login(email, pw) {
  const a = getAccounts().find(x => x.email === email && x.pwDemoHash === demoHash(pw));
  if (!a) return false;
  save(KEYS.session, { email:a.email, name:a.name });
  return true;
}

function logout() {
  try { localStorage.removeItem(KEYS.session); } catch (e) {}
  sessionStorage.setItem('bae_flash', 'You have been logged out (demo).');
  location.href = 'index.html';
}

function safeNext(n) {
  return /^[a-z-]+\.html$/.test(n || '') ? n : 'index.html';
}

function requireLogin(label) {
  if (getSession()) return true;
  location.href = 'login.html?next=' +
    encodeURIComponent(location.pathname.split('/').pop() || 'index.html') +
    '&reason=' + encodeURIComponent(label);
  return false;
}

/* ========== 5. SHARED HEADER / FOOTER ========== */
/* SOCIAL: replace the two placeholder URLs below with your real profile links. */
const SOCIAL = [
  { name:'Instagram', url:'https://www.instagram.com/baeminimum?srtk=MWZwbGF0eDViYzM2eQ==', icon:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>' },
  { name:'Pinterest', url:'https://pin.it/FxecHc2Zr', icon:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M11 8.500c2.800-1 5 .8 4.500 3.300-.4 2.200-2.400 3.200-3.800 2.200M11.700 10.500 9.800 19"/></svg>' }
];

/* SOCIAL: builds the icon links (used in the footer and on the Contact page) */
function socialHtml() {
  return '<span class="social">' + SOCIAL.map(x => '<a href="' + x.url + '" target="_blank" rel="noopener noreferrer" aria-label="' + x.name + ' (opens in a new tab)">' + x.icon + '</a>').join('') + '</span>';
}

const NAV = [
  ['index.html','Home'],
  ['about.html','About Us'],
  ['products.html','Shop'],
  ['contact.html','Contact Us']
];

function renderChrome() {
  const page = location.pathname.split('/').pop() || 'index.html';
  const s = getSession();

  const links = NAV.map(([h, t]) =>
    '<li><a href="' + h + '"' +
    (h === page ? ' aria-current="page"' : '') +
    '>' + t + '</a></li>'
  ).join('');

  const acct = s
    ? '<div class="menu" id="acct-menu"><div class="who"></div><a href="wishlist.html">My wishlist</a><a href="cart.html">My cart</a><button type="button" data-logout>Logout</button></div>'
    : '<div class="menu" id="acct-menu"><a href="login.html">Login</a><a href="signup.html">Create Account</a></div>';

  const h = $('#site-header');

  if (h) {
    h.className = 'site-header-wrap';
    h.innerHTML =
      '<div class="announce">Self-care is not selfish. Give yourself the bare minimum you deserve.</div>' +
      '<div class="site-header"><div class="wrap nav">' +
      '<a class="logo" href="index.html" aria-label="BAE MINIMUM home"><span class="bae">Bae</span><span class="min">MINIMUM</span></a>' +
      '<ul class="nav-links" id="nav-links">' + links + '</ul><div class="nav-actions">' +
      '<a class="icon-btn" href="wishlist.html" aria-label="Wishlist">' + ICON.heart + '<span class="badge" data-wish-count hidden>0</span></a>' +
      '<a class="icon-btn" href="cart.html" aria-label="Cart">' + ICON.bag + '<span class="badge" data-cart-count hidden>0</span></a>' +
      '<div class="account"><button class="icon-btn" type="button" id="acct-btn" aria-haspopup="true" aria-expanded="false" aria-controls="acct-menu" aria-label="Account menu">' + ICON.user + '</button>' + acct + '</div>' +
      '<button class="icon-btn burger" type="button" id="burger" aria-expanded="false" aria-controls="nav-links" aria-label="Open menu">' + ICON.menu + '</button>' +
      '</div></div></div>';

    if (s) $('.who', h).textContent = 'Hi, ' + s.name.split(' ')[0] + ' (demo)';
  }

  const f = $('#site-footer');

  if (f) {
    f.innerHTML =
      '<footer class="site-footer"><div class="wrap"><div class="fgrid">' +
      '<div><a class="logo" href="index.html"><span class="bae" style="color:#E3D5C3">Bae</span><span class="min" style="color:#EFE7DD">MINIMUM</span></a><p>Because your skin comes first.<br>BAE = Before Anybody Else.</p>' + socialHtml() + '</div>' +
      '<div><h3>Explore</h3><ul><li><a href="about.html">About Us</a></li><li><a href="products.html">Shop</a></li><li><a href="contact.html">Contact Us</a></li></ul></div>' +
      '<div><h3>Account</h3><ul><li><a href="login.html">Login</a></li><li><a href="signup.html">Create Account</a></li><li><a href="wishlist.html">Wishlist</a></li></ul></div>' +
      '</div><p class="fine">A college project. All products, prices and formulations are fictional demonstration data. No real orders, payments or accounts. © BAE MINIMUM student project.</p></div></footer>';
  }

  /* SOCIAL: fills the "Follow us" card on the Contact page */
  $$('[data-social]').forEach(e => { e.innerHTML = socialHtml(); });

  const flash = sessionStorage.getItem('bae_flash');
  if (flash) {
    sessionStorage.removeItem('bae_flash');
    toast(flash);
  }
}

/* ========== 6. PRODUCT RENDERING ========== */
function productCard(p) {
  const art = el('div', 'product');
  const img = el('button', 'pimg');
  img.type = 'button';
  img.setAttribute('aria-label', 'View details for ' + p.name);
  img.dataset.detail = p.id;
  img.innerHTML = productArt(p);

  const heart = el('button', 'heart');
  heart.type = 'button';
  heart.dataset.id = p.id;
  heart.setAttribute('aria-label', 'Toggle wishlist for ' + p.name);
  heart.setAttribute('aria-pressed', String(getWish().includes(p.id)));
  heart.innerHTML = ICON.heart;

  const wrapImg = el('div');
  wrapImg.style.position = 'relative';
  wrapImg.append(img, heart);

  const body = el('div', 'pbody');
  const nameBtn = el('button', 'pname', p.name);
  nameBtn.type = 'button';
  nameBtn.dataset.detail = p.id;

  const row = el('div', 'prow');
  const price = el('div');
  price.append(el('span', 'price', inr(p.price)), el('div', 'size', p.size));

  const add = el('button', 'btn sm', 'Add to Cart');
  add.type = 'button';
  add.dataset.add = p.id;

  row.append(price, add);
  body.append(el('span', 'pcat', p.category), nameBtn, el('p', 'pdesc', p.desc), row);
  art.append(wrapImg, body);

  return art;
}

function renderFeatured() {
  const g = $('#featured-grid');
  if (g) PRODUCTS.slice(0, 4).forEach(p => g.appendChild(productCard(p)));
}

function renderShop() {
  const grid = $('#shop-grid');
  if (!grid) return;

  const q = $('#search');
  const sort = $('#sort');
  const chips = $('#chips');
  const empty = $('#shop-empty');
  const count = $('#shop-count');

  let cat = 'All';

  ['All'].concat([...new Set(PRODUCTS.map(p => p.category))]).forEach(c => {
    const b = el('button', 'chip', c);
    b.type = 'button';
    b.setAttribute('aria-pressed', String(c === cat));
    b.dataset.cat = c;
    chips.appendChild(b);
  });

  function draw() {
    const term = q.value.trim().toLowerCase();

    let list = PRODUCTS.filter(p =>
      (cat === 'All' || p.category === cat) &&
      (p.name + ' ' + p.desc).toLowerCase().includes(term)
    );

    const s = sort.value;

    list.sort(
      s === 'price-asc' ? (a, b) => a.price - b.price :
      s === 'price-desc' ? (a, b) => b.price - a.price :
      s === 'name-desc' ? (a, b) => b.name.localeCompare(a.name) :
      (a, b) => a.name.localeCompare(b.name)
    );

    grid.replaceChildren(...list.map(productCard));
    empty.hidden = list.length > 0;
    count.textContent = list.length + ' product' + (list.length === 1 ? '' : 's');
  }

  chips.addEventListener('click', e => {
    const b = e.target.closest('.chip');
    if (!b) return;
    cat = b.dataset.cat;
    $$('.chip', chips).forEach(c => c.setAttribute('aria-pressed', String(c === b)));
    draw();
  });

  q.addEventListener('input', draw);
  sort.addEventListener('change', draw);

  $('#reset-filters').addEventListener('click', () => {
    q.value = '';
    cat = 'All';
    sort.value = 'name-asc';
    $$('.chip', chips).forEach(c => c.setAttribute('aria-pressed', String(c.dataset.cat === 'All')));
    draw();
  });

  draw();
}
let lastFocus = null;

function openModal(id) {
  const p = byId(id), ov = $('#modal');
  if (!p || !ov) return;

  lastFocus = document.activeElement;

  $('#m-art').innerHTML = productArt(p);
  $('#m-cat').textContent = p.category;
  $('#m-name').textContent = p.name;
  $('#m-desc').textContent = p.desc + ' ' + p.long;
  $('#m-price').textContent = inr(p.price) + ' · ' + p.size;
  $('#m-add').dataset.add = p.id;

  const h = $('#m-heart');
  h.dataset.id = p.id;
  h.setAttribute('aria-pressed', String(getWish().includes(id)));

  ov.classList.add('open');
  $('.close', ov).focus();
}

function closeModal() {
  const ov = $('#modal');
  if (ov) {
    ov.classList.remove('open');
    if (lastFocus) lastFocus.focus();
  }
}

function ensureModal() {
  if ($('#modal') || !$('[data-needs-modal]')) return;

  const ov = el('div', 'overlay');
  ov.id = 'modal';

  ov.innerHTML =
    '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="m-name">' +
    '<button class="close" type="button" aria-label="Close details">×</button>' +
    '<div class="pimg" id="m-art-wrap"><span id="m-art"></span>' +
    '<button class="heart" id="m-heart" type="button" aria-label="Toggle wishlist" aria-pressed="false">' + ICON.heart + '</button></div>' +
    '<div class="info"><span class="pcat" id="m-cat"></span><h2 id="m-name"></h2>' +
    '<p id="m-desc"></p><p class="price" id="m-price"></p>' +
    '<div class="notice">Fictional demo product. No medical or clinical claims.</div>' +
    '<button class="btn" id="m-add" type="button">Add to Cart</button></div></div>';

  document.body.appendChild(ov);

  ov.addEventListener('click', e => {
    if (e.target === ov || e.target.closest('.close')) closeModal();
  });

  $('#m-art').style.display = 'contents';
}

/* ========== 7. CART & WISHLIST PAGES ========== */
function renderCart() {
  const list = $('#cart-list');
  if (!list) return;

  const t = totals();
  $('#cart-empty').hidden = t.cart.length > 0;
  $('#cart-full').hidden = t.cart.length === 0;

  list.replaceChildren(...t.cart.map(i => {
    const p = byId(i.id);
    const row = el('div', 'line');
    const th = el('div', 'thumb');
    th.innerHTML = productArt(p);

    const mid = el('div');
    mid.append(
      el('strong', null, p.name),
      el('div', 'size', p.category + ' · ' + p.size + ' · ' + inr(p.price))
    );

    const rm = el('button', 'link-btn', 'Remove');
    rm.type = 'button';
    rm.dataset.remove = p.id;
    mid.appendChild(rm);

    const right = el('div');
    const q = el('div', 'qty');
    const minus = el('button', null, '−');
    const plus = el('button', null, '+');
    minus.type = plus.type = 'button';

    minus.dataset.dec = p.id;
    plus.dataset.inc = p.id;

    minus.setAttribute('aria-label', 'Decrease quantity of ' + p.name);
    plus.setAttribute('aria-label', 'Increase quantity of ' + p.name);

    q.append(minus, el('span', null, String(i.qty)), plus);
    right.append(q, el('div', 'price', inr(p.price * i.qty)));
    row.append(th, mid, right);

    return row;
  }));

  fillSummary('#sum', t);
}

function fillSummary(sel, t) {
  const s = $(sel);
  if (!s) return;

  s.querySelector('[data-sub]').textContent = inr(t.sub);
  s.querySelector('[data-ship]').textContent = t.ship ? inr(t.ship) : 'Free';
  s.querySelector('[data-total]').textContent = inr(t.total);
}

function renderWishlist() {
  const g = $('#wish-grid');
  if (!g) return;

  const w = getWish();
  $('#wish-empty').hidden = w.length > 0;
  $('#wish-actions').hidden = w.length === 0;

  g.replaceChildren(...w.map(id => {
    const c = productCard(byId(id));
    const mv = el('button', 'link-btn', 'Move to cart');
    mv.type = 'button';
    mv.dataset.move = id;
    $('.pbody', c).appendChild(mv);
    return c;
  }));
}

/* ========== 8. FORMS ========== */
const RE = {
  email:/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  phone:/^(?:\+91[\s-]?)?[6-9]\d{9}$/,
  pin:/^[1-9]\d{5}$/
};

function setErr(input, msg) {
  const holder = document.getElementById(input.id + '-err');
  if (!holder) return !msg;

  holder.textContent = msg || '';

  if (msg) input.setAttribute('aria-invalid', 'true');
  else input.removeAttribute('aria-invalid');

  return !msg;
}

function checkField(input) {
  const v = input.value.trim(), n = input.dataset.v || '';
  let m = '';

  if (input.required && !v) m = 'This field is required.';
  else if (v && n === 'email' && !RE.email.test(v)) m = 'Enter a valid email address.';
  else if (v && n === 'phone' && !RE.phone.test(v.replace(/\s+/g, ' '))) m = 'Enter a valid 10-digit Indian mobile number.';
  else if (v && n === 'pin' && !RE.pin.test(v)) m = 'Enter a valid 6-digit PIN code.';
  else if (v && n === 'newpw' && !(input.value.length >= 8 && /[A-Za-z]/.test(input.value) && /\d/.test(input.value))) m = 'Use at least 8 characters with a letter and a number.';
  else if (v && n === 'confirm' && input.value !== $('#' + input.dataset.match).value) m = 'Passwords do not match.';
  else if (v && n === 'msg' && v.length < 10) m = 'Please write at least 10 characters.';

  return setErr(input, m);
}

function validateForm(form) {
  let first = null;

  $$('input,select,textarea', form).forEach(i => {
    if (!checkField(i) && !first) first = i;
  });

  if (first) first.focus();
  return !first;
}

function bindForm(id, onValid) {
  const f = document.getElementById(id);
  if (!f) return;

  f.noValidate = true;

  f.addEventListener('focusout', e => {
    if (e.target.matches('input,select,textarea') && e.target.value) checkField(e.target);
  });

  f.addEventListener('submit', e => {
    e.preventDefault();
    if (validateForm(f)) onValid(f);
  });
}

function msg(box, type, text) {
  box.className = 'form-msg ' + type;
  box.textContent = text;
}

function initAuthPages() {
  $$('[data-toggle-pw]').forEach(b => b.addEventListener('click', () => {
    const i = document.getElementById(b.dataset.togglePw);
    const show = i.type === 'password';
    i.type = show ? 'text' : 'password';
    b.textContent = show ? 'Hide' : 'Show';
    b.setAttribute('aria-pressed', String(show));
  }));

  const params = new URLSearchParams(location.search);
  const next = safeNext(params.get('next'));

  const reason = $('#login-reason');

  if (reason && params.get('reason')) {
    reason.textContent = 'Please log in to use: ' + params.get('reason') + '. You will return to ' + next + '.';
    reason.hidden = false;
  }

  const link = $('#to-signup');
  if (link && params.get('next')) link.href = 'signup.html?next=' + encodeURIComponent(next);

  bindForm('signup-form', f => {
    const box = $('#form-msg');
    const email = f.email.value.trim().toLowerCase();

    if (!register(f.fullname.value.trim(), email, f.password.value)) {
      return msg(box, 'bad', 'That email already has a demo account. Please log in instead.');
    }

    login(email, f.password.value);
    sessionStorage.setItem('bae_flash', 'Demo account created. Welcome!');
    msg(box, 'ok', 'Demo account created. Redirecting…');
    setTimeout(() => location.href = next, 700);
  });

  bindForm('login-form', f => {
    const box = $('#form-msg');

    if (!login(f.email.value.trim().toLowerCase(), f.password.value)) {
      return msg(box, 'bad', "We couldn't match that email and password. Check your details, or create a demo account first.");
    }

    sessionStorage.setItem('bae_flash', 'Logged in (demo). Welcome back!');
    msg(box, 'ok', 'Logged in. Redirecting…');
    setTimeout(() => location.href = next, 500);
  });
}
function initCheckout() {
  const form = $('#checkout-form');
  if (!form) return;

  const t = totals();
  const s = getSession();

  if (s) {
    form.cname.value = s.name;
    form.email.value = s.email;
  }

  const items = $('#co-items');

  if (t.cart.length === 0) {
    $('#co-wrap').hidden = true;
    $('#co-empty').hidden = false;
    return;
  }

  items.replaceChildren(...t.cart.map(i => {
    const p = byId(i.id);
    const r = el('div', 'row');
    r.append(
      el('span', null, p.name + ' × ' + i.qty),
      el('span', null, inr(p.price * i.qty))
    );
    return r;
  }));

  fillSummary('#co-sum', t);

  bindForm('checkout-form', f => {
    const ref = 'BAE-DEMO-' +
      Date.now().toString(36).toUpperCase().slice(-6) +
      Math.floor(Math.random() * 90 + 10);

    const fin = totals();

    $('#co-wrap').hidden = true;
    const c = $('#co-confirm');
    c.hidden = false;

    $('#c-ref').textContent = ref;
    $('#c-name').textContent = f.cname.value.trim();
    $('#c-total').textContent = inr(fin.total);

    save(KEYS.cart, []);
    updateCounts();

    c.scrollIntoView({ behavior:'smooth' });
    c.querySelector('h2').focus();
  });
}

function initContact() {
  bindForm('contact-form', f => {
    msg(
      $('#form-msg'),
      'ok',
      'Thank you, ' + f.cname.value.trim() +
      '. This is a demo form, so no message has actually been sent.'
    );
    f.reset();
  });
}

/* ========== 9. GLOBAL EVENTS (delegated, bound once) ========== */
function bindGlobal() {
  document.addEventListener('click', e => {
    const t = e.target;

    const add = t.closest('[data-add]');
    if (add) {
      addToCart(add.dataset.add);
      renderCart();
      return;
    }

    const heart = t.closest('.heart');
    if (heart) {
      toggleWish(heart.dataset.id);
      return;
    }

    const det = t.closest('[data-detail]');
    if (det) {
      openModal(det.dataset.detail);
      return;
    }

    const inc = t.closest('[data-inc]');
    if (inc) {
      const i = getCart().find(x => x.id === inc.dataset.inc);
      setQty(inc.dataset.inc, Math.min(i.qty + 1, 10));
      return;
    }

    const dec = t.closest('[data-dec]');
    if (dec) {
      const i = getCart().find(x => x.id === dec.dataset.dec);
      setQty(dec.dataset.dec, i.qty - 1);
      return;
    }

    const rm = t.closest('[data-remove]');
    if (rm) {
      setQty(rm.dataset.remove, 0);
      toast('Item removed');
      return;
    }

    const mv = t.closest('[data-move]');
    if (mv) {
      addToCart(mv.dataset.move);
      toggleWish(mv.dataset.move);
      return;
    }

    if (t.closest('[data-logout]')) {
      logout();
      return;
    }

    if (t.closest('#clear-cart')) {
      if (confirm('Remove all items from your cart?')) {
        save(KEYS.cart, []);
        updateCounts();
        renderCart();
        toast('Cart cleared');
      }
      return;
    }

    if (t.closest('#save-wish')) {
      if (requireLogin('Save wishlist to my account')) {
        toast('Saved to your demo account (stored in this browser only).');
      }
      return;
    }

    const ab = t.closest('#acct-btn');
    const menu = $('#acct-menu');

    if (ab) {
      const open = menu.classList.toggle('open');
      ab.setAttribute('aria-expanded', String(open));
      return;
    }

    if (menu && !t.closest('.account')) {
      menu.classList.remove('open');
      $('#acct-btn').setAttribute('aria-expanded', 'false');
    }

    const bg = t.closest('#burger');

    if (bg) {
      const open = $('#nav-links').classList.toggle('open');
      bg.setAttribute('aria-expanded', String(open));
      bg.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal();
      const m = $('#acct-menu');
      if (m) m.classList.remove('open');
    }
  });

  window.addEventListener('storage', () => {
    updateCounts();
    renderCart();
    renderWishlist();
  });
}

/* ========== 10. INIT ========== */
document.addEventListener('DOMContentLoaded', () => {
  renderChrome();
  ensureModal();
  updateCounts();
  bindGlobal();

  renderFeatured();
  renderShop();
  renderCart();
  renderWishlist();

  initAuthPages();
  initCheckout();
  initContact();
});

})();
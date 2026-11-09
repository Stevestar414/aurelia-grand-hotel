/**
 * Aurelia Grand Hotel — Frontend Application
 * Connects to the Express REST API with graceful fallback so the app also works
 * if opened directly via static hosting.
 */

const FALLBACK_ROOMS = [
  {
    id: 1, name: 'Classic Atelier Room', price: 180, type: 'standard', size: '34 m²', capacity: 2, bed: '1 Queen Bed', view: 'Courtyard View',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=80',
    desc: 'Quiet, proportioned quarters overlooking the inner limestone courtyard, featuring custom walnut millwork and rainfall marble showers.',
    amenities: ['Courtyard View', 'Rain Shower', 'Nespresso Bar', 'High-Speed Wi-Fi']
  },
  {
    id: 2, name: 'Deluxe Boulevard King', price: 260, type: 'deluxe', size: '46 m²', capacity: 3, bed: '1 King Bed', view: 'Old Town Boulevard',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
    desc: 'Floor-to-ceiling French windows opening onto a wrought-iron balcony, bespoke writing desk, and curated local minibar.',
    amenities: ['Private Balcony', 'King Bed', 'Artisan Minibar', 'Soaking Tub']
  },
  {
    id: 3, name: 'Executive Salon Suite', price: 420, type: 'suite', size: '68 m²', capacity: 4, bed: '1 King + Sofa Bed', view: 'Panoramic City',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
    desc: 'Separate parlor and dining salon with private Club Lounge access, complimentary pressing, and freestanding brass tub.',
    amenities: ['Living Salon', 'Lounge Access', 'Freestanding Tub', 'Chauffeur Drop-off']
  },
  {
    id: 4, name: 'The Aurelia Penthouse', price: 780, type: 'suite', size: '140 m²', capacity: 6, bed: '2 King Beds', view: '360° Skyline',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80',
    desc: 'Crowning the top floor with a wrap-around landscaped terrace, private elevator key, fireplace, and 24-hour dedicated butler.',
    amenities: ['Private Terrace', '24h Butler', 'Private Dining', 'Airport Limousine']
  },
  {
    id: 5, name: 'Botanical Junior Suite', price: 310, type: 'suite', size: '54 m²', capacity: 3, bed: '1 King Bed', view: 'Private Conservatory',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80',
    desc: 'Direct access to the quiet winter garden, plush velvet seating alcove, and heated travertine bathroom floors.',
    amenities: ['Garden Terrace', 'Heated Floors', 'King Bed', 'Spa Pass']
  },
  {
    id: 6, name: 'Superior Twin Residence', price: 195, type: 'standard', size: '38 m²', capacity: 2, bed: '2 Twin Beds', view: 'Historic Quarter',
    image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1000&q=80',
    desc: 'Tailored for colleagues or companions traveling together, offering generous wardrobe space and ergonomic workspace.',
    amenities: ['Twin Beds', 'Work Desk', 'Rain Shower', 'Pillow Menu']
  }
];

const FACILITIES = [
  { icon: '✦', name: 'Rooftop Thermal Pool', text: 'Heated 25-meter infinity pool overlooking the Old Town spires, open 6:00 AM to 11:00 PM.' },
  { icon: '✦', name: "L'Orangerie Restaurant", text: 'Michelin-recognized tasting menus celebrating regional harvests and rare cellar vintages.' },
  { icon: '✦', name: 'Subterranean Bathhouse', text: 'Finnish cedar saunas, eucalyptus steam rooms, and private stone hydrotherapy suites.' },
  { icon: '✦', name: '24-Hour Atelier Gym', text: 'Equipped with Technogym Artis line, free weights, and on-demand personal physiotherapists.' },
  { icon: '✦', name: 'Chauffeur & Valet Fleet', text: 'Private airport meet-and-greet and house car service within the city center.' },
  { icon: '✦', name: 'The Velvet Library', text: 'Residents-only drawing room serving afternoon tea, rare cognacs, and vinyl acoustics.' }
];

const GALLERY = [
  { label: 'Grand Neoclassical Facade', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Executive Salon Suite', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80' },
  { label: "L'Orangerie Dining Room", image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Thermal Hydrotherapy Pool', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80' },
  { label: 'The Marble Lobby', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Penthouse Terrace View', image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80' }
];

const STATS = [
  [5, '★', 'Forbes & Michelin Rated'],
  [98, ' yrs', 'Heritage Since 1928'],
  [24, '/7', 'Dedicated Butler Desk'],
  [6, '', 'Signature Suite Classes']
];

const REVIEWS = [
  { text: '“The staff remembered how we took our coffee by the second morning. Quiet, effortless perfection.”', who: 'AMIRA V., LONDON' },
  { text: '“The subterranean thermal spa rivals the finest bathhouses in Switzerland. We extended our stay twice.”', who: 'DR. DANIEL K., ZURICH' },
  { text: '“From the Maybach waiting at arrivals to the turndown linen, every detail felt deliberate.”', who: 'KENJI T., TOKYO' }
];

const ERAS = [
  {
    tab: '1928 · The Grand Opening',
    title: 'Designed by Emiliano Bellini',
    body: 'Commissioned as a private residence for visiting diplomats and opera patrons, Aurelia Grand debuted with 40 suites, hand-carved limestone balustrades, and the city’s first hydraulic passenger lift.'
  },
  {
    tab: '1964 · The Golden Salon Era',
    title: 'A Haven for Literature & Cinema',
    body: 'Throughout the mid-century, the Velvet Library hosted European playwrights and conductors. The rooftop conservatory was enclosed in wrought iron and glass to form L’Orangerie.'
  },
  {
    tab: '2024 · Contemporary Restoration',
    title: 'Sustainable Craft & Acoustic Silence',
    body: 'A four-year architectural renewal introduced geothermal heating, triple-glazed heritage windows, and a subterranean limestone thermal bathhouse while preserving every original ceiling fresco.'
  }
];

// ---------- STATE & HELPERS ----------
const $ = (id) => document.getElementById(id);
const money = (n) => '$' + Number(n).toLocaleString('en-US');
const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

let roomsInventory = [...FALLBACK_ROOMS];
const favs = new Set(JSON.parse(localStorage.getItem('aurelia_favs') || '[]'));
let lastConfirmedBooking = null;

function saveFavs() {
  localStorage.setItem('aurelia_favs', JSON.stringify([...favs]));
  if ($('favCount')) $('favCount').innerHTML = `&#9829; Shortlist (${favs.size})`;
}

let toastTimer;
function toast(msg) {
  $('toast').textContent = msg;
  $('toast').classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('toast').classList.remove('show'), 2600);
}

function nightsBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

function params() {
  const q = location.hash.includes('?') ? '?' + location.hash.split('?')[1] : location.search;
  return new URLSearchParams(q);
}

function go(page, query = '') {
  location.hash = page + query;
}

// ---------- API CLIENT ----------
async function fetchRooms() {
  try {
    const res = await fetch('/api/rooms');
    if (!res.ok) throw new Error('API offline');
    const json = await res.json();
    roomsInventory = json.data;
  } catch {
    roomsInventory = [...FALLBACK_ROOMS];
  }
  populateRoomSelect();
  applyRoomsFilter();
}

// ---------- NAVIGATION ----------
$('burger').addEventListener('click', () => {
  const open = $('menu').classList.toggle('open');
  $('burger').setAttribute('aria-expanded', open);
});
$('menu').addEventListener('click', () => $('menu').classList.remove('open'));

function currentPage() {
  return location.hash.slice(1).split('?')[0] || 'index';
}

// ---------- ROOMS RENDER & FILTER ----------
const viewState = { filter: 'all', query: '', sort: 'default' };

function renderRooms(list) {
  if (!$('roomGrid')) return;
  $('roomGrid').innerHTML = list.length
    ? list.map(r => `
      <article class="card">
        <div class="photo" style="background-image:url('${r.image}')">
          <span class="room-badge">${r.size} &middot; ${r.view}</span>
          <button class="heart${favs.has(r.id) ? ' on' : ''}" data-id="${r.id}" aria-label="Save ${r.name}">&#9829;</button>
        </div>
        <div class="card-body">
          <div class="card-meta">
            <span>🛏 ${r.bed}</span>
            <span>👤 Up to ${r.capacity} guests</span>
          </div>
          <h3>${r.name}</h3>
          <p>${r.desc}</p>
          <div class="amen-list">
            ${r.amenities.map(a => `<span class="amen-tag">${a}</span>`).join('')}
          </div>
          <div class="card-footer">
            <div class="price">${money(r.price)} <small>/ night</small></div>
            <button class="btn book-btn" data-id="${r.id}">Reserve</button>
          </div>
        </div>
      </article>`).join('')
    : '<p>No suites match your filter criteria.</p>';
}

function applyRoomsFilter() {
  let list = roomsInventory
    .filter(r => {
      if (viewState.filter === 'all') return true;
      if (viewState.filter === 'under250') return r.price <= 250;
      return r.type === viewState.filter;
    })
    .filter(r => {
      const q = viewState.query.toLowerCase();
      return r.name.toLowerCase().includes(q) ||
             r.desc.toLowerCase().includes(q) ||
             r.amenities.some(a => a.toLowerCase().includes(q));
    });

  if (viewState.sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
  if (viewState.sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
  renderRooms(list);
}

if ($('filters')) {
  $('filters').addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    document.querySelectorAll('#filters .chip').forEach(c => c.classList.toggle('active', c === btn));
    viewState.filter = btn.dataset.filter;
    applyRoomsFilter();
  });
  $('roomSearch').addEventListener('input', (e) => { viewState.query = e.target.value.trim(); applyRoomsFilter(); });
  $('roomSort').addEventListener('change', (e) => { viewState.sort = e.target.value; applyRoomsFilter(); });

  $('roomGrid').addEventListener('click', (e) => {
    const heart = e.target.closest('.heart');
    const book = e.target.closest('.book-btn');
    if (heart) {
      const id = Number(heart.dataset.id);
      favs.has(id) ? favs.delete(id) : favs.add(id);
      heart.classList.toggle('on', favs.has(id));
      saveFavs();
      toast(favs.has(id) ? 'Added to shortlist' : 'Removed from shortlist');
    }
    if (book) go('booking', '?room=' + book.dataset.id);
  });
}

// ---------- QUICK SEARCH BAR (HOME) ----------
if ($('quickSearchForm')) {
  $('qCheckin').min = today;
  $('qCheckin').value = today;
  $('qCheckout').min = tomorrow;
  $('qCheckout').value = tomorrow;

  $('quickSearchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    go('booking', `?in=${$('qCheckin').value}&out=${$('qCheckout').value}&adults=${$('qGuests').value}`);
  });
}

// ---------- BOOKING ENGINE ----------
function populateRoomSelect() {
  if (!$('roomSelect')) return;
  $('roomSelect').innerHTML = roomsInventory
    .map(r => `<option value="${r.id}">${r.name} — ${money(r.price)}/night (Max ${r.capacity})</option>`)
    .join('');
}

async function updateLiveQuote() {
  if (!$('bookingForm')) return;
  const inD = $('checkin').value;
  const outD = $('checkout').value;
  const roomId = Number($('roomSelect').value);
  const adults = Number($('adults').value);
  const children = Number($('children').value);

  const room = roomsInventory.find(r => r.id === roomId) || roomsInventory[0];
  const n = (inD && outD) ? nightsBetween(inD, outD) : 0;

  if (n <= 0) {
    $('livePrice').innerHTML = `<p>Please select a valid check-in and check-out range.</p>`;
    return;
  }

  const subtotal = n * room.price;
  const tax = Math.round(subtotal * 0.12);
  const serviceFee = n * 25;
  const total = subtotal + tax + serviceFee;

  $('livePrice').innerHTML = `
    <p style="margin-bottom:0.8rem;color:#cbd4e3"><strong>${room.name}</strong><br>${room.size} &middot; ${room.bed}</p>
    <div class="quote-line"><span>${money(room.price)} &times; ${n} night${n > 1 ? 's' : ''}</span><span>${money(subtotal)}</span></div>
    <div class="quote-line"><span>Hospitality VAT (12%)</span><span>${money(tax)}</span></div>
    <div class="quote-line"><span>Thermal Spa &amp; Resort Fee ($25/nt)</span><span>${money(serviceFee)}</span></div>
    <div class="quote-total"><span>Total Stay</span><span>${money(total)}</span></div>
  `;
}

if ($('bookingForm')) {
  $('checkin').min = today;
  $('checkin').value = today;
  $('checkout').min = tomorrow;
  $('checkout').value = tomorrow;

  $('checkin').addEventListener('change', () => {
    $('checkout').min = $('checkin').value || today;
    updateLiveQuote();
  });
  ['checkout', 'roomSelect', 'adults', 'children'].forEach(id => $(id).addEventListener('change', updateLiveQuote));

  $('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = $('bookingError');
    err.textContent = '';

    const payload = {
      roomId: Number($('roomSelect').value),
      checkIn: $('checkin').value,
      checkOut: $('checkout').value,
      adults: Number($('adults').value),
      children: Number($('children').value),
      guestName: $('guestName').value.trim(),
      guestEmail: $('guestEmail').value.trim(),
      specialRequests: $('specialRequests').value.trim()
    };

    const room = roomsInventory.find(r => r.id === payload.roomId);
    const nights = nightsBetween(payload.checkIn, payload.checkOut);

    if (!payload.checkIn || !payload.checkOut || nights < 1) {
      return (err.textContent = 'Check-out date must be at least 1 night after check-in.');
    }
    if (payload.adults + payload.children > room.capacity) {
      return (err.textContent = `${room.name} accommodates up to ${room.capacity} guests.`);
    }
    if (!payload.guestName) {
      return (err.textContent = 'Please enter the primary guest full name.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.guestEmail)) {
      return (err.textContent = 'Please provide a valid email address for your voucher.');
    }

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Booking failed');
      lastConfirmedBooking = json.data;
    } catch (apiErr) {
      // Fallback local persistence if running without Node backend
      const subtotal = nights * room.price;
      const tax = Math.round(subtotal * 0.12);
      const serviceFee = nights * 25;
      lastConfirmedBooking = {
        reference: 'AG-' + Math.random().toString(16).slice(2, 8).toUpperCase(),
        roomName: room.name,
        checkIn: payload.checkIn,
        checkOut: payload.checkOut,
        nights,
        adults: payload.adults,
        children: payload.children,
        guestName: payload.guestName,
        guestEmail: payload.guestEmail,
        specialRequests: payload.specialRequests,
        pricing: { subtotal, tax, serviceFee, total: subtotal + tax + serviceFee },
        status: 'CONFIRMED'
      };
      const localBookings = JSON.parse(localStorage.getItem('aurelia_bookings') || '[]');
      localBookings.push(lastConfirmedBooking);
      localStorage.setItem('aurelia_bookings', JSON.stringify(localBookings));
    }

    toast('Reservation confirmed!');
    go('confirmation', `?ref=${lastConfirmedBooking.reference}`);
  });
}

// ---------- CONFIRMATION & LOOKUP ----------
function renderVoucherCard(b) {
  return `
    <div class="confirm-card">
      <span class="eyebrow">STATUS: ${b.status}</span>
      <h2>${b.roomName}</h2>
      <div class="ref-pill">${b.reference}</div>
      <p><strong>Primary Guest:</strong> ${b.guestName} (${b.guestEmail})</p>
      <p><strong>Check-in:</strong> ${b.checkIn} (from 15:00) &middot; <strong>Check-out:</strong> ${b.checkOut} (until 12:00)</p>
      <p><strong>Occupancy:</strong> ${b.adults} Adult(s), ${b.children} Child(ren) &middot; ${b.nights} Night(s)</p>
      ${b.specialRequests ? `<p><strong>Notes:</strong> ${b.specialRequests}</p>` : ''}
      <hr style="margin:1.2rem 0;border:0;border-top:1px solid #ddd">
      <p><strong>Total Guaranteed Rate:</strong> <span style="font-size:1.4rem;color:var(--gold-d)">${money(b.pricing.total)}</span> (incl. VAT &amp; Thermal Spa access)</p>
      <div style="margin-top:1.5rem;display:flex;gap:1rem;flex-wrap:wrap">
        <button class="btn" onclick="window.print()">Print Voucher</button>
        <a class="btn btn-outline" style="color:var(--navy)" href="#index">Return Home</a>
      </div>
    </div>
  `;
}

async function renderConfirmation() {
  if (!$('confirmBox')) return;
  const ref = params().get('ref');
  if (lastConfirmedBooking && (!ref || lastConfirmedBooking.reference === ref)) {
    $('confirmBox').innerHTML = renderVoucherCard(lastConfirmedBooking);
    return;
  }
  if (ref) {
    const booking = await findBookingByRef(ref);
    if (booking) {
      $('confirmBox').innerHTML = renderVoucherCard(booking);
      return;
    }
  }
  $('confirmBox').innerHTML = `<p>No active reservation selected. <a class="btn" href="#booking">Book a Suite</a></p>`;
}

async function findBookingByRef(ref) {
  try {
    const res = await fetch(`/api/bookings/${encodeURIComponent(ref)}`);
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch { /* fallback to localStorage */ }
  const local = JSON.parse(localStorage.getItem('aurelia_bookings') || '[]');
  return local.find(b => b.reference.toUpperCase() === ref.toUpperCase()) || null;
}

if ($('lookupForm')) {
  $('lookupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const ref = $('lookupRef').value.trim();
    $('lookupError').textContent = '';
    $('lookupResult').innerHTML = '';

    const booking = await findBookingByRef(ref);
    if (!booking) {
      $('lookupError').textContent = `No reservation found with reference "${ref}".`;
      return;
    }
    $('lookupResult').innerHTML = renderVoucherCard(booking);
  });
}

// ---------- STATIC SECTIONS RENDER ----------
if ($('facilityGrid')) {
  $('facilityGrid').innerHTML = FACILITIES.map(f =>
    `<div class="fac"><span class="icon">${f.icon}</span><h3>${f.name}</h3><p>${f.text}</p></div>`
  ).join('');
}

if ($('stats')) {
  $('stats').innerHTML = STATS.map(s =>
    `<div class="stat"><b>${s[0]}${s[1]}</b><span>${s[2]}</span></div>`
  ).join('');
}

if ($('galleryGrid')) {
  $('galleryGrid').innerHTML = GALLERY.map(g =>
    `<button class="gal" style="background-image:url('${g.image}')" data-img="${g.image}" data-label="${g.label}">
      <span>${g.label}</span>
    </button>`
  ).join('');

  $('galleryGrid').addEventListener('click', (e) => {
    const g = e.target.closest('.gal');
    if (!g) return;
    $('lbImg').src = g.dataset.img;
    $('lbText').textContent = g.dataset.label;
    $('lightbox').hidden = false;
  });
}
$('lightbox').addEventListener('click', () => { $('lightbox').hidden = true; });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') $('lightbox').hidden = true; });

if ($('eraTabs')) {
  const showEra = (i) => {
    $('eraTabs').innerHTML = ERAS.map((era, k) =>
      `<button class="chip${k === i ? ' active' : ''}" role="tab" data-i="${k}">${era.tab}</button>`
    ).join('');
    $('eraBody').innerHTML = `<h3>${ERAS[i].title}</h3><p style="margin-top:0.5rem">${ERAS[i].body}</p>`;
  };
  $('eraTabs').addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (b) showEra(Number(b.dataset.i));
  });
  showEra(0);
}

// ---------- CONTACT FORM ----------
if ($('contactForm')) {
  $('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = $('cName').value.trim();
    const email = $('cEmail').value.trim();
    const subject = $('cSubject').value;
    const message = $('cMsg').value.trim();

    $('contactError').textContent = '';
    $('contactOk').textContent = '';

    if (!name) return ($('contactError').textContent = 'Please enter your name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return ($('contactError').textContent = 'Please enter a valid email.');
    if (message.length < 10) return ($('contactError').textContent = 'Please write at least 10 characters.');

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });
    } catch { /* silent fallback */ }

    $('contactOk').textContent = `Thank you, ${name}. Our ${subject} desk will respond shortly.`;
    e.target.reset();
    toast('Inquiry sent to Concierge');
  });
}

// ---------- ROTATOR & REVIEWS ----------
if ($('rotator')) {
  const words = ['Suites', 'Thermal Spa', 'Fine Gastronomy', 'Penthouse'];
  let w = 0;
  setInterval(() => { w = (w + 1) % words.length; $('rotator').textContent = words[w]; }, 2600);
}

if ($('review')) {
  let rv = 0;
  const showReview = (step = 0) => {
    rv = (rv + step + REVIEWS.length) % REVIEWS.length;
    $('review').innerHTML = `${REVIEWS[rv].text}<cite>&mdash; ${REVIEWS[rv].who}</cite>`;
  };
  $('prevRev').addEventListener('click', () => showReview(-1));
  $('nextRev').addEventListener('click', () => showReview(1));
  setInterval(() => showReview(1), 6500);
  showReview();
}

// ---------- ROUTER ----------
function route() {
  const name = currentPage();
  const page = $('page-' + name) ? name : 'index';
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === 'page-' + page));
  document.querySelectorAll('#menu a').forEach(a => a.classList.toggle('active', a.dataset.page === page));
  window.scrollTo(0, 0);

  const p = params();
  if ($('roomSelect') && p.get('room')) $('roomSelect').value = p.get('room');
  if ($('checkin') && p.get('in')) $('checkin').value = p.get('in');
  if ($('checkout') && p.get('out')) $('checkout').value = p.get('out');
  if ($('adults') && p.get('adults')) $('adults').value = p.get('adults');

  updateLiveQuote();
  if (page === 'confirmation') renderConfirmation();
}

window.addEventListener('hashchange', route);
saveFavs();
fetchRooms().then(route);
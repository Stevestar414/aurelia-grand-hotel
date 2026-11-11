const rooms = [
  { id: 1, name: 'Classic Atelier Room', price: 120, type: 'standard', image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80',
    desc: 'A calm room with a queen bed and courtyard views.', amenities: ['Queen bed', 'High-Speed Wi-Fi', 'Rain shower'] },
  { id: 2, name: 'Deluxe Boulevard Room', price: 175, type: 'deluxe', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80',
    desc: 'More space, a bespoke work desk and a private wrought-iron balcony.', amenities: ['King bed', 'Balcony', 'Artisan Minibar'] },
  { id: 3, name: 'Executive Salon Suite', price: 260, type: 'suite', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
    desc: 'Separate living parlor with private club lounge access.', amenities: ['Living room', 'Lounge access', 'Soaking tub'] },
  { id: 4, name: 'Presidential Penthouse', price: 420, type: 'suite', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80',
    desc: 'Our top floor residence with panoramic Old Town terrace.', amenities: ['Private Terrace', '24h Butler', 'Dining area'] }
];

const facilities = [
  { icon: '🏊', name: 'Rooftop Pool', text: 'Heated infinity pool overlooking the city, open daily.' },
  { icon: '🍽️', name: 'Fine Dining', text: 'Seasonal tasting menus and curated cellar wine list.' },
  { icon: '💆', name: 'Thermal Spa', text: 'Massage, cedarwood sauna and eucalyptus steam rooms.' },
  { icon: '🏋️', name: 'Fitness Studio', text: 'Open 24 hours with personal trainers on request.' },
  { icon: '📶', name: 'High-Speed Wi-Fi', text: 'Fast, encrypted fiber connection throughout the property.' },
  { icon: '🚗', name: 'Chauffeur Transfer', text: 'Private luxury sedan, arranged with your reservation.' }
];

const gallery = [
  { label: 'Deluxe Room', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80' },
  { label: 'Restaurant', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80' },
  { label: 'Thermal Spa', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80' },
  { label: 'Grand Lobby', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80' },
  { label: 'Rooftop Pool', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=900&q=80' },
  { label: 'Heritage Facade', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80' }
];

const stats = [[5, '★', 'Rated service'], [120, '', 'Rooms & suites'], [24, 'h', 'Concierge'], [98, 'y', 'Heritage']];

const lessons = [
  { tab: 'Frontend Layer', page: 'booking', see: 'See the booking form',
    points: ['Semantic HTML5 structure with accessible ARIA attributes', 'CSS custom variables for the navy & gold palette', 'ES6 modules fetching live data from localhost:3000'] },
  { tab: 'Express API Layer', page: 'index', see: 'See live guestbook',
    points: ['Node.js + Express 5 server listening on port 3000', 'Custom CORS middleware handling OPTIONS preflight requests', 'Protected /api/admin routes using X-Admin-Key from .env'] },
  { tab: 'SQLite Database', page: 'rooms', see: 'Explore rooms',
    points: ['Built-in node:sqlite DatabaseSync persistent file storage', 'CHECK constraints enforcing author & message lengths', 'Prepared statements with ? placeholders preventing SQL injection'] }
];

const $ = (id) => document.getElementById(id);
const money = (n) => '$' + n.toLocaleString('en-US');
const bg = (src) => `style="--img:url('${src}')"`;
const favs = new Set();
const SPA = !!$('page-index');

function go(page, query = '') {
  if (SPA) location.hash = page + query; else location.href = page + '.html' + query;
}
function params() {
  const s = location.search || (location.hash.includes('?') ? '?' + location.hash.split('?')[1] : '');
  return new URLSearchParams(s);
}
const nightsBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);
const today = new Date().toISOString().split('T')[0];

let toastTimer;
function toast(msg) {
  $('toast').textContent = msg;
  $('toast').classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('toast').classList.remove('show'), 2200);
}

$('burger').addEventListener('click', () => {
  const open = $('menu').classList.toggle('open');
  $('burger').setAttribute('aria-expanded', open);
});
$('menu').addEventListener('click', () => $('menu').classList.remove('open'));

function currentPage() {
  return SPA ? (location.hash.slice(1).split('?')[0] || 'index') : document.body.dataset.page;
}
function markActiveLink() {
  document.querySelectorAll('#menu a[data-page]').forEach(a => a.classList.toggle('active', a.dataset.page === currentPage()));
}

function renderRooms(list) {
  $('roomGrid').innerHTML = list.length
    ? list.map(r => `
      <article class="card">
        <div class="photo" ${bg(r.image)}><button class="heart${favs.has(r.id) ? ' on' : ''}" data-id="${r.id}" aria-label="Save ${r.name}">&#9829;</button></div>
        <div class="card-body">
          <h3>${r.name}</h3>
          <p>${r.desc}</p>
          <p class="amen">${r.amenities.join(' · ')}</p>
          <p class="price">${money(r.price)} <small>/ night</small></p>
          <button class="btn book-btn" data-id="${r.id}">Book this room</button>
        </div>
      </article>`).join('')
    : '<p class="empty">No rooms match. Choose "All rooms" to see everything.</p>';
}

if ($('roomGrid')) {
  const view = { filter: 'all', query: '', sort: 'default' };
  const applyRooms = () => {
    let list = rooms
      .filter(r => view.filter === 'all' ? true : view.filter === 'under200' ? r.price < 200 : r.type === view.filter)
      .filter(r => r.name.toLowerCase().includes(view.query.toLowerCase()));
    if (view.sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
    if (view.sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
    renderRooms(list);
  };
  $('filters').addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    document.querySelectorAll('#filters .chip').forEach(c => c.classList.toggle('active', c === btn));
    view.filter = btn.dataset.filter;
    applyRooms();
  });
  $('roomSearch').addEventListener('input', (e) => { view.query = e.target.value.trim(); applyRooms(); });
  $('roomSort').addEventListener('change', (e) => { view.sort = e.target.value; applyRooms(); });

  $('roomGrid').addEventListener('click', (e) => {
    const heart = e.target.closest('.heart'), book = e.target.closest('.book-btn');
    if (heart) {
      const id = +heart.dataset.id;
      favs.has(id) ? favs.delete(id) : favs.add(id);
      heart.classList.toggle('on', favs.has(id));
      $('favCount').textContent = 'Saved: ' + favs.size;
      toast(favs.has(id) ? 'Room saved' : 'Room removed');
    }
    if (book) go('booking', '?room=' + book.dataset.id);
  });
  renderRooms(rooms);
}

if ($('facilityGrid')) $('facilityGrid').innerHTML = facilities.map(f =>
  `<div class="fac"><span class="icon">${f.icon}</span><h3>${f.name}</h3><p>${f.text}</p></div>`).join('');
if ($('stats')) $('stats').innerHTML = stats.map(s =>
  `<div class="stat"><b>${s[0]}${s[1]}</b>${s[2]}</div>`).join('');
if ($('galleryGrid')) {
  $('galleryGrid').innerHTML = gallery.map(g => `<button class="gal" ${bg(g.image)} data-label="${g.label}">${g.label}</button>`).join('');
  $('galleryGrid').addEventListener('click', (e) => {
    const g = e.target.closest('.gal');
    if (!g) return;
    $('lbText').textContent = g.dataset.label;
    $('lightbox').hidden = false;
  });
}
$('lightbox').addEventListener('click', () => { $('lightbox').hidden = true; });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') $('lightbox').hidden = true; });
if ($('home')) $('home').setAttribute('style', `--img:url('${$('home').dataset.img}')`);

if ($('bookingForm')) {
  $('roomSelect').innerHTML = rooms.map(r => `<option value="${r.id}">${r.name} (${money(r.price)})</option>`).join('');
  $('checkin').min = today; $('checkout').min = today;
  $('checkin').addEventListener('change', () => { $('checkout').min = $('checkin').value || today; });

  const updateLive = () => {
    const room = rooms.find(r => r.id === +$('roomSelect').value);
    const n = $('checkin').value && $('checkout').value ? nightsBetween($('checkin').value, $('checkout').value) : 0;
    $('livePrice').textContent = n > 0
      ? `${room.name}: ${n} night${n > 1 ? 's' : ''} = ${money(n * room.price)}`
      : 'Pick your dates to see the price.';
  };
  ['checkin', 'checkout', 'roomSelect'].forEach(id => $(id).addEventListener('change', updateLive));

  $('bookingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const inD = $('checkin').value, outD = $('checkout').value;
    const adults = +$('adults').value, children = +$('children').value;
    const err = $('bookingError'), box = $('summary');
    err.textContent = ''; box.hidden = true;

    if (!inD || !outD) return err.textContent = 'Choose both a check-in and a check-out date.';
    if (inD < today) return err.textContent = 'Check-in cannot be in the past.';
    if (outD <= inD) return err.textContent = 'Check-out must be after check-in.';
    if (adults < 1) return err.textContent = 'At least one adult is required.';

    const room = rooms.find(r => r.id === +$('roomSelect').value);
    const nights = nightsBetween(inD, outD);
    box.innerHTML = `
      <p><strong>${room.name}</strong> is available.</p>
      <p>${inD} to ${outD}: ${nights} night${nights > 1 ? 's' : ''} × ${money(room.price)}</p>
      <p>Total: <strong>${money(nights * room.price)}</strong></p>
      <button class="btn" id="confirmBtn" type="button">Confirm booking</button>`;
    box.hidden = false;
    $('confirmBtn').addEventListener('click', async () => {
      const ref = 'AG-' + Math.floor(1000 + Math.random() * 9000);
      try {
        await fetch('http://localhost:3000/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reference: ref,
            roomName: room.name,
            checkIn: inD,
            checkOut: outD,
            nights: nights,
            adults: adults,
            children: children,
            totalPrice: nights * room.price
          })
        });
      } catch {
        // Continues to confirmation page even if backend is offline
      }
      go('confirmation', `?room=${room.id}&in=${inD}&out=${outD}&adults=${adults}&children=${children}&ref=${ref}`);
    });
  });
}

function applyRoomParam() {
  const id = params().get('room');
  if ($('roomSelect') && id && rooms.some(r => r.id === +id)) {
    $('roomSelect').value = id;
    $('roomSelect').dispatchEvent(new Event('change'));
  }
}

function renderConfirmation() {
  if (!$('confirmBox')) return;
  const p = params(), room = rooms.find(r => r.id === +p.get('room'));
  if (!room || !p.get('in') || !p.get('out')) {
    $('confirmBox').innerHTML = '<p>No booking found. <a class="btn" href="#booking">Start a booking</a></p>';
    return;
  }
  const n = nightsBetween(p.get('in'), p.get('out'));
  const ref = 'AG-' + (1000 + [...location.href].reduce((a, c) => a + c.charCodeAt(0), 0) % 9000);
  $('confirmBox').innerHTML = `
    <div class="confirm">
      <p>Thank you. Your stay is confirmed.</p>
      <p>Reference: <strong>${ref}</strong></p>
      <p>${room.name}, ${n} night${n > 1 ? 's' : ''} (${p.get('in')} to ${p.get('out')})</p>
      <p>Guests: ${p.get('adults')} adult(s), ${p.get('children')} child(ren)</p>
      <p>Total: <strong>${money(n * room.price)}</strong></p>
      <div class="actions"><a class="btn" href="#index">Back to home</a></div>
    </div>`;
}

if ($('contactForm')) $('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($('cEmail').value);
  [$('cName'), $('cEmail'), $('cMsg')].forEach(f => f.classList.remove('bad'));
  $('contactOk').textContent = '';
  if (!$('cName').value.trim()) { $('cName').classList.add('bad'); return $('contactError').textContent = 'Enter your name.'; }
  if (!emailOk) { $('cEmail').classList.add('bad'); return $('contactError').textContent = 'Enter a valid email address.'; }
  if ($('cMsg').value.trim().length < 10) { $('cMsg').classList.add('bad'); return $('contactError').textContent = 'Write a message of at least 10 characters.'; }
  $('contactError').textContent = '';
  $('contactOk').textContent = `Thank you, ${$('cName').value.trim()}. We will reply within one business day.`;
  e.target.reset();
});

if ($('rotator')) {
  const words = ['Rooms', 'Thermal Spa', 'Fine dining', 'Rooftop pool'];
  let w = 0;
  setInterval(() => { w = (w + 1) % words.length; $('rotator').textContent = words[w]; }, 2200);
}

if ($('lessonTabs')) {
  const showLesson = (i) => {
    $('lessonTabs').innerHTML = lessons.map((l, k) =>
      `<button class="chip${k === i ? ' active' : ''}" role="tab" data-i="${k}">${l.tab}</button>`).join('');
    const l = lessons[i];
    $('lessonBody').innerHTML = `<ul>${l.points.map(p => `<li>${p}</li>`).join('')}</ul>
      <a class="btn" href="#${l.page}">${l.see}</a>`;
  };
  $('lessonTabs').addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (b) showLesson(+b.dataset.i);
  });
  showLesson(0);
}

function route() {
  if (SPA) {
    const name = currentPage();
    const page = $('page-' + name) ? name : 'index';
    document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === 'page-' + page));
    window.scrollTo(0, 0);
  }
  markActiveLink();
  applyRoomParam();
  renderConfirmation();
}
window.addEventListener('hashchange', route);
route();
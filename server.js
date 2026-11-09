/**
 * Aurelia Grand Hotel — REST API Server
 * Handles room inventory, availability validation, reservations, and inquiries.
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

// Seed Room Inventory
const ROOMS = [
  {
    id: 1,
    slug: 'classic-atelier',
    name: 'Classic Atelier Room',
    price: 180,
    type: 'standard',
    size: '34 m²',
    capacity: 2,
    bed: '1 Queen Bed',
    view: 'Courtyard View',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=80',
    desc: 'Quiet, proportioned quarters overlooking the inner limestone courtyard, featuring custom walnut millwork and rainfall marble showers.',
    amenities: ['Courtyard View', 'Rain Shower', 'Nespresso Bar', 'High-Speed Wi-Fi', 'Soundproofed']
  },
  {
    id: 2,
    slug: 'deluxe-boulevard',
    name: 'Deluxe Boulevard King',
    price: 260,
    type: 'deluxe',
    size: '46 m²',
    capacity: 3,
    bed: '1 King Bed',
    view: 'Old Town Boulevard',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
    desc: 'Floor-to-ceiling French windows opening onto a wrought-iron balcony, bespoke writing desk, and curated local minibar.',
    amenities: ['Private Balcony', 'King Bed', 'Artisan Minibar', 'Soaking Tub', 'Evening Turndown']
  },
  {
    id: 3,
    slug: 'aurelia-executive-suite',
    name: 'Executive Salon Suite',
    price: 420,
    type: 'suite',
    size: '68 m²',
    capacity: 4,
    bed: '1 King + Sofa Bed',
    view: 'Panoramic City',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
    desc: 'Separate parlor and dining salon with private Club Lounge access, complimentary pressing, and freestanding brass tub.',
    amenities: ['Separate Living Room', 'Lounge Access', 'Freestanding Tub', 'Chauffeur Drop-off', 'Bose Audio']
  },
  {
    id: 4,
    slug: 'royal-penthouse',
    name: 'The Aurelia Penthouse',
    price: 780,
    type: 'suite',
    size: '140 m²',
    capacity: 6,
    bed: '2 King Beds',
    view: '360° Skyline & Cathedral',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80',
    desc: 'Crowning the top floor with a wrap-around landscaped terrace, private elevator key, fireplace, and 24-hour dedicated butler.',
    amenities: ['Private Terrace', '24h Butler', 'Private Dining for 8', 'Airport Limousine', 'Private Sauna']
  },
  {
    id: 5,
    slug: 'garden-junior-suite',
    name: 'Botanical Junior Suite',
    price: 310,
    type: 'suite',
    size: '54 m²',
    capacity: 3,
    bed: '1 King Bed',
    view: 'Private Conservatory',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80',
    desc: 'Direct access to the quiet winter garden, plush velvet seating alcove, and heated travertine bathroom floors.',
    amenities: ['Garden Terrace', 'Heated Floors', 'King Bed', 'Complimentary Breakfast', 'Spa Pass']
  },
  {
    id: 6,
    slug: 'superior-twin',
    name: 'Superior Twin Residence',
    price: 195,
    type: 'standard',
    size: '38 m²',
    capacity: 2,
    bed: '2 Twin Beds',
    view: 'Historic Quarter',
    image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1000&q=80',
    desc: 'Tailored for colleagues or companions traveling together, offering generous wardrobe space and ergonomic workspace.',
    amenities: ['Twin Beds', 'Work Desk', 'Rain Shower', 'Smart TV', 'Pillow Menu']
  }
];

// Helper functions for JSON persistence
function readJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return [];
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function nightsBetween(checkIn, checkOut) {
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}

// ---------- API ROUTES ----------

// GET /api/rooms — List rooms with optional filtering
app.get('/api/rooms', (req, res) => {
  let result = [...ROOMS];
  const { type, maxPrice, search, sort } = req.query;

  if (type && type !== 'all') {
    if (type === 'under250') result = result.filter(r => r.price <= 250);
    else result = result.filter(r => r.type === type);
  }
  if (maxPrice) {
    result = result.filter(r => r.price <= Number(maxPrice));
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      r => r.name.toLowerCase().includes(q) ||
           r.desc.toLowerCase().includes(q) ||
           r.amenities.some(a => a.toLowerCase().includes(q))
    );
  }
  if (sort === 'low') result.sort((a, b) => a.price - b.price);
  if (sort === 'high') result.sort((a, b) => b.price - a.price);

  res.json({ status: 'ok', count: result.length, data: result });
});

// POST /api/bookings/quote — Calculate itemized pricing and check availability
app.post('/api/bookings/quote', (req, res) => {
  const { roomId, checkIn, checkOut, adults = 2, children = 0 } = req.body;
  const room = ROOMS.find(r => r.id === Number(roomId));

  if (!room) return res.status(404).json({ error: 'Selected room does not exist.' });
  if (!checkIn || !checkOut) return res.status(400).json({ error: 'Check-in and check-out dates are required.' });

  const nights = nightsBetween(checkIn, checkOut);
  if (nights < 1) return res.status(400).json({ error: 'Check-out date must be after check-in date.' });
  if (Number(adults) + Number(children) > room.capacity) {
    return res.status(400).json({ error: `${room.name} accommodates up to ${room.capacity} guests.` });
  }

  const subtotal = nights * room.price;
  const tax = Math.round(subtotal * 0.12); // 12% hospitality VAT
  const serviceFee = nights * 25;         // $25/night resort & spa fee
  const total = subtotal + tax + serviceFee;

  res.json({
    available: true,
    room,
    nights,
    breakdown: { subtotal, tax, serviceFee, total }
  });
});

// POST /api/bookings — Create confirmed reservation
app.post('/api/bookings', (req, res) => {
  const { roomId, checkIn, checkOut, adults, children, guestName, guestEmail, specialRequests } = req.body;
  const room = ROOMS.find(r => r.id === Number(roomId));

  if (!room) return res.status(404).json({ error: 'Invalid room selection.' });
  if (!guestName || !guestEmail) return res.status(400).json({ error: 'Guest name and email are required.' });

  const nights = nightsBetween(checkIn, checkOut);
  if (nights < 1) return res.status(400).json({ error: 'Invalid stay duration.' });

  const subtotal = nights * room.price;
  const tax = Math.round(subtotal * 0.12);
  const serviceFee = nights * 25;
  const total = subtotal + tax + serviceFee;

  const ref = 'AG-' + crypto.randomBytes(3).toString('hex').toUpperCase();
  const booking = {
    reference: ref,
    roomId: room.id,
    roomName: room.name,
    roomImage: room.image,
    checkIn,
    checkOut,
    nights,
    adults: Number(adults) || 1,
    children: Number(children) || 0,
    guestName: guestName.trim(),
    guestEmail: guestEmail.trim().toLowerCase(),
    specialRequests: (specialRequests || '').trim(),
    pricing: { subtotal, tax, serviceFee, total },
    status: 'CONFIRMED',
    createdAt: new Date().toISOString()
  };

  const bookings = readJson(BOOKINGS_FILE);
  bookings.push(booking);
  writeJson(BOOKINGS_FILE, bookings);

  res.status(201).json({ status: 'ok', data: booking });
});

// GET /api/bookings/:ref — Lookup reservation by reference code
app.get('/api/bookings/:ref', (req, res) => {
  const bookings = readJson(BOOKINGS_FILE);
  const found = bookings.find(b => b.reference.toUpperCase() === req.params.ref.toUpperCase());
  if (!found) return res.status(404).json({ error: 'Reservation not found. Check your reference code.' });
  res.json({ status: 'ok', data: found });
});

// DELETE /api/bookings/:ref — Cancel reservation
app.delete('/api/bookings/:ref', (req, res) => {
  const bookings = readJson(BOOKINGS_FILE);
  const idx = bookings.findIndex(b => b.reference.toUpperCase() === req.params.ref.toUpperCase());
  if (idx === -1) return res.status(404).json({ error: 'Reservation not found.' });

  bookings[idx].status = 'CANCELLED';
  writeJson(BOOKINGS_FILE, bookings);
  res.json({ status: 'ok', data: bookings[idx] });
});

// POST /api/contact — Store concierge message
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message || message.trim().length < 10) {
    return res.status(400).json({ error: 'Please provide a valid name, email, and message (min 10 chars).' });
  }

  const messages = readJson(MESSAGES_FILE);
  const entry = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim(),
    subject: (subject || 'General Inquiry').trim(),
    message: message.trim(),
    createdAt: new Date().toISOString()
  };
  messages.push(entry);
  writeJson(MESSAGES_FILE, messages);

  res.status(201).json({ status: 'ok', message: 'Inquiry received by our concierge desk.' });
});

// Fallback to index.html for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🏨 Aurelia Grand Hotel Server running at http://localhost:${PORT}\n`);
});
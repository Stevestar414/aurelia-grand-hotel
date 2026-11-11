import express from 'express';
import { DatabaseSync } from 'node:sqlite';

const app = express();

// Step 6: CORS middleware
function allowBrowser(req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Key');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
}

app.use(express.json());
app.use(allowBrowser);

// Step 3: SQLite Database
const db = new DatabaseSync('guestbook.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    author TEXT NOT NULL CHECK (length(author) BETWEEN 1 AND 50),
    message TEXT NOT NULL CHECK (length(message) BETWEEN 1 AND 300),
    approved INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reference TEXT NOT NULL,
    room_name TEXT NOT NULL,
    check_in TEXT NOT NULL,
    check_out TEXT NOT NULL,
    nights INTEGER NOT NULL,
    adults INTEGER NOT NULL,
    children INTEGER NOT NULL,
    total_price INTEGER NOT NULL
  );
`);

// Seed initial approved reviews if empty
const initialCount = db.prepare('SELECT COUNT(*) AS count FROM messages').get().count;
if (initialCount === 0) {
  const seed = db.prepare('INSERT INTO messages (author, message, approved) VALUES (?, ?, ?)');
  seed.run('Amira V., London', 'The staff remembered our names and coffee order by the second morning.', 1);
  seed.run('Daniel K., Berlin', 'Best breakfast terrace in the city. The rooftop heated pool is pure magic.', 1);
  seed.run('Kenji T., Osaka', 'The thermal spa alone was worth the trip. Already planning a return.', 1);
  seed.run('Alex M., Paris', 'Waiting for concierge approval: Loved the Executive Suite!', 0);
}

// Seed 1 sample room order so your Orders list isn't empty on first load
const initialBookings = db.prepare('SELECT COUNT(*) AS count FROM bookings').get().count;
if (initialBookings === 0) {
  db.prepare(`
    INSERT INTO bookings (reference, room_name, check_in, check_out, nights, adults, children, total_price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run('AG-4920', 'Executive Salon Suite', '2026-11-15', '2026-11-18', 3, 2, 0, 780);
}

const listApproved = db.prepare(`
  SELECT id, author, message, created_at
  FROM messages
  WHERE approved = 1
  ORDER BY id DESC
  LIMIT 20
`);

const countApproved = db.prepare('SELECT COUNT(*) AS count FROM messages WHERE approved = 1');
const insertMessage = db.prepare('INSERT INTO messages (author, message) VALUES (?, ?)');
const insertBooking = db.prepare(`
  INSERT INTO bookings (reference, room_name, check_in, check_out, nights, adults, children, total_price)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

// Public Routes
app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.get('/api/messages/count', (req, res) => {
  const row = countApproved.get();
  res.json({ count: Number(row.count) });
});

app.get('/api/messages', (req, res) => {
  res.json(listApproved.all());
});

app.post('/api/messages', (req, res) => {
  const author = String(req.body?.author ?? '').trim();
  const message = String(req.body?.message ?? '').trim();
  if (author.length < 1 || author.length > 50 || message.length < 3 || message.length > 300) {
    return res.status(400).json({ error: 'Name 1-50, message 3-300 characters.' });
  }
  const result = insertMessage.run(author, message);
  res.status(201).json({ id: Number(result.lastInsertRowid) });
});

app.post('/api/bookings', (req, res) => {
  const { reference, roomName, checkIn, checkOut, nights, adults, children, totalPrice } = req.body;
  if (!roomName || !checkIn || !checkOut) {
    return res.status(400).json({ error: 'Missing booking details.' });
  }
  const result = insertBooking.run(
    String(reference || 'AG-1000'),
    String(roomName),
    String(checkIn),
    String(checkOut),
    Number(nights) || 1,
    Number(adults) || 1,
    Number(children) || 0,
    Number(totalPrice) || 0
  );
  res.status(201).json({ id: Number(result.lastInsertRowid), reference });
});

// Admin Middleware & Protected Routes
function requireAdmin(req, res, next) {
  if (req.get('X-Admin-Key') !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Not allowed' });
  }
  next();
}

app.get('/api/admin/messages', requireAdmin, (req, res) => {
  res.json(db.prepare('SELECT * FROM messages ORDER BY id DESC').all());
});

app.patch('/api/admin/messages/:id/approve', requireAdmin, (req, res) => {
  db.prepare('UPDATE messages SET approved = 1 WHERE id = ?').run(Number(req.params.id));
  res.sendStatus(204);
});

app.delete('/api/admin/messages/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM messages WHERE id = ?').run(Number(req.params.id));
  res.sendStatus(204);
});

app.get('/api/admin/bookings', requireAdmin, (req, res) => {
  res.json(db.prepare('SELECT * FROM bookings ORDER BY id DESC').all());
});

app.delete('/api/admin/bookings/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM bookings WHERE id = ?').run(Number(req.params.id));
  res.sendStatus(204);
});

app.listen(3000, () => {
  console.log('API on http://localhost:3000');
});
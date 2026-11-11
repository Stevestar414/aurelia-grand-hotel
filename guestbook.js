const API = 'http://localhost:3000/api';
const list = document.querySelector('#guestbook-list');
const countBadge = document.querySelector('#guestbook-count');
const form = document.querySelector('#guestbook-form');
const note = document.querySelector('#gb-note');

// Safe XSS-free rendering using createElement + textContent (Slide 10 & 13)
function renderMessage(m) {
  const item = document.createElement('article');
  item.className = 'gb-card';

  const header = document.createElement('div');
  header.className = 'gb-card-head';

  const who = document.createElement('h3');
  who.textContent = m.author; // text, never HTML

  // Homework #1: Show the date under/next to each message (created_at -> toLocaleDateString)
  const dateEl = document.createElement('time');
  const rawDate = m.created_at ? new Date(m.created_at.replace(' ', 'T') + 'Z') : new Date();
  dateEl.textContent = isNaN(rawDate) ? m.created_at : rawDate.toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  header.append(who, dateEl);

  const text = document.createElement('p');
  text.textContent = m.message;

  item.append(header, text);
  return item;
}

async function loadMessages() {
  if (!list) return;
  try {
    // Homework #2: Fetch GET /api/messages/count and show it above the list
    const [msgRes, countRes] = await Promise.all([
      fetch(`${API}/messages`),
      fetch(`${API}/messages/count`)
    ]);

    const rows = await msgRes.json();
    const countData = await countRes.json();

    if (countBadge && typeof countData.count === 'number') {
      countBadge.textContent = `${countData.count} approved guestbook entries`;
    }

    list.replaceChildren(...rows.map(renderMessage));
    if (rows.length === 0) list.textContent = 'No messages yet.';
  } catch {
    list.textContent = 'The guestbook server is offline.';
    if (countBadge) countBadge.textContent = 'Server offline (start api with npm run dev)';
  }
}

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    note.textContent = 'Sending...';
    note.className = 'gb-note';

    try {
      const res = await fetch(`${API}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: form.elements.author.value,
          message: form.elements.message.value,
        }),
      });
      const body = await res.json();

      if (res.status === 201) {
        note.textContent = 'Thanks! It will appear after approval.';
        note.className = 'gb-note success';
        form.reset();
      } else {
        note.textContent = body.error || 'Submission failed.';
        note.className = 'gb-note error';
      }
      loadMessages();
    } catch {
      note.textContent = 'Could not reach the guestbook server.';
      note.className = 'gb-note error';
    }
  });
}

loadMessages();
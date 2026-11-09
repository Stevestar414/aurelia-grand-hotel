# Aurelia Grand Hotel — Full-Stack Reservation Platform

A full-stack luxury hospitality web application and booking engine built with semantic HTML5, modern CSS Grid/Flexbox, modular ES6 JavaScript, and a Node.js + Express REST API.

## Features

- **Real-Time Quote & Tax Calculator**: Automatically calculates nightly rates, 12% hospitality VAT, and resort fees with guest capacity validation.
- **Dynamic Suite Inventory**: Filter by category, price ceiling, or keyword search, with persistent `localStorage` shortlisting.
- **Reservation Lookup Portal**: Guests receive a unique `AG-XXXXXX` reference code to retrieve or print their booking voucher anytime.
- **RESTful Backend (`server.js`)**: Express API persisting reservations and concierge messages to structured JSON storage (`data/bookings.json` and `data/messages.json`).
- **Offline-Resilient Client**: Works seamlessly both when served via the Node.js backend and when deployed as a static frontend (GitHub Pages / Netlify).

## Tech Stack

- **Frontend**: Vanilla ES6+ JavaScript, CSS Custom Properties, Responsive Grid
- **Backend**: Node.js, Express.js, REST API
- **Persistence**: File-backed JSON datastore (zero external DB setup required)

## Quick Start

```bash
# 1. Clone the repository
git clone [https://github.com/vester/aurelia-grand-hotel.git](https://github.com/vester/aurelia-grand-hotel.git)
cd aurelia-grand-hotel

# 2. Install dependencies
npm install

# 3. Start the server
npm start
# KalaSetu — craft, connected

A focused, interactive React prototype for an artisan-first Indian handmade marketplace. The demo connects fair pricing, maker-submitted provenance, local worker collaboration and community review across four role-based experiences.

## Run locally

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```


Open the URL printed by Vite (normally `http://localhost:5173`). To create and serve a production build:

```bash
npm run build
npm run preview
```

## Explore the demo

- **Landing page:** choose **Get started** to see the role selector, or **Explore marketplace** to browse products.
- **Artisan (Laxmi):** open **For artisans** → **Add a product**. Try the simulated voice and AI assists, add gallery photos or use **Simulate capture**, adjust the live fair-pricing inputs, then publish. The new listing appears in the marketplace immediately.
- **Buyer:** open a product to see the maker story, itemised price explanation and four-step provenance timeline. **View full provenance** opens the public-style record. Add to bag and place a mock order to see the confirmation flow.
- **Worker (Sunita):** open **Local skills** and create/assign a task, or use the seeded example in **Worker**. Submit a progress note and photo, then switch to the Artisan role to request a change or approve the task and simulate a payment release. Linked worker contributions appear on the product timeline.
- **SHG Coordinator (Annapurna):** open **Community review** to inspect Laxmi's submitted details and product evidence. Approve, request more evidence or reject with a reason. The updated status appears in the marketplace, product detail and public provenance record.
- Use the visible role selector to move between perspectives. **Reset** restores the original local demo data.

## Prototype boundaries

All data is mock data stored in browser `localStorage`; there is no backend, account system, payment provider, escrow, live AI, speech recognition or real camera capture. Uploaded photos are stored locally in the browser for this prototype. Gallery and simulated camera labels are explicit; timestamps and origin are not independently authenticated, and no GPS verification is claimed. “Community reviewed” represents a local coordinator decision in the demo, not cryptographic proof or independent certification. The QR-style visual is a non-scannable placeholder; the verification page URL can be shared directly.

## Stack

React, TypeScript, Vite, Tailwind CSS, React Router and Lucide React. Reusable product, status, layout and form components are backed by typed mock data and a local state provider.

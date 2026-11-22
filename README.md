# Aidyl's Luxury website

Next.js 16 (App Router, Cache Components) · Tailwind CSS 4 · Neon Postgres (Drizzle ORM) · Vercel Blob · Paystack.

## What's included

**Public site:** Home, About, Services, Shop, product pages, Portfolio, Book an Event, Balloon booking, Rental booking, Contact/FAQ, Cart, Checkout and order confirmation. Copy comes from the content pack (`src/lib/content.ts`); items marked DRAFT there still need Lydia's approval.

**Admin (`/admin`):** password login, overview, orders and rental bookings, enquiries (event, balloon, contact), products (prices, options, photos, stock, minimum order), rental prices and quantities, portfolio photos.

**Payments:** shop items and rentals are paid in full through Paystack (Mobile Money and card, GHS). Orders are marked paid only after Paystack confirms the exact amount, either on the return page or through the webhook. Rentals with any unpriced item, or any checkout while Paystack isn't configured, come in as a request instead of a payment.

**Uploads:** browsers upload directly to Vercel Blob (`/api/upload` issues short-lived tokens), so files never pass through the 4.5 MB function limit. Visitors can upload inspiration files (3 files, 10 MB each); the admin can upload product and portfolio photos.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in what you have
npm run dev
```

Without `DATABASE_URL` the site runs in preview mode: the shop uses the seed catalogue, forms and orders are logged to the terminal, and no payment is taken. In production, forms and checkout refuse to run without a database.

## Set up on Vercel

1. Import the repository into Vercel.
2. **Storage → Create → Neon** (adds `DATABASE_URL`) and **Storage → Create → Blob** (adds `BLOB_READ_WRITE_TOKEN`).
3. Add the other variables from `.env.example`: `NEXT_PUBLIC_SITE_URL`, `PAYSTACK_SECRET_KEY` (test key first), `ADMIN_PASSWORD`, `SESSION_SECRET`, and optionally `RESEND_API_KEY`, `MAIL_FROM`, `OWNER_EMAIL`, `NEXT_PUBLIC_MAP_EMBED_URL`.
4. Create the tables and load the catalogue (from your machine, with `DATABASE_URL` in `.env.local`):
   ```bash
   npm run db:push
   npm run db:seed
   ```
   The SQL is also in `drizzle/0000_init.sql`.
5. In Paystack → Settings → API Keys & Webhooks, set the webhook URL to `https://<domain>/api/paystack/webhook`.
6. Redeploy.

## Scripts

| Script | Does |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm run lint` / `typecheck` | ESLint / TypeScript |
| `npm run db:push` | Create or update tables in Neon |
| `npm run db:generate` | Write a SQL migration to `drizzle/` |
| `npm run db:seed` | Add the content-pack products and rental items (safe to re-run) |
| `npm run db:studio` | Browse the database |

## Where things live

- `src/lib/content.ts`: site copy, contact details, FAQs, terms, booking options
- `src/lib/seed-catalog.ts`: starting products (hampers, roses) and rental items
- `src/lib/db/schema.ts`: database tables
- `src/lib/data.ts`: cached catalogue reads (`use cache`, refreshed when the admin saves)
- `src/lib/actions/`: Server Actions for forms, checkout and admin
- `src/app/(site)/`: public pages · `src/app/admin/`: admin dashboard
- `src/proxy.ts`: redirects signed-out visitors away from `/admin`

## Still to do

- Real photos (all images are labelled placeholders until uploaded through the admin)
- Prices pending from Lydia: rentals per day, balloon garlands and strike fee, bouquets, gifts for her and him, souvenirs, gift wrapping
- Delivery fees: currently confirmed with the customer after ordering
- Deposit and balance payment links for events (currently invoiced manually)
- Blocking dates when a rental item is fully booked
- Logo file, map pin, legal review of the terms

# Aidyl's Luxury website

Next.js 16 (App Router, Cache Components) · Tailwind CSS 4 · Neon Postgres (Drizzle ORM) · Vercel Blob · Paystack.

## What's included

**Public site:** Home, About, Services, Shop, product pages, Portfolio, Book an Event, Balloon booking, Rental booking, Contact/FAQ, Cart, Checkout and order confirmation. Copy comes from the content pack (`src/lib/content.ts`); items marked DRAFT there still need Lydia's approval.

**Admin (`/admin`):** password login, overview, orders and rental bookings, enquiries (event, balloon, contact), products (prices, options, photos, stock, minimum order), rental prices and quantities, portfolio photos.

**Payments:** shop items and rentals are paid in full through Paystack (Mobile Money and card, GHS). Orders are marked paid only after Paystack confirms the exact amount, either on the return page or through the webhook. Rentals with any unpriced item, or any checkout while Paystack isn't configured, come in as a request instead of a payment.

**Uploads:** browsers upload directly to Vercel Blob (`/api/upload` issues short-lived presigned URLs), so files never pass through the 4.5 MB function limit. Visitors can upload inspiration files (3 files, 10 MB each); the admin can upload product and portfolio photos.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in what you have
npm run dev
```

Without `DATABASE_URL` the site runs in preview mode: the shop uses the seed catalogue, forms and orders are logged to the terminal, and no payment is taken. In production, forms and checkout refuse to run without a database.

## Set up on Vercel

1. **Database:** Vercel → this project → **Storage** → **Connect Database** → **Neon** → create it and connect it to all environments. This adds `DATABASE_URL`.
2. **Photo storage:** **Storage** → **Create** → **Blob** (choose **Public** access) → connect it to this project. Newer stores add `BLOB_STORE_ID` and authenticate with Vercel's built-in OIDC token; older ones add `BLOB_READ_WRITE_TOKEN`. Either works.
3. **Admin access:** **Settings** → **Environment Variables**, add:
   - `ADMIN_PASSWORD`: at least 12 characters (this is the password for `/admin`)
   - `SESSION_SECRET`: a random string of 32+ characters, e.g. the output of `openssl rand -base64 48` or a password manager's generator
   - `NEXT_PUBLIC_SITE_URL`: `https://www.aidylsluxury.com`
4. **Redeploy** (Deployments → ⋯ → Redeploy). Every build runs `scripts/setup-db.ts` first, which:
   - applies the SQL migrations in `drizzle/` to Neon
   - loads the starting products and rental items **only if those tables are empty** (so nothing Lydia deletes comes back)

   The build log shows `[setup-db] Migrations applied.` and `Loaded 8 starting products.` on the first run.
5. Open `https://www.aidylsluxury.com/admin`, sign in, and check the **Setup checklist** at the bottom of the overview.
6. Later: add `PAYSTACK_SECRET_KEY` (test key first) and set the Paystack webhook to `https://www.aidylsluxury.com/api/paystack/webhook`; add `RESEND_API_KEY` and `MAIL_FROM` for email notifications.

Changing the admin password: update `ADMIN_PASSWORD` in Vercel and redeploy. Changing `SESSION_SECRET` signs everyone out.

## Scripts

| Script | Does |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm run lint` / `typecheck` | ESLint / TypeScript |
| `npm run db:setup` | Apply migrations and load the starting catalogue into empty tables (runs automatically before every build) |
| `npm run db:generate` | After changing `src/lib/db/schema.ts`, write the next SQL migration to `drizzle/` and commit it |
| `npm run db:seed` | Add any missing content-pack products and rental items by name (manual use only) |
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

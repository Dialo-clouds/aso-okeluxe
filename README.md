# AsoOkeLuxe — Next.js Build

The real, structured version of AsoOkeLuxe — a proper multi-page app with a real database backend, built PR by PR.

## Project status (read this first)

- ✅ **PR 1 — Backend Foundation**: database schema, auth, Products & Vendors API.
- ✅ **PR 2 — Cart & Checkout**: real cart (guests + logged-in users), Add to Bag on every product, `/cart`, `/checkout`, real Order records in the database.
- ✅ **PR 3 — Flutterwave v4 payments (Pay With Bank Transfer)**: OAuth token exchange, charge creation, webhook, manual verify endpoint. **Important — read the Flutterwave section below**, this is the part most likely to need a small fix once you test it against a real sandbox transaction, since v4 is a public beta API I couldn't test end-to-end from this environment.
- ✅ **Hardening pass**: auth actually works (signup/login were previously no-ops — real bug, now fixed), route protection now covers `/vendor`, `/checkout`, and `/orders` (not just `/vendor`), rate limiting on login/signup/payment endpoints (Upstash Redis — see setup below), Cache-Control headers on product/vendor listings, real favicon, Postgres for production.
- ✅ **Hero rebuilt a second time**: the overlay-on-photo version had the headline landing right over people's faces with poor contrast — genuinely not good. Replaced with a split layout (photo on one side, solid content panel on the other), which is how most premium fashion ecommerce sites actually solve this problem. Visually verified with a rendered screenshot before shipping, not just assumed.
- ✅ **PR 4 — Admin dashboard**: real sidebar shell, completely separate from the public site's nav/footer (route-group restructure — see below). Overview page with live revenue/order charts (recharts), Products management (create/edit/delete), Vendors management (create/verify), Orders management (status updates).
- ✅ **PR 5 — Customer care**: public `/support` contact form, real `SupportTicket` records, admin inbox at `/admin/support` with status tracking.
- ✅ **PR 6 — Credits / wallet system**: admin can grant/deduct store credit for any customer by email (`/admin/credits`), customers see and can apply their balance at checkout, fully reflected in the order total.
- ⏳ **Card payments**: still not built. Only bank transfer works — see the Flutterwave section.

## Route restructure (important if you're looking at the file tree)

Public pages moved into `app/(site)/` and the admin dashboard now has its own layout (`app/admin/layout.js`) with a sidebar — it no longer inherits the public site's Nav, Footer, grain texture, or custom cursor. This was a real fix, not cosmetic: an admin dashboard sharing a public marketing site's chrome reads as unfinished. `(site)` is a Next.js route group — it doesn't appear in the URL, so `/shop`, `/cart`, etc. are unchanged.

## Testing the auth flow locally

1. Run `npm run db:setup` if you haven't already (creates + seeds the database).
2. `npm run dev`, go to `/signup`, create an account with a real-looking email and a password 6+ characters.
3. You should land back on the home page, logged in — check the navbar, it should show your first name and "Log Out" instead of "Sign In".
4. Try visiting `/vendor` while logged out (log out first) — it should redirect you to `/login?redirect=/vendor`. Log in and it should send you back to `/vendor` automatically.
5. If any of this doesn't work as described, that's a real bug — tell me exactly what happened (what you clicked, what you saw) and I'll fix it.

## What's inside

- `/` — Home: a normal ecommerce-style hero banner (real product photo, headline, CTAs — no 3D), then products immediately below, then brand story sections
- `/advisor` — the full **Àrò** AI Style Advisor page, with real styling reference photos
- `/shop` — the full product grid (17 real Aso Oke photos), filterable by color, and now with **working search** (try the navbar search box)
- `/vendors` — the multi-vendor marketplace directory
- `/vendor` — the vendor dashboard preview
- `/login` and `/signup` — dedicated auth pages
- Full English / Yoruba toggle, site-wide
- The draggable 3D swatch fan (in "The Fold" section) — this one stayed, only the hero WebGL piece was removed
- A real favicon and app icon (gold "A" monogram)

**Still placeholder, on purpose:** product prices, dashboard numbers, order rows, and the vendor directory are demo data — real until PR 2 wires the frontend to the database that already exists.

**About the product photos:** the images in `public/products/` are the ones you uploaded. A few have a fabric wholesaler's hangtag or a photographer's watermark visible in-frame (flagged earlier in chat) — swap these for licensed photography before anything goes live publicly.

## On Flutterwave: what was actually built and why

You asked to use your v4 credentials (Client ID / Client Secret / Encryption Key), so that's what PR 3 is built on. Two honest things to know:

1. **Card payments were deliberately NOT built.** Flutterwave's own official docs currently contradict each other on which encryption algorithm direct card charges need (one page says 3DES, another says AES-256). Building raw-card-collection on contradictory docs, without being able to test it live, is a real risk — a bad implementation there is a security/compliance problem, not just a bug.
2. **Instead, PR 3 uses Pay With Bank Transfer (PWBT)** — still v4, still your credentials, but the customer pays by transferring to a generated virtual account number instead of entering a card. No raw card data ever touches the server. This is also just genuinely normal for Nigerian ecommerce.

**What you need to test yourself:** I could not run this against a live Flutterwave sandbox from this environment (no internet access here). The OAuth token exchange (`lib/flutterwave.js`) is based on Flutterwave's stable, documented pattern and should just work. The charge-creation endpoint and the shape of the returned virtual account details are based on their published guides, but v4 is a public beta — **test a real sandbox transaction and compare the actual response against what `lib/flutterwave.js` and the order confirmation page (`app/orders/[id]/page.js`) expect.** If the account number/bank name don't show up on the confirmation page, click "Raw Flutterwave response (debug)" on that page — it shows you the exact JSON Flutterwave sent back, which tells you exactly what field names to fix in `extractBankDetails()`.

Also: since real secret keys were shared in this chat, please rotate/regenerate them in your Flutterwave dashboard as a precaution when convenient — chat isn't a secure place to store credentials long-term, even ones described as test/mock values.

## Rate limiting setup (Upstash Redis)

Login, signup, and payment-start are now rate-limited — but only if you configure Upstash. Without it, the app still works, it's just unprotected against brute-force attempts (a warning prints in your terminal reminding you).

1. Go to upstash.com, sign up free, create a Redis database.
2. On the database page, copy the "REST URL" and "REST Token".
3. Paste them into `.env` as `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
4. Restart `npm run dev` — the warning should disappear, and repeated rapid login attempts should start returning "Too many attempts" after 5 tries in a minute.

## Run it on your computer

You need [Node.js](https://nodejs.org) installed (version 18 or newer).

1. Unzip this folder.
2. Open a terminal inside the folder.
3. Install dependencies: `npm install`
4. Get a free Postgres database from **neon.tech** (recommended — takes 2 minutes, works great with Vercel): sign up, create a project, copy the connection string it gives you (starts with `postgresql://`).
5. Copy `.env.example` to `.env`, and paste that connection string as `DATABASE_URL`.
6. Set up and seed the database: `npm run db:setup`
7. Start it: `npm run dev`
8. Open **http://localhost:3000** in your browser.

The default admin login after seeding is `admin@asookeluxe.com` / `changeme123` — change this immediately once a real admin UI exists (coming in PR 4).

## Show it to your client quickly (no install needed on their end)

The fastest way to get a real link you can send or open on your client's phone:

1. Push this folder to a GitHub repo (or use Vercel's dashboard "Add New Project" → drag-and-drop the folder — Vercel detects Next.js automatically, unlike the earlier plain-HTML version this doesn't go through vercel.com/drop, it goes through the normal **Add New Project** import flow since it's a full app, not a single file).
2. Vercel builds it and gives you a live `.vercel.app` link.
3. Send that link, or open it yourself on your phone to demo live.

If you want, ask me for the exact click-by-click Vercel steps for a full Next.js project (slightly different from the single-file drag-and-drop you did before) — happy to walk through it.

## Works on both Android and iOS

Nothing extra to build here — because this is a responsive website (not a separate native app), it already works in:
- Safari on iPhone/iPad
- Chrome on Android
- Any desktop browser

It also has a `manifest.json` and the right meta tags wired in, so on both platforms your client can tap **"Add to Home Screen"** and it opens like an app with its own icon — no App Store or Play Store submission needed for that.

## Adding more product photos later

To add more or swap existing ones:
1. Drop the new image files into `public/products/`.
2. Tell me the filenames and which product each replaces.
3. I'll update `lib/products.js` to point to the new files.

## Known gaps before this is a real production site

Being upfront, same as before:
- No real database, payments, or vendor backend yet — this is the frontend/UI layer only.
- Sign in / Create Account are visual only.
- Yoruba translations are a solid first pass, not reviewed by a native-speaking editor yet — worth a native review pass before public launch.
- No product photography yet.

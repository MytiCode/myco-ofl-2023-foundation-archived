# MyCo OFL 2023 Foundation (Archived)

> **⚠️ ARCHIVED REPOSITORY**
> This repository contains the **clean, working foundation** from April-May 2023.
> It represents the original OFL system before subsequent development attempts.
> Preserved as a reference and potential starting point for future development.
>
> **Related:** See [myco-ofl-2025-abandoned](https://github.com/MytiCode/myco-ofl-2025-abandoned) for the later iteration that was abandoned.

---

**MyCo OFL 2023 Foundation** is a Next.js web application for Myti's **Order Fulfillment & Logistics (OFL)** operations. This is the internal tool used by drivers and fulfillment staff to manage and process orders through the Myti delivery service.

## What This Does

This application generates printable fulfillment documents and provides order management interfaces for the Myti platform's operations team.

### Key Features

**Document Generation:**
- **Pickup Sheets** - Instructions for picking up items from vendor shops
- **Packing Slips** - Order contents and shipping information for customers
- **Delivery Labels** - Address labels for delivery routing
- **Order Tracking Sheets** - Comprehensive tracking and logistics information

**Order Management:**
- Multi-shop order handling with line item tracking
- Order status management (placed, cancelled, out-for-delivery, delivered)
- Line item fulfillment tracking (fulfilled/unfulfilled)
- Status-based filtering (e.g., READY_FOR_PICKUP orders)

### Data Model

- **Orders** - Customer orders with billing/shipping addresses, pricing, and line items
- **Line Items** - Individual products with SKU, price, quantity, and shop association
- **Shops** - Vendor locations where items are picked up
- **Fulfillment Status** - Granular tracking for each line item

## Tech Stack

- **Next.js 13.2.4** - React framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **JWT** - Authentication
- **Playwright** - E2E testing
- **Axios** - API communication

## Development Timeline

- **Built:** April 2023
- **Last Updated:** May 17, 2023
- **Status:** Stable, no recent activity since May 2023

## Getting Started

### Prerequisites
- Node.js >= 18.7.0 < 19.0.0
- npm >= 8.15.0 < 10.0.0

### Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.dist .env
# Edit .env with your authentication keys:
# - TEST_AUTH_KEY_ID
# - TEST_AUTH_PUBLIC_KEY
# - TEST_AUTH_PRIVATE_KEY
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm start            # Start production server (requires PORT env var)
npm run lint         # Run ESLint
npm run e2e          # Run Playwright E2E tests
npm run e2e:watch    # Run Playwright in debug mode
```

## Project Structure

```
src/
├── pages/           # Next.js pages and routing
│   ├── index.tsx                    # Home/welcome page
│   ├── pickup-sheets.tsx            # Pickup sheet generator
│   ├── packing-slips.tsx            # Packing slip generator
│   ├── delivery-labels.tsx          # Delivery label generator
│   └── order-tracking-sheets.tsx    # Tracking sheet generator
├── orders/          # Order domain logic
│   ├── model.ts                     # Core type definitions
│   ├── OrdersProvider.tsx           # Order data provider
│   └── [feature]/                   # Feature-specific components
├── components/      # Shared UI components
│   ├── Layout.tsx                   # Main layout wrapper
│   └── Nav.tsx                      # Navigation component
├── api/            # API client logic
└── auth/           # Authentication utilities
```

## Sanitizing orders

```
npx tsx scripts/sanitize-all-orders.ts
```

## TODO

- [ ] Move view model types out of pages
- [ ] Run all tests in VS Code with show browser checked works (doesnt hang indefinitely)
- [ ] Run tests in VS Code with show browser checked closes browser after test succeeds
- [ ] Change from '@/' to ':' for tspaths
- [ ] Prevent lint errors at least in ci earlier than running all tests, probably on commit hook locally to avoid wasted time
- [ ] Can pass page drivers directly to expect(packingSlipPage) just like expect(page)
- [ ] Pattern for the root locator of a driver to use directly with expect expect(nav).toBeVisible() instead of expect(nav.root).toBeVisible() but root is pretty explicit so maybe go with that for now?
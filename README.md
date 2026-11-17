
# BOUTIQ – Boutique Management System

A full-stack boutique management system built with the MERN stack to manage customers, measurements, designs, orders, deliveries, payments, and staff operations from a single platform.

🌐 **Live Demo:** https://boutique-management-system-27xwnggdn-aiin1.vercel.app/

---

## 🚀 Overview

BOUTIQ is a web-based boutique management application designed to simplify day-to-day boutique operations.

The system provides separate experiences for boutique staff and customers, allowing the business to manage orders and customer information while customers can browse designs and track their orders.

---

A simple, beginner-friendly MERN stack web app for managing a boutique or tailoring shop: customers, measurements, orders, deliveries, payments, staff, and more. Built with plain JavaScript only — no TypeScript, no Vite.

## Tech Stack

- **MongoDB + Mongoose** - database
- **Express.js** - backend API
- **React.js** - frontend (Create React App, plain `.js` files with JSX, no `.jsx`/`.tsx`)
- **Node.js** - backend runtime
- **Bootstrap 5** - styling
- **Axios** - API requests
- **JWT + bcryptjs** - authentication

## Folder Structure

```
boutiq-management-system/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Route logic (one file per feature)
│   ├── middleware/      # JWT auth + image upload handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express route definitions
│   ├── seed/            # One-time script to create the first Owner login
│   ├── uploads/         # Uploaded design/reference images (created automatically)
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/  # Sidebar, Topbar, Layout, PrivateRoute (staff)
        │                # + CustomerLayout, CustomerPrivateRoute (customer portal)
        ├── context/      # AuthContext (staff/owner) + CustomerAuthContext (customer)
        ├── pages/        # One file per admin screen (Login, Dashboard, Orders, ...)
        │   └── customer/ # Customer Portal screens (CustomerLogin, CustomerOrders, ...)
        ├── utils/        # api.js (staff) + customerApi.js (customer) - separate Axios instances
        ├── App.js        # Routes
        └── index.js      # Entry point
```

Backend additions for the Customer Portal specifically: `controllers/customerAuthController.js` (login/profile), `routes/customerAuthRoutes.js` + `routes/customerPortalRoutes.js`, plus a `protectCustomer` middleware in `middleware/authMiddleware.js` that's kept completely separate from the staff/owner `protect` middleware — a customer's login token can never be used to reach admin routes, and vice versa.

Every source file is plain JavaScript (`.js`) — no `.ts`/`.tsx` files and no Vite anywhere in the project.

## Features

1. Owner login
2. Staff login (accounts are created by the owner, not self-registered)
3. **Customer Portal login** - customers log in separately with their phone number to track their own orders and pay online (see below)
4. Customer management
5. Customer measurements (multiple records per customer, inches or cm)
6. Order management with an auto-generated order number
7. Design / reference image uploads (per customer and per order)
8. Order status tracking (Pending → In Progress → Ready → Delivered / Cancelled)
9. Delivery tracking (status, address, scheduled date)
10. Payment tracking (amount, method, running balance per order) plus **online payment via Razorpay**
11. Staff management (owner-only: create, disable/enable, remove)
12. Dashboard with summary stats and recent orders
13. Settings (update your own name/phone/password)
14. Optional AI Assistant chatbot

## Portfolio preview

The public home page at `/` introduces the product, and `/demo` provides a
read-only, interactive preview using fictional sample data. The demo is
frontend-only and does not connect to the live API or expose owner or customer
accounts. Staff, owner, designer, and customer features continue to require
their normal sign-in.

## Customer Portal

Customers have their own separate login at `/customer-login` (distinct from the staff/owner login at `/login`), using their **phone number + a password**. From there they can see their own orders, order status, delivery info, design/reference images, payment history, and pay their remaining balance online.

**Customers can't set their own password.** The owner/staff enables portal access per customer - either when adding a new customer (there's an optional "Customer Portal Password" field), or any time afterwards from that customer's detail page ("Customer Portal Access" card → "Enable Access" / "Reset Password"). Until a password is set, that customer simply can't log in yet - everything else about them (orders, measurements, etc.) works normally regardless. Customers can change their own password once logged in, from "My Profile".

This keeps things simple (no SMS/email service needed to onboard a customer) while still giving you real control over who gets portal access.

### Online payments (Razorpay)

Paying online is optional and works exactly like the AI Assistant: if it isn't configured, it just quietly disables itself.

- **Without keys**: the customer sees "Online payment isn't set up yet - please pay at the shop" on their order page. Everything else keeps working.
- **With keys**: customers get a real "Pay Rs. X" button that opens Razorpay's checkout, and a successful payment is automatically recorded against that order (visible on both the customer's and the staff's payment history, tagged "Online").

To turn it on:
1. Create a free Razorpay account and grab your **test mode** Key ID and Key Secret from [dashboard.razorpay.com/app/keys](https://dashboard.razorpay.com/app/keys) - no business verification needed just to test.
2. Add them to `backend/.env` as `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
3. Restart the backend.

Razorpay's test mode gives you working fake card/UPI numbers so you can try the whole flow without moving real money. When you're ready to accept real payments, swap in your live keys - no code changes needed.

The payment amount that actually gets saved is fetched back from Razorpay's own API during verification (not just trusted from the browser), and every payment is checked against a valid signature, so a customer can't spoof a "successful" payment.

## A decision worth knowing about

Customers are still created and managed by the owner/staff (they can't self-register), but they now *can* optionally log in to their own separate Customer Portal once the owner/staff sets a password for them - see "Customer Portal" above. This replaces the very first version of this project, which only had staff/owner accounts and manually-recorded payments.

## Setup

### 1. Backend

```
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in:
- `MONGO_URI` — your MongoDB connection string (a local MongoDB install, or a free MongoDB Atlas cluster)
- `JWT_SECRET` — any long random string
- `OPENAI_API_KEY` — optional, only needed for the AI Assistant
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — optional, only needed for customers to pay online (see "Customer Portal" below)

Create the first Owner account (run this once):
```
npm run create-owner
```
This creates:
- Email: `owner@boutiq.com`
- Password: `owner123`

Log in with this account and change the password from the Settings page.

Start the backend:
```
npm run dev
```
The API runs at `http://localhost:5000`.

### 2. Frontend

In a second terminal:
```
cd frontend
npm install
npm start
```
The app opens at `http://localhost:3000`.

If your backend runs somewhere other than `http://localhost:5000`, copy `frontend/.env.example` to `frontend/.env` and set `REACT_APP_API_URL` accordingly.

### 3. Try the Customer Portal

1. Log in as the owner at `http://localhost:3000/login`, add a customer, and set a "Customer Portal Password" for them (or open an existing customer and use "Enable Access").
2. Create an order for that customer so there's something to see.
3. Go to `http://localhost:3000/customer-login` and log in with that customer's phone number + the password you set.

## AI Assistant

The AI Assistant page works normally with no setup at all. If `OPENAI_API_KEY` is not set in `backend/.env`, it simply shows "AI Assistant is currently unavailable" — every other feature (login, customers, orders, payments, deliveries, etc.) keeps working normally regardless.

## Notes

- This is a simple/basic-level project meant for learning: no advanced architecture, no state management library beyond React's built-in Context API, no UI kit beyond plain Bootstrap classes.
- Staff accounts have the same access as the owner, except Staff Management, which is owner-only.
- `npm install` may print a handful of `npm audit` warnings. Most come from `react-scripts`' own (aging but stable) dependency tree, and one moderate advisory comes from a transitive dependency inside Express 4 itself (`body-parser` → `qs`) — both are common to virtually any current CRA + Express 4 project and aren't caused by anything added here. Run `npm audit fix` if you'd like, but avoid `--force` since it can jump major versions and break things.
- Order numbers (e.g. `ORD1001`) are generated from a simple document count — fine for a single small shop, but if you ever run multiple servers at once it's worth switching to a proper counter/sequence to avoid a rare duplicate.

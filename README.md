# ANSR Product Catalogue

A React + TypeScript product catalogue backed by a Node.js + TypeScript API. The backend is the only layer that calls Fake Store API.

## Stack Choice and Rationale

- **Client:** React + TypeScript (Vite, Tailwind CSS, React Router) — provides fast local iteration, strong type safety, and clean component boundaries so look-and-feel changes can happen without touching data-fetching logic.
- **Backend:** Node.js + TypeScript (Express) — allows sharing TypeScript mental models and DTOs across client and server, keeps local setup lightweight, and isolates product catalog and enquiry email providers behind clear service boundaries as the vision evolves.

## Prerequisites

- Node.js 18+ and npm
- No paid accounts are required to run the product catalogue or tests.
- SMTP credentials are only needed to send enquiry emails to the sales inbox.

## Setup and run (for reviewer/judge)

### 1. Configure the backend

From the project root:

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and configure the variables below. The provided Fake Store API URL and local port values can be kept as-is.

| Variable | Example | Purpose |
|---|---|---|
| `PORT` | `8000` | Backend server port |
| `FRONTEND_URL` | `http://localhost:5173` | Frontend origin allowed by CORS |
| `FAKE_STORE_API_URL` | `https://fakestoreapi.com` | Product data provider |
| `SMTP_HOST` | `smtp.gmail.com` | SMTP server used for enquiry email |
| `SMTP_PORT` | `587` | SMTP port (STARTTLS) |
| `SMTP_USER` | `your-email@gmail.com` | Sender Gmail account |
| `SMTP_PASS` | `your-app-password` | Gmail App Password (not your account password) |
| `SALES_EMAIL` | `sales-team@example.com` | Destination sales inbox |

**Email setup (only if you want to verify real enquiry delivery):** use a Gmail account with 2-Step Verification enabled, generate a Google App Password, and put it in `SMTP_PASS`. Set `SMTP_USER` to that Gmail address and `SALES_EMAIL` to the inbox where enquiries should arrive. Never commit `.env` or real credentials. If SMTP isn't configured, product browsing and automated tests still work, but real enquiry email delivery will not.

Install and start the backend:

```bash
npm install
npm run dev
```

The API runs at `http://localhost:8000`; health check: `http://localhost:8000/health`. Keep this terminal open.

### 2. Start the frontend

Open another terminal at the project root:

```bash
cd frontend
cp .env.example .env
```

Open `frontend/.env` and verify the variable below (the default value works out of the box with the local backend):

| Variable | Example | Purpose |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000/api` | Base URL for the backend API |

Install and start the frontend:

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

## Run tests

Tests use mocks for Fake Store API requests and email delivery; they do not need SMTP credentials and will not send real email. Run in separate terminals or one after the other:

```bash
cd backend
npm install
npm test
```

```bash
cd frontend
npm install
npm test
```

To run tests in watch mode, use `npm run test:watch` in either package.

## Test coverage

- **Backend:** product list/details, categories, category products, featured products, search, error responses, enquiry validation, and email delivery failure handling.
- **Frontend:** home featured products, category sections, search results/empty/error states, product details, enquiry submission success/failure, and enquiry validation (name 2–80 chars, email format/max 254 chars, phone 7–15 digits with common formatting characters, message 10–1000 chars).

Tests and test helpers are kept in dedicated folders: `backend/tests/` and `frontend/tests/`.

## Architecture

- `frontend/`: React, TypeScript, Vite, Tailwind CSS, React Router
- `backend/`: Express, TypeScript; API routes/controllers/services
- Backend product service isolates the Fake Store API integration so the provider can be replaced later.
- Enquiry email delivery is isolated in the email service so the provider can be replaced.
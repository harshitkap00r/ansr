# ANSR Frontend

React + TypeScript + Vite + Tailwind CSS frontend for the product catalogue challenge.

## Requirements
- Node.js 18+
- Backend running locally at `http://localhost:8000`

## Setup
```bash
npm install
cp .env.example .env
npm run dev
```

## Build
```bash
npm run build
```

## API configuration
Set `VITE_API_URL` in `.env` if the backend API is hosted elsewhere. Default: `http://localhost:8000/api`.

The frontend never calls Fake Store API directly; all product requests go through the backend.

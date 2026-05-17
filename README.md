# SWETZS — Neural Pokédex

Futuristic Pokémon encyclopedia (Gen 1–4) with glassmorphism cyber UI, Express API, MongoDB, Redis caching, and JWT authentication.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, React, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express, Mongoose, JWT, Redis |
| Data | MongoDB (493 Pokémon from PokeAPI) |

## Quick Start

### 1. Start databases

```bash
docker compose up -d
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # if needed
npm run seed           # ~5–10 min — fetches Gen 1–4 from PokeAPI
npm run dev
```

API: http://localhost:5000

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:3000

## Features

- **Dex** — search, type/gen/region filters, pagination
- **Detail** — stats, lore, evolution chain
- **Favorites** — JWT-protected saved Pokémon
- **Compare** — side-by-side stat matrix (up to 4)
- **Auth** — register / login

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/pokemon` | List with filters |
| GET | `/api/pokemon/:id` | Detail + evolution |
| GET | `/api/pokemon/meta/filters` | Filter metadata |
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/favorites` | User favorites |
| POST | `/api/favorites/:dexNumber` | Add favorite |
| GET | `/api/compare` | Compare list |

## Environment

**Backend** (`backend/.env`): `MONGODB_URI`, `REDIS_URL`, `JWT_SECRET`, `CORS_ORIGIN`

**Frontend** (`frontend/.env.local`): `NEXT_PUBLIC_API_URL=http://localhost:5000/api`

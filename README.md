# XEVON — Investment Platform

A full-stack fintech investment platform built with the MERN stack, featuring a premium glassmorphic dark UI.

## Tech Stack

| Layer     | Technology                            |
|-----------|---------------------------------------|
| Frontend  | React 19, Vite, Framer Motion         |
| Backend   | Node.js, Express 5                    |
| Database  | MongoDB, Mongoose                     |
| Auth      | JWT (HTTP-only cookies), bcrypt       |
| Styling   | Vanilla CSS (custom design system)    |

## Features

- **User Dashboard** — Wallet balance, earnings overview, active plans
- **Investment Plans** — Browse & purchase yield programs
- **Deposit / Withdraw** — UPI-based deposit with screenshot proof, withdrawal requests
- **Referral System** — Unique referral codes with 10% commission
- **Profile Management** — Account details, settings
- **Admin Panel** — Statistics, user management, transaction approvals, plan CRUD

## Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB (local or Atlas)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/XEVON.git
cd XEVON
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/xevon
JWT_SECRET=your_jwt_secret
```

Seed the database (optional):

```bash
node seed.js
node seed_plans.js
```

Start the server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Project Structure

```
XEVON/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Auth middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # Cron jobs
│   ├── utils/           # Helpers
│   ├── app.js           # Express app config
│   └── server.js        # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Layout, Navigation
│   │   ├── context/     # Auth context
│   │   ├── pages/       # User & Admin pages
│   │   ├── styles/      # Design system (theme.css)
│   │   └── App.jsx      # Routes
│   └── index.html
│
└── README.md
```

## API Endpoints

| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| POST   | `/api/auth/register`              | Register new user        |
| POST   | `/api/auth/login`                 | Login                    |
| GET    | `/api/auth/me`                    | Get current user         |
| GET    | `/api/auth/logout`                | Logout                   |
| GET    | `/api/plans`                      | List all plans           |
| POST   | `/api/investments`                | Purchase a plan          |
| POST   | `/api/transactions/deposit`       | Submit deposit           |
| POST   | `/api/transactions/withdraw`      | Request withdrawal       |
| GET    | `/api/admin/stats`                | Admin statistics         |
| GET    | `/api/admin/users`                | Admin user list          |

## License

MIT

# 🏦 SQL Reserve — Full-Stack Banking System

> A production-ready internet banking platform built as a DBMS course project, demonstrating real-world applications of relational databases, ACID transactions, stored procedures, triggers, views, and application-level security.

🔗 **Live Demo:** [https://sql-reserve.onrender.com](https://sql-reserve.onrender.com)

---

## 📸 Screenshots

| Home Page | Dashboard | Admin Panel |
|-----------|-----------|-------------|
| Landing page with services, stats & CTAs | Account cards, balance, quick actions | User management, system stats, logs |

---

## ✨ Features

### 🧑‍💼 Customer Portal
- **Account Dashboard** — View all accounts with balances, status badges (Active/Frozen/Closed)
- **Deposit & Withdraw** — Instant transactions with real-time balance updates
- **Fund Transfer** — Transfer between accounts with full ACID compliance
- **Transaction History** — Paginated list with filters and transaction details
- **Profile Management** — Update personal info, change password

### 🔑 Admin Portal
- **Admin Dashboard** — 6 stat cards (users, accounts, deposits, transactions, today's activity)
- **User Management** — View all users, freeze/activate/close accounts, adjust balances
- **Transaction Monitoring** — System-wide transaction ledger with pagination
- **Audit Logs** — Timestamped security logs (status changes, large transactions, login attempts)

### 🔒 Security
- **Bcrypt** password hashing (cost factor 10)
- **AES-256-CBC** encryption for PII (phone numbers, national IDs)
- **JWT** token-based authentication with expiry
- **Rate Limiting** — 20 requests/15 min on login & register endpoints
- **CORS** restriction in production
- **Input Validation** — Email regex, password strength, phone format, username constraints

---

## 🗃️ DBMS Features Demonstrated

### Schema Design (4 Tables)
| Table | Purpose | Key Constraints |
|-------|---------|-----------------|
| `users` | User profiles & auth | `UNIQUE(username, email)`, UUID PK |
| `accounts` | Bank accounts | `FK → users (CASCADE)`, `CHECK(balance >= 0)` |
| `transactions` | Transaction records | `FK → accounts (SET NULL)`, `CHECK(amount > 0)` |
| `audit_logs` | Security audit trail | `FK → users (SET NULL)`, auto-timestamp |

### Views (3)
| View | Purpose |
|------|---------|
| `user_summary` | Aggregated user overview with account counts & total balance |
| `transaction_ledger` | Enriched transactions with sender/receiver names & account numbers |
| `system_stats` | Real-time system statistics for admin dashboard |

### Stored Procedures (3)
| Function | Purpose |
|----------|---------|
| `transfer_funds()` | Atomic fund transfer with row-level locking (`FOR UPDATE`), validation & rollback |
| `calculate_interest()` | Monthly interest calculation for active savings accounts |
| `account_statement()` | Date-range account statement with running balance |

### Triggers (3)
| Trigger | Event | Action |
|---------|-------|--------|
| `trg_account_status_change` | `AFTER UPDATE` on accounts | Logs status changes to audit_logs |
| `trg_check_account_on_txn` | `BEFORE INSERT` on transactions | Blocks transactions on frozen/closed accounts |
| `trg_flag_large_transaction` | `AFTER INSERT` on transactions | Auto-flags transactions > $10,000 |

### Indexes (9)
Performance indexes on `username`, `email`, `account.user_id`, `account.status`, `transaction.sender/receiver`, `transaction.type`, `transaction.created_at`, `audit_logs.timestamp`

### ACID Compliance
- All fund transfers wrapped in `BEGIN/COMMIT/ROLLBACK`
- Row-level locking with `SELECT ... FOR UPDATE` to prevent race conditions
- Unique account number generation with collision retry (up to 10 attempts)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TypeScript, Vite 7, Tailwind CSS 4, Framer Motion, React Router 7 |
| **Backend** | Node.js, Express 5, TypeScript |
| **Database** | PostgreSQL (with pgcrypto extension) |
| **Auth** | JWT + Bcrypt + AES-256-CBC |
| **Deployment** | Render (Web Service + PostgreSQL) |

---

## 📂 Project Structure

```
SQL-Reserve/
├── client/                     # React frontend
│   ├── src/
│   │   ├── api/client.ts       # Axios API client
│   │   ├── components/         # Layout, Navbar
│   │   ├── context/            # AuthContext (JWT state)
│   │   └── pages/              # All page components
│   │       ├── Dashboard.tsx   # Customer dashboard
│   │       ├── Transfer.tsx    # Fund transfer
│   │       ├── Profile.tsx     # Profile + password change
│   │       ├── Login.tsx       # Authentication
│   │       ├── Register.tsx    # Registration
│   │       ├── AdminDashboard.tsx  # Admin stats
│   │       ├── AdminUsers.tsx      # User management
│   │       ├── AdminTransactions.tsx
│   │       └── AdminLogs.tsx       # Audit logs
│   └── package.json
├── dbmsproject/
│   └── server/                 # Express backend
│       ├── src/
│       │   ├── index.ts        # Server entry point
│       │   ├── controllers/    # Auth, Bank, Admin logic
│       │   ├── db/index.ts     # PostgreSQL connection pool
│       │   ├── middleware/     # Auth & Admin middleware
│       │   ├── routes/         # API route definitions
│       │   └── utils/          # Encryption, Logger
│       └── db/
│           ├── init.sql        # Full schema + views + procedures + triggers
│           └── schema_design.md
├── package.json                # Root build orchestrator
├── render.yaml                 # Render deployment blueprint
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Clone & Install
```bash
git clone https://github.com/ShankarAdhikary/SQL-Reserve.git
cd SQL-Reserve
```

### 2. Database Setup
```bash
# Create database
psql -U postgres -c "CREATE DATABASE banking_system;"

# Run schema (tables, views, procedures, triggers)
psql -U postgres -d banking_system -f dbmsproject/server/db/init.sql
```

### 3. Backend Setup
```bash
cd dbmsproject/server
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npm install
npm run dev
```

### 4. Frontend Setup
```bash
cd client
npm install
npm run dev
```

### 5. Open in Browser
- Frontend: [http://localhost:5173](http://localhost:5173)
- API: [http://localhost:5000](http://localhost:5000)

---

## 🔐 Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=banking_system
DB_USER=postgres
DB_PASSWORD=yourpassword

# Or use connection string (for Render/production)
DATABASE_URL=postgresql://user:pass@host/dbname

# Auth
JWT_SECRET=your-secret-key
ENCRYPTION_KEY=32-char-hex-string

# Server
PORT=5000
NODE_ENV=development
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET | `/api/auth/profile` | Get current user profile |
| PUT | `/api/auth/profile` | Update profile |
| PUT | `/api/auth/password` | Change password |

### Banking
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bank/accounts` | Create new account |
| GET | `/api/bank/accounts` | List user's accounts |
| POST | `/api/bank/deposit` | Deposit funds |
| POST | `/api/bank/withdraw` | Withdraw funds |
| POST | `/api/bank/transfer` | Transfer between accounts |
| GET | `/api/bank/transactions` | Transaction history |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users |
| GET | `/api/admin/stats` | System statistics |
| PUT | `/api/admin/accounts/:id/status` | Freeze/Activate/Close account |
| PUT | `/api/admin/accounts/:id/balance` | Adjust account balance |
| GET | `/api/admin/transactions` | All transactions (paginated) |
| GET | `/api/admin/logs` | Audit logs (paginated) |

---

## 🏗️ Deployment

Deployed on **Render** (free tier):
- **Web Service** — Serves both API + React SPA from a single Express instance
- **PostgreSQL** — Managed database with SSL

Build pipeline:
```
npm install (client) → vite build → npm install (server) → tsc → copy client/dist → server/dist/public
```

---

## 👥 Authors

- **Shankar Adhikary** — [GitHub](https://github.com/ShankarAdhikary)

---

## 📄 License

This project is for **educational/academic purposes** as part of a DBMS course project.

---

<p align="center">
  <b>SQL Reserve</b> — Banking Made Simple, Secure & Smart
</p>

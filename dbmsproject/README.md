# SQL Reserve - Advanced DBMS & Security Demonstration

A full-stack banking system built to demonstrate real-world applications of Database Management Systems, ACID transactions, and application-level encryption.

## 🚀 Key Features
- **DBMS Demonstration:** Uses PostgreSQL with Foreign Keys, CHECK constraints, and complex SQL Transactions.
- **ACID Transfers:** Money transfers are atomic. If any part of the transaction fails (insufficient funds, invalid receiver), the entire operation is rolled back.
- **Advanced Security:** 
  - Passwords hashed with **Bcrypt**.
  - PII (Phone, National ID) encrypted at the application level using **AES-256-CBC** before being stored in the database.
  - JWT-based authentication for secure session management.
- **Modern UI:** Responsive dashboard built with React, Tailwind CSS, and Lucide Icons.

## 🛠️ Tech Stack
- **Frontend:** React (Vite, TypeScript, Tailwind CSS)
- **Backend:** Node.js (Express, TypeScript)
- **Database:** PostgreSQL

## 🚦 Getting Started

### 1. Database Setup
Ensure you have PostgreSQL running. Create a database named `banking_system` and run the initialization script:
```bash
psql -d banking_system -f server/db/init.sql
```

### 2. Backend Setup
```bash
cd server
cp .env.example .env
# Edit .env with your DB credentials
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

## 🏗️ Architecture
The system follows a clean separation of concerns. Refer to `architecture.mmd` for the system flowchart and `server/db/schema_design.md` for the database normalization details.

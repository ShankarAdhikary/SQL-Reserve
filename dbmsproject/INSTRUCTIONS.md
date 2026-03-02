# SQL Reserve - DBMS Demo Setup

This project is a **Backend-focused** banking system with an **Ultra-Minimalist Frontend** to demonstrate DBMS concepts like transactions and encryption.

## 📋 Prerequisites
- **Node.js** (v18+)
- **PostgreSQL** running locally.

---

## 🛠️ Setup
1.  **DB Config**: Update `/server/.env` with your Postgres credentials.
2.  **Initialize DB**:
    ```bash
    cd server && npx ts-node scripts/setupDb.ts
    ```
3.  **Start Server**:
    ```bash
    cd server && npm run dev
    ```

---

## 🚀 Presentation Flow
1.  **Open UI**: Go to `http://localhost:5000`. (Frontend is served by the backend).
2.  **Encryption Demo**: 
    - Sign up and Login.
    - Look at section **"3. User Profile & Encryption Check"**.
    - It shows exactly what the DB sees (Encrypted) vs what the User sees (Decrypted).
3.  **DBMS Logic**:
    - Create a bank account.
    - Perform **Deposit** and **Withdraw** operations.
    - Explain that the DB enforces `balance >= 0` via constraints.
4.  **Admin Logic**:
    - Use Postman to call `/api/admin/logs` to show the audit trail.

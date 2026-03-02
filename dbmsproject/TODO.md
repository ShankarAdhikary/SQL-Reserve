# Banking System Project Plan

## Objective
Build a "not simple, not too complicated" banking system to demonstrate real-life Database Management System (DBMS) applications. The system will include a Frontend, Backend, and Encryption.

## 1. Reference Templates (GitHub)
These repositories can serve as references for structure, schema, and logic:
- **jurkian/react-bank**: TypeScript, React, Redux, Node. Good for UI/UX and general structure.
- **Bank Management System (React.js, Node.js, MySQL)**: Specifically for DBMS demonstration. Good for schema design.
- **Secure Banking System (Java/Spring)**: Good reference for security/encryption implementation patterns (even if we use Node.js).
- **cenksari/react-banking-app-template**: Focus on modern UI/UX.

## 2. Tech Stack
- **Frontend:** React.js (Vite)
- **Backend:** Node.js (Express)
- **Database:** PostgreSQL (Ideal for showcasing "real" DBMS features like transactions, ACID compliance, stored procedures).
- **Security:**
    - `bcrypt` for password hashing.
    - `crypto` (Node.js built-in) or `pgcrypto` for encrypting sensitive fields (e.g., account numbers, PII) to demonstrate "Encryption at Rest".

## 3. Implementation Steps

### Phase 1: Setup & Architecture
- [x] Initialize project structure (Monorepo: `/client`, `/server`).
- [x] Define Database Schema (ER Diagram concepts).
- [x] Create detailed System Architecture Flowchart (`architecture.mmd`).

### Phase 2: Backend Development
- [x] Setup Express server.
- [x] Setup PostgreSQL connection.
- [x] **DBMS Demonstration:** Create SQL scripts for table creation with constraints (Foreign Keys, Checks).
- [x] Implement Auth API (Register/Login) with Password Hashing.
- [x] Implement Banking API (Create Account, Deposit, Withdraw, Transfer).
- [x] **DBMS Demonstration:** Use SQL Transactions (`BEGIN`, `COMMIT`, `ROLLBACK`) for money transfers to ensure data integrity.

### Phase 3: Frontend Development
- [x] Setup React with Vite.
- [x] Create Authentication Forms (Login/Register).
- [x] Create Dashboard (Account Overview).
- [x] Create Transaction Forms.
- [x] Visualize Transaction History.

### Phase 4: Encryption & Security (The "Advanced" Part)
- [x] Implement field-level encryption for sensitive user data (e.g., National ID, Phone Number) before storing in DB.
- [x] Demonstrate decryption on retrieval.

### Phase 5: Final Polish
- [ ] Styling (Tailwind CSS or Bootstrap).
- [ ] README with setup instructions.

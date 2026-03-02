# Database Schema Design Documentation

## 1. Normalization
The database is designed to **3rd Normal Form (3NF)** to ensure data integrity and minimize redundancy.
- `users` table handles authentication and identity.
- `accounts` table handles financial state.
- `transactions` table handles historical movements.

## 2. Security & Encryption
To demonstrate real-life security applications:
- **Hashing:** Passwords are never stored in plain text. They are hashed using `Bcrypt` at the application layer before being sent to the database.
- **Encryption at Rest:** Sensitive PII (Personally Identifiable Information) like `phone_number` and `national_id` will be encrypted using **AES-256** at the application layer. This ensures that even if the database is compromised, the data remains unreadable without the encryption key.
- **Audit Logging:** Every critical action (login, transfer, profile change) is logged in `audit_logs` for forensic analysis.

## 3. Data Integrity (ACID)
The system leverages PostgreSQL's ACID properties:
- **Atomicity:** Money transfers are wrapped in SQL Transactions (`BEGIN`, `COMMIT`). If the deduction from the sender fails, the addition to the receiver will never happen.
- **Consistency:** `CHECK` constraints ensure balances never go below zero and transaction amounts are always positive.
- **Durability:** PostgreSQL ensures that once a transaction is committed, it remains so even in the event of a power failure.

## 4. Scalability
- **UUIDs:** Used as primary keys instead of serial integers to prevent enumeration attacks and allow for easier data merging in distributed systems.
- **Indexes:** Created on frequently queried columns (`username`, `user_id`) to maintain performance as the dataset grows.

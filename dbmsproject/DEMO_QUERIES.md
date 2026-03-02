# 🕵️ Database Demo Queries (Cheatsheet)

Use these SQL commands to inspect the database directly and prove your system works during your presentation.

## 1. Connect to Database
If you have `psql` installed, run this in your terminal:
```bash
psql -h localhost -U postgres -d banking_system
```
*(Password is likely `password` unless you changed it in `.env`)*

---

## 2. Show Users & Encryption
Run this to show that **PII data is encrypted** and **passwords are hashed**:

```sql
SELECT username, full_name, phone_encrypted, national_id_encrypted, password_hash 
FROM users;
```
**Talking Point:** "Notice how `phone_encrypted` and `national_id_encrypted` are unreadable strings. Even if a hacker steals this database, they can't call our customers."

---

## 3. Show Accounts & Constraints
Show the account balances and types:

```sql
SELECT u.username, a.account_number, a.account_type, a.balance 
FROM accounts a
JOIN users u ON a.user_id = u.user_id;
```

**Talking Point:** "Here we see the relational data. We are joining `accounts` with `users` using a Foreign Key."

---

## 4. Verify Transactions (The "ACID" Test)
After performing a transfer in the UI, run this to see the audit trail:

```sql
SELECT t.transaction_id, t.amount, t.transaction_type, t.status, t.created_at
FROM transactions t
ORDER BY t.created_at DESC;
```

**Talking Point:** "Every movement of money is recorded here. The system uses SQL Transactions (`BEGIN`, `COMMIT`) to ensure that `accounts` and `transactions` tables are always in sync."

---

## 5. Prove Constraints (Live Fail Test)
Try to insert a negative balance directly into the DB (this should fail):

```sql
INSERT INTO accounts (user_id, account_number, balance) 
VALUES ((SELECT user_id FROM users LIMIT 1), '9999999999', -500);
```

**Result:** You should see an error: `new row for relation "accounts" violates check constraint "check_positive_balance"`.
## 6. Admin Panel (Backend Only)
Since we added an Admin Panel backend, you can show these queries to prove "Administrative Oversight":

### View All System Logs
```sql
SELECT l.timestamp, u.username, l.action, l.details, l.ip_address
FROM audit_logs l
LEFT JOIN users u ON l.user_id = u.user_id
ORDER BY l.timestamp DESC;
```
**Talking Point:** "This is our Audit Trail. It tracks every login, transfer, and failure. It's essential for compliance and security forensics."

### View Global Bank Liquidity
```sql
SELECT role, COUNT(*) as user_count, SUM(total_user_balance) as bank_total
FROM (
    SELECT u.role, SUM(a.balance) as total_user_balance
    FROM users u
    JOIN accounts a ON u.user_id = a.user_id
    GROUP BY u.user_id, u.role
) user_totals
GROUP BY role;
```
**Talking Point:** "As an admin, I can query the total deposits across all user accounts to monitor the bank's total liquidity."

-- ═══════════════════════════════════════════════════════════
--  SQL Reserve — Demo Seed Data
--  Run AFTER init.sql to populate with sample data
--  Passwords: All users use "Password1" (bcrypt hashed)
-- ═══════════════════════════════════════════════════════════

-- Bcrypt hash for "Password1" (cost 10)
-- $2b$10$LJ9dYrmZJOQy9pQIJKz6/.hCnqp3AIVhE.YR6Q8IjQKhVn6EMHWWW

-- ─── Admin User ────────────────────────────────────────
INSERT INTO users (username, email, password_hash, full_name, phone_encrypted, national_id_encrypted, role)
VALUES (
  'admin',
  'admin@sqlreserve.com',
  '$2b$10$LJ9dYrmZJOQy9pQIJKz6/.hCnqp3AIVhE.YR6Q8IjQKhVn6EMHWWW',
  'System Administrator',
  'encrypted_phone_placeholder',
  'encrypted_id_placeholder',
  'ADMIN'
) ON CONFLICT (username) DO NOTHING;

-- ─── Demo Users ────────────────────────────────────────
INSERT INTO users (username, email, password_hash, full_name, phone_encrypted, national_id_encrypted, role)
VALUES 
  ('john_doe', 'john@example.com', '$2b$10$LJ9dYrmZJOQy9pQIJKz6/.hCnqp3AIVhE.YR6Q8IjQKhVn6EMHWWW', 'John Doe', 'encrypted_phone_1', 'encrypted_id_1', 'USER'),
  ('jane_smith', 'jane@example.com', '$2b$10$LJ9dYrmZJOQy9pQIJKz6/.hCnqp3AIVhE.YR6Q8IjQKhVn6EMHWWW', 'Jane Smith', 'encrypted_phone_2', 'encrypted_id_2', 'USER'),
  ('bob_wilson', 'bob@example.com', '$2b$10$LJ9dYrmZJOQy9pQIJKz6/.hCnqp3AIVhE.YR6Q8IjQKhVn6EMHWWW', 'Bob Wilson', 'encrypted_phone_3', 'encrypted_id_3', 'USER')
ON CONFLICT (username) DO NOTHING;

-- ─── Demo Accounts ─────────────────────────────────────
-- Using sub-selects to get user_ids dynamically
INSERT INTO accounts (user_id, account_number, account_type, balance)
SELECT user_id, '1000000001', 'SAVINGS', 15000.00
FROM users WHERE username = 'john_doe'
ON CONFLICT (account_number) DO NOTHING;

INSERT INTO accounts (user_id, account_number, account_type, balance)
SELECT user_id, '1000000002', 'CHECKING', 5200.50
FROM users WHERE username = 'john_doe'
ON CONFLICT (account_number) DO NOTHING;

INSERT INTO accounts (user_id, account_number, account_type, balance)
SELECT user_id, '1000000003', 'SAVINGS', 32000.00
FROM users WHERE username = 'jane_smith'
ON CONFLICT (account_number) DO NOTHING;

INSERT INTO accounts (user_id, account_number, account_type, balance)
SELECT user_id, '1000000004', 'CHECKING', 8750.25
FROM users WHERE username = 'bob_wilson'
ON CONFLICT (account_number) DO NOTHING;

-- ─── Demo Transactions ────────────────────────────────
-- Deposit into John's savings
INSERT INTO transactions (sender_account_id, receiver_account_id, amount, transaction_type, description, status)
SELECT a.account_id, a.account_id, 5000.00, 'DEPOSIT', 'Initial deposit', 'COMPLETED'
FROM accounts a WHERE a.account_number = '1000000001';

-- Deposit into Jane's savings  
INSERT INTO transactions (sender_account_id, receiver_account_id, amount, transaction_type, description, status)
SELECT a.account_id, a.account_id, 10000.00, 'DEPOSIT', 'Salary credit', 'COMPLETED'
FROM accounts a WHERE a.account_number = '1000000003';

-- Transfer from Jane to John
INSERT INTO transactions (sender_account_id, receiver_account_id, amount, transaction_type, description, status)
SELECT 
  (SELECT account_id FROM accounts WHERE account_number = '1000000003'),
  (SELECT account_id FROM accounts WHERE account_number = '1000000001'),
  1500.00, 'TRANSFER', 'Rent payment', 'COMPLETED';

-- Withdrawal from Bob
INSERT INTO transactions (sender_account_id, receiver_account_id, amount, transaction_type, description, status)
SELECT a.account_id, a.account_id, 250.00, 'WITHDRAWAL', 'ATM withdrawal', 'COMPLETED'
FROM accounts a WHERE a.account_number = '1000000004';

-- ─── Demo Audit Logs ──────────────────────────────────
INSERT INTO audit_logs (user_id, action, details, ip_address)
SELECT user_id, 'USER_REGISTERED', 'Demo seed: Account created', '127.0.0.1'
FROM users WHERE username IN ('john_doe', 'jane_smith', 'bob_wilson');

SELECT 'Seed data inserted successfully!' AS status;

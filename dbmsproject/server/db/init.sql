-- Banking System Database Schema
-- Demonstrating DBMS features: Constraints, Relationships, ACID Compliance,
-- Views, Stored Procedures, and Triggers

-- Enable pgcrypto for DB-level encryption (optional demonstration)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Users Table
-- Stores user profile and auth info
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, -- Hashed with Bcrypt at App level
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(10) DEFAULT 'USER', -- 'USER' or 'ADMIN'
    phone_encrypted TEXT, -- Encrypted at App level (AES-256)
    national_id_encrypted TEXT, -- Encrypted at App level (AES-256)
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMPTZ
);

-- 2. Accounts Table
-- Demonstrates Foreign Keys and CHECK constraints
CREATE TABLE IF NOT EXISTS accounts (
    account_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    account_type VARCHAR(20) DEFAULT 'SAVINGS', -- 'SAVINGS', 'CHECKING', etc.
    balance DECIMAL(15, 2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(10) DEFAULT 'ACTIVE', -- 'ACTIVE', 'FROZEN', 'CLOSED'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraint: Prevent negative balance unless it's a specific account type
    CONSTRAINT check_positive_balance CHECK (balance >= 0)
);

-- 3. Transactions Table
-- Demonstrates Atomic transactions and Audit trails
-- ON DELETE SET NULL preserves transaction history when accounts are deleted
CREATE TABLE IF NOT EXISTS transactions (
    transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_account_id UUID REFERENCES accounts(account_id) ON DELETE SET NULL,
    receiver_account_id UUID REFERENCES accounts(account_id) ON DELETE SET NULL,
    amount DECIMAL(15, 2) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL, -- 'TRANSFER', 'DEPOSIT', 'WITHDRAWAL'
    description TEXT,
    status VARCHAR(10) DEFAULT 'PENDING', -- 'PENDING', 'COMPLETED', 'FAILED'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    -- Constraint: Amount must be positive
    CONSTRAINT check_amount_positive CHECK (amount > 0)
);

-- 4. Audit Logs
-- For security monitoring and debugging
CREATE TABLE IF NOT EXISTS audit_logs (
    log_id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- INDEXES for performance optimization
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_user_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_user_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_account_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_account_status ON accounts(status);
CREATE INDEX IF NOT EXISTS idx_transaction_sender ON transactions(sender_account_id);
CREATE INDEX IF NOT EXISTS idx_transaction_receiver ON transactions(receiver_account_id);
CREATE INDEX IF NOT EXISTS idx_transaction_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transaction_created ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp DESC);

-- ============================================================
-- VIEWS — Demonstrates knowledge of database views
-- ============================================================

-- View 1: User Summary — aggregated user overview for admin dashboard
CREATE OR REPLACE VIEW user_summary AS
SELECT 
    u.user_id,
    u.username,
    u.email,
    u.full_name,
    u.role,
    u.created_at,
    u.last_login,
    COUNT(a.account_id) AS account_count,
    COALESCE(SUM(a.balance), 0) AS total_balance,
    COUNT(CASE WHEN a.status = 'ACTIVE' THEN 1 END) AS active_accounts,
    COUNT(CASE WHEN a.status = 'FROZEN' THEN 1 END) AS frozen_accounts
FROM users u
LEFT JOIN accounts a ON u.user_id = a.user_id
GROUP BY u.user_id
ORDER BY u.created_at DESC;

-- View 2: Transaction Ledger — enriched transaction view with account details
CREATE OR REPLACE VIEW transaction_ledger AS
SELECT 
    t.transaction_id,
    t.amount,
    t.transaction_type,
    t.description,
    t.status,
    t.created_at,
    sa.account_number AS sender_account,
    ra.account_number AS receiver_account,
    su.full_name AS sender_name,
    ru.full_name AS receiver_name
FROM transactions t
LEFT JOIN accounts sa ON t.sender_account_id = sa.account_id
LEFT JOIN accounts ra ON t.receiver_account_id = ra.account_id
LEFT JOIN users su ON sa.user_id = su.user_id
LEFT JOIN users ru ON ra.user_id = ru.user_id
ORDER BY t.created_at DESC;

-- View 3: System Statistics — aggregate stats for admin dashboard
CREATE OR REPLACE VIEW system_stats AS
SELECT
    (SELECT COUNT(*) FROM users) AS total_users,
    (SELECT COUNT(*) FROM users WHERE role = 'ADMIN') AS total_admins,
    (SELECT COUNT(*) FROM accounts) AS total_accounts,
    (SELECT COUNT(*) FROM accounts WHERE status = 'ACTIVE') AS active_accounts,
    (SELECT COUNT(*) FROM accounts WHERE status = 'FROZEN') AS frozen_accounts,
    (SELECT COALESCE(SUM(balance), 0) FROM accounts) AS total_deposits,
    (SELECT COUNT(*) FROM transactions) AS total_transactions,
    (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE transaction_type = 'TRANSFER' AND status = 'COMPLETED') AS total_transfer_volume,
    (SELECT COUNT(*) FROM transactions WHERE created_at >= CURRENT_DATE) AS today_transactions;

-- ============================================================
-- STORED PROCEDURES — Demonstrates advanced SQL capabilities
-- ============================================================

-- Procedure 1: Transfer Funds (complete atomic transfer)
CREATE OR REPLACE FUNCTION transfer_funds(
    p_sender_account_id UUID,
    p_receiver_account_id UUID,
    p_amount DECIMAL,
    p_description TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_sender_balance DECIMAL;
    v_sender_status VARCHAR;
    v_receiver_status VARCHAR;
    v_transaction_id UUID;
BEGIN
    -- Lock rows to prevent race conditions
    SELECT balance, status INTO v_sender_balance, v_sender_status
    FROM accounts WHERE account_id = p_sender_account_id FOR UPDATE;

    SELECT status INTO v_receiver_status
    FROM accounts WHERE account_id = p_receiver_account_id FOR UPDATE;

    -- Validations
    IF v_sender_status != 'ACTIVE' THEN
        RAISE EXCEPTION 'Sender account is not active';
    END IF;
    IF v_receiver_status != 'ACTIVE' THEN
        RAISE EXCEPTION 'Receiver account is not active';
    END IF;
    IF v_sender_balance < p_amount THEN
        RAISE EXCEPTION 'Insufficient funds';
    END IF;
    IF p_sender_account_id = p_receiver_account_id THEN
        RAISE EXCEPTION 'Cannot transfer to same account';
    END IF;

    -- Debit sender
    UPDATE accounts SET balance = balance - p_amount WHERE account_id = p_sender_account_id;
    -- Credit receiver
    UPDATE accounts SET balance = balance + p_amount WHERE account_id = p_receiver_account_id;

    -- Record transaction
    INSERT INTO transactions (sender_account_id, receiver_account_id, amount, transaction_type, description, status)
    VALUES (p_sender_account_id, p_receiver_account_id, p_amount, 'TRANSFER', p_description, 'COMPLETED')
    RETURNING transaction_id INTO v_transaction_id;

    RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql;

-- Procedure 2: Calculate interest for savings accounts
CREATE OR REPLACE FUNCTION calculate_interest(p_annual_rate DECIMAL DEFAULT 3.5)
RETURNS TABLE(account_id UUID, account_number VARCHAR, current_balance DECIMAL, interest_amount DECIMAL) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.account_id,
        a.account_number,
        a.balance AS current_balance,
        ROUND(a.balance * (p_annual_rate / 100 / 12), 2) AS interest_amount
    FROM accounts a
    WHERE a.account_type = 'SAVINGS' AND a.status = 'ACTIVE' AND a.balance > 0;
END;
$$ LANGUAGE plpgsql;

-- Procedure 3: Get account statement between dates
CREATE OR REPLACE FUNCTION account_statement(
    p_account_id UUID,
    p_start_date TIMESTAMPTZ DEFAULT (CURRENT_DATE - INTERVAL '30 days'),
    p_end_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
) RETURNS TABLE(
    txn_date TIMESTAMPTZ,
    txn_type VARCHAR,
    direction TEXT,
    amount DECIMAL,
    description TEXT,
    running_balance DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.created_at AS txn_date,
        t.transaction_type AS txn_type,
        CASE 
            WHEN t.sender_account_id = p_account_id AND t.transaction_type = 'TRANSFER' THEN 'DEBIT'
            WHEN t.receiver_account_id = p_account_id AND t.transaction_type = 'TRANSFER' THEN 'CREDIT'
            WHEN t.transaction_type = 'DEPOSIT' THEN 'CREDIT'
            WHEN t.transaction_type = 'WITHDRAWAL' THEN 'DEBIT'
            ELSE t.transaction_type
        END AS direction,
        t.amount,
        t.description,
        SUM(CASE
            WHEN t.sender_account_id = p_account_id AND t.transaction_type = 'TRANSFER' THEN -t.amount
            WHEN t.transaction_type = 'WITHDRAWAL' THEN -t.amount
            ELSE t.amount
        END) OVER (ORDER BY t.created_at) AS running_balance
    FROM transactions t
    WHERE (t.sender_account_id = p_account_id OR t.receiver_account_id = p_account_id)
      AND t.created_at BETWEEN p_start_date AND p_end_date
      AND t.status = 'COMPLETED'
    ORDER BY t.created_at;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TRIGGERS — Demonstrates event-driven database logic
-- ============================================================

-- Trigger 1: Auto-log account status changes to audit_logs
CREATE OR REPLACE FUNCTION log_account_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO audit_logs (user_id, action, details)
        VALUES (
            NEW.user_id,
            'ACCOUNT_STATUS_CHANGED',
            'Account ' || NEW.account_number || ' status changed from ' || OLD.status || ' to ' || NEW.status
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_account_status_change ON accounts;
CREATE TRIGGER trg_account_status_change
    AFTER UPDATE OF status ON accounts
    FOR EACH ROW
    EXECUTE FUNCTION log_account_status_change();

-- Trigger 2: Prevent transactions on frozen/closed accounts
CREATE OR REPLACE FUNCTION check_account_active_on_transaction()
RETURNS TRIGGER AS $$
DECLARE
    v_sender_status VARCHAR;
    v_receiver_status VARCHAR;
BEGIN
    IF NEW.sender_account_id IS NOT NULL THEN
        SELECT status INTO v_sender_status FROM accounts WHERE account_id = NEW.sender_account_id;
        IF v_sender_status IN ('FROZEN', 'CLOSED') THEN
            RAISE EXCEPTION 'Cannot create transaction: sender account is %', v_sender_status;
        END IF;
    END IF;
    IF NEW.receiver_account_id IS NOT NULL AND NEW.receiver_account_id != NEW.sender_account_id THEN
        SELECT status INTO v_receiver_status FROM accounts WHERE account_id = NEW.receiver_account_id;
        IF v_receiver_status IN ('FROZEN', 'CLOSED') THEN
            RAISE EXCEPTION 'Cannot create transaction: receiver account is %', v_receiver_status;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_account_on_txn ON transactions;
CREATE TRIGGER trg_check_account_on_txn
    BEFORE INSERT ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION check_account_active_on_transaction();

-- Trigger 3: Auto-update last_login timestamp is handled by app,
-- but we add a trigger to log large withdrawals (>10000)
CREATE OR REPLACE FUNCTION flag_large_transaction()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.amount > 10000 THEN
        INSERT INTO audit_logs (user_id, action, details)
        SELECT a.user_id, 'LARGE_TRANSACTION_ALERT',
               'Transaction of $' || NEW.amount || ' on account ' || a.account_number || ' (' || NEW.transaction_type || ')'
        FROM accounts a
        WHERE a.account_id = COALESCE(NEW.sender_account_id, NEW.receiver_account_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_flag_large_transaction ON transactions;
CREATE TRIGGER trg_flag_large_transaction
    AFTER INSERT ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION flag_large_transaction();

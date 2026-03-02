import { Request, Response } from 'express';
import { query } from '../db';
import pool from '../db';
import { logAction } from '../utils/logger';

// Extend Request type to include user from JWT (middleware will handle this)
interface AuthRequest extends Request {
  user?: { userId: string };
}

// Generate unique account number with retry on collision
const generateUniqueAccountNumber = async (): Promise<string> => {
  for (let attempt = 0; attempt < 10; attempt++) {
    const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const existing = await query('SELECT 1 FROM accounts WHERE account_number = $1', [accountNumber]);
    if (existing.rows.length === 0) return accountNumber;
  }
  throw new Error('Failed to generate unique account number after 10 attempts');
};

export const createAccount = async (req: AuthRequest, res: Response) => {
  const { accountType, initialBalance } = req.body;
  const userId = req.user?.userId;

  if (!accountType || !['SAVINGS', 'CHECKING'].includes(accountType)) {
    return res.status(400).json({ message: 'Invalid account type. Must be SAVINGS or CHECKING.' });
  }
  if (initialBalance !== undefined && (isNaN(initialBalance) || initialBalance < 0)) {
    return res.status(400).json({ message: 'Initial balance must be a non-negative number.' });
  }

  try {
    const accountNumber = await generateUniqueAccountNumber();
    
    const result = await query(
      'INSERT INTO accounts (user_id, account_number, account_type, balance) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, accountNumber, accountType, initialBalance || 0]
    );

    await logAction(userId!, 'ACCOUNT_CREATED', `New ${accountType} account: ${accountNumber}`, req.ip);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating account' });
  }
};

export const getAccounts = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  try {
    const result = await query('SELECT * FROM accounts WHERE user_id = $1', [userId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching accounts' });
  }
};

export const transfer = async (req: AuthRequest, res: Response) => {
  const { fromAccountId, toAccountNumber, amount, description } = req.body;
  const userId = req.user?.userId;

  // Input validation
  if (!fromAccountId || !toAccountNumber) {
    return res.status(400).json({ message: 'From account and recipient account number are required.' });
  }
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Transfer amount must be a positive number.' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Start Transaction

    // 1. Check sender account ownership, status, and balance
    const senderRes = await client.query(
      'SELECT * FROM accounts WHERE account_id = $1 AND user_id = $2 FOR UPDATE', 
      [fromAccountId, userId]
    );
    
    if (senderRes.rows.length === 0) {
      throw new Error('Sender account not found or unauthorized');
    }

    const senderAccount = senderRes.rows[0];
    if (senderAccount.status !== 'ACTIVE') {
      throw new Error('Your account is frozen or closed. Please contact the bank.');
    }
    if (parseFloat(senderAccount.balance) < amount) {
      throw new Error('Insufficient funds');
    }

    // 2. Find receiver account
    const receiverRes = await client.query(
      'SELECT * FROM accounts WHERE account_number = $1 FOR UPDATE',
      [toAccountNumber]
    );

    if (receiverRes.rows.length === 0) {
      throw new Error('Receiver account not found');
    }
    const receiverAccount = receiverRes.rows[0];
    if (receiverAccount.status !== 'ACTIVE') {
      throw new Error('Recipient account is frozen or closed.');
    }
    if (receiverAccount.account_id === fromAccountId) {
      throw new Error('Cannot transfer to the same account.');
    }

    // 3. Perform the deduction
    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE account_id = $2',
      [amount, fromAccountId]
    );

    // 4. Perform the addition
    await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE account_id = $2',
      [amount, receiverAccount.account_id]
    );

    // 5. Record Transaction
    await client.query(
      'INSERT INTO transactions (sender_account_id, receiver_account_id, amount, transaction_type, description, status) VALUES ($1, $2, $3, $4, $5, $6)',
      [fromAccountId, receiverAccount.account_id, amount, 'TRANSFER', description, 'COMPLETED']
    );

    await client.query('COMMIT'); // Commit Transaction
    
    await logAction(userId!, 'TRANSFER_COMPLETED', `Sent $${amount} to ${toAccountNumber}`, req.ip);

    res.json({ message: 'Transfer successful' });

  } catch (error: any) {
    await client.query('ROLLBACK'); // Rollback on error
    console.error(error);
    await logAction(userId!, 'TRANSFER_FAILED', `Failed to send $${amount}: ${error.message}`, req.ip);
    res.status(400).json({ message: error.message || 'Transaction failed' });
  } finally {
    client.release();
  }
};

export const deposit = async (req: AuthRequest, res: Response) => {
  const { accountId, amount } = req.body;
  const userId = req.user?.userId;

  if (!accountId) {
    return res.status(400).json({ message: 'Account ID is required.' });
  }
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Deposit amount must be a positive number.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check account is active (with row lock)
    const accRes = await client.query(
      'SELECT status FROM accounts WHERE account_id = $1 AND user_id = $2 FOR UPDATE',
      [accountId, userId]
    );
    if (accRes.rows.length === 0) {
      throw new Error('Account not found.');
    }
    if (accRes.rows[0].status !== 'ACTIVE') {
      throw new Error('Account is frozen or closed. Cannot deposit.');
    }

    await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE account_id = $2',
      [amount, accountId]
    );

    await client.query(
      'INSERT INTO transactions (sender_account_id, receiver_account_id, amount, transaction_type, description, status) VALUES ($1, $2, $3, $4, $5, $6)',
      [accountId, accountId, amount, 'DEPOSIT', 'Cash deposit', 'COMPLETED']
    );

    await client.query('COMMIT');
    await logAction(userId!, 'DEPOSIT', `Deposited $${amount}`, req.ip);
    res.json({ message: 'Deposit successful' });
  } catch (error: any) {
    await client.query('ROLLBACK');
    res.status(400).json({ message: error.message || 'Deposit failed' });
  } finally {
    client.release();
  }
};

export const withdraw = async (req: AuthRequest, res: Response) => {
  const { accountId, amount } = req.body;
  const userId = req.user?.userId;

  if (!accountId) {
    return res.status(400).json({ message: 'Account ID is required.' });
  }
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Withdrawal amount must be a positive number.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check account is active and has sufficient funds (with row lock)
    const accRes = await client.query(
      'SELECT status, balance FROM accounts WHERE account_id = $1 AND user_id = $2 FOR UPDATE',
      [accountId, userId]
    );
    if (accRes.rows.length === 0) {
      throw new Error('Account not found.');
    }
    if (accRes.rows[0].status !== 'ACTIVE') {
      throw new Error('Account is frozen or closed. Cannot withdraw.');
    }
    if (parseFloat(accRes.rows[0].balance) < amount) {
      throw new Error('Insufficient funds.');
    }

    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE account_id = $2',
      [amount, accountId]
    );

    await client.query(
      'INSERT INTO transactions (sender_account_id, receiver_account_id, amount, transaction_type, description, status) VALUES ($1, $2, $3, $4, $5, $6)',
      [accountId, accountId, amount, 'WITHDRAWAL', 'Cash withdrawal', 'COMPLETED']
    );

    await client.query('COMMIT');
    await logAction(userId!, 'WITHDRAWAL', `Withdrew $${amount}`, req.ip);
    res.json({ message: 'Withdrawal successful' });
  } catch (error: any) {
    await client.query('ROLLBACK');
    res.status(400).json({ message: error.message || 'Withdrawal failed' });
  } finally {
    client.release();
  }
};

// Get transaction history for the logged-in user
export const getTransactions = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = (page - 1) * limit;

  try {
    const countRes = await query(
      `SELECT COUNT(*) FROM transactions t
       JOIN accounts sa ON t.sender_account_id = sa.account_id
       JOIN accounts ra ON t.receiver_account_id = ra.account_id
       WHERE sa.user_id = $1 OR ra.user_id = $1`,
      [userId]
    );
    const total = parseInt(countRes.rows[0].count);

    const result = await query(
      `SELECT t.*, 
              sa.account_number as sender_acc,
              ra.account_number as receiver_acc,
              CASE 
                WHEN sa.user_id = $1 AND t.transaction_type = 'TRANSFER' THEN 'DEBIT'
                WHEN ra.user_id = $1 AND t.transaction_type = 'TRANSFER' THEN 'CREDIT'
                WHEN t.transaction_type = 'DEPOSIT' THEN 'CREDIT'
                WHEN t.transaction_type = 'WITHDRAWAL' THEN 'DEBIT'
                ELSE t.transaction_type
              END as direction
       FROM transactions t
       JOIN accounts sa ON t.sender_account_id = sa.account_id
       JOIN accounts ra ON t.receiver_account_id = ra.account_id
       WHERE sa.user_id = $1 OR ra.user_id = $1
       ORDER BY t.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    res.json({
      transactions: result.rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transaction history' });
  }
};

import { Request, Response } from 'express';
import { query } from '../db';
import pool from '../db';
import { logAction } from '../utils/logger';

interface AuthRequest extends Request {
  user?: { userId: string };
}

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(`
      SELECT u.user_id, u.username, u.email, u.full_name, u.role, u.created_at, u.last_login,
             COUNT(a.account_id) as account_count,
             COALESCE(SUM(a.balance), 0) as total_balance
      FROM users u
      LEFT JOIN accounts a ON u.user_id = a.user_id
      GROUP BY u.user_id
      ORDER BY u.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT t.*, 
             sa.account_number as sender_acc, 
             ra.account_number as receiver_acc
      FROM transactions t
      JOIN accounts sa ON t.sender_account_id = sa.account_id
      JOIN accounts ra ON t.receiver_account_id = ra.account_id
      ORDER BY t.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions' });
  }
};

export const getSystemLogs = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = (page - 1) * limit;

  try {
    const countRes = await query('SELECT COUNT(*) FROM audit_logs');
    const total = parseInt(countRes.rows[0].count);

    const result = await query(`
      SELECT l.*, u.username 
      FROM audit_logs l
      LEFT JOIN users u ON l.user_id = u.user_id
      ORDER BY l.timestamp DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    res.json({
      logs: result.rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching system logs' });
  }
};

// Get all accounts for a specific user (admin view)
export const getUserAccounts = async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;
  try {
    const result = await query(
      'SELECT * FROM accounts WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user accounts' });
  }
};

// Admin: Adjust account balance (credit or debit)
export const adjustBalance = async (req: AuthRequest, res: Response) => {
  const { accountId, amount, type, reason } = req.body;
  const adminId = req.user?.userId;

  if (!accountId || !amount || !type) {
    return res.status(400).json({ message: 'Account ID, amount, and type (CREDIT/DEBIT) are required.' });
  }
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Amount must be a positive number.' });
  }
  if (!['CREDIT', 'DEBIT'].includes(type)) {
    return res.status(400).json({ message: 'Type must be CREDIT or DEBIT.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const accRes = await client.query('SELECT * FROM accounts WHERE account_id = $1 FOR UPDATE', [accountId]);
    if (accRes.rows.length === 0) {
      throw new Error('Account not found.');
    }

    const account = accRes.rows[0];
    if (type === 'DEBIT' && parseFloat(account.balance) < amount) {
      throw new Error('Insufficient balance for this debit adjustment.');
    }

    const operator = type === 'CREDIT' ? '+' : '-';
    await client.query(
      `UPDATE accounts SET balance = balance ${operator} $1 WHERE account_id = $2`,
      [amount, accountId]
    );

    await client.query(
      'INSERT INTO transactions (sender_account_id, receiver_account_id, amount, transaction_type, description, status) VALUES ($1, $2, $3, $4, $5, $6)',
      [accountId, accountId, amount, type === 'CREDIT' ? 'DEPOSIT' : 'WITHDRAWAL', `Admin adjustment: ${reason || 'N/A'}`, 'COMPLETED']
    );

    await client.query('COMMIT');
    await logAction(adminId!, 'ADMIN_BALANCE_ADJUST', `${type} $${amount} on account ${account.account_number}. Reason: ${reason || 'N/A'}`, req.ip);

    res.json({ message: `Balance ${type.toLowerCase()}ed successfully.` });
  } catch (error: any) {
    await client.query('ROLLBACK');
    res.status(400).json({ message: error.message || 'Error adjusting balance' });
  } finally {
    client.release();
  }
};

// Admin: Freeze or Activate an account
export const updateAccountStatus = async (req: AuthRequest, res: Response) => {
  const { accountId, status } = req.body;
  const adminId = req.user?.userId;

  if (!accountId || !status) {
    return res.status(400).json({ message: 'Account ID and status are required.' });
  }
  if (!['ACTIVE', 'FROZEN', 'CLOSED'].includes(status)) {
    return res.status(400).json({ message: 'Status must be ACTIVE, FROZEN, or CLOSED.' });
  }

  try {
    const accRes = await query('SELECT * FROM accounts WHERE account_id = $1', [accountId]);
    if (accRes.rows.length === 0) {
      return res.status(404).json({ message: 'Account not found.' });
    }

    await query('UPDATE accounts SET status = $1 WHERE account_id = $2', [status, accountId]);

    await logAction(adminId!, 'ADMIN_ACCOUNT_STATUS', `Set account ${accRes.rows[0].account_number} to ${status}`, req.ip);

    res.json({ message: `Account status updated to ${status}.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating account status' });
  }
};

// Admin: Delete a user and all their data
export const deleteUser = async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;
  const adminId = req.user?.userId;

  if (userId === adminId) {
    return res.status(400).json({ message: 'You cannot delete your own admin account.' });
  }

  try {
    const userRes = await query('SELECT username, role FROM users WHERE user_id = $1', [userId]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    if (userRes.rows[0].role === 'ADMIN') {
      return res.status(400).json({ message: 'Cannot delete another admin account.' });
    }

    // CASCADE will handle accounts → transactions cleanup
    await query('DELETE FROM users WHERE user_id = $1', [userId]);

    await logAction(adminId!, 'ADMIN_DELETE_USER', `Deleted user: ${userRes.rows[0].username}`, req.ip);

    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// Admin: Get system statistics summary (uses the system_stats view)
export const getAdminStats = async (req: AuthRequest, res: Response) => {
  try {
    const stats = await query('SELECT * FROM system_stats');
    const recentTxn = await query(`
      SELECT t.*, sa.account_number as sender_acc, ra.account_number as receiver_acc
      FROM transactions t
      LEFT JOIN accounts sa ON t.sender_account_id = sa.account_id
      LEFT JOIN accounts ra ON t.receiver_account_id = ra.account_id
      ORDER BY t.created_at DESC
      LIMIT 5
    `);
    res.json({
      stats: stats.rows[0] || {},
      recentTransactions: recentTxn.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching admin stats' });
  }
};

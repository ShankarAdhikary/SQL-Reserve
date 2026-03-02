import { Request, Response, NextFunction } from 'express';
import { query } from '../db';

interface AuthRequest extends Request {
  user?: { userId: string };
}

export const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.userId;

  try {
    const result = await query('SELECT role FROM users WHERE user_id = $1', [userId]);
    if (result.rows.length === 0 || result.rows[0].role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error during role check' });
  }
};

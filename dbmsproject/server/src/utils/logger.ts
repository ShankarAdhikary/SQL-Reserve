import { query } from '../db';

export const logAction = async (userId: string | null, action: string, details: string, ipAddress?: string) => {
  try {
    await query(
      'INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES ($1, $2, $3, $4)',
      [userId, action, details, ipAddress || 'unknown']
    );
  } catch (error) {
    console.error('Logging failed:', error);
  }
};

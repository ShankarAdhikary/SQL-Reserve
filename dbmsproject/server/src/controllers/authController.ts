import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db';
import { encrypt, decrypt } from '../utils/encryption';
import { logAction } from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const getProfile = async (req: any, res: Response) => {
  try {
    const result = await query('SELECT * FROM users WHERE user_id = $1', [req.user.userId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = result.rows[0];
    
    // Decrypt the data for the user's eyes only
    const decryptedPhone = decrypt(user.phone_encrypted);
    const decryptedNationalId = decrypt(user.national_id_encrypted);

    res.json({
      username: user.username,
      fullName: user.full_name,
      email: user.email,
      phoneDecrypted: decryptedPhone,
      nationalIdDecrypted: decryptedNationalId,
      phoneEncryptedInDB: user.phone_encrypted // Showing the "stuff" is encrypted in DB
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

export const register = async (req: Request, res: Response) => {
  const { username, email, password, fullName, phone, nationalId } = req.body;

  // Input validation
  if (!username || !email || !password || !fullName || !phone || !nationalId) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  if (username.length < 3 || username.length > 30) {
    return res.status(400).json({ message: 'Username must be 3-30 characters.' });
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return res.status(400).json({ message: 'Username can only contain letters, numbers, and underscores.' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
  }
  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({ message: 'Password must contain at least one uppercase letter.' });
  }
  if (!/[0-9]/.test(password)) {
    return res.status(400).json({ message: 'Password must contain at least one number.' });
  }
  if (fullName.length < 2 || fullName.length > 100) {
    return res.status(400).json({ message: 'Full name must be 2-100 characters.' });
  }
  const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: 'Invalid phone number format.' });
  }

  try {
    // 1. Check if user exists
    const userCheck = await query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User or Email already exists' });
    }

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Encrypt Sensitive Data
    const encryptedPhone = encrypt(phone);
    const encryptedNationalId = encrypt(nationalId);

    // 4. Check if this is the first user (make them ADMIN)
    const countRes = await query('SELECT COUNT(*) FROM users');
    const role = parseInt(countRes.rows[0].count) === 0 ? 'ADMIN' : 'USER';

    // 5. Save to DB
    const newUser = await query(
      'INSERT INTO users (username, email, password_hash, full_name, phone_encrypted, national_id_encrypted, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id, username, role',
      [username, email, passwordHash, fullName, encryptedPhone, encryptedNationalId, role]
    );

    await logAction(newUser.rows[0].user_id, 'USER_REGISTERED', `New account created: ${username} (${role})`, req.ip);

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const result = await query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      await logAction(user.user_id, 'LOGIN_FAILED', 'Invalid password attempt', req.ip);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    await query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1', [user.user_id]);
    await logAction(user.user_id, 'LOGIN_SUCCESS', 'User logged in', req.ip);

    const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user.user_id,
        username: user.username,
        fullName: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  const { fullName, email, phone } = req.body;
  const userId = req.user?.userId;

  try {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (fullName) {
      if (fullName.length < 2 || fullName.length > 100) {
        return res.status(400).json({ message: 'Full name must be 2-100 characters.' });
      }
      updates.push(`full_name = $${paramIndex++}`);
      values.push(fullName);
    }
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
      }
      // Check email uniqueness
      const emailCheck = await query('SELECT user_id FROM users WHERE email = $1 AND user_id != $2', [email, userId]);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ message: 'Email is already in use by another account.' });
      }
      updates.push(`email = $${paramIndex++}`);
      values.push(email);
    }
    if (phone) {
      const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: 'Invalid phone number format.' });
      }
      const encryptedPhone = encrypt(phone);
      updates.push(`phone_encrypted = $${paramIndex++}`);
      values.push(encryptedPhone);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update.' });
    }

    values.push(userId);
    await query(
      `UPDATE users SET ${updates.join(', ')} WHERE user_id = $${paramIndex}`,
      values
    );

    await logAction(userId, 'PROFILE_UPDATED', `Updated fields: ${updates.map(u => u.split(' = ')[0]).join(', ')}`, req.ip);

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// Change password
export const changePassword = async (req: any, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user?.userId;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current password and new password are required.' });
  }

  // Password strength validation
  if (newPassword.length < 8) {
    return res.status(400).json({ message: 'New password must be at least 8 characters long.' });
  }
  if (!/[A-Z]/.test(newPassword)) {
    return res.status(400).json({ message: 'New password must contain at least one uppercase letter.' });
  }
  if (!/[0-9]/.test(newPassword)) {
    return res.status(400).json({ message: 'New password must contain at least one number.' });
  }

  try {
    const result = await query('SELECT password_hash FROM users WHERE user_id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, result.rows[0].password_hash);
    if (!isMatch) {
      await logAction(userId, 'PASSWORD_CHANGE_FAILED', 'Incorrect current password', req.ip);
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    await query('UPDATE users SET password_hash = $1 WHERE user_id = $2', [newHash, userId]);

    await logAction(userId, 'PASSWORD_CHANGED', 'Password changed successfully', req.ip);

    res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error changing password' });
  }
};

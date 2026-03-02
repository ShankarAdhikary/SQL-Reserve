import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Support Render's DATABASE_URL or individual env vars
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'banking_system',
      password: process.env.DB_PASSWORD || 'password',
      port: parseInt(process.env.DB_PORT || '5432'),
    });

export const query = (text: string, params?: any[]) => pool.query(text, params);

export default pool;

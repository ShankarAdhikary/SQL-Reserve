import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../.env') });

const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
};

const setup = async () => {
  console.log('🔄 Attempting to connect to PostgreSQL...');
  
  // 1. Connect to default 'postgres' database to create the new DB
  const client = new Client({ ...dbConfig, database: 'postgres' });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL server.');

    // 2. Create Database if not exists
    const dbName = process.env.DB_NAME || 'banking_system';
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);
    
    if (res.rowCount === 0) {
      console.log(`✨ Creating database "${dbName}"...`);
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log('✅ Database created.');
    } else {
      console.log(`ℹ️ Database "${dbName}" already exists.`);
    }
    
    await client.end();

    // 3. Connect to the new database and run init.sql
    console.log(`🔄 Applying schema to "${dbName}"...`);
    const dbClient = new Client({ ...dbConfig, database: dbName });
    await dbClient.connect();

    const sqlPath = path.join(__dirname, '../db/init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    await dbClient.query(sql);
    console.log('✅ Schema applied successfully.');
    await dbClient.end();
    
    console.log('🚀 Database setup complete!');
    process.exit(0);

  } catch (err: any) {
    console.error('❌ Database Setup Failed:');
    console.error(err.message);
    console.log('\n💡 Tip: Check your server/.env file. Ensure your PostgreSQL username/password are correct.');
    console.log('   Default tried: user="postgres", password="password"');
    process.exit(1);
  }
};

setup();

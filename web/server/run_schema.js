const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      console.error('schema.sql not found at', schemaPath);
      process.exit(1);
    }

    const sql = fs.readFileSync(schemaPath, 'utf8');

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true,
    });

    console.log('Connected to MySQL. Running schema...');

    await connection.query(sql);

    console.log('Schema executed successfully.');
    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error('Error executing schema:', err.message || err);
    process.exit(1);
  }
}

run();

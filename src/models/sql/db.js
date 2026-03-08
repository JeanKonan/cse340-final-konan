// import pkg from 'pg';
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine SSL configuration
let sslConfig = false;

// Check if using a remote database (non-localhost)
const isRemoteDatabase = process.env.DATABASE_URL && 
                        !process.env.DATABASE_URL.includes('localhost') && 
                        !process.env.DATABASE_URL.includes('127.0.0.1');

if (process.env.NODE_ENV === 'production') {
    // Production: use certificate
    const caCert  = fs.readFileSync(path.join(__dirname, '../../../bin', 'byuicse-psql-cert.pem'));
    sslConfig = {
        ca: caCert,
        rejectUnauthorized: true,
        checkServerIdentity: () => { return undefined;}
    };
} else if (isRemoteDatabase) {
    // Development with remote database: use SSL without strict cert validation
    sslConfig = {
        rejectUnauthorized: false
    };
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: sslConfig
});

export default pool;
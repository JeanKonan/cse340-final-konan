import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error('Missing DATABASE_URL environment variable.');
}

const dbHost = new URL(databaseUrl).hostname;
const byuiCertPath = path.join(__dirname, '../../../bin', 'byuicse-psql-cert.pem');
const byuiCertExists = fs.existsSync(byuiCertPath);
const useRenderManagedSsl = dbHost.endsWith('render.com');

let caCert = null;
if (!useRenderManagedSsl && byuiCertExists) {
    caCert = fs.readFileSync(byuiCertPath);
}


const poolConfig = {
    connectionString: databaseUrl
};

if (useRenderManagedSsl) {
    poolConfig.ssl = {
        rejectUnauthorized: true
    };
} else if (caCert) {
    poolConfig.ssl = {
        ca: caCert,
        rejectUnauthorized: true,
        checkServerIdentity: () => {
            return undefined;
        }
    };
}

const pool = new Pool(poolConfig);

let db = null;

if (process.env.NODE_ENV?.includes('dev') && process.env.ENABLE_SQL_LOGGING === 'true') {

    db = {
        async query(text, params) {
            try {
                const start = Date.now();
                const res = await pool.query(text, params);
                const duration = Date.now() - start;
                console.log('Executed query:', {
                    text: text.replace(/\s+/g, ' ').trim(),
                    duration: `${duration}ms`,
                    rows: res.rowCount
                });
                return res;
            } catch (error) {
                console.error('Error in query:', {
                    text: text.replace(/\s+/g, ' ').trim(),
                    error: error.message
                });
                throw error;
            }
        },

        async close() {
            await pool.end();
        }
    };
} else {
    db = pool;
}

export default db;
export { caCert };
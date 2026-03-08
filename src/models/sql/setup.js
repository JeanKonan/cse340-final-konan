// import express from 'express';
import pool from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function setupDatabase() {
    try {
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        await pool.query(schema);
        console.log('Database setup completed successfully.');
    } catch (error) {
        console.error('Error setting up the database:', error);
    } finally {
        await pool.end();
    }
    }

export default setupDatabase;
// setupDatabase();
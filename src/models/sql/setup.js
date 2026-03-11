// import express from 'express';
import db from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setupDatabase = async () => {

    // Always ensure required tables/indexes exist before checking seed state.
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    await db.query(schemaSQL);

    let hasData = false;

    try {
        const result = await db.query(
            "SELECT EXISTS (SELECT 1 FROM menu_items LIMIT 1) as has_data"
        );
        hasData = result.rows[0]?.has_data || false;
    } catch (error) {
        hasData = false;
    }

    if (!hasData) {
        console.log('Seeding database...');
        const seedPath = path.join(__dirname, 'seed.sql');
        const seedSQL = fs.readFileSync(seedPath, 'utf8');
        await db.query(seedSQL);
        console.log('Database seeded successfully');
    } else {
        console.log('Database already seeded');
    }

    return true;
};

const testConnection = async () => {
    const result = await db.query('SELECT NOW() as current_time');
    console.log('Database connection successful:', result.rows[0].current_time);
    return true;
};

export { setupDatabase, testConnection };
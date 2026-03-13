import { setupDatabase, testConnection } from './setup.js';

process.env.FORCE_RESEED = 'true';

await testConnection();
await setupDatabase();
process.exit(0);

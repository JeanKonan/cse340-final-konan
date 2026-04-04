import express from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { caCert } from './src/models/sql/db.js';
import { startSessionCleanup } from './src/utils/session-cleanup.js';

import { setupDatabase, testConnection } from './src/models/sql/setup.js';
import menuRoutes from './src/controllers/menu/routes.js';
import cartRoutes from './src/controllers/cart/routes.js';
import orderRoutes from './src/controllers/order/routes.js';
import accountRoutes from './src/controllers/account/routes.js';
import adminRoutes from './src/controllers/admin/routes.js';
import kitchenRoutes from './src/controllers/kitchen/routes.js';
import contactRoutes from './src/controllers/contact/routes.js';

import router from './src/controllers/index.js';
import { addLocalVariables } from './src/middleware/global.js';
import flash from './src/middleware/flash.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PgSession = connectPgSimple(session);
const server = createServer(app);
const io = new Server(server);

// View engine setup
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    store: new PgSession({
        conObject: {
            connectionString: process.env.DATABASE_URL,
            // Configure SSL for session store connection (required by BYU-I databases)
            ssl: {
                ca: caCert,
                rejectUnauthorized: true,
                checkServerIdentity: () => { return undefined; }
            }
        },
        tableName: 'sessions',
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: NODE_ENV.includes('dev') !== true,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(addLocalVariables);
app.use(flash);
app.use('/menu', menuRoutes);
app.use('/cart', cartRoutes);
app.use('/checkout', orderRoutes);
app.use('/order', orderRoutes);
app.use('/account', accountRoutes);
app.use('/admin', adminRoutes);
app.use('/kitchen', kitchenRoutes);
app.use('/contact', contactRoutes);
app.use('/', router);

// test routes
app.get('/test', (req, res) => {
    res.send('<h1>Yofe Eats - Server Running!</h1> <a href="/menu">View Menu</a>');
});

// Start session cleanup task
startSessionCleanup();

// Socket.io connection
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('joinOrder', (orderNumber) => {
        socket.join(`order_${orderNumber}`);
        console.log(`Client joined order: ${orderNumber}`);
    });

    socket.on('joinKitchen', () => {
        socket.join('kitchen');
        console.log(`Client joined kitchen room: ${socket.id}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Make io available to routes
app.set('io', io);

// Initialize database and start server
server.listen(PORT, async () => {
    await setupDatabase();
    await testConnection();
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
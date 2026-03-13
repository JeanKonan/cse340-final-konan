import express from 'express';
import MenuController from './menu.js';

const router = express.Router();

router.use((req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/styles/menu.css">');
    next();
});

router.get('/', MenuController.showMenu);

export default router;
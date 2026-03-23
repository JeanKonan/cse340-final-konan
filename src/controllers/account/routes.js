import express from 'express';
import AccountController from './account.js';

const router = express.Router();

router.use((req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/styles/account.css">');
    next();
});

router.get('/login', AccountController.showLogin);
router.post('/login', AccountController.processLogin);
router.get('/register', AccountController.showRegister);
router.post('/register', AccountController.processRegister);
router.post('/logout', AccountController.logout);

export default router;
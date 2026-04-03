import express from 'express';
import AccountController from './account.js';
import { accountLoginValidators, accountRegisterValidators } from '../../middleware/validators.js';

const router = express.Router();

router.use((req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/styles/account.css">');
    next();
});

router.get('/login', AccountController.showLogin);
router.post('/login', accountLoginValidators, AccountController.processLogin);
router.get('/register', AccountController.showRegister);
router.post('/register', accountRegisterValidators, AccountController.processRegister);
router.get('/myorders', AccountController.showMyOrders);
router.post('/logout', AccountController.logout);

export default router;
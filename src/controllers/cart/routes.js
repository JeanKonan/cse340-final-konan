import express from 'express';
import CartController from './cart.js';

const router = express.Router();

router.use((req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/styles/cart.css">');
    next();
});

router.get('/', CartController.showCart);
router.post('/add', CartController.addToCart);
router.post('/update', CartController.updateCart);
router.post('/remove', CartController.removeFromCart);

export default router;

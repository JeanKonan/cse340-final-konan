import express from 'express';
import CartController from './cart.js';
import { cartAddValidators, cartRemoveValidators, cartUpdateValidators } from '../../middleware/validators.js';

const router = express.Router();

router.use((req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/styles/cart.css">');
    next();
});

router.get('/', CartController.showCart);
router.post('/add', cartAddValidators, CartController.addToCart);
router.post('/update', cartUpdateValidators, CartController.updateCart);
router.post('/remove', cartRemoveValidators, CartController.removeFromCart);

export default router;

import express from 'express';
import OrderController from './order.js';

const router = express.Router();

router.use((req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/styles/checkout.css">');
    res.addStyle('<link rel="stylesheet" href="/styles/confirmation.css">');
    res.addScript('<script src="/scripts/checkout.js" defer></script>');
    next();
});

router.get('/', OrderController.showCheckout);
router.post('/place', OrderController.placeOrder);
router.get('/confirmation/:orderNumber', OrderController.showConfirmation);

export default router;
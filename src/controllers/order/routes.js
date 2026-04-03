import express from 'express';
import OrderController from './order.js';
import { orderPlaceValidators } from '../../middleware/validators.js';

const router = express.Router();

router.use((req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/styles/checkout.css">');
    res.addStyle('<link rel="stylesheet" href="/styles/confirmation.css">');
    res.addStyle('<link rel="stylesheet" href="/styles/tracking.css">');
    
    res.addScript('<script src="/scripts/checkout.js" defer></script>');
    res.addScript('<script src="/scripts/tracking.js" defer></script>');
    next();
});

router.get('/', OrderController.showCheckout);
router.post('/place', orderPlaceValidators, OrderController.placeOrder);
router.get('/confirmation/:orderNumber', OrderController.showConfirmation);
router.get('/tracking/:orderNumber', OrderController.showTracking);

export default router;
import express from 'express';
import KitchenController from './kitchen.js';
import { requireStaff } from '../../middleware/staffMiddleware.js';

const router = express.Router();

router.use(requireStaff);

router.use((req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/styles/kitchen.css">');
    res.addScript('<script src="/socket.io/socket.io.js" defer></script>');
    res.addScript('<script src="/scripts/kitchen.js" defer></script>');
    next();
});

router.get('/', KitchenController.showDashboard);
router.post('/orders/:id/status', KitchenController.updateOrderStatus);
router.post('/menu/:id/availability', KitchenController.updateAvailability);

export default router;

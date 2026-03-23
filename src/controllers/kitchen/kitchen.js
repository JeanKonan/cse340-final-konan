import OrderModel from '../../models/order.js';
import MenuModel from '../../models/menu.js';
import db from '../../models/sql/db.js';

const ALLOWED_STATUSES = ['Placed', 'Preparing', 'Out for Delivery', 'Delivered'];

class KitchenController {
    static async showDashboard(req, res, next) {
        try {
            const orders = await OrderModel.getKitchenOrders();
            const menuItems = await MenuModel.getMenuItems();

            res.render('kitchen/dashboard', {
                title: 'Kitchen Dashboard',
                orders,
                menuItems,
                statuses: ALLOWED_STATUSES,
                message: req.query.message || null,
                error: req.query.error || null,
                user: req.session.user || null
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateOrderStatus(req, res, next) {
        try {
            const orderId = Number.parseInt(req.params.id, 10);
            const { status } = req.body;

            if (!ALLOWED_STATUSES.includes(status)) {
                return res.redirect('/kitchen?error=Invalid order status');
            }

            const updatedOrder = await OrderModel.updateOrderStatus(orderId, status);

            const io = req.app.get('io');
            io.to(`order_${updatedOrder.order_number}`).emit('statusUpdate', {
                orderNumber: updatedOrder.order_number,
                status
            });
            io.to('kitchen').emit('orderStatusChanged', {
                orderId: updatedOrder.id,
                status
            });

            res.redirect('/kitchen?message=Order status updated');
        } catch (error) {
            next(error);
        }
    }

    static async updateAvailability(req, res, next) {
        try {
            const itemId = Number.parseInt(req.params.id, 10);
            const isAvailable = req.body.available === 'true';

            await db.query(
                `
                    UPDATE menu_items
                    SET available = $1
                    WHERE id = $2 AND active = true
                `,
                [isAvailable, itemId]
            );

            res.redirect('/kitchen?message=Menu availability updated');
        } catch (error) {
            next(error);
        }
    }
}

export default KitchenController;

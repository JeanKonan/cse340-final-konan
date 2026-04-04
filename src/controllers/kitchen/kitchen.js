import OrderModel from '../../models/order.js';
import MenuModel from '../../models/menu.js';
import db from '../../models/sql/db.js';
import { ALLOWED_ORDER_STATUSES, getValidationErrors } from '../../middleware/validators.js';

const ALLOWED_STATUSES = ALLOWED_ORDER_STATUSES;

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
                user: req.session.user || null
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateOrderStatus(req, res, next) {
        try {
            const errors = getValidationErrors(req);
            const orderId = Number.parseInt(req.params.id, 10);
            const { status } = req.body;

            if (errors.length > 0) {
                req.flash('error', errors[0]);
                return res.redirect('/kitchen');
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

            req.flash('success', 'Order status updated');
            res.redirect('/kitchen');
        } catch (error) {
            console.error('Error updating order status:', error);
            req.flash('error', 'Unable to update order status right now.');
            res.redirect('/kitchen');
        }
    }

    static async updateAvailability(req, res, next) {
        try {
            const errors = getValidationErrors(req);
            const itemId = Number.parseInt(req.params.id, 10);
            const isAvailable = req.body.available === true || req.body.available === 'true';

            if (errors.length > 0) {
                req.flash('error', errors[0]);
                return res.redirect('/kitchen');
            }

            await db.query(
                `
                    UPDATE menu_items
                    SET available = $1
                    WHERE id = $2 AND active = true
                `,
                [isAvailable, itemId]
            );

            req.flash('success', 'Menu availability updated');
            res.redirect('/kitchen');
        } catch (error) {
            console.error('Error updating menu availability:', error);
            req.flash('error', 'Unable to update menu availability right now.');
            res.redirect('/kitchen');
        }
    }
}

export default KitchenController;

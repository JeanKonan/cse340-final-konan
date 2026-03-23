import OrderModel from "../../models/order.js";
import { startOrderSimulation } from "../../utils/orderSimulator.js";

class OrderController {
    static async showCheckout(req, res, next) {
        try {
            const cart = req.session.cart?.items || [];

            if (cart.length === 0) return res.redirect('/cart');

            const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
            const tax = subtotal * 0.06;
            const pickup = req.query.pickup === 'true';
            
            const deliveryFee = pickup ? 0 : 4.99;
            const total = subtotal + tax + deliveryFee;

            res.render('order/checkout', {
                title: 'Checkout',
                cart,
                subtotal: subtotal.toFixed(2),
                tax: tax.toFixed(2),
                pickup,
                deliveryFee: deliveryFee.toFixed(2),
                total: total.toFixed(2),
                user: req.session.user || null
            });
        } catch (error) {
            next(error);
        }
        
    }

    static async placeOrder(req, res, next) {
        try {
            const cart = req.session.cart?.items || [];
            if (cart.length === 0) return res.redirect('/cart');

            const { 
                customerName,
                customerEmail,
                customerPhone,
                pickup,
                street,
                city,
                state,
                zip,
                specialInstructions } = req.body;
            
            if (!customerName || !customerEmail || !customerPhone) {
                return res.status(400).json({ error: 'These fields are required' });
            }

            if (!pickup && (!street || !city || !state || !zip)) {
                return res.status(400).json({ error: 'Delivery address is required for delivery orders' });
            }

            const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
            const tax = subtotal * 0.06;
            const deliveryFee = pickup ? 0 : 4.99;
            const total = subtotal + tax + deliveryFee;

            const order = await OrderModel.createOrder({
                userId: req.session.user ? req.session.user.id : null,
                customerName,
                customerEmail,
                customerPhone,
                pickup,
                deliveryAddress: {
                    street,
                    city,
                    state,
                    zip
                },
                specialInstructions,
                items: cart,
                subtotal,
                tax,
                deliveryFee,
                total
            });

            req.session.cart = { items: [], total: 0 };
            const io = req.app.get('io');

            io.to('kitchen').emit('newOrder', {
                id: order.id,
                orderNumber: order.orderNumber,
                customerName,
                total,
                status: 'Placed',
                itemsSummary: cart.map((item) => `${item.quantity}x ${item.name}`).join(', ')
            });

            res.redirect(`/order/confirmation/${order.orderNumber}`);
            startOrderSimulation(io, order.id, order.orderNumber);
        } catch (error) {
            next(error);
        }
    }

    static async showConfirmation(req, res, next) {
        try {
            const order = await OrderModel.getOrderByNumber(req.params.orderNumber);
            if (!order) return res.status(404).send('Order not found');

            res.render('order/confirmation', {
                title: 'Order Confirmation',
                order,
                user: req.session.user || null
            });
        } catch (error) {
            next(error);
        }
    }

    static async showTracking(req, res, next) {
        try {
            const orderNumber = (req.params.orderNumber || '').trim();
            const order = await OrderModel.getOrderByNumber(orderNumber);
            if (!order) return res.status(404).send('Order not found');

            const tracking = await OrderModel.getOrderTracking(order.id);

            res.render('order/tracking', {
                title: 'Order Tracking',
                order,
                tracking,
                user: req.session.user || null
            });
        } catch (error) {
            next(error);
        }
    }
}

export default OrderController;
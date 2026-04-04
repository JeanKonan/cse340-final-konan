import OrderModel from "../../models/order.js";
import { startOrderSimulation } from "../../utils/orderSimulator.js";
import { getValidationErrors } from '../../middleware/validators.js';

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
                user: req.session.user || null,
                errors: [],
                formData: {}
            });
        } catch (error) {
            next(error);
        }
        
    }

    static async placeOrder(req, res, next) {
        try {
            const cart = req.session.cart?.items || [];
            if (cart.length === 0) return res.redirect('/cart');

            const errors = getValidationErrors(req);
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

            if (errors.length > 0) {
                errors.forEach((errorMessage) => {
                    req.flash('error', errorMessage);
                });

                const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
                const tax = subtotal * 0.06;
                const normalizedPickup = pickup === true || pickup === 'true';
                const deliveryFee = normalizedPickup ? 0 : 4.99;
                const total = subtotal + tax + deliveryFee;

                return res.status(400).render('order/checkout', {
                    title: 'Checkout',
                    cart,
                    subtotal: subtotal.toFixed(2),
                    tax: tax.toFixed(2),
                    pickup: normalizedPickup,
                    deliveryFee: deliveryFee.toFixed(2),
                    total: total.toFixed(2),
                    user: req.session.user || null,
                    formData: { customerName, customerEmail, customerPhone, pickup, street, city, state, zip, specialInstructions }
                });
            }

            const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
            const tax = subtotal * 0.06;
            const normalizedPickup = pickup === true || pickup === 'true';
            const deliveryFee = normalizedPickup ? 0 : 4.99;
            const total = subtotal + tax + deliveryFee;

            const order = await OrderModel.createOrder({
                userId: req.session.user ? req.session.user.id : null,
                customerName,
                customerEmail,
                customerPhone,
                pickup: normalizedPickup,
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
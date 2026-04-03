import MenuModel from "../../models/menu.js";
import { getValidationErrors } from '../../middleware/validators.js';

class CartController {
    static async initCart(req) {
        if (!req.session.cart) {
            req.session.cart = {
                items: [], // { menuItemId, name, price, quantity }
                total: 0
            };
        }
    }

    static async showCart(req, res, next) {
        try {
            await CartController.initCart(req);

            const cart = req.session.cart;

            const subtotal = cart.items.reduce((sum, item) => {
                return sum + Number(item.price) * Number(item.quantity);
            }, 0);
            const taxRate = 0.06;
            const tax = subtotal * taxRate;
            // const deliveryFee = 4.99;
            const total = subtotal + tax; // + deliveryFee;

            res.render('cart/cart', {
                title: 'Cart',
                cart: cart.items,
                subtotal: subtotal.toFixed(2),
                tax: tax.toFixed(2),
                // deliveryFee: deliveryFee.toFixed(2),
                total: total.toFixed(2),
                user: req.session.user || null,
                error: req.query.error || null
            });
        } catch (error) {
            next(error);
        }
    }

    static async addToCart(req, res, next) {
        try {
            await CartController.initCart(req);

            const { menuItemId, quantity } = req.body;
            const errors = getValidationErrors(req);

            if (errors.length > 0) {
                const fallbackUrl = '/menu';
                const referer = req.get('referer') || fallbackUrl;
                const redirectTarget = referer.includes('/cart') ? fallbackUrl : referer;
                return res.redirect(`${redirectTarget}${redirectTarget.includes('?') ? '&' : '?'}error=${encodeURIComponent(errors[0])}`);
            }

            const menuItem = await MenuModel.getMenuItemById(menuItemId);

            if (!menuItem) {
                return res.status(404).json({ error: 'Menu item not found' });
            }

            if (!menuItem.available) {
                return res.status(400).json({ error: 'This item is currently unavailable' });
            }

            const normalizedMenuItemId = Number(menuItem.id);
            const normalizedQuantity = Math.max(1, Number.parseInt(quantity, 10) || 1);
            const normalizedPrice = Number(menuItem.price);

            const existingItemIndex = req.session.cart.items.findIndex(item => Number(item.menuItemId) === normalizedMenuItemId);

            if (existingItemIndex > -1) {
                req.session.cart.items[existingItemIndex].quantity += normalizedQuantity;
            } else {
                req.session.cart.items.push({
                    menuItemId: normalizedMenuItemId,
                    name: menuItem.name,
                    price: normalizedPrice,
                    quantity: normalizedQuantity
                });
            }

            const fallbackUrl = '/menu';
            const referer = req.get('referer') || fallbackUrl;
            const redirectTarget = referer.includes('/cart') ? fallbackUrl : referer;
            res.redirect(redirectTarget);
        } catch (error) {
            next(error);
        }
    }

    static async updateCart(req, res, next) {
        try {
            await CartController.initCart(req);

            const { menuItemId, quantity } = req.body;
            const errors = getValidationErrors(req);

            if (errors.length > 0) {
                return res.redirect(`/cart?error=${encodeURIComponent(errors[0])}`);
            }

            const normalizedMenuItemId = Number(menuItemId);
            const normalizedQuantity = Number.parseInt(quantity, 10) || 0;
            const itemIndex = req.session.cart.items.findIndex(item => Number(item.menuItemId) === normalizedMenuItemId);

            if (itemIndex > -1) {
                if (normalizedQuantity > 0) {
                    req.session.cart.items[itemIndex].quantity = normalizedQuantity;
                } else {
                    req.session.cart.items.splice(itemIndex, 1);
                }
            }

            res.redirect('/cart');
        } catch (error) {
            next(error);
        }
    }

    static async removeFromCart(req, res, next) {
        try {
            await CartController.initCart(req);
            const { menuItemId } = req.body;
            const errors = getValidationErrors(req);

            if (errors.length > 0) {
                return res.redirect(`/cart?error=${encodeURIComponent(errors[0])}`);
            }

            const normalizedMenuItemId = Number(menuItemId);
            
            req.session.cart.items = req.session.cart.items.filter(item => Number(item.menuItemId) !== normalizedMenuItemId);

            res.redirect('/cart');
        } catch (error) {
            next(error);
        }
    }
}

export default CartController;
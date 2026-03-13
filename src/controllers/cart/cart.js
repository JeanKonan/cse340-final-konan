import MenuModel from "../../models/menu.js";

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
            CartController.initCart(req);

            const cart = req.session.cart;

            const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const taxRate = 0.06;
            const tax = subtotal * taxRate;
            const deliveryFee = 4.99;
            const total = subtotal + tax + deliveryFee;

            res.render('cart/view', {
                title: 'Cart',
                cart,
                subtotal: subtotal.toFixed(2),
                tax: tax.toFixed(2),
                deliveryFee: deliveryFee.toFixed(2),
                total: total.toFixed(2),
                user: req.session.user || null
            });
        } catch (error) {
            next(error);
        }
    }

    static async addToCart(req, res, next) {
        try {
            CartController.initCart(req);

            const { menuItemId, quantity } = req.body;
            const menuItem = await MenuModel.getMenuItemById(menuItemId);

            if (!menuItem) {
                return res.status(404).json({ error: 'Menu item not found' });
            }

            const existingItemIndex = req.session.cart.items.findIndex(item => item.menuItemId === menuItemId);

            if (existingItemIndex > -1) {
                req.session.cart.items[existingItemIndex].quantity += parseInt(quantity);
            } else {
                req.session.cart.items.push({
                    menuItemId: menuItem.id,
                    name: menuItem.name,
                    price: menuItem.price,
                    quantity: parseInt(quantity)
                });
            }

            res.redirect('/cart');
        } catch (error) {
            next(error);
        }
    }

    static async updateCart(req, res, next) {
        try {
            CartController.initCart(req);

            const { menuItemId, quantity } = req.body;
            const itemIndex = req.session.cart.items.findIndex(item => item.menuItemId === menuItemId);

            if (itemIndex > -1) {
                if (quantity > 0) {
                    req.session.cart.items[itemIndex].quantity = parseInt(quantity);
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
            CartController.initCart(req);
            const { menuItemId } = req.body;
            
            req.session.cart.items = req.session.cart.items.filter(item => item.menuItemId !== menuItemId);

            res.redirect('/cart');
        } catch (error) {
            next(error);
        }
    }
}

export default CartController;
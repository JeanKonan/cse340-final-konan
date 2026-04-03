import UserModel from "../../models/user.js";
import OrderModel from '../../models/order.js';
import { getValidationErrors } from '../../middleware/validators.js';

class AccountController {
    static async showLogin(req, res) {
        res.render('account/login', {
            title: 'Login',
            user: req.session.user || null,
            errors: [],
            formData: {}
        });
    }

    static async processLogin(req, res) {
        const errors = getValidationErrors(req);
        const { email, password } = req.body;

        if (errors.length > 0) {
            return res.status(400).render('account/login', {
                title: 'Login',
                error: errors[0],
                errors,
                user: null,
                formData: { email }
            });
        }

        const user = await UserModel.getUserByEmail(email);

        if (!user || !(await UserModel.verifyPassword(password, user.password_hash))) {
            return res.render('account/login', {
                title: 'Login',
                error: 'Invalid email or password',
                errors: ['Invalid email or password'],
                user: null,
                formData: { email }
            });
        }

        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        };
        res.redirect('/menu');
    }

    static async showRegister(req, res) {
        res.render('account/register', {
            title: 'Register',
            user: req.session.user || null,
            errors: [],
            formData: {}
        });
    }

    static async showMyOrders(req, res, next) {
        try {
            if (!req.session.user) {
                return res.redirect('/account/login');
            }

            const orders = await OrderModel.getOrdersByUserId(req.session.user.id);

            res.render('account/myorders', {
                title: 'My orders',
                user: req.session.user,
                orders,
                message: req.query.message || null,
                error: req.query.error || null
            });
        } catch (error) {
            next(error);
        }
    }

    static async processRegister(req, res) {
        const errors = getValidationErrors(req);
        const { name, email, password, phone } = req.body;

        if (errors.length > 0) {
            return res.status(400).render('account/register', {
                title: 'Register',
                error: errors[0],
                errors,
                user: null,
                formData: { name, email, phone }
            });
        }

        try {
            const user = await UserModel.createUser({ name, email, password, phone });
            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            };
            res.redirect('/menu');
        } catch (error) {
            res.render('account/register', {
                title: 'Register',
                error: 'Error creating user',
                errors: ['Error creating user'],
                user: null,
                formData: { name, email, phone }
            });
        }
    }

    static async logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destroy error:', err);
                return res.status(500).send('Error during logout');
            }
            res.clearCookie('connect.sid');
            res.redirect('/account/login');
        });
    }
}

export default AccountController;
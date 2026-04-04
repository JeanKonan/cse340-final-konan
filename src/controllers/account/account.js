import UserModel from "../../models/user.js";
import OrderModel from '../../models/order.js';
import { getValidationErrors } from '../../middleware/validators.js';

class AccountController {
    static async showLogin(req, res) {
        const formData = req.session.accountFormData?.login || {};

        if (req.session.accountFormData?.login) {
            delete req.session.accountFormData.login;
        }

        res.render('account/login', {
            title: 'Login',
            user: req.session.user || null,
            formData
        });
    }

    static async processLogin(req, res) {
        try {
            const errors = getValidationErrors(req);
            const { email, password } = req.body;

            if (errors.length > 0) {
                errors.forEach((errorMessage) => {
                    req.flash('error', errorMessage);
                });

                req.session.accountFormData = {
                    ...(req.session.accountFormData || {}),
                    login: { email }
                };

                return res.redirect('/account/login');
            }

            const user = await UserModel.getUserByEmail(email);

            if (!user || !(await UserModel.verifyPassword(password, user.password_hash))) {
                req.flash('error', 'Invalid email or password');
                req.session.accountFormData = {
                    ...(req.session.accountFormData || {}),
                    login: { email }
                };
                return res.redirect('/account/login');
            }

            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            };
            res.redirect('/menu');
        } catch (error) {
            console.error('Error processing login:', error);
            req.flash('error', 'Unable to log in right now. Please try again later.');
            res.redirect('/account/login');
        }
    }

    static async showRegister(req, res) {
        const formData = req.session.accountFormData?.register || {};

        if (req.session.accountFormData?.register) {
            delete req.session.accountFormData.register;
        }

        res.render('account/register', {
            title: 'Register',
            user: req.session.user || null,
            formData
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
                orders
            });
        } catch (error) {
            next(error);
        }
    }

    static async processRegister(req, res) {
        const errors = getValidationErrors(req);
        const { name, email, password, phone } = req.body;

        if (errors.length > 0) {
            errors.forEach((errorMessage) => {
                req.flash('error', errorMessage);
            });

            req.session.accountFormData = {
                ...(req.session.accountFormData || {}),
                register: { name, email, phone }
            };

            return res.redirect('/account/register');
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
            console.error('Error creating user:', error);
            req.flash('error', 'Error creating user');
            req.session.accountFormData = {
                ...(req.session.accountFormData || {}),
                register: { name, email, phone }
            };
            res.redirect('/account/register');
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
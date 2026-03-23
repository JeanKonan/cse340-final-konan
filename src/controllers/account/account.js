import UserModel from "../../models/user.js";

class AccountController {
    static async showLogin(req, res) {
        res.render('account/login', {
            title: 'Login',
            user: req.session.user || null
        });
    }

    static async processLogin(req, res) {
        const { email, password } = req.body;
        const user = await UserModel.getUserByEmail(email);

        if (!user || !(await UserModel.verifyPassword(password, user.password_hash))) {
            return res.render('account/login', {
                title: 'Login',
                error: 'Invalid email or password',
                user: null
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
            user: req.session.user || null
        });
    }

    static async processRegister(req, res) {
        const { name, email, password, phone } = req.body;

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
                user: null
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
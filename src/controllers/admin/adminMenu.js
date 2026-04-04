import db from '../../models/sql/db.js';
import MenuController from '../../models/menu.js';
import UserModel from '../../models/user.js';
import { getValidationErrors } from '../../middleware/validators.js';

const buildDashboardUrl = (section) => {
    const params = new URLSearchParams();
    params.set('section', section);
    return `/admin/menu?${params.toString()}`;
};

class AdminMenuController {
    static async showDashboard(req, res) {
        const validSections = ['menu', 'categories', 'roles'];
        const section = validSections.includes(req.query.section) ? req.query.section : 'menu';

        const menuItems = await MenuController.getMenuItems();
        const categories = await MenuController.getCategories();
        const usersResult = await db.query(`
            SELECT id, name, email, role
            FROM users
            ORDER BY id
        `);
        const users = usersResult.rows;

        res.render('admin/menu-list', {
            title: 'Admin Menu Management',
            section,
            menuItems,
            categories,
            users,
            user: req.session.user
        });
    }

    static async showAddForm(req, res) {
        const categories = await MenuController.getCategories();

        res.render('admin/menu-form', {
            title: 'Add Menu Item',
            item: null,
            categories,
            user: req.session.user,
            error: null,
            errors: [],
            formData: {}
        });
    }

    static async addMenuItem(req, res) {
        const errors = getValidationErrors(req);
        const { name, description, price, categoryId, available } = req.body;

        if (errors.length > 0) {
            errors.forEach((errorMessage) => {
                req.flash('error', errorMessage);
            });

            const categories = await MenuController.getCategories();

            return res.status(400).render('admin/menu-form', {
                title: 'Add Menu Item',
                item: null,
                categories,
                user: req.session.user,
                formData: { name, description, price, categoryId, available }
            });
        }

        const query = `
            INSERT INTO menu_items (name, description, price, category_id, available, active)
            VALUES ($1, $2, $3, $4, $5, true)
        `;

        await db.query(query, [name, description, price, categoryId, available === 'on']);
        req.flash('success', 'Menu item added');
        res.redirect(buildDashboardUrl('menu'));
    }

    static async showEditForm(req, res) {
        const errors = getValidationErrors(req);

        if (errors.length > 0) {
            req.flash('error', errors[0]);
            return res.redirect(buildDashboardUrl('menu'));
        }

        const item = await MenuController.getMenuItemById(req.params.id);
        const categories = await MenuController.getCategories();

        if (!item) {
            return res.status(404).send('Menu item not found');
        }

        res.render('admin/menu-form', {
            title: 'Edit Menu Item',
            item,
            categories,
            user: req.session.user,
            error: null,
            errors: [],
            formData: {}
        });
    }

    static async updateMenuItem(req, res) {
        const errors = getValidationErrors(req);
        const { name, description, price, categoryId, available } = req.body;

        if (errors.length > 0) {
            errors.forEach((errorMessage) => {
                req.flash('error', errorMessage);
            });

            const item = await MenuController.getMenuItemById(req.params.id);
            const categories = await MenuController.getCategories();

            if (!item) {
                return res.status(404).send('Menu item not found');
            }

            return res.status(400).render('admin/menu-form', {
                title: 'Edit Menu Item',
                item,
                categories,
                user: req.session.user,
                formData: { name, description, price, categoryId, available }
            });
        }

        const query = `
            UPDATE menu_items
            SET name = $1, description = $2, price = $3, category_id = $4, available = $5
            WHERE id = $6
        `;
        await db.query(query, [name, description, price, categoryId, available === 'on', req.params.id]);

        req.flash('success', 'Menu item updated');
        res.redirect(buildDashboardUrl('menu'));
    }

    static async deleteMenuItem(req, res) {
        const errors = getValidationErrors(req);

        if (errors.length > 0) {
            req.flash('error', errors[0]);
            return res.redirect(buildDashboardUrl('menu'));
        }

        const query = `UPDATE menu_items SET active = false WHERE id = $1`;
        await db.query(query, [req.params.id]);

        req.flash('success', 'Menu item deleted');
        res.redirect(buildDashboardUrl('menu'));
    }

    static async addCategory(req, res) {
        const errors = getValidationErrors(req);
        const { name, description, displayOrder } = req.body;

        if (errors.length > 0) {
            req.flash('error', errors[0]);
            return res.redirect(buildDashboardUrl('categories'));
        }

        try {
            await db.query(
                `
                    INSERT INTO categories (name, description, display_order)
                    VALUES ($1, $2, $3)
                `,
                [name?.trim(), description?.trim() || null, Number.parseInt(displayOrder, 10) || 0]
            );

            req.flash('success', 'Category added');
            res.redirect(buildDashboardUrl('categories'));
        } catch (error) {
            console.error('Error adding category:', error);
            req.flash('error', 'Unable to add category');
            res.redirect(buildDashboardUrl('categories'));
        }
    }

    static async updateCategory(req, res) {
        const errors = getValidationErrors(req);
        const { name, description, displayOrder } = req.body;

        if (errors.length > 0) {
            req.flash('error', errors[0]);
            return res.redirect(buildDashboardUrl('categories'));
        }

        try {
            await db.query(
                `
                    UPDATE categories
                    SET name = $1, description = $2, display_order = $3
                    WHERE id = $4
                `,
                [name?.trim(), description?.trim() || null, Number.parseInt(displayOrder, 10) || 0, req.params.id]
            );

            req.flash('success', 'Category updated');
            res.redirect(buildDashboardUrl('categories'));
        } catch (error) {
            console.error('Error updating category:', error);
            req.flash('error', 'Unable to update category');
            res.redirect(buildDashboardUrl('categories'));
        }
    }

    static async deleteCategory(req, res) {
        const errors = getValidationErrors(req);

        if (errors.length > 0) {
            req.flash('error', errors[0]);
            return res.redirect(buildDashboardUrl('categories'));
        }

        try {
            await db.query('DELETE FROM categories WHERE id = $1', [req.params.id]);
            req.flash('success', 'Category deleted');
            res.redirect(buildDashboardUrl('categories'));
        } catch (error) {
            console.error('Error deleting category:', error);
            req.flash('error', 'Unable to delete category');
            res.redirect(buildDashboardUrl('categories'));
        }
    }

    static async createStaffAccount(req, res) {
        const errors = getValidationErrors(req);
        const { name, email, password, phone, role } = req.body;

        if (errors.length > 0) {
            req.flash('error', errors[0]);
            return res.redirect(buildDashboardUrl('roles'));
        }

        try {
            await UserModel.createUser({
                name,
                email,
                password,
                phone: phone || null,
                role
            });
            req.flash('success', 'Staff account created');
            return res.redirect(buildDashboardUrl('roles'));
        } catch (error) {
            console.error('Error creating staff account:', error);
            req.flash('error', 'Unable to create staff account');
            return res.redirect(buildDashboardUrl('roles'));
        }
    }

    static async updateUserRole(req, res) {
        const errors = getValidationErrors(req);
        const { role } = req.body;

        if (errors.length > 0) {
            req.flash('error', errors[0]);
            return res.redirect(buildDashboardUrl('roles'));
        }

        const targetUserId = Number.parseInt(req.params.id, 10);
        if (targetUserId === req.session.user.id && role !== 'admin') {
            req.flash('error', 'You cannot remove your own admin access');
            return res.redirect(buildDashboardUrl('roles'));
        }

        try {
            await db.query('UPDATE users SET role = $1 WHERE id = $2', [role, targetUserId]);
            req.flash('success', 'User role updated');
            res.redirect(buildDashboardUrl('roles'));
        } catch (error) {
            console.error('Error updating user role:', error);
            req.flash('error', 'Unable to update user role');
            res.redirect(buildDashboardUrl('roles'));
        }
    }
}

export default AdminMenuController;
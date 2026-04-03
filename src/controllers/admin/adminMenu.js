import db from '../../models/sql/db.js';
import MenuController from '../../models/menu.js';
import UserModel from '../../models/user.js';
import { getValidationErrors } from '../../middleware/validators.js';

const buildDashboardUrl = (section, message = null, error = null) => {
    const params = new URLSearchParams();
    params.set('section', section);
    if (message) params.set('message', message);
    if (error) params.set('error', error);
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
            message: req.query.message || null,
            error: req.query.error || null,
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
            errors: [],
            formData: {}
        });
    }

    static async addMenuItem(req, res) {
        const errors = getValidationErrors(req);
        const { name, description, price, categoryId, available } = req.body;

        if (errors.length > 0) {
            const categories = await MenuController.getCategories();

            return res.status(400).render('admin/menu-form', {
                title: 'Add Menu Item',
                item: null,
                categories,
                user: req.session.user,
                error: errors[0],
                errors,
                formData: { name, description, price, categoryId, available }
            });
        }

        const query = `
            INSERT INTO menu_items (name, description, price, category_id, available, active)
            VALUES ($1, $2, $3, $4, $5, true)
        `;

        await db.query(query, [name, description, price, categoryId, available === 'on']);
        res.redirect(buildDashboardUrl('menu', 'Menu item added'));
    }

    static async showEditForm(req, res) {
        const errors = getValidationErrors(req);

        if (errors.length > 0) {
            return res.redirect(buildDashboardUrl('menu', null, errors[0]));
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
            errors: [],
            formData: {}
        });
    }

    static async updateMenuItem(req, res) {
        const errors = getValidationErrors(req);
        const { name, description, price, categoryId, available } = req.body;

        if (errors.length > 0) {
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
                error: errors[0],
                errors,
                formData: { name, description, price, categoryId, available }
            });
        }

        const query = `
            UPDATE menu_items
            SET name = $1, description = $2, price = $3, category_id = $4, available = $5
            WHERE id = $6
        `;
        await db.query(query, [name, description, price, categoryId, available === 'on', req.params.id]);

        res.redirect(buildDashboardUrl('menu', 'Menu item updated'));
    }

    static async deleteMenuItem(req, res) {
        const errors = getValidationErrors(req);

        if (errors.length > 0) {
            return res.redirect(buildDashboardUrl('menu', null, errors[0]));
        }

        const query = `UPDATE menu_items SET active = false WHERE id = $1`;
        await db.query(query, [req.params.id]);

        res.redirect(buildDashboardUrl('menu', 'Menu item deleted'));
    }

    static async addCategory(req, res) {
        const errors = getValidationErrors(req);
        const { name, description, displayOrder } = req.body;

        if (errors.length > 0) {
            return res.redirect(buildDashboardUrl('categories', null, errors[0]));
        }

        try {
            await db.query(
                `
                    INSERT INTO categories (name, description, display_order)
                    VALUES ($1, $2, $3)
                `,
                [name?.trim(), description?.trim() || null, Number.parseInt(displayOrder, 10) || 0]
            );

            res.redirect(buildDashboardUrl('categories', 'Category added'));
        } catch (error) {
            console.error('Error adding category:', error);
            res.redirect(buildDashboardUrl('categories', null, 'Unable to add category'));
        }
    }

    static async updateCategory(req, res) {
        const errors = getValidationErrors(req);
        const { name, description, displayOrder } = req.body;

        if (errors.length > 0) {
            return res.redirect(buildDashboardUrl('categories', null, errors[0]));
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

            res.redirect(buildDashboardUrl('categories', 'Category updated'));
        } catch (error) {
            console.error('Error updating category:', error);
            res.redirect(buildDashboardUrl('categories', null, 'Unable to update category'));
        }
    }

    static async deleteCategory(req, res) {
        const errors = getValidationErrors(req);

        if (errors.length > 0) {
            return res.redirect(buildDashboardUrl('categories', null, errors[0]));
        }

        try {
            await db.query('DELETE FROM categories WHERE id = $1', [req.params.id]);
            res.redirect(buildDashboardUrl('categories', 'Category deleted'));
        } catch (error) {
            console.error('Error deleting category:', error);
            res.redirect(buildDashboardUrl('categories', null, 'Unable to delete category'));
        }
    }

    static async createStaffAccount(req, res) {
        const errors = getValidationErrors(req);
        const { name, email, password, phone, role } = req.body;

        if (errors.length > 0) {
            return res.redirect(buildDashboardUrl('roles', null, errors[0]));
        }

        try {
            await UserModel.createUser({
                name,
                email,
                password,
                phone: phone || null,
                role
            });
            return res.redirect(buildDashboardUrl('roles', 'Staff account created'));
        } catch (error) {
            console.error('Error creating staff account:', error);
            return res.redirect(buildDashboardUrl('roles', null, 'Unable to create staff account'));
        }
    }

    static async updateUserRole(req, res) {
        const errors = getValidationErrors(req);
        const { role } = req.body;

        if (errors.length > 0) {
            return res.redirect(buildDashboardUrl('roles', null, errors[0]));
        }

        const targetUserId = Number.parseInt(req.params.id, 10);
        if (targetUserId === req.session.user.id && role !== 'admin') {
            return res.redirect(buildDashboardUrl('roles', null, 'You cannot remove your own admin access'));
        }

        try {
            await db.query('UPDATE users SET role = $1 WHERE id = $2', [role, targetUserId]);
            res.redirect(buildDashboardUrl('roles', 'User role updated'));
        } catch (error) {
            console.error('Error updating user role:', error);
            res.redirect(buildDashboardUrl('roles', null, 'Unable to update user role'));
        }
    }
}

export default AdminMenuController;
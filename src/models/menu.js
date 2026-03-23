import db from './sql/db.js';

class MenuModel {
    static async getAvailableMenuItems() {
        try {
            const query = `
                SELECT m.*, c.name AS category_name
                FROM menu_items m
                LEFT JOIN categories c ON m.category_id = c.id
                WHERE m.active = true AND m.available = true
                ORDER BY c.name, m.name
            `;
            const result = await db.query(query);

            return result.rows;
        } catch (error) {
            console.error('Error fetching available menu items:', error);
            throw error;
        }
    }

    static async getMenuItems () {
        try {
            const query = `
                SELECT m.*, c.name AS category_name
                FROM menu_items m
                LEFT JOIN categories c ON m.category_id = c.id
                WHERE m.active = true
                ORDER BY c.name, m.name
            `;
            const result = await db.query(query);

            return result.rows;
        } catch (error) {
            console.error('Error fetching menu items:', error);
            throw error;
        }
    };

    static async getMenuItemById(id) {
        try {
            const query = `
                SELECT m.*, c.name AS category_name
                FROM menu_items m
                LEFT JOIN categories c ON m.category_id = c.id
                WHERE m.id = $1 AND m.active = true
            `;
            const result = await db.query(query, [id]);

            return result.rows[0];
        } catch (error) {
            console.error('Error fetching menu item by ID:', error);
            throw error;
        }
    };

    static async getCategories() {
        try {
            const query = `
                SELECT *
                FROM categories
                ORDER BY display_order, name
            `;
            const result = await db.query(query);

            return result.rows;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    };

    static async filterByCategory(categoryId) {
        try {
            const query = `
                SELECT *
                FROM menu_items
                WHERE category_id = $1 AND active = true AND available = true
                ORDER BY name
            `;
            const result = await db.query(query, [categoryId]);

            return result.rows;
        } catch (error) {
            console.error('Error filtering menu items by category:', error);
            throw error;
        }
    }
}

export default MenuModel;
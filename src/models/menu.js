import pool from './sql/db.js';

const getMenuItems = async () => {
    try {
        const query = `
            SELECT m.*, c.name AS category_name
            FROM menu_items m
            LEFT JOIN categories c ON m.category_id = c.id
            WHERE m.active = true
            ORDER BY c.name, m.name
        `;
        const result = await pool.query(query);

        return result.rows;
    } catch (error) {
        console.error('Error fetching menu items:', error);
        throw error;
    }
};

const getMenuItemById = async (id) => {
    try {
        const query = `
            SELECT m.*, c.name AS category_name
            FROM menu_items m
            LEFT JOIN categories c ON m.category_id = c.id
            WHERE m.id = $1 AND m.active = true
        `;
        const result = await pool.query(query, [id]);

        return result.rows[0];
    } catch (error) {
        console.error('Error fetching menu item by ID:', error);
        throw error;
    }
};

const getCategories = async () => {
    try {
        const query = `
            SELECT *
            FROM categories
            ORDER BY display_order, name
        `;
        const result = await pool.query(query);

        return result.rows;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

const filterByCategory = async (categoryId) => {
    try {
        const query = `
            SELECT *
            FROM menu_items
            WHERE category_id = $1 AND active = true
            ORDER BY name
        `;
        const result = await pool.query(query, [categoryId]);

        return result.rows;
    } catch (error) {
        console.error('Error filtering menu items by category:', error);
        throw error;
    }
};

export {
    getMenuItems,
    getMenuItemById,
    getCategories,
    filterByCategory
}
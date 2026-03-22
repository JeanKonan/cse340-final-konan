import db from './sql/db.js';

class OrderModel {
    static async createOrder(orderData) {

        // const client = await db.connect();

        try {
            await db.query('BEGIN');

            const onderNumber = 'ORD-' + Date.now();

            const orderResult = await db.query(`
                INSERT INTO orders (
                    user_id,
                    order_number,
                    customer_name,
                    customer_email,
                    customer_phone,
                    pickup,
                    delivery_address_street,
                    delivery_address_city,
                    delivery_address_state,
                    delivery_address_zip,
                    special_instructions,
                    subtotal,
                    tax,
                    delivery_fee,
                    total,
                    status
                )
                VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
                )
                    RETURNING id, order_number
            `, [
                orderData.userId || null,
                onderNumber,
                orderData.customerName,
                orderData.customerEmail,
                orderData.customerPhone,
                orderData.pickup,
                orderData.deliveryAddress.street,
                orderData.deliveryAddress.city,
                orderData.deliveryAddress.state,
                orderData.deliveryAddress.zip,
                orderData.specialInstructions || null,
                orderData.subtotal,
                orderData.tax,
                orderData.deliveryFee,
                orderData.total,
                'Placed'
            ]);

            const orderId = orderResult.rows[0].id;

            for (const item of orderData.items) {
                await db.query(`
                    INSERT INTO order_items (
                        order_id,
                        menu_item_id,
                        quantity,
                        unit_price,
                        subtotal
                    )
                    VALUES ($1, $2, $3, $4, $5)
                    `, [
                        orderId,
                        item.menuItemId,
                        item.quantity,
                        item.price,
                        item.quantity * item.price
                    ]);
            }

            await db.query(`
                INSERT INTO order_tracking (
                    order_id,
                    status,
                    updated_at
                    )
                VALUES ($1, $2, NOW())
                `, [
                    orderId,
                    'Placed'
                ]);
            
            await db.query('COMMIT');
            return {
                id: orderId,
                orderNumber: onderNumber
            };

        } catch (error) {
            await db.query('ROLLBACK');
            throw error;
        }
    }

    static async getOrderById(orderId) {

        try {
            const query = `
                SELECT o.*, 
                    json_agg(
                    json_build_object(
                        'id', oi.id,
                        'menuItemId', oi.menu_item_id,
                        'quantity', oi.quantity,
                        'unitPrice', oi.unit_price)) AS items
                FROM orders o
                LEFT JOIN order_items oi ON o.id = oi.order_id
                WHERE o.id = $1
                GROUP BY o.id
            `;

            const result = await db.query(query, [orderId]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getOrderByNumber(orderNumber) {

        try {
            const query = `
                SELECT o.*, 
                    json_agg(
                    json_build_object(
                        'id', oi.id,
                        'menuItemId', oi.menu_item_id,
                        'quantity', oi.quantity,
                        'unitPrice', oi.unit_price)) AS items
                FROM orders o
                LEFT JOIN order_items oi ON o.id = oi.order_id
                WHERE UPPER(TRIM(o.order_number)) = UPPER(TRIM($1))
                GROUP BY o.id
            `;

            const result = await db.query(query, [orderNumber]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getOrderTracking(orderId) {

        try {
            const query = `
                SELECT *
                FROM order_tracking
                WHERE order_id = $1
                ORDER BY updated_at DESC
            `;

            const result = await db.query(query, [orderId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async updateOrderStatus(orderId, status) {

        try {
            const query = `
                UPDATE orders
                SET status = $1, updated_at = NOW()
                WHERE id = $2
            `;
            const result = await db.query(query, [status, orderId]);

            await db.query(`
                INSERT INTO order_tracking (
                    order_id,
                    status,
                    updated_at
                )
                VALUES ($1, $2, NOW())
            `, [orderId, status]);

            await db.query('COMMIT');
        } catch (error) {
            await db.query('ROLLBACK');
            throw error;
        }
    }
}

export default OrderModel;
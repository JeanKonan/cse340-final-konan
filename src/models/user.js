import db from './sql/db.js';
import bcrypt from 'bcrypt';

class UserModel {
    static async createUser(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const query = `
            INSERT INTO users (name, email, password_hash, phone, role)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name, email, phone, role
        `;
        const values = [userData.name, userData.email, hashedPassword, userData.phone || null, userData.role || 'customer'];
        const result = await db.query(query, values);

        return result.rows[0];
    }

    static async getUserByEmail(email) {
        const query = `SELECT * FROM users WHERE email = $1`;
        const result = await db.query(query, [email]);
        return result.rows[0];
    }

    static async getUserById(id) {
        const query = `SELECT id, name, email, phone, role FROM users WHERE id = $1`;
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    static async updateUser(id, userData) {
        const fields = [];
        const values = [];
        let index = 1;

        if (userData.name !== undefined) {
            fields.push(`name = $${index}`);
            values.push(userData.name);
            index++;
        }

        if (userData.email !== undefined) {
            fields.push(`email = $${index}`);
            values.push(userData.email);
            index++;
        }

        if (userData.phone !== undefined) {
            fields.push(`phone = $${index}`);
            values.push(userData.phone);
            index++;
        }

        if (userData.role !== undefined) {
            fields.push(`role = $${index}`);
            values.push(userData.role);
            index++;
        }

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        const query = `
            UPDATE users
            SET ${fields.join(', ')}
            WHERE id = $${index}
            RETURNING id, name, email, phone, role
        `;
        values.push(id);
        const result = await db.query(query, values);

        return result.rows[0];
    }
}

export default UserModel;
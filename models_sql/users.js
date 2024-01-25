const validFields = ['id', 'firstName', 'lastName', 'avatar', 'email', 'password', 'role', 'courses', 'managedCourses'];

module.exports = class Users {
    constructor(db) {
        this.db = db;
    }

    async migrate() {
        await this.db.execute(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            avatar TEXT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'student' CHECK(role IN ('student', 'teacher', 'admin')),
            courses TEXT,
            managedCourses TEXT
        )
        `)
        console.log("Users table migrated!");
    }

    filterNull(data) {
        let res = {};
        for (let field of Object.keys(data).filter(field => validFields.includes(field))) {
            res[field] = data[field] || null;
        }
        return res;
    }

    async create(userData) {
        const data = this.filterNull(userData);
        const fields = Object.keys(data);
        const sql = `
            INSERT INTO users (${fields.join(', ')}) 
            VALUES (${fields.map(() => '?').join(', ')})
        `;

        const result = await this.db.execute({
            sql,
            args: Object.values(data)
        });
    
        return result;
    }

    async findMany(field, value) {
        if(!validFields.includes(field)) {
            throw new Error('Invalid field name');
        }

        const result = await this.db.execute({
            sql: `SELECT * FROM users WHERE ${field} = ?`,
            args: [value]
        });

        return result;
    }

    async findOne(field, value) {
        const rows = await this.findMany(field, value);
        return rows.rows.length > 0 ? rows.rows[0] : null;
    }

    async updateMany(updates, conditionField, conditionValue) {
        updates = this.filterNull(updates);
        const fields = Object.keys(updates);
        if (!fields.every(field => validFields.includes(field)) || !validFields.includes(conditionField)) {
            throw new Error('Invalid field name');
        }
    
        const sql = `UPDATE users SET ${fields.map(field => `${field} = ?`).join(', ')} WHERE ${conditionField} = ?`;
        const args = [...Object.values(updates), conditionValue];
    
        const result = await this.db.execute({
            sql,
            args
        });
    
        return result;
    }
    
    async updateOne(updates, conditionField, conditionValue) {
        const row = await this.findOne(conditionField, conditionValue);
        if (row) {
            await this.updateMany(updates, 'id', row.id);
        }
    }

    async deleteMany(field, value) {
        if (!validFields.includes(field)) {
            throw new Error('Invalid field name');
        }

        const result = await this.db.execute({
            sql: `DELETE FROM users WHERE ${field} = ?`,
            args: [value]
        });

        return result;
    }

    async deleteOne(field, value) {
        const row = await this.findOne(field, value);
        if (row) {
            await this.deleteMany('id', row.id);
        }
    }

    validate(userData) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        if (userData.password.length < 8) {
            return 'The password must be at least 8 characters long.';
        }
    
        if (!emailRegex.test(userData.email)) {
            return 'The email address is not valid.';
        }
    }

    constraintInterpreter(constraint) {
        let message = '';
    
        if (constraint.includes('UNIQUE constraint failed')) {
            const field = constraint.split('.')[1];
            switch (field) {
                case 'email':
                    message = 'The email address is already in use.';
                    break;
                default:
                    message = 'A unique constraint was violated.';
            }
        } else if (constraint.includes('NOT NULL constraint failed')) {
            const field = constraint.split('.')[1];
            switch (field) {
                case 'firstName':
                    message = 'The first name cannot be empty.';
                    break;
                case 'lastName':
                    message = 'The last name cannot be empty.';
                    break;
                case 'email':
                    message = 'The email cannot be empty.';
                    break;
                case 'password':
                    message = 'The password cannot be empty.';
                    break;
                default:
                    message = 'A required field is missing.';
            }
        } else if (constraint.includes('CHECK constraint failed')) {
            const field = constraint.split('.')[1];
            switch (field) {
                case 'role':
                    message = 'The role must be either student, teacher, or admin.';
                    break;
                default:
                    message = 'A check constraint was violated.';
            }
        } else {
            message = 'An unknown constraint was violated.';
        }
    
        return message;
    }
}
module.exports = class MiniORM {
    constructor(db, table_name, validFields) {
        this.db = db;
        this.table = table_name;
        this.validFields = validFields;
    }

    filterNull(data) {
        let res = {};
        for (let field of Object.keys(data).filter(field => this.validFields.includes(field))) {
            res[field] = data[field] || null;
        }
        return res;
    }

    async create(data) {
        const filteredData = this.filterNull(data);
        const fields = Object.keys(filteredData);
        const sql = `
            INSERT INTO ${this.table} (${fields.join(', ')}) 
            VALUES (${fields.map(() => '?').join(', ')})
        `;

        const result = await this.db.execute({
            sql,
            args: Object.values(filteredData)
        });

        return result;
    }

    async findMany(field, value) {
        if(!this.validFields.includes(field)) {
            throw new Error('Invalid field name');
        }

        const result = await this.db.execute({
            sql: `SELECT * FROM ${this.table} WHERE ${field} = ?`,
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
        if (!fields.every(field => this.validFields.includes(field)) || !this.validFields.includes(conditionField)) {
            throw new Error('Invalid field name');
        }

        const sql = `UPDATE ${this.table} SET ${fields.map(field => `${field} = ?`).join(', ')} WHERE ${conditionField} = ?`;

        const args = [...Object.values(updates), conditionValue];

        const result = await this.db.execute({
            sql,
            args
        });

        return result;
    }

    async updateOne(updates, conditionField, conditionValue) {
        const row = await this.findOne(conditionField, conditionValue);
        if(row) {
            await this.updateMany(updates, 'id', row.id);
        }
    }

    async deleteMany(field, value) {
        if (!this.validFields.includes(field)) {
            throw new Error('Invalid field name');
        }

        const result = await this.db.execute({
            sql: `DELETE FROM ${this.table} WHERE ${field} = ?`,
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
}
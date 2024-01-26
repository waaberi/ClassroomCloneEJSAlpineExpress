export default class MiniORM {
    constructor(db, table_name, fields) { // this is not meant to be exposed to the user, do not put arbitrary SQL here
        this.db = db;
        this.table_name = table_name;
        this.fields = fields.map(field => field.split(" ")[0]);
        this.migrateCode = `
        CREATE TABLE IF NOT EXISTS ${table_name} (
            ${fields.join(', ')}
        )
        `;
    }

    async migrate(drop = false) {
        if (drop) await this.db.execute(`DROP TABLE IF EXISTS ${this.table_name}`);
        await this.db.execute(this.migrateCode);
        console.log(`${this.table_name} table migrated!`);
    }

    filterNull(data) {
        let res = {};
        for (let field of Object.keys(data).filter(field => this.fields.includes(field))) {
            res[field] = data[field] || null;
        }
        return res;
    }

    async create(data) {
        data = this.filterNull(data);
        const data_fields = Object.keys(data);
        const sql = `
            INSERT INTO ${this.table_name} (${data_fields.join(', ')}) 
            VALUES (${data_fields.map(() => '?').join(', ')})
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

        const sql = `
            SELECT * FROM ${this.table_name}
            WHERE ${field} = ?
        `;

        const result = await this.db.execute({
            sql,
            args: [value]
        });

        return result;
    }

    async findOne(field, value) {
        const rows = await this.findMany(field, value);
        return rows.rows.length > 0 ? rows.rows[0] : null;
    }

    async UpdateMany(updates, conditionField, conditionValue) {

    }

    async updateOne(updates, conditionField, conditionValue) {

    }

    async deleteMany() {

    }

    async deleteOne() {

    }


}
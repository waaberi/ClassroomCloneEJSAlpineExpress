const validFields = ['id', 'firstName', 'lastName', 'avatar', 'email', 'password', 'role', 'courses', 'managedCourses'];

module.exports = class Users {
    constructor(db) {
        this.db = db;
    }

    // Méthode pour migrer la table des utilisateurs
    async migrate() {
        // Exécution de la requête SQL pour créer la table des utilisateurs si elle n'existe pas déjà
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
        // Affichage d'un message dans la console pour indiquer que la table des utilisateurs a été migrée
        console.log("Users table migrated!");
    }

    // Méthode pour filtrer les champs nuls
    filterNull(data) {
        // Initialisation d'un nouvel objet
        let res = {};
        // Pour chaque champ de l'objet data
        for (let field of Object.keys(data).filter(field => validFields.includes(field))) {
            // Si le champ est valide, ajoutez-le à l'objet res
            res[field] = data[field] || null;
        }
        // Retourne l'objet res
        return res;
    }

    // Méthode pour créer un nouvel utilisateur
    async create(userData) {
        // Filtrage des données de l'utilisateur
        const data = this.filterNull(userData);
        // Récupération des champs de l'objet data
        const fields = Object.keys(data);
        // Création de la requête SQL pour insérer un nouvel utilisateur
        const sql = `
            INSERT INTO users (${fields.join(', ')}) 
            VALUES (${fields.map(() => '?').join(', ')})
        `;

        // Exécution de la requête SQL
        const result = await this.db.execute({
            sql,
            args: Object.values(data)
        });

        // Retourne le résultat de la requête SQL
        return result;
    }

    // Méthode pour trouver plusieurs utilisateurs
    async findMany(field, value) {
        // Si le champ n'est pas valide, lance une erreur
        if(!validFields.includes(field)) {
            throw new Error('Invalid field name');
        }

        // Exécution de la requête SQL pour trouver les utilisateurs
        const result = await this.db.execute({
            sql: `SELECT * FROM users WHERE ${field} = ?`,
            args: [value]
        });

        // Retourne le résultat de la requête SQL
        return result;
    }

    // Méthode pour trouver un utilisateur
    async findOne(field, value) {
        // Appel de la méthode findMany pour trouver les utilisateurs
        const rows = await this.findMany(field, value);
        // Si au moins un utilisateur a été trouvé, retourne le premier utilisateur, sinon retourne null
        return rows.rows.length > 0 ? rows.rows[0] : null;
    }

    // Méthode pour mettre à jour plusieurs utilisateurs
    async updateMany(updates, conditionField, conditionValue) {
        // Filtrage des mises à jour
        updates = this.filterNull(updates);
        // Récupération des champs de l'objet updates
        const fields = Object.keys(updates);
        // Si tous les champs ne sont pas valides ou si le champ de condition n'est pas valide, lance une erreur
        if (!fields.every(field => validFields.includes(field)) || !validFields.includes(conditionField)) {
            throw new Error('Invalid field name');
        }

        // Création de la requête SQL pour mettre à jour les utilisateurs
        const sql = `UPDATE users SET ${fields.map(field => `${field} = ?`).join(', ')} WHERE ${conditionField} = ?`;
        // Création des arguments pour la requête SQL
        const args = [...Object.values(updates), conditionValue];

        // Exécution de la requête SQL
        const result = await this.db.execute({
            sql,
            args
        });

        // Retourne le résultat de la requête SQL
        return result;
    }
    
    // Méthode pour mettre à jour un utilisateur
    async updateOne(updates, conditionField, conditionValue) {
        // Appel de la méthode findOne pour trouver l'utilisateur
        const row = await this.findOne(conditionField, conditionValue);
        // Si l'utilisateur a été trouvé, met à jour l'utilisateur
        if (row) {
            await this.updateMany(updates, 'id', row.id);
        }
    }

    // Méthode pour supprimer plusieurs utilisateurs
    async deleteMany(field, value) {
        // Si le champ n'est pas valide, lance une erreur
        if (!validFields.includes(field)) {
            throw new Error('Invalid field name');
        }

        // Exécution de la requête SQL pour supprimer les utilisateurs
        const result = await this.db.execute({
            sql: `DELETE FROM users WHERE ${field} = ?`,
            args: [value]
        });

        // Retourne le résultat de la requête SQL
        return result;
    }

    // Méthode pour supprimer un utilisateur
    async deleteOne(field, value) {
        // Appel de la méthode findOne pour trouver l'utilisateur
        const row = await this.findOne(field, value);
        // Si l'utilisateur a été trouvé, supprime l'utilisateur
        if (row) {
            await this.deleteMany('id', row.id);
        }
    }

    // Méthode pour valider les données de l'utilisateur
    validate(userData) {
        // Expression régulière pour valider l'adresse e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        // Si le mot de passe est trop court, retourne un message d'erreur
        if (userData.password.length < 8) {
            return 'The password must be at least 8 characters long.';
        }
    
        // Si l'adresse e-mail n'est pas valide, retourne un message d'erreur
        if (!emailRegex.test(userData.email)) {
            return 'The email address is not valid.';
        }
    }

    // Méthode pour interpréter les contraintes
    constraintInterpreter(constraint) {
        // Initialisation du message
        let message = '';
    
        // Si la contrainte est une contrainte d'unicité, détermine le champ qui a violé la contrainte et définit le message en conséquence
        if (constraint.includes('UNIQUE constraint failed')) {
            const field = constraint.split('.')[1];
            switch (field) {
                case 'email':
                    message = 'The email address is already in use.';
                    break;
                default:
                    message = 'A unique constraint was violated.';
            }
        } 
        // Si la contrainte est une contrainte NOT NULL, détermine le champ qui a violé la contrainte et définit le message en conséquence
        else if (constraint.includes('NOT NULL constraint failed')) {
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
        } 
        // Si la contrainte est une contrainte CHECK, détermine le champ qui a violé la contrainte et définit le message en conséquence
        else if (constraint.includes('CHECK constraint failed')) {
            const field = constraint.split('.')[1];
            switch (field) {
                case 'role':
                    message = 'The role must be either student, teacher, or admin.';
                    break;
                default:
                    message = 'A check constraint was violated.';
            }
        } 
        // Si la contrainte est inconnue, définit le message en conséquence
        else {
            message = 'An unknown constraint was violated.';
        }
    
        // Retourne le message
        return message;
    }
}
const MiniORM = require("./mini_orm");

class Users extends MiniORM {
    constructor(db) {
        super(db, "users", [
            'id',
            'firstName',
            'lastName',
            'avatar',
            'email',
            'password',
            'role',
        ]);
    }

    async getClassroomsForStudent(studentId) {
        const result = await this.db.execute(`
            SELECT * FROM classrooms
            INNER JOIN classroom_students
            ON classrooms.id = classroom_students.classroom_id
            WHERE classroom_students.student_id = ?
        `, [studentId]);
        return result;
    }

    async getClassroomsForTeacher(teacherId) {
        const result = await this.db.execute(`
            SELECT * FROM classrooms
            INNER JOIN classroom_teachers
            ON classrooms.id = classroom_teachers.classroom_id
            WHERE classroom_teachers.teacher_id = ?
        `, [teacherId]);
        return result;
    }

    async getRequestsForStudent(studentId) {
        const result = await this.db.execute(`
            SELECT * FROM classroom_requests
            INNER JOIN classrooms
            ON classroom_requests.classroom_id = classrooms.id
            WHERE classroom_requests.user_id = ?
        `, [studentId]);
        return result;
    }

    validate(userData) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (userData.password.length < 8)
            return 'The password must be at least 8 characters long.';

        if (!emailRegex.test(userData.email))
            return 'The email address is not valid.';
    }

    constraintInterpreter(constraint) {
        let message = 'An unknown constraint was violated.';
        const field = constraint.split('.')[1];
        if (constraint.includes('UNIQUE constraint failed')) {
            switch (field) {
                case 'email':
                    message = 'The email address is already in use.';
                    break;
                default:
                    message = 'A unique constraint was violated.';
            }
        }

        else if (constraint.includes('NOT NULL constraint failed')) {
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

        else if (constraint.includes('CHECK constraint failed')) {
            switch (field) {
                case 'role':
                    message = 'The role must be either student, teacher, or admin.';
                    break;
                default:
                    message = 'A check constraint was violated.';
            }
        }
    
        return message;
    }
}

module.exports = Users;
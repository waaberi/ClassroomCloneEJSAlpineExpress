const MiniORM = require("./mini_orm");

class Courses extends MiniORM {
    constructor(db) {
        super(db, "courses", [
            'id',
            'code',
            'title',
            'description',
            'visibility',
            'entry',
        ]);
    }

    async addUserToCourse(courseId, userId) {
        const result = await this.db.execute(`
            INSERT INTO classroom_students (student_id, classroom_id)
            VALUES (?, ?)
        `, [userId, courseId]);
        return result;
    }

    async removeUserFromCourse(courseId, userId) {
        const result = await this.db.execute(`
            DELETE FROM classroom_students
            WHERE student_id = ? AND classroom_id = ?
        `, [userId, courseId]);
        return result;
    }

    async addUserToCourseRequest(courseId, userId) {
        const result = await this.db.execute(`
            INSERT INTO classroom_requests (user_id, course_id)
            VALUES (?, ?)
        `, [userId, courseId]);
        return result;
    }

    async removeUserFromCourseRequest(courseId, userId) {
        const result = await this.db.execute(`
            DELETE FROM classroom_requests
            WHERE user_id = ? AND course_id = ?
        `, [userId, courseId]);
        return result;
    }

    async getCourseRequests(courseId) {
        const result = await this.db.execute(`
            SELECT * FROM classroom_requests
            WHERE course_id = ?
        `, [courseId]);
        return result;
    }

    async getCourseStudents(courseId) {
        const result = await this.db.execute(`
            SELECT * FROM classroom_students
            WHERE classroom_id = ?
        `, [courseId]);
        return result;
    }

    async isInCourse(courseId, userId) {
        const result = await this.db.execute(`
            SELECT * FROM classroom_students
            WHERE classroom_id = ? AND student_id = ?
        `, [courseId, userId]);
        return result;
    }

    async isRequestPending(courseId, userId) {
        const result = await this.db.execute(`
            SELECT * FROM classroom_requests
            WHERE course_id = ? AND user_id = ?
        `, [courseId, userId]);
        return result;
    }

    async validate(courseData) {
        const courseCodeRegex = /^[A-Z]{3}(1[LOPD]|2[LOPD]|3[EMCU]|4[EMCU]).*$/;
    
        // only use the first 10 characters of courseData.code
        if(!courseCodeRegex.test(courseData.code.slice(0, 10)))
            return 'Invalid course code syntax';
    
        if (!['public', 'private'].includes(courseData.visibility))
            return 'Invalid visibility value. It should be either "public" or "private".';
    
        if (!['open', 'closed'].includes(courseData.entry))
            return 'Invalid entry value. It should be either "open" or "closed".';
    }
    
    async constraintInterpreter(constraint) {
        let message = 'An unknown constraint was violated.';
        const field = constraint.split('.')[1];
        if (constraint.includes('CHECK constraint failed')) {
            switch (field) {
                case 'visibility':
                    message = 'Invalid visibility value. It should be either "public" or "private".';
                    break;
                case 'entry':
                    message = 'Invalid entry value. It should be either "open" or "closed".';
                    break;
                default:
                    message = 'A check constraint was violated.';
            }
        } else if (constraint.includes('UNIQUE constraint failed')) {
            switch (field) {
                case 'code':
                    message = 'The course code is already in use.';
                    break;
                default:
                    message = 'A unique constraint was violated.';
            }
        }
    
        return message;
    }
}

module.exports = Courses;
module.exports = async (db) => {
    await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        avatar TEXT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'student' CHECK(role IN ('student', 'teacher', 'admin'))
    )
    `)

    await db.execute(`
    CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        banner TEXT,
        visibility TEXT DEFAULT 'private' CHECK(visibility IN ('public', 'private')),
        entry TEXT DEFAULT 'closed' CHECK(entry IN ('open', 'closed'))
    )
    `)
    
    await db.execute(`
    CREATE TABLE IF NOT EXISTS classroom_teachers (
        teacher_id INTEGER,
        classroom_id INTEGER,
        PRIMARY KEY (teacher_id, classroom_id),
        FOREIGN KEY (teacher_id) REFERENCES users (id),
        FOREIGN KEY (classroom_id) REFERENCES classrooms (id)
    )
    `)

    await db.execute(`
    CREATE TABLE IF NOT EXISTS classroom_students (
        student_id INTEGER,
        classroom_id INTEGER,
        PRIMARY KEY (student_id, classroom_id),
        FOREIGN KEY (student_id) REFERENCES users (id),
        FOREIGN KEY (classroom_id) REFERENCES classrooms (id)
    )
    `)

    await db.execute(`
    CREATE TABLE IF NOT EXISTS classroom_requests (
        user_id INTEGER NOT NULL,
        course_id INTEGER NOT NULL,
        request_date DATE DEFAULT CURRENT_DATE,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
        PRIMARY KEY (user_id, course_id),
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(course_id) REFERENCES courses(id)
    )
    `)

    console.log("Tables migrated")
}
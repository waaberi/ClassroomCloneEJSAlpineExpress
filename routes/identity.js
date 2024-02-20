const express = require("express");
const router = express.Router();
const {APIAuth} = require("../middleware/auth");
router.get("/", APIAuth, async (req, res) => {
    let user = await req.db.user_table.findOne('id', req.user_id);
    return res.json({
        student: user.role === 'student',
        teacher: user.role === 'teacher',
        admin: user.role === 'admin',
    });
});

module.exports = router;
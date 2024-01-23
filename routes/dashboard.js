const express = require('express');
const router = express.Router();
const { APIAuth, ClientAuth } = require('../middleware/auth');

router.get('/', ClientAuth, (req, res) => {
  return res.render('dashboard');
});

module.exports = router;

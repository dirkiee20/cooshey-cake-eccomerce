
const express = require('express');
const router = express.Router();
const { createGcashSource } = require('../controllers/paymentController');

router.post('/gcash', createGcashSource);

module.exports = router;

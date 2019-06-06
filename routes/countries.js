const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countries');

router.get('/', countryController.index);

module.exports = router;
const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countries');

router.get('/', aboutController.index);

module.exports = router;
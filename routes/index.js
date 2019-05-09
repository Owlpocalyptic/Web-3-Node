const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index');

router.get('/', indexController.index);
router.post('/', indexController.post);
router.get('/notIndex', indexController.notindex);

module.exports = router;

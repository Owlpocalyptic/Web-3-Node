var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  res.render('index', { title: 'POSTED Express' });
});

router.get('/notindex', function(req, rest, next) {
  res.render('notindex', { title: 'POSTED Express' });
});

module.exports = router;

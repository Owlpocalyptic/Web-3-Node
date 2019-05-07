var express = require('express');
var router = express.Router();
app.use(express.static('public'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  res.render('index', { title: 'POSTED Express' });
});

router.get('/notindex', function(req, res, next) {
  res.render('notindex', { title: 'POSTED Express' });
});

module.exports = router;

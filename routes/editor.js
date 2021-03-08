var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('./../views/users/2editor/1edmypage.hbs');
});

module.exports = router;

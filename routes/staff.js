var express = require('express');
var router = express.Router();
// require products model
const ProductModel = require('./../models/Product');

/* GET users listing. */
router.get('/', (req, res, next) => {
  ProductModel.find()
  .then((products) => {
    res.render('./../views/users/3staff/1seealldesigns.hbs', {products});
  })
  .catch((err) => next(err));
});

// get the search product(s) page
router.get('/search', (req, res, next) => {
  res.render('./../views/users/3staff/2searchproducts.hbs')
})

// get the search products info
router.post('/search', (req, res, next) => {
  // search by name or other criterion
})

module.exports = router;

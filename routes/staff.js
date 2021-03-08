var express = require('express');
var router = express.Router();
// require products model
const ProductModel = require('./../models/Product');
// require collection model
const SerieModel = require('../models/Series');

// get products
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

//get all products from a collection with editors
router.get('/series/:id', (req, res, next) => {
  SerieModel.findById(req.params.id)
  .then((serie) => {
    ProductModel.find({serie: req.params.id}).populate('editors').populate('designer')
    .then((products) => res.render('./../views/users/3staff/3seeallserieproducts.hbs', {serie, products}))
    .catch((err) => next(err));
  })
})

module.exports = router;

var express = require('express');
var router = express.Router();
// require products model
const ProductModel = require('./../models/Product');
// require collection model
const SerieModel = require('../models/Serie');

// require protect staff route middleware
const pSR = require('./../middlewares/protectstaffroute')

// get products
router.get('/', pSR, (req, res, next) => {
  ProductModel.find().populate('editors').populate('designer').populate('serie')
  .then((products) => {
    res.render('./../views/users/3staff/1seealldesigns.hbs', {products});
  })
  .catch((err) => next(err));
});

// get series
router.get('/series', pSR, (req, res, next) => {
  SerieModel.find()
  .then((series) => res.render('./../views/users/3staff/5seeallseries.hbs', {series}))
  .catch((err) => next(err))
});


// get the search product(s) page
router.get('/search', pSR, (req, res, next) => {
  res.render('./../views/users/3staff/2searchproducts.hbs')
})

//display one product
router.get('/product/:id', pSR, (req, res, next) => {
  ProductModel.findById(req.params.id).populate('editors').populate('serie')
  .then((product) => res.render('./../views/users/3staff/4productinfo.hbs', {product}))
  .catch((err) => next(err));
})

// get the search products info
router.post('/search', (req, res, next) => {
  // search by name or other criterion
})

//get all products from a collection with editors
router.get('/series/:id', pSR, (req, res, next) => {
  SerieModel.findById(req.params.id)
  .then((serie) => {
    ProductModel.find({serie: req.params.id}).populate('editors').populate('designer')
    .then((products) => res.render('./../views/users/3staff/3seeallserieproducts.hbs', {serie, products}))
    .catch((err) => next(err));
  })
})

module.exports = router;

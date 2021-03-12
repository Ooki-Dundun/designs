var express = require('express');
var router = express.Router();
// require products model
const ProductModel = require('./../models/Product');
// require collection model
const SerieModel = require('../models/Serie');
// require comment model
const CommentModel = require('./../models/Comment')

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
  ProductModel.findById(req.params.id).populate('editors').populate('serie').populate('designer')
  .then((product) => {
    CommentModel.find({product: product._id}).populate('author')
    .then((comments) => res.render('./../views/users/3staff/4productinfo.hbs', {product, comments}))
    .catch((err) => next(err))
  })
});

// add comments to a product 
router.post('/product/:id/', (req, res, next) => {
 console.log("req.params is : ", req.params);
 console.log("req.body is : ", req.body);
 console.log(req.session)
  CommentModel.create({
    product: req.body.product,
    author: req.session.currentUser._id,
    content: req.body.content,
    date: req.body.date
  })
  // need to find comment to populate to be able to populate editor to include comments container front end
  .then((comment) => {
    CommentModel.findById(comment._id).populate('author')
    .then((commentWithAuthor) => {
      console.log("commentWithAuthor is : ", commentWithAuthor)
      res.status(201).json(commentWithAuthor)
    })
    .catch((err) => res.status(500).json(err))
  })
});

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

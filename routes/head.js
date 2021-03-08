var express = require('express');
var router = express.Router();
// require product model
const ProductModel = require('./../models/Product');
// require cloudinary for file upload
const fileUploader = require("./../config/cloudinary");

// get head designer main page
router.get('/', function(req, res, next) {
  ProductModel.find()
  .then((products) => {
  res.render('./../views/users/1head/1hdmypage.hbs', {products});
  })
  .catch((err) => next(err));
});


// edit a product page
router.get('/edit/:id', (req, res, next) => {
  ProductModel.findById(req.params.id)
  .then((product) => res.render('./../views/users/1head/5hdeditproduct.hbs'))
  .catch((err) => next(err))
});

// edit a product
router.post('/edit/:id',fileUploader.single("image"), (req, res, next) => {
  const { name, designer, editors, category, color, material, collection, status, internalNotes, image } = req.body;
  ProductModel.findByIdAndUpdate(req.params.id, ({
    name, designer, editors, category, color,
    material, collection, status, internalNotes,
    images: //push new image to array
  })
})

// delete a product
router.get('/delete/:id', (req, res, next) => {
  ProductModel.findByIdAndDelete(req.params.id)
  .then((product) => {
    console.log('The design is no longer in the database');
    res.redirect('/head');
  })
  .catch((err) => next(err));
});

module.exports = router;

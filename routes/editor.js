var express = require('express');
var router = express.Router();
// require product model 
const ProductModel = require('./../models/Product');
// require serie model
const SerieModel = require('./../models/Serie');
//require user model
const UserModel = require('./../models/User')

// require cloudinary for file upload
const fileUploader = require("./../config/cloudinary");
const { array } = require('./../config/cloudinary');

// require protect editor route middleware
const pER = require('./../middlewares/protecteditorroute')

// get editor main page
router.get('/', pER, function(req, res, next) {
  ProductModel.find().populate('editors').populate('serie')
  .then((products) => {
  res.render('./../views/users/2editor/1edmypage.hbs', {products});
  })
  .catch((err) => next(err));
});

// get edit product page
router.get('/edit-product/:id', pER, (req, res, next) => {
  ProductModel.findById(req.params.id).populate('designer').populate('editors')
  .then((product) => {
    UserModel.find()
    .then((users) => {
      SerieModel.find()
      .then((series) => {
        res.render('./../views/users/2editor/3ededitdesign.hbs', {product, users, series})
      })
      .catch((err) => next(err))
    })
  })
});

// edit a product
router.post('/edit-product/:id', fileUploader.single("image"), (req, res, next) => {
  const { name, category, color, material, status, internalNotes } = req.body;
  ProductModel.findByIdAndUpdate(req.params.id, { name, category, color, material, status, internalNotes}, {new: true})
  .then((editedProduct) => {
    // push image to array of images
    const imagePromise = addImageOfProduct(req.params.id, req.file.path);
    imagePromise
    .then((finalProduct) => {
      console.log(finalProduct);
      res.redirect('/editor')
    })
    .catch((err) => next(err))
  })
})

// get my collections page
router.get('/:id/my-collections', pER, (req, res,next) => {
  SerieModel.find()
})

// get my products page
router.get('/:id/my-products', pER, (req, res, next) => {
  console.log('req.params.id :', req.params.id);
  ProductModel.find({editors: req.params.id}).populate('designer').populate('serie').populate('editors')
  .then((products) => {
    console.log("products :", products);
    res.render('./../views/users/2editor/2myproducts.hbs', {products})
  })
  .catch((err) => next(err))
})

//helpers

// add image to product
function addImageOfProduct(id, imagePath){
  const imagePromise = ProductModel.findByIdAndUpdate(id, {$push: {images: imagePath}}, {new: true});
  return imagePromise;
}

function checkTeamAndCollections(userId) {

}

module.exports = router;

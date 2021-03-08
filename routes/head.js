var express = require('express');
var router = express.Router();
// require product model
const ProductModel = require('./../models/Product');
//require collection model
const CollectionModel = require('./../models/Collection');
// require user model
const UserModel = require('./../models/User')
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

// get add a new design page
router.get('/add-product', (req, res, next) => {
  UserModel.find({role: 'headDesigner'})
  .then((headDesigners) => {
    UserModel.find({role: 'editor'})
    .then((editors) => {
      CollectionModel.find()
      .then((collections) => {
        res.render('./../views/users/1head/2hdaddnewdesign.hbs', {headDesigners, editors, collections})
      })
      .catch((err) => next(err))
    })
  })
})

// get info from new design form to add new design
router.post('/add-product', fileUploader('image'), (req, res, next) => {
  const { name, designer, editors, category, color, material, collection, status, internalNotes, image } = req.body;
  ProductModel.create({ name, designer, editors: editors.forEach(n => editors.push(n)), category, color, material, collection, status, internalNotes, images: images.push(image) })
  .then((product) => {
    console.log(`The following has been added to the database: ${product}`);
    res.redirect('/head');
  })
  .catch((err) => console.log(err));
})

// get add or delete a collection page
router.get('/collection', (req, res, next) => {
  CollectionModel.find()
  .then((collections) => res.render('./../views/users/1head/6hdcollections.hbs', {collections}))
  .catch((err) => next(err))
});

// get add a new collection form information
router.post('/collection', (req, res, next) => {
  const { season, year } = req.body;
  CollectionModel.create({ season, year})
  .then((collection) => res.redirect('/head/collection'))
  .catch((err) => next(err));
})

// get information to delete collection
router.get('/collection/:id', (req, res, next) => {
  CollectionModel.findByIdAndDelete(req.params.id)
  .then((collection) => {
    console.log(`${collection} is no longer in the database`);
    res.redirect('/head/collection')
  })
  .catch((err) => next(err))
});

// get change users's rights page
router.get('/users', (req, res, next) => {
  UserModel.find()
  .then((users) => {
    ProductModel.find().populate('editors')
    .then((products) => {
      res.render('./../views/users/1head/4changeusersrights.hbs', {users, products})
    })
    .catch((err) => next(err))
  })
})

// get info from change user's rights form
router.post('/users/:id', (req, res, next) => {
  const { role } = req.body;
  UserModel.findByIdAndUpdate(req.params.id, ({ role }), {new: true})
  .then((user) => {
    console.log(user);
    res.redirect('/head/user')
  })
  .catch((err) => next(err))
})

//get info to delete user
router.get('/users/delete/:id', (req, res, next) => {
  UserModel.findByIdAndDelete(req.params.id)
  .then((user) => {
    console.log(user);
    res.redirect('/head/users')
  })
  .catch((err) => next(err));
})

// edit a product page
router.get('/edit/:id', (req, res, next) => {
  ProductModel.findById(req.params.id).populate('editors').populate('collection').populate('designer')
  .then((product) => {
    UserModel.find({role: 'editor'})
    .then((editors) => res.render('./../views/users/1head/5hdeditproduct.hbs', {product, editors}))
    .catch((err) => next(err))
  })
});

// edit a product
router.post('/edit/:id',fileUploader.single("image"), (req, res, next) => {
  const { name, designer, editors, category, color, material, collection, status, internalNotes, image } = req.body;
  ProductModel.findByIdAndUpdate(req.params.id, {new: true}, {
    name, designer, editors: editors.forEach(n => editors.push(n)), category, color, material, collection, status, internalNotes,
    images: images.push(image)
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

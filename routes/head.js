var express = require('express');
var router = express.Router();
// require product model
const ProductModel = require('./../models/Product');
//require serie model
const SerieModel = require('../models/Series');
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
  UserModel.find({role: 'Designer'})
  .then((designers) => {
    UserModel.find()
    .then((users) => {
      SerieModel.find()
      .then((series) => {
        res.render('./../views/users/1head/2hdaddnewdesign.hbs', {designers, users, series})
      })
      .catch((err) => next(err))
    })
  })
})

// get info from new design form to add new design
router.post('/add-product', fileUploader.single('image'), (req, res, next) => {
  const { name, designer, editors, category, color, material, serie, status, internalNotes} = req.body;
  // editors should only contain ids of actual users: make sure n/a will not be pushed to editors' array
  const editorsToPush = filterNotApplicable(editors);
  // update role of users that have been selected as editors from "staff" to "editor"
  const newEditorsToPush = updateRoleToEditor(editorsToPush);
  ProductModel.create({ name, designer, category, color, material, serie, status, internalNotes})
  .then((product) => {
    ProductModel.findByIdAndUpdate(product._id, {$push: {editors: newEditorsToPush}}, {new: true})
    .then((productWithEditors) => {
      ProductModel.findByIdAndUpdate(product._id, {$push: {images: req.file.path}}, {new: true})
      .then((finalProduct) => {
        console.log(`The following has been added to the database: ${finalProduct}`);
        res.redirect('/head');
      })
      .catch((err) => console.log(err));
    })
  })
});

// get add or delete a serie page
router.get('/series', (req, res, next) => {
  SerieModel.find()
  .then((series) => res.render('./../views/users/1head/3hdseries.hbs', {series}))
  .catch((err) => next(err))
});

// get add a new serie form information
router.post('/series', (req, res, next) => {
  const { season, year } = req.body;
  SerieModel.create({ season, year})
  .then((serie) => res.redirect('/head/series'))
  .catch((err) => next(err));
})

// get information to delete serie
router.get('/series/:id', (req, res, next) => {
  SerieModel.findByIdAndDelete(req.params.id)
  .then((serie) => {
    console.log('The series is no longer in the database');
    res.redirect('/head/series')
  })
  .catch((err) => next(err))
});

// get manage rights page
router.get('/manage-rights', (req, res, next) => {
  UserModel.find()
  .then((users) => {
    ProductModel.find().populate('editors')
    .then((products) => {
      res.render('./../views/users/1head/4managerights.hbs', {users, products})
    })
    .catch((err) => next(err))
  })
})

// get change user's rights page
router.get('/manage-rights/:id', (req, res, next) => {
  UserModel.findById(req.params.id)
  .then((user) => res.render('./../views/users/1head/6hdedituser.hbs', {user}))
  .catch((err) => next(err))
})

// get info from change user's rights form
router.post('/manage-rights/:id', (req, res, next) => {
  const { role, team } = req.body;
  UserModel.findByIdAndUpdate(req.params.id, ({ role, team }), {new: true})
  .then((user) => {
    console.log(user);
    res.redirect('/head/manage-rights')
  })
  .catch((err) => next(err))
})

//get info to delete user
router.get('/manage-rights/delete/:id', (req, res, next) => {
  UserModel.findByIdAndDelete(req.params.id)
  .then((user) => {
    console.log(user);
    res.redirect('/head/manage-rights')
  })
  .catch((err) => next(err));
})



// edit a product page
router.get('/edit/:id', (req, res, next) => {
  ProductModel.findById(req.params.id).populate('designer')
  .then((product) => {
    UserModel.find()
    .then((users) => {
      SerieModel.find()
      .then((series) => {
        res.render('./../views/users/1head/5hdeditproduct.hbs', {product, users, series})
      })
      .catch((err) => next(err))
    })
  })
});

// edit a product
router.post('/edit/:id', fileUploader.single("image"), (req, res, next) => {
  const { name, designer, inputEditors, category, color, material, serie, status, internalNotes, image } = req.body;
  ProductModel.findByIdAndUpdate(req.params.id, {new: true}, {
    name, designer, 
    editors: inputEditors.forEach((editor) => {
      if(editor !== "n/a") {
        editors.push(editor)
      }
    }), 
    category, color, material, serie, status, internalNotes,
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

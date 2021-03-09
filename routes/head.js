var express = require('express');
var router = express.Router();
// require product model
const ProductModel = require('./../models/Product');
//require serie model
const SerieModel = require('../models/Serie');
// require user model
const UserModel = require('./../models/User')
// require cloudinary for file upload
const fileUploader = require("./../config/cloudinary");
const { array } = require('./../config/cloudinary');

// get head designer main page
router.get('/', function(req, res, next) {
  ProductModel.find().populate('editors').populate('serie')
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
  const editorsToPush = filterNotApplicableEditors(editors);
  console.log('editorsToPush', editorsToPush)
  // update role of users that have been selected as editors from "Staff" to "Editor"
  updateRoleToEditor(editorsToPush);
  ProductModel.create({ name, designer, category, color, material, serie, status, internalNotes})
  .then((product) => {
    // push editors to array of editors
    const editorPromise = updateEditorsOfProduct(product._id, editorsToPush)
    editorPromise
    .then((productWithEditors) => {
      // push images to array of images
      const imagePromise = addImageOfProduct(product._id, req.file.path);
      imagePromise
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
    // delete models from serie
    ProductModel.deleteMany({serie: serie})
    .then((products) => {
      console.log('The series is no longer in the database');
      res.redirect('/head/series')
    })
    .catch((err) => next(err))
  })});

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
  // change role of user
  UserModel.findByIdAndUpdate(req.params.id, ({ role, team }), {new: true})
  .then((user) => {
    console.log(user);
    // remove user id from relevant product.
    const removeUserIdFromEditors = removeUserIdFromProductsEditors(req.params.id);
    removeUserIdFromEditors
    .then((products) => {
      console.log(products)
      res.redirect('/head/manage-rights')
    })
    .catch((err) => next(err))
  })
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
router.get('/edit-product/:id', (req, res, next) => {
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
router.post('/edit-product/:id', fileUploader.single("image"), (req, res, next) => {
  const { name, designer, editors, category, color, material, serie, status, internalNotes } = req.body;
  // editors should only contain ids of actual users: make sure n/a will not be pushed to editors' array
  const editorsToPush = filterNotApplicableEditors(editors);
  // update role of users that have been selected as editors from "Staff" to "Editor"
  updateRoleToEditor(editorsToPush);
  ProductModel.findByIdAndUpdate(req.params.id, { name, designer, category, color, material, serie, status, internalNotes}, {new: true})
  .then((editedProduct) => {
    // push editors to array of editors
    const editorPromise = updateEditorsOfProduct(req.params.id, editorsToPush)
    editorPromise
    .then((editedProductWithEditors) => {
      console.log('editedProductWithEditors', editedProductWithEditors)
      // filter double editors
      // create an array with single editors only
      const singleEditors = editedProductWithEditors.editors.filter((ed, i) => editedProductWithEditors.editors.indexOf(ed) === i)
      console.log('SE', singleEditors)
      // delete all editors from product
      const deleteEditorsPromise = deleteEditors(req.params.id, editedProductWithEditors);
      deleteEditorsPromise
      .then((productWithNoEditors) => {
        console.log('pwne', productWithNoEditors);
        const singleEditorsPromise = includeSingleEditors(req.params.id, singleEditors)
        // add array of single editors to product.editors
        singleEditorsPromise
        .then((productWithSingleEditors) => {
          console.log('pwse', productWithSingleEditors)
          // push image to array of images
          const imagePromise = addImageOfProduct(req.params.id, req.file.path);
          imagePromise
          .then((finalProduct) => {
            console.log(finalProduct);
            res.redirect('/head')
          })
          .catch((err) => next(err))
        })
      })
    })
  })
})

// delete a product
router.get('/delete-product/:id', (req, res, next) => {
  ProductModel.findByIdAndDelete(req.params.id)
  .then((product) => {
    console.log('The design is no longer in the database');
    res.redirect('/head');
  })
  .catch((err) => next(err));
});

//helpers

function filterNotApplicableEditors(formInputArray) {
  const editorsToPush = [];
  formInputArray.forEach((ed) => {
  if(ed !== 'n/a') {
      editorsToPush.push(ed)
  }
})
return editorsToPush
}

// update role tu editor when editor is added for product
function updateRoleToEditor(usersArray) {
  const newArray = usersArray.forEach((editor) => {
      UserModel.findByIdAndUpdate(editor, {role: "Editor"}, {new: true})
      .then((users) => console.log(users))
    })
    return newArray
}

// update editors of products when editor is added for product
function updateEditorsOfProduct(id, editorsIds){
  const editorPromise = ProductModel.findByIdAndUpdate(id, {$push: {editors: editorsIds}}, {new:true});
  return editorPromise;
}

// delete editors double in product.editors
function deleteEditors(id, product) {
  const deleteEditors = ProductModel.findByIdAndUpdate(id, {$pullAll: {editors: product.editors}}, {new: true})
  return deleteEditors;
}
    
// include singleEditors array in product.editors
function includeSingleEditors(id, singleEditors) {
  const singleEditorsPromise = ProductModel.findByIdAndUpdate(id, {editors: singleEditors})
  return singleEditorsPromise
}

// add image to product
function addImageOfProduct(id, imagePath){
  const imagePromise = ProductModel.findByIdAndUpdate(id, {$push: {images: imagePath}}, {new: true});
  return imagePromise;
}

// remove user id from relevant product
function removeUserIdFromProductsEditors(userId) {
  const removeUserIdPromise = ProductModel.updateMany({editors: userId}, {$pull: {editors: userId}}, {new: true})
  return removeUserIdPromise
}

module.exports = router;

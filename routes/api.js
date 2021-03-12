var express = require("express");
var router = express.Router();
const ProductModel = require("./../models/Product");
const UserModel = require("./../models/User");

// SEARCH PRODUCT
router.get("/products", (req, res, next) => {
  console.log("req.query is : ", req.query); // with input 'text' ==> { name: 'test' }
  console.log("req.query.name is : ", req.query.name); // with input 'text' ==> test
  let query = {};
  if (req.query.name) {
    // if we send a query string with the get request (?name=whatever)
    const exp = new RegExp(req.query.name); // creating a regular expression
    console.log("exp is : ", exp); // with input 'text' ==> /test
    query.name = { $regex: exp }; // create an object literal that will macth mongo query's expectations
    console.log("query.name is : ", query.name); // with input 'text ==> { '$regex': /test/ }
  } else {
    // make sure that if input bar is empty, it returns all objects with the following name: *** => nothing
    const exp = new RegExp("****"); // creating a regular expression
    query.name = { $regex: exp };
  }
  console.log("query is : ", query); // with input 'test' ==> { name: { '$regex': /test/ } }
  ProductModel.find(query)
    .populate("serie")
    .then((products) => res.status(200).json(products))
    .catch((err) => res.status(500).json(err));
});

// SEARCH USER
router.get("/users", (req, res, next) => {
  console.log("req.query is : ", req.query);
  console.log("req.query.firstName is : ", req.query.firstName);
  let query = {};
  if (req.query.firstName) {
    // if we send a query string with the get request (?name=whatever)
    const exp = new RegExp(req.query.firstName); // creating a regular expression
    console.log("exp is : ", exp);
    query.firstName = { $regex: exp }; // create an object literal that will macth mongo query's expectations
    console.log("query.firstNname is : ", query.firstName);
  } else {
    // make sure that if input bar is empty, it returns all objects with the following name: *** => nothing
    const exp = new RegExp("****"); // creating a regular expression
    query.name = { $regex: exp };
  }
  console.log("query is : ", query);
  UserModel.find(query)
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(500).json(err));
});

module.exports = router;

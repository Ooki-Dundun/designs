
var express = require("express");
var router = express.Router();
const ProductModel = require("./../models/Product");
const CommentModel = require('./../models/Comment');

router.get('/', (req, res, next) => {
    let query = {};
    if (req.query.name) {
        // if we send a query string with the get request (?name=whatever)
        const exp = new RegExp(req.query.name); // creating a regular expression
        query.name = {$regex: exp}; // create an object literal that will macth mongo query's expectations
    }
    ProductModel.find(query).populate('serie')
    .then((products) => res.status(200).json(products))
    .catch((err) => res.status(500).json(err))
})


module.exports = router
var express = require("express");
var router = express.Router();

// get log-in page (first page of app)
router.get("/", (req, res, next) => res.render("home"));

// get about page
router.get("/about", (req, res, next) => res.render("about"));

// get contact page
router.get("/contact", (req, res, next) => res.render("contact"));

module.exports = router;

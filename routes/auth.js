const express = require("express");
const router = express.Router();
// require user model to create new users
const UserModel = require('./../models/User')
// require bcrypt to encrypt data
const bcrypt = require("bcrypt"); // lib to encrypt data

// post log-in details
router.post('/log-in', (req, res, next) => {
    const { companyEmail, password } = req.body;
    UserModel.findOne({companyEmail: companyEmail})
    .then((foundUser) => {
        // if email not registered
        if(!foundUser) {
            console.log('Invalid credentials')
            // redirect to home page
            res.redirect('/');
            return
        }
        if(foundUser) {
            const isSamePassword = bcrypt.conpareSync(password, foundUser.password);
            if(!isSamePassword) {
                // if password is wrong
                console.log('Invalid credentials');
                // redirect to home page
                res.redirect('/');
            } else {
                // if email and password are correct, authenticate the user
                const userObject = foundUser.toObject();
                delete userObject.password; // remove password before saving user in session
                console.log(req.session) // just to get an idea
                req.session.currentUser = userObject; // Stores the user in the session (data server side + a cookie is sent client side)
                console.log("Logged in");
                if(foundUser.type === 'staff') {
                    res.redirect('/staff')
                } else if(founderUser.type === 'editor') {
                    res.redirect('/editor')
                } else {
                    res.redirect('/head')
                }
            }
        }
    })
});

// get sign up page 
router.get('/signup', (req, res, next) => res.render('./../views/users/signup.hbs'))

// post sign up details
router.post('/signup', (req, res, next) => {
    const newUser = {...req.body};
    // check if user already registered
    UserModel.findOne({companyEmail: newUser.companyEmail})
    .then((foudUser) => {
        if (foundUser) {
            console.log('You cannot register with this email');
            res.redirect('/auth/signup');
            return
        }
        if(!foundUser) {
            const hashedPassword = bcrypt.hashSync(req.body.password, 10);
            newUser.password = hashedPassword;
            UserModel.create({newUser})
            .then((newUser) => {
                console.log("Congrats, you are now registered");
                res.redirect("/");
            })
            // double check what to do with this
            .catch((err) => next(err));
        }
    })
})

module.exports = router;
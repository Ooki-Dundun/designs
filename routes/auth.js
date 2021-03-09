const express = require("express");
const router = express.Router();
// require user model to create new users
const UserModel = require('./../models/User')
// require bcrypt to encrypt data
const bcrypt = require("bcrypt"); // lib to encrypt data


// get sign up page 
router.get('/signup', (req, res, next) => res.render('./../views/users/signup.hbs'))

// post sign up details
router.post('/signup', (req, res, next) => {
    const newUser = {...req.body};
    console.log(newUser);
    // check if user already registered
    UserModel.findOne({companyEmail: newUser.companyEmail})
    .then((foundUser) => {
        if (foundUser) {
            console.log('You cannot register with this email');
            res.redirect('/auth/signup');
        } else {
            if(!foundUser) {
                const hashedPassword = bcrypt.hashSync(req.body.password, 10);
                newUser.password = hashedPassword;
                UserModel.create({
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    companyEmail: newUser.companyEmail,
                    phoneNumber: newUser.phoneNumber,
                    password: newUser.password
                })
                .then((newUser) => {
                    console.log("Congrats, you are now registered", newUser);
                    res.redirect("/");
                })
                // double check what to do with this
                .catch((err) => next(err));
            }
        }
    })
})

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
            const isSamePassword = bcrypt.compareSync(password, foundUser.password);
            if(!isSamePassword) {
                // if password is wrong
                console.log('Invalid credentials');
                // redirect to home page
                res.redirect('/');
            } else {
                // if email and password are correct, authenticate the user
                /* const userObject = foundUser.toObject();
                delete userObject.password; // remove password before saving user in session
                console.log(req.session) // just to get an idea
                req.session.currentUser = userObject; // Stores the user in the session (data server side + a cookie is sent client side) */
                console.log("Logged in");
                if(foundUser.role === 'Staff') {
                    res.redirect('/staff')
                } else if(foundUser.role === 'Editor') {
                    res.redirect('/editor')
                } else {
                    res.redirect('/head')
                }
            }
        }
    })
});

//log out

module.exports = router;
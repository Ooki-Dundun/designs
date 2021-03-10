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
            req.flash('error', 'You cannot register with this information');
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
                    req.flash('success', "Congrats, you are now registered");
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
    console.log('RES.LOCALS === > ', res.locals)
    const { companyEmail, password } = req.body;
    UserModel.findOne({companyEmail: companyEmail})
    .then((foundUser) => {
        // if email not registered
        if(!foundUser) {
            // redirect to home page
            req.flash('error', 'Invalid credentials');
            res.redirect('/');
            return
        }
        if(foundUser) {
            // check if password is correct
            if(!bcrypt.compareSync(password, foundUser.password)) {
                // if password is wrong
                req.flash('error', 'Invalid credentials');
                res.redirect('/');
            } else {
                // if email and password are correct, authenticate the user
                const userObject = foundUser.toObject();
                delete userObject.password; // remove password before saving user in session
                console.log('SESSION ========> ', req.session) // just to get an idea
                req.session.currentUser = userObject; // Stores the user in the session (data server side + a cookie is sent client side)
                console.log('req.session.currentUser :', req.session.currentUser)
                console.log('RES.LOCALS === > ', res.locals) 
                if(foundUser.role === 'Staff') {
                    console.log('RES.LOCALS === > ', res.locals) 
                    req.flash('success', 'Successfully connected')
                    res.redirect('/staff')
                } else if(foundUser.role === 'Editor') {
                    console.log('RES.LOCALS === > ', res.locals) 
                    req.flash('success', 'Successfully connected')
                    res.redirect('/editor')
                } else {
                    console.log('RES.LOCALS === > ', res.locals) 
                    req.flash('success', 'Successfully connected')
                    res.redirect('/head')
                }
            }
        }
    })
});

//log out
router.get("/log-out", (req, res, next) => {
    req.session.destroy();
    console.log('logged out');
    res.redirect("/");
});

module.exports = router;
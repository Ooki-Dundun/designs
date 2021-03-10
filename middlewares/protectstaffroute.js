module.exports = function protectStaffRoute(req, res, next) {
    if (req.session.currentUser) {
        next()
    } else {
        res.redirect('/');
    }
}
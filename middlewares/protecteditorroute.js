module.exports = function protectEditorRoute(req, res, next) {
    // note that if not staff, role has to be designer or editor
    if (req.session.currentUser && req.session.currentUser.role !== "Staff") {
        next()
    } else {
        res.redirect('/');
    }
}
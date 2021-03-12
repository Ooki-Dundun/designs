module.exports = function protectDesignerRoute(req, res, next) {
  // note that if not staff, role has to be designer or editor
  if (req.session.currentUser && req.session.currentUser.role === "Designer") {
    next();
  } else {
    res.redirect("/");
  }
};

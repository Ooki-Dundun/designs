module.exports = function showLoginStatus(req, res, next) {
  if (!req.session.currentUser) {
    res.locals.currentUser = undefined;
    res.locals.isLoggedIn = false;
    res.locals.isDesigner = false;
    res.locals.isEditor = false;
  } else {
    res.locals.currentUser = req.session.currentUser;
    res.locals.isLoggedIn = true;
    res.locals.isDesigner = req.session.currentUser.role === "Designer";
    res.locals.isEditor = req.session.currentUser.role === "Editor";
    res.locals.isStaff =
      req.session.currentUser.role !== "Designer" &&
      req.session.currentUser.role !== "Editor";
  }
  next();
};

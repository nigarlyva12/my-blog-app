
function isAdmin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).send('Unauthorized: Please login');
  }

  if (!req.session.user.isAdmin) {
    return res.status(403).send('Forbidden: Admins only');
  }
  next();
}

module.exports = isAdmin;
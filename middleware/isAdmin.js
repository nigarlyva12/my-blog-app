
function isAdmin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).send('Unauthorized: Please login');
  }

  if (!req.session.user.isAdmin) {
    return res.status(403).send('Forbidden: Admins only');
  }
  next();
}

module.exports = (req, res, next) => {
  console.log('Checking if user is admin:', req.user);
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).send('Unauthorized');
  }
  next();
};
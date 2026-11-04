function authorizeSelfOrAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }

  const requestedId = Number(req.params.id);

  if (req.user.role === "admin" || Number(req.user.id) === requestedId) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "You do not have permission to access this resource"
  });
}

module.exports = authorizeSelfOrAdmin;
const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

const baseAccess = (req, res, next) => {
  if (req.user.role === 'base_commander') {
   
    if (req.params.baseId && req.params.baseId !== req.user.baseId.toString()) {
      return res.status(403).json({ error: 'Access restricted to assigned base' });
    }
    
    
    req.baseFilter = { baseId: req.user.baseId };
  } else {
    req.baseFilter = {};
  }
  next();
};

module.exports = { authorize, baseAccess };
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Verify JWT and attach user to req
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('User no longer exists');
      }
      if (!req.user.isActive) {
        res.status(403);
        throw new Error('Account is deactivated');
      }
      return next();
    } catch (err) {
      res.status(401);
      throw new Error('Not authorised, token failed');
    }
  }

  res.status(401);
  throw new Error('Not authorised, no token provided');
});

module.exports = { protect };

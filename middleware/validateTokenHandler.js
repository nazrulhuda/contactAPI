const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require('../errors')

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECERT, (err, decoded) => {
      if (err) {
        throw new UnauthenticatedError('Authentication invalid')
      }
      req.user = decoded.user;
      next();
    });

    if (!token) {
      throw new UnauthenticatedError('Authetication invalid')
    }
  }
});

module.exports = validateToken;

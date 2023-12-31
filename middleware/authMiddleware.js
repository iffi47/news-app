const jwt = require('jsonwebtoken');
const User = require("../models/UserModel")
const asyncHandler = require('express-async-handler')
const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.header = await User.findById(decoded.id).select('-password')
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({
        success: false,
        message: "Session Expired"
      })
    }
  }
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Not Authorized"
    })
  }
})

module.exports = protect
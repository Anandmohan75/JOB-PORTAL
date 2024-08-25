const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async function (req, res, next) {

  const authHeader = req.header('Authorization');
  const token = authHeader?.split(' ')[1];
  console.log('Received Authorization Header:', authHeader); // Log the entire header
  console.log('Token:', token); // Log the token itself


  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;

    // Ensure the user still exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ msg: 'User no longer exists' });
    }
    
    next();
  } catch (err) {
    console.error(err); 
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

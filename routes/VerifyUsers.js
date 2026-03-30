const express = require('express');
const jwt = require('jsonwebtoken');
const Users = require('../models/Users.js');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    let token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    if (!token) return res.status(401).json({ message: 'Token missing' });

    // Decode and verify token
    const decoded = jwt.verify(token, process.env.JWT_String);
    
    // Fetch full user from DB
    const user = await Users.findOne({ Email: decoded.User }); // Assuming token contains { User: email }

    if (!user) return res.status(404).json({ message: 'User not found' });

    req.user = user; // Attach full user object to the request
    next();
  } catch (err) {
    console.error('Auth error:', err.message + err);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
const authenticateTokenAndisAdmin = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  let token;

  if (!authHeader) {
    return res.status(401).json({ message: 'No authorization header provided' });
  }

  // Extract token
  token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_String);
    // Fetch user from DB using email from token
    const result = await getUserByEmail(decoded.User);

    if (!result.success || !result.data) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.data;

    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Not an admin.' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication error:", err);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

const getUserByEmail = async (decodedToken) => {
  try {
    const user = await Users.findOne({ Email: decodedToken.User , Email: decodedToken }); // Assumes JWT payload has `User` key containing email
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    return { success: true, data: user };
  } catch (err) {
    console.error('Error fetching user by email:', err);
    return { success: false, message: 'Error retrieving user', error: err.message };
  }
};

// const authenticateTokenAndisAdmin = async (req, res, next) => {

//   const authHeader = req.headers['authorization'];
//   console.log(authHeader);
//   let token = 0;
//   if (authHeader) {
//     if (authHeader.startsWith('Bearer ')) {
//       token = authHeader.substring(7);

//     }
//     else {
//       token = authHeader;
//       console.log(token);
//     }

//     if (!token) return res.status(401).json({ message: 'Unauthorized' });

//     await jwt.verify(token, process.env.JWT_String, (err, user) => {
//       if (err) return res.status(403).json({ message: 'Invalid token' });
//       console.log(user);
//       user = getUserByEmail(user);
//       console.log(user);
//       if (user.User.isAdmin) {
//         req.user = user;
//       }
//       else {
//         req.user = null;
//         return res.status(403).json({ message: 'Invalid Request' });
//       }
//       next();
//     });
//   }
// };

// const getUserByEmail = async (email) => {
//   try {
//     const user = await Users.findOne({ Email: email.User });
//     console.log(user);
//     if (!user) {
//       return { success: false, message: 'User not found' };
//     }

//     return { success: true, data: user };
//   } catch (err) {
//     console.error('Error fetching user by email:', err);
//     return { success: false, message: 'Error retrieving user', error: err.message };
//   }
// };


module.exports = { authenticateToken, authenticateTokenAndisAdmin, getUserByEmail }



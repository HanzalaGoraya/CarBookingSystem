const express = require('express');
const Users = require('../models/Users.js');
const OTPStore = require('../models/Otps.js');
const nodemailer = require('nodemailer');
const { generateTOTP } = require('otp-generator');
const { authenticateToken, authenticateTokenAndisAdmin, getUserByEmail } = require('./VerifyUsers');
const {OtpStoreAndEmail} = require('../services/otpemails.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
require('dotenv').config();

router.post("/register", async (req, res) => {
    try {
      const registeruser = req.body;
  
      // Validate input data
      if (!registeruser.Email || !registeruser.Password) {
        throw new Error("Email and password are required");
      }
  
      // Check if user already exists
      const user = await Users.findOne({ Email: registeruser.Email });
      if (user) {
        throw new Error("User  Already Registered");
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(registeruser.Password, 10);
  
      // Create new user document
      const newUser = new Users({ ...registeruser, Password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({ message: "User  registered successfully", data: newUser });
    } catch (err) {
      console.error("Error Registering user:", err);
      res.status(500).json({ message: "Error registering user", error: err.message });
    }
  });

router.get('/getallusers',authenticateTokenAndisAdmin, async (req,res)=>{
    var user = req.user;
    if(user){
    
    try {        
        const userdetails = await Users.find({});
    
        if (userdetails) {
          res.status(200).json({ message: 'Users retrieved successfully', data: userdetails });
        } else {
          res.status(404).json({ message: 'Users not found' });
        }
      } catch (err) {
        console.error('Error retrieving Users:', err);
        res.status(500).json({ message: 'Error retrieving Users', error: err.message });
      }
    }
    else{
        console.error('Error retrieving Users due to Unauthorisation:', err);
        res.status(500).json({ message: 'Error retrieving Users due to Unauthorisation', error: err.message });
    }
  });
  router.get('/getuser',authenticateToken, async (req,res)=>{
    var user = req.user;
    if(user){
    const id=user._id;
 
    try {       
        const userdetails = await Users.find({_id : id});
    
        if (userdetails) {
          res.status(200).json({ message: 'Users retrieved successfully', data: userdetails });
        } else {
          res.status(404).json({ message: 'Users not found' });
        }
      } catch (err) {
        console.error('Error retrieving Users:', err);
        res.status(500).json({ message: 'Error retrieving Users', error: err.message });
      }
    }
    else{
        console.error('Error retrieving Users due to Unauthorisation:', err);
        res.status(500).json({ message: 'Error retrieving Users due to Unauthorisation', error: err.message });
    }
  });

  router.post('/login', async (req, res) => {
    const email = req.body.Email;
    const password = req.body.Password;
  
    const user = await Users.findOne({ Email: email });
  
    if (user?.Active) {
      const isValid = await bcrypt.compare(password, user.Password);
      if (!isValid) {
        res.status(401).json({ message: 'Invalid Password' });
      } else {
        const token = jwt.sign({ User: user.Email }, process.env.JWT_String, { expiresIn: '1440m' });
        res.json({ token, Email: user.Email, Role: user.isAdmin ? 'admin' : 'user',U_id : user._id, FirstName : user.FirstName, LastName : user.LastName });
      }
    } else {
      res.status(401).json({ message: 'User  Not Registered or No Longer Allowed' });
    }
  });

  router.post('/doesuserexist',async (req,res)=>{
    const email = req.body.Email;
    var result = "";
    result = await getUserByEmail(email);
    result.success?res.status(200).json({ message: 'User Exists', exists : true }):res.send(JSON.stringify({ message: 'User Does Not Exists', exists : false }));
  });

  // router.post('/verifyadmin',authenticateTokenAndisAdmin,(req,res)=>{
  //   res.send(req.user);
  // });

  router.post('/getOtp', async (req, res) => {
    const email = req.body.Email;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Invalid email address' });
    }
  
    try {
      const user = await Users.findOne({ Email: email });
      if (user) {
        OtpStoreAndEmail(email);
        res.status(200).json({ message: 'OTP Sent Successfully'});
      } else {
        res.status(401).json({ message: 'User  Not Registered' });
      }
    } catch (err) {
      console.error('Error getting user:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  router.post('/verifyotp', async (req, res) => {
    const otp = req.body.Otp;
    const email = req.body.Email;
    const currentTime = new Date().getTime();
    const otpValidityTime = 5 * 60 * 1000; 
    const user = await OTPStore.findOne({ Email: email });
  
    if (otp === user.OtpCode && currentTime - user.updatedAt.getTime() <= otpValidityTime) {
      res.status(200).json({ message: 'OTP Verified Successfully', otpverification: true });
    } else {
      if (currentTime - user.updatedAt.getTime() > otpValidityTime) {
        res.status(400).json({ message: 'OTP Expired', otpverification: false });
      } else {
        res.status(400).json({ message: 'OTP Verification Failed', otpverification: false });
      }
    }
  });
  // Delete a user (Admin only)
router.delete('/deleteuser', authenticateTokenAndisAdmin, async (req, res) => {
  const userId = req.body._id;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const result = await Users.deleteOne({ _id: userId });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
});


  router.post('/resetpassword', async (req, res) => {
    const email = req.body.Email;
    const updatedpassword = req.body.UpdatedPassword;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Invalid email address' });
    }
    if (!updatedpassword) {
        return res.status(400).json({ message: 'Invalid Password' });
      }
  
    try {
      const user = await Users.findOne({ Email: email });
      if (user) {
        const hashedPassword = await bcrypt.hash(updatedpassword, 10);
        const updatepassword = await Users.findOneAndUpdate(
            { Email: email },
            { $set: {Password : hashedPassword} },
            { new: true },
          );

          if(updatepassword)
            {res.status(200).json({ message: 'Password Updated Successfully', passwordupdation : true})}
          else{res.status(400).json({ message: 'Password Update Failed', passwordupdation : false})}

      } else {
        res.status(401).json({ message: 'User Not Registered' });
      }
    } catch (err) {
      console.error('Error getting user:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

module.exports = router;

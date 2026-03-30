const express = require('express');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy'); // Use speakeasy for TOTP
const OTPStore = require('../models/Otps.js');

const OtpStoreAndEmail = async (email) => {
  // Generate a secret key for the user
  const secretKey = speakeasy.generateSecret().base32;

  // Generate a TOTP OTP
  const otp = speakeasy.totp({
    secret: secretKey,
    encoding: 'base32',
    step: 300 // 5-minute interval
  });



  // Store the OTP and email securely in the database
  const otpobj = {
    Email: email,
    OtpCode: otp
  };

  const saveotp = await OTPStore.findOneAndUpdate(
    { Email: email },
    { $set: otpobj },
    { new: true, upsert: true } // Proper options structure with upsert
  );

  // Create a transporter object
  const transporter = nodemailer.createTransport({
    host: 'smtp.ionos.co.uk',
    port: 587,
    secure: false, // Use STARTTLS for a secure connection
    auth: {
      user: process.env.EMAIL_USER, // Store in environment variables
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false // Allow self-signed certificates
    }
  });

  // Define the email template
  const emailTemplate = {
    from: 'Pitstop Glasgow <admin@pitstopglasgow.com>',
    to: email,
    subject: 'Password Reset OTP',
    text: `Your password reset OTP is: ${otp}`
  };

  // Send the email
  transporter.sendMail(emailTemplate, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent successfully`);
    }
  });
};

module.exports = { OtpStoreAndEmail };

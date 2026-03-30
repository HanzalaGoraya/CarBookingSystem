const express = require('express');
const { authenticateToken, authenticateTokenAndisAdmin } = require('./VerifyUsers');
const router = express.Router();
require('dotenv').config();

const Customers = require('../models/Customers');

// Create Customer
router.post('/addcustomer', authenticateTokenAndisAdmin, async (req, res) => {
  if (req.user) {
    try {
      const newCustomer = new Customers(req.body);
      await newCustomer.save();

      res.status(201).json({
        message: 'Customer created successfully',
        data: newCustomer,
      });
    } catch (err) {
      console.error('Error creating customer:', err);
      res.status(500).json({
        message: 'Error creating customer',
        error: err.message,
      });
    }
  }
});

// Update Customer
router.patch('/updatecustomer', authenticateTokenAndisAdmin, async (req, res) => {
  if (req.user) {
    const { _id, ...updates } = req.body;

    if (!_id) {
      return res.status(400).json({ message: 'Customer ID is required' });
    }

    try {
      const updatedCustomer = await Customers.findByIdAndUpdate(_id, updates, {
        new: true,
      });

      if (!updatedCustomer) {
        return res.status(404).json({ message: 'Customer not found' });
      }

      res.status(200).json({
        message: 'Customer updated successfully',
        data: updatedCustomer,
      });
    } catch (err) {
      console.error('Error updating customer:', err);
      res.status(500).json({
        message: 'Error updating customer',
        error: err.message,
      });
    }
  }
});

// Delete Customer
router.delete('/deletecustomer', authenticateTokenAndisAdmin, async (req, res) => {
  if (req.user) {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ message: 'Customer ID is required' });
    }

    try {
      const deletedCustomer = await Customers.findByIdAndDelete(_id);

      if (!deletedCustomer) {
        return res.status(404).json({ message: 'Customer not found' });
      }

      res.status(200).json({
        message: 'Customer deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting customer:', err);
      res.status(500).json({
        message: 'Error deleting customer',
        error: err.message,
      });
    }
  }
});

// Get All Customers
router.get('/getcustomers', authenticateTokenAndisAdmin, async (req, res) => {
  if (req.user) {
    try {
      const customers = await Customers.find({});

      res.status(200).json({
        message: 'Customers retrieved successfully',
        data: customers,
      });
    } catch (err) {
      console.error('Error retrieving customers:', err);
      res.status(500).json({
        message: 'Error retrieving customers',
        error: err.message,
      });
    }
  }
});

// Get Single Customer
router.post('/viewcustomer', authenticateToken, async (req, res) => {
  if (req.user) {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ message: 'Customer ID is required' });
    }

    try {
      const customer = await Customers.findById(_id);

      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }

      res.status(200).json({
        message: 'Customer retrieved successfully',
        data: customer,
      });
    } catch (err) {
      console.error('Error retrieving customer:', err);
      res.status(500).json({
        message: 'Error retrieving customer',
        error: err.message,
      });
    }
  }
});

module.exports = router;
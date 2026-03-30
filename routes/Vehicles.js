const express = require('express');
const { authenticateToken, authenticateTokenAndisAdmin } = require('./VerifyUsers');
const router = express.Router();
require('dotenv').config();

const Vehicles = require('../models/Vehicles');

// Create Vehicle
router.post('/addvehicle', authenticateToken, async (req, res) => {
  if (req.user) {
    try {
      const newVehicle = new Vehicles(req.body);
      await newVehicle.save();

      res.status(201).json({
        message: 'Vehicle created successfully',
        data: newVehicle,
      });
    } catch (err) {
      console.error('Error creating vehicle:', err);
      res.status(500).json({
        message: 'Error creating vehicle',
        error: err.message,
      });
    }
  }
});

// Update Vehicle
router.patch('/updatevehicle', authenticateTokenAndisAdmin, async (req, res) => {
  if (req.user) {
    const { _id, ...updates } = req.body;

    if (!_id) {
      return res.status(400).json({ message: 'Vehicle ID is required' });
    }

    try {
      const updatedVehicle = await Vehicles.findByIdAndUpdate(_id, updates, {
        new: true,
      });

      if (!updatedVehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }

      res.status(200).json({
        message: 'Vehicle updated successfully',
        data: updatedVehicle,
      });
    } catch (err) {
      console.error('Error updating vehicle:', err);
      res.status(500).json({
        message: 'Error updating vehicle',
        error: err.message,
      });
    }
  }
});

// Delete Vehicle
router.delete('/deletevehicle', authenticateTokenAndisAdmin, async (req, res) => {
  if (req.user) {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ message: 'Vehicle ID is required' });
    }

    try {
      const deletedVehicle = await Vehicles.findByIdAndDelete(_id);

      if (!deletedVehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }

      res.status(200).json({
        message: 'Vehicle deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      res.status(500).json({
        message: 'Error deleting vehicle',
        error: err.message,
      });
    }
  }
});

// Get All Vehicles
router.get('/getvehicles', authenticateTokenAndisAdmin, async (req, res) => {
  if (req.user) {
    try {
      const vehicles = await Vehicles.find({});

      res.status(200).json({
        message: 'Vehicles retrieved successfully',
        data: vehicles,
      });
    } catch (err) {
      console.error('Error retrieving vehicles:', err);
      res.status(500).json({
        message: 'Error retrieving vehicles',
        error: err.message,
      });
    }
  }
});

// Get Single Vehicle
router.post('/viewvehicle', authenticateToken, async (req, res) => {
  if (req.user) {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ message: 'Vehicle ID is required' });
    }

    try {
      const vehicle = await Vehicles.findById(_id);

      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }

      res.status(200).json({
        message: 'Vehicle retrieved successfully',
        data: vehicle,
      });
    } catch (err) {
      console.error('Error retrieving vehicle:', err);
      res.status(500).json({
        message: 'Error retrieving vehicle',
        error: err.message,
      });
    }
  }
});

module.exports = router;
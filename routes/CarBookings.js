const express = require('express');
const { authenticateToken, authenticateTokenAndisAdmin } = require('./VerifyUsers');
const router = express.Router();
require('dotenv').config();

const Bookings = require('../models/CarBookings');

// Create Booking
router.post('/addcarbooking', authenticateTokenAndisAdmin, async (req, res) => {
  if (req.user) {
    try {
      const {
        CutomerDetails,
        VehicleDetails,
        CustomerName,
        Email,
        PhoneNumber,
        VehicleRegistrationNumber,
      } = req.body;

      const newBooking = new Bookings({
        CutomerDetails,
        VehicleDetails,
        CustomerName,
        Email,
        PhoneNumber,
        VehicleRegistrationNumber,
      });

      await newBooking.save();

      const populatedBooking = await Bookings.findById(newBooking._id)
        .populate(
          'CutomerDetails',
          'CustomerFirstName CustomerLastName Email PhoneNumber CustomerCNIC'
        )
        .populate(
          'VehicleDetails'
        );

      res.status(201).json({
        message: 'Car booking created successfully',
        data: populatedBooking,
      });
    } catch (err) {
      console.error('Error creating booking:', err);
      res.status(500).json({
        message: 'Error creating booking',
        error: err.message,
      });
    }
  }
});

// Update Booking
router.patch('/updatecarbooking', authenticateTokenAndisAdmin, async (req, res) => {
  if (req.user) {
    const { _id, ...updates } = req.body;

    if (!_id) {
      return res.status(400).json({ message: 'Booking ID is required' });
    }

    try {
      const updatedBooking = await Bookings.findByIdAndUpdate(_id, updates, {
        new: true,
      })
        .populate(
          'CutomerDetails',
          'CustomerFirstName CustomerLastName Email PhoneNumber CustomerCNIC'
        )
        .populate('VehicleDetails');

      if (!updatedBooking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      res.status(200).json({
        message: 'Booking updated successfully',
        data: updatedBooking,
      });
    } catch (err) {
      console.error('Error updating booking:', err);
      res.status(500).json({
        message: 'Error updating booking',
        error: err.message,
      });
    }
  }
});

// Delete Booking
router.delete('/deletecarbooking', authenticateTokenAndisAdmin, async (req, res) => {
  if (req.user) {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ message: 'Booking ID is required' });
    }

    try {
      const deletedBooking = await Bookings.findByIdAndDelete(_id);

      if (!deletedBooking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      res.status(200).json({
        message: 'Booking deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting booking:', err);
      res.status(500).json({
        message: 'Error deleting booking',
        error: err.message,
      });
    }
  }
});

// Get All Bookings
router.get('/getcarbookings', authenticateTokenAndisAdmin, async (req, res) => {
  if (req.user) {
    try {
      const bookings = await Bookings.find({})
        .populate(
          'CutomerDetails',
          'CustomerFirstName CustomerLastName Email PhoneNumber CustomerCNIC'
        )
        .populate('VehicleDetails');

      res.status(200).json({
        message: 'Bookings retrieved successfully',
        data: bookings,
      });
    } catch (err) {
      console.error('Error retrieving bookings:', err);
      res.status(500).json({
        message: 'Error retrieving bookings',
        error: err.message,
      });
    }
  }
});

// Get Single Booking
router.post('/viewcarbooking', authenticateToken, async (req, res) => {
  if (req.user) {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ message: 'Booking ID is required' });
    }

    try {
      const booking = await Bookings.findById(_id)
        .populate(
          'CutomerDetails',
          'CustomerFirstName CustomerLastName Email PhoneNumber CustomerCNIC'
        )
        .populate('VehicleDetails');

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      res.status(200).json({
        message: 'Booking retrieved successfully',
        data: booking,
      });
    } catch (err) {
      console.error('Error retrieving booking:', err);
      res.status(500).json({
        message: 'Error retrieving booking',
        error: err.message,
      });
    }
  }
});

module.exports = router;
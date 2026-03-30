const nodemailer = require("nodemailer");
require("dotenv").config();

/**
 * Common Transporter
 */
const transporter = nodemailer.createTransport({
  host: "smtp.ionos.co.uk",
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

/**
 * DROPOFF CONFIRMATION
 */
const sendDropOffConfirmation = async (booking) => {
  try {
    if (!booking.Email) throw new Error("Customer email not provided");

    const mailOptions = {
      from: "Pitstop Glasgow <admin@pitstopglasgow.com>",
      to: booking.Email,
      subject: "✅ Vehicle Successfully Dropped Off",
      html: `
        <h2>Hello ${booking.CustomerName || "Customer"},</h2>
        <p>Your vehicle has been <b>successfully dropped off</b> at Pitstop Glasgow.</p>

        <h3>Booking Details</h3>
        <ul>
          <li><strong>Vehicle:</strong> ${booking.VehicleRegistrationNumber}</li>
          <li><strong>Date:</strong> ${new Date(booking.BookingDate).toDateString()}</li>
          <li><strong>Time Slot:</strong> ${booking.BookingSlot}</li>
        </ul>

        <p>Our team will begin working on your vehicle shortly.</p>

        <p>
          Kind regards,<br/>
          <b>Pitstop Glasgow Team</b>
        </p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Drop-off email sent successfully`);
  } catch (error) {
    console.error("❌ Drop-off email error:", error.message);
  }
};

/**
 * COMPLETION CONFIRMATION
 */
const sendCompletionConfirmation = async (booking) => {
  try {
    if (!booking.Email) throw new Error("Customer email not provided");

    const mailOptions = {
      from: "Pitstop Glasgow <admin@pitstopglasgow.com>",
      to: booking.Email,
      subject: "🚗✅ Vehicle Service Completed",
      html: `
        <h2>Hello ${booking.CustomerName || "Customer"},</h2>
        <p>We are happy to inform you that your vehicle servicing is <b>now completed</b>.</p>

        <h3>Booking Summary</h3>
        <ul>
          <li><strong>Vehicle:</strong> ${booking.VehicleRegistrationNumber}</li>
          <li><strong>Total Booking Date:</strong> £${booking.BookingDate}</li>
          <li><strong>Booking Slot:</strong> £${booking.BookingSlot}</li>
        </ul>

        <p>Your vehicle is ready for collection.</p>

        <p>
          Thank you for choosing Pitstop Glasgow.<br/>
          <b>Pitstop Glasgow Team</b>
        </p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Completion email sent successfully`);
  } catch (error) {
    console.error("❌ Completion email error:", error.message);
  }
};

/**
 * CANCELLATION CONFIRMATION
 */
const sendCancellationConfirmation = async (booking) => {
  try {
    if (!booking.Email) throw new Error("Customer email not provided");

    const cancelledBy = booking.CancelledBy || "System";
    const reason = booking.CancellationNote || "No reason provided";

    const mailOptions = {
      from: "Pitstop Glasgow <admin@pitstopglasgow.com>",
      to: booking.Email,
      subject: "❌ Booking Cancelled – Pitstop Glasgow",
      html: `
        <h2>Hello ${booking.CustomerName || "Customer"},</h2>
        <p>Your booking with <b>Pitstop Glasgow</b> has been <b>cancelled</b>.</p>

        <h3>Booking Details</h3>
        <ul>
          <li><strong>Vehicle:</strong> ${booking.VehicleRegistrationNumber}</li>
          <li><strong>Date:</strong> ${new Date(booking.BookingDate).toDateString()}</li>
          <li><strong>Time Slot:</strong> ${booking.BookingSlot}</li>
        </ul>

        <h3>Cancellation Information</h3>
        <ul>
          <li><strong>Cancelled by:</strong> ${cancelledBy}</li>
          <li><strong>Reason:</strong> ${reason}</li>
        </ul>

        <p>If this was a mistake or you wish to rebook, please contact us.</p>

        <p>
          Kind regards,<br/>
          <b>Pitstop Glasgow Team</b>
        </p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Cancellation email sent successfully`);

  } catch (error) {
    console.error("❌ Cancellation email error:", error.message);
  }
};


module.exports = {
  sendDropOffConfirmation,
  sendCompletionConfirmation,
  sendCancellationConfirmation
};

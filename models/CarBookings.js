// const  mongoose =  require('mongoose');
// const { Schema, model } = mongoose;

// const BookingSchema = new Schema({
//   CustomerDetails: {type: Schema.Types.ObjectId, ref: 'Customers', default : ""},
//   VehicleDetails: {type: Schema.Types.ObjectId, ref: 'Vehicles', default : ""},
//   CustomerName: {type : String},
//   Email: {type : String},
//   PhoneNumber: {type : String},
//   VehicleRegistrationNumber : {type : String},
//   PerDayBookingCost:{type : String},
//   TotalBookingPrice: {type : String},
//   BookingAdvancePaid: {type : String},
//   BookingTBP: {type : String},
//   BookingDuration: {type : String},
//   BookingStartDate: {type : Date},
//   BookingEndDate: {type : Date},
//   BookingStatus: {type : String, default: "Confirmed"},


  
//   },
// {timestamps:true},  

// );

// const CarBookings = model('Bookings', BookingSchema);
// module.exports = CarBookings;

const BookingSchema = new Schema({
  CustomerDetails: { type: Schema.Types.ObjectId, ref: 'Customers', default: "" },
  VehicleDetails: { type: Schema.Types.ObjectId, ref: 'Vehicles', default: "" },
  CustomerName: { type: String },
  Email: { type: String },
  PhoneNumber: { type: String },
  VehicleRegistrationNumber: { type: String },
  PerDayBookingCost: { type: String },
  TotalBookingPrice: { type: String },
  BookingAdvancePaid: { type: String },
  BookingTBP: { type: String },
  BookingDuration: { type: String },
  BookingStartDate: { type: Date },
  BookingEndDate: { type: Date },
  BookingStatus: { type: String, default: "Confirmed" },
}, { timestamps: true });
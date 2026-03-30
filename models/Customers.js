const  mongoose =  require('mongoose');
const { Schema, model } = mongoose;

const CustomerSchema = new Schema({
  CustomerFirstName : {type : String, required : true},
  CustomerLastName : {type : String, required : true},
  CustomerCNIC : {type : String},
  CustomerLicenceNumber : {type : String},
  Email : {type: String,minLength: 10,trim: true},
  PhoneNumber : {type : String},
  BlackListed : {type : Boolean, default : false},
  },
{timestamps:true},  

);

const Customers = model('Customers', CustomerSchema);
module.exports = Customers;
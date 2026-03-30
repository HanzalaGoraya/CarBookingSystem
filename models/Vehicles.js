const  mongoose =  require('mongoose');
const { Schema, model } = mongoose;

const VehicleSchema = new Schema({
  Name : {type : String, required : true},
  Model : {type : String,required : true},
  Color : {type: String,required : true},
  EngineCapacity : {type: String, required : true},
  FuelType:{type:String, required : true},
  RegistrationNumber : {type : String},
  ActiveInsurance : {type : Boolean, default : true},
  InspectionDate : {type:Date},
  Condition : {type : String,default : "Excellent"},
  MaintenanceRequired : {type : Boolean, default : false},
  },
{timestamps:true},  

);

const Vehicles = model('Vehicles', VehicleSchema);
module.exports = Vehicles;
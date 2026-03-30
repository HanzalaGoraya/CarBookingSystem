const  mongoose =  require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  isAdmin: {type : Boolean, default : false,},
  FirstName : {type : String, required : true},
  LastName : {type : String},
  UserName : {type: String,trim: true},
  Email : {type: String,minLength: 10,trim: true},
  Password:{type:String, required : true},
  PhoneNumber : {type : String},
  Active : {type : Boolean, default : true},
  },
{timestamps:true},  

);

const Users = model('Users', UserSchema);
module.exports = Users;
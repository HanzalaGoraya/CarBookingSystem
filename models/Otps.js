const  mongoose =  require('mongoose');
const { Schema, model } = mongoose;

const OtpSchema = new Schema({
  Email : {type: String,minLength: 10,required: true},
  OtpCode:{type:String, required : true},
  },
{timestamps:true},  

);

const Otps = model('Otps', OtpSchema);
module.exports = Otps;
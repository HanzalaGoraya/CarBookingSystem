const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const CustomersRoute = require("./routes/Customers.js");
const CarBookingsRoute = require("./routes/CarBookings.js");
const VehiclesRoute = require("./routes/Vehicles.js");
const UsersRoute = require("./routes/Users.js");


dotenv.config();

const app = express();
//app.use(cors());
app.use(cors({
  origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users",UsersRoute);
app.use("/api/carbookings",CarBookingsRoute);
app.use("/api/customers",CustomersRoute);
app.use("/api/vehicles",VehiclesRoute);


const dbconnection = async () => {
    try {
      await mongoose.connect(process.env.DB_ConnectionString, {
       
      });
  
      console.log("DB Connected");

 
    } catch (err) {
      console.error("DB connection error:", err);
    }
  };
  dbconnection();

app.get("/",(req,res)=>{
    res.send("Server Running    ");

});
const Port = (process.env.PORT || 3000);
app.listen(Port);

module.exports = dbconnection;
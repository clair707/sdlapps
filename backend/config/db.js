require('dotenv').config(); 
// config/db.js
const mongoose = require("mongoose");

let isConnected = false; // Track if already connected

// Set strictQuery explicitly to suppress the warning
//mongoose.set('strictQuery', true);

  // Print the current Mongo URI for debugginggit status
  console.log("Using MONGO_URI:", process.env.MONGO_URI);


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);  // Remove deprecated options
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

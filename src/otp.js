// // MyBooking.js
// import React, { useState } from 'react';
// import './css/MyBooking.css';
// import Header from './Header';
// import { auth } from './firebase'; // Import the auth instance, not firebaseApp
// import 'firebase/auth';
// const MyBooking = () => {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [otp, setOtp] = useState('');
//   const [showOtpField, setShowOtpField] = useState(false);
//   const [confirmationResult, setConfirmationResult] = useState(null);

//   const handlePhoneNumberChange = (event) => {
//     setPhoneNumber(event.target.value);
//   };

//   const handleOtpChange = (event) => {
//     setOtp(event.target.value);
//   };

//   const handlePhoneNumberSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const confirmation = await auth.signInWithPhoneNumber(phoneNumber);
//       setConfirmationResult(confirmation);
//       setShowOtpField(true);
//       console.log(auth);
//       console.log('OTP Sent to', phoneNumber);
//     } catch (error) {
//       console.error('Error sending OTP:', error.message);
//       console.log(auth);

//     }
//   };

//   const handleOtpSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       await confirmationResult.confirm(otp);
//       console.log('OTP Verified:', otp);
//       // Add logic for further actions after OTP verification
//     } catch (error) {
//       console.error('Error verifying OTP:', error.message);
//     }
//   };

//   return (
//     <div>
//       <Header />
//       <div className="booking-form-container">
//       <form onSubmit={showOtpField ? handleOtpSubmit : handlePhoneNumberSubmit}>
//           <label className="form-label">Enter Mobile Number:</label>
//           <input
//             type="text"
//             value={phoneNumber}
//             onChange={handlePhoneNumberChange}
//             className="form-input"
//             required
//           />

//           {showOtpField && (
//             <>
//               <label className="form-label">Enter OTP:</label>
//               <input
//                 type="text"
//                 value={otp}
//                 onChange={handleOtpChange}
//                 className="form-input"
//                 required
//               />
//             </>
//           )}

//           <button type="submit" className="form-button">
//             {showOtpField ? 'Verify OTP' : 'Get OTP'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default MyBooking;

// //

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAmd6vej9crERgTWQQXtcjnjDVCAWedClQ",
//   authDomain: "karthick-d079a.firebaseapp.com",
//   projectId: "karthick-d079a",
//   storageBucket: "karthick-d079a.appspot.com",
//   messagingSenderId: "113043779236",
//   appId: "1:113043779236:web:f8f159849f694605ba4031",
//   measurementId: "G-3ECYYCZMQC"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app); // Ensure you have initialized auth correctly


// export { auth }; // Export the auth variable


// const express = require("express");
// const cors = require("cors");
// const pool = require("./db.js"); // Import the common database connection
// const app = express();
// // const { DateTime } = require("luxon");
// // const axios = require("axios");
// const bodyParser = require("body-parser");
// const session = require("express-session"); // Add this line for session management
// const multer = require("multer");
// const fs = require("fs");
// const admin = require("firebase-admin");
// const path = require("path");

// app.use("/uploads", express.static("uploads"));

// app.use((req, res, next) => {
//   // Replace 'http://localhost:3000' with the actual origin of your frontend
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
//   res.header("Access-Control-Allow-Headers", "Content-Type");
//   next();
// });

// const port = 3001; // Change the port to 3002
// app.use(bodyParser.json());

// app.use(cors());

// // api

// // Initialize Firebase Admin SDK
// const serviceAccount = require("./verification-61a40-firebase-adminsdk-a5haq-3f597269a1.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// // Import necessary modules
// const { auth } = require('../fabro/src/firebase.js'); // Correct import statement

// // Endpoint to generate and send OTP
// app.post("/send-otp", async (req, res) => {
//   try {
//     const { phoneNumber } = req.body;

//     // Send OTP to the provided phone number using Firebase Authentication APIs
//     const confirmation = await auth().signInWithPhoneNumber(phoneNumber);

//     // Return success response
//     res.status(200).json({ message: "OTP sent successfully", confirmation });
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Endpoint to verify OTP
// app.post("/verify-otp", async (req, res) => {
//   try {
//     const { phoneNumber, otp, confirmationResult } = req.body;

//     // Verify OTP using Firebase Authentication APIs
//     const userCredential = await confirmationResult.confirm(otp);

//     // Return success response
//     res.status(200).json({ message: "OTP verified successfully", userCredential });
//   } catch (error) {
//     console.error("Error verifying OTP:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });


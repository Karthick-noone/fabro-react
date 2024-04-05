import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Header from "./Header";
import RoomDetails from "./RoomDetailsPage"; // Import RoomDetails component
import Footer from './Footer';
// import { useNavigate } from "react-router-dom";
import { BASE_URL } from "./baseUrl";

const OtpSender = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  const [otpMessage, setOtpMessage] = useState('');
  const [roomDetails, setRoomDetails] = useState(null); // State to store room details
  // const navigate = useNavigate();

  const handleNumberInput = (e) => {
    const inputValue = e.target.value;

    // Remove non-numeric characters from the input
    const numericValue = inputValue.replace(/[^0-9]/g, '');

    if (numericValue === '') {
      // Handle the case where the input is empty (user deleted all digits)
      setPhoneNumber('');
    } else if (/^[6-9]\d{0,9}$/.test(numericValue)) {
      // Update the state with the cleaned numeric value
      setPhoneNumber(numericValue);
    } else {
      // Handle the case where the input does not start with 6-9
      // You can show an error message or take other actions
      // setError('Invalid input. Please enter a valid mobile number starting with 6-9.');
      setTimeout(() => {
        setError('');
      }, 5000); // Clear error message after 5 seconds
    }
  };

  const sendOtp = async () => {
    if (phoneNumber.trim() === '') {
      setError('Please enter your mobile number.');
      setTimeout(() => {
        setError('');
      }, 4000);
      return;
    }
  
    try {
      const response = await axios.post(`${BASE_URL}/sendotp`, { number: phoneNumber });
      console.log(response.data);
      setOtpSent(true);
      setOtpMessage('OTP sent successfully. Please check your phone.');
      setTimeout(() => {
        setOtpMessage('');
      }, 5000); // Clear otpMessage after 5 seconds
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError('This number does not exist in booking'); // Set custom error message
      } else {
        setError('Failed to send OTP. Please try again later.');
        console.error(error);
      }
      setTimeout(() => {
        setError('');
      }, 5000); // Clear error message after 5 seconds
    }
  };
  
  const resendOtp = async () => {
    try {
      await sendOtp();
      setOtpMessage('OTP resent successfully. Please check your phone.');
      setTimeout(() => {
        setOtpMessage('');
      }, 5000);
    } catch (error) {
      setError('Failed to resend OTP. Please try again later.');
      console.error(error);
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };
  
  const verifyOtp = async () => {
    if (otp.trim() === '') {
      setVerificationStatus('Please enter the OTP.');
      setTimeout(() => {
        setVerificationStatus('');
      }, 4000); // Clear error message after 4 seconds
      return;
    }
  
    try {
      const response = await axios.post(`${BASE_URL}/verifyotp`, { number: phoneNumber, otp });
      console.log(response.data);
      
      let buttonClicked = false; // Flag to track if confirmation button is clicked
  
      // Display SweetAlert for successful OTP verification
      Swal.fire({
        icon: 'success',
        title: 'OTP Verified!',
        text: 'You have successfully verified the OTP.',
        showConfirmButton: true, // Show the "OK" button
        timer: 4000,
        willClose: () => {
          if (!buttonClicked) { // If button is not clicked, fetch and set room details after the timer expires
            setRoomDetails(response.data);
            // Log room details
            console.log('Room details:', response.data);
          }
        }
      }).then((result) => {
        if (result.isConfirmed) {
          buttonClicked = true; // Set flag to true if confirmation button is clicked
          // Fetch and set room details immediately after button is clicked
          setRoomDetails(response.data);
          // Log room details
          console.log('Room details:', response.data);
        }
      });
    } catch (error) {
      // If OTP verification fails, set the verification status and log the error
      setVerificationStatus('OTP is incorrect');
      setTimeout(() => {
        setVerificationStatus('');
      }, 4000); // Clear error message after 4 seconds
      console.error(error);
    }
  };
  return (
    <div sty>
      <Header />
      <section
       style={styles.section}
      >
      {roomDetails ? (
        // Render room details if available
        <RoomDetails roomDetails={roomDetails} />
      ) : (
        // Render OTP form if room details not available
        <div style={styles.container} className='mb-5' >
          <h3 style={styles.heading}>Verify Your Number</h3>
          <input
            type="text"
            name="number"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={handleNumberInput}
            style={styles.input}
            required
            autoFocus
          />
          {!otpSent ? (
            <div>
              {error && <p style={styles.error}>{error}</p>}
              <button onClick={sendOtp} style={styles.button}>
                Verify 
              </button>
            </div>
          ) : (
            <div>
              <p>{otpMessage}</p>
              <button onClick={resendOtp} style={styles.button}>
                Resend OTP
              </button>
            </div>
          )}
          {otpSent && (
            <div>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={styles.input}
              />
              <button onClick={verifyOtp} style={styles.button}>
                Verify OTP
              </button>
              {verificationStatus && <p style={styles.error}>{verificationStatus}</p>}
            </div>
          )}
        </div>
      )}</section>
      <div style={{marginTop:'90px'}}><Footer /></div>
    </div>
  );
};

const styles = {

  section : {
  //   width: '100%',
  // height: '75vh',
  // background: 'radial-gradient(circle, #FF5733, #FFC300 30%, rgba(88, 84, 84, 0.226) 0%), radial-gradient(circle at 40px 40px, #33FF57, #C300FF 30%, rgba(88, 84, 84, 0) 0%), radial-gradient(circle at 600px 200px, #3380FF, #C300FF 10%, rgba(88, 84, 84, 0) 0%), radial-gradient(circle at 800px 100px, #FF3380, #C300FF 10%, rgba(88, 84, 84, 0) 0%), radial-gradient(circle at 700px 500px, #C300FF, #80FF33 2%, rgba(88, 84, 84, 0.123) 0%), radial-gradient(circle at 200px 400px, #FF33C3, #C300FF 1%, rgba(88, 84, 84, 0) 0%), radial-gradient(circle at 300px 700px, #C300FF, #FF33C3 15%, rgba(88, 84, 84, 0) 0%), radial-gradient(circle at 900px 500px, #33FFC3, #FF33C3 20%, rgba(88, 84, 84, 0) 0%), radial-gradient(circle at 650px 400px, #33C3FF, #FF33C3 10%, rgba(88, 84, 84, 0) 0%), radial-gradient(circle at 600px 600px, #C333FF, #33C3FF 1%, rgba(88, 84, 84, 0.959) 0%)'
  },

  container: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
   
  },
  heading: {
    marginBottom: '20px',
    color: '#333',
  },
  input: {
    width: '85%',
    padding: '10px',
    marginBottom: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
};

export default OtpSender;
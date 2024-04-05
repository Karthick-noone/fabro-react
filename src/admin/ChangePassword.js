import React, { useState,useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./css/ChangePassword.css";
import { Link } from "react-router-dom";
import { BASE_URL } from "./../baseUrl";

const PasswordChangeForm = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    // Redirect to login if not logged in
    if (!isLoggedIn) {
      navigate("/Admin/Login");
    }
  }, [isLoggedIn, navigate]);


  const handleFocus = (passwordType, visibilitySetter) => {
    visibilitySetter(true);
  };

  const handleBlur = (passwordType, visibilitySetter) => {
    visibilitySetter(false);
  };
  const handleSubmit = async () => {
    try {
      if (!oldPassword || !newPassword || !confirmPassword) {
        Swal.fire({
          icon: "error",
          title: "Incomplete Form",
          text: "Please fill out all fields.",
          timer: 3500,
        });
        return;
      }
      // Additional checks for password requirements
      if (
        oldPassword.includes(" ") ||
        newPassword.includes(" ") ||
        confirmPassword.includes(" ")
      ) {
        Swal.fire({
          icon: "error",
          title: "Invalid Password",
          text: "Password cannot contain spaces.",
          timer: 3500,
        });
        return;
      }

      if (newPassword.length < 6) {
        Swal.fire({
          icon: "error",
          title: "Invalid Password",
          text: "Password must be at least 6 characters long.",
          timer: 3500,
        });
        return;
      }

      if (newPassword !== confirmPassword) {
        Swal.fire({
          icon: "error",
          title: "Password Mismatch",
          text: "New password and confirm new password did not match.",
          timer: 3500,
        });
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/api/change-password`,
        {
          oldPassword,
          newPassword,
          confirmPassword,
        }
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Password Updated Successfully!",
          timer: 5000,
        }).then(() => {
          // Reset state values
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");

          // Reload the location after the SweetAlert modal is closed
          window.location.reload();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data.message,
          timer: 5000,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Link to="/Admin">
            <p
              className="btn btn-info"
              style={{ marginLeft: "150px", marginBottom: "10px",borderRadius:'50px',marginTop:'10px'}}
            >
              <i className="bi bi-arrow-left-circle "></i> 
            </p>
          </Link>
    <div className="password-change-form">
      
      <center><h4>Change Your password</h4></center><br />
      <div>
        <label htmlFor="oldPassword">Old Password:</label>
        <input
        className="input"
          type={isOldPasswordVisible ? "text" : "password"}
          id="oldPassword"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          onFocus={() => handleFocus("oldPassword", setIsOldPasswordVisible)}
          onBlur={() => handleBlur("oldPassword", setIsOldPasswordVisible)}
          required
        />
      </div>
      <div>
        <label htmlFor="newPassword">New Password:</label>
        <input
        className="input"
          type={isNewPasswordVisible ? "text" : "password"}
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          onFocus={() => handleFocus("newPassword", setIsNewPasswordVisible)}
          onBlur={() => handleBlur("newPassword", setIsNewPasswordVisible)}
          required
        />
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirm New Password:</label>
        <input
        className="input"
          type={isConfirmPasswordVisible ? "text" : "password"}
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onFocus={() =>
            handleFocus("confirmPassword", setIsConfirmPasswordVisible)
          }
          onBlur={() =>
            handleBlur("confirmPassword", setIsConfirmPasswordVisible)
          }
          required
        />
      </div>
      <center>
        <button className="change" onClick={handleSubmit}>Change</button>
      </center>
    </div></div>
  );
};

export default PasswordChangeForm;

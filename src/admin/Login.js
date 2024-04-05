import React, { useState } from "react";
import "./css/Login.css";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import img from "./../img/back.png";
import logo from "./img/logo..png";
import { BASE_URL } from "./../baseUrl";

const Login = () => {
  const navigate = useNavigate();

  const [isHovered, setIsHovered] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = () => {
    setIsPasswordVisible(true);
  };

  const handleBlur = () => {
    setIsPasswordVisible(false);
  };
  const styles = {
    form: {
      background: "rgba(0, 0, 0, 0.4)",
      // boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
      // backdropfilter:'blur(18px)',
      borderRadius: "10px",
      textAlign: "center",
      padding: "20px",
      width: "350px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.9)",
      marginTop: "20px", // Adjust as needed
      position: "relative",
      fontWeight: "bold",
      // marginLeft:'-47%'
      // fontFamily:'calibri'
    },
    
    hoverMessage: {
      position: "absolute",
      bottom: "40%",
      left: "50%",
      marginLeft: "-95px", // Adjust as needed
      padding: "8px",
      color: "#FFF",
      borderRadius: "4px",
      display: isHovered ? "block" : "none",
      textAlign: "center", // Center the text
      fontSize: "14px", // Adjust the font size
      width: "130px", // Adjust the width
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)", // Add a subtle shadow
    },
    h1: {
      marginBottom: "20px",
      fontSize: "1.3em",
      color: "#FAEED1",
      marginLeft: "15px",
      fontWeight: "bold",
      marginTop:'20px'
    },
    input: {
      width: "calc(100% - 20px)",
      padding: "10px",
      marginBottom: "20px",
      border: "1px solid #FAEED1",
      borderRadius: "4px",
      background: "transparent",
      color: "white",
      fontSize: "17px",
      height: "40px",
    },
    submitButton: {
      width: "94%",
      backgroundColor: "#213555",
      color: "#FAEED1",
      padding: "10px",
      marginBottom: "20px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "22px",
      marginTop: "5px",
      fontWeight: "bold",
    },
    message: {
      color: "red",
      fontWeight: "bold",
      fontSize: "18px",
    },
    para: {
      color: "#FEFAE0",
      textDecoration: "none",
      marginLeft: "80%",
      marginTop: "5px",
      fontSize: "18px",
      fontWeight: "bold",
    },
    imageLink: {
      marginTop:'-20px'
    },
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    // Check for spaces in username or password
    if (username.includes(" ") || password.includes(" ")) {
      setErrorMessage("Username or password cannot contain spaces");
      setTimeout(() => {
        setErrorMessage(null);
      }, 4000);
      return;
    }
  
    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
  
      if (response.ok) {
        // Set the isLoggedIn state to true in local storage
        localStorage.setItem('isLoggedIn', 'true');
      
        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          showConfirmButton: true,
          timer: 2500,
        }).then(() => {
          // Navigate to the Admin page
          navigate('/Admin');
        });
      
        console.log("Login successful");
      } else if (response.status === 401) {
        // Unauthorized - handle accordingly
        setErrorMessage("Invalid username or password");
        setTimeout(() => {
          setErrorMessage(null);
        }, 4000);
      } else {
        // Other error statuses
        const data = await response.json();
        setErrorMessage(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("Internal Server Error");
    }
  };
  
  return (
    <div class="background-container">
      <div className="body">
        
        <form style={styles.form} onSubmit={handleLogin}>
        <div className="row">
        <div className="col-lg-6">
         <img
          src={logo}
          alt=""
          style={{ width: "100%", height: "100%",float:'left',marginTop:'-10px'}}
        /></div>
        <br/>
        <br/>
          <div className="col-lg-6 float-end" style={{marginTop:'-15px'}}>
            <Link to="/">
              <p
                className="para"
                data-dismiss="modal"
                onMouseOver={() => setIsHovered(true)}
                onMouseOut={() => setIsHovered(false)}
              >
               
                <span style={styles.imageLink}>
                  <img src={img} width={"30px"} height={"30px"} alt="" />
                  <span style={styles.hoverMessage}>Go back to Home</span>
                </span>
              </p>
            </Link>
          </div>
          </div>
          
          <h1 style={styles.h1}>Admin Login</h1>
          <label className="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            autoFocus
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          <label className="username">Password</label>
        <input
          type={isPasswordVisible ? 'text' : 'password'}
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required
          style={styles.input}

        />

          <input
            type="submit"
            value="Login"
            name="submit"
            style={styles.submitButton}
          />

          {errorMessage && <p style={styles.message}>{errorMessage}</p>}
        </form>
        
      </div>
    </div>
  );
};

export default Login;

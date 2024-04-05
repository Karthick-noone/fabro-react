import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import preview from "./img/preview.png";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "./../baseUrl";

const PremiumImg = () => {
  const [selectedRoomType, setSelectedRoomType] = useState("premiumroom");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
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

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleRoomTypeChange = (e) => {
    setSelectedRoomType(e.target.value);
  };

  const handleImageUpload = async () => {
    try {
      if (!selectedImage) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please choose a picture to upload.",
          timer: 2500,
        });
        return;
      }
  
      const formData = new FormData();
      formData.append("image", selectedImage);
  
      await axios.post(
        `${BASE_URL}/upload?roomType=${selectedRoomType}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Image uploaded successfully.",
        timer: 2500,
      }).then(() => {
        // Dynamically navigate based on the selected room type
        navigate(`/Admin/${capitalizeFirstLetter(selectedRoomType)}Gallery`);
      });
  
      console.log("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  return (
    <div>
      <Navbar onToggleSidebar={handleToggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onCloseSidebar={handleCloseSidebar} />
      <Link to="/Admin">
            <p
              className="btn btn-info"
              style={{
                marginLeft: "150px",
                marginBottom: "10px",
                borderRadius: "50px",
                marginTop: "10px",
              }}
            >
              <i className="bi bi-arrow-left-circle "></i>
            </p>
          </Link>
      <div style={containerStyle}>
        <h3 style={headerStyle}>Add Image </h3>

       
        <div style={contentContainerStyle}>
          <div style={inputContainerStyle}>
            <label style={labelStyle}>Select Room Type:</label>
            <select
              onChange={handleRoomTypeChange}
              value={selectedRoomType}
              style={selectStyle}
            >

              {/* <option value="homepage">Home Page</option> */}
              <option value="premiumroom">Premium Room</option>
              <option value="deluxeroom">Deluxe Room</option>
              <option value="doubleroom">Double Room</option>
              <option value="luxuryroom">Luxury Room</option>
              <option value="singleroom">Single Room</option>
              <option value="smallroom">Small Room</option>
            </select>

            {/* Display default image or selected image */}
            <div style={imageContainerStyle}>
              <img
                src={
                  selectedImage ? URL.createObjectURL(selectedImage) : preview
                }
                alt="Selected"
                style={selectedImageStyle}
              />
            </div>
          </div>
          <label style={labelStyle}>Select Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={fileInputStyle}
            required
          />
        </div>

        <center>
          <button onClick={handleImageUpload} style={uploadButtonStyle}>
            Upload Image
          </button>
        </center>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  maxWidth: "500px",
  marginLeft: "30%",
  marginTop: "-35px",
  padding: "10px",
  background: "#f8f8f8",
  borderRadius: "8px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.7)",
};

const headerStyle = {
  color: "#333",
  textAlign: "center",
};

const contentContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  margin: "20px 0",
};

const inputContainerStyle = {
  width: "100%",
  marginBottom: "20px",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontSize: "16px",
  fontWeight: "bold",
};

const selectStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "16px",
  fontSize: "14px",
};

const fileInputStyle = {
  marginBottom: "",
  marginLeft: "150px",
  marginTop: "10px",
};

const imageContainerStyle = {
  textAlign: "center",
  width: "100%", // Adjust the width as needed
  marginTop: "20px", // Adjust the top margin as needed
};

// const imageLabelStyle = {
//   fontSize: "18px",
//   fontWeight: "bold",
// };

const selectedImageStyle = {
  width: "300px", // Set a fixed width for the image
  height: "250px", // Set a fixed height for the image
  border: "1px solid #ccc",
  borderRadius: "8px",
  marginTop: "8px",
  marginRight: "100px",
};

const uploadButtonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "10px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  marginTop: "-20px",
};

export default PremiumImg;

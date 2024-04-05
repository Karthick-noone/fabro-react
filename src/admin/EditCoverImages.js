import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios"; // Import axios for HTTP requests
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Swal from "sweetalert2";
import { BASE_URL } from "./../baseUrl";

const EditImage = () => {
  const { imageName } = useParams();
  console.log("imageName:", imageName);

  const [selectedImage, setSelectedImage] = useState(null);
  const [isNewImage, setIsNewImage] = useState(false);
  const [displayedImage, setDisplayedImage] = useState(
    `${BASE_URL}${imageName}`
  );
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
  
    if (file) {
      setSelectedImage(file);
      setIsNewImage(true);
      setDisplayedImage(URL.createObjectURL(file)); // Update displayedImage with the new image URL
    }
  };



  const handleUpdateImage = async () => {
    try {
      if (!selectedImage) {
        // Handle the case where no new image is selected
        return;
      }
  
      // Extract filename from imageName
      const filename = imageName.split("/").pop();
  
      // Construct the URL for the updated image
      const updateImageUrl = `${BASE_URL}/updateCoverImage/${filename}`;
  
  
      // Send the selected image file along with the PUT request
      const formData = new FormData();
      formData.append("image", selectedImage);
  
      // Send a PUT request to update the cover image URL in the database
      const response = await axios.put(updateImageUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      // Check if the update was successful
      if (response.status === 200 && response.data.success) {
        // Log a message indicating that the cover image has been successfully updated in the database
        console.log("Client - Cover image updated successfully in the database.");
  
        setIsNewImage(false);
  
        // If a new image is selected, update the displayed image
        setDisplayedImage(URL.createObjectURL(selectedImage));
  
        // Navigate back to ImageGallery
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Cover Image Updated successfully.",
          timer: 2500,
        }).then(() => {
          // Dynamically navigate based on the selected room type
          navigate(-1);
        });
      } else {
        // Handle the case where the update failed
        console.error("Client - Error updating cover image:", response.data.error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update cover image.",
        });
      }
    } catch (error) {
      console.error("Client - Error updating cover image:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while updating cover image.",
      });
    }
  };
  

  return (
    <div>
      <Navbar onToggleSidebar={handleToggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onCloseSidebar={handleCloseSidebar} />
      <div style={containerStyle}>
        <div style={imageContainerStyle}>
          <h2>Edit Cover Image</h2>
          <img
            src={
              isNewImage ? URL.createObjectURL(selectedImage) : displayedImage
            }
            alt=""
            style={imageStyle}
          />
        </div>

        <div style={editContainerStyle}>
          <label htmlFor="fileInput">Upload new cover image:</label>
          <input
          name="image"
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleImageChange}
            style={fileInputStyle}
          />
          <button onClick={handleUpdateImage} style={buttonStyle}>
            Update Cover Image
          </button>
          {/* Link to navigate back to ImageGallery */}
          <Link to="/Admin/ImageGallery" style={linkStyle}></Link>
        </div>
      </div>
    </div>
  );
};

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  maxWidth: "500px",
  marginLeft: "30%",
  marginTop: "15px",
  background: "#f8f8f8",
  borderRadius: "8px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.7)",
};

const imageContainerStyle = {
  marginBottom: "20px",
  textAlign: "center",
};

const imageStyle = {
    width: "300px", // Set a fixed width for the image
    height: "250px", // Set a fixed height for the image
    marginTop: "10px",
    marginBottom: "10px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "2px solid #007bff",
  };

const editContainerStyle = {
  textAlign: "center",
};

const fileInputStyle = {
  marginBottom: "10px",
  display: "grid",
  marginLeft: "150px",
};

const buttonStyle = {
  padding: "10px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginRight: "10px",
};

const linkStyle = {
  textDecoration: "none",
  color: "#007bff",
};

export default EditImage;
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useNavigate, useLocation  } from "react-router-dom";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL } from "./../baseUrl";

const DeleteMultipleImages = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roomType = queryParams.get("roomType");


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

 useEffect(() => {
    const fetchImageUrls = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/roomimages?roomType=${roomType}`
        );
        setImageUrls(response.data);
      } catch (error) {
        console.error("Error fetching image URLs:", roomType);
      }
    };

    fetchImageUrls();
  }, [roomType]);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleCheckboxChange = (imageUrl) => {
    if (selectedImages.includes(imageUrl)) {
      setSelectedImages(selectedImages.filter((url) => url !== imageUrl));
    } else {
      setSelectedImages([...selectedImages, imageUrl]);
    }
  };

  const handleDeleteImages = async () => {
    try {
      // Check if any images are selected
      if (selectedImages.length === 0) {
        // Display SweetAlert to inform the user to select images
        Swal.fire({
          icon: "warning",
          title: "Select Images",
          text: "Please select images to delete.",
          timer: 3000,
        });
        return;
      }
    
      // Send a DELETE request for each selected image
      await Promise.all(selectedImages.map(async imageUrl => {
        if (!imageUrl || !roomType) {
          console.error('Image URL and room type are required');
          return;
        }
        await axios.delete(`${BASE_URL}/api/deleteImage`, {
          params: { imageUrl, roomType }
        });
      }));
      
      // Clear the selected images after deletion
      setSelectedImages([]);
      // Redirect back to the gallery page after deletion
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Image Deleted successfully.",
        timer: 2500,
      }).then(() => {
        // Dynamically navigate based on the selected room type
        navigate(-1);
      });
    } catch (error) {
      console.error("Error deleting images:", error);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Navbar onToggleSidebar={handleToggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onCloseSidebar={handleCloseSidebar} />
      <div className="container">
        <div className="row">
          <Link to="/Admin">
            <p
              className="btn btn-info"
              style={{
                marginLeft: "50px",
                marginBottom: "10px",
                borderRadius: "50px",
                marginTop: "10px",
              }}
            >
              <i className="bi bi-arrow-left-circle "></i>
            </p>
          </Link>
          <div className="col-lg-">
            <h2 style={{ marginTop: "10px", marginLeft: "300px" }}>
              Delete {roomType} gallery images
            </h2>
          </div>
          <div
            className="col-lg-"
            style={{
              float: "right",
              padding: "10px",
              background: "#fff",
              borderRadius: "0 0 8px 0",
              cursor: "pointer",
              zIndex: 1,
            }}
          ></div>
        </div>
  
        {/* Checkbox to select all images */}
        <span>Select All</span><div style={{ marginBottom: "10px",marginTop:'-10px' }}>
          <input
            type="checkbox"
            checked={selectedImages.length === imageUrls.length}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedImages([...imageUrls]);
              } else {
                setSelectedImages([]);
              }
            }}
          />
          
        </div>
  
        {/* Render images with checkboxes */}
        {imageUrls.map((imageUrl, index) => (
          <div
            key={index}
            style={{
              margin: "10px",
              width: "200px",
              height: "250px",
              overflow: "hidden",
              display: "inline-block",
              position: "relative", // Make the container relative to position the checkbox
            }}
          >
            {/* Checkbox for individual image */}
            <input
              type="checkbox"
              checked={selectedImages.includes(imageUrl)}
              onChange={() => handleCheckboxChange(imageUrl)}
              style={{
                position: "absolute",
                top: "-10px",
                right: "5px",
              }}
            />
  
            {/* Image */}
            <img
              src={`${BASE_URL}${imageUrl}`}
              alt={`Premium Room ${index + 1}`}
              style={{
                width: "100%",
                height: "80%",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </div>
        ))}
      </div>
      <button className="btn btn-danger" onClick={handleDeleteImages}>
        Delete Selected Images
      </button>
    </div>
  );
};

export default DeleteMultipleImages;
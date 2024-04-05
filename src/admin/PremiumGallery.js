import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import Switch from "react-switch";
import Swal from "sweetalert2";
import { BASE_URL } from "./../baseUrl";

const ImageGallery = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isActive, setIsActive] = useState(true); // State for active/inactive toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

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
        // Replace 'premium' with the selected room type or get it from your component state
        const roomType = "premium";
        const response = await axios.get(
          `${BASE_URL}/api/roomimages?roomType=${roomType}`
        );
        setImageUrls(response.data);
      } catch (error) {
        console.error("Error fetching image URLs:", error);
      }
    };

    fetchImageUrls();
  }, []);

  const chunkArray = (arr, chunkSize) => {
    const chunkedArray = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunkedArray.push(arr.slice(i, i + chunkSize));
    }
    return chunkedArray;
  };

  const handleToggle = () => {
    // Show confirmation SweetAlert
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to set the status to ${isActive ? "inactive" : "active"}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        // If confirmed, update status in database and toggle isActive state
        updateStatus();
      }
    });
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        // Replace 'roomId' with the actual ID of the room you're fetching the status for
        const roomId = 1; // Replace with the actual room ID
        
        // Fetch status from the backend API with the roomId parameter
        const response = await axios.get(`${BASE_URL}/api/getStatus/${roomId}`);
  
        // Log the fetched status
        console.log("Status fetched:", response.data.status);
  
        // Set isActive state based on the fetched status
        setIsActive(response.data.status === "active");
      } catch (error) {
        console.error("Error fetching status:", error);
        // Show error message if fetching status fails
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch status",
        });
      }
    };
  
    fetchStatus();
  }, []);

  const updateStatus = async () => {
    try {
      // Room ID to be updated
      const roomId = 1; // Replace with the actual room ID
  
      // Send request to update status in the database
      await axios.put(`${BASE_URL}/api/updateStatus`, {
        isActive: !isActive ? "active" : "inactive", // Toggle status
        roomId: roomId // Include the room ID
      });
      
      // Update isActive state
      setIsActive(!isActive);
      
      // Show success message if status is updated successfully
      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `Status set to ${!isActive ? "active" : "inactive"}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      // Show error message if status update fails
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update status",
      });
    }
  };

  const rowsOfImages = chunkArray(imageUrls, 3);

  return (
    <div style={{ textAlign: "center" }}>
      <Navbar onToggleSidebar={handleToggleSidebar}/>
      <Sidebar isOpen={isSidebarOpen} onCloseSidebar={handleCloseSidebar}/>
      <div className="container">
        <div className="row align-items-center justify-content-between">
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
          <h2 style={{ marginTop: "10px", marginLeft: "300px" }}>
            Premium Room Images
          </h2>
          <div
            className="col-lg-"
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "10px",
            }}
          >
            {/* Switch button for active/inactive */}
            <Switch
              onChange={handleToggle}
              checked={isActive}
              onColor="#86d3ff"
              offColor="#FF6347"
              uncheckedIcon={false}
              checkedIcon={false}
              className="react-switch"
            />
            <label htmlFor="material-switch" style={{ marginLeft: "10px",marginRight:'10px' }}>
              {isActive ? "Active" : "Inactive"}
            </label>
            {/* Dropdown for add/delete images */}
            <Dropdown className="mt-3">
              <Dropdown.Toggle variant="info" id="dropdown-basic">
                Add/Delete Images
              </Dropdown.Toggle>
              <Dropdown.Menu className="custom-dropdown-menu ml-2">
                <Link to={"/Admin/AddImages"}>
                  <Dropdown.Item href="#action/1" className="text-left">
                    <i className="bi bi-plus-circle"></i> Add Images
                  </Dropdown.Item>
                </Link>
                <Link to={`/Admin/DeleteImage?roomType=premium`}>
                  <Dropdown.Item href="#action/2" className="text-left">
                    <i className="bi bi-trash"></i> Delete Images
                  </Dropdown.Item>{" "}
                </Link>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {/* Display images */}
        {rowsOfImages.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px", // Adjust the margin between rows
            }}
          >
            {/* Inside the map function where you display images */}
            {row.map((imageUrl, index) => (
              <div
                key={index}
                style={{
                  margin: "10px",
                  width: "200px",
                  height: "250px",
                  overflow: "hidden",
                }}
              >
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
                <div style={{ textAlign: "center", marginTop: "10px" }}>
                  {/* Pass the image URL as a parameter to the EditImage route */}
                  <Link to={`/Admin/EditImage/${encodeURIComponent(imageUrl)}`}>
                    <button className="btn btn-primary mt-2">Edit</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
export default ImageGallery;
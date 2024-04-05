import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { BASE_URL } from "./../baseUrl";

const ImageGallery = () => {
  const [imageUrls, setImageUrls] = useState([]);
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

  useEffect(() => {
    const fetchHomepageImages = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/homepageimages`);
        console.log("Homepage Images:", response.data); // Log the response data
        setImageUrls(response.data);
      } catch (error) {
        console.error("Error fetching homepage images:", error);
      }
    };
  
    fetchHomepageImages();
  }, []);
  

  const chunkArray = (arr, chunkSize) => {
    const chunkedArray = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunkedArray.push(arr.slice(i, i + chunkSize));
    }
    return chunkedArray;
  };

  const rowsOfImages = chunkArray(imageUrls, 3);

  return (
    <div style={{ textAlign: "center" }}>
      <Navbar onToggleSidebar={handleToggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onCloseSidebar={handleCloseSidebar} />
      <div className="container">
        <div className="row">
          {" "}
          <Link to="/Admin">
            <p
              className="btn btn-info"
              style={{ marginLeft: "50px", marginBottom: "10px",borderRadius:'50px',marginTop:'10px'}}
            >
              <i className="bi bi-arrow-left-circle "></i> 
            </p>
          </Link>
          <div className="col-lg-">
            <h2 style={{ marginTop: "10px", marginLeft: "300px" }}>
              Home Page Image
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
          >
            <Dropdown
              style={{ width: "180px", marginLeft: "150px", marginTop: "5px" }}
            >
              <Dropdown.Toggle variant="info" id="dropdown-basic">
                Add/Delete Images
              </Dropdown.Toggle>
              <Dropdown.Menu className="custom-dropdown-menu ml-2">
              <Link
                  to={{
                    pathname: "/Admin/AddImages",
                    state: { message: "Luxury" },
                  }}
                >
                  <Dropdown.Item href="#action/1" className="text-left">
                    <i className="bi bi-plus-circle"></i> Add Images
                  </Dropdown.Item>
                </Link>
                <Dropdown.Item href="#action/2" className="text-left">
                <i className="bi bi-trash"></i> Delete Images
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {rowsOfImages.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px", // Adjust the margin between rows
            }}
          >
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
                  alt={`home Room ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "80%",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <div  style={{ textAlign: "center", marginTop: "10px" }}>
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

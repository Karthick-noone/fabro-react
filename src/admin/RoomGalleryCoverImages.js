import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import Swal from 'sweetalert2';
import { BASE_URL } from "./../baseUrl";

const ImageGallery = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [deleteClicked, setDeleteClicked] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

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
    const fetchImageUrls = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/roomgallerycoverimages`
        );
        setImageUrls(response.data);
      } catch (error) {
        console.error("Error fetching image URLs:", error);
      }
    };

    fetchImageUrls();
  }, []);

  const handleCheckboxChange = (imageUrl) => {
    setSelectedImages((prevSelectedImages) => {
      if (prevSelectedImages.includes(imageUrl)) {
        return prevSelectedImages.filter(
          (selectedImageUrl) => selectedImageUrl !== imageUrl
        );
      } else {
        return [...prevSelectedImages, imageUrl];
      }
    });
  };

  const handleDeleteImages = async () => {
    try {
      // Check if any images are selected
      if (selectedImages.length === 0) {
        // Show SweetAlert warning if no images are selected
        Swal.fire(
          'No Images Selected',
          'Please select images to delete.',
          'warning'
        );
        return; // Exit the function early
      }
  
      // Display SweetAlert confirmation dialog
      const confirmation = await Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to delete the selected images',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete them!'
      });
  
      // Proceed with image deletion if user confirms
      if (confirmation.isConfirmed) {
        // Make a request to delete the selected images 
        await Promise.all(selectedImages.map(async (imageUrl) => {
          console.log("Deleting image:", imageUrl);
          const response = await axios.delete(`${BASE_URL}/api/deleteCoverImage`, {
            params: {
              imageUrl: imageUrl
            }
          });
          console.log("Image deletion response:", response.data);
        }));
  
        // Display success message
        Swal.fire(
          'Deleted!',
          'Selected images have been deleted.',
          'success'
        ).then(() => {
          // Reload the page after the SweetAlert is closed
          window.location.reload();
        });
  
        // Clear the selected images
        setSelectedImages([]);
      }
    } catch (error) {
      // Display error message if deletion fails
      Swal.fire(
        'Error!',
        'Failed to delete images. Please try again later.',
        'error'
      );
      console.error("Error deleting images:", error);
    } finally {
      // Reset deleteClicked state
      setDeleteClicked(false);
    }
  };

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
              Room Cover Images
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
                <Link to={"/Admin/AddCoverImages"}>
                  <Dropdown.Item href="#action/1" className="text-left">
                    <i className="bi bi-plus-circle"></i> Add Images
                  </Dropdown.Item>
                </Link>
                <Dropdown.Item
                  onClick={() => setDeleteClicked(true)}
                  className="text-left"
                >
                  <i className="bi bi-trash"></i> Delete Images
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            
          </div>
        </div>
        {deleteClicked && (
              <button className="btn btn-danger" onClick={handleDeleteImages}>
                Delete selected images
              </button>
            )}
        {rowsOfImages.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "-69px", // Adjust the margin between rows
            }}
          >
            {row.map(({ imageUrl, roomType }, index) => (
              <div
                key={index}
                style={{
                  position: "relative", // Make the container relative to position the room type label and button
                  margin: "10px",
                  width: "200px",
                  height: "350px",
                  overflow: "hidden",
                }}
              >
                {deleteClicked && (
                  <input
                    type="checkbox"
                    checked={selectedImages.includes(imageUrl)}
                    onChange={() => handleCheckboxChange(imageUrl)}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                    }}
                  />
                )}
                <b>{roomType}</b>
                <img
                  src={`${BASE_URL}${imageUrl}`}
                  alt={`Room ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "58%",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <div style={{ textAlign: "center", marginTop: "10px" }}>
                  {!deleteClicked && (
                    <Link
                      to={`/Admin/EditCoverImages/${encodeURIComponent(
                        imageUrl
                      )}`}
                    >
                      <button className="btn btn-primary mt-2">Edit</button>
                    </Link>
                  )}
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
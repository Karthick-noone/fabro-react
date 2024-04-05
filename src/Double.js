import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import "./admin/css/PremiumImg.css"; // Import the CSS file with your gallery styles
import { BASE_URL } from "./baseUrl";

const GalleryItem = ({ imageUrl, title }) => (
  <div className="gallery-item set-bg" style={{ backgroundImage: `url(${imageUrl})` }}>
    <div className="gi-text">
      <h3>{title}</h3>
    </div>
  </div>
);

const ImageGallery = () => {
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const fetchImageUrls = async () => {
      try {
        // Replace 'double' with the selected room type or get it from your component state
        const roomType = "double";
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

  return (
    <div style={{ textAlign: "center", overflowX: "hidden" }}> {/* Set overflowX to "hidden" */}
      <Header />
      <div className="row">
        <div className="col-lg-12">
          <div className="section-title">
            <h2>Double Room</h2>
          </div>
        </div>
      </div>
      <div className="container" style={{ marginTop: "-35px" }}>
        <div className="row">
          <div className="col-lg-6">
            <GalleryItem imageUrl={`${BASE_URL}${imageUrls[0]}`} title="Double Room 1" />
            <div className="row">
              <div className="col-sm-6">
                <GalleryItem imageUrl={`${BASE_URL}${imageUrls[1]}`} title="Double Room 2" />
              </div>
              <div className="col-sm-6">
                <GalleryItem imageUrl={`${BASE_URL}${imageUrls[2]}`} title="Double Room 3" />
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <GalleryItem imageUrl={`${BASE_URL}${imageUrls[3]}`} title="Double Room 4" />
            <div className="row">
              <div className="col-sm-12">
                <GalleryItem imageUrl={`${BASE_URL}${imageUrls[4]}`} title="Double Room 5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
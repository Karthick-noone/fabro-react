import React, { useState, useEffect } from "react";
import Header from "./Header";
import "./css/nice-select.css";
import { BASE_URL } from "./baseUrl";

import photo1 from "./img/room/room-1.jpg";
import photo2 from "./img/room/room-2.jpg";
import photo3 from "./img/room/room-3.jpg";
import photo4 from "./img/room/room-4.jpg";
import photo5 from "./img/room/room-5.jpg";
import photo6 from "./img/room/room-6.jpg";
import Footer from "./Footer";
import { updateCartCount } from "./Header"; // Import the updateCartCount function
import { Link } from "react-router-dom";

const RoomItem = ({ roomType, price, taxes, onDoneClick, errorMessage }) => {
  const [roomCount, setRoomCount] = useState(0);
  const [selectedRoomCount, setSelectedRoomCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomCount = async () => {
      try {
        // Fetch room count for the current room type from the server
        const roomId = getRoomIdForType(roomType);
        const response = await fetch(
          `${BASE_URL}/api/roomLimits?id=${roomId}`
        );
        const data = await response.json();
        const roomLimits = data.roomLimits || {};
        let roomCountForType = parseInt(roomLimits[roomId], 10) || 0;

        // Subtract the count of rooms already selected from local storage
        const storedRoomDetails = JSON.parse(
          localStorage.getItem("selectedRoomDetails")
        );
        if (storedRoomDetails && storedRoomDetails.roomTypes) {
          const roomTypes = storedRoomDetails.roomTypes.split(",");
          roomTypes.forEach((roomInfo) => {
            const [storedRoomType, storedRoomCount] = roomInfo.split(" - ");
            if (storedRoomType === roomType) {
              roomCountForType -= parseInt(storedRoomCount);
            }
          });
        }

        setRoomCount(roomCountForType);
      } catch (error) {
        console.error("Error fetching room count:", error);
      }
    };

    fetchRoomCount();
  }, [roomType]);

  const getRoomIdForType = (type) => {
    // Implement a function to map room types to IDs
    switch (type.toLowerCase()) {
      case "premium room":
        return 1;
      case "deluxe room":
        return 2;
      case "double room":
        return 3;
      case "luxury room":
        return 3;
      case "single room":
        return 3;
      case "small room":
        return 3;

      default:
        return 0; // Return a default ID if the type is not recognized
    }
  };

  const validateSelection = () => {
    if (selectedRoomCount === 0) {
      if (roomCount === 0) {
        // If roomCount is zero, update the error message
        setError(`Sorry, rooms are not available.`);
        setTimeout(() => {
          setError(null);
        }, 5000);
        return false;
      }
      // Display an error message for zero selected rooms
      setError("Please select at least one room.");
      setTimeout(() => {
        setError(null);
      }, 3000);
      return false;
    }

    if (selectedRoomCount > roomCount) {
      setError(`Only ${roomCount} rooms are available.`);
      setTimeout(() => {
        setError(null);
      }, 3000);
      return false;
    }

    // Reset error message
    setError(null);
    return true;
  };

  const handleDoneClick = () => {
    if (validateSelection()) {
      onDoneClick(roomType, price, taxes, selectedRoomCount);
      // Clear error message after successful click
      setError(null);
    }
  };

  const errorMessageContainerId = `errorMessageContainer_${roomType.replace(
    /\s+/g,
    "_"
  )}`;
  const roomPhotos = {
    "Premium Room": photo1,
    "Deluxe Room": photo2,
    "Double Room": photo3,
    "Luxury Room": photo4,
    "Single Room": photo5,
    "Small Room": photo6,
  };
  return (
    <div
      className="room-item"
      style={{ marginLeft: "10px", marginBottom: "-5px" }}
    >
      <Link to={`/${roomType.toLowerCase().replace(/\s+/g, "-")}`}>
        <div
          className="gallery-item set-bg"
          style={{ backgroundImage: `url(${roomPhotos[roomType]})` }}
        >
          <div className="gi-text">
            <h3>View Room</h3>
          </div>
        </div>
      </Link>
      <div className="ri-text">
        <Link to={`/${roomType.toLowerCase().replace(/\s+/g, "-")}`}>
          <h4>
            {roomType}
            <span style={{ marginLeft: "90px", color: "green" }}>
              {roomCount}{" "}
            </span>
            <br />
          </h4>
        </Link>
        <h3>
          RS.{price}
          <span>/Per night</span>
        </h3>
        <table>
          <tbody>
            <tr>
              <td className="r-o">Size:</td>
              <td>30 ft</td>
            </tr>
            <tr>
              <td className="r-o">Capacity:</td>
              <td>Max person 4</td>
            </tr>
            <tr>
              <td className="r-o">Bed:</td>
              <td>King Beds</td>
            </tr>
            <tr>
              <td className="r-o">Services:</td>
              <td>Wifi, Television, Bathroom,...</td>
            </tr>
          </tbody>
        </table>
        <div className="error-container">
          <p style={{ color: "red", marginTop: "-25px" }}>{errorMessage}</p>
        </div>
        <div id={errorMessageContainerId} className="error-container">
          {error && <p style={{ color: "red", marginTop: "-25px" }}>{error}</p>}
        </div>
        <select
          className="nice-select"
          onChange={(e) => setSelectedRoomCount(Number(e.target.value))}
          data-room-type={roomType}
          data-price={price}
          data-taxes={taxes}
        >
          <option value="0">No Of Rooms</option>
          <option value="1">1 Room</option>
          <option value="2">2 Rooms</option>
          <option value="3">3 Rooms</option>
          <option value="4">4 Rooms</option>
        </select>
        <button
          className="btn btn-secondary"
          onClick={handleDoneClick}
          style={{ marginLeft: "10px" }}
        >
          Add to cart
        </button>
      </div>
      <br />
    </div>
  );
};

const Rooms = () => {
  const onDoneClick = (roomType, price, taxes, roomCount) => {
    // Assuming you want to store an array of selected rooms
    const selectedRooms =
      JSON.parse(localStorage.getItem("selectedRooms")) || [];

    // Check if the selected room is already in the array
    const existingRoomIndex = selectedRooms.findIndex(
      (room) => room.roomType === roomType
    );

    if (existingRoomIndex !== -1) {
      // Update the count if the room is already selected
      selectedRooms[existingRoomIndex].roomCount = roomCount;
    } else {
      // Add the new room to the array
      selectedRooms.push({
        roomType,
        price,
        taxes,
        roomCount,
      });
    }

    // Save the updated array back to localStorage
    localStorage.setItem("selectedRooms", JSON.stringify(selectedRooms));
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    updateCartCount();
    // You can also display a success message or perform other actions here
  };

  return (
    <div>
      <Header />

      <div className="bg">
        {/* Breadcrumb Section Begin */}
        <div className="breadcrumb-section">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="breadcrumb-text">
                  <h2>Rooms Availability </h2>
                </div>
              </div>
              <div className="col-lg-3">
                <div
                  style={{ display: "none" }}
                  id="selectedRoomDisplay"
                  Style={{ marginLeft: "10px", display: "flex" }}
                ></div>
                <div
                  style={{ display: "none" }}
                  id="errorMessage"
                  Style={{ color: "red", marginLeft: "-65px", display: "flex" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        {/* Breadcrumb Section End */}

        {/* Rooms Section Begin */}
        <section className="rooms-section spad">
          <div className="container">
            <div className="row">
              {/* Render Room Items */}

              <RoomItem
                roomType="Premium Room"
                price={2599}
                taxes={120}
                onDoneClick={onDoneClick}
              />
              <RoomItem
                roomType="Deluxe Room"
                price={1999}
                taxes={100}
                onDoneClick={onDoneClick}
              />
              <RoomItem
                roomType="Double Room"
                price={1399}
                taxes={120}
                onDoneClick={onDoneClick}
              />
              <RoomItem
                roomType="Luxury Room"
                price={1599}
                taxes={120}
                onDoneClick={onDoneClick}
              />
              <RoomItem
                roomType="Single Room"
                price={799}
                taxes={120}
                onDoneClick={onDoneClick}
              />
              <RoomItem
                roomType="Small Room"
                price={599}
                taxes={120}
                onDoneClick={onDoneClick}
              />
              {/* End Render Room Items */}
            </div>
          </div>
        </section>
        {/* Rooms Section End */}
      </div>
      <Footer />
    </div>
  );
};

export default Rooms;

import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { updateCartCount } from "./Header"; // Import the updateCartCount function
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "./baseUrl";

const RoomItem = ({
  roomType,
  price,
  taxes,
  onDoneClick,
  errorMessage,
  roomPhoto,
  status // New prop to pass the status of the room type

}) => {
  const [roomCount, setRoomCount] = useState(0);
  const [selectedRoomCount, setSelectedRoomCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomCount = async () => {
      try {
        // Fetch room count for the current room type from the server
        const roomId = getRoomIdForType(roomType);
        const response = await axios.get(`${BASE_URL}/api/roomLimits?id=${roomId}`);
        const data = response.data.roomLimits || {};
        let roomCountForType = parseInt(data[roomId], 10) || 0;
  
        // Subtract the count of rooms already selected from local storage
        const storedRoomDetails = JSON.parse(localStorage.getItem("selectedRoomDetails"));
        console.log("Stored Room Details:", storedRoomDetails);
        if (storedRoomDetails && storedRoomDetails.roomTypes) {
          const roomTypes = storedRoomDetails.roomTypes.split(",");
          console.log("Room Types from Local Storage:", roomTypes);
  
          // Iterate through each room type retrieved from local storage
          roomTypes.forEach((roomInfo) => {
            const [storedRoomType, storedRoomCount] = roomInfo.trim().split(" - ");
            console.log("Stored Room Type:", storedRoomType);
            console.log("Stored Room Count:", storedRoomCount);
  
            // If the stored room type matches the current room type, subtract its count
            if (storedRoomType.trim() === roomType.trim()) {
              roomCountForType -= parseInt(storedRoomCount, 10);
              console.log("Subtracted Count for Room Type", roomType, ":", storedRoomCount);
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
        return 4;
      case "single room":
        return 5;
      case "small room":
        return 6;
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

    if (roomCount === 0) {
      setError("Sorry, rooms are not available.");
      setTimeout(() => {
        setError(null);
      }, 3000);
      return false;
    } else if (selectedRoomCount > roomCount) {
      setError(`Only ${roomCount} room${roomCount=== 1 ?' is':'s are'} available.`);
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

  return (
    <>
    {status === 'active' && (
      <div
        className="room-item "
        style={{ marginLeft: "10px", marginBottom: "-5px" }}
      >
        <Link to={`/${roomType.toLowerCase().replace(/\s+/g, "-")}`}>
          <div
            className="gallery-item set-bg"
            style={{ backgroundImage: `url(${BASE_URL}${roomPhoto})` }}
          >
            <div className="gi-text">
              <h3 className="text-dark">View Room</h3>
            </div>
          </div>
        </Link>
        <div className="ri-text">
          <Link to={`/${roomType.toLowerCase().replace(/\s+/g, "-")}`}>
            <h4>
              {roomType}
              <span
                style={{
                  marginLeft: "90px",
                  color: roomCount === 0 ? "red" : "green",
                }}
              >
                {roomCount}
              </span>
              <br />
              <span
                style={{
                  float: "right",
                  fontSize: "17px",
                  color: roomCount === 0 ? "red" : "green",
                }}
              >
                {roomCount === 0
                  ? ""
                  : roomCount === 1
                  ? "Room Available"
                  : "Rooms Available"}
              </span>
              <br />
            </h4>
          </Link>
          <h3>
            RS.{price}
            <span>/Per day</span>
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
          <div
            id={`errorMessageContainer_${roomType.replace(/\s+/g, "_")}`}
            className="error-container"
          >
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
    )}</>
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

  const [roomPhotos, setRoomPhotos] = useState({});
  const [roomStatus, setRoomStatus] = useState({});

  useEffect(() => {
    const fetchRoomStatus = async () => {
      try {
        // Fetch the status for all room types
        const response = await axios.get(`${BASE_URL}/api/getStatuss`);
        const data = response.data;
        
        // Log the received data
        console.log('Received room status:', data);
        
        setRoomStatus(data);
      } catch (error) {
        console.error("Error fetching room status:", error);
      }
    };

    fetchRoomStatus();
  }, []);
  useEffect(() => {
    const fetchRoomImages = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/roomgallerycoverimages`
        );
        const data = response.data;
        const photos = {};
        data.forEach((item) => {
          photos[item.roomType] = `${item.imageUrl}`;
        });
        setRoomPhotos(photos);
      } catch (error) {
        console.error("Error fetching room images:", error);
      }
    };

    fetchRoomImages();
  }, []);

  // Define room prices and taxes for each room type
  const roomPrices = {
    "Premium Room": { price: 2599, taxes: 120 },
    "Deluxe Room": { price: 1999, taxes: 100 },
    "Double Room": { price: 1399, taxes: 120 },
    "Luxury Room": { price: 1599, taxes: 120 },
    "Single Room": { price: 799, taxes: 120 },
    "Small Room": { price: 599, taxes: 120 },
  };

  // Define the order of room types
  const roomTypesOrder = [
    "Premium Room",
    "Deluxe Room",
    "Double Room",
    "Luxury Room",
    "Single Room",
    "Small Room",
  ];

  return (
    <div>
      <Header />

      <div style={{display:'none'}}>
      <h2>Room Status</h2>
      <ul>
        {Object.entries(roomStatus).map(([roomType, status]) => (
          <li key={roomType}>
            {roomType}: {status}
          </li>
        ))}
      </ul>
    </div>
      <div className="bg">
        {/* Breadcrumb Section Begin */}
        <div className="breadcrumb-section">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div
                  style={{ marginTop: "-50px" }}
                  className="breadcrumb-text "
                >
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
        <section className="rooms-section spad" style={{ marginTop: "-60px" }}>
          <div className="container">
            <div className="row">
              {/* Render Room Items */}
              {roomTypesOrder.map((roomType) => (
                <RoomItem
                  key={roomType}
                  roomType={roomType}
                  price={roomPrices[roomType].price}
                  taxes={roomPrices[roomType].taxes}
                  onDoneClick={onDoneClick}
                  errorMessage={null} // You can pass an error message if needed
                  roomPhoto={roomPhotos[roomType] || ""}
                  status={roomStatus[roomType]} // Pass the status for the room type
                />
              ))}
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

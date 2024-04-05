import React, { useState, useEffect, useMemo } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Form from "./Form";
import { Link, useNavigate } from "react-router-dom";

const BookingForm = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [roomLimits, setRoomLimits] = useState({});
  const [, setInitialRoomLimits] = useState({});
  const [, setErrorMessages] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [roomType, setRoomType] = useState(null);
  const [prevRoomType, setPrevRoomType] = useState(null); // Define prevRoomType state
  const [displayData, setDisplayData] = useState({
    selectedRoomDetails: [],
    totalPrice: 0,
  });
  const [totalDays, setTotalDays] = useState(1); // Initialize with default value
  const updateTotalDays = (days) => {
    setTotalDays(days);
  };
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Received Room Type:", roomType);
  }, [roomType]);

  const handleRoomTypeChange = (newRoomType) => {
    console.log("Room Type in BookingForm:", newRoomType);
    setRoomType(newRoomType);
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/Admin/Login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchRoomLimits = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/roomLimits");
        const data = await response.json();
        const roomLimitsAsIntegers = {};

        for (const key in data.roomLimits) {
          roomLimitsAsIntegers[key] = parseInt(data.roomLimits[key], 10);
        }

        setRoomLimits(roomLimitsAsIntegers);
        setInitialRoomLimits(roomLimitsAsIntegers); // Set initial room limits
      } catch (error) {
        console.error("Error fetching room limits:", error);
      }
    };

    fetchRoomLimits();
  }, []);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleInputChange = (e, cardId) => {
    const inputValue = parseInt(e.target.value, 10);
    const isValidInput = /^\d+$/.test(inputValue);
    const maxCount = roomLimits[cardId] || 0; // Use roomLimits instead of initialRoomLimits

    if (!isValidInput || inputValue > maxCount || inputValue < 1) {
      console.error(`Invalid input for card ${cardId}: ${inputValue}`);
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        [cardId]: "Invalid input. Please enter a valid count.",
      }));

      setTimeout(() => {
        setErrorMessages((prevErrors) => ({
          ...prevErrors,
          [cardId]: null,
        }));
      }, 3000);

      e.target.value = "";
      return;
    }

    setErrorMessages((prevErrors) => ({
      ...prevErrors,
      [cardId]: null,
    }));

    const card = cardData.find((c) => c.id === cardId);

    if (!card || isNaN(card.price)) {
      console.error(`Invalid card data for card ${cardId}`);
      return;
    }

    const totalPrice = inputValue * (card.price + 120) * totalDays;

    const roomNameMap = {
      1: "Premium Room",
      2: "Deluxe Room",
      3: "Double Room",
      4: "Luxury Room",
      5: "Single Room",
      6: "Small Room",
    };

    const roomName = roomNameMap[cardId];

    const existingRoomIndex = displayData.selectedRoomDetails.findIndex(
      (entry) => entry.roomType.includes(roomName)
    );

    if (existingRoomIndex !== -1) {
      displayData.selectedRoomDetails[existingRoomIndex] = {
        roomType: `${roomName} - ${inputValue}, Price - ${totalPrice}`,
      };
    } else {
      const selectedRoomDetails = {
        roomType: `${roomName} - ${inputValue}, Price - ${totalPrice}`,
      };
      displayData.selectedRoomDetails.push(selectedRoomDetails);
    }

    const updatedTotalPrice = displayData.selectedRoomDetails.reduce(
      (total, entry) => {
        const priceMatch = entry.roomType.match(/Price - (\d+)/);
        const price = priceMatch ? parseInt(priceMatch[1], 10) : 0;
        return total + price;
      },
      0
    );

    const updatedDisplayData = {
      selectedRoomDetails: [...displayData.selectedRoomDetails],
      totalPrice: updatedTotalPrice,
    };

    localStorage.setItem(
      "selectedRoomDetails",
      JSON.stringify(updatedDisplayData.selectedRoomDetails)
    );
    localStorage.setItem("totalPrice", updatedDisplayData.totalPrice);

    setDisplayData(updatedDisplayData);
  };

  const handleRemoveRoom = (index) => {
    const updatedRoomDetails = [...displayData.selectedRoomDetails];
    updatedRoomDetails.splice(index, 1);
    const updatedTotalPrice = updatedRoomDetails.reduce((total, entry) => {
      const priceMatch = entry.roomType.match(/Price - (\d+)/);
      const price = priceMatch ? parseInt(priceMatch[1], 10) : 0;
      return total + price;
    }, 0);

    localStorage.setItem(
      "selectedRoomDetails",
      JSON.stringify(updatedRoomDetails)
    );
    localStorage.setItem("totalPrice", updatedTotalPrice);

    const updatedDisplayData = {
      selectedRoomDetails: updatedRoomDetails,
      totalPrice: updatedTotalPrice,
    };
    setDisplayData(updatedDisplayData);
  };

  const cardData = useMemo(
    () => [
      {
        title: "Premium Room",
        id: 1,
        color: "#e0f7fa",
        price: 2599,
        icon: "fa-star",
        iconColor: "gold",
      },
      {
        title: "Deluxe Room",
        id: 2,
        color: "#e0f7fa",
        price: 1999,
        icon: "fa-crown",
        iconColor: "purple",
      },
      {
        title: "Double Room",
        id: 3,
        color: "#e0f7fa",
        price: 1399,
        icon: "fa-bed",
        iconColor: "brown",
      },
      {
        title: "Luxury Room",
        id: 4,
        color: "#e0f7fa",
        price: 1599,
        icon: "fa-gem",
        iconColor: "blue",
      },
      {
        title: "Single Room",
        id: 5,
        color: "#e0f7fa",
        price: 799,
        icon: "fa-user",
        iconColor: "black",
      },
      {
        title: "Small Room",
        id: 6,
        color: "#e0f7fa",
        price: 599,
        icon: "fa-coffee",
        iconColor: "brown",
      },
    ],
    []
  );

  useEffect(() => {
    if (prevRoomType !== roomType) {
      // Define roomNameMap to map roomId to room names
      const roomNameMap = {};
      cardData.forEach((card) => {
        roomNameMap[card.id] = card.title;
      });
  
      // Reset the count of previously selected room types if they exist
      if (prevRoomType && roomLimits) {
        const prevRoomTypes = prevRoomType.split(",").map(type => type.trim());
        prevRoomTypes.forEach((prevType) => {
          const [prevRoomName, prevCount] = prevType.split(" - ");
          const prevRoomId = Object.keys(roomLimits).find(
            (key) => roomNameMap[key] === prevRoomName
          );
          if (prevRoomId !== undefined) {
            setRoomLimits((prevLimits) => ({
              ...prevLimits,
              [prevRoomId]: prevLimits[prevRoomId] + parseInt(prevCount),
            }));
          }
        });
      }
  
      // Subtract count of selected room types from initial room limit count
      if (roomType && roomLimits) {
        const selectedRoomTypes = roomType.split(",").map(type => type.trim());
        selectedRoomTypes.forEach(selectedRoomType => {
          const [, count] = selectedRoomType.split(" - ");
          const roomName = selectedRoomType.split(" - ")[0];
          const roomId = Object.keys(roomLimits).find(
            (key) => roomNameMap[key] === roomName
          );
          if (roomId !== undefined) {
            setRoomLimits((prevLimits) => ({
              ...prevLimits,
              [roomId]: prevLimits[roomId] - parseInt(count),
            }));
          }
        });
      }
  
      // Update the previous room type
      setPrevRoomType(roomType);
    }
  }, [roomType, roomLimits, cardData, prevRoomType]);

  return (
    <div>
      <Navbar onToggleSidebar={handleToggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onCloseSidebar={handleCloseSidebar} />

      <Link to="/Admin">
        <p
          className="btn btn-info"
          title="Back to Home"
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
      <center>
        <h2 style={{ marginTop: "-50px" }}>Room Booking</h2>
      </center>
      {/* {roomType && <p>Selected Room Type: {roomType}</p>} */}
      <p>Totaldays{totalDays}</p>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "20px",
        }}
      >
        {cardData.map((card) => (
          <div
            key={card.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              width: "300px",
              padding: "10px",
              textAlign: "center",
              backgroundColor: card.color,
            }}
          >
            <div>
              <h3 style={{ color: "#101111", fontSize: "20px" }}>
                {card.title}
              </h3>
              <p style={{ color: "#101111" }}>{`Available: ${
                roomLimits[card.id] || 0
              }`}</p>
            </div>
            <p
              style={{ color: "#101111" }}
            >{`Price: Rs.${card.price}/pernight`}</p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <span style={{ color: "#101111", marginLeft: "15px" }}>Need</span>
              <input
                type="text"
                pattern="^[0-9]*$"
                onChange={(e) => handleInputChange(e, card.id)}
                placeholder="Enter value"
                inputMode="numeric"
                style={{
                  color: "#101111",
                  width: "120px",
                  height: "35px",
                  border: "1px solid #26a69a",
                  marginLeft: "30px",
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="row">
        <div className="col-lg-8">
          <Form
            displayData={displayData}
            onRoomTypeChange={handleRoomTypeChange}
            updateTotalDays={updateTotalDays}
          />
        </div>
        <div className="col-lg-2">
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                width: "300px",
                padding: "10px",
                textAlign: "center",
                boxShadow: "0 0 15px rgba(0, 0, 0, 0.3)",
                backgroundColor: "#e0f7fa",
                margin: "10px auto",
              }}
            >
              <h4>Selected Room Details</h4>
              {displayData.selectedRoomDetails.map((entry, index) => (
                <div key={index}>
                  <p style={{ color: "#101111" }}>
                    {entry.roomType}{" "}
                    <i
                      className="fa fa-times ml-3"
                      title="Cancel room"
                      aria-hidden="true"
                      onClick={() => handleRemoveRoom(index)}
                    ></i>
                  </p>
                </div>
              ))}
              <h4>Total Price</h4>
              <p
                style={{ color: "#101111" }}
              >{`Rs. ${displayData.totalPrice}`}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;

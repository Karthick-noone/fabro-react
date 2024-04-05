import React, { useEffect, useState, useRef } from "react";
import Calendar from "react-calendar"; // Import the Calendar component
import { useNavigate, useLocation } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import "./css/font.css";
import "./css/fontswap.css";
import "./css/glightbox.min.css";
import "./css/swiper-bundle.min.css";
import "./css/style3.css";
import "./css/font-awesome.min.css";
import "./css/elegant-icons.css";
import "./css/flaticon.css";
import "./css/nice-select.css";
import "./css/magnific-popup.css";
import "./css/slicknav.min.css";
import "./css/style1.css";
import "./css/custom.css";
import Rooms from "./Room";
import minus from "./img/minus2.png";
import plus from "./img/plus2.png";
import { BASE_URL } from "./baseUrl";

const BookingForm = ({ onRoomTypeChange }) => {
  const navigate = useNavigate(); // Get the navigate object
  const location = useLocation();
  const [, setRoomLimit] = useState(null);
  const [selectedDateIn, setSelectedDateIn] = useState(new Date());
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [guestsContainerDisplay, setGuestsContainerDisplay] = useState("none");
  const [showCheckInCalendar, setShowCheckInCalendar] = useState(false);
  const [showCheckOutCalendar, setShowCheckOutCalendar] = useState(false);
  const [totalRooms, setTotalRooms] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [roomTypes, setRoomTypes] = useState(null); // Define roomType state
  const [totalDays, setTotalDays] = useState(1); // Initially set to 1

  const [formData, setFormData] = useState({
    totaldays: 0,
  });
  const [checkOutDate] = useState(null); // Define checkOutDate state
  const [selectedDateOut, setSelectedDateOut] = useState(() => {
    // Calculate tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return tomorrow;
  });

  //  useEffect(() => {
  //   calculateTotalDays();
  // }, [selectedDateIn, selectedDateOut, calculateTotalDays]);



  const fetchAvailableRooms = async (checkInDate, checkOutDate) => {
    try {
      console.log("Sending dates to server:", checkInDate, checkOutDate);

      const response = await fetch(
        `${BASE_URL}/api/available-rooms`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            checkInDate: checkInDate.toISOString(),
            checkOutDate: checkOutDate.toISOString(),
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Room types:", data.roomType);

        // Store roomType into localStorage
        localStorage.setItem(
          "selectedRoomDetails",
          JSON.stringify({ roomTypes: data.roomType })
        );
        console.log("Room types stored in localStorage:", data.roomType);

        // Update roomType in Form component
        setRoomTypes(data.roomType);
        // Notify BookingForm component about the roomType change
        onRoomTypeChange(data.roomType);

        return data.roomType; // Return room types
      } else {
        throw new Error("Failed to fetch available rooms");
      }
    } catch (error) {
      console.error("Error fetching available rooms:", error);
      return null;
    }
  };


    // Function to fetch room status from the server
const fetchRoomStatus = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/getStatuss`);
    if (response.ok) {
      const roomStatus = await response.json();
      console.log("Fetched room status:", roomStatus);
      return roomStatus;
    } else {
      throw new Error("Failed to fetch room status");
    }
  } catch (error) {
    console.error("Error fetching room status:", error);
    return null;
  }
};

fetchRoomStatus()
  .then((roomStatus) => {
    if (roomStatus) {
      // Iterate over roomStatus object and log each room type with its status
      Object.entries(roomStatus).forEach(([roomType, status]) => {
        console.log(`Room Type: ${roomType}, Status: ${status}`);
      });
    } else {
      console.log("No room status data available");
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
  // Assuming you have 6 room types with 4 counts for each
  const totalRoomCounts = 6 * 4;

  // Fetch the roomTypes from local storage
  const storedRoomDetails =
    JSON.parse(localStorage.getItem("selectedRoomDetails")) || {};
  const roomTypesString = storedRoomDetails.roomTypes || "";

  // Initialize totalRooms count with the totalRoomCounts
  let totalRoom = totalRoomCounts;

  // Parse the roomTypesString and subtract counts for each room type
  if (roomTypesString) {
    const roomTypes = roomTypesString.split(",");
    roomTypes.forEach((roomInfo) => {
      const [, roomCount] = roomInfo.split(" - ");
      totalRoom -= parseInt(roomCount);
    });
  }

  console.log("Total rooms available:", totalRoom);

  useEffect(() => {
    // Check if the location is the Home page
    if (location.pathname === "/") {
      // Fetch selectedRoomDetails from localStorage
      const selectedRoomDetails =
        JSON.parse(localStorage.getItem("selectedRoomDetails")) || {};

      // Remove roomTypes from selectedRoomDetails
      delete selectedRoomDetails.roomTypes;

      // Update selectedRoomDetails in localStorage
      localStorage.setItem(
        "selectedRoomDetails",
        JSON.stringify(selectedRoomDetails)
      );

      console.log(
        "Room types removed from selectedRoomDetails in localStorage"
      );
    }
  }, [location]);

  const calculatedTotalDays = (checkInDate, checkOutDate) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const totalDays = Math.round(Math.abs((startDate - endDate) / oneDay));
    return totalDays;
  };
  //  code for fetchavailaberooms
  const handleCheckInDateChange = async (date) => {
    const totalDays = calculatedTotalDays(date, formData.checkOutDate);

    // Ensure totalDays is a valid number
    const validTotalDays = isNaN(totalDays) || totalDays <= 0 ? 1 : totalDays;

    // Update formData with the total days
    setFormData({
      ...formData,
      totalDays: validTotalDays,
    });

    // Call the updateTotalDays function to pass totalDays to the BookingForm component

    setSelectedDateIn(date);
    const response = await fetchAvailableRooms(date, checkOutDate);
    // Pass the room type to the BookingForm component if it's not null
    if (response && response.roomType) {
      setRoomTypes(response.roomType);
      console.log("Sent room types to Rooms component:", response.roomType); // Add this log statement
    }
    // Calculate the day after the selected check-in date
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    // Set the checkout date to the calculated next day
    setSelectedDateOut(nextDay);

    // Fetch available rooms for the selected check-in date and calculated checkout date
    fetchAvailableRooms(date, nextDay);
  };

  const handleCheckOutDateChange = async (date) => {
    // Set the selected checkout date
    setSelectedDateOut(date);

    // Fetch available rooms for the current check-in date and selected check-out date
    const response = await fetchAvailableRooms(selectedDateIn, date);

    // Pass the room type to the BookingForm component if it's not null
    if (response && response.roomType) {
      setRoomTypes(response.roomType);
      console.log("Sent room types to Rooms component:", response.roomType); // Add this log statement
    }

    // Calculate the total days between check-in and check-out dates
    const totalDays = calculatedTotalDays(selectedDateIn, date);

    // Ensure totalDays is a valid number
    const validTotalDays = isNaN(totalDays) || totalDays <= 0 ? 1 : totalDays;

    // Update formData with the total days
    setFormData({
      ...formData,
      totalDays: validTotalDays,
    });

    // Call the updateTotalDays function to pass totalDays to the BookingForm component
  };

  const guestsInputRef = useRef(null);
  useEffect(() => {
    const fetchRoomCount = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/roomCounts`);

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (data.error) {
          throw new Error(data.error);
        }

        // Convert the totalRooms to an integer
        const totalRoomsInt = parseInt(data.totalRooms, 10);
        setTotalRooms(totalRoomsInt);
        setRoomLimit(data.totalRooms);
      } catch (error) {
        console.error("Error fetching room count:", error.message);
        // Handle the error, such as displaying an error message to the user
      }
    };

    fetchRoomCount();
  }, []); // Empty dependency array to run the effect only once

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        formContainerRef.current &&
        !formContainerRef.current.contains(event.target)
      ) {
        closeCalendars();
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const updateCheckOutOptions = (checkInDate) => {
    const newCheckOutDate = new Date(checkInDate);
    newCheckOutDate.setDate(newCheckOutDate.getDate() + 1);

    // Ensure that the checkout date is at least one day after the check-in date
    if (newCheckOutDate <= checkInDate) {
      newCheckOutDate.setDate(checkInDate.getDate() + 1);
    }

    setSelectedDateOut(newCheckOutDate);
  };

  const updateGuestsInput = () => {
    const roomLabel = rooms === 1 ? "Room" : "Rooms";
    const guestsInput = document.getElementById("guest");
    guestsInput.value = `${rooms} ${roomLabel}, ${adults} Adult${
      adults === 1 ? "" : "s"
    }, ${children} Children`;
    updateDecrementButtonsState();
  };

  const updateDecrementButtonsState = () => {
    const decrementAdultsButton = document.getElementById("decrementAdults");
    const decrementRoomsButton = document.getElementById("decrementRooms");

    if (decrementAdultsButton && decrementRoomsButton) {
      decrementAdultsButton.disabled = adults === 1;
      decrementRoomsButton.disabled = rooms === 1;
    }
  };

  const increment = (inputId) => {
    // Use state setter functions
    switch (inputId) {
      case "rooms":
        if (rooms < totalRoom) {
          setRooms((prevRooms) => prevRooms + 1);
        } else {
          setErrorMessage(
            `${
              totalRoom === 1 
                ? `Only ${totalRoom} room is available for the selected dates.` 
                : totalRoom > 1
                  ? `Only ${totalRoom} rooms are available for the selected dates.` 
                  : 'Rooms are not available for the selected dates.'
            }`
          );
          setTimeout(() => {
            setErrorMessage("");
          }, 4500); // Set a timeout of 3000 milliseconds (3 seconds)
        }
        break;

      case "adults":
        setAdults((prevAdults) => prevAdults + 1);
        break;
      case "children":
        setChildren((prevChildren) => prevChildren + 1);
        break;
      default:
        break;
    }

    updateGuestsInput();
    updateDecrementButtonsState();

    // Update formDetails when values change
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,

      guests: {
        rooms,
        adults,
        children: children + 1,
      },
    }));
  };

  const decrement = (inputId) => {
    // Use state setter functions
    switch (inputId) {
      case "adults":
        setAdults((prevAdults) =>
          prevAdults > 1 ? prevAdults - 1 : prevAdults
        );
        break;
      case "rooms":
        setRooms((prevRooms) => (prevRooms > 1 ? prevRooms - 1 : prevRooms));
        break;
      case "children":
        setChildren((prevChildren) =>
          prevChildren > 0 ? prevChildren - 1 : prevChildren
        );
        break;
      default:
        break;
    }

    updateGuestsInput();
    updateDecrementButtonsState();

    // Update formDetails when values change
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      guests: {
        rooms,
        adults,
        children,
      },
    }));
  };
  const validateForm = (e) => {
    e.preventDefault(); // Prevent the default form submission
    const guestsInput = document.getElementById("guest");
    const guestsValue = guestsInput.value.trim();
    // Check if the guests input field is empty or has the default value
    if (guestsValue === "" || guestsValue === "0 Room, 0 Adults, 0 Children") {
      // Display the validation message in a specific element
      const validationMessageElement =
        document.getElementById("validationMessage");
      validationMessageElement.innerHTML =
        "Please select the number of guests.";
      return false;
    }

    // Extract the number of adults, children, and rooms from the guests input
    const match = guestsValue.match(
      /(\d+) Room(?:s)?, (\d+) Adults?, (\d+) Children?/
    );

    // Check if the match is successful and values are valid numbers
    if (!match || match.length !== 4 || match.slice(1).some(isNaN)) {
      const validationMessageElement =
        document.getElementById("validationMessage");
      validationMessageElement.innerHTML = "Invalid guest input.";
      return false;
    }

    const [, rooms, adults, children] = match;

    // Check if the number of adults is less than the number of rooms
    if (parseInt(adults, 10) < parseInt(rooms, 10)) {
      const validationMessageElement =
        document.getElementById("validationMessage");
      validationMessageElement.innerHTML = "Select at least 1 adult per room.";
      setTimeout(function () {
        validationMessageElement.innerHTML = "";
      }, 4000);
      return false;
    }

    // Check if the total number of adults and children combined exceeds 5 per room
    const totalGuests = parseInt(adults, 10) + parseInt(children, 10);
    if (totalGuests > rooms * 4) {
      const validationMessageElement =
        document.getElementById("validationMessage");
      validationMessageElement.innerHTML =
        "Maximum 4 persons (adults and children combined) are allowed per room.";
      setTimeout(function () {
        validationMessageElement.innerHTML = "";
      }, 4000);
      return false;
    }

    // Clear the validation message if the validation passes
    const validationMessageElement =
      document.getElementById("validationMessage");
    validationMessageElement.innerHTML = "";

    const isValid = storeSelectedRoomDetails();
    if (isValid) {
      navigate("/Rooms"); // Redirect to '/Room'
    }
    return isValid;
  };

  const [, setFormDetails] = useState({
    checkIn: "",
    checkOut: "",
    guests: {
      rooms: 1,
      adults: 2,
      children: 0,
    },
  });

  const storeSelectedRoomDetails = () => {
    const updatedFormDetails = {
      checkIn: selectedDateIn.toDateString(),
      checkOut: selectedDateOut.toDateString(),
      guests: {
        rooms: rooms,
        adults: adults,
        children: children,
      },
      roomTypes: roomTypes,
    };
    localStorage.setItem(
      "selectedRoomDetails",
      JSON.stringify(updatedFormDetails)
    );
    console.log(updatedFormDetails);
    return true;
  };
  useEffect(() => {
    // Set default value for guestsInput when rooms, adults, or children change
    guestsInputRef.current.value = `${rooms} Room${
      rooms !== 1 ? "s" : ""
    }, ${adults} Adult${adults !== 1 ? "s" : ""}, ${children} Children`;
  }, [rooms, adults, children]);

  const showGuestsContainer = () => {
    setGuestsContainerDisplay((prevDisplay) =>
      prevDisplay === "none" ? "block" : "none"
    );

    // Set default values only if the container is displayed
    if (guestsContainerDisplay === "none") {
      setAdults(2); // Default to 2 adults
      setRooms(1);
      setChildren(0);

      // Update the guests input field with default values
      updateGuestsInput();

      // Disable the decrement buttons for adults and rooms initially
      updateDecrementButtonsState();
    }

    setShowCheckInCalendar(false);
    setShowCheckOutCalendar(false);
  };

  const toggleContainer = (event) => {
    event.preventDefault();
    showGuestsContainer();

    // Reset the validation message when the container is toggled
    const validationMessageElement =
      document.getElementById("validationMessage");
    validationMessageElement.innerHTML = "";
  };
  const formContainerRef = useRef(null);

  // Function to close both calendars
  const closeCalendars = () => {
    setShowCheckInCalendar(false);
    setShowCheckOutCalendar(false);
  };

  // Function to toggle the check-in calendar
  const toggleCheckInCalendar = () => {
    setShowCheckInCalendar(!showCheckInCalendar);
    setShowCheckOutCalendar(false); // Close check-out calendar
  };

  // Function to toggle the check-out calendar
  const toggleCheckOutCalendar = () => {
    setShowCheckOutCalendar(!showCheckOutCalendar);
    setShowCheckInCalendar(false); // Close check-in calendar
  };

  useEffect(() => {
  const calculateTotalDays = () => {
    const oneDay = 24 * 60 * 60 * 1000;
    const startDate = selectedDateIn.getTime();
    const endDate = selectedDateOut.getTime();
    const differenceInDays = Math.ceil(Math.abs((endDate - startDate) / oneDay));
    setTotalDays(differenceInDays);
  };

  calculateTotalDays();
}, [selectedDateIn, selectedDateOut]);
 

  return (
    <div ref={formContainerRef}>
      <p style={{ display: "none" }}>
        <Rooms />
      </p>
      {/* Include the JSX for your form */}
      <section className="hero-section">
        {" "}
        <div className="container">
          <div className="row">
            {/* Hero Text Section */}
            <div className="col-lg-6">
              <div className="hero-text">
                <h1>Fabro A Luxury Hotel</h1>
                <p>
                  Here are the best hotel room booking, including
                  recommendations for international travel and for finding
                  low-priced hotel rooms.
                </p>
              </div>
            </div>

            {/* Booking Form Section */}
            <div
              className="col-xl-4 col-lg-5 offset-xl-2 offset-lg-1"
              ref={formContainerRef}
            >
              <div className="booking-form">
                <h3>Check Availability</h3>
                <form
                  id="bookingForm"
                  action=""
                  method="post"
                  onSubmit={(e) => validateForm(e)}
                >
                  {/* Check-in Date */}
                  {/* Check-in Date */}
                  <div className="check-date">
                    <label htmlFor="date-in">Check In</label>
                    {/* Show the calendar based on the state */}
                    {showCheckInCalendar && (
                      <Calendar
                        id="date-in"
                        onChange={(date) => {
                          setSelectedDateIn(date);
                          handleCheckInDateChange(date);
                          updateCheckOutOptions(date);
                          toggleCheckInCalendar(); // Close calendar on date selection
                        }}
                        value={selectedDateIn}
                        minDate={new Date()}
                        maxDate={
                          new Date(
                            selectedDateIn.getTime() + 60 * 24 * 60 * 60 * 1000
                          )
                        }
                        className="calendar-popup mt-1 ml-2"
                      />
                    )}
                    <input
                      type="text"
                      id="date-in"
                      autoFocus
                      readOnly
                      onClick={toggleCheckInCalendar}
                      value={selectedDateIn.toDateString()} // Display the selected date
                    />
                  </div>

                  {/* Check-out Date */}
                  <div className="check-date">
                    <label htmlFor="date-out">Check Out</label>
                    {/* Show the calendar based on the state */}
                    {showCheckOutCalendar && (
                      <Calendar
                        id="date-out"
                        onChange={(date) => {
                          setSelectedDateOut(date);
                          handleCheckOutDateChange(date);
                          toggleCheckOutCalendar(); // Close calendar on date selection
                        }}
                        value={selectedDateOut}
                        minDate={
                          new Date(
                            selectedDateIn.getTime() + 24 * 60 * 60 * 1000
                          )
                        }
                        maxDate={
                          new Date(
                            selectedDateIn.getTime() + 60 * 24 * 60 * 60 * 1000
                          )
                        }
                        className="calendar-popup mt-1 ml-2"
                      />
                    )}
                    <input
                      type="text"
                      id="date-out"
                      readOnly
                      onClick={toggleCheckOutCalendar}
                      value={selectedDateOut.toDateString()} // Display the selected date
                    />
                  </div>
                  <div className="check-date">
                    <label htmlFor="total-days">Total Days</label>
                    <input
                      type="text"
                      id="total-days"
                      name="total-days"
                      value={totalDays === 1 ? `${totalDays} day` : `${totalDays} days`}
                      readOnly
                    />
                  </div>

                  {/* ... (other form fields) */}

                  {/* Guests Selection */}
                  <div className="select-option">
                    <div className="check-date">
                      <label htmlFor="guest">Guests </label>
                      <span style={{ display: "none" }}>{totalRooms} </span>
                      <input
                        type="text"
                        id="guest"
                        ref={guestsInputRef}
                        readOnly
                        onClick={() => showGuestsContainer()}
                      />
                      <div
                        id="validationMessage"
                        style={{ color: "red" }}
                      ></div>
                      <div
                        id="errorMessage"
                        style={{ color: "red", marginTop: "10px" }}
                      ></div>
                      {errorMessage && (
                        <p style={{ color: "red" }}>{errorMessage}</p>
                      )}
                    </div>

                    <div
                      className="guests-container"
                      id="guestsContainer"
                      style={{ display: guestsContainerDisplay }}
                    >
                      <div className="number-controls">
                        <label htmlFor="rooms" style={{ marginTop: "20px" }}>
                          Rooms
                        </label>
                        {/* <button
                          className="b"
                          style={{
                            width: "40px",
                            marginLeft: "35px",
                            fontSize: "20px",
                          }}
                          type="button"
                          onClick={() => decrement("rooms")}
                        > */}
                        <img
                          onClick={() => decrement("rooms")}
                          src={minus}
                          style={{
                            width: "30px",
                            height: "30px",
                            marginLeft: "30px",
                          }}
                          alt=""
                        />
                        {/* </button> */}
                        <input
                          type="text"
                          style={{
                            width: "50px",
                            marginLeft: "16px",
                            textAlign: "center",
                            border: "none",
                            height: "38px",
                            marginTop: "0px",
                          }}
                          name="rooms"
                          id="rooms"
                          value={rooms}
                          readOnly
                        />
                        {/* <button
                          className="b"
                          style={{
                            width: "40px",
                            marginLeft: "20px",
                            fontSize: "20px",
                          }}
                          type="button"
                          onClick={() => increment("rooms")}
                        > */}
                        <img
                          onClick={() => increment("rooms")}
                          src={plus}
                          style={{
                            width: "30px",
                            height: "30px",
                            marginLeft: "14px",
                          }}
                          alt=""
                        />
                        {/* </button> */}
                      </div>

                      <div className="number-controls">
                        <label htmlFor="adults" style={{ marginTop: "20px" }}>
                          Adults
                        </label>
                        {/* <button
                          className="b"
                          style={{
                            width: "40px",
                            marginLeft: "41px",
                            fontSize: "20px",
                          }}
                          type="button"
                          onClick={() => decrement("adults")}
                        > */}
                        <img
                          onClick={() => decrement("adults")}
                          src={minus}
                          style={{
                            width: "30px",
                            height: "30px",
                            marginLeft: "35px",
                          }}
                          alt=""
                        />
                        {/* </button> */}
                        <input
                          type="text"
                          style={{
                            width: "50px",
                            marginLeft: "16px",
                            textAlign: "center",
                            border: "none",
                            height: "38px",
                            marginTop: "0px",
                          }}
                          name="adults"
                          id="adults"
                          value={adults}
                          readOnly
                        />
                        {/* <button
                          className="b"
                          style={{
                            width: "40px",
                            marginLeft: "18px",
                            fontSize: "20px",
                          }}
                          type="button"
                          onClick={() => increment("adults")}
                        > */}
                        <img
                          onClick={() => increment("adults")}
                          src={plus}
                          style={{
                            width: "30px",
                            height: "30px",
                            marginLeft: "15px",
                          }}
                          alt=""
                        />

                        {/* </button> */}
                      </div>

                      <div className="number-controls">
                        <label htmlFor="children" style={{ marginTop: "20px" }}>
                          Children
                        </label>
                        {/* <button
                          className="b"
                          style={{
                            width: "40px",
                            marginLeft: "27px",
                            fontSize: "20px",
                          }}
                          type="button"
                          onClick={() => decrement("children")}
                        > */}
                        <img
                          onClick={() => decrement("children")}
                          src={minus}
                          style={{
                            width: "30px",
                            height: "30px",
                            marginLeft: "23px",
                          }}
                          alt=""
                        />

                        {/* </button> */}
                        <input
                          type="text"
                          style={{
                            width: "50px",
                            marginLeft: "16px",
                            textAlign: "center",
                            border: "none",
                            height: "38px",
                            marginTop: "0px",
                          }}
                          name="children"
                          id="children"
                          value={children}
                          readOnly
                        />
                        {/* <button
                          className="b"
                          style={{
                            width: "40px",
                            marginLeft: "18px",
                            fontSize: " 20px",
                          }}
                          type="button"
                          onClick={() => increment("children")}
                        > */}
                        <img
                          onClick={() => increment("children")}
                          src={plus}
                          style={{
                            width: "30px",
                            height: "30px",
                            marginLeft: "14px",
                          }}
                          alt=""
                        />

                        {/* </button> */}
                      </div>
                      <button
                        className="done-button"
                        onClick={(event) => toggleContainer(event)}
                      >
                        done
                      </button>
                    </div>
                  </div>

                  {/* Hidden Field for Form Submission */}
                  <input type="hidden" name="check_submit" value="true" />
                  {/* Submit Button */}
                  <button
                    type="submit"
                    name="submit"
                    className="btn btn-success"
                  >
                    Check
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookingForm;

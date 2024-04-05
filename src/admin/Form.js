import React, { useState } from "react";
import "./css/Form.css"; // Import a separate CSS file for styling
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "./../baseUrl";

const Form = ({ displayData, onRoomTypeChange, updateTotalDays }) => {
  const navigate = useNavigate();

  const [showCheckInCalendar, setShowCheckInCalendar] = useState(false);
  const [showCheckOutCalendar, setShowCheckOutCalendar] = useState(false);
  const currentDate = new Date();
  const tomorrowDate = new Date(currentDate);
  tomorrowDate.setDate(currentDate.getDate() + 1);
  const [checkOutDate] = useState(null); // Define checkOutDate state
  const [, setRoomType] = useState(null); // Define roomType state
  const [selectedDateIn, setSelectedDateIn] = useState(currentDate);
  const [selectedDateOut, setSelectedDateOut] = useState(tomorrowDate);
  // const [, setAvailableRooms] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    number: "",
    checkIn: "",
    checkOut: "",
    adults: 1,
    children: 0,
    totaldays: 0,
    amountPaid: 0,
  });

  // Function to fetch available rooms for the selected date range
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
        console.log("Room type:", data.roomType);
        // Update roomType in Form component
        setRoomType(data.roomType);
        // Notify BookingForm component about the roomType change
        onRoomTypeChange(data.roomType);
        return data;
      } else {
        throw new Error("Failed to fetch available rooms");
      }
    } catch (error) {
      console.error("Error fetching available rooms:", error);
      return null;
    }
  };

  const calculatedTotalDays = (checkInDate, checkOutDate) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const totalDays = Math.round(Math.abs((startDate - endDate) / oneDay));
    return totalDays;
  };

  const handleCheckInDateChange = async (date) => {
    const totalDays = calculatedTotalDays(date, formData.checkOutDate);
  
    // Ensure totalDays is a valid number
    const validTotalDays = isNaN(totalDays) || totalDays <= 0 ? 1 : totalDays;
  
    // Update formData with the total days (correct property name is "totaldays")
    setFormData({
      ...formData,
      totaldays: validTotalDays, // Updated property name
    });
  
    // Call the updateTotalDays function to pass totalDays to the BookingForm component
    updateTotalDays(validTotalDays); // Corrected function call
  
    setSelectedDateIn(date);
    const response = await fetchAvailableRooms(date, checkOutDate);
    // Pass the room type to the BookingForm component if it's not null
    if (response && response.roomType) {
      setRoomType(response.roomType);
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
      setRoomType(response.roomType);
    }
  
    // Calculate the total days between check-in and check-out dates
    const totalDays = calculatedTotalDays(selectedDateIn, date);
  
    // Ensure totalDays is a valid number
    const validTotalDays = isNaN(totalDays) || totalDays <= 0 ? 1 : totalDays;
  
    // Update formData with the total days (correct property name is "totaldays")
    setFormData({
      ...formData,
      totaldays: validTotalDays, // Updated property name
    });
  
    // Call the updateTotalDays function to pass totalDays to the BookingForm component
    updateTotalDays(validTotalDays); // Corrected function call
  };

  const updateCheckOutOptions = (checkInDate) => {
    const newCheckOutDate = new Date(checkInDate);
    newCheckOutDate.setDate(newCheckOutDate.getDate() + 1);

    // Ensure that the checkout date is at least one day after the check-in date
    if (newCheckOutDate <= checkInDate) {
      newCheckOutDate.setDate(checkInDate.getDate() + 1);
    }

    setSelectedDateOut(newCheckOutDate);
  };

  const toggleCheckInCalendar = () => {
    setShowCheckInCalendar(!showCheckInCalendar);
    setShowCheckOutCalendar(false); // Close check-out calendar
  };

  // Function to toggle the check-out calendar
  const toggleCheckOutCalendar = () => {
    setShowCheckOutCalendar(!showCheckOutCalendar);
    setShowCheckInCalendar(false); // Close check-in calendar
  };

  const handleNumberInput = (e) => {
    const inputValue = e.target.value;

    // Remove non-numeric characters from the input
    const numericValue = inputValue.replace(/[^0-9]/g, "");

    if (numericValue === "") {
      // Handle the case where the input is empty (user deleted all digits)
      setFormData((prevData) => ({
        ...prevData,
        number: "",
      }));
    } else if (/^[6-9]\d{0,9}$/.test(numericValue)) {
      // Update the state with the cleaned numeric value
      setFormData((prevData) => ({
        ...prevData,
        number: numericValue,
      }));
    } else {
      // Handle the case where the input does not start with  
      // You can show an error message or take other actions
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the input is related to adults
    if (name === "adults") {
      // Ensure that the value is at least 1
      const adultsValue = Math.max(parseInt(value, 10), 1);

      // Update the state with the validated value
      setFormData((prevData) => ({
        ...prevData,
        [name]: adultsValue,
      }));
    } else {
      // Update other input values
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const handleChildChange = (e) => {
    const { name, value } = e.target;

    // Check if the input is related to adults
    if (name === "children") {
      // Ensure that the value is at least 1
      const childValue = Math.max(parseInt(value, 10), 0);

      // Update the state with the validated value
      setFormData((prevData) => ({
        ...prevData,
        [name]: childValue,
      }));
    } else {
      // Update other input values
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const handleAmountChange = (e) => {
    const { name, value } = e.target;

    // Check if the input is related to amountPaid
    if (name === "amountPaid") {
      // Parse the input value to an integer
      const parsedValue = parseInt(value, 10);

      // Ensure that the parsed value is a valid number and at least 1
      const amountPaidValue = !isNaN(parsedValue)
        ? Math.max(parsedValue, 1)
        : "";

      // Update the state with the validated value
      setFormData((prevData) => ({
        ...prevData,
        [name]: amountPaidValue,
      }));
    } else {
      // Update other input values
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Check if the input is related to dates
    if (name === "checkIn") {
      const checkInDate = new Date(value);
      setSelectedDateIn(checkInDate);

      // Format the date into a string
      const formattedCheckIn = checkInDate.toDateString();
      setFormData((prevData) => ({
        ...prevData,
        [name]: formattedCheckIn,
      }));
    } else if (name === "checkOut") {
      const checkOutDate = new Date(value);
      setSelectedDateOut(checkOutDate);

      // Format the date into a string
      const formattedCheckOut = checkOutDate.toDateString();
      setFormData((prevData) => ({
        ...prevData,
        [name]: formattedCheckOut,
      }));
    } else {
      // Update other input values
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleBookNow = () => {
    if (displayData.selectedRoomDetails.length === 0) {
      // Display an alert asking the user to select rooms
      Swal.fire({
        title: "No Rooms Selected",
        text: "Please select rooms before booking.",
        icon: "warning",
        button: "OK",
        timer: 5000,
      });
      return; // Exit the function if no rooms are selected
    }

    if (!formData.name || !formData.number || !formData.adults) {
      // Display SweetAlert for validation error
      Swal.fire({
        title: "Validation Error",
        text: "Please fill in all the required fields.",
        icon: "warning",
        button: "OK",
        timer: 3000,
      });
      return; // Exit the function if validation fails
    }

    // Validate the number field for exactly 10 digits
    if (!/^\d{10}$/.test(formData.number)) {
      // Display SweetAlert for validation error
      Swal.fire({
        title: "Invalid Mobile Number",
        text: "Please enter a 10-digit contact number.",
        icon: "warning",
        button: "OK",
        timer: 3000,
      });
      return; // Exit the function if validation fails
    }

    const selectedRoomDetails = JSON.parse(
      localStorage.getItem("selectedRoomDetails")
    );
    const totalPrice = localStorage.getItem("totalPrice");

    const totalRoomCount = selectedRoomDetails.reduce((total, entry) => {
      const countMatch = entry.roomType.match(/(\d+)/);
      const count = countMatch ? parseInt(countMatch[1], 10) : 0;
      return total + count;
    }, 0);

    const roomType = selectedRoomDetails
      .map((entry) => entry.roomType.split(", ")[0])
      .join(", ");

    // Prepare data to be stored in the database
    const bookingData = {
      name: formData.name,
      number: formData.number,
      booking_for: "",
      travel_for_work: "",
      room_type: roomType,
      check_in: formData.checkIn,
      check_out: formData.checkOut,
      adults: formData.adults,
      rooms: totalRoomCount,
      children: formData.children,
      price: "",
      length_of_stay: formData.totaldays,
      total_amount: totalPrice || "",
      paid_amount: formData.amountPaid,
    };

    // Make an API request to save data in the database
    // Replace 'YOUR_API_ENDPOINT' with the actual endpoint on your server
    fetch(`${BASE_URL}/api/booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Data saved in the database:", data);

        Swal.fire({
          title: "Booking Successful!",
          text: "Your booking has been confirmed.",
          icon: "success",
          button: "OK",
        }).then(() => {
          navigate("/Admin");
        });

        // Store data in local storage
        localStorage.setItem("bookingData", JSON.stringify(bookingData));

        // Optionally, you can store your existing local storage values
        const existingLocalStorageData = {
          selectedRoomDetails: JSON.parse(
            localStorage.getItem("selectedRoomDetails")
          ),
          totalPrice: localStorage.getItem("totalPrice"),
        };

        // Merge the existing local storage data with the new booking data
        const mergedData = {
          ...existingLocalStorageData,
          bookingData: bookingData,
        };

        // Store the merged data in local storage
        localStorage.setItem("mergedData", JSON.stringify(mergedData));
      })
      .catch((error) => {
        console.error("Error saving data to the database:", error);
        Swal.fire({
          title: "Error",
          text: "There was an error processing your booking. Please try again later.",
          icon: "error",
          button: "OK",
        });
      });
  };

  const calculateTotalDays = (checkInDate, checkOutDate) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round(
      Math.abs((checkInDate - checkOutDate) / oneDay)
    );
    return diffDays;
  };

  React.useEffect(() => {
    const totalDays = calculateTotalDays(selectedDateIn, selectedDateOut);
    setFormData((prevData) => ({
      ...prevData,
      totaldays: totalDays,
      checkIn: selectedDateIn.toDateString(), // Update checkIn when the date is selected
      checkOut: selectedDateOut.toDateString(), // Update checkOut when the date is selected
    }));
  }, [selectedDateIn, selectedDateOut]);

  return (
    <div className="custom-booking-container mb-3">
      <center>
        {" "}
        <h2 className="mb-3"> Booking Form</h2>
      </center>
      <div>
        <form className="custom-booking-form" >
          <div className="row">
            <div className="col-lg-6">
              <label>
                Name <span className="text-danger fs-5">*</span>
                <input
                  style={{ border: "1px solid #26a69a" }}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="custom-input"
                  required
                />
              </label>

              <label>
                Contact Number <span className="text-danger fs-5">*</span>
                <input
                  style={{ border: "1px solid #26a69a" }}
                  type="text"
                  name="number"
                  id="number"
                  value={formData.number}
                  onChange={handleNumberInput}
                  className="custom-input"
                  required
                />
              </label>
              <label htmlFor="date-in">Check In</label>
              {showCheckInCalendar && (
                <Calendar
                  id="date-in-calendar"
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
                  className="calendar-popup mb-5"
                />
              )}
              <input
                type="text"
                id="date-in"
                style={{ border: "1px solid #26a69a", height: "40px" }}
                readOnly
                onClick={toggleCheckInCalendar}
                onChange={(e) => setSelectedDateIn(new Date(e.target.value))}
                value={selectedDateIn.toDateString()} // Display the selected date
              />

              <label htmlFor="date-out" className=" mt-2">
                Check Out{/* {availableRooms} */}
              </label>
              {showCheckOutCalendar && (
                <Calendar
                  id="date-out-calendar"
                  onChange={(date) => {
                    setSelectedDateOut(date);
                    handleCheckOutDateChange(date);
                    toggleCheckOutCalendar(); // Close calendar on date selection
                  }}
                  value={selectedDateOut}
                  minDate={
                    new Date(selectedDateIn.getTime() + 24 * 60 * 60 * 1000)
                  }
                  maxDate={
                    new Date(
                      selectedDateIn.getTime() + 60 * 24 * 60 * 60 * 1000
                    )
                  }
                  className="calendar-popup "
                />
              )}
              <input
                type="text"
                style={{ border: "1px solid #26a69a", height: "40px" }}
                id="date-out"
                readOnly
                onClick={toggleCheckOutCalendar}
                onChange={(e) => setSelectedDateOut(new Date(e.target.value))}
                value={selectedDateOut.toDateString()} // Display the selected date
              />
            </div>
            <div className="col-lg-6">
              <label>
                Adult <span className="text-danger fs-5">*</span>
                <input
                  type="number"
                  name="adults"
                  value={formData.adults}
                  onChange={handleChange}
                  className="custom-input"
                  required
                />
              </label>

              <label>
                Children <span className="text-danger fs-5">*</span>
                <input
                  type="number"
                  name="children"
                  value={formData.children}
                  onChange={handleChildChange}
                  className="custom-input"
                  required
                />
              </label>

              <label>
                Total Days of staying
                <input
                  type="text"
                  style={{ border: "1px solid #26a69a" }}
                  name="totaldays"
                  value={formData.totaldays}
                  readOnly
                  className="custom-input mt-2"
                />
              </label>

              <label>
                Amount Paid
                <input
                  type="text"
                  style={{ border: "1px solid #26a69a" }}
                  name="amountPaid"
                  value={formData.amountPaid}
                  onChange={handleAmountChange}
                  className="custom-input mt-2"
                  pattern="[0-9]*"
                  inputMode="numeric"
                />
              </label>
            </div>
          </div>{" "}
          <center>
            {" "}
            <button
              type="button"
              onClick={handleBookNow}
              className="custom-button mt-3"
            >
              Book Now
            </button>
          </center>
        </form>
      </div>
    </div>
  );
};

export default Form;

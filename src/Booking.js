import React, { useState } from "react";
import Header, { updateCartCount } from "./Header";
import Footer from "./Footer";
import axios from "axios"; // Assuming you have axios installed, if not, run: npm install axios
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "./baseUrl";

const styles = {
  mainContainer: {
    display: "flex",
    justifyContent: "space-between", // Adjust as needed
    minHeight: "100vh", // Set minimum height to 100vh
    maxHeight: "auto", // Set maximum height to auto
  },
  bookingDetailsContainer: {
    flex: 1,
    textAlign: "left",
    margin: "20px",
    padding: "30px",
    paddingLeft: "60px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f8f8f8",
    maxWidth: "59%", // Optionally, you can set a maximum width
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)", // Add a subtle box shadow
  },
  formContainer: {
    flex: 1,
    margin: "-20px",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  bookingDetails: {
    marginBottom: "20px",
  },
  roomDetails: {
    marginBottom: "20px",
  },
  roomItem: {
    listStyle: "none",
    marginBottom: "10px",
    fontSize: "16px",
  },
  bookingForm: {
    backgroundColor: "wheat",
    marginTop: "22%",
    padding: "19px", // Add padding for better appearance
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)", // Add a subtle box shadow
    width: "90%",
    marginLeft: "-50px",
    height: "88%",
  },
  formContent: {
    width: "100%",
    padding: "20px",
    borderRadius: "8px",
  },
  formHeading: {
    fontSize: "20px",
    marginBottom: "15px",
  },
  formElement: {
    marginBottom: "20px",
  },
  validationError: {
    color: "red",
  },
  select: {
    width: "100%",
    height: "45px",
    border: "none",
  },
  para: {
    color: "green",
    fontWeight: "bold",
  },
  columnStyle: {
    borderRight: "1px solid #ccc", // Adjust the color and size as needed
  },
  input: {
    border: "1px solid white",
    borderRadius: "1px",
    backgroundColor: "white",
  },
};

const Booking = () => {
  const navigate = useNavigate(); // Move this line to the top
  const [phoneNumber, setPhoneNumber] = useState("");
  const [numberError, setNumberError] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    number: "",
  });
  const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberPattern = /^[6-9]\d{9}$/;
    return phoneNumberPattern.test(phoneNumber);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Check if the entered value is numeric
    if (!isNaN(value)) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    const inputValue = event.target.value;
    setPhoneNumber(inputValue.replace(/\D/g, ""));
    setNumberError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!phoneNumber.trim()) {
      setNumberError("Please enter your phone number.");
    } else if (!validatePhoneNumber(phoneNumber)) {
      setNumberError("Please enter a valid 10-digit phone number.");
    } else {
      setIsLoading(true);
      const roomTypes = selectedRooms.map((room) => ({
        roomType: room.roomType,
        roomCount: room.roomCount,
      }));
      console.log("jhfjhfas", roomTypes);
      try {
        const response = await axios.post(
          `${BASE_URL}/api/bookings`,
          {
            name: event.target.name.value,
            number: phoneNumber,
            booking_for: event.target.booking_for.value,
            travel_for_work: event.target.travel_for_work.value,
            room_type: roomTypes, // Assuming you're storing the first room's type
            check_in: selectedRoomDetails.checkIn,
            check_out: selectedRoomDetails.checkOut,
            rooms: selectedRoomDetails.guests?.rooms,
            adults: selectedRoomDetails.guests?.adults,
            children: selectedRoomDetails.guests?.children,
            price: grandTotal,
            length_of_stay: lengthOfStayInDays,
            total_amount: grandTotal,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        if (response.data && response.data.message === "Booking submitted successfully") {
          Swal.fire({
            icon: "success",
            title: "Booking Successful!",
            text: "Thank you for your reservation.",
            timer: 2000,
          }).then(() => {
            console.log("Form submitted successfully!");
  
            // Fetch the last entered booking ID from the server
            axios
              .get(`${BASE_URL}/api/bookings/lastEnteredId`)
              .then((bookingIdResponse) => {
                const bookingId = bookingIdResponse.data.bookingDetails.id;
                navigate(`/bookings/${bookingId}`);
                // Add any additional logic you need after a successful form submission
              })
              .catch((error) => {
                console.error("Error fetching last entered booking ID:", error);
                // Handle error if necessary
              });
          });
          localStorage.setItem("selectedRooms", JSON.stringify([]));
  
          updateCartCount(0);
          localStorage.removeItem("selectedRoomDetails");
        } else {
          console.error("Booking submission error:", response.data);
          setBookingError("Error submitting: Please try again later.");
        }
      } catch (error) {
        console.error("Error submitting form:", error.message);
        setBookingError(`Error submitting form: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };
  // Retrieve details from local storage
  const selectedRooms = JSON.parse(localStorage.getItem("selectedRooms")) || [];
  const selectedRoomDetails =
    JSON.parse(localStorage.getItem("selectedRoomDetails")) || {};
  const checkInDate = new Date(selectedRoomDetails.checkIn);
  const checkOutDate = new Date(selectedRoomDetails.checkOut);

  // Calculate the length of stay in milliseconds
  const lengthOfStay = checkOutDate - checkInDate;

  // Convert the length of stay from milliseconds to days
  const lengthOfStayInDays = Math.ceil(lengthOfStay / (1000 * 60 * 60 * 24));

  // Calculate room counts and total prices
  const roomCounts = {};
  const totalPriceByRoom = {};
  selectedRooms.forEach((room) => {
    if (room.roomType in roomCounts) {
      roomCounts[room.roomType] += room.roomCount;
      totalPriceByRoom[room.roomType] += room.price * room.roomCount;
    } else {
      roomCounts[room.roomType] = room.roomCount;
      totalPriceByRoom[room.roomType] = room.price * room.roomCount;
    }
  });

  // Calculate total amount with tax for each room type
  const totalAmountByRoom = {};
  Object.entries(totalPriceByRoom).forEach(([roomType, totalPrice]) => {
    totalAmountByRoom[roomType] = totalPrice + roomCounts[roomType] * 120; // Adding tax
  });

  // Calculate total amount with tax for all room types
  const totalAmount = Object.values(totalAmountByRoom).reduce(
    (acc, price) => acc + price,
    0
  );

  // Calculate grand total as the total amount multiplied by the length of stay in days
  const grandTotal = totalAmount * lengthOfStayInDays;

  return (
    <div>
      <Header />
      <div style={styles.mainContainer}>
        {/* Left side: Booking Details */}
        <div style={styles.bookingDetailsContainer}>
          <div className="row">
            <div className="col-lg-6 " style={styles.columnStyle}>
              <div style={styles.heading}>Your Booking Details</div>
              <div style={styles.bookingDetails}>
                <p>
                  <strong>Check-in Date :</strong> {selectedRoomDetails.checkIn}
                </p>
                <p>
                  <strong>Check-out Date :</strong>{" "}
                  {selectedRoomDetails.checkOut}
                </p>
                <p>
                  <strong>Total Days :</strong> {lengthOfStayInDays} day
                  {lengthOfStayInDays > 1 ? "s" : ""}
                </p>
                <p>
                  <strong>Guests : </strong>
                  {selectedRoomDetails.guests?.rooms} Room,{" "}
                  {selectedRoomDetails.guests?.adults} Adults,
                  {selectedRoomDetails.guests?.children} Children
                </p>
              </div>
              <div style={styles.roomDetails}>
                <div style={styles.heading}>Your Price Summary</div>
                <ul>
                  {Object.entries(roomCounts).map(
                    ([roomType, count], index) => (
                      <li key={index} style={styles.roomItem}>
                        <strong>{roomType} -</strong> {count}, Price ₹{" "}
                        { lengthOfStayInDays * totalPriceByRoom[roomType]} + ₹{count * 120 * lengthOfStayInDays } Taxes and
                        Charges (₹120 per day)
                      </li>
                    )
                  )}
                </ul>
                <div>
                  <strong>
                    Total Amount for {lengthOfStayInDays} day
                    {lengthOfStayInDays > 1 ? "s" : ""}:
                  </strong>{" "}
                  ₹ {grandTotal}
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div>
                <div style={styles.heading}>Your Payment schedule</div>
                <p style={styles.para}>
                  No payment today. You'll pay when you stay.
                </p>
              </div>
              <div>
                <div style={styles.heading}>
                  How much will it cost to cancel?
                </div>
                <p style={styles.para}>Free cancellation anytime</p>
              </div>
            </div>
          </div>
        </div>
        {/* Right side: Booking Form */}
        <div
          className="col-xl-4 col-lg-5 offset-xl-2 offset-lg-1"
          style={styles.formContainer}
        >
          <div className="booking-form" style={styles.bookingForm}>
            <h3 style={styles.formHeading}>Booking Your Room</h3>
            <form
              id="booking-form"
              action="#"
              method="post"
              style={styles.formContent}
              onSubmit={handleSubmit}
            >
              <div className="check-date" style={styles.formElement}>
                <label htmlFor="name">
                  Name <span className="text-danger fs-5">*</span>
                </label>
                <input
                  style={styles.input}
                  type="text"
                  id="name"
                  placeholder="Enter Your Name"
                  name="name"
                  required
                  autoFocus
                />
                <span
                  id="nameError"
                  style={styles.validationError}
                  className="validation-error"
                ></span>
              </div>
              <div className="check-date" style={styles.formElement}>
                <label htmlFor="number">
                  Number <span className="text-danger fs-5">*</span>
                </label>
                <input
                  style={styles.input}
                  type="text"
                  onChange={handleChange}
                  id="number"
                  placeholder="Enter Mobile Number"
                  required
                  name="number"
                  value={formData.number}
                />
                {numberError && <p style={{ color: "red" }}>{numberError}</p>}

                <span
                  id="numberError"
                  style={styles.validationError}
                  className="validation-error"
                ></span>
              </div>
              <div className="select-option" style={styles.formElement}>
                <label htmlFor="guest">Who are you booking for?</label>
                <select id="guest" style={styles.select} name="booking_for">
                  <option value="For me">I am the main guest</option>
                  <option value="For someone else">
                    Booking is for someone else
                  </option>
                </select>
              </div>
              <div className="select-option" style={styles.formElement}>
                <label htmlFor="room">Are you traveling for work?</label>
                <select id="room" style={styles.select} name="travel_for_work">
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <button
                type="submit"
                className="btn btn-success"
                disabled={isLoading}
              >
                {isLoading ? "Booking..." : "Book Now"}
              </button>
              <p style={{ color: "red", marginTop: "10px" }}>{bookingError}</p>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Booking;

import React, { useEffect, useState, useRef  } from "react";
import "./css/Style.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import view from "./img/view.png";
import trash from "./img/trash.png";
import { Link } from "react-router-dom";
import { BASE_URL } from "./../baseUrl";

const formatDate = (dateString) => {
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const formattedDate = new Date(dateString).toLocaleDateString(
    "en-US",
    options
  );
  return formattedDate;
};

const formatDateString = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Home = () => {
  const [bookingDetails, setBookingDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalRooms, setTotalRooms] = useState(0);
  const [yearFilter, setYearFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [canceledRows, setCanceledRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editedBooking, setEditedBooking] = useState({}); // State to hold edited booking details
  // const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
  const [showCancelledDetailsModal, setShowCancelledDetailsModal] = useState(false);
  const [selectedCancelledRoomDetails, setSelectedCancelledRoomDetails] = useState(null);
  const [cancelledRoomCounts, setCancelledRoomCounts] = useState(0);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBookingForView, setSelectedBookingForView] = useState(null);
  const [pendingCounts, setPendingCounts] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tableRef = useRef(null);


  const handleViewCancelledDetailsClick = () => {
    fetch(`${BASE_URL}/api/cancelledRoomDetails`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch canceled room details');
        }
        return response.json();
      })
      .then((data) => {
        console.log('dataaaa',data)
        setSelectedCancelledRoomDetails(data);
        setShowCancelledDetailsModal(true);
      })
      .catch((error) => {
        console.error("Error fetching canceled room details:", error);
        // Optionally, you can display an error message to the user
      });
  };

  const handleCloseCancelledDetailsModal = () => {
    setShowCancelledDetailsModal(false);
    setSelectedCancelledRoomDetails(null);
  };
  // const [paymentStatus, setPaymentStatus] = useState("pending");

  const handlePaymentCheckboxChange = async (id) => {
    try {
      // Update the payment status in the database
      await fetch(`${BASE_URL}/api/bookings/${id}/payment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentStatus: "paid", // Adjust the property name based on your server code
        }),
      });

      // Fetch the updated data from the server
      fetchData();
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const today = formatDateString(new Date().toISOString());
  let todayCheckouts;

 // Check if bookingDetails is an array before filtering
 if (Array.isArray(bookingDetails)) {
  // Fetch today's checkout details
  todayCheckouts = bookingDetails.filter(
    (booking) => formatDateString(booking.check_out) === today
  );
} else {
  console.error('bookingDetails is not an array');
}

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  

  useEffect(() => {
    // Fetch pending counts from the server
    const fetchPendingCounts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/pendingCounts`);
        const data = await response.json();
        setPendingCounts(data.pendingCounts);
      } catch (error) {
        console.error("Error fetching pending counts:", error);
      }
    };

    fetchPendingCounts();
  }, []);

  const handleViewClick = (booking) => {
    setSelectedBookingForView(booking);
    setSelectedBooking(booking); // Ensure selectedBooking is set
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedBookingForView(null);
  };



  const handleDeleteClick = (id) => {
    // Use SweetAlert for confirmation
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      timer: 5000, // Timer in milliseconds (5 seconds)
      timerProgressBar: true, // Display a progress bar for the timer
    }).then((result) => {
      if (result.isConfirmed) {
        // Delete the row from the UI
        const updatedBookingDetails = bookingDetails.filter(
          (booking) => booking.id !== id
        );
        setBookingDetails(updatedBookingDetails);
  
        // Delete the row from the database
        fetch(`${BASE_URL}/api/bookings/${id}`, {
          method: "DELETE",
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Booking deleted from the database:", data);
          })
          .catch((error) => {
            console.error("Error deleting booking from the database:", error);
          });
  
        // Show success message with a timer
        Swal.fire({
          title: "Deleted!",
          text: "Your booking has been deleted.",
          icon: "success",
          timer: 3000, // Timer in milliseconds (5 seconds)
          timerProgressBar: true, // Display a progress bar for the timer
        });
      }
    });
  };

  const getTodayCheckoutCounts = () => {
    const today = formatDateString(new Date().toISOString());

    // Filter bookings that check out today
    const todayCheckouts = bookingDetails.filter(
      (booking) => formatDateString(booking.check_out) === today
    );

    return todayCheckouts.length;
  };

  // Usage of the function in the component
  const todayCheckoutCounts = getTodayCheckoutCounts();

  const handleAddClick = (booking) => {
    // Set the selected booking and show the modal
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleToggleModal = (booking) => {
    setShowModal(!showModal);
    setEditedBooking(booking); // Initialize editedBooking with the current booking details
  };

  const handleFieldChange = (field, value) => {
    setSelectedBookingForView((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  // Helper function to get updated label names
  const getLabel = (key) => {
    const labelMap = {
      name: "Name",
      number: "Number",
      timestamp: "Booking Date",
      check_in: "Check In",
      check_out: "Check Out",
      room_type: "Room Types",
      rooms: "Total Rooms",
      adults: "Adults",
      children: "Children",
      total_amount: "Total Amount",
      paid_amount: "Paid Amount",
      balance_amount: "Balance Amount",
      length_of_stay: "Total days of staying",
      payment_status: "Payment Status",
    };
    return labelMap[key] || key;
  };

  // Helper function to format values based on the key
  // Helper function to format values based on the key
  // Helper function to format values based on the key
  const getFormattedValue = (key, value) => {
    if (key === "timestamp") {
      return new Date(value).toDateString(); // Format booking date as "Sat Jan 20 2024"
    }
    if (key === "check_in" || key === "check_out") {
      return formatDate(value, "ddd MMM DD YYYY").replace(/,/g, ""); // Remove commas
    }
    if (key === "guests") {
      const [adults = "", children = ""] = (value || "").split(",");
      return `${adults.trim()} Adults, ${children.trim()} Children`; // Format guests
    }
    return value;
  };

  const handleUpdateBooking = () => {
    // Check if selectedBookingForView is null
    if (!selectedBookingForView) {
      console.error("Cannot update booking: selectedBookingForView is null");
      return;
    }

    // Prepare the updated booking object
    const updatedBooking = {
      ...selectedBookingForView,
      ...editedBooking,
    };

    // Update the booking in the state
    const updatedBookingDetails = bookingDetails.map((booking) =>
      booking === selectedBookingForView ? updatedBooking : booking
    );
    setBookingDetails(updatedBookingDetails);

    fetch(`${BASE_URL}/api/bookings/${selectedBookingForView.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedBooking),
    })
      .then((response) => response.json())
      .then((updatedBookingFromDB) => {
        console.log("Booking updated in the database:", updatedBookingFromDB);

        // Show SweetAlert notification on successful update
        Swal.fire({
          icon: "success",
          title: "Booking Updated!",
          text: "The booking has been updated successfully.",
          timer: 2500,
        }).then(() => {
          window.location.reload();
        });
      })
      .catch((error) => {
        console.error("Error updating booking in the database:", error);

        // Show SweetAlert notification on update error
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "An error occurred while updating the booking.",
          timer: 2500,
        });
      });

    // Close the modal after updating
    setShowViewModal(false);
  };

  const itemsPerPage = 10;
  const maxVisiblePages = 5;
  const pagesBeforeAfter = 2;

  const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026]; // Replace with your actual years
  const months = [
    { fullName: "January", abbreviation: 1 },
    { fullName: "February", abbreviation: 2 },
    { fullName: "March", abbreviation: 3 },
    { fullName: "April", abbreviation: 4 },
    { fullName: "May", abbreviation: 5 },
    { fullName: "June", abbreviation: 6 },
    { fullName: "July", abbreviation: 7 },
    { fullName: "August", abbreviation: 8 },
    { fullName: "September", abbreviation: 9 },
    { fullName: "October", abbreviation: 10 },
    { fullName: "November", abbreviation: 11 },
    { fullName: "December", abbreviation: 12 },
  ];

  useEffect(() => {
    fetchData();
    fetchRoomCount();
    // setCanceledRows(getCancelledRowsFromStorage());
  }, [currentPage, yearFilter, monthFilter]);
  // Update data when year or month filter changes

  useEffect(() => {
    fetch(`${BASE_URL}/api/cancelledRoomCounts`)
      .then((response) => response.json())
      .then((data) => {
        setCancelledRoomCounts(data.cancelledRoomCounts);
      })
      .catch((error) => console.error("Error fetching cancelled room counts:", error));
  }, []);
  // useEffect(() => {
  //   fetchData();
  //   fetchRoomCount();
  // }, []); // Empty dependency array to run the effect only once

  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/bookingDetails`);
      const data = await response.json();
      setBookingDetails(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
      // setRoomLimit(data.totalRooms);
    } catch (error) {
      console.error("Error fetching room count:", error.message);
      // Handle the error, such as displaying an error message to the user
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleViewDetailsClick = () => {
    setSearchTerm("Pending");
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleYearChange = (selectedYear) => {
    console.log("Selected Year:", selectedYear);
    setYearFilter(selectedYear);
  };

  const handleMonthChange = (selectedMonth) => {
    console.log("Selected Month (in handleMonthChange):", selectedMonth);
    setMonthFilter(selectedMonth);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Use bookingDetails for filtering
  const filteredData = bookingDetails.filter((row) => {
    const getYearFromDateString = (dateString) => {
      const date = new Date(dateString);
      return date.getFullYear();
    };

    const getMonthFromDateString = (dateString) => {
      const date = new Date(dateString);
      return date.getMonth() + 1; // Months are zero-based, so add 1
    };

    const checkInYear = row.check_in && getYearFromDateString(row.check_in);
    const checkOutYear = row.check_out && getYearFromDateString(row.check_out);
    const checkInMonth = row.check_in && getMonthFromDateString(row.check_in);
    const checkOutMonth =
      row.check_out && getMonthFromDateString(row.check_out);

    const filterYear = yearFilter && parseInt(yearFilter, 10);
    const filterMonth = monthFilter && parseInt(monthFilter, 10);

    return (
      Object.values(row).some((cell) => {
        if (cell === null || cell === undefined) {
          return false;
        }
        return cell.toString().toLowerCase().includes(searchTerm.toLowerCase());
      }) &&
      (yearFilter === "" ||
        checkInYear === filterYear ||
        checkOutYear === filterYear) &&
      (monthFilter === "" ||
        checkInMonth === filterMonth ||
        checkOutMonth === filterMonth)
    );
  });


  const itemsToDisplay = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <li
            key={i}
            className={`page-item ${currentPage === i ? "active" : ""}`}
          >
            <button className="page-link" onClick={() => paginate(i)}>
              {i}
            </button>
          </li>
        );
      }
    } else {
      const startPage = Math.max(1, currentPage - pagesBeforeAfter);
      const endPage = Math.min(totalPages, currentPage + pagesBeforeAfter);

      if (startPage > 1) {
        pageNumbers.push(
          <li key={1} className={`page-item`}>
            <button className="page-link" onClick={() => paginate(1)}>
              {1}
            </button>
          </li>
        );

        if (startPage > 2) {
          pageNumbers.push(
            <li key="ellipsis-start" className="page-item disabled">
              <span className="page-link">...</span>
            </li>
          );
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        // Check if the page has data
        const indexOfFirstItem = (i - 1) * itemsPerPage;
        const indexOfLastItem = Math.min(
          indexOfFirstItem + itemsPerPage,
          filteredData.length
        );
        const pageHasData = indexOfFirstItem < indexOfLastItem;

        if (pageHasData) {
          pageNumbers.push(
            <li
              key={i}
              className={`page-item ${currentPage === i ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => paginate(i)}>
                {i}
              </button>
            </li>
          );
        }
      }

      if (endPage < totalPages - 1) {
        if (endPage < totalPages - 2) {
          pageNumbers.push(
            <li key="ellipsis-end" className="page-item disabled">
              <span className="page-link">...</span>
            </li>
          );
        }

        pageNumbers.push(
          <li key={totalPages} className={`page-item`}>
            <button className="page-link" onClick={() => paginate(totalPages)}>
              {totalPages}
            </button>
          </li>
        );
      }
    }

    return pageNumbers;
  };
  const handleCancelClick = (bookingId) => {
    // Use SweetAlert for confirmation
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to cancel this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Make a request to cancel the booking
        fetch(`${BASE_URL}/api/cancel/${bookingId}/cancel`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data.message);
            // Update canceledRows state with the booking ID
            setCanceledRows((prevCanceledRows) => [
              ...prevCanceledRows,
              bookingId,
            ]);
            // Update bookingDetails state to mark the booking as cancelled
            const updatedBookingDetails = bookingDetails.map((booking) =>
              booking.id === bookingId ? { ...booking, cancellation: "cancelled" } : booking
            );
            setBookingDetails(updatedBookingDetails);
  
            // Update the selectedBookingForView state to mark the booking as cancelled
            setSelectedBookingForView((prevSelectedBooking) => ({
              ...prevSelectedBooking,
              cancellation: "cancelled"
            }));
  
            // Display success message
            Swal.fire({
              icon: "success",
              title: "Booking Cancelled!",
              text: "Your booking has been cancelled successfully.",
            });
          })
          .catch((error) => {
            console.error("Error cancelling booking:", error);
            // Handle error if needed
          });
      }
    });
  };
  // // Function to format timestamp
  // const formatTimestamp = (timestamp) => {
  //   const options = {
  //     weekday: "short",
  //     year: "numeric",
  //     month: "short",
  //     day: "numeric",
  //   };
  //   return new Date(timestamp)
  //     .toLocaleDateString("en-US", options)
  //     .replace(/,/g, "");
  // };

  return (
    <div className="container-fluid p-4">
      <div className="row  align-items-center mt-4">
        <div
          id="box"
          className="col-12 col-sm-6 col-md-4 col-lg-2 p-3  box "
          style={{ backgroundColor: "#BDD8F1" }}
        >
          <i className="bi bi-house-door-fill fs-1 text-primary"></i>
          <div className="mt-3">
            <h5>Available Rooms</h5>
            <p className="mb-1">
              <strong>{totalRooms}</strong>
            </p>
            <Link to={"/Admin/BookingForm"}>
              <button className="btn btn-sm btn-primary">View Details</button>
            </Link>
          </div>
        </div>

        <div
          className="col-12 col-sm-6 col-md-4 col-lg-2 p-3 box "
          style={{ backgroundColor: "#BDD8F1" }}
        >
          <i className="bi bi-arrow-right-square-fill fs-1 text-warning"></i>
          <div className="mt-3">
            <h5>Today Checkout</h5>
            <p className="mb-1">
              <strong>{todayCheckoutCounts}</strong>
            </p>
            <button
              className="btn btn-sm btn-warning"
              onClick={handleOpenModal}
            >
              View Details
            </button>
          </div>
        </div>
        {todayCheckoutCounts > 0 && (
          <div>
            {isModalOpen && (
              <div
                className="modal-overlay"
                style={{
                  position: "fixed",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  zIndex: "9999",
                }}
                onClick={handleCloseModal}
              >
                <div
                  style={{
                    ...modalStyles,
                    maxHeight: "90vh",
                    overflowY: "auto",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <center>
                    <h4 className="mb-3" style={{ marginLeft: "39%" }}>
                      Today Checkout Details
                      <span
                        className="fa fa-times fs-1"
                        title="Close"
                        style={{ marginLeft: "55%" }}
                        onClick={handleCloseModal}
                      ></span>
                    </h4>
                  </center>

                  {/* Your modal content goes here */}
                  <table className="table table-bordered">
                    <thead className="thead-dark">
                      <tr>
                        <th scope="col">S.No</th>
                        <th scope="col">Name</th>
                        <th scope="col">Number</th>
                        <th scope="col">RoomType</th>
                        <th scope="col">Booking Date</th>
                        <th scope="col">CheckIn</th>
                        <th scope="col">CheckOut</th>
                        <th scope="col">TotalRooms</th>
                        <th scope="col">Adults</th>
                        <th scope="col">Children</th>
                        <th scope="col">TotalAmount</th>
                        <th scope="col">PaidAmount</th>
                        <th scope="col">BalanceAmount</th>
                        <th scope="col">TotalDays</th>
                        <th scope="col">Cancellations</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todayCheckouts.map((booking, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>{" "}
                          {/* Incrementing Serial Number here */}
                          {Object.entries(booking)
                            .filter(
                              ([key]) =>
                                ![
                                  "id",
                                  "booking_for",
                                  "travel_for_work",
                                  "price",
                                  "timestamp",
                                  "payment_status",
                                  "otp",
                                ].includes(key)
                            )
                            .map(([key, value], i) => (
                              <td key={i}>{value}</td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <button
                    className="btn btn-secondary mt-2"
                    style={{ float: "right" }}
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        <div
          className="col-12 col-sm-6 col-md-4 col-lg-2 p-3 box "
          style={{ backgroundColor: "#BDD8F1" }}
        >
          <i className="bi bi-backspace-reverse-fill fs-1 text-danger"></i>
          <div className="mt-3">
            <h5>Cancellations</h5>
            <p className="mb-1">
              <strong>{cancelledRoomCounts}</strong>
            </p>
            <button
              className="btn btn-sm btn-danger"
              onClick={handleViewCancelledDetailsClick }
            >
              View Details
            </button>
          </div>
        </div>

        {/* Modal for displaying canceled room details */}

        {showCancelledDetailsModal && (
          <div
            className="modal-overlay"
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: "9999",
              overflowY: "auto", // Enable vertical scrolling
            }}
          >
            <div style={modalStyles}>
              <center>
                <h4 className="mb-3" style={{ marginLeft: "40%" }}>
                  Cancelled Room Details
                  <span
                    className="fa fa-times fs-1"
                    title="Close"
                    style={{ marginLeft: "59%" }}
                    onClick={handleCloseCancelledDetailsModal}
                  ></span>
                </h4>
              </center>

              {/* Scrollable area */}
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                <table className="table table-bordered">
                  {/* thead */}
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">S.No</th>
                      <th scope="col">Name</th>
                      <th scope="col">Number</th>
                      <th scope="col">RoomType</th>
                      <th scope="col">Booking Date</th>
                      <th scope="col">CheckIn</th>
                      <th scope="col">CheckOut</th>
                      <th scope="col">TotalRooms</th>
                      <th scope="col">Guests</th>
                      <th scope="col">TotalAmount</th>
                      <th scope="col">PaidAmount</th>
                      <th scope="col">BalanceAmount</th>
                      <th scope="col">TotalDays</th>
                      {/* <th scope="col">Paymentpending</th> */}
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  {/* tbody */}
                  <tbody style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {selectedCancelledRoomDetails &&
                      selectedCancelledRoomDetails.map((room, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          {Object.entries(room)
                            .filter(
                              ([key]) =>
                                ![
                                  "id",
                                  "booking_for",
                                  "travel_for_work",
                                  "price",
                                  "children",
                                  "timestamp",
                                  "payment_status",
                                  "otp",
                                  // 'length_of_stay'
                                ].includes(key)
                            )
                            .map(([key, value], i) => (
                              <td key={i}>{value}</td>
                            ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <button
                className="btn btn-secondary mt-2"
                style={{ float: "right" }}
                onClick={handleCloseCancelledDetailsModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
        <div
          className="col-12 col-sm-6 col-md-4 col-lg-2 p-3 box "
          style={{ backgroundColor: "#BDD8F1" }}
        >
          <i className="bi bi-cash-coin text-success"></i>
          <div className="mt-3">
            <h5>Pending Payments</h5>
            <p className="mb-1">
              <strong>{pendingCounts}</strong>
            </p>
            <button className="btn btn-sm btn-secondary" onClick={handleViewDetailsClick}>View Details</button>
          </div>
        </div>
      </div>

      <div className="p-2">
        <div className="p-1">
          <div className="table-responsive">
            <center>
              <h3 className="mb-4" style={{ marginLeft: "0px" }}>
                <strong>Booked Details</strong>

                <div className="form-group mr-2">
                  <Link to={"/Admin/BookingForm"}>
                    {" "}
                    <button
                      className="btn btn-info"
                      style={{
                        float: "left",
                        fontFamily: "calibri",
                        marginTop: "0px",
                        fontSize: "18px",
                      }}
                    >
                      {" "}
                      Book a Room
                    </button>
                  </Link>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginBottom: "10px",
                    }}
                  >
                    <div className="form-group mr-2">
                      <select
                        style={{ fontFamily: "calibri", }}
                        className="form-control"
                        value={yearFilter}
                        onChange={(e) => handleYearChange(e.target.value)}
                      >
                        <option value="">Search Year</option>
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <select
                        style={{ fontFamily: "calibri" }}
                        className="form-control"
                        value={monthFilter}
                        onChange={(e) => handleMonthChange(e.target.value)}
                      >
                        <option value="">Search Month</option>
                        {months.map((month) => (
                          <option
                            key={month.abbreviation}
                            value={month.abbreviation}
                          >
                            {month.fullName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div
                      style={{
                        width: "200px",
                        float: "right",
                        fontFamily: "calibri",
                        marginLeft: "10px",
                      }}
                    >
                      {" "}
                      <input
                        type="text"
                        className="searchbox form-control"
                        // autoFocus
                        id="search"
                        name="search"
                        placeholder="Search Table"
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />{" "}
                    </div>
                  </div>
                </div>
              </h3>
            </center>

            {/* table-striped */}
            <div className="table-responsive" ref={tableRef}>
              <table className="table table-bordered ">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">S.No</th>
                    <th scope="col">Name</th>
                    <th scope="col">Number</th>
                    <th scope="col">Room Type</th>
                    <th scope="col">Booking Date</th>
                    <th scope="col">Check-in</th>
                    <th scope="col">Check-out</th>
                    <th scope="col">Guests</th>
                    <th scope="col">Total days of staying</th>
                    <th scope="col">Total Rooms</th>
                    <th scope="col">Total Amount</th>
                    <th scope="col">Paid Amount</th>
                    <th scope="col">Balance Amount</th>
                    <th scope="col" style={{ display: "none" }}>
                      Add Rooms
                    </th>
                    {/* <th scope="col">Cancel Booking</th> */}
                    <th scope="col">View/Edit and Cancel Booking</th>
                    <th scope="col">Delete Booking</th>
                    <th scope="col">Payment pending</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsToDisplay.map((booking, index) => (
                    <tr
                    key={booking.id}
                    style={{ backgroundColor: booking.cancellation === "cancelled" ? "#ffcccc" : "inherit" }}
                    onClick={() => console.log("Cancellation status:", booking.cancellation)}
                  >
                      <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                      <td>{booking.name}</td>
                      <td>{booking.number}</td>
                      <td>{booking.room_type}</td>
                      <td>{booking.booking_date}</td>
                      <td>{booking.check_in}</td>
                      <td>{booking.check_out}</td>
                      <td>
                        {booking.adults} Adult{booking.adults === 1 ? "" : "s"},{" "}
                        {booking.children} Children
                      </td>
                      <td>{booking.length_of_stay}</td>
                      <td>{booking.rooms}</td>
                      <td>Rs.{booking.total_amount}</td>
                      <td>Rs.{booking.paid_amount}</td>
                      <td>Rs.{booking.balance_amount}</td>

                      <td style={{ display: "none" }}>
                        <button
                          className="btn btn-info"
                          onClick={() => handleAddClick(booking)}
                        >
                          Add
                        </button>
                      </td>
                      {/* <td>
                        <button
                          className={`btn ${
                            canceledRows.includes(booking.id)
                              ? "btn-danger"
                              : "btn-danger"
                          }`}
                          onClick={() => handleCancelClick(booking.id)}
                          disabled={canceledRows.includes(booking.id)}
                        >
                          {canceledRows.includes(booking.id)
                            ? "Cancelled"
                            : "Cancel"}
                        </button>
                      </td> */}
                      <td
                        className="text-primary"
                        title="View"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleViewClick(booking)}
                      >
                        <span
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                            display: "flex",
                            marginTop: "18px",
                          }}
                        >
                          <img
                            src={view}
                            width={"30px"}
                            height={"30px"}
                            alt=""
                          />
                        </span>
                      </td>

                      <td
                        className={`text-danger ${
                          canceledRows.includes(booking.id) ? "disabled" : ""
                        }`}
                        style={{ cursor: "pointer" }}
                        title="Delete"
                        onClick={() => handleDeleteClick(booking.id)}
                      >
                        <span
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                            display: "flex",
                            marginTop: "18px",
                          }}
                        >
                          <img
                            src={trash}
                            width={"30px"}
                            height={"30px"}
                            alt=""
                          />
                        </span>
                      </td>
                      <td>
                        {booking.payment_status === "pending" ? (
                          <div>
                            <input
                              type="checkbox"
                              title="Click here to paid"
                              onChange={() =>
                                handlePaymentCheckboxChange(booking.id)
                              }
                            />
                            <span>Pending</span>
                          </div>
                        ) : (
                          <span>Paid</span>
                        )}
                      </td>
                    </tr>
                  ))}

                  {showViewModal && (
                    <Modal
                      show={showViewModal}
                      onHide={handleCloseViewModal}
                      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                      centered
                    >
                      <Modal.Header>
                        <Modal.Title>
                          Booking Details{" "}
                          <span
                            className="fa fa-times fs-1"
                            title="Close"
                            style={{ marginLeft: "280px" }}
                            onClick={handleCloseViewModal}
                          ></span>
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <form>
                          <div className="row">
                            <div className="col-lg-6">
                              {[
                                "name",
                                "number",
                                "booking_date",
                                "check_in",
                                "check_out",
                                "room_type",
                                "rooms",
                              ].map((key) => (
                                <div className="mb-3" key={key}>
                                  <label htmlFor={key} className="form-label">
                                    {getLabel(key)}:
                                  </label>
                                  <input
                                    type="text"
                                    id={key}
                                    className="form-control"
                                    value={getFormattedValue(
                                      key,
                                      selectedBookingForView[key]
                                    )}
                                    readOnly={!isEditMode}
                                    onChange={(e) =>
                                      handleFieldChange(key, e.target.value)
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                            <div className="col-lg-6">
                              {[
                                "adults",
                                "children",
                                "total_amount",
                                "paid_amount",
                                "balance_amount",
                                "length_of_stay",
                              ].map((key) => (
                                <div className="mb-3" key={key}>
                                  <label htmlFor={key} className="form-label">
                                    {getLabel(key)}:
                                  </label>
                                  <input
                                    type="text"
                                    id={key}
                                    className="form-control"
                                    value={getFormattedValue(
                                      key,
                                      selectedBookingForView[key]
                                    )}
                                    readOnly={!isEditMode}
                                    onChange={(e) =>
                                      handleFieldChange(key, e.target.value)
                                    }
                                  />
                                </div>
                              ))}
                              <label htmlFor="payment">Payment Status</label>

                              <div className="row ml-3 ">
                                <div className="col">
                                  <div className="mb-3 d-flex align-items-center">
                                    <input
                                      type="checkbox"
                                      id="pending"
                                      className="form-check-input me-2"
                                      checked={
                                        selectedBookingForView.payment_status ===
                                        "pending"
                                      }
                                      disabled={!isEditMode}
                                      onChange={() =>
                                        handleFieldChange(
                                          "payment_status",
                                          "pending"
                                        )
                                      }
                                    />
                                    <label
                                      htmlFor="pending"
                                      className="form-check-label me-4"
                                    >
                                      Pending
                                    </label>
                                  </div>
                                </div>
                                <div className="col">
                                  <div className="mb-3 d-flex align-items-center">
                                    <input
                                      type="checkbox"
                                      id="paid"
                                      className="form-check-input me-2"
                                      checked={
                                        selectedBookingForView.payment_status ===
                                        "paid"
                                      }
                                      disabled={!isEditMode}
                                      onChange={() =>
                                        handleFieldChange(
                                          "payment_status",
                                          "paid"
                                        )
                                      }
                                    />
                                    <label
                                      htmlFor="paid"
                                      className="form-check-label"
                                    >
                                      Paid
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </Modal.Body>
                      <Modal.Footer>
                        {!isEditMode && (
                          <Button
                            variant="primary"
                            onClick={() => setIsEditMode(true)}
                          >
                            Edit
                          </Button>
                        )}
                        {isEditMode && (
                          <>
                            <Button
                              variant="secondary"
                              onClick={() => setIsEditMode(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="primary"
                              onClick={handleUpdateBooking}
                            >
                              Save Changes
                            </Button>
                          </>
                        )}
             <button
  className={`btn ${selectedBookingForView.cancellation === "cancelled" ? "btn-danger" : "btn-danger"}`}
  onClick={() => handleCancelClick(selectedBookingForView.id)}
  disabled={selectedBookingForView.cancellation === "cancelled" || isEditMode}
>
  {selectedBookingForView.cancellation === "cancelled" ? "Cancelled" : "Cancel Room"}
</button>
                        <Button
                          variant="secondary"
                          onClick={handleCloseViewModal}
                        >
                          Close
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => paginate(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1} // Disable if currentPage is 1
              >
                &laquo;
              </button>
            </li>
            {renderPageNumbers()}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => paginate(Math.max(currentPage + 1, 1))}
                disabled={currentPage === totalPages}
              >
                &raquo;
              </button>
            </li>
          </ul>
        </nav>

        <Modal show={showModal} onHide={() => handleToggleModal({})}>
          <Modal.Header>
            <Modal.Title style={{ marginLeft: "130px" }}>
              Edit Booking Details
            </Modal.Title>
            {/* <button className="btn" style={{marginLeft:'70px'}}>&#10006;</button> */}
          </Modal.Header>
          <Modal.Body>
            {/* Display details from selectedBooking in the modal */}
            <div className="row">
              <div className="col-lg-6">
                <p>
                  Name:
                  <input
                    type="text"
                    value={selectedBooking?.name || ""}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                  />
                </p>
                <p>
                  Check-in:
                  <input
                    type="text"
                    value={selectedBooking?.check_in || ""}
                    onChange={(e) =>
                      handleFieldChange("check_in", e.target.value)
                    }
                  />
                </p>
                <p>
                  Check-out:
                  <input
                    type="text"
                    value={selectedBooking?.check_out || ""}
                    onChange={(e) =>
                      handleFieldChange("check_out", e.target.value)
                    }
                  />
                </p>
                <p>
                  Total Days
                  <input
                    type="text"
                    value={`${selectedBooking?.length_of_stay || ""} ${
                      selectedBooking?.length_of_stay === 1 ? "days" : "day"
                    }`}
                    onChange={(e) =>
                      handleFieldChange("length_of_stay", e.target.value)
                    }
                  />
                </p>
              </div>
              <div className="col-lg-6">
                <p>
                  Guests:
                  <input
                    type="text"
                    value={`${selectedBooking?.adults || 0} Adults, ${
                      selectedBooking?.children || 0
                    } Children`}
                    onChange={(e) => {
                      const [adults, children] = e.target.value.split(",");
                      handleFieldChange("adults", adults.trim());
                      handleFieldChange("children", children.trim());
                    }}
                  />
                </p>
                <p>
                  Room Type:
                  <input
                    type="text"
                    value={selectedBooking?.room_type || ""}
                    onChange={(e) =>
                      handleFieldChange("room_type", e.target.value)
                    }
                  />
                </p>
                <p>
                  Total Rooms:
                  <input
                    type="text"
                    value={selectedBooking?.rooms || ""}
                    onChange={(e) => handleFieldChange("rooms", e.target.value)}
                  />
                </p>
                <p>
                  Total Price:
                  <input
                    type="text"
                    value={`Rs.${selectedBooking?.total_amount || ""}`}
                    onChange={(e) =>
                      handleFieldChange("total_amount", e.target.value)
                    }
                  />
                </p>
              </div>
            </div>
            {/* Add more editable fields as needed */}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => handleToggleModal({})}>
              Close
            </Button>
            <Button variant="primary">
              {/*  <= inside  onClick={handleUpdateBooking} */}
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};
const modalStyles = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#fff",
  padding: "20px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
  zIndex: "1000",
};

export default Home;

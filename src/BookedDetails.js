import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import "./css/BookedDetails.css"; // Import your CSS file for styling
import Footer from "./Footer";
import jsPDF from "jspdf";
import { BASE_URL } from "./baseUrl";

// import logo from './img/logo..png';
// import logo from './img/logo..png';
const BookedDetails = () => {
  const { bookingId } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch booking details when component mounts
    const fetchBookingDetails = async () => {
      try {
        console.log("Booking ID:", bookingId);

        const response = await fetch(
          `${BASE_URL}/api/bookings/${bookingId}`
        );
        if (response.ok) {
          const data = await response.json();
          setBookingDetails(data.bookingDetails);
        } else {
          console.error("Error fetching booking details:", response.statusText);
          setError("Error fetching booking details. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching booking details:", error.message);
        setError("Error fetching booking details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);


  const generatePDF = () => {
    if (!bookingDetails) return; // Check if bookingDetails is available

    const doc = new jsPDF();

    // Add background color to the header
    doc.setFillColor("white");
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 60, "F");

    // Add heading
    doc.setFontSize(24); // Increase font size for heading
    doc.setTextColor("#3498db"); // Heading color
    doc.text("Fabro Room Booking", doc.internal.pageSize.getWidth() / 2, 30, { align: "center" });
    doc.setFontSize(18); // Decrease font size for subheading
    doc.setTextColor("#333"); // Subheading color
    doc.text("Your Booking Details", doc.internal.pageSize.getWidth() / 2, 50, { align: "center" });

    // Add image
    const imgPath = "";
    doc.addImage(imgPath, "JPEG", 10, 10, 40, 40, "", "FAST", null, function (error) {
        // Error callback function
        console.error("Error displaying image:", error);
        // Add error message to the PDF
        doc.setTextColor("red"); // Set text color to red
        doc.setFontSize(12); // Set font size for error message
        doc.text("Error displaying image", 10, 60); // Add error message below the header
    });

    // Define vertical position for details
    let yPos = 70; // Adjust vertical position according to your layout and preference

    // Define the details as an array of objects
    const bookingInfo = [
        { label: "Name:", value: bookingDetails.name },
        { label: "Contact Number:", value: String(bookingDetails.number) },
        { label: "Booking Date:", value: bookingDetails.booking_date },
        { label: "Check In Date:", value: bookingDetails.check_in },
        { label: "Check Out Date:", value: bookingDetails.check_out },
        { label: "Total Days of Staying:", value: bookingDetails.length_of_stay },
        { label: "Your Reserved Rooms:", value: bookingDetails.room_type },
        { label: "Total Rooms:", value: `${bookingDetails.rooms} Room${bookingDetails.rooms === 1 ? "" : "s"}` },
        { label: "Guests:", value: `${bookingDetails.adults} Adults, ${bookingDetails.children} Children` },
        { label: "Total Amount:", value: `Rs.${bookingDetails.total_amount}` },
    ];

    // Add booking details to the PDF
    bookingInfo.forEach(({ label, value }) => {
        doc.setTextColor("#000"); // Label color
        doc.setFontSize(14); // Label font size

        if (label === "Name:") {
            // Add padding at the top for the "Name:" label
            yPos += 10; // Increase yPos for padding
        }

        doc.text(label, 20, yPos);

        doc.setTextColor("#333"); // Value color
        doc.setFontSize(12); // Value font size

        if (label === "Your Reserved Rooms:") {
            // Wrap text if it exceeds page width
            const splitText = doc.splitTextToSize(value, doc.internal.pageSize.getWidth() - 100); // Decreased width for room type value
            doc.text(splitText, 80, yPos, { align: "left" });
            yPos += doc.splitTextToSize(value, doc.internal.pageSize.getWidth() - 100).length * 10 + 5; // Increase vertical position based on text length
        } else {
            // For other labels, directly add text
            doc.text(value, 80, yPos, { align: "left" });
            yPos += 15; // Increase vertical position for the next label-value pair
        }
    });

    // Add border around the details section
    const detailsHeight = yPos - 70;
    doc.setDrawColor("#3498db"); // Border color
    doc.rect(10, 65, doc.internal.pageSize.getWidth() - 20, detailsHeight + 10); // Draw rectangle around details section

    // Save the PDF file
    doc.save("Fabro booking details.pdf");
};
  const handleDownloadDetails = () => {
    generatePDF();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!bookingDetails) {
    return <div className="no-details">No booking details found</div>;
  }


  return (
    <div className="booked-details">

      <Header />       {/*  <img src={logo} width='191px' alt="" />
 */}
      <center>
        <div className="details-container">
          <h1 className="details-heading">Your Booking Details 
           <i style={{marginLeft:'133px',cursor:'pointer'}} title="Download Your Booking Details" onClick={handleDownloadDetails} className="bi bi-download "></i></h1>
           <p  /* title="Download Your Booking Details" */ onClick={handleDownloadDetails} style={{marginLeft:'92%',marginTop:'-25px',color:'#3498db',fontSize:'14px',cursor:'pointer'}}>Download</p>
         
          <div className="booking-info">
            <div className="info-row">
              <p className="label">Name:</p>
              <p className="value">{bookingDetails.name}</p>
            </div>
  <div className="info-row">
              <p className="label">Contact Number:</p>
              <p className="value">{bookingDetails.number}</p>
            </div>

            <div className="info-row">
              <p className="label">Booking Date:</p>
              <p className="value">{bookingDetails.booking_date}</p>
            </div>

             {/* <div className="info-row">
              <p className="label">Travel For Work:</p>
              <p className="value">{bookingDetails.travel_for_work}</p>
            </div> */}

             <div className="info-row">
              <p className="label">Check In Date:</p>
              <p className="value">{bookingDetails.check_in}</p>
            </div>

            <div className="info-row">
              <p className="label">Check Out Date:</p>
              <p className="value">{bookingDetails.check_out}</p>
            </div>


            <div className="info-row">
              <p className="label">Total Days of Staying:</p>
              <p className="value">{bookingDetails.length_of_stay}</p>
            </div>

          
            
            <div className="info-row">
              <p className="label">Your Reserved Rooms</p>
              <p className="value">
                {bookingDetails.room_type} 
              </p>
            </div>

            

            {/*   <div className="info-row">
    <p className="label">Children:</p>
    <p className="value">{bookingDetails.children}</p>
  </div> */}

            <div className="info-row">
              <p className="label">Total Rooms:</p>
              <p className="value">{bookingDetails.rooms} Room{bookingDetails.rooms===1?'':"s"}</p>
            </div>

           

            <div className="info-row">
              <p className="label">Guests:</p>
              <p className="value">
                {bookingDetails.adults} Adults,{bookingDetails.children}{" "}
                Children
              </p>
            </div>




            <div className="info-row">
              <p className="label">Total Amount:</p>
              <p className="value">Rs.{bookingDetails.total_amount}</p>
            </div>
          </div>
         
        </div>
      </center>
      <Footer />
    </div>
  );
};

export default BookedDetails;

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { BASE_URL } from "./baseUrl";

const RoomDetails = ({ roomDetails }) => {
  const [details, setDetails] = useState(roomDetails);
  const [currentPage, setCurrentPage] = useState(1);
  const [detailsPerPage] = useState(10);

  // Logic for pagination
  const indexOfLastDetail = currentPage * detailsPerPage;
  const indexOfFirstDetail = indexOfLastDetail - detailsPerPage;
  const currentDetails = details.slice(indexOfFirstDetail, indexOfLastDetail);

  const handleCancelRoom = async (bookingId, index) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/booking/${bookingId}/cancellationStatus`);
      const cancellationStatus = response.data.cancellation;
  
      if (cancellationStatus === 'cancelled') {
        // If already cancelled, show a message
        Swal.fire('Cancelled!', 'This room booking has already been cancelled.', 'info');
      } else {
        // Show confirmation dialog
        Swal.fire({
          title: 'Are you sure?',
          text: 'You will not be able to recover this booking!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, cancel it!',
          timer: 5000, // Timer in milliseconds (5 seconds)
          timerProgressBar: true, // Show timer progress bar
        }).then(async (result) => {
          if (result.isConfirmed) {
            // User confirmed cancellation
            const cancelResponse = await axios.put(`${BASE_URL}/api/cancel/${bookingId}/cancel`);
            if (cancelResponse.status === 200) {
              // Booking cancelled successfully
              Swal.fire({
                title: 'Cancelled!',
                text: 'Your room booking has been cancelled.',
                icon: 'success',
                timer: 3000, // Timer in milliseconds (5 seconds)
                timerProgressBar: true, // Show timer progress bar
              });
              // Update UI by changing row background color and button text
              const updatedDetails = [...details];
              updatedDetails[index].cancellation = 'cancelled';
              setDetails(updatedDetails);
            }
          }
        });
      }
    } catch (error) {
      console.error('Failed to cancel room booking:', error);
      Swal.fire('Error!', 'Failed to cancel room booking. Please try again later.', 'error');
    }
  };

  // Function to format date in the specified format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toDateString();
  };

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // window.scrollTo(0, 0); // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });

  };

  // Logic for displaying page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(details.length / detailsPerPage); i++) {
    pageNumbers.push(i);
  }

  const isToday = (dateString) => {
    const today = new Date();
    const checkoutDate = new Date(dateString);
    // Get the start of today
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    // Get the start of tomorrow
    const startOfTomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    return checkoutDate >= startOfToday && checkoutDate < startOfTomorrow;
  };


  const isPastDate = (dateString) => {
    const today = new Date();
    const checkoutDate = new Date(dateString);
    // Get the start of today
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return checkoutDate < startOfToday;
  };
  return (
    <div style={styles.container}>
      <h3  style={styles.heading}>Your Booking Details</h3>
      <table className='mt-3' style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>S.No</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Number</th>
            <th style={styles.th}>Room Type</th>
            <th style={styles.th}>Booking Date</th>
            <th style={styles.th}>Check-in</th>
            <th style={styles.th}>Check-out</th>
            <th style={styles.th}>Total Days</th>
            <th style={styles.th}>Guests</th>
            <th style={styles.th}>Total Price</th>
            <th style={styles.th}>Cancellation</th> {/* Added this column */}
          </tr>
        </thead>
        <tbody>
        {currentDetails.map((detail, index) => (
  <tr key={index} style={{ backgroundColor: detail.cancellation === 'cancelled' ? '#ffcccc' : 'inherit' }}>
    <td style={styles.td}>{indexOfFirstDetail + index + 1}</td>
    <td style={styles.td}>{detail.name}</td>
    <td style={styles.td}>{detail.number}</td>
    <td style={styles.td}>{detail.room_type}</td>
    <td style={styles.td}>{formatDate(detail.booking_date)}</td>
    <td style={styles.td}>{formatDate(detail.check_in)}</td>
    <td style={styles.td}>{formatDate(detail.check_out)}</td>
    <td style={styles.td}>{detail.length_of_stay}</td>
    <td style={styles.td}>{`${detail.adults} Adults, ${detail.children} Children`}</td>
    <td style={styles.td}>Rs.{detail.total_amount}</td>
    <td style={styles.td}>
      {detail.cancellation === 'cancelled' ? (
        <span style={{ color: 'red' }}>Cancelled</span>
      ) : (
        <button 
          className={`btn btn-danger ${isPastDate(detail.check_out) && !isToday(detail.check_out) ? 'disabled' : ''}`} 
          onClick={() => handleCancelRoom(detail.id, index)} 
          disabled={isPastDate(detail.check_out) && !isToday(detail.check_out)}
        >
          {detail.cancellation ? "Cancelled" : "Cancel Room"}
        </button>
      )}
    </td>
  </tr>
))}
        </tbody>
      </table>
      
      {/* Pagination */}
     
      <div style={{ display: 'flex', justifyContent: 'center' }}>
  <ul className="pagination">
    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
      <button onClick={() => paginate(currentPage - 1)} className="page-link">
        &laquo;
      </button>
    </li>
    {pageNumbers.map((number) => (
      <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
        <button onClick={() => paginate(number)} className="page-link">
          {number}
        </button>
      </li>
    ))}
    <li className={`page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
      <button onClick={() => paginate(currentPage + 1)} className="page-link">
      &raquo;
      </button>
    </li>
  </ul>
</div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '100%', // Adjust to fit your page width
    overflowX: 'auto', // Enable horizontal scrolling if needed
    marginBottom: '20px', // Add some spacing at the bottom
  },
  heading: {
    marginBottom: '20px',
    color: '#333',
    textAlign: 'center', // Center the heading
  },
  table: {
    width: '90%', // Reduce table width to 90% of the container
    margin: '0 auto', // Center the table horizontally
    borderCollapse: 'collapse',
    border: '1px solid #ddd', // Adjust border color
    fontFamily: 'calibri',
    marginBottom: '50px'
  },
  th: {
    backgroundColor: '#f2f2f2',
    padding: '8px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
    borderRight: '1px solid #ddd',
  },
  td: {
    padding: '8px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
    borderRight: '1px solid #ddd',
  },
};

export default RoomDetails;
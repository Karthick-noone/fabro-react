import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import { updateCartCount } from "./Header";
import { Link } from "react-router-dom";
import "./css/nice-select.css";
import "./css/bootstrap.min.css";
import cart from "./img/cart2.png";

const Cart = () => {
  const navigate = useNavigate();
  const [selectedRooms, setSelectedRooms] = useState([]);

  useEffect(() => {
    const storedRooms = JSON.parse(localStorage.getItem("selectedRooms")) || [];
    setSelectedRooms(storedRooms);
  }, []);

  const deleteRoom = (roomTypeToDelete) => {
    const updatedRooms = selectedRooms.filter(
      (room) => room.roomType !== roomTypeToDelete
    );
    setSelectedRooms(updatedRooms);
    localStorage.setItem("selectedRooms", JSON.stringify(updatedRooms));
    updateCartCount();
  };

  const onReserveButtonClick = (event) => {
    event.preventDefault();

    const storedRoomDetails = JSON.parse(
      localStorage.getItem("selectedRoomDetails")
    );
    const storedRoomCount = storedRoomDetails?.guests?.rooms || 0;

    const selectedRoomCount = selectedRooms.reduce(
      (total, room) => total + room.roomCount,
      0
    );

    if (selectedRoomCount === storedRoomCount) {
      navigate("/Booking");
      document.getElementById("errorMessage").innerText = "";
    } else if (storedRoomCount === 0) {
      const errorMessage = "You did not select any room. Please go to Home and select Rooms and guest details.";
      document.getElementById("errorMessage").innerText = errorMessage;
      setTimeout(() => {
          document.getElementById("errorMessage").innerText = "";
      });
    } else {
      const errorMessage = `Please select the correct number of rooms to proceed with the reservation. 
          You previously selected ${storedRoomCount} room${
          storedRoomCount === 1 ? "" : "s"
      }. Go back home and select the correct number of rooms.`;
      document.getElementById("errorMessage").innerText = errorMessage;
      

      setTimeout(() => {
          document.getElementById("errorMessage").innerText = "";
      }, 8000);
    }
  };

  const calculateTotalPrice = () => {
    return selectedRooms.reduce(
      (total, room) => total + (room.price + 120) * room.roomCount ,
      0
    );
  };

  if (selectedRooms.length === 0) {
    return (
      <div  style={{ overflow: "hidden" }}>
        <Header />
        <center>
          <div style={styles.body}>
            <div style={{ textAlign: "center", display: "flex" }}>
              <b
                style={{
                  background: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "16px",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.9)",
                  width: "40%",
                  height: "140px",
                  marginTop: "19%",
                  marginBottom: "20px",
                }}
                className="para"
              >
                <span>Your cart is empty! Explore our rooms and add some to your cart.</span><br />
                <Link to={'/Rooms'}><button className="btn btn-primary mt-3">Add Rooms In Your Cart</button></Link>
              </b>  
              <img src={cart} alt="Your Cart is Empty" style={styles.img} />
            </div>
          </div>
        </center>
        <div className="">
        <Footer /></div>
      </div>
    );
  }
  
  return (
    <div>
      <center>
        <Header />
        <div style={styles.body}>
          <h2 style={styles.h2}>Your Cart</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Room Type</th>
                <th style={styles.th}>No. Of Rooms</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Cancel Room</th>
              </tr>
            </thead>
            <tbody>
              {selectedRooms.map((room, index) => (
                <tr key={index}>
                  <td style={styles.td}>{room.roomType}</td>
                  <td style={styles.td}>{room.roomCount}</td>
                  <td style={styles.td}>Rs.{room.roomCount * room.price}</td>
                  <td style={styles.td}>
                    <button
                      style={styles.tdButton}
                      onClick={() => deleteRoom(room.roomType)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="4" style={{ textAlign: "right", padding: "10px" }}>
                  <strong className="price">
                    Total Price (incl. tax): RS.{calculateTotalPrice()}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
          <Link to="/Booking">
            <button
              className="btn btn-success mb-5"
              id="reserveButton"
              onClick={onReserveButtonClick}
              style={styles.reserveButton}
            >
              Reserve Your Room
            </button>
          </Link>
          <div id="errorMessage" style={styles.errorMessage}></div>
        </div>
      </center>
      <div className="">
        <Footer />
      </div>
    </div>
  );
};

const styles = {
  roomCard: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "5px",
    marginTop: "10px",
    justifyContent: "space-between",
    alignItems: "center",
    width: "200px",
    marginLeft: "-25px",
    backgroundColor: "rgb(242, 240, 240)",
  },
  h2: {
    textAlign: "center",
    marginTop: "10px",
  },
  body: {
    width: "70%",
    minHeight:'79vh',
  },
  roomDetails: {
    flex: 1,
    color: "white",
  },
  roomDetailsP: {
    margin: "0",
  },
  quitSymbol: {
    cursor: "pointer",
    color: "red",
    fontSize

: "20px",
    float: "right",
  },
  breadcrumbText: {
    marginLeft: "180px",
  },
  selectedRoomDisplay: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
  },
  table: {
    borderCollapse: "collapse",
    marginTop: "20px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
    width: "100%",
  },
  th: {
    padding: "12px",
    textAlign: "center",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#f2f2f2",
    borderRight: "1px solid #ddd",
  },
  td: {
    padding: "12px",
    textAlign: "center",
    borderBottom: "1px solid #ddd",
    borderRight: "1px solid #ddd",
  },
  tdButton: {
    padding: "6px 12px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  reserveButton: {
    marginTop:'10px'
  },
  errorMessage: {
    color: "red",
    marginTop: "12px",
    textAlign: "center",
  },
  img: {
    width: "50%",
    height: "50%",
    marginLeft: "10%",
    filter: 'drop-shadow(14px 6px 8px rgba(0, 0, 0, 0.7))',
    marginTop:'-15px'
  },
};

export default Cart;
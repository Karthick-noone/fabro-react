import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./css/bootstrap.min.css";
import logo from "./img/logo.png";
import back from "./img/back.png";
import menp from "./img/categories.png";
import './css/App.css';
export const updateCartCount = () => {
  const selectedRooms = JSON.parse(localStorage.getItem("selectedRooms")) || [];
  const cartCountBadge = document.getElementById("cartCountBadge");
  const mobileCartCountBadge = document.getElementById("mobileCartCountBadge"); // Add this line to target the badge in mobile view

  // Calculate the total number of selected rooms
  const totalRooms = selectedRooms.reduce(
    (total, room) => total + room.roomCount,
    0
  );
  // Update the cart count badge
  if (cartCountBadge) {
    cartCountBadge.textContent = totalRooms.toString();
  }

  if (mobileCartCountBadge) {
    mobileCartCountBadge.textContent = totalRooms.toString(); // Update the badge in mobile view
  }
};
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    updateCartCount();
  }, []);
  const [activeLink, setActiveLink] = useState("Home"); // Default active link is 'Home'
  // const [openLink, setOpenLink] = useState(false); // Default active link is 'Home'
  // Function to handle link click and update the active link
  const handleLinkClick = (link) => {
    setActiveLink(link);
  };
  // Function to go back to the previous page
  const goBack = () => {
    navigate(-1);
  };
  // Update active link when location changes
  useEffect(() => {
    const pathname = location.pathname.substring(1); // Remove leading "/"
    setActiveLink(pathname || "Home"); // If pathname is empty (e.g., on the homepage), set active link to "Home"
  }, [location.pathname]);
  // Constants for styles
  const headerSectionStyle = {
    borderBottom: "1px solid darkgray",
  };
  const iconStyle = {
    fontSize: "25px",
  };
  const cartBadgeStyle = {
    position: "absolute",
    top: "12px",
    // right:'1%',
    color: "#d47a39 ",/* crimson */ /* #db7932*/
    padding: "1px 1px",
    fontSize: "15px",
  };
  const backButtonStyle = {
    marginLeft: "10px",
    cursor: "pointer",
    fontWeight: "500",
    textColor: "black",
    display: location.pathname === "/" ? "none" : "block",
  };
  const menbutn = () => {
    const menu = document.getElementById("menpid");
    if (menu.style.display === "none") {
      menu.style.display = "block";
    } else {
      menu.style.display = "none";
    }
  };
  return (
    <div>
      <header className="header-section" style={headerSectionStyle}>
        <div className="menu-item">
          <div className="container">
            <div className="row">
              <div className="col-lg-2">
                <div className="logo">
                  <Link to="/">
                    <img src={logo} alt="Description" />
                  </Link>
                </div>
              </div>
              <div className="col-lg-10">
                <div className="nav-menu">
                  <nav className="mainmenu">
                    <ul>
                      <li className={activeLink === "Home" ? "active" : ""}>
                        <Link to="/" onClick={() => handleLinkClick("Home")}>
                          Home
                        </Link>
                      </li>
                      <li className={activeLink === "Rooms" ? "active" : ""}>
                        <Link
                          to="/Rooms"
                          onClick={() => handleLinkClick("Rooms")}
                        >
                          Rooms
                        </Link>
                      </li>
                      <li id="cartIcon" className={activeLink === "Cart" ? "active" : ""}>
                        <Link
                          to="/Cart"
                          onClick={() => handleLinkClick("Cart")}
                        >
                          <span>Cart</span>
                          <i
                            className="fa fa-shopping-cart icon"
                            style={iconStyle}
                          ></i>
                          <span id="cartCountBadge" style={cartBadgeStyle}>
                            0
                          </span>
                        </Link>
                      </li>
                      
                      <li className={activeLink === "MyBooking" ? "active" : ""}>
                        <Link
                          to="/MyBooking"
                          onClick={() => handleLinkClick("MyBooking")}
                        >
                          My Booking
                        </Link>
                      </li>
                      <li className={activeLink === "Contact" ? "active" : ""}>
                        <Link
                          to="/Contact"
                          onClick={() => handleLinkClick("Contact")}
                        >
                          Contact
                        </Link>
                      </li>
                   
                      <li>
                     
                      </li>
                      {window.history.length > 1 && (
                        <li>
                          <span onClick={goBack} style={backButtonStyle}>
                            Back{" "}
                            <img
                              src={back}
                              style={{ width: "20px", height: "20px" }}
                              alt=""
                            />
                          </span>
                        </li>
                      )}
                    </ul>
                  </nav> 
                </div>
                        <div>
                       <img onClick={menbutn} src={menp} alt="menu" className="menp" />
                        </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="nav-menu off" id="menpid" style={{display:'none'}}>
                  <nav className="mainmenu">
                    <ul  style={{width:'42%',marginLeft:'58%',listStyle: 'none',background: 'linear-gradient(to right,rgb(1110,1125,1144),rgb(110,125,144)',border:'1px solid gray',zIndex:'1000',position:'absolute'}} >
                      <li style={{margin:'10px'}} className={activeLink === "Home" ? "active" : ""}>
                        <Link className="text-dark" to="/" onClick={() => handleLinkClick("Home")}>
                          Home
                        </Link>
                      </li>
                      <li style={{margin:'10px'}} className={activeLink === "Rooms" ? "active" : ""}>
                        <Link className="text-dark"
                          to="/Rooms"
                          onClick={() => handleLinkClick("Rooms")}
                        >
                          Rooms
                        </Link>
                      </li>
                      <li id="cartIcon" style={{margin:'10px'}} className={activeLink === "Cart" ? "active" : ""}>
                        <Link className="text-dark"
                          to="/Cart"
                          onClick={() => handleLinkClick("Cart")}
                        >
                          <span>Cart</span>
                          <i
                            className="fa fa-shopping-cart icon"
                            style={iconStyle}
                          ></i>
                          <span id="mobileCartCountBadge" style={{marginTop:'-20px',marginLeft:'5px', color:'#d47a39'}}>
                            0
                          </span>
                          
                        </Link>
                      </li>
                      
                      <li style={{margin:'10px'}}  className={activeLink === "MyBooking" ? "active" : ""}>
                        <Link className="text-dark"
                          to="/MyBooking"
                          onClick={() => handleLinkClick("MyBooking")}
                        >
                          My Booking
                        </Link>
                      </li>
                      <li style={{margin:'10px'}} className={activeLink === "Contact" ? "active" : ""}>
                        <Link className="text-dark"
                          to="/Contact"
                          onClick={() => handleLinkClick("Contact")}
                        >
                          Contact
                        </Link>
                      </li>
                  
                      {window.history.length > 1 && (
                        <li style={{margin:'10px',marginLeft:'-1px'}} >
                        <span onClick={goBack} style={backButtonStyle}>
                          Back{" "}
                          <img
                            src={back}
                            style={{ width: "20px", height: "20px",marginRight:'70%' }}
                            alt=""
                          />
                        </span>
                      </li>
                      )}
                    </ul>
                  </nav> 
                </div>
    </div>
  );
};
export default Header;
import React from "react";
import "./css/SidebarStyles.css";
import Dropdown from "react-bootstrap/Dropdown";
import logo from "./img/logo..png";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, onCloseSidebar }) => {
  const handleDropdownSelect = (eventKey, event) => {
    // Add logic to handle dropdown item selection if needed
    console.log(`Selected dropdown item: ${eventKey}`);
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="row">
        <div className="col-lg-10" style={{marginLeft:'-30px'}}>
          <Link to={"/Admin"}>
            {" "}
            <img className="logoo" width={'100px'} src={logo} alt="" />
          </Link>
        </div>
        <div className="col-lg-2" style={{marginLeft:'30px'}}>
          <button className="close-button" onClick={onCloseSidebar}>
            &#10006;
          </button>
        </div>
      </div>
      <ul className="nav nav-pills flex-column" style={{ marginTop: "100px" }}>
        <Dropdown onSelect={handleDropdownSelect}>
          <Dropdown.Toggle variant="info" id="user-dropdown">
            <i className="bi bi-image"></i> Image Uploads
          </Dropdown.Toggle>
          <Dropdown.Menu className="custom-dropdown-menu">
            {/* <Dropdown.Item eventKey="option1" className="text-center">
            <Link to={"/Admin/HomePageGallery"}> <span className="text-light">Home Page </span></Link>
            </Dropdown.Item> */}
            <Dropdown.Item eventKey="option1" className="text-center">
            <Link to={"/Admin/PremiumroomGallery"}> <span className="text-light">Premium Gallery </span></Link>
            </Dropdown.Item>
            <Dropdown.Item eventKey="option2" className="text-center">
            <Link to={"/Admin/DeluxeroomGallery"}> <span className="text-light">Deluxe Gallery </span></Link>
            </Dropdown.Item>
            <Dropdown.Item eventKey="option3" className="text-center">
            <Link to={"/Admin/DoubleroomGallery"}><span className="text-light">Double Gallery </span></Link>
              </Dropdown.Item>
             <Dropdown.Item eventKey="option3" className="text-center">
              <Link to={"/Admin/LuxuryroomGallery"}> <span className="text-light">Luxury Gallery </span></Link>
            </Dropdown.Item>
            <Dropdown.Item eventKey="option3" className="text-center">
           <Link to={"/Admin/SingleroomGallery"}> <span className="text-light">Single Gallery </span></Link>
            </Dropdown.Item>
          <Dropdown.Item eventKey="option3" className="text-center">
             <Link to={"/Admin/SmallroomGallery"}> <span className="text-light">Small Gallery </span></Link>
            </Dropdown.Item>
          <Dropdown.Item eventKey="option3" className="text-center">
             <Link to={"/Admin/CoverimagesGallery"}> <span className="text-light">Rooms Cover Images</span></Link>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown>
          <Dropdown.Toggle variant="info" id="dropdown-basic">
            <i className="bi bi-cast"></i> Room Booking
          </Dropdown.Toggle>
          <Dropdown.Menu className="custom-dropdown-menu">
            <Dropdown.Item href="#action/1" className="text-center">
            <Link to={"/Admin/BookingForm"}><span className="text-light">Book Now</span></Link>
            </Dropdown.Item>
            
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown>
          <Dropdown.Toggle variant="info" id="dropdown-basic">
            <i className="bi bi-table"></i> Room Availablility
          </Dropdown.Toggle>
          <Dropdown.Menu className="custom-dropdown-menu">
          <Dropdown.Item href="#action/1" className="text-center">
            <Link to={"/Admin/BookingForm"}><span className="text-light">Check Available Rooms</span></Link>
            </Dropdown.Item>
            
          </Dropdown.Menu>
        </Dropdown>

        {/* <Dropdown>
          <Dropdown.Toggle variant="info" id="dropdown-basic">
            <i className="bi bi-grid"></i> Reports
          </Dropdown.Toggle>
          <Dropdown.Menu className="custom-dropdown-menu">
            <Dropdown.Item href="#action/1" className="text-center">
              Option 1
            </Dropdown.Item>
            <Dropdown.Item href="#action/2" className="text-center">
              Option 2
            </Dropdown.Item>
            <Dropdown.Item href="#action/3" className="text-center">
              Option 3
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown> */}

       

        {/* <Dropdown>
          <Dropdown.Toggle variant="info" id="dropdown-basic">
            <i className="bi bi-credit-card"></i>Payments
          </Dropdown.Toggle>
          <Dropdown.Menu className="custom-dropdown-menu">
            <Dropdown.Item href="#action/1" className="text-center">
              Option 1
            </Dropdown.Item>
            <Dropdown.Item href="#action/2" className="text-center">
              Option 2
            </Dropdown.Item>
            <Dropdown.Item href="#action/3" className="text-center">
              Option 3
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown> */}
      </ul>
    </div>
  );
};

export default Sidebar;

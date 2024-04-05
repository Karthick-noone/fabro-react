import React, { useState, useEffect } from "react";
import icon from "./img/Icon7.png";
import logo from "./img/logo..png";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./css/SidebarStyles.css";
import Dropdown from "react-bootstrap/Dropdown";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ onToggleSidebar }) => {
  const [isHovered, setIsHovered] = useState(false);

  const [adminName, setAdminName] = useState("Admin"); // Default to "Admin" if name is not fetched
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch admin name from the server
    fetchAdminName();
  }, []);

  const fetchAdminName = async () => {
    try {
      const response = await fetch("/api/adminName");
      if (response.ok) {
        const data = await response.json();
        setAdminName(data.name);
      } else {
        console.error("Failed to fetch admin name:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to fetch admin name:", error);
    }
  };

  const handleLogout = () => {
    // Remove the information about the user being logged in
    localStorage.removeItem('isLoggedIn');
    // Redirect to the login page
    navigate('/Admin/Login');
  };

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <div>
      <nav
        className="navbar border-bottom navbar-expand-lg p-1"
        style={{ backgroundColor: "#FFB0B0" }}
      >
        <div className="container" style={{ marginLeft: "10px" }}>
          <img onClick={onToggleSidebar} src={icon} alt="" />
          <Link to={"/Admin"}>
            <img className="logo ml-2" src={logo} alt="" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={onToggleSidebar}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul
              className="navbar-nav ml-auto"
              style={{ marginRight: "-150px" }}
            >
              {isLoggedIn ? (
                <li className="nav-item mt-2">
                  <Dropdown>
                    <Dropdown.Toggle variant="" id="dropdown-basic">
                    {adminName ? <><i className="bi bi-person-fill "></i> Welcome {adminName.charAt(0).toUpperCase() + adminName.slice(1)}</> : <><i className="bi bi-gear "></i> Settings</>}

                    </Dropdown.Toggle>
                    <Dropdown.Menu className="custom-dropdown-menu">
                      <Dropdown.Item
                        className="text-left"
                        style={{ paddingLeft: '1px', paddingRight: '18px', backgroundColor: isHovered ? '#3498db' : 'transparent' }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        <Link to={"/Admin/changepassword"} className="text-light ml-3">
                          Change Password
                        </Link>
                      </Dropdown.Item>
                      <Dropdown.Item
                        href="#action/2"
                        className="text-center text-light"
                        onClick={handleLogout}
                      >
                        <Link to={"/Admin/login"} className="text-light " >
                          Logout
                        </Link>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
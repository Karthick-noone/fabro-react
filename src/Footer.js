import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div>
      <footer className="footer-section">
        <div className="copyright-option">
          <div className="container">
            <div className="row">
              <div className="col-lg-7">
                <ul>
                  <li><Link to='/TermsPage'>Privacy policy</Link></li>
                  <li><Link to='/Admin/Login'><button className="btn btn-light">Admin</button></Link></li>
                </ul>
              </div>
              <div className="col-lg-5">
                <div className="co-text">
                  <p>
                    Copyright &copy; {currentYear} | All rights reserved  by FABRO ROOMS 
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
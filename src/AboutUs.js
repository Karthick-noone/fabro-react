import React from 'react';
import logo1 from './img/about/1.jpg';
import logo2 from './img/about/about-2.jpg';
import logo3 from './img/about/2.jpg';
import logo4 from './img/about/about-1.jpg';
const AboutUs = () => {
    return (
      <div>
  
        {/* About Us Section Begin */}
        <section className="aboutus-section spad">
          <div className="container">
            <div className="row">
              <div className="col-lg-3">
                <div className="about-pic">
                  <div className="row">
                  <div className="col-sm-6">
                  <img src={logo1} alt="Description" />
              </div>
              <div className="col-sm-6">
              <img src={logo2} alt="Description" />
              </div>
              <div className="col-sm-6 mt-5">
              <img src={logo3} alt="Description" />
              </div>
              <div className="col-sm-6 mt-5">
              <img src={logo4} alt="Description" />
              </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-8">
                <div className="about-text">
                  <div className="section-title">
                    <span>About Us</span>
                    <h2>Intercontinental LA <br />FABRO Rooms</h2>
                  </div>
                  <p className="f-para">
                    FABRO.com is a leading online accommodation site. We’re passionate
                    about travel. Every day, we inspire and reach millions of travelers
                    across 90 local websites in 41 languages.
                  </p>
                  <p className="s-para">
                    So when it comes to booking the perfect hotel, vacation rental,
                    resort, apartment, guest house, or tree house, we’ve got you covered.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* About Us Section End */}
      </div>
    );
  };
  
  export default AboutUs;
  
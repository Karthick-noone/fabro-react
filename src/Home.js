// Home.js
import React from 'react';
import Header from './Header';
import AboutUs from './AboutUs';
import BookingForm from './BookingForm'; 
import Footer from './Footer';
// import Swiper from './Swiper'; 


const Home = () => {
  return (
    <div>
      <Header />
 
          <BookingForm /> {/* Use the BookingForm component here */}
      <br />
      <AboutUs />
     {/* <Swiper /> */}
     

<Footer />
    </div>
  );
};

export default Home;
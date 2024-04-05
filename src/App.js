// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Rooms from './Room';
import Cart from './Cart';
import Contact from './Contact';
import Preloader from './Preloader';
import Booking from './Booking';
import TermsPage from './TermsPage';
import BookedDetails from './BookedDetails'; 
import RoomDetailsPage from './RoomDetailsPage'; 
import Premium from './Premium'; 
import Deluxe from './Deluxe'; 
import Double from './Double'; 
import Luxury from './Luxury'; 
import Single from './Single'; 
import MyBooking from './MyBooking'; 
import Small from './Small'; 
import AdminMain from './admin/AdminMain'; 


const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Rooms" element={<Rooms />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/Preloader" element={<Preloader />} />
          <Route path="/Booking" element={<Booking />} />
          <Route path="/TermsPage" element={<TermsPage />} />
          <Route path="/premium-room" element={<Premium />} />
          <Route path="/deluxe-room" element={<Deluxe />} />
          <Route path="/double-room" element={<Double />} />
          <Route path="/luxury-room" element={<Luxury />} />
          <Route path="/single-room" element={<Single />} />
          <Route path="/MyBooking" element={<MyBooking />} />
          <Route path="/small-room" element={<Small />} />
          <Route path="/small-room" element={<Small />} />
          <Route path="/bookings/:bookingId" element={<BookedDetails />} />
          {/* Admin  */}
          <Route path="/Admin/*" element={<AdminMain />} />
          <Route path="/room-details" element={<RoomDetailsPage />} />


          {/* Add the route for BookedDetails with dynamic bookingId */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
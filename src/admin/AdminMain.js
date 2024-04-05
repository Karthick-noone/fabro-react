// AdminMain.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Admin from './Admin';
import AdminPass from './AdminPass';
import Login from './Login'; 
import AddImage from './AddImage'; 
import AddCoverImages from './AddCoverImages'; 
import PremiumGallery from './PremiumGallery'; 
import DeluxeGallery from './DeluxeGallery'; 
import DoubleGallery from './DoubleGallery'; 
import LuxuryGallery from './LuxuryGallery'; 
import SingleGallery from './SingleGallery'; 
import SmallGallery from './SmallGallery'; 
import DeleteImage from './DeleteImage';
import HomePageImage from './HomePageImage';
import BookingForm from './BookingForm';
import Form from './Form';
import CoverImages from './RoomGalleryCoverImages';
import EditImage from './EditImage';
import EditCoverImages from './EditCoverImages';


const AdminMain = () => {
  return (
    <Routes>
      <Route path="/" element={<Admin />} />
      <Route path="/ChangePassword" element={<AdminPass />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/AddImages" element={<AddImage />} />
      <Route path="/AddCoverImages" element={<AddCoverImages />} />
      <Route path="/PremiumroomGallery" element={<PremiumGallery />} />
      <Route path="/DeluxeroomGallery" element={<DeluxeGallery />} />
      <Route path="/DoubleroomGallery" element={<DoubleGallery />} />
      <Route path="/LuxuryroomGallery" element={<LuxuryGallery />} />
      <Route path="/SingleroomGallery" element={<SingleGallery />} />
      <Route path="/SmallroomGallery" element={<SmallGallery />} />
      <Route path="/DeleteImage" element={<DeleteImage />} />
      <Route path="/HomePageGallery" element={<HomePageImage />} />
      <Route path="/BookingForm" element={<BookingForm />} />
      <Route path="/Form" element={<Form />} />
      <Route path="/CoverimagesGallery" element={<CoverImages />} />
      <Route path="/EditImage/:imageUrl" element={<EditImage />} />
      <Route path="/EditCoverImages/:imageName" element={<EditCoverImages />} />
    </Routes>
  );
};

export default AdminMain;

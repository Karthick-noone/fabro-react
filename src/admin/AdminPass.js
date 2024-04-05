import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ChangePassword from './ChangePassword';

const Admin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div>
      <Navbar onToggleSidebar={handleToggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onCloseSidebar={handleCloseSidebar} />
      <ChangePassword />
    </div>
  );
};

export default Admin;

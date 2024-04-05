import React from 'react';

const Preloader = () => {
  return (
    <div className="preloader">
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <p className="loading-text">Sending Message...</p>
    </div>
  );
};

export default Preloader;

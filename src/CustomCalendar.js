import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CustomCalendar = (props) => {
  return (
    <div className="custom-calendar">
      <Calendar {...props} />
    </div>
  );
};

export default CustomCalendar;

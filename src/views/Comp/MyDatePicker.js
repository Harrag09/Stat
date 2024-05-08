// MyDatePicker.js
import React, { useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./dt.css";

const MyDatePicker = ({ onDateSelection }) => {
  const [selectedDate, setSelectedDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection"
    }
  ]);
  

  const handleSelect = (ranges) => {
    setSelectedDate([ranges.selection]);
    onDateSelection(ranges.selection); 
  };

  return (
    <div style={{ textAlign: "center" }}>
      <DateRangePicker
        ranges={selectedDate}
        onChange={handleSelect}
        showSelectionPreview={false}
        moveRangeOnFirstSelection={false}
        direction="vertical"
        showMonthAndYearPickers={true}
        className="custom-date-picker"
      />
    </div>
  );
};

export default MyDatePicker;

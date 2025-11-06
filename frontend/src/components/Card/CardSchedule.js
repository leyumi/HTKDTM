import React from "react";
import "./CardSchedule.css";

const CardSchedule = ({ time, label, title }) => {
  return (
    <div className="schedule-card">
      <div className="schedule-time">{time}</div>
      <div className="schedule-divider"></div>
      <div className="schedule-content">
        <div className="schedule-label fs-6">{label}</div>
        <div className="schedule-title fs-6">{title}</div>
      </div>
    </div>
  );
};

export default CardSchedule;

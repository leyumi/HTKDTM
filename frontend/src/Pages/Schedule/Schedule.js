import React from "react";
import "./Schedule.css";
import Header from "../../layouts/Header/Header";
import TableSchedule from "../../components/Table/TableSchedule";

const Schedule = () => {
  return (
    // <div className={`Schedule`}>
    //   <h1>Đây là Component Schedule</h1>
    // </div>
    <div className="schedule">
      <Header 
        username="HuongPTA" 
        title="Lịch học"   
      >
      </Header>
      {/* Nội dung khác */}
      <div className="main-schedule container-fluid p-4">
      <div className="d-flex align-items-center mb-3 mx-3">
        <h5 className="me-2">Tuần</h5>
        <input 
          className="form-control form-control-sm custom-input" 
          type="text" 
          placeholder="Chọn tuần..." 
          readOnly
        />
      </div>
        <TableSchedule/>
      </div>
    </div>
  );
};

export default Schedule;

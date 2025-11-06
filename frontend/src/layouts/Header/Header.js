import React, { Children } from "react";
import "./Header.css";

const Header = ({ username, title, middleContent }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="header container-fluid p-3 bg-white shadow-sm">
      <div className="row align-items-center">
        {/* Phần "Welcome Back" */}
        <div className="col-md-3 text-start">
          <h5 className="mb-0 fw-bolder">{title}</h5>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="col-md-5">{middleContent}</div>

        {/* Thông báo và thông tin người dùng */}
        <div className="col-md-4 text-end d-flex align-items-center justify-content-end">
          {/* Icon tin nhắn */}
          <button className="btn btn-light rounded-circle me-3">
            <i className="fa-regular fa-comment fa-lg"></i>
          </button>

          {/* Icon thông báo */}
          <button className="btn btn-light rounded-circle me-3">
            <i className="fa-regular fa-bell fa-lg"></i>
          </button>

          {/* Avatar và tên */}
          <div className="d-flex align-items-center">
            <img
              src="https://via.placeholder.com/40"
              alt="User Avatar"
              className="rounded-circle me-2"
              style={{ width: "40px", height: "40px" }}
            />
            <span className="fw-bold">
              {user.full_name ? user.full_name : user.username}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

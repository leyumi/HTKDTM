import React from "react";
import "./Loading.css"; // Đường dẫn đến CSS đã tạo

const Loading = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Đang tải...</p>
    </div>
  );
};

export default Loading;

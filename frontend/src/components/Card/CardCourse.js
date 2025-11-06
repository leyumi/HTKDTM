import React from "react";
import { useNavigate } from "react-router-dom";
import "./CardCourse.css";

const CardCourse = ({ image, title, level, lessons, playlistId }) => {
  const navigate = useNavigate();

  const handleViewDetail = () => {
    navigate(`/studyMaterials/${playlistId}`); // Điều hướng với courseId
  };

  return (
    <div className="card-course card text-center rounded-4 border-1">
      <div className="card-header p-0 rounded-top-4 overflow-hidden">
        {/* Hiển thị hình ảnh */}
        <img src={image} alt={title} className="img-fluid card-image" />
      </div>
      <div className="card-body">
        <h5 className="card-title fw-bold text-primary">{title}</h5>
        <p className="card-subtitle text-muted">{level}</p>
        <p className="card-text text-secondary fw-semibold">{lessons} bài học</p>
        {/* Nút bấm */}
        <button
          className="btn btn-white btn-sm rounded-pill"
          onClick={handleViewDetail}
        >
          Xem chi tiết
        </button>
      </div>
    </div>
  );
};

export default CardCourse;

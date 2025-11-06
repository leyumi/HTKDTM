import React from "react";

const CourseProgressCard = ({ title, lessons, progress }) => {
  return (
    <div className="card shadow-sm my-3">
      <div className="card-body">
        <h5 className="card-title fw-bold mb-1">{title}</h5>
        <p className="card-text text-muted mb-3">{lessons} bài</p>

        <div className="progress mb-3" style={{ height: "10px" }}>
          <div
            className="progress-bar bg-danger"
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>

        <span className="d-block text-muted mb-3">{progress}% hoàn thành</span>

        <button className="btn btn-outline-dark btn-sm fw-bold">Tiếp tục</button>
      </div>
    </div>
  );
};

export default CourseProgressCard;

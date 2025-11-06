import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_URL from "../../config/API_URL";
import Loading from "../../components/Loading/Loading";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS

import "./ShowCourse.css";

const convertToEmbedUrl = (url) => {
  if (!url) return "";

  if (url.includes("watch?v=")) {
    return url.replace("watch?v=", "embed/");
  }
  if (url.includes("youtu.be")) {
    return url.replace("youtu.be/", "www.youtube.com/embed/");
  }
  if (url.includes("embed/")) {
    return url;
  }

  return url;
};

const ShowCourse = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [courseDetail, setCourseDetail] = useState(null); // Tránh lỗi khi dữ liệu null
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0); // Theo dõi video đang phát
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log();
  
  // Định nghĩa hàm `addWatchHistory` bên ngoài tất cả các `useEffect`
  const addWatchHistory = async (videoId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/documents`,
        { documentId: videoId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (response) {
        console.log("Added to Watch History:", response.data.data);
      }
    } catch (err) {
      toast.error(`Add Watch History Error: ${err.message}`);
    }
  };

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/studyMaterials/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        if (response) {
          setCourseDetail(response.data.data); // Lưu dữ liệu khóa học
          console.log("Fetched Data:", response.data.data);
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [id]);

  useEffect(() => {
    if (courseDetail && courseDetail.list_video) {
      addWatchHistory(courseDetail.list_video[currentVideoIndex]._id);
    }
  }, [courseDetail, currentVideoIndex]); // Gửi lịch sử khi `currentVideoIndex` hoặc `courseDetail` thay đổi

  if (loading) return <Loading />;
  if (error) {
    toast.error(error);
    return (
      <div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    );
  }
  if (!courseDetail) {
    toast.warning("Không có dữ liệu để hiển thị");
    return (
      <div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    );
  }

  const { playlist_title, list_video } = courseDetail;
  const currentVideo = list_video[currentVideoIndex];

  const handlePrevious = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentVideoIndex < list_video.length - 1) {
      setCurrentVideoIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleVideoClick = (index) => {
    setCurrentVideoIndex(index);
  };

  return (
    <div className="show-course">
      {loading && <Loading />}
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Header */}
      <div className="header">
        <div className="logo">
          <span className="fw-bold">Nhóm 4 - Cụm 1</span>
        </div>
        <h5 className="m-0">{playlist_title || "Không có dữ liệu"}</h5>
        <div className="help">
          <button className="btn btn-outline-light btn-sm">Hướng dẫn</button>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="row">
        {/* Trình phát video */}
        <div className="col-md-9 video-player-container">
          <div className="video-player">
            <iframe
              className="video-frame"
              src={convertToEmbedUrl(currentVideo.url)}
              title={currentVideo.title || "Video"}
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Nội dung khóa học */}
        <div className="col-md-3 course-content">
          <h6 className="fw-bold sticky top-0">Danh sách các bài học</h6>
          <ul className="list-group">
            {list_video.map((video, index) => (
              <li
                key={video._id}
                className={`list-group-item ${
                  index === currentVideoIndex ? "active" : ""
                }`}
                onClick={() => handleVideoClick(index)}
              >
                <strong>Bài {index + 1}:</strong> {video.title}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="footer-nav">
        <button
          className="btn btn-outline-secondary"
          onClick={handlePrevious}
          disabled={currentVideoIndex === 0}
        >
          Bài trước
        </button>
        <button
          className="btn btn-outline-success"
          onClick={handleNext}
          disabled={currentVideoIndex === list_video.length - 1}
        >
          Bài tiếp theo
        </button>
      </div>
    </div>
  );
};

export default ShowCourse;

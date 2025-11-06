import React, { useState, useEffect } from "react";
import Slider from "react-slick"; // Import React Slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Loading from "../../components/Loading/Loading";

import Header from "../../layouts/Header/Header";
import SearchItem from "../../components/SearchItem/SearchItem";
import CardCourse from "../../components/Card/CardCourse";
import "./Course.css";

import API_URL from "../../config/API_URL.js";
import axios from "axios";

// ===================== Nút điều hướng tùy chỉnh =====================
const CustomNextArrow = ({ onClick }) => {
  return (
    <a
      className="carousel-control-next rounded-4"
      href="#carouselExampleIndicators"
      role="button"
      data-slide="next"
      onClick={onClick}
    >
      <span className="carousel-control-next-icon" aria-hidden="true"></span>
      <span className="sr-only">Next</span>
    </a>
  );
};

const CustomPrevArrow = ({ onClick }) => {
  return (
    <a
      className="carousel-control-prev rounded-4"
      href="#carouselExampleIndicators"
      role="button"
      data-slide="prev"
      onClick={onClick}
    >
      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      <span className="sr-only">Previous</span>
    </a>
  );
};

// ===================== Component chính =====================
const Course = () => {
  // Cấu hình Slider
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // ===================== State =====================
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  // ===================== Fetch dữ liệu =====================
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/studyMaterials?page=1&limit=27`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );

        const data = response.data.data;
        setCourses(data);

        if (data && data.length > 0) {
          console.log("ID khóa học đầu tiên:", data[0]._id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token]);

  // ===================== Ảnh mặc định (nếu API không có ảnh) =====================
  const fallbackImages = [
    "https://picsum.photos/400/250?random=1",
    "https://picsum.photos/400/250?random=2",
    "https://picsum.photos/400/250?random=3",
    "https://picsum.photos/400/250?random=4",
  ];

  // ===================== Render =====================
  if (error) return <div className="text-danger text-center">Lỗi: {error}</div>;

  return (
    <div className="course">
      {loading && <Loading />}

      <Header
        username="Le"
        title="Khóa học"
        middleContent={
          <div className="d-flex justify-content-between align-items-center">
            <SearchItem />
          </div>
        }
      />

      <div className="wrapper p-3">
        <Slider {...settings}>
          {courses.map((course, index) => {
            // Lấy ảnh từ API hoặc fallback
            const imageUrl =
              course.thumbnail ||
              course.image ||
              fallbackImages[index % fallbackImages.length];

            return (
              <CardCourse
                key={index}
                image={imageUrl}
                title={course.playlist_title}
                lessons={course.list_video?.length || 0}
                playlistId={course._id}
              />
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

export default Course;

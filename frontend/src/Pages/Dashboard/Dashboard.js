import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./Dashboard.css";
import Header from "../../layouts/Header/Header";
import SearchItem from "../../components/SearchItem/SearchItem";
import InfoCard from "../../components/Card/CardDashboard";
import CourseProgressCard from "../../components/Card/CourseProgressCard.js";
import CardSchedule from "../../components/Card/CardSchedule.js";
import API_URL from "../../config/API_URL";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../components/Loading/Loading";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [courseProgress, setCourseProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseProgress = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${API_URL}/user/getUserCourseProgress`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );

        if (response.status === 200) {
          setCourseProgress(response.data.data);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          toast.info("Bạn chưa tham gia khóa học nào");
        } else {
          toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau!");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourseProgress();
  }, []);

  // ====== Biểu đồ tiến trình học ======
  const chartData = {
    labels: courseProgress.map((course) => course.course),
    datasets: [
      {
        label: "Đã học",
        data: courseProgress.map((course) =>
          parseInt(course.progress.split("/")[0])
        ),
        backgroundColor: "rgba(72, 149, 239, 0.7)", // xanh dương đậm
        borderRadius: 8,
      },
      {
        label: "Tổng số bài",
        data: courseProgress.map((course) =>
          parseInt(course.progress.split("/")[1])
        ),
        backgroundColor: "rgba(245, 36, 106, 0.6)", // cam pastel
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="dashboard">
      {loading && <Loading />}
      <ToastContainer />

      {/* Header */}
      <Header
        username=""
        title="Tổng quan học tập"
        middleContent={<SearchItem />}
      />

      <div className="main-content p-4">
        <div className="row">
          {/* --- Bên trái --- */}
          <div className="dashboard-main-content-left col-md-8">
            {/* Thẻ thống kê */}
            <div className="row mb-4">
              <div className="col-md-4 mb-3">
                <InfoCard
                  icon={<i className="fas fa-book" style={{ color: "#000cb8ff" }}></i>} // xanh ngọc
                  title="Đang học"
                  value={courseProgress.length}
                  bgColor="bg-cyan"
                />
              </div>

              <div className="col-md-4 mb-3">
                <InfoCard
                  icon={<i className="bi bi-check-circle-fill" style={{ color: "#4c936dff" }}></i>} // tím
                  title="Hoàn thành"
                  value={
                    courseProgress.filter(
                      (course) =>
                        course.progress.split("/")[0] ===
                        course.progress.split("/")[1]
                    ).length
                  }
                  bgColor="bg-purple"
                />
              </div>

              <div className="col-md-4 mb-3">
                <InfoCard
                  icon={<i className="fas fa-award" style={{ color: "#f76cd7ff" }}></i>} // đỏ cam
                  title="Chứng chỉ"
                  value={courseProgress.length}
                  bgColor="bg-orange"
                />
              </div>
            </div>

            {/* Biểu đồ */}
            <div className="dashboard-chart row mb-3 w-100">
              <h5 className="fw-bold mb-3 text-primary">Tiến trình</h5>
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top",
                      labels: { color: "#333", font: { size: 14 } },
                    },
                    title: {
                      display: true,
                      text: "Biểu đồ tiến trình học tập theo khóa",
                      color: "#444",
                      font: { size: 16, weight: "bold" },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* --- Bên phải --- */}
          <div className="main-contain-right col-md-4">
            <h5 className="fw-bold mb-3 text-primary">Khóa học tôi đang học</h5>
            {courseProgress.map((course, index) => (
              <CourseProgressCard
                key={index}
                title={course.course}
                lessons={course.progress.split("/")[1]}
                progress={Math.round(
                  (parseInt(course.progress.split("/")[0]) /
                    parseInt(course.progress.split("/")[1])) *
                    100
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

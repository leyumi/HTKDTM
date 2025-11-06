import "./App.css";
import { useEffect } from "react";
import {
  useNavigate,
  useLocation,
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { toast } from "react-toastify";
import SideBar from "./layouts/SideBar/SideBar";
import Dashboard from "./Pages/Dashboard/Dashboard";
import ShowCourse from "./Pages/Course/ShowCourse";
import FindWork from "./Pages/FindWork/FindWork";
import Profile from "./Pages/Profile/Profile";
import Schedule from "./Pages/Schedule/Schedule";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import Setting from "./Pages/Setting/Setting";
import Chatbot from "./Pages/Chatbot/Chatbot";
import Course from "./Pages/Course/Course";
import NotFoundPage from "./Pages/NotFoundPage/NotFoundPage"; // Import trang 404

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Các route không cần SideBar
  const noSideBarRoutes = ["/login", "/signup"];
  const hideSideBar = noSideBarRoutes.includes(location.pathname);

  // Hàm kiểm tra token hết hạn
  const isTokenExpired = () => {
    const expiredTime = localStorage.getItem("expiredTime");
    const now = new Date().getTime();
    return expiredTime && now > Number(expiredTime);
  };

  // Kiểm tra và điều hướng dựa trên token
  const checkAndRedirect = () => {
    const token = localStorage.getItem("token");

    if (isTokenExpired()) {
      localStorage.clear();
      toast.warning("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại!");
      navigate("/login");
    } else if (location.pathname === "/signup") {
      navigate("/signup");
    } else if (!token) {
      navigate("/login");
    } else if (location.pathname === "/login" || location.pathname === "/") {
      navigate("/dashboard");
    }
  };

  // Kiểm tra token khi ứng dụng khởi chạy
  useEffect(() => {
    checkAndRedirect();
  }, [location.pathname]);

  return (
    <div className="container-wrapper">
      {/* Ẩn SideBar cho các route không cần */}
      {!hideSideBar && <SideBar />}

      <div className="main">
        <Routes>
          <Route
            path="/"
            element={
              localStorage.getItem("token") ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/course" element={<Course />} />
          <Route path="/findwork" element={<FindWork />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/studyMaterials/:id" element={<ShowCourse />} />
          {/* Route xử lý trang không tồn tại */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;

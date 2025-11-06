import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import API_URL from "../../config/API_URL.js";
import "./Login.css";
import hocTapImg from "../../assets/images/hoc-tap.jpg"; // Ảnh bạn đã tải về

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password,
      });

      if (response.status === 200) {
        toast.success("Đăng nhập thành công!", { autoClose: 2000 });
        const token = response.data.data;
        const expiredTime = new Date().getTime() + 3 * 60 * 60 * 1000;
        localStorage.setItem("token", token);
        localStorage.setItem("expiredTime", expiredTime);

        try {
          const userResponse = await axios.get(`${API_URL}/user`, {
            headers: { Authorization: token },
          });
          const user = userResponse.data.data;
          localStorage.setItem("user", JSON.stringify(user));
        } catch (error) {
          console.warn("Không lấy được thông tin user:", error);
        }

        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 400) {
          toast.error("Mật khẩu không đúng!", { autoClose: 1500 });
        } else if (status === 404) {
          toast.error("Người dùng không tồn tại!", { autoClose: 1500 });
        } else {
          toast.error("Lỗi server. Vui lòng thử lại sau!", { autoClose: 1500 });
        }
      } else {
        toast.error("Không thể kết nối tới máy chủ!", { autoClose: 1500 });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <ToastContainer />
      <div className="login-container shadow-lg">
        {/* Form đăng nhập */}
        <div className="login-form p-5 bg-white">
          <h2 className="text-center mb-4 fw-bold mt-3">Đăng nhập</h2>
          <div
            className="border-top border-primary m-4"
            style={{ borderWidth: "4px" }}
          ></div>
          <h5 className="text-center text-secondary mb-4">
            Chào bạn !
          </h5>

          <form onSubmit={handleSubmit} className="mt-2 mx-4 px-1">
            <div className="mb-3 mt-3">
              <label htmlFor="username" className="form-label fw-bold mt-3">
                Tên đăng nhập
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-bold">
                Mật khẩu
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 fw-bold mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Đang xử lý...
                </>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>

          <p className="text-center mt-3">
            <span>
              Bạn chưa có tài khoản?{" "}
              <a
                href="/signup"
                className="text-primary text-decoration-none fw-bold"
              >
                Đăng ký ngay
              </a>
            </span>
          </p>
        </div>

        {/* Ảnh bên cạnh */}
        <div className="login-image">
          <img
            src={hocTapImg}
            alt="Học tập"
            style={{
              height: "600px",
              width: "450px",
              objectFit: "cover",
              borderRadius: "0 10px 10px 0",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;

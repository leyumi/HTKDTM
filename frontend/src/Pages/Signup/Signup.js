import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./Signup.css";
import API_URL from "../../config/API_URL.js";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({}); // State lưu lỗi
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateUsername = (value) => {
    const usernameRegex = /^[^\W_]+.*$/; // Không bắt đầu bằng ký tự đặc biệt hoặc dấu gạch dưới
    return usernameRegex.test(value)
      ? ""
      : "Tên đăng nhập không được bắt đầu bằng ký tự đặc biệt!";
  };

  const validatePassword = (value) => {
    return value.length >= 8 ? "" : "Mật khẩu phải có ít nhất 8 ký tự!";
  };

  const validateConfirmPassword = (value) => {
    return value === password ? "" : "Mật khẩu xác nhận không khớp!";
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);

    const error = validateUsername(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      username: error,
    }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    const error = validatePassword(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      password: error,
    }));

    // Xác thực lại Confirm Password khi mật khẩu thay đổi
    const confirmError = validateConfirmPassword(confirmPassword);
    setErrors((prevErrors) => ({
      ...prevErrors,
      confirmPassword: confirmError,
    }));
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    const error = validateConfirmPassword(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      confirmPassword: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra toàn bộ form trước khi submit
    const formErrors = {
      username: validateUsername(username),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword),
    };

    setErrors(formErrors);

    if (Object.values(formErrors).some((error) => error)) {
      return; // Không submit nếu có lỗi
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/signup`, {
        username,
        password,
      });

      if (response.status === 201) {
        toast.success("Đăng ký tài khoản thành công!", {
          position: "top-right",
          autoClose: 1500,
          onClose: () => navigate("/login"), // Chuyển hướng sau khi toast đóng
        });
      }
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 400) {
          toast.error("Body không hợp lệ!", { autoClose: 1500 });
        } else if (status === 409) {
          toast.error("Người dùng đã tồn tại!", { autoClose: 1500 });
        } else {
          toast.error("Lỗi server. Vui lòng thử lại sau!", { autoClose: 1500 });
        }
      } else {
        toast.error("Không thể kết nối tới máy chủ!", { autoClose: 1500 });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <ToastContainer />
      <div className="login-container shadow-lg">
        <div className="login-image">
          <img
            src="https://i.pinimg.com/736x/66/fc/01/66fc01237650a7ef751b5c77e301c38f.jpg"
            alt="Education"
            className="custom-img"
          />
        </div>
        <div className="login-form p-5 bg-white">
          <h2 className="text-center mb-4 fw-bold mt-3">Đăng ký</h2>
          <form onSubmit={handleSubmit} className="mt-2 mx-4 px-1">
            <div className="mb-2 mt-3">
              <label htmlFor="username" className="form-label fw-bold mt-3">
                Tên đăng nhập
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.username ? "is-invalid" : ""
                }`}
                id="username"
                value={username}
                onChange={handleUsernameChange}
              />
              {errors.username && (
                <div className="invalid-feedback">{errors.username}</div>
              )}
            </div>
            <div className="mb-2">
              <label htmlFor="password" className="form-label fw-bold">
                Mật khẩu
              </label>
              <input
                type="password"
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
                id="password"
                value={password}
                onChange={handlePasswordChange}
              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label fw-bold">
                Nhập lại mật khẩu
              </label>
              <input
                type="password"
                className={`form-control ${
                  errors.confirmPassword ? "is-invalid" : ""
                }`}
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              {errors.confirmPassword && (
                <div className="invalid-feedback">{errors.confirmPassword}</div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-danger w-100 fw-bold"
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
                "Đăng ký"
              )}
            </button>
          </form>
          <p className="text-center mt-3">
            <span>
              Bạn đã có tài khoản?{" "}
              <a
                href="/login"
                className="text-danger text-decoration-none fw-bold"
              >
                Đăng nhập ngay
              </a>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

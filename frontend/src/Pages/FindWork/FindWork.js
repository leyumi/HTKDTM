import React, { useState, useEffect } from "react";
import Header from "../../layouts/Header/Header";
import SearchItem from "../../components/SearchItem/SearchItem";
import API_URL from "../../config/API_URL";
import "./FindWork.css"; // Chỉ cần giữ các phần không liên quan đến phân trang
import { toast, ToastContainer } from "react-toastify";
import Loading from "../../components/Loading/Loading";

const FindWork = () => {
  // Quản lý trạng thái tìm kiếm và công việc
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSuggestedCollapsed, setIsSuggestedCollapsed] = useState(false); // Thêm trạng thái collapse cho "Đề xuất công việc"
  const [suggestedJobs, setSuggestedJobs] = useState([]); // Thêm state cho các công việc đề xuất
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 6;

  // Tính toán dữ liệu cần hiển thị trên trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = jobs.slice(indexOfFirstItem, indexOfLastItem);

  // Số lượng trang
  const totalPages = Math.ceil(jobs.length / itemsPerPage);

  // Gọi API tìm kiếm công việc
  const fetchAPI = async (url, method = "POST", body = {}) => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        return await response.json();
      } else {
        if(response.status === 400){
          toast.error("Vui lòng đồng bộ dữ liệu sinh viên trước khi thực hiện gợi ý!", {autoClose: 3000});
        }
        // console.error("Failed to fetch:", response.statusText);
      }
    } catch (error) {
      // console.error("Error fetching data:", error);
      toast.error("Đã có lỗi xảy ra!", {autoClose: 2500});
    } finally {
      setLoading(false);
    }
  };

  // Gọi API tìm kiếm công việc
  const handleSearch = async () => {
    if (!searchTerm) {
      // alert("Không được để trống!");
      toast.warning("Không được để trống!", {autoClose: 2000});
      return;
    }

    const data = await fetchAPI(`${API_URL}/jobs/search`, "POST", {
      keyword: searchTerm,
      limit: 50,
      page: 0,
    });

    if (data) {
      setJobs(data.data);
      setIsCollapsed(true);
    }
  };

  const checkMembership = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/user/checkMembershipStatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.isPaidMember === true) {
          return true;
        }
      }

      return false;
    } catch (error) {
      // console.error("Error checkMembership:", error);
      return false;
    }
  }

  // Gọi API để lấy công việc đề xuất
  const handleSuggestedJobsCollapse = async () => {

    const isPaidMember = await checkMembership();

    if (!isPaidMember) {
      toast.error("Vui lòng nâng cấp gói thành viên để sử dụng!", { autoClose: 2000 });
      return;
    }

    if (!isSuggestedCollapsed) {
      const predictedData = await fetchAPI(`${API_URL}/predict/career`, "POST");

      if (predictedData && predictedData.data) {
        const suggestedData = await fetchAPI(`${API_URL}/jobs/search`, "POST", {
          keyword: predictedData.data,
          limit: 3,
          page: 0,
        });

        if (suggestedData) {
          setSuggestedJobs(suggestedData.data);
        }
      }
    }
  };

  return (
    <div className="findwork">
      {loading && <Loading />}
      <Header username="HuongPTA" title="Tìm việc" />
      <ToastContainer></ToastContainer>

      {/* Nội dung chính */}
      <div className="findwork-content">
        {/* Tìm kiếm */}
        <div className="search-section py-4 shadow-sm">
          <div className="text-center">
            <div className="input-group mb-3 w-75 mx-auto">
              <input
                type="text"
                placeholder="Nhập vị trí việc làm..."
                className="form-control"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-danger px-4" onClick={handleSearch}>
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>

        {/* Danh sách công việc */}
        <div className="recommendations mt-4">
          <div className="d-flex justify-content-between align-items-center">
            <h2>Danh sách công việc</h2>
            <button
              className="btn btn-info"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <i className="bi bi-arrow-up-circle"></i>
              ) : (
                <i className="bi bi-arrow-down-circle"></i>
              )}
            </button>
          </div>
          <div className={`collapse ${isCollapsed ? "show" : ""}`}>
            <div className="row mt-3">
              {currentJobs.map((job) => (
                <div key={job.id} className="col-md-4 mb-4">
                  <div className="card">
                    <a
                      href={job.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={job.companyLogo} alt="Logo" />
                      <div className="card-body">
                        <h5 className="card-title">{job.jobTitle}</h5>
                        <p className="card-text">{job.companyName}</p>
                      </div>
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <nav className="pagination justify-content-center">
              <ul className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                  <li
                    key={index}
                    className={`page-item ${currentPage === index + 1 ? "active" : ""
                      }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Đề xuất công việc */}
        <div className="suggested-jobs mt-4">
          <div className="d-flex justify-content-between align-items-center">
            <h2>Đề xuất công việc</h2>
            <button
              className="btn btn-info"
              onClick={() => {
                setIsSuggestedCollapsed(!isSuggestedCollapsed);
                handleSuggestedJobsCollapse();
              }}
            >
              {isSuggestedCollapsed ? (
                <i className="bi bi-arrow-up-circle"></i>
              ) : (
                <i className="bi bi-arrow-down-circle"></i>
              )}
            </button>
          </div>
          <div className={`collapse ${isSuggestedCollapsed ? "show" : ""}`}>
            <div className="row mt-3">
              {suggestedJobs.map((job) => (
                <div key={job.id} className="col-md-4 mb-4">
                  <div className="card">
                    <a
                      href={job.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={job.companyLogo} alt="Logo" />
                      <div className="card-body">
                        <h5 className="card-title">{job.jobTitle}</h5>
                        <p className="card-text">{job.companyName}</p>
                      </div>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindWork;

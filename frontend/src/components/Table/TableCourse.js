import React from "react";
import "./TableCourse.css"

//dữ liệu mẫu
const courses = [
  {
    id: "01",
    name: "Lập trình Python",
    lectures: 15,
    time: "30/01/2024 - 30/11/2024\nThứ 3: Tiết 4 - Tiết 6\nThứ 5: Tiết 4 - Tiết 6",
    status: "Đã hoàn thành",
  },
  {
    id: "02",
    name: "Lập trình C++",
    lectures: 30,
    time: "15/11/2024 - 15/01/2025\nThứ 2: Tiết 4 - Tiết 6",
    status: "Đang thực hiện",
  },
  {
    id: "03",
    name: "Lập trình C#",
    lectures: 15,
    time: "31/12/2024 - 31/01/2025\nThứ 3: Tiết 4 - Tiết 6\nThứ 5: Tiết 4 - Tiết 6",
    status: "Chưa thực hiện",
  },
  {
    id: "04",
    name: "Lập trình Java",
    lectures: 15,
    time: "30/01/2024 - 30/02/2025\nThứ 3: Tiết 4 - Tiết 6\nThứ 5: Tiết 4 - Tiết 6",
    status: "Chưa thực hiện",
  },
];

function TableCourse() {
  return (
    <div className="container-fluid">
      <div className="table-container">
        <table className="table table-bordered table-hover rounded-3 overflow-hidden">
          <thead className="table-light text-center">
            <tr className = "table-dark">
              <th>STT</th>
              <th>Khóa học</th>
              <th>Số bài giảng</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {courses.map((course, index) => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.name}</td>
                <td>{course.lectures}</td>
                <td>
                  {course.time.split("\n").map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
                </td>
                <td>{course.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableCourse;

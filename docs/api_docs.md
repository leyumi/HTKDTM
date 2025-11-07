# Đặc tả API

## 1. Đăng ký

- **Phương thức**: `POST`
- **Endpoint**: `/api/signup`
- **Mô tả**: Đăng ký tài khoản hệ thống
- **Tham số**:
  - `username` (string, độ dài 8-16, bắt buộc): Tên tài khoản
  - `password` (string, độ dài 8-16, bắt buộc): Mật khẩu
- **Mẫu body**:
  ```json
  
  ```
- **Mã trạng thái kết quả**:
  - `400`: body không hợp lệ
  - `409`: đã tồn tại người dùng
  - `201`: đăng ký thành công
  - `500`: Lỗi server

---

## 2. Đăng nhập

- **Phương thức**: `POST`
- **Endpoint**: `/api/login`
- **Mô tả**: Đăng nhập hệ thống
- **Tham số**:
  - `username` (string, độ dài 8-16, bắt buộc): Tên tài khoản
  - `password` (string, độ dài 8-16, bắt buộc): Mật khẩu
- **Mẫu body**:
  ```json
  
  ```
- **Mã trạng thái kết quả**:
  - `400`: Mật khẩu không đúng
  - `404`: Người dùng không tồn tại
  - `200`: Đăng nhập thành công
  - `500`: Lỗi server

---

## 3. Thông tin người dùng

- **Phương thức**: `GET`
- **Endpoint**: `/api/user`
- **Mô tả**: Lấy thông tin người dùng đang đăng nhập
- **Header**:
  - `Authorization`: Token lấy từ đăng nhập
- **Mã trạng thái kết quả**:
  - `404`: Người dùng không tồn tại
  - `200`: Lấy thông tin thành công
  - `500`: Lỗi server

---

## 4. Đồng bộ thông tin sinh viên

- **Phương thức**: `POST`
- **Endpoint**: `/api/student/syncData`
- **Mô tả**: Đồng bộ thông tin sinh viên từ website sinhvientlu
- **Header**:
  - `Authorization`: Token lấy từ đăng nhập
- **Mẫu body**:
  ```json
 
  ```
- **Mã trạng thái kết quả**:
  - `503`: Lỗi từ bên phía sinhvientlu
  - `400`: Lỗi dữ liệu đồng bộ
  - `200`: Lấy thông tin thành công
  - `500`: Lỗi server

---

## 5. Cập nhật quyền người dùng

- **Phương thức**: `POST`
- **Endpoint**: `/api/student/role`
- **Mô tả**: Cập nhật role từ người dùng thường => trả phí
- **Header**:
  - `Authorization`: Token lấy từ đăng nhập
- **Mã trạng thái kết quả**:
  - `400`: Không thể cập nhật quyền
  - `200`: Cập nhật quyền thành công
  - `500`: Lỗi server

---

## 6. Tìm kiếm công việc

- **Phương thức**: `POST`
- **Endpoint**: `/api/jobs/search`
- **Mô tả**: Tìm kiếm các công việc
- **Header**:
  - `Authorization`: Token lấy từ đăng nhập
- **Mẫu body**:
  ```json
  {
      "keyword": "backend",
      "limit": 3
  }
  ```
- **Mã trạng thái kết quả**:
  - `200`: Tìm kiếm thành công
  - `500`: Lỗi server

---

## 7. Dự đoán nghề nghiệp

- **Phương thức**: `POST`
- **Endpoint**: `/api/predict/career`
- **Mô tả**: Dự đoán nghề nghiệp
- **Header**:
  - `Authorization`: Token lấy từ đăng nhập
- **Mẫu body**:
  ```json
  {
      "age": 22,
      "gpa": 3.5,
      "domain": "Web Development",
      "projects": "E-commerce Website",
      "python": 3,
      "sql": 3,
      "java": 2
  }
  ```
- **Mã trạng thái kết quả**:
  - `503`: Lỗi module python
  - `200`: Dự đoán thành công
  - `500`: Lỗi server

---

## 8. Tìm kiếm tài liệu học tập (theo chủ đề)

- **Phương thức**: `POST`
- **Endpoint**: `/api/studyMaterials/search`
- **Mô tả**: Tìm kiếm tài liệu học tập theo chủ đề
- **Header**:
  - `Authorization`: Token lấy từ đăng nhập
- **Mẫu body**:
  ```json
  {
      "keyword": "Xử lý ảnh"
  }
  ```
- **Mã trạng thái kết quả**:
  - `400`: Keyword bị bỏ trống
  - `200`: Tìm kiếm thành công
  - `500`: Lỗi server

---

## 9. Lấy các tài liệu học tập (theo chủ đề, đã phân trang)

- **Phương thức**: `GET`
- **Endpoint**: `/api/studyMaterials`
- **Mô tả**: Lấy ra các tài liệu học tập theo chủ đề
- **Header**:
  - `Authorization`: Token lấy từ đăng nhập
- **Tham số**:
  - `page`: Số trang hiện tại
  - `limit`: Số bản ghi muốn lấy
- **Ví dụ URL**: `/api/studyMaterials?page=1&limit=5`
- **Mã trạng thái kết quả**:
  - `400`: Body không phù hợp
  - `200`: Lấy ra tài liệu học tập thành công
  - `500`: Lỗi server

---

## 10. Lấy tài liệu học tập (theo chủ đề bởi id)

- **Phương thức**: `GET`
- **Endpoint**: `/api/studyMaterials/:id`
- **Ví dụ**: `/api/studyMaterials/677d3930cc1ff5f52732b869`
- **Mô tả**: Lấy ra tài liệu học tập theo chủ đề bởi id
- **Header**:
  - `Authorization`: Token lấy từ đăng nhập
- **Mã trạng thái kết quả**:
  - `400`: id không đúng định dạng
  - `404`: Không tìm thấy tài liệu học tập
  - `200`: Lấy ra tài liệu học tập thành công
  - `500`: Lỗi server

---

## 11. Lấy tài liệu (bởi id)

- **Phương thức**: `GET`
- **Endpoint**: `/api/documents/:id`
- **Ví dụ**: `/api/documents/677d3930cc1ff5f52732b869`
- **Mô tả**: Lấy ra tài liệu theo id
- **Header**:
  - `Authorization`: Token lấy từ đăng nhập
- **Mã trạng thái kết quả**:
  - `400`: id không đúng định dạng
  - `404`: Không tìm thấy tài liệu
  - `200`: Lấy ra tài liệu thành công
  - `500`: Lỗi server

---

## 12. Trò chuyện với AI

- **Phương thức**: `POST`
- **Endpoint**: `/api/openai/chat`
- **Mô tả**: Trò chuyện với AI
- **Header**:
  - `Authorization`: Token lấy từ đăng nhập
- **Mẫu body**:
  ```json
  {
      "prompt": "hãy khen tôi đẹp trai"
  }
  ```
- **Mã trạng thái kết quả**:
  - `400`: “prompt” không được rỗng
  - `200`: Lấy về câu trả lời thành công
  - `500`: Lỗi server

---

## 13. Gợi ý lịch học

- **Lưu ý mã trạng thái kết quả**:
  - `401`: Thiếu token ở header
  - `403`: 
    - `message: 'Invalid or expired token'`: Token hết hạn hoặc sai
    - `message: 'Access denied'`: Không có quyền truy cập

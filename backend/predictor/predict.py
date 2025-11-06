import joblib
import pandas as pd

# Tải mô hình và mã hóa
voting_model = joblib.load("./models/voting_career_model.pkl")
target_encoder = joblib.load("./models/target_encoder.pkl")
label_encoders = joblib.load("./models/label_encoders.pkl")

# Thông tin đầu vào
student_info = {
    "Age": 21,
    "GPA": 3.5,
    "Interested Domain": "Artificial Intelligence",
    "Projects": "Chatbot Development",
    "Python": 2,
    "SQL": 2,
    "Java": 2
}

# Xử lý dữ liệu đầu vào
input_data = {}
for key, value in student_info.items():
    if key in label_encoders:  # Nếu là cột phân loại
        try:
            input_data[key] = label_encoders[key].transform([value])[0]
        except ValueError:
            print(f"Giá trị '{value}' không tồn tại trong dữ liệu huấn luyện cho cột '{key}'.")
            raise
    else:
        input_data[key] = value

# Chuyển đổi thành DataFrame
input_df = pd.DataFrame([input_data])

# Dự đoán
predicted_label = voting_model.predict(input_df)[0]
predicted_career = target_encoder.inverse_transform([predicted_label])[0]

print("\nDự đoán công việc tương lai cho sinh viên:", predicted_career)

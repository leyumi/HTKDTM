import joblib
import pandas as pd
import argparse
import os

def main():
    # Định nghĩa parser để nhận tham số từ dòng lệnh
    parser = argparse.ArgumentParser(description="Dự đoán công việc tương lai cho sinh viên.")
    parser.add_argument("--age", type=int, required=True, help="Tuổi của sinh viên.")
    parser.add_argument("--gpa", type=float, required=True, help="Điểm trung bình của sinh viên.")
    parser.add_argument("--domain", type=str, required=True, help="Lĩnh vực sinh viên quan tâm.")
    parser.add_argument("--projects", type=str, required=True, help="Dự án đã tham gia của sinh viên.")
    parser.add_argument("--python", type=int, required=True, help="Kỹ năng Python của sinh viên (mức 1-5).")
    parser.add_argument("--sql", type=int, required=True, help="Kỹ năng SQL của sinh viên (mức 1-5).")
    parser.add_argument("--java", type=int, required=True, help="Kỹ năng Java của sinh viên (mức 1-5).")

    args = parser.parse_args()

    current_dir = os.path.dirname(os.path.abspath(__file__))

    voting_model_path = os.path.join(current_dir, "models/voting_career_model.pkl")
    target_encoder_path = os.path.join(current_dir, "models/target_encoder.pkl")
    label_encoders_path = os.path.join(current_dir, "models/label_encoders.pkl")

    # Tải mô hình và mã hóa
    voting_model = joblib.load(voting_model_path)
    target_encoder = joblib.load(target_encoder_path)
    label_encoders = joblib.load(label_encoders_path)

    # Thông tin đầu vào từ dòng lệnh
    student_info = {
        "Age": args.age,
        "GPA": args.gpa,
        "Interested Domain": args.domain,
        "Projects": args.projects,
        "Python": args.python,
        "SQL": args.sql,
        "Java": args.java
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

    print(predicted_career, end="")

if __name__ == "__main__":
    main()


"""
usage: final.py [-h] --age AGE --gpa GPA --major MAJOR --domain DOMAIN --projects PROJECTS --python PYTHON --sql SQL --java JAVA
final.py: error: the following arguments are required: --age, --gpa, --major, --domain, --projects, --python, --sql, --java

python final.py --age 21 --gpa 3.5 --domain "Artificial Intelligence" --projects "Chatbot Development" --python 3 --sql 3 --java 1
"""
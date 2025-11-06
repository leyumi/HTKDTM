import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.svm import SVC
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import joblib

# Bước 1: Đọc dữ liệu
file_path = "docs/cs_students.csv"  # Thay bằng đường dẫn tệp của bạn
data = pd.read_csv(file_path)

# Bước 2: Xử lý dữ liệu thiếu
data = data.dropna()

# Bước 3: Mã hóa các cột phân loại
label_encoders = {}
categorical_columns = ["Interested Domain", "Projects"]  # Các cột phân loại
for col in categorical_columns:
    le = LabelEncoder()
    data[col] = le.fit_transform(data[col])
    label_encoders[col] = le

# Mã hóa cột mục tiêu
target_encoder = LabelEncoder()
data["Future Career"] = target_encoder.fit_transform(data["Future Career"])

# Bước 4: Tách dữ liệu
X = data.drop("Future Career", axis=1)
y = data["Future Career"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Bước 5: Tạo các mô hình con
rf_model = RandomForestClassifier(random_state=42)
gb_model = GradientBoostingClassifier(random_state=42)
svc_model = SVC(probability=True, random_state=42)

# Kết hợp các mô hình trong Voting Classifier
voting_model = VotingClassifier(
    estimators=[
        ('random_forest', rf_model),
        ('gradient_boosting', gb_model),
        ('svc', svc_model)
    ],
    voting='soft'  # 'soft' sử dụng xác suất, 'hard' sử dụng phiếu bầu
)

# Huấn luyện mô hình Voting Classifier
voting_model.fit(X_train, y_train)

# Đánh giá mô hình
y_pred_voting = voting_model.predict(X_test)
accuracy_voting = accuracy_score(y_test, y_pred_voting)
print("Độ đo chính xác (Accuracy) của Voting Classifier:", accuracy_voting)
print("\nBáo cáo phân loại (Classification Report):\n", classification_report(y_test, y_pred_voting))

# Lưu mô hình Voting Classifier và các mã hóa
joblib.dump(voting_model, "./models/voting_career_model.pkl")
joblib.dump(target_encoder, "./models/target_encoder.pkl")
joblib.dump(label_encoders, "./models/label_encoders.pkl")
print("Mô hình Voting Classifier và mã hóa đã được lưu!")

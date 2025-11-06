import pandas as pd


# Bước 1: Đọc dữ liệu
file_path = "docs/cs_students.csv"  # Thay bằng đường dẫn tệp của bạn
data = pd.read_csv(file_path)

unique_values_per_column = {col: data[col].unique() for col in data.columns}

# Hiển thị kết quả
for col, values in unique_values_per_column.items():
    print(f"Column '{col}' has unique values: {values}")

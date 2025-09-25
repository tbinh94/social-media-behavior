import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import re

# Khởi tạo ứng dụng FastAPI
app = FastAPI()

# Cấu hình CORS để cho phép React frontend gọi API
origins = [
    "http://localhost:3000", # Cổng của Create React App (dự phòng)
    "http://localhost:5173", # Cổng mặc định của Vite
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- PHẦN XỬ LÝ DỮ LIỆU ĐÃ ĐƯỢC CẬP NHẬT ---
def load_and_clean_data(filepath: str):
    """
    Hàm duy nhất để đọc, làm sạch tên cột và chuẩn hóa dữ liệu.
    """
    try:
        df = pd.read_csv(filepath)
    except FileNotFoundError:
        print(f"Lỗi: Không tìm thấy file tại '{filepath}'.")
        return None

    # B1: Làm sạch tên cột (chuyển thành snake_case)
    # Ví dụ: '1. What is your age group?' -> 'what_is_your_age_group'
    def clean_col(name):
        name = name.strip()
        name = re.sub(r'[^a-zA-Z0-9\s]', '', name) # Bỏ ký tự đặc biệt
        name = re.sub(r'\s+', '_', name) # Thay khoảng trắng bằng gạch dưới
        return name.lower()

    df.columns = [clean_col(col) for col in df.columns]

    # B2: Làm sạch dữ liệu bên trong các cột cụ thể
    # Dùng .get() để tránh lỗi nếu cột không tồn tại
    if df.get('how_many_hours_per_day_do_you_spend_online') is not None:
        df['how_many_hours_per_day_do_you_spend_online'] = df['how_many_hours_per_day_do_you_spend_online'].str.replace('"', '', regex=False)
        
    if df.get('what_is_your_most_used_social_media_platform') is not None:
        df['what_is_your_most_used_social_media_platform'] = df['what_is_your_most_used_social_media_platform'].str.strip()
        df['what_is_your_most_used_social_media_platform'] = df['what_is_your_most_used_social_media_platform'].replace({
            'X (Formerly Twitter)': 'X',
            'WhatsApp': 'Whatsapp' # Chuẩn hóa Whatsapp
        })
    
    return df

# Đọc dữ liệu khi server khởi động
df_original = load_and_clean_data('data/HybridDataset.csv')

# --- ĐỊNH NGHĨA CÁC API ENDPOINTS ---

@app.get("/")
def read_root():
    return {"message": "Welcome to the Social Media User Behavior API"}

def create_response(df: pd.DataFrame, column_name: str):
    """Hàm trợ giúp để tạo response, tránh lặp code."""
    if df is None:
        return {"error": "Dataset not loaded or is empty."}
    if column_name not in df.columns:
        return {"error": f"Column '{column_name}' not found. Available columns: {list(df.columns)}"}
    
    counts = df[column_name].value_counts().reset_index()
    counts.columns = ['label', 'count']
    return counts.to_dict(orient='records')

# CÁC ENDPOINT SỬ DỤNG TÊN CỘT ĐÃ ĐƯỢC LÀM SẠCH (snake_case)
@app.get("/api/age-distribution")
def get_age_distribution():
    return create_response(df_original, 'what_is_your_age_group')

@app.get("/api/occupation-distribution")
def get_occupation_distribution():
    return create_response(df_original, 'what_is_your_occupation')

@app.get("/api/platform-popularity")
def get_platform_popularity():
    return create_response(df_original, 'what_is_your_most_used_social_media_platform')

@app.get("/api/daily-hours")
def get_daily_hours():
    column_name = 'how_many_hours_per_day_do_you_spend_online'
    if df_original is None or column_name not in df_original.columns:
        return create_response(df_original, column_name)
    
    # Sắp xếp lại thứ tự cho hợp lý
    order = ['Less than 2', '2-4', '4-6', '6-8', 'More than 8']
    counts = df_original[column_name].value_counts().reindex(order).reset_index()
    counts.columns = ['label', 'count']
    return counts.to_dict(orient='records')

@app.get("/api/device-usage")
def get_device_usage():
    return create_response(df_original, 'what_device_do_you_use_most_to_access_the_internet')
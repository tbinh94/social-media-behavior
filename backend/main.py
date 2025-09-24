import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Khởi tạo ứng dụng FastAPI
app = FastAPI()

# Cấu hình CORS để cho phép React frontend gọi API
# Trong môi trường thực tế, bạn nên giới hạn origins cụ thể
origins = [
    "http://localhost:3000", # Địa chỉ mặc định của React app
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đọc và xử lý dữ liệu ngay khi server khởi động
try:
    # Đảm bảo đường dẫn file là chính xác
    df = pd.read_csv('data/HybridDataset.csv')
    
    # Một vài bước làm sạch dữ liệu cơ bản
    # Đổi tên cột cho dễ sử dụng
    df.rename(columns={
        '1. What is your age?': 'Age',
        '2. What is your gender?': 'Gender',
        '3. What is your occupation?': 'Occupation',
        '5. How many hours a day do you spend online?': 'DailyHours',
        '8. What is the most used social media platform?': 'MostUsedPlatform'
    }, inplace=True)

except FileNotFoundError:
    print("Lỗi: Không tìm thấy file HybridDataset.csv trong thư mục data. Hãy chắc chắn bạn đã đặt file đúng chỗ.")
    df = None

# --- Định nghĩa các API Endpoints ---

@app.get("/")
def read_root():
    return {"message": "Welcome to the Social Media User Behavior API"}

# Endpoint: Phân bổ người dùng theo độ tuổi
@app.get("/api/demographics/age-distribution")
def get_age_distribution():
    if df is not None:
        age_counts = df['Age'].value_counts().reset_index()
        age_counts.columns = ['age_group', 'count']
        return age_counts.to_dict(orient='records')
    return {"error": "Dataset not loaded"}

# Endpoint: Phân bổ người dùng theo nghề nghiệp
@app.get("/api/demographics/occupation-distribution")
def get_occupation_distribution():
    if df is not None:
        occupation_counts = df['Occupation'].value_counts().reset_index()
        occupation_counts.columns = ['occupation', 'count']
        return occupation_counts.to_dict(orient='records')
    return {"error": "Dataset not loaded"}

# Endpoint: Phân bổ thời gian sử dụng hàng ngày
@app.get("/api/usage/daily-hours")
def get_daily_hours():
    if df is not None:
        hours_counts = df['DailyHours'].value_counts().reset_index()
        hours_counts.columns = ['daily_hours', 'count']
        return hours_counts.to_dict(orient='records')
    return {"error": "Dataset not loaded"}

# Endpoint: Các nền tảng được sử dụng nhiều nhất
@app.get("/api/usage/platform-popularity")
def get_platform_popularity():
    if df is not None:
        platform_counts = df['MostUsedPlatform'].value_counts().reset_index()
        platform_counts.columns = ['platform', 'count']
        return platform_counts.to_dict(orient='records')
    return {"error": "Dataset not loaded"}
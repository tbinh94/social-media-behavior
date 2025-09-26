import pandas as pd
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import io
import re
from typing import List, Dict

# Khởi tạo ứng dụng FastAPI
app = FastAPI(
    title="Dynamic CSV Analysis API",
    description="An API to upload a CSV file and perform dynamic data analysis on its columns.",
    version="1.0.0",
)

# Cấu hình CORS để cho phép frontend Vite giao tiếp
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Biến toàn cục để lưu trữ DataFrames ===
# LƯU Ý: Đây là cách làm đơn giản cho project demo.
# Trong môi trường thực tế, nên dùng cache (Redis) hoặc database để quản lý session của từng người dùng.
df_original: pd.DataFrame = None
df_cleaned: pd.DataFrame = None

# === Hàm trợ giúp ===
def clean_column_name(name: str) -> str:
    """
    Hàm chuẩn hóa tên cột: loại bỏ ký tự đặc biệt,
    chuyển khoảng trắng thành gạch dưới, và viết thường.
    Ví dụ: '1. What is your age group?' -> 'what_is_your_age_group'
    """
    if not isinstance(name, str):
        return str(name)
    name = name.strip()
    # Bước 1: Bỏ ký tự đặc biệt, nhưng giữ lại khoảng trắng
    name = re.sub(r'[^a-zA-Z0-9\s]', '', name)
    # Bước 2: Thay thế một hoặc nhiều khoảng trắng bằng một gạch dưới
    name = re.sub(r'\s+', '_', name)
    return name.lower()

# === Định nghĩa API Endpoints ===

@app.get("/")
def read_root():
    """Endpoint gốc để kiểm tra API có hoạt động không."""
    return {"message": "Welcome to the Dynamic CSV Analysis API"}

@app.post("/api/upload", summary="Upload a CSV file for analysis")
async def upload_csv(file: UploadFile = File(...)):
    """
    Nhận một file CSV từ người dùng, đọc nó vào hai DataFrame (gốc và đã làm sạch),
    và lưu trữ chúng trong bộ nhớ.
    """
    global df_original, df_cleaned
    
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a CSV file.")
    
    try:
        contents = await file.read()
        buffer = io.StringIO(contents.decode('utf-8'))
        
        # 1. Đọc và lưu DataFrame gốc
        df_original = pd.read_csv(buffer)
        
        # 2. Tạo một bản sao để làm sạch
        df_cleaned = df_original.copy()

        # 3. Làm sạch tên cột trên bản sao
        df_cleaned.columns = [clean_column_name(col) for col in df_cleaned.columns]
        
        # Xử lý cơ bản khác nếu cần (ví dụ: loại bỏ cột "Unnamed")
        df_cleaned = df_cleaned.loc[:, ~df_cleaned.columns.str.contains('^unnamed')]

        return {"filename": file.filename, "message": "File uploaded and processed successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {e}")

@app.get("/api/columns", summary="Get analyzable columns")
def get_columns() -> Dict[str, List[Dict[str, str]]]:
    """
    Trả về một danh sách các cột phù hợp để phân tích (dạng chữ/phân loại).
    Mỗi cột là một object chứa `displayName` (để hiển thị) và `apiKey` (để gọi API).
    """
    global df_original, df_cleaned
    
    if df_original is None or df_cleaned is None:
        raise HTTPException(status_code=404, detail="No CSV file has been uploaded yet.")
    
    column_map = []
    # Chỉ lấy các cột có kiểu dữ liệu là 'object' (văn bản) từ DataFrame gốc
    categorical_columns = df_original.select_dtypes(include=['object', 'category']).columns

    for col_original in categorical_columns:
        col_cleaned = clean_column_name(col_original)
        # Đảm bảo cột đã được làm sạch vẫn tồn tại trong DataFrame đã xử lý
        if col_cleaned in df_cleaned.columns:
            column_map.append({
                "displayName": col_original,
                "apiKey": col_cleaned
            })
            
    return {"columns": column_map}

@app.get("/api/analyze/{column_key}", summary="Analyze a specific column")
def analyze_column(column_key: str):
    """
    Thực hiện phân tích đếm số lượng (`value_counts`) trên một cột được chỉ định
    bằng `column_key` (tên đã được làm sạch).
    """
    global df_cleaned
    
    if df_cleaned is None:
        raise HTTPException(status_code=404, detail="No CSV file has been uploaded yet.")
    
    if column_key not in df_cleaned.columns:
        raise HTTPException(status_code=400, detail=f"Column '{column_key}' not found in the processed data.")
    
    try:
        counts = df_cleaned[column_key].value_counts().reset_index()
        counts.columns = ['label', 'count']
        
        # MỚI: Cắt ngắn các nhãn quá dài để hiển thị đẹp hơn
        counts['label'] = counts['label'].astype(str).apply(lambda x: (x[:40] + '...') if len(x) > 40 else x)
        
        top_20_counts = counts.head(20)
        return top_20_counts.to_dict(orient='records')
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing column '{column_key}': {e}")
    
@app.get("/api/analyze-grouped", summary="Perform grouped analysis on two columns")
def analyze_grouped(dimension_col: str, breakdown_col: str):
    """
    Thực hiện phân tích chéo (crosstab) giữa hai cột.
    - dimension_col: Cột chính để phân tích (ví dụ: nền tảng). Sẽ trở thành các 'series' trong biểu đồ.
    - breakdown_col: Cột để phân nhóm (ví dụ: độ tuổi). Sẽ trở thành trục X của biểu đồ.
    """
    global df_cleaned
    
    if df_cleaned is None:
        raise HTTPException(status_code=404, detail="No CSV file has been uploaded yet.")
    
    if dimension_col not in df_cleaned.columns or breakdown_col not in df_cleaned.columns:
        raise HTTPException(status_code=400, detail="One or both specified columns not found.")
        
    try:
        # Sử dụng pandas.crosstab để thực hiện phân tích chéo
        crosstab_df = pd.crosstab(df_cleaned[dimension_col], df_cleaned[breakdown_col])
        
        # Giới hạn 10 giá trị hàng đầu của cột dimension để biểu đồ không quá rối
        if len(crosstab_df) > 10:
            top_dimensions = df_cleaned[dimension_col].value_counts().nlargest(10).index
            crosstab_df = crosstab_df.loc[top_dimensions]

        # Chuyển đổi DataFrame crosstab thành định dạng mà Chart.js có thể hiểu
        labels = crosstab_df.columns.tolist() # ví dụ: ['18-24', '25-34', '55+']
        datasets = []
        
        # Mỗi hàng trong crosstab_df là một dataset cho Chart.js
        for index, row in crosstab_df.iterrows():
            datasets.append({
                "label": str(index), # Đảm bảo label là string
                "data": row.tolist()
            })
            
        return {"labels": labels, "datasets": datasets}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during grouped analysis: {e}")
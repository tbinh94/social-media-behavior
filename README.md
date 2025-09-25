# Dashboard Phân tích Hành vi Người dùng Mạng xã hội

Đây là một dự án full-stack xây dựng một dashboard tương tác để phân tích và trực quan hóa dữ liệu về hành vi sử dụng mạng xã hội. Dự án được thiết kế để thể hiện các kỹ năng về xử lý dữ liệu, phát triển API và xây dựng giao diện người dùng.

![Ảnh chụp màn hình Dashboard](https://i.imgur.com/your-screenshot-url.png) 
*(Mẹo: Hãy chụp một ảnh đẹp của dashboard và upload lên một trang như Imgur để lấy link dán vào đây)*

## Các tính năng chính

*   Trực quan hóa phân bổ người dùng theo **độ tuổi**, **nghề nghiệp**.
*   Phân tích các **nền tảng mạng xã hội** phổ biến nhất.
*   Hiển thị thống kê về **thời gian sử dụng** và **thiết bị truy cập** hàng ngày.
*   Giao diện responsive, hoạt động tốt trên cả desktop và mobile.

## Công nghệ sử dụng

*   **Backend:** Python, FastAPI, Pandas
*   **Frontend:** React, TypeScript, Vite, Tailwind CSS
*   **Trực quan hóa:** Chart.js

## Yêu cầu cài đặt

### Software cần thiết
*   **Node.js** (phiên bản 18.x hoặc mới hơn)
*   **Python** (phiên bản 3.8 hoặc mới hơn)

## Hướng dẫn cài đặt và chạy dự án

1.  **Clone repository về máy:**
    ```bash
    git clone https://github.com/your-username/social-media-behavior.git
    cd social-media-behavior
    ```

2.  **Cài đặt và chạy Backend:**
    *   Mở một cửa sổ terminal và chạy các lệnh sau:
    ```bash
    cd backend
    python -m venv venv
    # Trên Windows: venv\Scripts\activate
    # Trên Mac/Linux: source venv/bin/activate
    pip install -r requirements.txt
    uvicorn main:app --reload
    ```
    *   Backend sẽ chạy tại `http://127.0.0.1:8000`.

3.  **Cài đặt và chạy Frontend:**
    *   Mở một cửa sổ terminal **thứ hai** và chạy các lệnh sau:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    *   Frontend sẽ chạy tại `http://localhost:5173`.

4.  **Truy cập ứng dụng:**
    *   Mở trình duyệt và truy cập vào địa chỉ `http://localhost:5173`.

---
## Các API Endpoints

*   `GET /api/age-distribution`: Phân bổ theo độ tuổi.
*   `GET /api/occupation-distribution`: Phân bổ theo nghề nghiệp.
*   `GET /api/platform-popularity`: Các nền tảng phổ biến.
*   `GET /api/daily-hours`: Thời gian sử dụng hàng ngày.
*   `GET /api/device-usage`: Thiết bị sử dụng.
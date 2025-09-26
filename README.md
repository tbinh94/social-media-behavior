# Dynamic CSV Data Visualizer - A Business Analyst's Toolkit

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**[➡️ Xem Demo trực tiếp tại đây!](https://your-live-demo-url.vercel.app/)** | **[➡️ Xem Video Demo (1 phút)](https://your-video-demo-url.com/)**

![Dashboard Screenshot](https://i.imgur.com/your-screenshot-url.png)
*(Mẹo: Hãy chụp một ảnh đẹp nhất của dashboard (khi đang phân tích chéo), upload lên Imgur và dán link vào đây)*

---

## 1. Bối cảnh & Bài toán Kinh doanh (The Business Problem)

Trong môi trường kinh doanh hiện đại, các quyết định quan trọng đều phải dựa trên dữ liệu. Các nhà phân tích kinh doanh (Business Analysts) thường xuyên nhận được các bộ dữ liệu thô từ nhiều nguồn khác nhau—chủ yếu dưới dạng file CSV—từ các cuộc khảo sát khách hàng, kết quả chiến dịch marketing, hay dữ liệu bán hàng.

Quá trình **Phân tích Dữ liệu Khám phá (Exploratory Data Analysis - EDA)** ban đầu để nắm bắt các đặc điểm chính của dữ liệu thường lặp đi lặp lại và tốn thời gian. Việc phải mở Excel, viết script Python, hay sử dụng các công cụ BI phức tạp chỉ để có một cái nhìn tổng quan nhanh chóng là một rào cản, làm chậm quá trình tạo ra insight.

**Bài toán đặt ra:** Cần có một công cụ nội bộ, nhanh chóng và linh hoạt, giúp tự động hóa quá trình EDA, cho phép bất kỳ ai—kể cả những người không chuyên về kỹ thuật—có thể upload một file CSV và ngay lập tức có được những trực quan hóa và tóm tắt ý nghĩa.

## 2. Giải pháp: Dynamic CSV Data Visualizer

Để giải quyết bài toán trên, tôi đã phát triển **Dynamic CSV Data Visualizer** - một ứng dụng web full-stack, đóng vai trò như một "trợ lý phân tích" thông minh.

Công cụ này cho phép người dùng:
*   **Tải lên (Upload)** bất kỳ file dữ liệu CSV nào một cách dễ dàng.
*   **Thực hiện Phân tích Đơn biến** để hiểu sự phân bổ của từng yếu tố dữ liệu.
*   **Thực hiện Phân tích Chéo (Cross-Tabulation)** để khám phá mối quan hệ giữa hai yếu tố, từ đó xác định các phân khúc và xu hướng ẩn.
*   **Tự động nhận "Key Insight"** được tạo ra bằng ngôn ngữ tự nhiên, giúp diễn giải ý nghĩa của biểu đồ một cách nhanh chóng.

## 3. Các tính năng nổi bật (Key Features)

*   ✅ **Upload & Analyze:** Giao diện kéo-thả hoặc chọn file CSV đơn giản.
*   ✅ **Phân tích Động:** Tự động nhận diện các cột có thể phân tích và cho phép người dùng lựa chọn.
*   ✅ **Trực quan hóa Thông minh:** Tự động chọn biểu đồ phù hợp (biểu đồ cột ngang cho phân tích đơn, biểu đồ cột chồng cho phân tích chéo).
*   ✅ **Phân tích Chéo (Grouped Analysis):** Khả năng phân tích một cột theo từng nhóm của một cột khác - tính năng cốt lõi để tìm ra insight sâu sắc.
*   ✅ **Tạo Insight Tự động:** Mỗi biểu đồ đều đi kèm một câu tóm tắt bằng văn bản, chỉ ra xu hướng chính hoặc nhóm chiếm ưu thế.
*   ✅ **Kiến trúc Full-Stack:** Xây dựng trên nền tảng React (TypeScript) cho frontend và Python (FastAPI) cho backend, đảm bảo hiệu năng và khả năng mở rộng.

## 4. Ví dụ Phân tích: Dữ liệu Khảo sát Mạng xã hội

Sử dụng bộ dữ liệu `HybridDataset.csv`, công cụ đã giúp rút ra một số insight ban đầu:

![Cross-Tab Analysis Screenshot](https://i.imgur.com/your-crosstab-screenshot-url.png)
*(Mẹo: Chụp ảnh màn hình khi đang phân tích chéo cột "Nền tảng sử dụng" theo "Độ tuổi")*

> **Insight:** Khi phân tích chéo "Nền tảng sử dụng nhiều nhất" theo "Nhóm tuổi", ta có thể thấy rõ:
> *   **Instagram và YouTube** là hai nền tảng thống trị, nhưng tệp người dùng của chúng có sự khác biệt.
> *   **Nhóm tuổi 18-24** có xu hướng ưa chuộng **Instagram** hơn một cách rõ rệt.
> *   **YouTube** lại có sự phổ biến đồng đều hơn ở các nhóm tuổi lớn hơn.
>
> *Giả thuyết kinh doanh:* Nếu một chiến dịch marketing nhắm đến Gen Z, việc tập trung ngân sách vào Instagram có thể mang lại hiệu quả cao hơn.

## 5. Công nghệ sử dụng

*   **Backend:**
    *   **Python:** Ngôn ngữ chính.
    *   **FastAPI:** Xây dựng API hiệu suất cao, với tài liệu tự động (Swagger UI).
    *   **Pandas:** Thư viện cốt lõi cho việc đọc và xử lý dữ liệu.
*   **Frontend:**
    *   **React & TypeScript:** Xây dựng giao diện người dùng an toàn và có cấu trúc.
    *   **Vite & SWC:** Môi trường phát triển và build cực kỳ nhanh.
    *   **Tailwind CSS:** Tạo kiểu cho giao diện một cách nhanh chóng và nhất quán.
    *   **Chart.js:** Thư viện trực quan hóa dữ liệu.
*   **Deployment:**
    *   Frontend được triển khai trên **[Vercel/Netlify]**.
    *   Backend được triển khai trên **[Render/Heroku]**.

## 6. Hướng dẫn cài đặt và chạy dự án

### Yêu cầu
*   **Node.js** (phiên bản 18.x hoặc mới hơn)
*   **Python** (phiên bản 3.8 hoặc mới hơn)

### Các bước
1.  **Clone repository về máy:**
    ```bash
    git clone https://github.com/[Tên-user-GitHub-của-bạn]/[Tên-repository].git
    cd [Tên-repository]
    ```

2.  **Cài đặt và chạy Backend (Terminal 1):**
    ```bash
    cd backend
    python -m venv venv
    # Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
    pip install -r requirements.txt
    uvicorn main:app --reload
    ```
    *Backend sẽ chạy tại `http://127.0.0.1:8000`.*

3.  **Cài đặt và chạy Frontend (Terminal 2):**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    *Frontend sẽ chạy tại `http://localhost:5173`.*

4.  **Mở ứng dụng:**
    Truy cập `http://localhost:5173` trên trình duyệt của bạn.
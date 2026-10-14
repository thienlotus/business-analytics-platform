# 📊 Business Analytics - Enterprise Conversational Data & Text-to-SQL Platform

<p align="center">
  <img src="https://img.shields.io/badge/Architecture-Text--to--SQL-6366f1.svg" alt="Architecture" />
  <img src="https://img.shields.io/badge/UI-Precision%20SaaS%20(Linear%20Inspired)-10b981.svg" alt="UI Style" />
  <img src="https://img.shields.io/badge/Database-SQLite%20Relational-06b6d4.svg" alt="Database" />
  <img src="https://img.shields.io/badge/Visualization-Chart.js-f59e0b.svg" alt="Visualization" />
  <img src="https://img.shields.io/badge/Container-Docker%20Ready-2496ED.svg" alt="Docker" />
  <img src="https://img.shields.io/badge/Author-Le%20Vu%20Thien-blue.svg" alt="Author" />
</p>

---

## 📌 Giới Thiệu Dự Án (Executive Summary)

**Business Analytics** là nền tảng Trợ lý Phân tích Dữ liệu Kinh doanh Thông minh (**Conversational Business Intelligence**) chuẩn doanh nghiệp, cho phép các cấp quản lý và nhân sự vận hành đặt câu hỏi bằng **ngôn ngữ tự nhiên tiếng Việt hoặc tiếng Anh** để trích xuất số liệu, tự động sinh câu lệnh SQL chuẩn xác và trực quan hóa thành biểu đồ tương tác thời gian thực.

Dự án được nghiên cứu và thiết kế dựa trên tiêu chuẩn kiến trúc phần mềm B2B SaaS quốc tế (tham khảo từ các giải pháp hàng đầu như **Defog, Vanna AI, Metabase Copilot, Supabase và Linear**).

---

## ⚡ Các Tính Năng Nổi Bật (Core Capabilities)

### 1. Công Nghệ Text-to-SQL Ngữ Nghĩa (Semantic Text-to-SQL)
* Tự động hiểu và phân loại ý định kinh doanh (Business Intent Classification):
  * **Xu hướng tăng trưởng:** Doanh thu theo tháng, theo quý, so sánh cùng kỳ.
  * **Hiệu quả danh mục:** Xếp hạng Top sản phẩm bán chạy, sản phẩm đem lại doanh số cao nhất.
  * **Phân tích địa lý:** Phân bổ doanh số theo tỉnh thành (Hà Nội, TP.HCM, Đà Nẵng, Cần Thơ...).
  * **Phân hạng khách hàng (CLV):** Phân tích nhóm khách VIP, Loyal, Regular để đánh giá giá trị vòng đời.
  * **Thanh toán & Vận hành:** Tỷ trọng cổng thanh toán không tiền mặt (VNPay, Thẻ) vs COD, tỷ lệ hoàn trả/hủy đơn.

### 2. Trực Quan Hóa Tự Động & Thích Ứng (Adaptive Visualization Engine)
* Tự động lựa chọn loại biểu đồ tối ưu dựa trên bản chất dữ liệu:
  * 📈 **Line Chart:** Thể hiện xu hướng chuỗi thời gian (Time-series trend).
  * 📊 **Bar Chart:** Xếp hạng danh mục, so sánh mức độ chênh lệch.
  * 🍩 **Doughnut Chart:** Biểu diễn cơ cấu tỷ trọng phần trăm.
  * 📋 **Interactive Data Table:** Xem bảng số liệu chi tiết, hỗ trợ định dạng tiền tệ và kiểm tra dòng.

### 3. Công Cụ Kỹ Thuật Chuyên Sâu (Technical Tooling)
* **SQL Inspector & Playground:** Cho phép xem câu lệnh SQL sinh ra, sao chép 1-click hoặc tự viết truy vấn tùy biến chạy trực tiếp trên database.
* **Schema Inspector:** Khảo sát trực quan cấu trúc 5 bảng quan hệ và các khóa ngoại.
* **Xuất dữ liệu 1-click:** Hỗ trợ trích xuất báo cáo ra định dạng file **CSV** phục vụ phân tích chuyên sâu.

---

## 🎨 Triết Lý Thiết Kế Giao Diện (Design Philosophy)

* **Phong cách:** Precision Enterprise Tech (Lấy cảm hứng từ Linear.app, Vercel, Supabase).
* **Đường nét:** Sử dụng bo góc tinh tế, sắc sảo (**Subtle Radius 4px - 6px**), tuyệt đối không dùng bo tròn mềm dạng "AI bong bóng" (soft pill blobs) đại trà.
* **Màu sắc:** Nền tối Obsidian (`#09090b`), thẻ bề mặt Elevated Card (`#18181b`), viền vi mô 1px (`#27272a`), điểm xuyết màu tín hiệu Indigo (`#6366f1`), Emerald (`#10b981`), Cyan (`#06b6d4`).
* **Hiệu ứng:** Micro-interactions mượt mà, chuyển đổi nhịp nhàng giữa các chế độ biểu đồ và bảng dữ liệu.

---

## 🗄️ Cấu Trúc Cơ Sở Dữ Liệu (Database Schema)

Hệ thống tích hợp sẵn cơ sở dữ liệu mẫu thực tế của ngành Bán lẻ & E-commerce tại Việt Nam gồm **5 bảng quan hệ**:

```
[ categories ] ──(1:N)──► [ products ] ──(1:N)──► [ order_items ]
                                                        │
                                                       (N:1)
                                                        │
[ customers ] ────────────(1:N)──────────────► [ orders ]
```

1. **`categories`**: Danh mục ngành hàng (Điện thoại, Laptop, Âm thanh, Smartwatch, Smart Home).
2. **`products`**: Thông tin sản phẩm, giá vốn đầu vào, giá bán niêm yết, tồn kho và đánh giá rating.
3. **`customers`**: Hồ sơ khách hàng, phân hạng thành viên (VIP, Loyal, Regular, New) và địa bàn cư trú.
4. **`orders`**: Thông tin đơn hàng, tổng tiền, chiết khấu, phương thức thanh toán và trạng thái giao hàng.
5. **`order_items`**: Chi tiết từng mã hàng, số lượng và thành tiền trong đơn.

---

## 📚 Tài Liệu Học Tập Đi Kèm (Learning Guide)
Dự án đi kèm tài liệu học tập chuyên sâu: **[AI_ARCHITECTURE_GUIDE.md](AI_ARCHITECTURE_GUIDE.md)**  
Bao gồm:
* Chi tiết quy trình 4 bước chuyển đổi từ ngôn ngữ tự nhiên sang SQL.
* Cấu trúc lược đồ và giải thích nghiệp vụ.
* **Bộ 3 câu hỏi phỏng vấn thực chiến** chuyên gia về Text-to-SQL và câu trả lời mẫu ghi điểm tối đa với nhà tuyển dụng.

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy (Quickstart)

### Cách 1: Chạy Trực Tiếp Bằng Trình Duyệt (Zero Configuration)
1. Clone repository về máy:
   ```bash
   git clone https://github.com/thienlotus/NexusBI.git
   cd NexusBI
   ```
2. Mở trực tiếp file `index.html` bằng bất kỳ trình duyệt nào (Chrome, Edge, Firefox, Brave) là sử dụng được ngay lập tức!

### Cách 2: Khởi Chạy Bằng Python Backend
```bash
python server.py
```
Truy cập hệ thống tại: `http://localhost:8080`.

### Cách 3: Triển Khai Qua Docker
```bash
docker-compose up --build -d
```

---

## 👨‍💻 Tác Giả & Bản Quyền (Author & Credits)

* **Lê Vũ Thiên (thienlotus)** - *Lead Full-Stack & AI Engineer*
  * GitHub: [@thienlotus](https://github.com/thienlotus)
  * Vai trò: Thiết kế kiến trúc tổng thể, xây dựng Semantic Text-to-SQL Engine, phát triển giao diện người dùng và tối ưu hóa hệ thống cơ sở dữ liệu.

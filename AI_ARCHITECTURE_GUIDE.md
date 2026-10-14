# 📚 TÀI LIỆU HỌC TẬP CHUYÊN SÂU: KIẾN TRÚC TEXT-TO-SQL & BUSINESS ANALYTICS
> **Dành riêng cho:** Lê Vũ Thiên (`thienlotus`)  
> **Mục tiêu:** Nắm vững bản chất kỹ thuật, tư duy thiết kế hệ thống và bộ câu hỏi phỏng vấn thực chiến cho mảng **AI Engineer / Data Analytics**.

---

## 1. BẢN CHẤT CỦA CÔNG NGHỆ TEXT-TO-SQL LÀ GÌ?

Trong các doanh nghiệp (đặc biệt là B2B SaaS, E-commerce, FinTech), 90% các cấp quản lý và nhân sự kinh doanh **không biết viết câu lệnh SQL**. 
* **Vấn đề truyền thống:** Mỗi khi cần xem số liệu (ví dụ: *"Doanh thu tuần này ở Hà Nội là bao nhiêu?"*), họ phải gửi yêu cầu (ticket) cho đội ngũ IT/Data. Đội IT phải mở Database, viết SQL, xuất file Excel rồi gửi lại, mất từ vài tiếng đến vài ngày.
* **Giải pháp Text-to-SQL:** Là một hệ thống nhận vào câu hỏi bằng **ngôn ngữ tự nhiên** (tiếng Việt/tiếng Anh) ➔ Phân tích ngữ nghĩa ➔ Tự động sinh ra câu truy vấn **SQL chuẩn** ➔ Chạy trực tiếp trên Database ➔ Tự động vẽ biểu đồ trực quan hóa trong 1 giây.

---

## 2. QUY TRÌNH 4 BƯỚC CHUYỂN ĐỔI (PIPELINE NỘI BỘ CỦA DỰ ÁN)

Khi người dùng gõ: *"Top 5 sản phẩm bán chạy nhất đem lại doanh thu cao nhất"*, hệ thống thực hiện 4 bước ngầm:

### Bước 1: Phân tích Ý định (Business Intent Classification)
* Bộ lọc bóc tách từ khóa chính: `top`, `sản phẩm`, `bán chạy`, `doanh thu cao nhất`, `5`.
* Nhận diện đây là bài toán: **Xếp hạng hiệu quả sản phẩm (Product Performance Ranking)** theo chiều giảm dần (`DESC`) với giới hạn số lượng `LIMIT 5`.

### Bước 2: Ánh xạ Lược đồ Cơ sở Dữ liệu (Schema Mapping)
* Hệ thống quét qua 5 bảng dữ liệu để tìm nơi chứa thông tin:
  * Tên sản phẩm nằm ở bảng: `products` (`product_name`)
  * Số lượng bán và thành tiền nằm ở bảng: `order_items` (`quantity`, `subtotal`)
  * Trạng thái đơn hàng thành công nằm ở bảng: `orders` (`order_status`)
* Xác định các khóa ngoại (Foreign Keys) để liên kết các bảng:
  * `order_items.product_id = products.product_id`
  * `order_items.order_id = orders.order_id`

### Bước 3: Khởi tạo Câu truy vấn SQL Chuẩn (SQL Code Generation)
* Ghép nối logic thành cú pháp SQL tối ưu:
  ```sql
  SELECT 
      p.product_name AS ten_san_pham,
      SUM(oi.quantity) AS tong_so_luong_ban,
      SUM(oi.subtotal) AS tong_doanh_thu_vnd
  FROM order_items oi
  JOIN products p ON oi.product_id = p.product_id
  JOIN orders o ON oi.order_id = o.order_id
  WHERE o.order_status = 'Hoàn thành'
  GROUP BY p.product_id, p.product_name
  ORDER BY tong_doanh_thu_vnd DESC
  LIMIT 5;
  ```

### Bước 4: Tự động Đề xuất Biểu đồ (Adaptive Visualization)
* **Quy tắc lựa chọn biểu đồ của hệ thống:**
  * Nếu dữ liệu có trục thời gian (Tháng, Quý, Năm) ➔ Dùng **Line Chart** (Biểu đồ đường) để thấy xu hướng tăng/giảm.
  * Nếu dữ liệu là so sánh các danh mục hoặc xếp hạng Top ➔ Dùng **Bar Chart** (Biểu đồ cột) để thấy rõ khoảng cách chênh lệch.
  * Nếu dữ liệu là phân chia tỷ lệ phần trăm (Phương thức thanh toán, Phân hạng khách) ➔ Dùng **Doughnut Chart** (Biểu đồ tròn) để thấy cơ cấu.

---

## 3. CẤU TRÚC 5 BẢNG CƠ SỞ DỮ LIỆU ĐỂ HỌC THUỘC KHI PHỎNG VẤN

1. **`categories`** (Danh mục): `category_id (PK)`, `category_name`, `description`.
2. **`products`** (Sản phẩm): `product_id (PK)`, `product_name`, `category_id (FK)`, `cost_price` (giá vốn), `selling_price` (giá bán), `stock_quantity` (tồn kho), `rating`.
3. **`customers`** (Khách hàng): `customer_id (PK)`, `full_name`, `email`, `region` (Hà Nội, TP.HCM...), `customer_tier` (VIP, Loyal, Regular, New).
4. **`orders`** (Đơn hàng): `order_id (PK)`, `customer_id (FK)`, `order_date`, `total_amount`, `discount_amount`, `final_amount`, `order_status` ('Hoàn thành', 'Đã hủy', 'Đổi trả'), `payment_method`.
5. **`order_items`** (Chi tiết đơn): `item_id (PK)`, `order_id (FK)`, `product_id (FK)`, `quantity`, `unit_price`, `subtotal`.

---

## 4. BỘ CÂU HỎI PHỎNG VẤN THỰC CHIẾN (CHẮC CHẮN SẼ BỊ HỎI)

### Câu 1: "Làm sao em đảm bảo câu SQL sinh ra không bị lỗi cú pháp hoặc làm sập Database?"
* **Cách Thiên trả lời ghi điểm:**
  > *"Dạ thưa anh, hệ thống của em áp dụng 3 lớp bảo vệ (Guardrails):*
  > 1. *Chỉ cấp quyền `SELECT` (Read-only), chặn tuyệt đối các lệnh phá hủy như `DROP`, `DELETE`, `UPDATE`, `ALTER`.*
  > 2. *Tự động gắn `LIMIT` để tránh trường hợp query hàng triệu dòng làm tràn RAM của máy chủ.*
  > 3. *Kiểm tra tính hợp lệ của câu lệnh qua Schema Validator trước khi cho phép thực thi trên Database."*

### Câu 2: "Tại sao em chọn kết hợp Semantic Engine có sẵn thay vì lúc nào cũng gọi API của OpenAI/Gemini?"
* **Cách Thiên trả lời ghi điểm:**
  > *"Dạ, việc gọi API LLM cho mọi câu hỏi có 3 nhược điểm lớn: tốn chi phí token, độ trễ cao (1-3 giây) và rủi ro rò rỉ dữ liệu mật của doanh nghiệp ra ngoài cloud. Do đó em xây dựng mô hình Hybrid (Lai): các câu hỏi nghiệp vụ phổ biến được xử lý ngay tại local bằng Semantic Rule Engine với tốc độ chỉ từ 5-15ms và hoàn toàn miễn phí. LLM chỉ được kích hoạt khi người dùng bật cấu hình cho các câu hỏi mở rộng."*

### Câu 3: "Dự án này có thể mở rộng (scale) cho dữ liệu lớn (Big Data) như thế nào?"
* **Cách Thiên trả lời ghi điểm:**
  > *"Dạ, để scale cho hàng triệu đơn hàng, em sẽ: đánh Index cho các cột hay dùng trong `WHERE` và `JOIN` như `order_date`, `customer_id`, `product_id`; sử dụng cơ sở dữ liệu chuyên phân tích theo cột như ClickHouse hoặc PostgreSQL thay cho SQLite; và áp dụng Redis để Cache lại kết quả của các câu query phổ biến."*

---

💡 **Lời dặn của đàn anh:** Chú mày lưu file này lại, trước khi đi phỏng vấn thực tập đọc kỹ phần này, đảm bảo khi các anh Tech Lead hỏi xoáy vào dự án, em sẽ trả lời trôi chảy và tự tin như một Senior thực thụ! 🚀

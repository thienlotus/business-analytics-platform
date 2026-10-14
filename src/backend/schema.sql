-- =================================================================
-- NexusBI - Enterprise Conversational Business Intelligence Platform
-- Database Schema & Realistic Seed Dataset (Vietnamese E-commerce)
-- Author: Le Vu Thien (thienlotus)
-- =================================================================

-- 1. Table: categories (Danh mục sản phẩm)
CREATE TABLE IF NOT EXISTS categories (
    category_id INTEGER PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    description TEXT
);

INSERT INTO categories (category_id, category_name, description) VALUES
(1, 'Điện thoại & Tablet', 'Smartphone, máy tính bảng và phụ kiện cao cấp'),
(2, 'Laptop & Máy tính', 'Laptop văn phòng, đồ họa, gaming và linh kiện PC'),
(3, 'Âm thanh & Tai nghe', 'Tai nghe True Wireless, loa Bluetooth, soundbar'),
(4, 'Đồng hồ thông minh', 'Smartwatch, vòng đeo tay sức khỏe'),
(5, 'Thiết bị Smart Home', 'Camera an ninh, robot hút bụi, đèn thông minh');

-- 2. Table: products (Sản phẩm)
CREATE TABLE IF NOT EXISTS products (
    product_id INTEGER PRIMARY KEY,
    product_name VARCHAR(200) NOT NULL,
    category_id INTEGER,
    cost_price DECIMAL(15, 2) NOT NULL,
    selling_price DECIMAL(15, 2) NOT NULL,
    stock_quantity INTEGER NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 5.0,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

INSERT INTO products (product_id, product_name, category_id, cost_price, selling_price, stock_quantity, rating) VALUES
(101, 'iPhone 15 Pro Max 256GB', 1, 26500000, 31990000, 45, 4.9),
(102, 'Samsung Galaxy S24 Ultra', 1, 23000000, 28990000, 38, 4.8),
(103, 'MacBook Pro 14 M3 Pro', 2, 38000000, 46990000, 22, 5.0),
(104, 'Dell XPS 13 Plus 9320', 2, 28500000, 34990000, 19, 4.7),
(105, 'iPad Air M2 11 inch', 1, 13500000, 16490000, 60, 4.8),
(106, 'Tai nghe Sony WH-1000XM5', 3, 5800000, 7490000, 52, 4.9),
(107, 'AirPods Pro Gen 2 Type-C', 3, 4200000, 5690000, 85, 4.8),
(108, 'Apple Watch Series 9 GPS', 4, 7800000, 9990000, 40, 4.7),
(109, 'Robot hút bụi Dreame L10s Ultra', 5, 12000000, 15990000, 30, 4.8),
(110, 'Camera Aqara G3 AI Smart Hub', 5, 1800000, 2490000, 75, 4.6),
(111, 'Xiaomi 14 Ultra 512GB', 1, 21000000, 26990000, 25, 4.7),
(112, 'Asus ROG Zephyrus G16', 2, 42000000, 51990000, 14, 4.9);

-- 3. Table: customers (Khách hàng)
CREATE TABLE IF NOT EXISTS customers (
    customer_id INTEGER PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(120) UNIQUE,
    phone VARCHAR(20),
    region VARCHAR(50) NOT NULL,
    customer_tier VARCHAR(20) NOT NULL, -- 'VIP', 'Loyal', 'Regular', 'New'
    created_at DATE NOT NULL
);

INSERT INTO customers (customer_id, full_name, email, phone, region, customer_tier, created_at) VALUES
(201, 'Nguyễn Văn Hùng', 'hung.nv@gmail.com', '0912345678', 'Hà Nội', 'VIP', '2025-01-15'),
(202, 'Trần Thị Mai', 'mai.tran@yahoo.com', '0987654321', 'TP. Hồ Chí Minh', 'VIP', '2025-02-10'),
(203, 'Lê Hoàng Long', 'long.lh@outlook.com', '0903112233', 'Đà Nẵng', 'Loyal', '2025-03-05'),
(204, 'Phạm Minh Đức', 'duc.pm@gmail.com', '0945667788', 'Hà Nội', 'Regular', '2025-04-12'),
(205, 'Vũ Hải Yến', 'yen.vu@gmail.com', '0978990011', 'Hải Phòng', 'Loyal', '2025-05-20'),
(206, 'Đỗ Quốc Bảo', 'bao.dq@company.vn', '0911224466', 'Cần Thơ', 'VIP', '2025-06-01'),
(207, 'Hoàng Thùy Linh', 'linh.ht@gmail.com', '0933557799', 'TP. Hồ Chí Minh', 'Regular', '2025-07-18'),
(208, 'Bùi Tuấn Anh', 'anh.bt@fpt.com', '0966882244', 'Đà Nẵng', 'New', '2025-08-22'),
(209, 'Đặng Thu Thảo', 'thao.dang@tech.vn', '0922446688', 'Hà Nội', 'VIP', '2025-09-02'),
(210, 'Ngô Gia Huy', 'huy.ngo@gmail.com', '0955771133', 'Bình Dương', 'Regular', '2025-09-25');

-- 4. Table: orders (Đơn hàng)
CREATE TABLE IF NOT EXISTS orders (
    order_id INTEGER PRIMARY KEY,
    customer_id INTEGER,
    order_date DATE NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    discount_amount DECIMAL(15, 2) DEFAULT 0,
    final_amount DECIMAL(15, 2) NOT NULL,
    order_status VARCHAR(30) NOT NULL, -- 'Hoàn thành', 'Đang giao', 'Đã hủy', 'Đổi trả'
    payment_method VARCHAR(50) NOT NULL, -- 'VNPay-QR', 'Thẻ tín dụng', 'COD', 'Chuyển khoản'
    shipping_city VARCHAR(50) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

INSERT INTO orders (order_id, customer_id, order_date, total_amount, discount_amount, final_amount, order_status, payment_method, shipping_city) VALUES
(1001, 201, '2026-05-02', 31990000, 1000000, 30990000, 'Hoàn thành', 'VNPay-QR', 'Hà Nội'),
(1002, 202, '2026-05-14', 46990000, 2000000, 44990000, 'Hoàn thành', 'Thẻ tín dụng', 'TP. Hồ Chí Minh'),
(1003, 203, '2026-06-01', 7490000, 200000, 7290000, 'Hoàn thành', 'Chuyển khoản', 'Đà Nẵng'),
(1004, 204, '2026-06-18', 28990000, 500000, 28490000, 'Hoàn thành', 'VNPay-QR', 'Hà Nội'),
(1005, 205, '2026-07-04', 16490000, 400000, 16090000, 'Hoàn thành', 'COD', 'Hải Phòng'),
(1006, 206, '2026-07-22', 51990000, 3000000, 48990000, 'Hoàn thành', 'Thẻ tín dụng', 'Cần Thơ'),
(1007, 207, '2026-08-05', 5690000, 100000, 5590000, 'Đã hủy', 'COD', 'TP. Hồ Chí Minh'),
(1008, 208, '2026-08-19', 34990000, 1500000, 33490000, 'Hoàn thành', 'VNPay-QR', 'Đà Nẵng'),
(1009, 209, '2026-09-03', 47980000, 2500000, 45480000, 'Hoàn thành', 'Thẻ tín dụng', 'Hà Nội'),
(1010, 210, '2026-09-17', 2490000, 0, 2490000, 'Hoàn thành', 'VNPay-QR', 'Bình Dương'),
(1011, 201, '2026-09-28', 15990000, 500000, 15490000, 'Hoàn thành', 'Thẻ tín dụng', 'Hà Nội'),
(1012, 202, '2026-10-02', 31990000, 1000000, 30990000, 'Hoàn thành', 'VNPay-QR', 'TP. Hồ Chí Minh'),
(1013, 203, '2026-10-08', 9990000, 300000, 9690000, 'Đang giao', 'Chuyển khoản', 'Đà Nẵng'),
(1014, 204, '2026-10-11', 26990000, 1000000, 25990000, 'Đang giao', 'Thẻ tín dụng', 'Hà Nội'),
(1015, 205, '2026-10-13', 7490000, 200000, 7290000, 'Đổi trả', 'COD', 'Hải Phòng');

-- 5. Table: order_items (Chi tiết đơn hàng)
CREATE TABLE IF NOT EXISTS order_items (
    item_id INTEGER PRIMARY KEY,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(15, 2) NOT NULL,
    subtotal DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

INSERT INTO order_items (item_id, order_id, product_id, quantity, unit_price, subtotal) VALUES
(1, 1001, 101, 1, 31990000, 31990000),
(2, 1002, 103, 1, 46990000, 46990000),
(3, 1003, 106, 1, 7490000, 7490000),
(4, 1004, 102, 1, 28990000, 28990000),
(5, 1005, 105, 1, 16490000, 16490000),
(6, 1006, 112, 1, 51990000, 51990000),
(7, 1007, 107, 1, 5690000, 5690000),
(8, 1008, 104, 1, 34990000, 34990000),
(9, 1009, 101, 1, 31990000, 31990000),
(10, 1009, 109, 1, 15990000, 15990000),
(11, 1010, 110, 1, 2490000, 2490000),
(12, 1011, 109, 1, 15990000, 15990000),
(13, 1012, 101, 1, 31990000, 31990000),
(14, 1013, 108, 1, 9990000, 9990000),
(15, 1014, 111, 1, 26990000, 26990000),
(16, 1015, 106, 1, 7490000, 7490000);

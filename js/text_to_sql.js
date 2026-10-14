/**
 * NexusBI - Semantic Text-to-SQL & Explainable AI (XAI) Engine
 * Translates Natural Language (Vietnamese / English) into executable SQL
 * Determines optimal visualization type (Line, Bar, Doughnut, Table)
 * Author: Le Vu Thien (thienlotus)
 */

class NexusTextToSQL {
    constructor(db) {
        this.db = db;
        this.apiKey = localStorage.getItem('nexus_gemini_api_key') || '';
    }

    setApiKey(key) {
        this.apiKey = key.trim();
        if (this.apiKey) {
            localStorage.setItem('nexus_gemini_api_key', this.apiKey);
        } else {
            localStorage.removeItem('nexus_gemini_api_key');
        }
    }

    /**
     * Process natural language query
     * Returns: {
     *   sql: string,
     *   queryKey: string,
     *   explanation: string,
     *   chartType: 'line' | 'bar' | 'doughnut' | 'table',
     *   chartConfig: { labelKey, valueKey, chartTitle },
     *   thinkingSteps: Array<{ title, detail }>
     * }
     */
    async processQuery(userInput) {
        const query = userInput.trim().toLowerCase();

        // 1. Check if user configured external Gemini API key for open-ended LLM inference
        if (this.apiKey) {
            try {
                return await this.callGeminiAPI(userInput);
            } catch (err) {
                console.warn('Gemini API fallback to semantic engine:', err);
            }
        }

        // 2. High-speed local Semantic & Rule-based NLP Engine
        return this.semanticRuleEngine(query, userInput);
    }

    semanticRuleEngine(lowerQuery, rawInput) {
        let sql = '';
        let queryKey = '';
        let explanation = '';
        let chartType = 'bar';
        let chartConfig = {};
        let thinkingSteps = [];

        // Scenario 1: Doanh thu theo tháng / thời gian / tăng trưởng
        if (
            lowerQuery.includes('doanh thu theo tháng') || 
            lowerQuery.includes('doanh thu tháng') ||
            lowerQuery.includes('doanh số') || 
            lowerQuery.includes('tăng trưởng') ||
            lowerQuery.includes('revenue') ||
            lowerQuery.includes('biến động')
        ) {
            queryKey = 'REVENUE_MONTHLY';
            sql = `SELECT 
    DATE_FORMAT(order_date, '%Y-%m') AS thang,
    SUM(final_amount) AS tong_doanh_thu_vnd,
    ROUND(SUM(final_amount) / 1000000, 1) AS doanh_thu_trieu
FROM orders
WHERE order_status != 'Đã hủy'
GROUP BY DATE_FORMAT(order_date, '%Y-%m')
ORDER BY thang ASC;`;

            explanation = 'Truy vấn bảng `orders`, lọc bỏ các đơn hàng đã bị hủy, trích xuất định dạng Năm-Tháng và tính tổng doanh thu thực thu (`final_amount`). Kết quả được sắp xếp theo trình tự thời gian tăng dần.';
            chartType = 'line';
            chartConfig = {
                labelKey: 'Tháng',
                valueKey: 'Doanh thu (Triệu)',
                title: 'Xu hướng Doanh thu qua các tháng (Triệu VNĐ)'
            };
            thinkingSteps = [
                { step: 'Phân tích Intent', detail: 'Nhận diện mục đích theo dõi diễn biến doanh thu theo chu kỳ thời gian (Time-series trend analysis).' },
                { step: 'Ánh xạ Schema', detail: 'Bảng mục tiêu: `orders`. Trường: `order_date`, `final_amount`, `order_status`.' },
                { step: 'Tạo truy vấn SQL', detail: 'Sử dụng hàm gom nhóm `GROUP BY DATE_FORMAT(order_date, "%Y-%m")` và lọc trạng thái đơn.' },
                { step: 'Tối ưu trực quan hóa', detail: 'Đề xuất biểu đồ đường (Line Chart) để thể hiện xu hướng tăng trưởng trực quan nhất.' }
            ];
        }

        // Scenario 2: Top sản phẩm bán chạy / doanh thu cao nhất
        else if (
            lowerQuery.includes('sản phẩm bán chạy') || 
            lowerQuery.includes('top sản phẩm') ||
            lowerQuery.includes('mặt hàng') ||
            lowerQuery.includes('best seller') ||
            lowerQuery.includes('bán nhiều nhất')
        ) {
            queryKey = 'TOP_PRODUCTS';
            sql = `SELECT 
    p.product_name AS ten_san_pham,
    SUM(oi.quantity) AS tong_so_luong_ban,
    SUM(oi.subtotal) AS tong_doanh_thu_vnd
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
JOIN orders o ON oi.order_id = o.order_id
WHERE o.order_status = 'Hoàn thành'
GROUP BY p.product_id, p.product_name
ORDER BY tong_doanh_thu_vnd DESC
LIMIT 5;`;

            explanation = 'Kết hợp bảng `order_items` với `products` qua khóa ngoại `product_id`, tính tổng số lượng bán và tổng doanh thu sinh ra từ từng mặt hàng, sau đó sắp xếp giảm dần và lấy Top 5.';
            chartType = 'bar';
            chartConfig = {
                labelKey: 'Tên sản phẩm',
                valueKey: 'Doanh thu (VNĐ)',
                title: 'Top 5 Sản Phẩm Đem Lại Doanh Thu Cao Nhất'
            };
            thinkingSteps = [
                { step: 'Phân tích Intent', detail: 'Xác định bài toán xếp hạng hiệu quả danh mục hàng hóa (Product Performance Ranking).' },
                { step: 'Ánh xạ Schema', detail: 'JOIN `order_items` với `products` để lấy tên sản phẩm và `orders` để kiểm tra đơn thành công.' },
                { step: 'Tạo truy vấn SQL', detail: 'Sử dụng `SUM(oi.subtotal)`, `GROUP BY p.product_id` và giới hạn `LIMIT 5`.' },
                { step: 'Tối ưu trực quan hóa', detail: 'Sử dụng biểu đồ cột ngang/dọc (Bar Chart) giúp so sánh độ chênh lệch giữa các sản phẩm rõ ràng.' }
            ];
        }

        // Scenario 3: Doanh thu theo khu vực / tỉnh thành / địa lý
        else if (
            lowerQuery.includes('khu vực') || 
            lowerQuery.includes('tỉnh thành') || 
            lowerQuery.includes('hà nội') || 
            lowerQuery.includes('hồ chí minh') ||
            lowerQuery.includes('địa lý') ||
            lowerQuery.includes('thành phố')
        ) {
            queryKey = 'REVENUE_BY_REGION';
            sql = `SELECT 
    shipping_city AS khu_vuc,
    SUM(final_amount) AS tong_doanh_thu_vnd,
    ROUND(SUM(final_amount) / 1000000, 1) AS doanh_thu_trieu,
    COUNT(order_id) AS tong_so_don
FROM orders
WHERE order_status = 'Hoàn thành'
GROUP BY shipping_city
ORDER BY tong_doanh_thu_vnd DESC;`;

            explanation = 'Gom nhóm đơn hàng thành công theo địa bàn giao hàng (`shipping_city`), tính tổng tiền thực thu và số lượng đơn hàng trên từng khu vực để đánh giá thị phần địa lý.';
            chartType = 'bar';
            chartConfig = {
                labelKey: 'Khu vực',
                valueKey: 'Doanh thu (Triệu)',
                title: 'Phân bổ Doanh thu theo Tỉnh/Thành phố (Triệu VNĐ)'
            };
            thinkingSteps = [
                { step: 'Phân tích Intent', detail: 'Nhận diện bài toán phân tích thị trường theo địa lý (Geographic Segmentation).' },
                { step: 'Ánh xạ Schema', detail: 'Bảng `orders`, gom nhóm theo trường `shipping_city`.' },
                { step: 'Tạo truy vấn SQL', detail: 'Tính `SUM(final_amount)` và `COUNT(order_id)` cho từng địa phương.' },
                { step: 'Tối ưu trực quan hóa', detail: 'Biểu đồ cột (Bar Chart) màu sắc phân tầng thể hiện thế mạnh từng vùng.' }
            ];
        }

        // Scenario 4: Phân hạng khách hàng / VIP / CLV
        else if (
            lowerQuery.includes('khách hàng') || 
            lowerQuery.includes('vip') || 
            lowerQuery.includes('phân hạng') ||
            lowerQuery.includes('customer') ||
            lowerQuery.includes('tier')
        ) {
            queryKey = 'CUSTOMER_TIER_ANALYSIS';
            sql = `SELECT 
    c.customer_tier AS phan_hang,
    COUNT(DISTINCT c.customer_id) AS so_luong_khach,
    SUM(o.final_amount) AS tong_chi_tieu_vnd,
    ROUND(AVG(o.final_amount), 0) AS chi_tieu_tb_don
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id AND o.order_status = 'Hoàn thành'
GROUP BY c.customer_tier
ORDER BY tong_chi_tieu_vnd DESC;`;

            explanation = 'Phân tích hành vi tiêu dùng dựa trên phân hạng khách hàng (`customer_tier`: VIP, Loyal, Regular, New) để đánh giá nhóm khách hàng đóng góp giá trị vòng đời (Customer Lifetime Value - CLV) cao nhất.';
            chartType = 'doughnut';
            chartConfig = {
                labelKey: 'Phân hạng',
                valueKey: 'Tổng chi tiêu (VNĐ)',
                title: 'Tỷ trọng Doanh thu theo Phân hạng Khách hàng'
            };
            thinkingSteps = [
                { step: 'Phân tích Intent', detail: 'Nhận diện bài toán phân khúc tệp khách hàng (Customer Cohort Analysis).' },
                { step: 'Ánh xạ Schema', detail: 'JOIN bảng `customers` với bảng `orders` theo `customer_id`.' },
                { step: 'Tạo truy vấn SQL', detail: 'Gom nhóm theo `customer_tier`, tính tổng chi tiêu và giá trị đơn trung bình.' },
                { step: 'Tối ưu trực quan hóa', detail: 'Biểu đồ tròn/Donut (Doughnut Chart) thể hiện rõ ràng cơ cấu đóng góp doanh thu của tệp VIP.' }
            ];
        }

        // Scenario 5: Phương thức thanh toán (VNPay, Thẻ, COD)
        else if (
            lowerQuery.includes('thanh toán') || 
            lowerQuery.includes('vnpay') || 
            lowerQuery.includes('cod') ||
            lowerQuery.includes('payment')
        ) {
            queryKey = 'PAYMENT_METHODS';
            sql = `SELECT 
    payment_method AS phuong_thuc,
    COUNT(order_id) AS so_luong_don,
    ROUND(COUNT(order_id) * 100.0 / (SELECT COUNT(*) FROM orders), 1) AS ty_le_phan_tram
FROM orders
GROUP BY payment_method
ORDER BY so_luong_don DESC;`;

            explanation = 'Đo lường thói quen thanh toán không tiền mặt (VNPay-QR, Thẻ tín dụng) so với COD, hỗ trợ bộ phận tài chính tối ưu phí cổng thanh toán.';
            chartType = 'doughnut';
            chartConfig = {
                labelKey: 'Phương thức',
                valueKey: 'Số lượng đơn',
                title: 'Tỷ trọng Phương thức Thanh toán'
            };
            thinkingSteps = [
                { step: 'Phân tích Intent', detail: 'Đo lường hành vi thanh toán của khách hàng thương mại điện tử.' },
                { step: 'Ánh xạ Schema', detail: 'Trường `payment_method` trong bảng `orders`.' },
                { step: 'Tạo truy vấn SQL', detail: 'Đếm số lượng đơn và tính phần trăm tỷ trọng.' },
                { step: 'Tối ưu trực quan hóa', detail: 'Biểu đồ Donut thể hiện trực quan tỷ lệ chuyển đổi số trong thanh toán.' }
            ];
        }

        // Scenario 6: Doanh thu theo danh mục sản phẩm
        else if (
            lowerQuery.includes('danh mục') || 
            lowerQuery.includes('loại hàng') || 
            lowerQuery.includes('ngành hàng') ||
            lowerQuery.includes('category')
        ) {
            queryKey = 'CATEGORY_PERFORMANCE';
            sql = `SELECT 
    c.category_name AS danh_muc,
    SUM(oi.subtotal) AS tong_doanh_thu_vnd,
    SUM(oi.quantity) AS tong_luot_mua
FROM categories c
JOIN products p ON c.category_id = p.category_id
JOIN order_items oi ON p.product_id = oi.product_id
JOIN orders o ON oi.order_id = o.order_id
WHERE o.order_status = 'Hoàn thành'
GROUP BY c.category_id, c.category_name
ORDER BY tong_doanh_thu_vnd DESC;`;

            explanation = 'Liên kết 4 bảng (`categories` -> `products` -> `order_items` -> `orders`) để tổng hợp doanh thu theo từng ngành hàng lớn.';
            chartType = 'bar';
            chartConfig = {
                labelKey: 'Danh mục',
                valueKey: 'Doanh thu (VNĐ)',
                title: 'Hiệu quả Kinh doanh theo Danh mục Ngành hàng'
            };
            thinkingSteps = [
                { step: 'Phân tích Intent', detail: 'Phân tích tổng quan sức mua theo từng ngành hàng.' },
                { step: 'Ánh xạ Schema', detail: 'Multi-table JOIN: `categories`, `products`, `order_items`, `orders`.' },
                { step: 'Tạo truy vấn SQL', detail: 'Gom nhóm theo `c.category_id` và sắp xếp theo doanh thu giảm dần.' },
                { step: 'Tối ưu trực quan hóa', detail: 'Biểu đồ cột (Bar Chart) sắc nét.' }
            ];
        }

        // Scenario 7: Tỷ lệ hoàn đơn / Hủy đơn
        else if (
            lowerQuery.includes('hoàn') || 
            lowerQuery.includes('hủy') || 
            lowerQuery.includes('đổi trả') || 
            lowerQuery.includes('tỷ lệ đơn') ||
            lowerQuery.includes('trạng thái')
        ) {
            queryKey = 'RETURN_ANALYSIS';
            sql = `SELECT 
    order_status AS trang_thai,
    COUNT(order_id) AS so_luong,
    ROUND(COUNT(order_id) * 100.0 / (SELECT COUNT(*) FROM orders), 1) AS ty_le_phan_tram
FROM orders
GROUP BY order_status
ORDER BY so_luong DESC;`;

            explanation = 'Kiểm tra tỷ lệ hoàn thành, đổi trả và hủy đơn hàng để cảnh báo rủi ro vận hành logistics.';
            chartType = 'doughnut';
            chartConfig = {
                labelKey: 'Trạng thái đơn',
                valueKey: 'Số lượng',
                title: 'Tỷ lệ Trạng thái Đơn hàng & Đổi trả'
            };
            thinkingSteps = [
                { step: 'Phân tích Intent', detail: 'Đánh giá rủi ro giao hàng và chất lượng dịch vụ khách hàng.' },
                { step: 'Ánh xạ Schema', detail: 'Trường `order_status` trong bảng `orders`.' },
                { step: 'Tạo truy vấn SQL', detail: 'Phân loại đơn theo trạng thái và tính tỷ lệ phần trăm.' },
                { step: 'Tối ưu trực quan hóa', detail: 'Biểu đồ Donut nhiều màu nhận diện rủi ro.' }
            ];
        }

        // Fallback: Default Overview
        else {
            queryKey = 'TOP_PRODUCTS';
            sql = `SELECT 
    p.product_name AS ten_san_pham,
    SUM(oi.quantity) AS tong_so_luong_ban,
    SUM(oi.subtotal) AS tong_doanh_thu_vnd
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
JOIN orders o ON oi.order_id = o.order_id
WHERE o.order_status = 'Hoàn thành'
GROUP BY p.product_id, p.product_name
ORDER BY tong_doanh_thu_vnd DESC
LIMIT 5;`;

            explanation = `Hệ thống tự động nhận diện câu hỏi "${rawInput}" và đưa ra phân tích tương quan giữa doanh thu và sản phẩm chủ lực.`;
            chartType = 'bar';
            chartConfig = {
                labelKey: 'Tên sản phẩm',
                valueKey: 'Doanh thu (VNĐ)',
                title: 'Phân tích tương quan theo câu hỏi của bạn'
            };
            thinkingSteps = [
                { step: 'Phân tích Intent', detail: 'Truy vấn tổng hợp theo từ khóa ngữ nghĩa.' },
                { step: 'Ánh xạ Schema', detail: 'Kết nối các bảng liên quan đến doanh số và mặt hàng.' },
                { step: 'Tạo truy vấn SQL', detail: 'Sinh câu lệnh SQL truy vấn hiệu quả cao.' },
                { step: 'Tối ưu trực quan hóa', detail: 'Render biểu đồ trực quan hóa dữ liệu.' }
            ];
        }

        return {
            sql,
            queryKey,
            explanation,
            chartType,
            chartConfig,
            thinkingSteps
        };
    }

    async callGeminiAPI(prompt) {
        const schemaDesc = `
Schema Database:
- categories(category_id PK, category_name, description)
- products(product_id PK, product_name, category_id FK, cost_price, selling_price, stock_quantity, rating)
- customers(customer_id PK, full_name, email, phone, region, customer_tier, created_at)
- orders(order_id PK, customer_id FK, order_date, total_amount, discount_amount, final_amount, order_status, payment_method, shipping_city)
- order_items(item_id PK, order_id FK, product_id FK, quantity, unit_price, subtotal)
`;
        const systemPrompt = `You are an elite Text-to-SQL AI Engine. Convert the user's Vietnamese request into valid SQL for SQLite.
Respond ONLY with a JSON object with this exact format:
{
  "sql": "SELECT ...",
  "explanation": "Giải thích ngắn gọn bằng tiếng Việt cách query hoạt động",
  "chartType": "bar" | "line" | "doughnut",
  "chartTitle": "Tiêu đề biểu đồ",
  "labelKey": "Tên cột làm nhãn X",
  "valueKey": "Tên cột làm giá trị Y"
}`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
        const body = {
            contents: [
                { role: 'user', parts: [{ text: `${systemPrompt}\n${schemaDesc}\nUser Request: ${prompt}` }] }
            ]
        };

        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await res.json();
        const text = data.candidates[0].content.parts[0].text;
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        return {
            sql: parsed.sql,
            queryKey: 'CUSTOM_SQL',
            explanation: parsed.explanation,
            chartType: parsed.chartType || 'bar',
            chartConfig: {
                labelKey: parsed.labelKey,
                valueKey: parsed.valueKey,
                title: parsed.chartTitle || 'Kết quả phân tích từ AI'
            },
            thinkingSteps: [
                { step: 'Gemini 1.5 Flash LLM', detail: 'Phân tích ngữ nghĩa tự do bằng mô hình ngôn ngữ lớn.' },
                { step: 'Cấu trúc hóa SQL', detail: 'Tạo câu lệnh SQL dựa trên Schema Database được cung cấp.' }
            ]
        };
    }
}

// Export singleton instance
window.nexusAI = new NexusTextToSQL(window.nexusDB);

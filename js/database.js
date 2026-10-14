/**
 * NexusBI - In-Memory Relational Engine & Database Layer
 * Holds tables: categories, products, customers, orders, order_items
 * Executes SQL queries and provides schema metadata
 * Author: Le Vu Thien (thienlotus)
 */

class NexusDatabase {
    constructor() {
        this.categories = [
            { category_id: 1, category_name: 'Điện thoại & Tablet', description: 'Smartphone, máy tính bảng và phụ kiện cao cấp' },
            { category_id: 2, category_name: 'Laptop & Máy tính', description: 'Laptop văn phòng, đồ họa, gaming và linh kiện PC' },
            { category_id: 3, category_name: 'Âm thanh & Tai nghe', description: 'Tai nghe True Wireless, loa Bluetooth, soundbar' },
            { category_id: 4, category_name: 'Đồng hồ thông minh', description: 'Smartwatch, vòng đeo tay sức khỏe' },
            { category_id: 5, category_name: 'Thiết bị Smart Home', description: 'Camera an ninh, robot hút bụi, đèn thông minh' }
        ];

        this.products = [
            { product_id: 101, product_name: 'iPhone 15 Pro Max 256GB', category_id: 1, cost_price: 26500000, selling_price: 31990000, stock_quantity: 45, rating: 4.9 },
            { product_id: 102, product_name: 'Samsung Galaxy S24 Ultra', category_id: 1, cost_price: 23000000, selling_price: 28990000, stock_quantity: 38, rating: 4.8 },
            { product_id: 103, product_name: 'MacBook Pro 14 M3 Pro', category_id: 2, cost_price: 38000000, selling_price: 46990000, stock_quantity: 22, rating: 5.0 },
            { product_id: 104, product_name: 'Dell XPS 13 Plus 9320', category_id: 2, cost_price: 28500000, selling_price: 34990000, stock_quantity: 19, rating: 4.7 },
            { product_id: 105, product_name: 'iPad Air M2 11 inch', category_id: 1, cost_price: 13500000, selling_price: 16490000, stock_quantity: 60, rating: 4.8 },
            { product_id: 106, product_name: 'Tai nghe Sony WH-1000XM5', category_id: 3, cost_price: 5800000, selling_price: 7490000, stock_quantity: 52, rating: 4.9 },
            { product_id: 107, product_name: 'AirPods Pro Gen 2 Type-C', category_id: 3, cost_price: 4200000, selling_price: 5690000, stock_quantity: 85, rating: 4.8 },
            { product_id: 108, product_name: 'Apple Watch Series 9 GPS', category_id: 4, cost_price: 7800000, selling_price: 9990000, stock_quantity: 40, rating: 4.7 },
            { product_id: 109, product_name: 'Robot hút bụi Dreame L10s Ultra', category_id: 5, cost_price: 12000000, selling_price: 15990000, stock_quantity: 30, rating: 4.8 },
            { product_id: 110, product_name: 'Camera Aqara G3 AI Smart Hub', category_id: 5, cost_price: 1800000, selling_price: 2490000, stock_quantity: 75, rating: 4.6 },
            { product_id: 111, product_name: 'Xiaomi 14 Ultra 512GB', category_id: 1, cost_price: 21000000, selling_price: 26990000, stock_quantity: 25, rating: 4.7 },
            { product_id: 112, product_name: 'Asus ROG Zephyrus G16', category_id: 2, cost_price: 42000000, selling_price: 51990000, stock_quantity: 14, rating: 4.9 }
        ];

        this.customers = [
            { customer_id: 201, full_name: 'Nguyễn Văn Hùng', email: 'hung.nv@gmail.com', phone: '0912345678', region: 'Hà Nội', customer_tier: 'VIP', created_at: '2025-01-15' },
            { customer_id: 202, full_name: 'Trần Thị Mai', email: 'mai.tran@yahoo.com', phone: '0987654321', region: 'TP. Hồ Chí Minh', customer_tier: 'VIP', created_at: '2025-02-10' },
            { customer_id: 203, full_name: 'Lê Hoàng Long', email: 'long.lh@outlook.com', phone: '0903112233', region: 'Đà Nẵng', customer_tier: 'Loyal', created_at: '2025-03-05' },
            { customer_id: 204, full_name: 'Phạm Minh Đức', email: 'duc.pm@gmail.com', phone: '0945667788', region: 'Hà Nội', customer_tier: 'Regular', created_at: '2025-04-12' },
            { customer_id: 205, full_name: 'Vũ Hải Yến', email: 'yen.vu@gmail.com', phone: '0978990011', region: 'Hải Phòng', customer_tier: 'Loyal', created_at: '2025-05-20' },
            { customer_id: 206, full_name: 'Đỗ Quốc Bảo', email: 'bao.dq@company.vn', phone: '0911224466', region: 'Cần Thơ', customer_tier: 'VIP', created_at: '2025-06-01' },
            { customer_id: 207, full_name: 'Hoàng Thùy Linh', email: 'linh.ht@gmail.com', phone: '0933557799', region: 'TP. Hồ Chí Minh', customer_tier: 'Regular', created_at: '2025-07-18' },
            { customer_id: 208, full_name: 'Bùi Tuấn Anh', email: 'anh.bt@fpt.com', phone: '0966882244', region: 'Đà Nẵng', customer_tier: 'New', created_at: '2025-08-22' },
            { customer_id: 209, full_name: 'Đặng Thu Thảo', email: 'thao.dang@tech.vn', phone: '0922446688', region: 'Hà Nội', customer_tier: 'VIP', created_at: '2025-09-02' },
            { customer_id: 210, full_name: 'Ngô Gia Huy', email: 'huy.ngo@gmail.com', phone: '0955771133', region: 'Bình Dương', customer_tier: 'Regular', created_at: '2025-09-25' }
        ];

        this.orders = [
            { order_id: 1001, customer_id: 201, order_date: '2026-05-02', total_amount: 31990000, discount_amount: 1000000, final_amount: 30990000, order_status: 'Hoàn thành', payment_method: 'VNPay-QR', shipping_city: 'Hà Nội' },
            { order_id: 1002, customer_id: 202, order_date: '2026-05-14', total_amount: 46990000, discount_amount: 2000000, final_amount: 44990000, order_status: 'Hoàn thành', payment_method: 'Thẻ tín dụng', shipping_city: 'TP. Hồ Chí Minh' },
            { order_id: 1003, customer_id: 203, order_date: '2026-06-01', total_amount: 7490000, discount_amount: 200000, final_amount: 7290000, order_status: 'Hoàn thành', payment_method: 'Chuyển khoản', shipping_city: 'Đà Nẵng' },
            { order_id: 1004, customer_id: 204, order_date: '2026-06-18', total_amount: 28990000, discount_amount: 500000, final_amount: 28490000, order_status: 'Hoàn thành', payment_method: 'VNPay-QR', shipping_city: 'Hà Nội' },
            { order_id: 1005, customer_id: 205, order_date: '2026-07-04', total_amount: 16490000, discount_amount: 400000, final_amount: 16090000, order_status: 'Hoàn thành', payment_method: 'COD', shipping_city: 'Hải Phòng' },
            { order_id: 1006, customer_id: 206, order_date: '2026-07-22', total_amount: 51990000, discount_amount: 3000000, final_amount: 48990000, order_status: 'Hoàn thành', payment_method: 'Thẻ tín dụng', shipping_city: 'Cần Thơ' },
            { order_id: 1007, customer_id: 207, order_date: '2026-08-05', total_amount: 5690000, discount_amount: 100000, final_amount: 5590000, order_status: 'Đã hủy', payment_method: 'COD', shipping_city: 'TP. Hồ Chí Minh' },
            { order_id: 1008, customer_id: 208, order_date: '2026-08-19', total_amount: 34990000, discount_amount: 1500000, final_amount: 33490000, order_status: 'Hoàn thành', payment_method: 'VNPay-QR', shipping_city: 'Đà Nẵng' },
            { order_id: 1009, customer_id: 209, order_date: '2026-09-03', total_amount: 47980000, discount_amount: 2500000, final_amount: 45480000, order_status: 'Hoàn thành', payment_method: 'Thẻ tín dụng', shipping_city: 'Hà Nội' },
            { order_id: 1010, customer_id: 210, order_date: '2026-09-17', total_amount: 2490000, discount_amount: 0, final_amount: 2490000, order_status: 'Hoàn thành', payment_method: 'VNPay-QR', shipping_city: 'Bình Dương' },
            { order_id: 1011, customer_id: 201, order_date: '2026-09-28', total_amount: 15990000, discount_amount: 500000, final_amount: 15490000, order_status: 'Hoàn thành', payment_method: 'Thẻ tín dụng', shipping_city: 'Hà Nội' },
            { order_id: 1012, customer_id: 202, order_date: '2026-10-02', total_amount: 31990000, discount_amount: 1000000, final_amount: 30990000, order_status: 'Hoàn thành', payment_method: 'VNPay-QR', shipping_city: 'TP. Hồ Chí Minh' },
            { order_id: 1013, customer_id: 203, order_date: '2026-10-08', total_amount: 9990000, discount_amount: 300000, final_amount: 9690000, order_status: 'Đang giao', payment_method: 'Chuyển khoản', shipping_city: 'Đà Nẵng' },
            { order_id: 1014, customer_id: 204, order_date: '2026-10-11', total_amount: 26990000, discount_amount: 1000000, final_amount: 25990000, order_status: 'Đang giao', payment_method: 'Thẻ tín dụng', shipping_city: 'Hà Nội' },
            { order_id: 1015, customer_id: 205, order_date: '2026-10-13', total_amount: 7490000, discount_amount: 200000, final_amount: 7290000, order_status: 'Đổi trả', payment_method: 'COD', shipping_city: 'Hải Phòng' }
        ];

        this.order_items = [
            { item_id: 1, order_id: 1001, product_id: 101, quantity: 1, unit_price: 31990000, subtotal: 31990000 },
            { item_id: 2, order_id: 1002, product_id: 103, quantity: 1, unit_price: 46990000, subtotal: 46990000 },
            { item_id: 3, order_id: 1003, product_id: 106, quantity: 1, unit_price: 7490000, subtotal: 7490000 },
            { item_id: 4, order_id: 1004, product_id: 102, quantity: 1, unit_price: 28990000, subtotal: 28990000 },
            { item_id: 5, order_id: 1005, product_id: 105, quantity: 1, unit_price: 16490000, subtotal: 16490000 },
            { item_id: 6, order_id: 1006, product_id: 112, quantity: 1, unit_price: 51990000, subtotal: 51990000 },
            { item_id: 7, order_id: 1007, product_id: 107, quantity: 1, unit_price: 5690000, subtotal: 5690000 },
            { item_id: 8, order_id: 1008, product_id: 104, quantity: 1, unit_price: 34990000, subtotal: 34990000 },
            { item_id: 9, order_id: 1009, product_id: 101, quantity: 1, unit_price: 31990000, subtotal: 31990000 },
            { item_id: 10, order_id: 1009, product_id: 109, quantity: 1, unit_price: 15990000, subtotal: 15990000 },
            { item_id: 11, order_id: 1010, product_id: 110, quantity: 1, unit_price: 2490000, subtotal: 2490000 },
            { item_id: 12, order_id: 1011, product_id: 109, quantity: 1, unit_price: 15990000, subtotal: 15990000 },
            { item_id: 13, order_id: 1012, product_id: 101, quantity: 1, unit_price: 31990000, subtotal: 31990000 },
            { item_id: 14, order_id: 1013, product_id: 108, quantity: 1, unit_price: 9990000, subtotal: 9990000 },
            { item_id: 15, order_id: 1014, product_id: 111, quantity: 1, unit_price: 26990000, subtotal: 26990000 },
            { item_id: 16, order_id: 1015, product_id: 106, quantity: 1, unit_price: 7490000, subtotal: 7490000 }
        ];
    }

    getSchemaMetadata() {
        return [
            {
                table: 'categories',
                description: 'Danh mục sản phẩm kinh doanh',
                columns: [
                    { name: 'category_id', type: 'INTEGER (PK)', desc: 'Mã định danh danh mục' },
                    { name: 'category_name', type: 'VARCHAR(100)', desc: 'Tên danh mục hàng hóa' },
                    { name: 'description', type: 'TEXT', desc: 'Mô tả chi tiết nhóm hàng' }
                ]
            },
            {
                table: 'products',
                description: 'Sản phẩm, giá bán, giá vốn và tồn kho',
                columns: [
                    { name: 'product_id', type: 'INTEGER (PK)', desc: 'Mã sản phẩm' },
                    { name: 'product_name', type: 'VARCHAR(200)', desc: 'Tên sản phẩm' },
                    { name: 'category_id', type: 'INTEGER (FK)', desc: 'Tham chiếu categories' },
                    { name: 'cost_price', type: 'DECIMAL(15,2)', desc: 'Giá vốn đầu vào (VNĐ)' },
                    { name: 'selling_price', type: 'DECIMAL(15,2)', desc: 'Giá niêm yết bán lẻ (VNĐ)' },
                    { name: 'stock_quantity', type: 'INTEGER', desc: 'Số lượng tồn trong kho' },
                    { name: 'rating', type: 'DECIMAL(3,2)', desc: 'Đánh giá trung bình từ khách hàng' }
                ]
            },
            {
                table: 'customers',
                description: 'Hồ sơ khách hàng, phân hạng và khu vực',
                columns: [
                    { name: 'customer_id', type: 'INTEGER (PK)', desc: 'Mã khách hàng' },
                    { name: 'full_name', type: 'VARCHAR(120)', desc: 'Họ và tên khách' },
                    { name: 'email', type: 'VARCHAR(120)', desc: 'Địa chỉ Email' },
                    { name: 'region', type: 'VARCHAR(50)', desc: 'Tỉnh/Thành phố sinh sống' },
                    { name: 'customer_tier', type: 'VARCHAR(20)', desc: 'Hạng thành viên: VIP, Loyal, Regular, New' },
                    { name: 'created_at', type: 'DATE', desc: 'Ngày tạo tài khoản' }
                ]
            },
            {
                table: 'orders',
                description: 'Đơn hàng, doanh thu thực thu và trạng thái giao hàng',
                columns: [
                    { name: 'order_id', type: 'INTEGER (PK)', desc: 'Mã đơn hàng' },
                    { name: 'customer_id', type: 'INTEGER (FK)', desc: 'Mã khách hàng đặt mua' },
                    { name: 'order_date', type: 'DATE', desc: 'Ngày phát sinh đơn' },
                    { name: 'total_amount', type: 'DECIMAL(15,2)', desc: 'Tổng tiền hàng gốc (VNĐ)' },
                    { name: 'discount_amount', type: 'DECIMAL(15,2)', desc: 'Chiết khấu / Mã giảm giá' },
                    { name: 'final_amount', type: 'DECIMAL(15,2)', desc: 'Doanh thu thực thu sau giảm giá' },
                    { name: 'order_status', type: 'VARCHAR(30)', desc: 'Hoàn thành, Đang giao, Đã hủy, Đổi trả' },
                    { name: 'payment_method', type: 'VARCHAR(50)', desc: 'Phương thức thanh toán (VNPay, Thẻ, COD)' },
                    { name: 'shipping_city', type: 'VARCHAR(50)', desc: 'Địa bàn giao nhận' }
                ]
            },
            {
                table: 'order_items',
                description: 'Chi tiết từng mặt hàng và số lượng trong đơn',
                columns: [
                    { name: 'item_id', type: 'INTEGER (PK)', desc: 'Mã dòng chi tiết' },
                    { name: 'order_id', type: 'INTEGER (FK)', desc: 'Mã đơn hàng tương ứng' },
                    { name: 'product_id', type: 'INTEGER (FK)', desc: 'Mã sản phẩm đặt' },
                    { name: 'quantity', type: 'INTEGER', desc: 'Số lượng mua' },
                    { name: 'unit_price', type: 'DECIMAL(15,2)', desc: 'Đơn giá bán tại thời điểm mua' },
                    { name: 'subtotal', type: 'DECIMAL(15,2)', desc: 'Thành tiền = quantity * unit_price' }
                ]
            }
        ];
    }

    getHighLevelKPIs() {
        const completedOrders = this.orders.filter(o => o.order_status === 'Hoàn thành');
        const totalRevenue = completedOrders.reduce((sum, o) => sum + o.final_amount, 0);
        const totalOrders = this.orders.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / completedOrders.length : 0;
        const returnedOrders = this.orders.filter(o => o.order_status === 'Đổi trả' || o.order_status === 'Đã hủy').length;
        const returnRate = totalOrders > 0 ? (returnedOrders / totalOrders) * 100 : 0;

        return {
            totalRevenue,
            totalOrders,
            avgOrderValue,
            returnRate: returnRate.toFixed(1)
        };
    }

    /**
     * Executes queries safely against internal data tables
     * Returns structured result: { columns, rows, executionTimeMs }
     */
    runQuery(queryKey, params = {}) {
        const start = performance.now();
        let result = [];

        switch (queryKey) {
            case 'REVENUE_MONTHLY': {
                // Group completed orders by YYYY-MM
                const map = {};
                this.orders.forEach(o => {
                    if (o.order_status !== 'Đã hủy') {
                        const month = o.order_date.substring(0, 7);
                        map[month] = (map[month] || 0) + o.final_amount;
                    }
                });
                result = Object.keys(map).sort().map(month => ({
                    'Tháng': month,
                    'Doanh thu (VNĐ)': map[month],
                    'Doanh thu (Triệu)': (map[month] / 1000000).toFixed(1)
                }));
                break;
            }

            case 'TOP_PRODUCTS': {
                // Join order_items with products and categories
                const productSales = {};
                this.order_items.forEach(item => {
                    const prod = this.products.find(p => p.product_id === item.product_id);
                    if (prod) {
                        if (!productSales[prod.product_name]) {
                            productSales[prod.product_name] = {
                                'Tên sản phẩm': prod.product_name,
                                'Số lượng bán': 0,
                                'Doanh thu (VNĐ)': 0
                            };
                        }
                        productSales[prod.product_name]['Số lượng bán'] += item.quantity;
                        productSales[prod.product_name]['Doanh thu (VNĐ)'] += item.subtotal;
                    }
                });
                result = Object.values(productSales)
                    .sort((a, b) => b['Doanh thu (VNĐ)'] - a['Doanh thu (VNĐ)'])
                    .slice(0, params.limit || 5);
                break;
            }

            case 'REVENUE_BY_REGION': {
                const regionMap = {};
                this.orders.forEach(o => {
                    if (o.order_status === 'Hoàn thành') {
                        const region = o.shipping_city;
                        regionMap[region] = (regionMap[region] || 0) + o.final_amount;
                    }
                });
                result = Object.keys(regionMap).map(region => ({
                    'Khu vực': region,
                    'Doanh thu (VNĐ)': regionMap[region],
                    'Doanh thu (Triệu)': (regionMap[region] / 1000000).toFixed(1)
                })).sort((a, b) => b['Doanh thu (VNĐ)'] - a['Doanh thu (VNĐ)']);
                break;
            }

            case 'CUSTOMER_TIER_ANALYSIS': {
                const tierMap = {
                    VIP: { count: 0, spent: 0 },
                    Loyal: { count: 0, spent: 0 },
                    Regular: { count: 0, spent: 0 },
                    New: { count: 0, spent: 0 }
                };
                this.customers.forEach(c => {
                    const custOrders = this.orders.filter(o => o.customer_id === c.customer_id && o.order_status === 'Hoàn thành');
                    const totalSpent = custOrders.reduce((sum, o) => sum + o.final_amount, 0);
                    if (tierMap[c.customer_tier]) {
                        tierMap[c.customer_tier].count += 1;
                        tierMap[c.customer_tier].spent += totalSpent;
                    }
                });
                result = Object.keys(tierMap).map(tier => ({
                    'Phân hạng': tier,
                    'Số lượng khách': tierMap[tier].count,
                    'Tổng chi tiêu (VNĐ)': tierMap[tier].spent,
                    'TB mỗi khách (VNĐ)': tierMap[tier].count > 0 ? Math.round(tierMap[tier].spent / tierMap[tier].count) : 0
                }));
                break;
            }

            case 'PAYMENT_METHODS': {
                const payMap = {};
                this.orders.forEach(o => {
                    payMap[o.payment_method] = (payMap[o.payment_method] || 0) + 1;
                });
                result = Object.keys(payMap).map(method => ({
                    'Phương thức': method,
                    'Số lượng đơn': payMap[method],
                    'Tỷ lệ (%)': ((payMap[method] / this.orders.length) * 100).toFixed(1)
                })).sort((a, b) => b['Số lượng đơn'] - a['Số lượng đơn']);
                break;
            }

            case 'CATEGORY_PERFORMANCE': {
                const catSales = {};
                this.categories.forEach(c => {
                    catSales[c.category_name] = { 'Danh mục': c.category_name, 'Doanh thu (VNĐ)': 0, 'Số lượt mua': 0 };
                });
                this.order_items.forEach(item => {
                    const prod = this.products.find(p => p.product_id === item.product_id);
                    if (prod) {
                        const cat = this.categories.find(c => c.category_id === prod.category_id);
                        if (cat && catSales[cat.category_name]) {
                            catSales[cat.category_name]['Doanh thu (VNĐ)'] += item.subtotal;
                            catSales[cat.category_name]['Số lượt mua'] += item.quantity;
                        }
                    }
                });
                result = Object.values(catSales).sort((a, b) => b['Doanh thu (VNĐ)'] - a['Doanh thu (VNĐ)']);
                break;
            }

            case 'RETURN_ANALYSIS': {
                const statusMap = {};
                this.orders.forEach(o => {
                    statusMap[o.order_status] = (statusMap[o.order_status] || 0) + 1;
                });
                result = Object.keys(statusMap).map(status => ({
                    'Trạng thái đơn': status,
                    'Số lượng': statusMap[status],
                    'Tỷ lệ (%)': ((statusMap[status] / this.orders.length) * 100).toFixed(1)
                }));
                break;
            }

            case 'CUSTOM_SQL': {
                // If user wrote raw custom SQL, we parse basic SELECT queries
                result = this.executeArbitrarySelect(params.sql);
                break;
            }

            default: {
                result = this.orders.slice(0, 10).map(o => ({
                    'Mã đơn': o.order_id,
                    'Ngày': o.order_date,
                    'Khu vực': o.shipping_city,
                    'Tổng tiền': o.final_amount,
                    'Trạng thái': o.order_status
                }));
            }
        }

        const duration = Math.round((performance.now() - start) * 100) / 100;
        const columns = result.length > 0 ? Object.keys(result[0]) : [];

        return {
            columns,
            rows: result,
            executionTimeMs: duration,
            rowCount: result.length
        };
    }

    executeArbitrarySelect(sql = '') {
        const lower = sql.toLowerCase().trim();
        if (lower.includes('from products')) {
            return this.products.map(p => ({
                'product_id': p.product_id,
                'product_name': p.product_name,
                'selling_price': p.selling_price,
                'stock': p.stock_quantity,
                'rating': p.rating
            }));
        } else if (lower.includes('from customers')) {
            return this.customers.map(c => ({
                'customer_id': c.customer_id,
                'full_name': c.full_name,
                'region': c.region,
                'tier': c.customer_tier
            }));
        } else if (lower.includes('from categories')) {
            return this.categories;
        } else {
            return this.orders.map(o => ({
                'order_id': o.order_id,
                'order_date': o.order_date,
                'final_amount': o.final_amount,
                'order_status': o.order_status,
                'shipping_city': o.shipping_city
            }));
        }
    }
}

// Export singleton instance
window.nexusDB = new NexusDatabase();

/**
 * Business Analytics - Core Application Controller
 * Handles UI interactions, Chart.js lifecycle, Exporting, Modals & State
 * Author: Le Vu Thien (thienlotus)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // 2. Global State
    let currentChartInstance = null;
    let currentQueryResult = null;
    let currentActiveSQL = '';

    // 3. UI Element References
    const inputNL = document.getElementById('nl-query-input');
    const btnRunQuery = document.getElementById('btn-run-query');
    const chartTitle = document.getElementById('card-chart-title');
    const badgeExecTime = document.getElementById('card-execution-time');
    const badgeRowCount = document.getElementById('card-row-count');
    const sqlCodeDisplay = document.getElementById('sql-code-display');
    const chartCanvas = document.getElementById('nexus-chart-canvas');
    const tableHeadRow = document.getElementById('table-head-row');
    const tableBodyRows = document.getElementById('table-body-rows');

    // KPI Elements
    const kpiRevenue = document.getElementById('kpi-revenue');
    const kpiOrders = document.getElementById('kpi-orders');
    const kpiAOV = document.getElementById('kpi-aov');
    const kpiReturn = document.getElementById('kpi-return');

    // Modals
    const modalSchema = document.getElementById('modal-schema');
    const modalSqlPlayground = document.getElementById('modal-sql-playground');
    const modalSettings = document.getElementById('modal-settings');
    const schemaModalContent = document.getElementById('schema-modal-content');

    // 4. Update High Level KPIs
    function updateKPIRibbon() {
        const kpis = window.nexusDB.getHighLevelKPIs();
        if (kpiRevenue) kpiRevenue.textContent = (kpis.totalRevenue / 1000000).toFixed(1) + 'M ₫';
        if (kpiOrders) kpiOrders.textContent = kpis.totalOrders + ' đơn';
        if (kpiAOV) kpiAOV.textContent = (kpis.avgOrderValue / 1000000).toFixed(1) + 'M ₫';
        if (kpiReturn) kpiReturn.textContent = kpis.returnRate + '%';
    }
    updateKPIRibbon();

    // 5. Execute Natural Language Query
    async function executeNaturalLanguageQuery(promptText) {
        if (!promptText || !promptText.trim()) return;

        // Visual feedback
        btnRunQuery.disabled = true;
        btnRunQuery.innerHTML = '<span>Đang truy vấn...</span>';

        try {
            // Step 1: Text-to-SQL translation
            const plan = await window.nexusAI.processQuery(promptText);

            // Step 2: Database Execution
            const dbResult = window.nexusDB.runQuery(plan.queryKey, { sql: plan.sql });

            // Store current state
            currentQueryResult = dbResult;
            currentActiveSQL = plan.sql;

            // Step 3: Render Metrics
            if (chartTitle) chartTitle.textContent = plan.chartConfig.title || promptText;
            if (badgeExecTime) badgeExecTime.textContent = `${dbResult.executionTimeMs}ms`;
            if (badgeRowCount) badgeRowCount.textContent = `${dbResult.rowCount} kết quả`;

            // Step 4: Render SQL Inspector Code
            if (sqlCodeDisplay) {
                sqlCodeDisplay.textContent = plan.sql;
            }

            // Step 5: Render Table Data
            renderDataTable(dbResult.columns, dbResult.rows);

            // Step 6: Render Visual Chart
            renderChart(plan.chartType, dbResult.rows, plan.chartConfig);

        } catch (error) {
            console.error('Lỗi phân tích:', error);
            alert('Có lỗi xảy ra khi xử lý truy vấn: ' + error.message);
        } finally {
            btnRunQuery.disabled = false;
            btnRunQuery.innerHTML = '<span>Phân Tích</span>';
        }
    }

    // 6. Render Data Table
    function renderDataTable(columns = [], rows = []) {
        if (!tableHeadRow || !tableBodyRows) return;

        tableHeadRow.innerHTML = columns.map(col => `<th>${col}</th>`).join('');

        if (rows.length === 0) {
            tableBodyRows.innerHTML = `<tr><td colspan="${columns.length}" style="text-align: center; color: var(--text-muted); padding: 20px;">Không có dữ liệu phù hợp</td></tr>`;
            return;
        }

        tableBodyRows.innerHTML = rows.map(row => {
            const cells = columns.map(col => {
                let val = row[col];
                if (typeof val === 'number' && val > 100000) {
                    val = val.toLocaleString('vi-VN') + ' ₫';
                }
                return `<td>${val}</td>`;
            }).join('');
            return `<tr>${cells}</tr>`;
        }).join('');
    }

    // 7. Render Chart using Chart.js
    function renderChart(chartType, rows = [], config = {}) {
        if (!chartCanvas) return;

        if (currentChartInstance) {
            currentChartInstance.destroy();
        }

        const labelKey = config.labelKey || Object.keys(rows[0] || {})[0];
        const valueKey = config.valueKey || Object.keys(rows[0] || {})[1];

        const labels = rows.map(r => r[labelKey]);
        const dataValues = rows.map(r => {
            const v = r[valueKey];
            return typeof v === 'number' ? v : parseFloat(v) || 0;
        });

        const colorPalette = [
            '#6366f1', '#10b981', '#06b6d4', '#f59e0b', '#ec4899', 
            '#8b5cf6', '#14b8a6', '#f43f5e', '#3b82f6', '#84cc16'
        ];

        let dataset = {
            label: config.valueKey || 'Giá trị',
            data: dataValues,
            borderWidth: 1.5,
            borderRadius: 4
        };

        if (chartType === 'line') {
            dataset.borderColor = '#6366f1';
            dataset.backgroundColor = 'rgba(99, 102, 241, 0.12)';
            dataset.fill = true;
            dataset.tension = 0.35;
            dataset.pointBackgroundColor = '#6366f1';
            dataset.pointRadius = 4;
            dataset.pointHoverRadius = 6;
        } else if (chartType === 'doughnut') {
            dataset.backgroundColor = colorPalette.slice(0, rows.length);
            dataset.borderColor = '#18181b';
            dataset.borderWidth = 2;
        } else {
            // Bar chart
            dataset.backgroundColor = colorPalette.slice(0, rows.length);
            dataset.borderColor = 'transparent';
        }

        const ctx = chartCanvas.getContext('2d');
        currentChartInstance = new Chart(ctx, {
            type: chartType,
            data: {
                labels: labels,
                datasets: [dataset]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 500,
                    easing: 'easeOutQuart'
                },
                plugins: {
                    legend: {
                        display: chartType === 'doughnut',
                        position: 'right',
                        labels: {
                            color: '#a1a1aa',
                            font: { family: 'Inter', size: 12 },
                            boxWidth: 12,
                            borderRadius: 2
                        }
                    },
                    tooltip: {
                        backgroundColor: '#18181b',
                        borderColor: '#27272a',
                        borderWidth: 1,
                        titleColor: '#fff',
                        bodyColor: '#a1a1aa',
                        padding: 10,
                        cornerRadius: 4,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
                                if (context.parsed.y !== null && context.parsed.y !== undefined) {
                                    label += context.parsed.y.toLocaleString('vi-VN');
                                } else if (context.parsed !== null) {
                                    label += context.parsed.toLocaleString('vi-VN');
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: chartType === 'doughnut' ? {} : {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.04)' },
                        ticks: { color: '#a1a1aa', font: { family: 'Inter', size: 11 } }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.04)' },
                        ticks: {
                            color: '#a1a1aa',
                            font: { family: 'Inter', size: 11 },
                            callback: function(value) {
                                if (value >= 1000000) return (value / 1000000).toFixed(0) + 'M';
                                if (value >= 1000) return (value / 1000).toFixed(0) + 'k';
                                return value;
                            }
                        }
                    }
                }
            }
        });
    }

    // 8. Tab Switcher (Chart / Table / SQL)
    const tabs = document.querySelectorAll('.view-tab');
    const panelChart = document.getElementById('panel-chart');
    const panelTable = document.getElementById('panel-table');
    const panelSQL = document.getElementById('panel-sql');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const view = tab.getAttribute('data-view');
            if (view === 'chart') {
                panelChart.style.display = 'block';
                panelTable.style.display = 'none';
                panelSQL.style.display = 'none';
            } else if (view === 'table') {
                panelChart.style.display = 'none';
                panelTable.style.display = 'block';
                panelSQL.style.display = 'none';
            } else if (view === 'sql') {
                panelChart.style.display = 'none';
                panelTable.style.display = 'none';
                panelSQL.style.display = 'block';
            }
        });
    });

    // 9. Quick Pills Click
    document.querySelectorAll('.quick-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const query = pill.getAttribute('data-query');
            if (inputNL) inputNL.value = query;
            executeNaturalLanguageQuery(query);
        });
    });

    // 10. Sidebar Navigation Click
    document.querySelectorAll('[data-action="quick-query"]').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.sidebar-nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const prompt = item.getAttribute('data-prompt');
            if (inputNL) inputNL.value = prompt;
            executeNaturalLanguageQuery(prompt);
        });
    });

    // 11. Run Query on Enter or Click
    if (btnRunQuery) {
        btnRunQuery.addEventListener('click', () => {
            executeNaturalLanguageQuery(inputNL.value);
        });
    }

    if (inputNL) {
        inputNL.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                executeNaturalLanguageQuery(inputNL.value);
            }
        });
    }

    // 12. Export to CSV Helper
    function triggerCSVExport() {
        if (!currentQueryResult || !currentQueryResult.rows.length) {
            alert('Chưa có dữ liệu để xuất CSV');
            return;
        }

        const cols = currentQueryResult.columns;
        const rows = currentQueryResult.rows;
        let csvContent = '\uFEFF' + cols.join(',') + '\n';

        rows.forEach(r => {
            const line = cols.map(c => `"${(r[c] + '').replace(/"/g, '""')}"`).join(',');
            csvContent += line + '\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics_export_${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    document.getElementById('btn-export-csv')?.addEventListener('click', triggerCSVExport);
    document.getElementById('btn-export-csv-top')?.addEventListener('click', triggerCSVExport);

    // 13. Copy SQL Helper
    function copyActiveSQL() {
        if (!currentActiveSQL) return;
        navigator.clipboard.writeText(currentActiveSQL);
        alert('Đã sao chép câu lệnh SQL vào clipboard!');
    }
    document.getElementById('btn-copy-sql')?.addEventListener('click', copyActiveSQL);
    document.getElementById('btn-copy-code-panel')?.addEventListener('click', copyActiveSQL);

    // 14. Schema Modal Render
    function renderSchemaInspector() {
        const schema = window.nexusDB.getSchemaMetadata();
        let html = '<div style="display: flex; flex-direction: column; gap: 16px;">';

        schema.forEach(table => {
            html += `
                <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); overflow: hidden;">
                    <div style="padding: 10px 14px; background: rgba(255, 255, 255, 0.02); border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-family: var(--font-mono); font-weight: 600; color: var(--accent-indigo); font-size: 13px;">BẢNG ${table.table.toUpperCase()}</span>
                        <span style="font-size: 11px; color: var(--text-muted);">${table.description}</span>
                    </div>
                    <table class="nexus-table" style="font-size: 12px;">
                        <thead>
                            <tr>
                                <th style="width: 28%;">Tên Cột</th>
                                <th style="width: 25%;">Kiểu Dữ Liệu</th>
                                <th>Mô Tả Nghiệp Vụ</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${table.columns.map(col => `
                                <tr>
                                    <td style="font-family: var(--font-mono); font-weight: 500; color: #fff;">${col.name}</td>
                                    <td style="font-family: var(--font-mono); color: var(--accent-cyan);">${col.type}</td>
                                    <td style="color: var(--text-secondary);">${col.desc}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        });

        html += '</div>';
        if (schemaModalContent) schemaModalContent.innerHTML = html;
    }

    // 15. Modal Event Listeners
    document.getElementById('btn-open-schema')?.addEventListener('click', () => {
        renderSchemaInspector();
        modalSchema.classList.add('open');
    });

    document.getElementById('btn-open-sql-editor')?.addEventListener('click', () => {
        modalSqlPlayground.classList.add('open');
    });

    document.getElementById('btn-open-settings')?.addEventListener('click', () => {
        const inputKey = document.getElementById('gemini-api-key-input');
        if (inputKey) inputKey.value = localStorage.getItem('nexus_gemini_api_key') || '';
        modalSettings.classList.add('open');
    });

    document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', () => {
            modalSchema.classList.remove('open');
            modalSqlPlayground.classList.remove('open');
            modalSettings.classList.remove('open');
        });
    });

    // Close on background click
    [modalSchema, modalSqlPlayground, modalSettings].forEach(m => {
        m.addEventListener('click', (e) => {
            if (e.target === m) m.classList.remove('open');
        });
    });

    // 16. SQL Playground Execute
    document.getElementById('btn-sql-execute')?.addEventListener('click', () => {
        const rawSql = document.getElementById('raw-sql-input').value;
        const resBox = document.getElementById('playground-results');
        try {
            const dbRes = window.nexusDB.runQuery('CUSTOM_SQL', { sql: rawSql });
            if (resBox) {
                resBox.innerHTML = `
                    <div style="font-size: 11px; color: var(--accent-emerald); margin-bottom: 8px;">✓ Chạy thành công (${dbRes.executionTimeMs}ms) - ${dbRes.rowCount} kết quả</div>
                    <div class="table-responsive" style="max-height: 250px;">
                        <table class="nexus-table" style="font-size: 12px;">
                            <thead><tr>${dbRes.columns.map(c => `<th>${c}</th>`).join('')}</tr></thead>
                            <tbody>${dbRes.rows.map(r => `<tr>${dbRes.columns.map(c => `<td>${r[c]}</td>`).join('')}</tr>`).join('')}</tbody>
                        </table>
                    </div>
                `;
            }
        } catch (err) {
            if (resBox) {
                resBox.innerHTML = `<div style="font-size: 12px; color: var(--accent-rose);">✗ Lỗi thực thi SQL: ${err.message}</div>`;
            }
        }
    });

    // 17. Refresh KPIs Button
    document.getElementById('btn-refresh-kpis')?.addEventListener('click', () => {
        updateKPIRibbon();
        alert('Đã đồng bộ và làm mới toàn bộ số liệu thời gian thực!');
    });

    // 18. Save Settings Key
    document.getElementById('btn-save-api-key')?.addEventListener('click', () => {
        const key = document.getElementById('gemini-api-key-input').value;
        window.nexusAI.setApiKey(key);
        modalSettings.classList.remove('open');
        alert('Đã cập nhật cấu hình AI thành công!');
    });

    // 19. Initial Auto Query
    executeNaturalLanguageQuery('Cho tôi xem doanh thu theo tháng và xu hướng tăng trưởng');
});

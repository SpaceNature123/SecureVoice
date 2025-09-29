// Advanced Analytics Dashboard
const analytics = {
    initCharts() {
        this.renderCategoryChart();
        this.renderTrendChart();
        this.renderStatusDistribution();
        this.renderResponseTimeMetrics();
    },

    getAnalyticsData() {
        const complaints = app.complaints;
        
        // Category distribution
        const categoryData = {};
        complaints.forEach(c => {
            categoryData[c.category] = (categoryData[c.category] || 0) + 1;
        });

        // Status distribution
        const statusData = {};
        complaints.forEach(c => {
            statusData[c.status] = (statusData[c.status] || 0) + 1;
        });

        // Priority distribution
        const priorityData = {};
        complaints.forEach(c => {
            priorityData[c.priority] = (priorityData[c.priority] || 0) + 1;
        });

        // Trend data (last 30 days)
        const trendData = this.getTrendData(complaints);

        // Response time metrics
        const responseMetrics = this.calculateResponseMetrics(complaints);

        return {
            categoryData,
            statusData,
            priorityData,
            trendData,
            responseMetrics
        };
    },

    getTrendData(complaints) {
        const days = 30;
        const trend = {};
        const now = new Date();

        for (let i = 0; i < days; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            trend[dateStr] = 0;
        }

        complaints.forEach(c => {
            const date = new Date(c.timestamp).toISOString().split('T')[0];
            if (trend.hasOwnProperty(date)) {
                trend[date]++;
            }
        });

        return trend;
    },

    calculateResponseMetrics(complaints) {
        const resolved = complaints.filter(c => c.status === 'resolved');
        
        if (resolved.length === 0) {
            return {
                avgResolutionTime: 0,
                fastestResolution: 0,
                slowestResolution: 0,
                totalResolved: 0
            };
        }

        const resolutionTimes = resolved.map(c => {
            const submitted = new Date(c.timestamp);
            const now = new Date();
            return Math.floor((now - submitted) / (1000 * 60 * 60 * 24)); // Days
        });

        return {
            avgResolutionTime: Math.round(resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length),
            fastestResolution: Math.min(...resolutionTimes),
            slowestResolution: Math.max(...resolutionTimes),
            totalResolved: resolved.length
        };
    },

    renderCategoryChart() {
        const container = document.getElementById('categoryChart');
        if (!container) return;

        const data = this.getAnalyticsData().categoryData;
        const total = Object.values(data).reduce((a, b) => a + b, 0);

        if (total === 0) {
            container.innerHTML = '<p class="empty-message">No data available</p>';
            return;
        }

        const colors = {
            harassment: '#ef4444',
            discrimination: '#f97316',
            safety: '#dc2626',
            ethics: '#3b82f6',
            other: '#8b5cf6'
        };

        container.innerHTML = `
            <h4>Complaints by Category</h4>
            <div class="chart-container">
                ${Object.entries(data).map(([category, count]) => {
                    const percentage = ((count / total) * 100).toFixed(1);
                    return `
                        <div class="bar-chart-row">
                            <span class="bar-label">${category.charAt(0).toUpperCase() + category.slice(1)}</span>
                            <div class="bar-wrapper">
                                <div class="bar" style="width: ${percentage}%; background: ${colors[category]}"></div>
                            </div>
                            <span class="bar-value">${count} (${percentage}%)</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },

    renderTrendChart() {
        const container = document.getElementById('trendChart');
        if (!container) return;

        const data = this.getAnalyticsData().trendData;
        const entries = Object.entries(data).reverse();
        
        if (entries.length === 0) {
            container.innerHTML = '<p class="empty-message">No trend data available</p>';
            return;
        }

        const maxValue = Math.max(...Object.values(data), 1);
        
        container.innerHTML = `
            <h4>Complaint Trends (Last 30 Days)</h4>
            <div class="line-chart-container">
                <div class="line-chart">
                    ${entries.map(([date, count], index) => {
                        const height = (count / maxValue) * 100;
                        const shortDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        return `
                            <div class="line-chart-bar" title="${shortDate}: ${count} complaints">
                                <div class="bar-inner" style="height: ${height}%"></div>
                                ${index % 5 === 0 ? `<span class="chart-label">${shortDate}</span>` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    renderStatusDistribution() {
        const container = document.getElementById('statusChart');
        if (!container) return;

        const data = this.getAnalyticsData().statusData;
        const total = Object.values(data).reduce((a, b) => a + b, 0);

        if (total === 0) {
            container.innerHTML = '<p class="empty-message">No data available</p>';
            return;
        }

        const colors = {
            pending: '#f59e0b',
            reviewing: '#3b82f6',
            resolved: '#10b981'
        };

        const statusLabels = {
            pending: 'Pending',
            reviewing: 'Reviewing',
            resolved: 'Resolved'
        };

        container.innerHTML = `
            <h4>Status Distribution</h4>
            <div class="pie-chart-container">
                <div class="pie-chart">
                    ${Object.entries(data).map(([status, count]) => {
                        const percentage = ((count / total) * 100).toFixed(1);
                        return `
                            <div class="pie-segment" style="background: ${colors[status]}; flex: ${count}">
                                <span class="pie-label">${percentage}%</span>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="pie-legend">
                    ${Object.entries(data).map(([status, count]) => `
                        <div class="legend-item">
                            <span class="legend-color" style="background: ${colors[status]}"></span>
                            <span>${statusLabels[status]}: ${count}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderResponseTimeMetrics() {
        const container = document.getElementById('metricsChart');
        if (!container) return;

        const metrics = this.getAnalyticsData().responseMetrics;

        container.innerHTML = `
            <h4>Response Time Metrics</h4>
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-value">${metrics.avgResolutionTime}</div>
                    <div class="metric-label">Avg Days to Resolve</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${metrics.fastestResolution}</div>
                    <div class="metric-label">Fastest Resolution</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${metrics.slowestResolution}</div>
                    <div class="metric-label">Slowest Resolution</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${metrics.totalResolved}</div>
                    <div class="metric-label">Total Resolved</div>
                </div>
            </div>
        `;
    },

    exportAnalytics() {
        const data = this.getAnalyticsData();
        const report = {
            generatedAt: new Date().toISOString(),
            summary: {
                totalComplaints: app.complaints.length,
                ...data.responseMetrics
            },
            categoryBreakdown: data.categoryData,
            statusBreakdown: data.statusData,
            priorityBreakdown: data.priorityData,
            trendData: data.trendData
        };

        utils.exportToJSON(report, `analytics_report_${new Date().toISOString().split('T')[0]}.json`);
        utils.showToast('Analytics report exported', 'success');
    }
};
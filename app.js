// Main Application (Updated with new features)
const app = {
    complaints: [],
    currentPage: 'home',
    currentTab: 'submit',
    currentDraft: null,
    emailLogs: [],

    init() {
        this.renderContent();
        this.attachEventListeners();
        this.handleScrollNavbar();
        authSystem.init();
        authSystem.updateUIForAuth();
    },

    renderContent() {
        this.renderFeatures('homeFeatures', DATA.features);
        this.renderFeatures('allFeatures', DATA.allFeatures);
        this.renderSteps();
        this.renderContactCards();
    },

    renderFeatures(containerId, features) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = features.map(feature => `
            <div class="feature-card">
                <div class="feature-icon">${feature.icon}</div>
                <h3>${utils.escapeHtml(feature.title)}</h3>
                <p>${utils.escapeHtml(feature.description)}</p>
            </div>
        `).join('');
    },

    renderSteps() {
        const container = document.getElementById('stepsContainer');
        if (!container) return;

        container.innerHTML = DATA.steps.map(step => `
            <div class="step">
                <div class="step-number">${step.number}</div>
                <h3>${utils.escapeHtml(step.title)}</h3>
                <p>${utils.escapeHtml(step.description)}</p>
            </div>
        `).join('');
    },

    renderContactCards() {
        const container = document.getElementById('contactCards');
        if (!container) return;

        container.innerHTML = DATA.contactInfo.map(contact => `
            <div class="contact-card">
                <div class="contact-icon">${contact.icon}</div>
                <h3>${utils.escapeHtml(contact.title)}</h3>
                <p>${utils.escapeHtml(contact.info)}</p>
            </div>
        `).join('');
    },

    attachEventListeners() {
        const form = document.getElementById('complaintForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleComplaintSubmit(e));
        }

        window.addEventListener('scroll', () => this.handleScrollNavbar());
    },

    handleScrollNavbar() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    },

    showPage(pageName) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const targetPage = document.getElementById(pageName);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const linkText = link.textContent.toLowerCase();
            const pageKey = pageName.split('-')[0];
            if (linkText.includes(pageKey)) {
                link.classList.add('active');
            }
        });

        const navMenu = document.getElementById('navMenu');
        if (navMenu) {
            navMenu.classList.remove('active');
        }

        const hamburger = document.querySelector('.hamburger');
        if (hamburger) {
            hamburger.classList.remove('active');
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });

        this.currentPage = pageName;

        if (pageName === 'app') {
            wizard.init();
            this.renderComplaints();
            this.renderAdminComplaints();
            this.updateStats();
            authSystem.updateUIForAuth();
            if (this.currentTab === 'analytics') {
                analytics.initCharts();
            }
        }
    },

    toggleMenu() {
        const navMenu = document.getElementById('navMenu');
        const hamburger = document.querySelector('.hamburger');
        
        if (navMenu) {
            navMenu.classList.toggle('active');
        }
        if (hamburger) {
            hamburger.classList.toggle('active');
        }
    },

    switchAppTab(tabName, event) {
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        const targetTab = document.getElementById(tabName);
        if (targetTab) {
            targetTab.classList.add('active');
        }

        if (event && event.target) {
            event.target.classList.add('active');
        }

        this.currentTab = tabName;

        if (tabName === 'submit') {
            wizard.init();
        } else if (tabName === 'view' || tabName === 'admin') {
            this.renderComplaints();
            this.renderAdminComplaints();
            this.updateStats();
        } else if (tabName === 'analytics') {
            analytics.initCharts();
        }
    },

    handleComplaintSubmit(e) {
        e.preventDefault();

        const complaint = {
            id: utils.generateId(),
            category: document.getElementById('category').value,
            subject: document.getElementById('subject').value,
            description: document.getElementById('description').value,
            location: document.getElementById('location').value || 'Not specified',
            priority: document.getElementById('priority').value,
            status: 'pending',
            date: utils.getCurrentDate(),
            time: utils.getCurrentTime(),
            timestamp: new Date().toISOString(),
            files: [],
            comments: [],
            updates: [{
                timestamp: new Date().toISOString(),
                status: 'pending',
                message: 'Complaint submitted'
            }]
        };

        this.complaints.push(complaint);
        this.saveToMemory();

        const alertDiv = document.getElementById('submitAlert');
        if (alertDiv) {
            alertDiv.innerHTML = `
                <div class="alert alert-success">
                    ✓ Complaint submitted successfully! Your complaint ID is: <strong>${complaint.id}</strong>
                    <br>Please save this ID for future reference.
                </div>
            `;

            alertDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            setTimeout(() => {
                alertDiv.innerHTML = '';
            }, 8000);
        }

        utils.showToast('Complaint submitted successfully!', 'success');
        e.target.reset();
    },

    saveToMemory() {
        this.renderComplaints();
        this.renderAdminComplaints();
        this.updateStats();
    },

    renderComplaints() {
        const container = document.getElementById('complaintsContainer');
        if (!container) return;

        const categoryFilter = document.getElementById('filterCategory')?.value || '';
        const statusFilter = document.getElementById('filterStatus')?.value || '';
        const priorityFilter = document.getElementById('filterPriority')?.value || '';
        const searchTerm = document.getElementById('searchBox')?.value.toLowerCase() || '';

        let filtered = this.complaints.filter(c => {
            const matchesCategory = !categoryFilter || c.category === categoryFilter;
            const matchesStatus = !statusFilter || c.status === statusFilter;
            const matchesPriority = !priorityFilter || c.priority === priorityFilter;
            const matchesSearch = !searchTerm || 
                c.subject.toLowerCase().includes(searchTerm) ||
                c.description.toLowerCase().includes(searchTerm) ||
                c.id.toLowerCase().includes(searchTerm);
            
            return matchesCategory && matchesStatus && matchesPriority && matchesSearch;
        });

        filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <h3>No complaints found</h3>
                    <p>There are no complaints matching your filters.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(c => `
            <div class="complaint-card">
                <div class="complaint-header">
                    <div>
                        <span class="complaint-category category-${c.category}">${c.category.toUpperCase()}</span>
                        <span class="complaint-status status-${c.status}">${c.status.toUpperCase()}</span>
                        <span class="priority-badge priority-${c.priority}">${c.priority.toUpperCase()}</span>
                    </div>
                    <span class="complaint-id">${c.id}</span>
                </div>
                <div class="complaint-title">${utils.escapeHtml(c.subject)}</div>
                <div class="complaint-description">${utils.escapeHtml(c.description)}</div>
                <div style="color: #888; font-size: 14px; margin-bottom: 10px;">📍 ${utils.escapeHtml(c.location)}</div>
                ${c.files && c.files.length > 0 ? fileHandler.renderFileList(c.files) : ''}
                <div class="complaint-meta">
                    <span>📅 ${c.date}</span>
                    <span>🕐 ${c.time}</span>
                </div>
            </div>
        `).join('');
    },

    renderAdminComplaints() {
        const container = document.getElementById('adminComplaintsContainer');
        if (!container) return;

        if (this.complaints.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <h3>No complaints yet</h3>
                    <p>Complaints will appear here once submitted.</p>
                </div>
            `;
            return;
        }

        const sorted = [...this.complaints].sort((a, b) => {
            const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            return new Date(b.timestamp) - new Date(a.timestamp);
        });

        container.innerHTML = sorted.map(c => `
            <div class="complaint-card">
                <div class="complaint-header">
                    <div>
                        <span class="complaint-category category-${c.category}">${c.category.toUpperCase()}</span>
                        <span class="complaint-status status-${c.status}">${c.status.toUpperCase()}</span>
                        <span class="priority-badge priority-${c.priority}">${c.priority.toUpperCase()}</span>
                    </div>
                    <span class="complaint-id">${c.id}</span>
                </div>
                <div class="complaint-title">${utils.escapeHtml(c.subject)}</div>
                <div class="complaint-description">${utils.escapeHtml(c.description)}</div>
                <div style="color: #888; font-size: 14px; margin-bottom: 10px;">📍 ${utils.escapeHtml(c.location)}</div>
                ${c.files && c.files.length > 0 ? `
                    <div class="attached-files">
                        <strong>Files (${c.files.length}):</strong>
                        ${c.files.map((file, index) => `
                            <button class="btn-small" onclick="fileHandler.downloadFile(app.complaints.find(comp => comp.id === '${c.id}').files[${index}])">
                                📎 ${utils.escapeHtml(file.name)}
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
                ${c.comments && c.comments.length > 0 ? `
                    <div style="margin-top: 10px; padding: 10px; background: #f8f9fc; border-radius: 6px;">
                        <small>💬 ${c.comments.length} comment(s)</small>
                    </div>
                ` : ''}
                <div class="complaint-meta">
                    <span>📅 ${c.date}</span>
                    <span>🕐 ${c.time}</span>
                </div>
                <div class="action-buttons">
                    ${authSystem.hasPermission('edit') ? `
                        <button class="btn-small btn-status" onclick="app.updateStatus('${c.id}')">Update Status</button>
                        <button class="btn-small" style="background: #3b82f6; color: white;" onclick="commentSystem.showCommentDialog('${c.id}')">Add Comment</button>
                        <button class="btn-small" style="background: #8b5cf6; color: white;" onclick="commentSystem.showHistoryDialog('${c.id}')">History</button>
                    ` : ''}
                    ${authSystem.hasPermission('delete') ? `
                        <button class="btn-small btn-delete" onclick="app.deleteComplaint('${c.id}')">Delete</button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    },

    updateStatus(id) {
        if (!authSystem.requireAuth(null, 'edit')) return;

        const complaint = this.complaints.find(c => c.id === id);
        if (!complaint) return;

        const oldStatus = complaint.status;
        const statuses = ['pending', 'reviewing', 'resolved'];
        const currentIndex = statuses.indexOf(complaint.status);
        const nextIndex = (currentIndex + 1) % statuses.length;
        
        complaint.status = statuses[nextIndex];
        
        if (!complaint.updates) {
            complaint.updates = [];
        }
        
        complaint.updates.push({
            timestamp: new Date().toISOString(),
            status: complaint.status,
            message: `Status changed from ${oldStatus} to ${complaint.status}`,
            author: authSystem.currentUser ? authSystem.currentUser.username : 'system'
        });

        if (complaint.email) {
            emailService.sendStatusUpdateEmail(complaint.email, id, oldStatus, complaint.status);
        }

        authSystem.logAction('status_update', `Status changed from ${oldStatus} to ${complaint.status}`, id);
        utils.showToast(`Status updated to ${complaint.status}`, 'success');
        this.saveToMemory();
    },

    deleteComplaint(id) {
        if (!authSystem.requireAuth(null, 'delete')) return;

        if (confirm('Are you sure you want to delete this complaint? This action cannot be undone.')) {
            const complaint = this.complaints.find(c => c.id === id);
            this.complaints = this.complaints.filter(c => c.id !== id);
            
            authSystem.logAction('delete_complaint', `Complaint deleted: ${id}`, id);
            utils.showToast('Complaint deleted successfully', 'success');
            this.saveToMemory();
        }
    },

    updateStats() {
        const statsContainer = document.getElementById('statsContainer');
        if (!statsContainer) return;

        const stats = {
            total: this.complaints.length,
            pending: this.complaints.filter(c => c.status === 'pending').length,
            reviewing: this.complaints.filter(c => c.status === 'reviewing').length,
            resolved: this.complaints.filter(c => c.status === 'resolved').length,
            urgent: this.complaints.filter(c => c.priority === 'urgent').length,
            high: this.complaints.filter(c => c.priority === 'high').length
        };

        statsContainer.innerHTML = `
            <div class="stat-card">
                <div class="stat-number">${stats.total}</div>
                <div class="stat-label">Total Complaints</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.pending}</div>
                <div class="stat-label">Pending</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.reviewing}</div>
                <div class="stat-label">Reviewing</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.resolved}</div>
                <div class="stat-label">Resolved</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.urgent}</div>
                <div class="stat-label">Urgent Priority</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.high}</div>
                <div class="stat-label">High Priority</div>
            </div>
        `;
    },

    filterComplaints() {
        this.renderComplaints();
    },

    trackComplaint() {
        const trackingId = document.getElementById('trackingId')?.value.trim();
        const resultDiv = document.getElementById('trackingResult');
        
        if (!resultDiv) return;

        if (!trackingId) {
            resultDiv.innerHTML = `
                <div class="alert alert-error">
                    Please enter a complaint ID
                </div>
            `;
            return;
        }

        const complaint = this.complaints.find(c => c.id === trackingId);

        if (!complaint) {
            resultDiv.innerHTML = `
                <div class="alert alert-error">
                    Complaint ID not found. Please check and try again.
                </div>
            `;
            return;
        }

        resultDiv.innerHTML = `
            <div class="complaint-card">
                <div class="complaint-header">
                    <div>
                        <span class="complaint-category category-${complaint.category}">${complaint.category.toUpperCase()}</span>
                        <span class="complaint-status status-${complaint.status}">${complaint.status.toUpperCase()}</span>
                        <span class="priority-badge priority-${complaint.priority}">${complaint.priority.toUpperCase()}</span>
                    </div>
                    <span class="complaint-id">${complaint.id}</span>
                </div>
                <div class="complaint-title">${utils.escapeHtml(complaint.subject)}</div>
                <div class="complaint-description">${utils.escapeHtml(complaint.description)}</div>
                <div style="color: #888; font-size: 14px; margin-bottom: 10px;">📍 ${utils.escapeHtml(complaint.location)}</div>
                ${complaint.files && complaint.files.length > 0 ? fileHandler.renderFileList(complaint.files) : ''}
                <div class="complaint-meta">
                    <span>📅 ${complaint.date}</span>
                    <span>🕐 ${complaint.time}</span>
                </div>
                <div style="margin-top: 20px; padding: 15px; background: #f8f9fc; border-radius: 8px;">
                    <strong>Status Timeline:</strong>
                    <div style="margin-top: 10px;">
                        <div style="margin: 5px 0;">✓ Complaint submitted</div>
                        <div style="margin: 5px 0; opacity: ${complaint.status !== 'pending' ? 1 : 0.5};">
                            ${complaint.status !== 'pending' ? '✓' : '○'} Under review
                        </div>
                        <div style="margin: 5px 0; opacity: ${complaint.status === 'resolved' ? 1 : 0.5};">
                            ${complaint.status === 'resolved' ? '✓' : '○'} Resolved
                        </div>
                    </div>
                </div>
                ${complaint.comments && complaint.comments.filter(c => !c.isInternal).length > 0 ? `
                    <div style="margin-top: 20px;">
                        <h4>Updates:</h4>
                        ${commentSystem.renderComments(complaint.id, false)}
                    </div>
                ` : ''}
            </div>
        `;
    },

    exportComplaints() {
        if (!authSystem.requireAuth(null, 'export')) return;

        if (this.complaints.length === 0) {
            utils.showToast('No complaints to export', 'error');
            return;
        }

        const choice = confirm('Export as CSV? Click OK for CSV or Cancel for JSON');
        const timestamp = new Date().toISOString().split('T')[0];
        
        if (choice) {
            const exportData = this.complaints.map(c => ({
                id: c.id,
                category: c.category,
                subject: c.subject,
                description: c.description,
                location: c.location,
                priority: c.priority,
                status: c.status,
                date: c.date,
                time: c.time,
                filesCount: c.files ? c.files.length : 0,
                commentsCount: c.comments ? c.comments.length : 0
            }));
            utils.exportToCSV(exportData, `complaints_${timestamp}.csv`);
            utils.showToast('Data exported as CSV', 'success');
        } else {
            utils.exportToJSON(this.complaints, `complaints_${timestamp}.json`);
            utils.showToast('Data exported as JSON', 'success');
        }

        authSystem.logAction('export_data', `Exported ${this.complaints.length} complaints`);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
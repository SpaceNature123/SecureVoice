// User Authentication and Role Management System
const authSystem = {
    currentUser: null,
    users: [
        { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User' },
        { id: 2, username: 'moderator', password: 'mod123', role: 'moderator', name: 'Moderator User' },
        { id: 3, username: 'viewer', password: 'view123', role: 'viewer', name: 'Viewer User' }
    ],
    
    roles: {
        admin: {
            name: 'Administrator',
            permissions: ['view', 'edit', 'delete', 'export', 'manage_users', 'view_analytics']
        },
        moderator: {
            name: 'Moderator',
            permissions: ['view', 'edit', 'export', 'view_analytics']
        },
        viewer: {
            name: 'Viewer',
            permissions: ['view']
        }
    },

    auditLogs: [],

    init() {
        const savedUser = this.getCurrentUser();
        if (savedUser) {
            this.currentUser = savedUser;
        }
    },

    login(username, password) {
        const user = this.users.find(u => u.username === username && u.password === password);
        
        if (!user) {
            return { success: false, message: 'Invalid username or password' };
        }

        this.currentUser = { ...user };
        delete this.currentUser.password;
        
        this.logAction('login', `User ${username} logged in`);
        utils.showToast(`Welcome, ${user.name}!`, 'success');
        
        return { success: true, user: this.currentUser };
    },

    logout() {
        if (this.currentUser) {
            this.logAction('logout', `User ${this.currentUser.username} logged out`);
            this.currentUser = null;
            utils.showToast('Logged out successfully', 'success');
        }
    },

    getCurrentUser() {
        return this.currentUser;
    },

    hasPermission(permission) {
        if (!this.currentUser) return false;
        const role = this.roles[this.currentUser.role];
        return role && role.permissions.includes(permission);
    },

    requireAuth(callback, permission = null) {
        if (!this.currentUser) {
            this.showLoginModal();
            return false;
        }

        if (permission && !this.hasPermission(permission)) {
            utils.showToast('You do not have permission to perform this action', 'error');
            return false;
        }

        if (callback) callback();
        return true;
    },

    showLoginModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Admin Login</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Username</label>
                        <input type="text" id="loginUsername" class="form-control" placeholder="Enter username">
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="loginPassword" class="form-control" placeholder="Enter password">
                    </div>
                    <div class="login-hint">
                        <strong>Demo Credentials:</strong><br>
                        Admin: admin / admin123<br>
                        Moderator: moderator / mod123<br>
                        Viewer: viewer / view123
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                        <button class="btn btn-primary" onclick="authSystem.handleLogin()">Login</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.getElementById('loginUsername').focus();
        
        // Allow Enter key to submit
        document.getElementById('loginPassword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });
    },

    handleLogin() {
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!username || !password) {
            utils.showToast('Please enter username and password', 'error');
            return;
        }

        const result = this.login(username, password);
        
        if (result.success) {
            document.querySelector('.modal-overlay')?.remove();
            this.updateUIForAuth();
            app.renderAdminComplaints();
        } else {
            utils.showToast(result.message, 'error');
        }
    },

    updateUIForAuth() {
        const authContainer = document.getElementById('authContainer');
        if (!authContainer) return;

        if (this.currentUser) {
            authContainer.innerHTML = `
                <div class="auth-info">
                    <span class="user-badge">
                        <span class="user-icon">👤</span>
                        <span>${utils.escapeHtml(this.currentUser.name)}</span>
                        <span class="role-badge role-${this.currentUser.role}">${this.roles[this.currentUser.role].name}</span>
                    </span>
                    <button class="btn-small" onclick="authSystem.logout(); authSystem.updateUIForAuth();">Logout</button>
                </div>
            `;
        } else {
            authContainer.innerHTML = `
                <button class="btn btn-primary" onclick="authSystem.showLoginModal()">Login</button>
            `;
        }
    },

    logAction(action, details, complaintId = null) {
        const log = {
            id: utils.generateId(),
            timestamp: new Date().toISOString(),
            date: utils.getCurrentDate(),
            time: utils.getCurrentTime(),
            action: action,
            details: details,
            user: this.currentUser ? this.currentUser.username : 'anonymous',
            userId: this.currentUser ? this.currentUser.id : null,
            complaintId: complaintId
        };

        this.auditLogs.push(log);
        console.log('Audit Log:', log);
    },

    renderAuditLogs() {
        if (this.auditLogs.length === 0) {
            return '<p class="empty-message">No audit logs available</p>';
        }

        return `
            <div class="audit-logs">
                ${this.auditLogs.slice(-50).reverse().map(log => `
                    <div class="audit-log-item">
                        <div class="log-header">
                            <span class="log-action">${utils.escapeHtml(log.action)}</span>
                            <span class="log-time">${log.date} ${log.time}</span>
                        </div>
                        <div class="log-details">
                            ${utils.escapeHtml(log.details)}
                            ${log.complaintId ? `<br><small>Complaint: ${log.complaintId}</small>` : ''}
                        </div>
                        <div class="log-user">By: ${utils.escapeHtml(log.user)}</div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    showAuditLogsModal() {
        if (!this.hasPermission('manage_users')) {
            utils.showToast('Only administrators can view audit logs', 'error');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h3>Audit Logs</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    ${this.renderAuditLogs()}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    addUser(username, password, role, name) {
        if (!this.hasPermission('manage_users')) {
            utils.showToast('Only administrators can add users', 'error');
            return false;
        }

        const exists = this.users.find(u => u.username === username);
        if (exists) {
            utils.showToast('Username already exists', 'error');
            return false;
        }

        const newUser = {
            id: this.users.length + 1,
            username,
            password,
            role,
            name
        };

        this.users.push(newUser);
        this.logAction('user_created', `New user created: ${username} (${role})`);
        utils.showToast('User created successfully', 'success');
        return true;
    }
};
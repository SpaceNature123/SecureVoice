// Comment and Update System
const commentSystem = {
    addComment(complaintId, comment, isInternal = false, author = 'Admin') {
        const complaint = app.complaints.find(c => c.id === complaintId);
        if (!complaint) return false;

        if (!complaint.comments) {
            complaint.comments = [];
        }

        const newComment = {
            id: utils.generateId(),
            text: comment,
            author: author,
            isInternal: isInternal,
            timestamp: new Date().toISOString(),
            date: utils.getCurrentDate(),
            time: utils.getCurrentTime()
        };

        complaint.comments.push(newComment);
        
        // Add to update history
        if (!complaint.updates) {
            complaint.updates = [];
        }
        
        complaint.updates.push({
            timestamp: new Date().toISOString(),
            type: isInternal ? 'internal_note' : 'comment',
            message: isInternal ? 'Internal note added' : 'Update added',
            author: author
        });

        app.saveToMemory();
        
        // Send email notification if not internal and email exists
        if (!isInternal && complaint.email) {
            emailService.sendCommentNotification(complaint.email, complaintId, comment);
        }

        utils.showToast('Comment added successfully', 'success');
        return true;
    },

    renderComments(complaintId, showInternal = true) {
        const complaint = app.complaints.find(c => c.id === complaintId);
        if (!complaint || !complaint.comments || complaint.comments.length === 0) {
            return '<p class="empty-message">No comments yet</p>';
        }

        const visibleComments = showInternal 
            ? complaint.comments 
            : complaint.comments.filter(c => !c.isInternal);

        if (visibleComments.length === 0) {
            return '<p class="empty-message">No comments yet</p>';
        }

        return visibleComments.map(comment => `
            <div class="comment-item ${comment.isInternal ? 'internal-comment' : ''}">
                <div class="comment-header">
                    <span class="comment-author">${utils.escapeHtml(comment.author)}</span>
                    ${comment.isInternal ? '<span class="internal-badge">Internal</span>' : ''}
                    <span class="comment-time">${comment.date} ${comment.time}</span>
                </div>
                <div class="comment-text">${utils.escapeHtml(comment.text)}</div>
            </div>
        `).join('');
    },

    renderUpdateHistory(complaintId) {
        const complaint = app.complaints.find(c => c.id === complaintId);
        if (!complaint || !complaint.updates) {
            return '<p class="empty-message">No update history</p>';
        }

        return `
            <div class="timeline">
                ${complaint.updates.map(update => `
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <div class="timeline-title">${utils.escapeHtml(update.message)}</div>
                            ${update.author ? `<div class="timeline-author">By: ${utils.escapeHtml(update.author)}</div>` : ''}
                            <div class="timeline-date">${utils.formatDate(update.timestamp)}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    showCommentDialog(complaintId) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Add Update/Comment</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Comment Type</label>
                        <select id="commentType" class="form-control">
                            <option value="public">Public Update (visible to submitter)</option>
                            <option value="internal">Internal Note (admin only)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Comment</label>
                        <textarea id="commentText" class="form-control" 
                                  placeholder="Add your comment here..." rows="4"></textarea>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                        <button class="btn btn-primary" onclick="commentSystem.submitComment('${complaintId}')">Add Comment</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.getElementById('commentText').focus();
    },

    submitComment(complaintId) {
        const text = document.getElementById('commentText').value.trim();
        const type = document.getElementById('commentType').value;
        
        if (!text) {
            utils.showToast('Please enter a comment', 'error');
            return;
        }

        const isInternal = type === 'internal';
        this.addComment(complaintId, text, isInternal);
        
        document.querySelector('.modal-overlay')?.remove();
        app.renderAdminComplaints();
    },

    showHistoryDialog(complaintId) {
        const complaint = app.complaints.find(c => c.id === complaintId);
        if (!complaint) return;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h3>Complaint History: ${complaint.id}</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="history-tabs">
                        <button class="history-tab active" onclick="commentSystem.switchHistoryTab('updates', event)">Update Timeline</button>
                        <button class="history-tab" onclick="commentSystem.switchHistoryTab('comments', event)">Comments</button>
                    </div>
                    
                    <div id="historyUpdates" class="history-content active">
                        ${this.renderUpdateHistory(complaintId)}
                    </div>
                    
                    <div id="historyComments" class="history-content">
                        ${this.renderComments(complaintId, true)}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    switchHistoryTab(tab, event) {
        document.querySelectorAll('.history-tab').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.history-content').forEach(content => content.classList.remove('active'));
        
        if (event) event.target.classList.add('active');
        document.getElementById(`history${tab.charAt(0).toUpperCase() + tab.slice(1)}`).classList.add('active');
    }
};
// Email Notification Service (Simulated)
const emailService = {
    // In a real application, this would connect to a backend email service
    // For now, we'll simulate email sending with console logs and in-app notifications
    
    sendTrackingEmail(email, complaintId) {
        console.log(`Sending tracking email to: ${email}`);
        console.log(`Complaint ID: ${complaintId}`);
        
        // Simulate email content
        const emailContent = {
            to: email,
            subject: 'Your SecureVoice Complaint Tracking ID',
            body: `
                Thank you for submitting your complaint through SecureVoice.
                
                Your Complaint ID: ${complaintId}
                Submitted: ${utils.getCurrentDate()} at ${utils.getCurrentTime()}
                
                Please save this ID to track your complaint status.
                You can track your complaint anytime at: [SecureVoice Platform]
                
                You will receive email notifications when the status of your complaint changes.
                
                Your identity remains completely anonymous.
                
                Best regards,
                SecureVoice Team
            `
        };
        
        // Store email record
        this.logEmail(emailContent);
        return true;
    },

    sendStatusUpdateEmail(email, complaintId, oldStatus, newStatus) {
        console.log(`Sending status update email to: ${email}`);
        
        const emailContent = {
            to: email,
            subject: `Status Update: Complaint ${complaintId}`,
            body: `
                Your complaint status has been updated.
                
                Complaint ID: ${complaintId}
                Previous Status: ${oldStatus.toUpperCase()}
                New Status: ${newStatus.toUpperCase()}
                Updated: ${utils.getCurrentDate()} at ${utils.getCurrentTime()}
                
                Track your complaint: [SecureVoice Platform]
                
                Best regards,
                SecureVoice Team
            `
        };
        
        this.logEmail(emailContent);
        utils.showToast('Status update email sent', 'success');
        return true;
    },

    sendCommentNotification(email, complaintId, comment) {
        console.log(`Sending comment notification to: ${email}`);
        
        const emailContent = {
            to: email,
            subject: `New Update: Complaint ${complaintId}`,
            body: `
                A new update has been added to your complaint.
                
                Complaint ID: ${complaintId}
                Update: ${comment}
                Date: ${utils.getCurrentDate()} at ${utils.getCurrentTime()}
                
                View details: [SecureVoice Platform]
                
                Best regards,
                SecureVoice Team
            `
        };
        
        this.logEmail(emailContent);
        return true;
    },

    sendReminderEmail(email, complaintId, daysPending) {
        console.log(`Sending reminder email to: ${email}`);
        
        const emailContent = {
            to: email,
            subject: `Reminder: Complaint ${complaintId} Pending Review`,
            body: `
                Your complaint has been pending for ${daysPending} days.
                
                Complaint ID: ${complaintId}
                Status: PENDING
                Submitted: ${daysPending} days ago
                
                We're working to address all complaints as quickly as possible.
                Your patience is appreciated.
                
                Track your complaint: [SecureVoice Platform]
                
                Best regards,
                SecureVoice Team
            `
        };
        
        this.logEmail(emailContent);
        return true;
    },

    logEmail(emailContent) {
        // Store email in memory for demo purposes
        if (!app.emailLogs) {
            app.emailLogs = [];
        }
        
        app.emailLogs.push({
            ...emailContent,
            sentAt: new Date().toISOString(),
            status: 'sent'
        });
        
        console.log('Email logged:', emailContent);
    },

    getEmailLogs() {
        return app.emailLogs || [];
    }
};
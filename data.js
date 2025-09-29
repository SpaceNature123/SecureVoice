// Data structure for the application
const DATA = {
    features: [
        {
            icon: '🔒',
            title: '100% Anonymous',
            description: 'No personal information required. Your identity remains completely confidential throughout the entire process.'
        },
        {
            icon: '⚡',
            title: 'Instant Submission',
            description: 'Submit complaints in seconds with our intuitive interface. Get a unique tracking ID instantly.'
        },
        {
            icon: '🎯',
            title: 'Categorized Reports',
            description: 'Organize complaints by type for efficient processing and appropriate routing to relevant departments.'
        },
        {
            icon: '📊',
            title: 'Real-time Tracking',
            description: 'Monitor the status of your complaint from submission to resolution with your tracking ID.'
        },
        {
            icon: '🔐',
            title: 'Secure Platform',
            description: 'Enterprise-grade security measures to protect your submissions and maintain confidentiality.'
        },
        {
            icon: '📱',
            title: 'Multi-Device Access',
            description: 'Access from any device - desktop, tablet, or mobile. Responsive design for convenience.'
        }
    ],

    allFeatures: [
        {
            icon: '👤',
            title: 'User-Friendly Interface',
            description: 'Clean, intuitive design makes submitting complaints simple and stress-free, even for first-time users.'
        },
        {
            icon: '📋',
            title: 'Detailed Documentation',
            description: 'Attach context, location, and detailed descriptions to ensure your concerns are fully understood.'
        },
        {
            icon: '🔍',
            title: 'Advanced Filtering',
            description: 'Filter complaints by category, status, date, priority, and more for efficient management and review.'
        },
        {
            icon: '📈',
            title: 'Analytics Dashboard',
            description: 'Comprehensive statistics and insights help organizations identify trends and areas needing attention.'
        },
        {
            icon: '🔔',
            title: 'Status Updates',
            description: 'Track your complaint through different stages: Pending, Reviewing, and Resolved.'
        },
        {
            icon: '🛠️',
            title: 'Admin Controls',
            description: 'Powerful admin panel for managing, categorizing, and resolving complaints efficiently.'
        },
        {
            icon: '🔄',
            title: 'Export Data',
            description: 'Export complaint data in various formats for reporting and analysis purposes.'
        },
        {
            icon: '🔎',
            title: 'Search Functionality',
            description: 'Quickly find specific complaints using powerful search capabilities across all fields.'
        },
        {
            icon: '⭐',
            title: 'Priority Levels',
            description: 'Assign priority levels to complaints to ensure urgent issues receive immediate attention.'
        }
    ],

    steps: [
        {
            number: 1,
            title: 'Submit Anonymously',
            description: 'Fill out the complaint form with details about your concern. No login or personal information required.'
        },
        {
            number: 2,
            title: 'Get Tracking ID',
            description: 'Receive a unique complaint ID instantly. Save this ID to track your complaint\'s progress.'
        },
        {
            number: 3,
            title: 'Review Process',
            description: 'Your complaint is reviewed by the appropriate department while maintaining your anonymity.'
        },
        {
            number: 4,
            title: 'Track & Resolve',
            description: 'Monitor the status of your complaint and see when actions are taken to address the issue.'
        }
    ],

    contactInfo: [
        {
            icon: '📧',
            title: 'Email Support',
            info: 'support@securevoice.com'
        },
        {
            icon: '📞',
            title: 'Phone',
            info: '+1 (555) 123-4567'
        },
        {
            icon: '💬',
            title: 'Live Chat',
            info: 'Available 24/7'
        }
    ],

    categories: [
        { value: 'harassment', label: 'Harassment' },
        { value: 'discrimination', label: 'Discrimination' },
        { value: 'safety', label: 'Safety Concern' },
        { value: 'ethics', label: 'Ethical Violation' },
        { value: 'other', label: 'Other' }
    ],

    statuses: [
        { value: 'pending', label: 'Pending' },
        { value: 'reviewing', label: 'Reviewing' },
        { value: 'resolved', label: 'Resolved' }
    ],

    priorities: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
    ]
};

// Utility functions
const utils = {
    generateId() {
        return 'C' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    },

    getCurrentDate() {
        return new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    getCurrentTime() {
        return new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    },

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type} show`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    },

    exportToJSON(data, filename) {
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    },

    exportToCSV(data, filename) {
        if (data.length === 0) {
            utils.showToast('No data to export', 'error');
            return;
        }

        const headers = Object.keys(data[0]);
        const csv = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => 
                    `"${String(row[header]).replace(/"/g, '""')}"`
                ).join(',')
            )
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }
};
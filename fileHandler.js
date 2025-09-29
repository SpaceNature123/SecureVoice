// File Upload Handler
const fileHandler = {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'audio/mpeg', 'audio/wav'],
    
    validateFile(file) {
        if (file.size > this.maxFileSize) {
            return { valid: false, error: 'File size exceeds 10MB limit' };
        }
        
        if (!this.allowedTypes.includes(file.type)) {
            return { valid: false, error: 'File type not supported. Allowed: Images, PDF, Audio' };
        }
        
        return { valid: true };
    },

    async readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },

    async processFiles(fileList) {
        const processedFiles = [];
        
        for (let file of fileList) {
            const validation = this.validateFile(file);
            if (!validation.valid) {
                utils.showToast(validation.error, 'error');
                continue;
            }
            
            try {
                const base64 = await this.readFileAsBase64(file);
                processedFiles.push({
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    data: base64,
                    uploadedAt: new Date().toISOString()
                });
            } catch (error) {
                utils.showToast(`Failed to upload ${file.name}`, 'error');
            }
        }
        
        return processedFiles;
    },

    renderFilePreview(file) {
        const sizeInKB = (file.size / 1024).toFixed(2);
        const icon = this.getFileIcon(file.type);
        
        return `
            <div class="file-preview">
                <div class="file-icon">${icon}</div>
                <div class="file-info">
                    <div class="file-name">${utils.escapeHtml(file.name)}</div>
                    <div class="file-size">${sizeInKB} KB</div>
                </div>
            </div>
        `;
    },

    renderFileList(files) {
        if (!files || files.length === 0) return '';
        
        return `
            <div class="attached-files">
                <strong>Attached Files (${files.length}):</strong>
                ${files.map(file => this.renderFilePreview(file)).join('')}
            </div>
        `;
    },

    getFileIcon(type) {
        if (type.startsWith('image/')) return '🖼️';
        if (type === 'application/pdf') return '📄';
        if (type.startsWith('audio/')) return '🎵';
        return '📎';
    },

    downloadFile(file) {
        const link = document.createElement('a');
        link.href = file.data;
        link.download = file.name;
        link.click();
    }
};
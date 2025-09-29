// Multi-step Form Wizard
const wizard = {
    currentStep: 1,
    totalSteps: 4,
    formData: {},
    attachedFiles: [],
    
    init() {
        this.renderWizard();
        this.loadDraft();
    },

    renderWizard() {
        const container = document.getElementById('wizardContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="wizard-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(this.currentStep / this.totalSteps) * 100}%"></div>
                </div>
                <div class="progress-steps">
                    ${Array.from({ length: this.totalSteps }, (_, i) => `
                        <div class="progress-step ${i + 1 <= this.currentStep ? 'active' : ''} ${i + 1 < this.currentStep ? 'completed' : ''}">
                            <div class="step-circle">${i + 1 < this.currentStep ? '✓' : i + 1}</div>
                            <div class="step-label">${this.getStepLabel(i + 1)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="wizard-content">
                ${this.renderStep(this.currentStep)}
            </div>

            <div class="wizard-actions">
                ${this.currentStep > 1 ? '<button class="btn btn-secondary" onclick="wizard.previousStep()">Previous</button>' : ''}
                <button class="btn btn-outline" onclick="wizard.saveDraft()">Save Draft</button>
                ${this.currentStep < this.totalSteps 
                    ? '<button class="btn btn-primary" onclick="wizard.nextStep()">Next</button>'
                    : '<button class="btn btn-primary" onclick="wizard.submitComplaint()">Submit Complaint</button>'
                }
            </div>
        `;
    },

    getStepLabel(step) {
        const labels = ['Category', 'Details', 'Evidence', 'Review'];
        return labels[step - 1];
    },

    renderStep(step) {
        switch(step) {
            case 1: return this.renderStep1();
            case 2: return this.renderStep2();
            case 3: return this.renderStep3();
            case 4: return this.renderStep4();
            default: return '';
        }
    },

    renderStep1() {
        return `
            <h3>Step 1: Select Category</h3>
            <p class="step-description">Choose the category that best describes your complaint</p>
            
            <div class="form-group">
                <label>Category *</label>
                <select id="wizard_category" class="form-control" required>
                    <option value="">Select a category</option>
                    <option value="harassment">Harassment</option>
                    <option value="discrimination">Discrimination</option>
                    <option value="safety">Safety Concern</option>
                    <option value="ethics">Ethical Violation</option>
                    <option value="other">Other</option>
                </select>
                <div class="error-message" id="error_category"></div>
            </div>

            <div class="form-group">
                <label>Priority Level *</label>
                <select id="wizard_priority" class="form-control">
                    <option value="low">Low - Minor issue, no immediate action needed</option>
                    <option value="medium" selected>Medium - Moderate concern, attention needed</option>
                    <option value="high">High - Serious issue, prompt action required</option>
                    <option value="urgent">Urgent - Critical situation, immediate attention</option>
                </select>
            </div>
        `;
    },

    renderStep2() {
        return `
            <h3>Step 2: Provide Details</h3>
            <p class="step-description">Give us detailed information about the incident</p>
            
            <div class="form-group">
                <label>Subject *</label>
                <input type="text" id="wizard_subject" class="form-control" 
                       placeholder="Brief summary of your complaint" required>
                <div class="error-message" id="error_subject"></div>
            </div>

            <div class="form-group">
                <label>Description *</label>
                <textarea id="wizard_description" class="form-control" 
                          placeholder="Please provide detailed information about your complaint..." 
                          required></textarea>
                <div class="char-counter">
                    <span id="char_count">0</span> / 1000 characters
                </div>
                <div class="error-message" id="error_description"></div>
            </div>

            <div class="form-group">
                <label>Location/Department (Optional)</label>
                <input type="text" id="wizard_location" class="form-control" 
                       placeholder="e.g., Building A, HR Department">
            </div>

            <div class="form-group">
                <label>Date of Incident (Optional)</label>
                <input type="date" id="wizard_incident_date" class="form-control">
            </div>
        `;
    },

    renderStep3() {
        return `
            <h3>Step 3: Attach Evidence (Optional)</h3>
            <p class="step-description">Upload any supporting documents, images, or audio files</p>
            
            <div class="form-group">
                <label>Upload Files</label>
                <div class="file-upload-area" onclick="document.getElementById('wizard_files').click()">
                    <div class="upload-icon">📎</div>
                    <p>Click to upload or drag and drop</p>
                    <p class="upload-hint">Images, PDF, Audio (Max 10MB per file)</p>
                </div>
                <input type="file" id="wizard_files" multiple accept="image/*,.pdf,audio/*" 
                       style="display: none;" onchange="wizard.handleFileUpload(event)">
                <div id="filePreviewContainer"></div>
            </div>

            <div class="form-group">
                <label>Anonymous Email (Optional)</label>
                <input type="email" id="wizard_email" class="form-control" 
                       placeholder="Receive tracking ID and updates">
                <small class="form-hint">We'll only use this to send you your tracking ID and status updates. Your identity remains anonymous.</small>
            </div>
        `;
    },

    renderStep4() {
        const data = this.getFormData();
        return `
            <h3>Step 4: Review & Submit</h3>
            <p class="step-description">Please review your complaint before submitting</p>
            
            <div class="review-section">
                <div class="review-item">
                    <strong>Category:</strong>
                    <span class="complaint-category category-${data.category}">${data.category?.toUpperCase() || 'N/A'}</span>
                </div>
                
                <div class="review-item">
                    <strong>Priority:</strong>
                    <span class="priority-badge priority-${data.priority}">${data.priority?.toUpperCase() || 'N/A'}</span>
                </div>
                
                <div class="review-item">
                    <strong>Subject:</strong>
                    <p>${utils.escapeHtml(data.subject || 'N/A')}</p>
                </div>
                
                <div class="review-item">
                    <strong>Description:</strong>
                    <p>${utils.escapeHtml(data.description || 'N/A')}</p>
                </div>
                
                ${data.location ? `
                    <div class="review-item">
                        <strong>Location:</strong>
                        <p>${utils.escapeHtml(data.location)}</p>
                    </div>
                ` : ''}
                
                ${data.incident_date ? `
                    <div class="review-item">
                        <strong>Incident Date:</strong>
                        <p>${data.incident_date}</p>
                    </div>
                ` : ''}
                
                ${this.attachedFiles.length > 0 ? `
                    <div class="review-item">
                        <strong>Attached Files:</strong>
                        ${fileHandler.renderFileList(this.attachedFiles)}
                    </div>
                ` : ''}
                
                ${data.email ? `
                    <div class="review-item">
                        <strong>Notification Email:</strong>
                        <p>${utils.escapeHtml(data.email)}</p>
                    </div>
                ` : ''}
            </div>
        `;
    },

    getFormData() {
        return {
            category: document.getElementById('wizard_category')?.value || this.formData.category,
            priority: document.getElementById('wizard_priority')?.value || this.formData.priority,
            subject: document.getElementById('wizard_subject')?.value || this.formData.subject,
            description: document.getElementById('wizard_description')?.value || this.formData.description,
            location: document.getElementById('wizard_location')?.value || this.formData.location,
            incident_date: document.getElementById('wizard_incident_date')?.value || this.formData.incident_date,
            email: document.getElementById('wizard_email')?.value || this.formData.email
        };
    },

    validateStep(step) {
        const errors = {};
        
        if (step === 1) {
            const category = document.getElementById('wizard_category')?.value;
            if (!category) {
                errors.category = 'Please select a category';
            }
        }
        
        if (step === 2) {
            const subject = document.getElementById('wizard_subject')?.value;
            const description = document.getElementById('wizard_description')?.value;
            
            if (!subject || subject.trim().length < 5) {
                errors.subject = 'Subject must be at least 5 characters';
            }
            
            if (!description || description.trim().length < 20) {
                errors.description = 'Description must be at least 20 characters';
            }
            
            if (description && description.length > 1000) {
                errors.description = 'Description cannot exceed 1000 characters';
            }
        }
        
        return errors;
    },

    showErrors(errors) {
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        
        Object.keys(errors).forEach(field => {
            const errorEl = document.getElementById(`error_${field}`);
            if (errorEl) {
                errorEl.textContent = errors[field];
            }
        });
        
        utils.showToast('Please fix the errors before continuing', 'error');
    },

    nextStep() {
        const errors = this.validateStep(this.currentStep);
        
        if (Object.keys(errors).length > 0) {
            this.showErrors(errors);
            return;
        }
        
        this.formData = { ...this.formData, ...this.getFormData() };
        this.currentStep++;
        this.renderWizard();
        this.restoreFormData();
        this.attachCharCounter();
    },

    previousStep() {
        this.formData = { ...this.formData, ...this.getFormData() };
        this.currentStep--;
        this.renderWizard();
        this.restoreFormData();
        this.attachCharCounter();
    },

    restoreFormData() {
        Object.keys(this.formData).forEach(key => {
            const el = document.getElementById(`wizard_${key}`);
            if (el && this.formData[key]) {
                el.value = this.formData[key];
            }
        });
    },

    attachCharCounter() {
        const textarea = document.getElementById('wizard_description');
        const counter = document.getElementById('char_count');
        
        if (textarea && counter) {
            const updateCounter = () => {
                counter.textContent = textarea.value.length;
            };
            textarea.addEventListener('input', updateCounter);
            updateCounter();
        }
    },

    async handleFileUpload(event) {
        const files = Array.from(event.target.files);
        const processed = await fileHandler.processFiles(files);
        
        this.attachedFiles = [...this.attachedFiles, ...processed];
        this.renderFilePreview();
        
        if (processed.length > 0) {
            utils.showToast(`${processed.length} file(s) uploaded successfully`, 'success');
        }
    },

    renderFilePreview() {
        const container = document.getElementById('filePreviewContainer');
        if (!container) return;
        
        container.innerHTML = this.attachedFiles.map((file, index) => `
            <div class="file-preview-item">
                ${fileHandler.renderFilePreview(file)}
                <button class="btn-remove" onclick="wizard.removeFile(${index})">×</button>
            </div>
        `).join('');
    },

    removeFile(index) {
        this.attachedFiles.splice(index, 1);
        this.renderFilePreview();
        utils.showToast('File removed', 'success');
    },

    saveDraft() {
        this.formData = { ...this.formData, ...this.getFormData() };
        const draft = {
            step: this.currentStep,
            data: this.formData,
            files: this.attachedFiles,
            savedAt: new Date().toISOString()
        };
        
        // Store in memory (simulating draft save)
        app.currentDraft = draft;
        utils.showToast('Draft saved successfully', 'success');
    },

    loadDraft() {
        if (app.currentDraft) {
            const draft = app.currentDraft;
            this.currentStep = draft.step;
            this.formData = draft.data;
            this.attachedFiles = draft.files || [];
            
            if (confirm('A saved draft was found. Would you like to continue from where you left off?')) {
                this.renderWizard();
                this.restoreFormData();
                this.renderFilePreview();
                utils.showToast('Draft loaded', 'success');
            }
        }
    },

    async submitComplaint() {
        const finalData = this.getFormData();
        
        const complaint = {
            id: utils.generateId(),
            ...finalData,
            status: 'pending',
            date: utils.getCurrentDate(),
            time: utils.getCurrentTime(),
            timestamp: new Date().toISOString(),
            files: this.attachedFiles,
            comments: [],
            updates: [{
                timestamp: new Date().toISOString(),
                status: 'pending',
                message: 'Complaint submitted'
            }]
        };

        app.complaints.push(complaint);
        app.saveToMemory();

        // Send email notification if provided
        if (finalData.email) {
            emailService.sendTrackingEmail(finalData.email, complaint.id);
        }

        // Show success message
        const alertDiv = document.getElementById('submitAlert');
        if (alertDiv) {
            alertDiv.innerHTML = `
                <div class="alert alert-success">
                    ✓ Complaint submitted successfully! Your complaint ID is: <strong>${complaint.id}</strong>
                    <br>Please save this ID for future reference.
                    ${finalData.email ? '<br>A confirmation email has been sent to your provided email address.' : ''}
                </div>
            `;
            alertDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        utils.showToast('Complaint submitted successfully!', 'success');

        // Reset wizard
        this.currentStep = 1;
        this.formData = {};
        this.attachedFiles = [];
        app.currentDraft = null;
        
        // Switch to track tab after short delay
        setTimeout(() => {
            app.switchAppTab('track', null);
        }, 3000);
    },

    reset() {
        this.currentStep = 1;
        this.formData = {};
        this.attachedFiles = [];
        this.renderWizard();
    }
};
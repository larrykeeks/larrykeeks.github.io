/* Minimal Contact Form Pattern JavaScript
   Form validation and accessibility for professional contact
   Common pattern across portfolio sites */

class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.isSubmitting = false;
        this.init();
    }

    init() {
        if (!this.form) return;

        // Set up form validation
        this.setupValidation();
        
        // Set up form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Set up reset functionality
        const resetBtn = this.form.querySelector('.reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.handleReset());
        }

        // Real-time validation
        const inputs = this.form.querySelectorAll('.form-input, .form-textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearErrors(input));
        });
    }

    setupValidation() {
        this.validationRules = {
            name: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s'-]+$/,
                message: 'Please enter a valid name (letters, spaces, hyphens, and apostrophes only)'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            message: {
                required: true,
                minLength: 10,
                maxLength: 1000,
                message: 'Message must be between 10 and 1000 characters'
            }
        };
    }

    validateField(field) {
        const fieldName = field.name;
        const rules = this.validationRules[fieldName];
        if (!rules) return true;

        const value = field.value.trim();
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        // Check required
        if (rules.required && !value) {
            this.showFieldError(field, errorElement, `${this.capitalizeFirst(fieldName)} is required`);
            return false;
        }

        // Check minimum length
        if (rules.minLength && value.length < rules.minLength) {
            this.showFieldError(field, errorElement, `${this.capitalizeFirst(fieldName)} must be at least ${rules.minLength} characters`);
            return false;
        }

        // Check maximum length
        if (rules.maxLength && value.length > rules.maxLength) {
            this.showFieldError(field, errorElement, `${this.capitalizeFirst(fieldName)} must be no more than ${rules.maxLength} characters`);
            return false;
        }

        // Check pattern
        if (rules.pattern && value && !rules.pattern.test(value)) {
            this.showFieldError(field, errorElement, rules.message);
            return false;
        }

        // Field is valid
        this.showFieldSuccess(field, errorElement);
        return true;
    }

    showFieldError(field, errorElement, message) {
        field.classList.add('error');
        field.classList.remove('valid');
        field.setAttribute('aria-invalid', 'true');
        
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    showFieldSuccess(field, errorElement) {
        field.classList.remove('error');
        field.classList.add('valid');
        field.setAttribute('aria-invalid', 'false');
        
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    clearErrors(field) {
        if (field.classList.contains('error')) {
            field.classList.remove('error');
            field.removeAttribute('aria-invalid');
            
            const errorElement = document.getElementById(`${field.name}-error`);
            if (errorElement) {
                errorElement.textContent = '';
            }
        }
    }

    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        // Validate form
        if (!this.validateForm()) {
            this.showStatus('Please correct the errors above', 'error');
            // Focus first error field
            const firstError = this.form.querySelector('.error');
            if (firstError) firstError.focus();
            return;
        }

        this.isSubmitting = true;
        this.setSubmittingState(true);
        
        try {
            // Simulate form submission
            await this.submitForm();
            this.showStatus('Thank you! Your message has been sent successfully.', 'success');
            this.form.reset();
            this.clearAllValidation();
        } catch (error) {
            this.showStatus('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            this.isSubmitting = false;
            this.setSubmittingState(false);
        }
    }

    async submitForm() {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Network error'));
                }
            }, 2000);
        });
    }

    setSubmittingState(isSubmitting) {
        const submitBtn = document.getElementById('submit-btn');
        if (!submitBtn) return;

        submitBtn.disabled = isSubmitting;
        submitBtn.classList.toggle('loading', isSubmitting);
        
        // Update button text for screen readers
        const btnText = submitBtn.querySelector('.btn-text');
        if (btnText) {
            btnText.setAttribute('aria-hidden', isSubmitting.toString());
        }
    }

    showStatus(message, type) {
        const statusElement = document.getElementById('form-status');
        if (!statusElement) return;

        statusElement.textContent = message;
        statusElement.className = `form-status ${type}`;
        
        // Scroll status into view if needed
        statusElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    handleReset() {
        this.clearAllValidation();
        this.showStatus('Form cleared', 'info');
        
        // Focus first input after reset
        const firstInput = this.form.querySelector('.form-input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }

    clearAllValidation() {
        const fields = this.form.querySelectorAll('.form-input, .form-textarea, .form-select');
        fields.forEach(field => {
            field.classList.remove('error', 'valid');
            field.removeAttribute('aria-invalid');
        });

        const errorElements = this.form.querySelectorAll('.error-message');
        errorElements.forEach(el => el.textContent = '');
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});

// Progressive enhancement - form works without JavaScript
// Basic HTML5 validation provides fallback functionality
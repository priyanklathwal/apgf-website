/**
 * APGF Partner Portal - Form Handling
 *
 * This script handles:
 * - Multi-step form navigation
 * - Dynamic form fields based on partner type
 * - Form validation
 * - Google Sheets submission
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const partnerTypeSection = document.getElementById('partner-type-section');
    const orgInfoSection = document.getElementById('org-info-section');
    const successSection = document.getElementById('success-section');
    const partnerTypeRadios = document.querySelectorAll('input[name="partnerType"]');
    const partnerTypeField = document.getElementById('partnerTypeField');
    const dynamicFields = document.getElementById('dynamic-fields');
    const backBtn = document.getElementById('backBtn');
    const form = document.getElementById('pace-application-form');

    // Partner type configurations
    const partnerTypeConfig = {
        'mdb-dfi': {
            label: 'Multilateral Development Bank or Development Finance Institution',
            fields: [
                {
                    id: 'institutionType',
                    label: 'Type of Institution',
                    type: 'select',
                    required: true,
                    options: [
                        { value: '', label: 'Select type...' },
                        { value: 'multilateral', label: 'Multilateral Development Bank' },
                        { value: 'bilateral', label: 'Bilateral Development Finance Institution' },
                        { value: 'regional', label: 'Regional Development Bank' },
                        { value: 'other', label: 'Other' }
                    ]
                },
                {
                    id: 'financingTypes',
                    label: 'Types of financing your institution can provide',
                    type: 'checkboxes',
                    required: true,
                    options: [
                        { value: 'sovereign-loans', label: 'Sovereign Loans' },
                        { value: 'non-sovereign-loans', label: 'Non-Sovereign Loans' },
                        { value: 'grants', label: 'Grants' },
                        { value: 'guarantees', label: 'Guarantees' },
                        { value: 'equity', label: 'Equity/Quasi-Equity' },
                        { value: 'technical-assistance', label: 'Technical Assistance' },
                        { value: 'concessional', label: 'Concessional Financing' }
                    ]
                },
                {
                    id: 'indicativeAmount',
                    label: 'Indicative financing amount available for APG projects (USD)',
                    type: 'select',
                    required: false,
                    options: [
                        { value: '', label: 'Prefer not to disclose' },
                        { value: 'under-10m', label: 'Under $10 million' },
                        { value: '10m-50m', label: '$10 - $50 million' },
                        { value: '50m-100m', label: '$50 - $100 million' },
                        { value: '100m-500m', label: '$100 - $500 million' },
                        { value: 'over-500m', label: 'Over $500 million' }
                    ]
                },
                {
                    id: 'existingEngagement',
                    label: 'Current engagement with ASEAN energy sector (if any)',
                    type: 'textarea',
                    required: false,
                    placeholder: 'Describe any existing projects, programs, or partnerships in the region'
                }
            ]
        },
        'private-sector': {
            label: 'Private Sector Institution',
            fields: [
                {
                    id: 'businessType',
                    label: 'Type of Business',
                    type: 'select',
                    required: true,
                    options: [
                        { value: '', label: 'Select type...' },
                        { value: 'commercial-bank', label: 'Commercial Bank' },
                        { value: 'investment-bank', label: 'Investment Bank' },
                        { value: 'infrastructure-fund', label: 'Infrastructure Fund' },
                        { value: 'private-equity', label: 'Private Equity' },
                        { value: 'project-developer', label: 'Project Developer' },
                        { value: 'epc-contractor', label: 'EPC Contractor' },
                        { value: 'utility', label: 'Private Utility/IPP' },
                        { value: 'insurance', label: 'Insurance/Reinsurance' },
                        { value: 'other', label: 'Other' }
                    ]
                },
                {
                    id: 'investmentFocus',
                    label: 'Investment/Business Focus',
                    type: 'checkboxes',
                    required: true,
                    options: [
                        { value: 'transmission', label: 'Transmission Infrastructure' },
                        { value: 'generation', label: 'Power Generation' },
                        { value: 'renewable', label: 'Renewable Energy' },
                        { value: 'storage', label: 'Energy Storage' },
                        { value: 'subsea-cables', label: 'Subsea Cables' },
                        { value: 'project-finance', label: 'Project Finance' },
                        { value: 'advisory', label: 'Advisory Services' }
                    ]
                },
                {
                    id: 'investmentSize',
                    label: 'Typical investment/project size (USD)',
                    type: 'select',
                    required: false,
                    options: [
                        { value: '', label: 'Select range...' },
                        { value: 'under-10m', label: 'Under $10 million' },
                        { value: '10m-50m', label: '$10 - $50 million' },
                        { value: '50m-100m', label: '$50 - $100 million' },
                        { value: '100m-500m', label: '$100 - $500 million' },
                        { value: 'over-500m', label: 'Over $500 million' }
                    ]
                },
                {
                    id: 'aseanExperience',
                    label: 'Experience in ASEAN energy markets',
                    type: 'textarea',
                    required: false,
                    placeholder: 'Describe any existing investments, projects, or experience in the region'
                }
            ]
        },
        'public-sector': {
            label: 'Public Sector Institution',
            fields: [
                {
                    id: 'entityType',
                    label: 'Type of Entity',
                    type: 'select',
                    required: true,
                    options: [
                        { value: '', label: 'Select type...' },
                        { value: 'ministry', label: 'Ministry/Government Department' },
                        { value: 'regulator', label: 'Energy Regulator' },
                        { value: 'utility', label: 'State-Owned Utility' },
                        { value: 'transmission-operator', label: 'Transmission System Operator' },
                        { value: 'planning-agency', label: 'Planning/Development Agency' },
                        { value: 'other', label: 'Other Government Entity' }
                    ]
                },
                {
                    id: 'mandate',
                    label: 'Primary mandate/responsibilities',
                    type: 'textarea',
                    required: true,
                    placeholder: 'Describe your organization\'s role in the energy sector'
                },
                {
                    id: 'interconnectionInterest',
                    label: 'Interest in cross-border interconnection',
                    type: 'checkboxes',
                    required: true,
                    options: [
                        { value: 'existing-projects', label: 'Existing interconnection projects' },
                        { value: 'planned-projects', label: 'Planned interconnection projects' },
                        { value: 'feasibility', label: 'Feasibility studies needed' },
                        { value: 'policy-regulatory', label: 'Policy/regulatory framework development' },
                        { value: 'capacity-building', label: 'Capacity building needs' },
                        { value: 'financing', label: 'Seeking financing support' }
                    ]
                },
                {
                    id: 'supportNeeds',
                    label: 'What support would be most valuable for your organization?',
                    type: 'textarea',
                    required: false,
                    placeholder: 'Describe any specific needs or challenges'
                }
            ]
        },
        'knowledge-partner': {
            label: 'Knowledge and Development Support Partner',
            fields: [
                {
                    id: 'orgType',
                    label: 'Type of Organization',
                    type: 'select',
                    required: true,
                    options: [
                        { value: '', label: 'Select type...' },
                        { value: 'bilateral-agency', label: 'Bilateral Development Agency' },
                        { value: 'un-agency', label: 'UN Agency/International Organization' },
                        { value: 'ngo', label: 'NGO/Civil Society Organization' },
                        { value: 'philanthropy', label: 'Philanthropy/Foundation' },
                        { value: 'research', label: 'Research Institution/Think Tank' },
                        { value: 'university', label: 'University/Academic Institution' },
                        { value: 'consulting', label: 'Consulting Firm' },
                        { value: 'other', label: 'Other' }
                    ]
                },
                {
                    id: 'supportAreas',
                    label: 'Areas of support your organization can provide',
                    type: 'checkboxes',
                    required: true,
                    options: [
                        { value: 'technical-studies', label: 'Technical Studies/Assessments' },
                        { value: 'policy-advisory', label: 'Policy Advisory' },
                        { value: 'regulatory-support', label: 'Regulatory Framework Support' },
                        { value: 'capacity-building', label: 'Capacity Building/Training' },
                        { value: 'knowledge-sharing', label: 'Knowledge Sharing/Best Practices' },
                        { value: 'stakeholder-engagement', label: 'Stakeholder Engagement' },
                        { value: 'grant-funding', label: 'Grant Funding' },
                        { value: 'research', label: 'Research/Analysis' }
                    ]
                },
                {
                    id: 'thematicFocus',
                    label: 'Thematic focus areas',
                    type: 'checkboxes',
                    required: false,
                    options: [
                        { value: 'renewable-energy', label: 'Renewable Energy Integration' },
                        { value: 'grid-modernization', label: 'Grid Modernization' },
                        { value: 'energy-transition', label: 'Energy Transition/Decarbonization' },
                        { value: 'regional-integration', label: 'Regional Integration' },
                        { value: 'energy-access', label: 'Energy Access' },
                        { value: 'gender-inclusion', label: 'Gender & Social Inclusion' },
                        { value: 'climate-finance', label: 'Climate Finance' }
                    ]
                },
                {
                    id: 'existingPrograms',
                    label: 'Existing programs or activities in ASEAN energy sector',
                    type: 'textarea',
                    required: false,
                    placeholder: 'Describe any ongoing or planned activities'
                }
            ]
        }
    };

    // Handle partner type selection
    partnerTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                // Update hidden field
                partnerTypeField.value = this.value;

                // Generate dynamic fields
                generateDynamicFields(this.value);

                // Show form section
                partnerTypeSection.classList.add('hidden');
                orgInfoSection.classList.remove('hidden');

                // Scroll to top of form
                orgInfoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Generate dynamic fields based on partner type
    function generateDynamicFields(partnerType) {
        const config = partnerTypeConfig[partnerType];
        if (!config) return;

        let html = `<h4>${config.label} - Specific Information</h4>`;

        config.fields.forEach(field => {
            html += generateFieldHTML(field);
        });

        dynamicFields.innerHTML = html;
    }

    // Generate HTML for a single field
    function generateFieldHTML(field) {
        const requiredMark = field.required ? '<span class="required">*</span>' : '';
        let html = `<div class="form-group">`;
        html += `<label for="${field.id}">${field.label} ${requiredMark}</label>`;

        switch (field.type) {
            case 'select':
                html += `<select id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''}>`;
                field.options.forEach(opt => {
                    html += `<option value="${opt.value}">${opt.label}</option>`;
                });
                html += `</select>`;
                break;

            case 'textarea':
                html += `<textarea id="${field.id}" name="${field.id}" rows="3" ${field.required ? 'required' : ''} placeholder="${field.placeholder || ''}"></textarea>`;
                break;

            case 'checkboxes':
                html += `<div class="checkbox-group">`;
                field.options.forEach(opt => {
                    html += `
                        <label class="checkbox-label">
                            <input type="checkbox" name="${field.id}" value="${opt.value}">
                            <span>${opt.label}</span>
                        </label>`;
                });
                html += `</div>`;
                break;

            default:
                html += `<input type="text" id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''}>`;
        }

        html += `</div>`;
        return html;
    }

    // Back button handler
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            orgInfoSection.classList.add('hidden');
            partnerTypeSection.classList.remove('hidden');

            // Clear the selection
            partnerTypeRadios.forEach(radio => radio.checked = false);
            partnerTypeField.value = '';

            // Scroll to top
            partnerTypeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // Form submission
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Validate at least one checkbox is selected for project stages
            const stageCheckboxes = document.querySelectorAll('input[name="projectStages"]:checked');
            if (stageCheckboxes.length === 0) {
                alert('Please select at least one project stage that your organization can support.');
                return;
            }

            // Collect form data
            const formData = new FormData(form);
            const data = {};

            // Handle regular fields
            for (let [key, value] of formData.entries()) {
                if (data[key]) {
                    // If key already exists, convert to array
                    if (Array.isArray(data[key])) {
                        data[key].push(value);
                    } else {
                        data[key] = [data[key], value];
                    }
                } else {
                    data[key] = value;
                }
            }

            // Convert arrays to comma-separated strings for Google Sheets
            for (let key in data) {
                if (Array.isArray(data[key])) {
                    data[key] = data[key].join(', ');
                }
            }

            // Add timestamp
            data.timestamp = new Date().toISOString();

            // Add partner type label
            const partnerType = data.partnerType;
            data.partnerTypeLabel = partnerTypeConfig[partnerType]?.label || partnerType;

            console.log('Form data:', data);

            // Submit to Google Sheets
            const submitBtn = document.getElementById('submitBtn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;

            try {
                // IMPORTANT: Replace this URL with your Google Apps Script Web App URL
                // See instructions in README.md for setting up Google Sheets integration
                const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

                if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
                    // Demo mode - just show success
                    console.log('Demo mode: Form data would be submitted:', data);
                    showSuccess();
                } else {
                    const response = await fetch(GOOGLE_SCRIPT_URL, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    });

                    showSuccess();
                }
            } catch (error) {
                console.error('Submission error:', error);
                alert('There was an error submitting your application. Please try again or contact support.');
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Show success message
    function showSuccess() {
        orgInfoSection.classList.add('hidden');
        successSection.classList.remove('hidden');
        successSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

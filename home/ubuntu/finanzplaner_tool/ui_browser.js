// Browser-compatible version of ui_updated.js

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the UI
  initializeUI();
  
  // Initialize the clear data button
  initializeClearDataButton();
});

// Main UI initialization function
function initializeUI() {
  console.log("Initializing Finanzplaner UI...");
  
  // Reference our modules from the global namespace
  const calculations = window.FinanzplanerModules.calculations;
  
  // Initialize the 13th AHV-Rente toggle
  initializeAHVToggle();
  
  // Initialize the navigation
  initializeNavigation();
  
  // Initialize form validation
  initializeFormValidation();
  
  // Add help texts and tooltips to complex fields
  addHelpTexts();
  
  // Add CSS for tooltips and error messages
  addTooltipAndErrorStyles();
  
  // Add field validation on blur
  initializeFieldValidation();
  
  console.log("Finanzplaner-Tool UI initialized");
}

// Function to initialize the clear data button
function initializeClearDataButton() {
  const clearDataBtn = document.getElementById('clear-data-btn');
  if (clearDataBtn) {
    clearDataBtn.addEventListener('click', function() {
      // Show confirmation dialog
      if (confirm('Sind Sie sicher, dass Sie alle gespeicherten Daten löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.')) {
        // Clear all data from localStorage
        localStorage.clear();
        
        // Show confirmation message
        alert('Alle Daten wurden gelöscht. Die Seite wird neu geladen.');
        
        // Reload the page to reset all form states
        window.location.reload();
      }
    });
  } else {
    console.warn("Clear data button not found");
  }
}

// Function to initialize the 13th AHV-Rente toggle
function initializeAHVToggle() {
  const toggle = document.getElementById('toggle-13-ahv');
  if (toggle) {
    // Set initial state of the toggle
    toggle.checked = true; // Default enabled (from 2026)
    
    // Update the toggle display
    updateAHVToggleDisplay(toggle.checked);
    
    toggle.addEventListener('change', function() {
      // Update the calculations
      const calculations = window.FinanzplanerModules.calculations;
      calculations.toggle13thAHVRente(this.checked);
      
      // Update the toggle display
      updateAHVToggleDisplay(this.checked);
      
      // Update all calculations
      updateAllCalculations();
    });
  } else {
    console.warn("AHV toggle element not found");
  }
}

// Function to update the 13th AHV-Rente toggle display
function updateAHVToggleDisplay(isEnabled) {
  const toggleLabel = document.getElementById('toggle-13-ahv-label');
  const toggleInfo = document.getElementById('toggle-13-ahv-info');
  
  if (toggleLabel) {
    toggleLabel.textContent = isEnabled ? 
      "13. AHV-Rente einbeziehen (ab 2026)" : 
      "13. AHV-Rente nicht einbeziehen";
  }
  
  if (toggleInfo) {
    toggleInfo.textContent = isEnabled ? 
      "Die 13. AHV-Rente wird in den Berechnungen berücksichtigt. Diese wird ab 2026 ausbezahlt." : 
      "Die 13. AHV-Rente wird in den Berechnungen nicht berücksichtigt.";
  }
}

// Function to initialize navigation
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');
  
  if (navLinks.length === 0) {
    console.warn("No navigation links found");
    return;
  }
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      console.log("Navigation link clicked:", this.getAttribute('data-target'));
      
      // Remove active class from all links
      navLinks.forEach(l => l.classList.remove('active'));
      
      // Add active class to clicked link
      this.classList.add('active');
      
      // Hide all sections
      sections.forEach(section => section.classList.add('hidden'));
      
      // Show the corresponding section
      const targetId = this.getAttribute('data-target');
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        targetSection.classList.remove('hidden');
        
        // Save the current section in local storage
        localStorage.setItem('currentSection', targetId);
      } else {
        console.error("Target section not found:", targetId);
      }
    });
  });
  
  // Load the last shown section or the first section
  const currentSection = localStorage.getItem('currentSection') || 'section-intro';
  const targetLink = document.querySelector(`[data-target="${currentSection}"]`);
  if (targetLink) {
    targetLink.click();
  } else {
    console.warn("No link found for section:", currentSection);
    if (navLinks.length > 0) {
      navLinks[0].click(); // Default to first link
    }
  }
}

// Function to initialize form validation
function initializeFormValidation() {
  const forms = document.querySelectorAll('form');
  
  if (forms.length === 0) {
    console.warn("No forms found");
    return;
  }
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log("Form submitted:", this.id);
      
      // Validate the form
      if (validateForm(this)) {
        // If the form is valid, process it
        processForm(this);
      } else {
        console.warn("Form validation failed");
      }
    });
  });
}

// Add validation for individual fields on blur
function initializeFieldValidation() {
  // Get all input fields
  const inputFields = document.querySelectorAll('input, select, textarea');
  
  inputFields.forEach(field => {
    field.addEventListener('blur', function() {
      // Get the field's form
      const form = this.closest('form');
      if (!form) return;
      
      // Clear previous error messages for this field
      const previousErrorMessages = this.parentNode.querySelectorAll('.error-message, .warning-message');
      previousErrorMessages.forEach(el => el.remove());
      
      // Validate required field
      if (this.hasAttribute('required') && !this.value) {
        this.classList.add('invalid');
        addErrorMessage(this, 'Dieses Feld ist erforderlich');
        return;
      }
      
      // Validate numeric field
      if ((this.getAttribute('data-type') === 'numeric' || this.getAttribute('type') === 'number') && this.value) {
        if (isNaN(parseFloat(this.value))) {
          this.classList.add('invalid');
          addErrorMessage(this, 'Bitte geben Sie eine gültige Zahl ein');
          return;
        } else if (this.hasAttribute('min') && parseFloat(this.value) < parseFloat(this.getAttribute('min'))) {
          this.classList.add('invalid');
          addErrorMessage(this, `Minimaler Wert ist ${this.getAttribute('min')}`);
          return;
        } else if (this.hasAttribute('max') && parseFloat(this.value) > parseFloat(this.getAttribute('max'))) {
          this.classList.add('invalid');
          addErrorMessage(this, `Maximaler Wert ist ${this.getAttribute('max')}`);
          return;
        }
      }
      
      // Validate date field
      if (this.getAttribute('data-type') === 'date' && this.value && !isValidDate(this.value)) {
        this.classList.add('invalid');
        addErrorMessage(this, 'Bitte geben Sie ein gültiges Datum im Format TT.MM.JJJJ ein');
        return;
      }
      
      // Field-specific validation
      if (this.id === 'birth-date' && this.value) {
        const birthDate = parseDate(this.value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 18) {
          this.classList.add('invalid');
          addErrorMessage(this, 'Der Kunde muss mindestens 18 Jahre alt sein');
          return;
        } else if (age > 100) {
          this.classList.add('invalid');
          addErrorMessage(this, 'Bitte überprüfen Sie das eingegebene Geburtsdatum');
          return;
        }
      }
      
      // At this point, the field passes validation
      this.classList.remove('invalid');
    });
  });
}

// Add tooltips and help texts to complex fields
function addHelpTexts() {
  const helpTexts = {
    'retirement-age': 'Reguläres Rentenalter: 65 Jahre für Männer, 64/65 Jahre für Frauen (je nach Jahrgang). Vorbezug ab 58 Jahren möglich (Kürzung), Aufschub bis 70 Jahre möglich (Erhöhung).',
    'average-income': 'Das durchschnittliche Jahreseinkommen über die gesamte Erwerbszeit für die AHV-Berechnung. Bei Lücken erfolgt eine Rentenkürzung.',
    'tax-income': 'Das steuerbare Einkommen nach allen Abzügen laut letzter Steuererklärung.',
    'tax-pension-purchase-potential': 'Der maximal mögliche Einkaufsbetrag in die Pensionskasse gemäß aktuellem Vorsorgeausweis.',
    'tax-pillar3a-contribution': 'Maximaler Betrag für 2025: CHF 7\'258 mit Pensionskasse, CHF 36\'288 (20% des Erwerbseinkommens) ohne Pensionskasse.',
    'risk-profile': 'Bestimmt die Vermögensallokation und erwartete Rendite. Je höher das Risiko, desto höher die potenzielle Rendite und die Wertschwankungen.',
    'mortgage-interest-rate': 'Aktueller Zinssatz Ihrer Hypothek. Für Tragbarkeitsberechnung wird ein kalkulatorischer Zinssatz von 5% verwendet.',
    'property-value': 'Aktueller Marktwert der Immobilie laut Schätzung.',
    'mortgage-amount': 'Gesamtbetrag der ausstehenden Hypothek(en). Typische Belehnungsgrenze: 80% des Immobilienwerts.'
  };
  
  // Add tooltips to fields
  Object.keys(helpTexts).forEach(id => {
    const field = document.getElementById(id);
    if (field) {
      // Create tooltip container
      const container = document.createElement('div');
      container.className = 'tooltip-container';
      
      // Create tooltip icon
      const icon = document.createElement('span');
      icon.className = 'tooltip-icon';
      icon.innerHTML = ' ℹ️'; // Info icon
      
      // Create tooltip text
      const tooltip = document.createElement('span');
      tooltip.className = 'tooltip-text';
      tooltip.textContent = helpTexts[id];
      
      // Add to container
      container.appendChild(icon);
      container.appendChild(tooltip);
      
      // Add after label
      const label = field.parentNode.querySelector('label');
      if (label) {
        label.appendChild(container);
      }
    }
  });
}

// Add CSS for tooltips and error messages
function addTooltipAndErrorStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    /* Tooltip styles */
    .tooltip-container {
      position: relative;
      display: inline-block;
      margin-left: 5px;
    }
    
    .tooltip-icon {
      cursor: help;
    }
    
    .tooltip-text {
      visibility: hidden;
      width: 250px;
      background-color: #555;
      color: #fff;
      text-align: center;
      border-radius: 6px;
      padding: 8px;
      position: absolute;
      z-index: 1;
      bottom: 125%;
      left: 50%;
      margin-left: -125px;
      opacity: 0;
      transition: opacity 0.3s;
      font-weight: normal;
      font-size: 0.9em;
    }
    
    .tooltip-container:hover .tooltip-text {
      visibility: visible;
      opacity: 1;
    }
    
    /* Error message styles */
    .error-message {
      color: #d32f2f;
      font-size: 0.85em;
      margin-top: 4px;
      display: block;
    }
    
    .warning-message {
      color: #f57c00;
      font-size: 0.85em;
      margin-top: 4px;
      display: block;
    }
    
    .error-summary {
      background-color: #ffebee;
      border-left: 4px solid #d32f2f;
      padding: 10px 15px;
      margin-bottom: 15px;
      border-radius: 4px;
    }
    
    .error-summary h4 {
      color: #d32f2f;
      margin-top: 0;
      margin-bottom: 10px;
    }
    
    .error-summary ul {
      margin: 0;
      padding-left: 20px;
    }
    
    input.invalid, select.invalid, textarea.invalid {
      border-color: #d32f2f;
      background-color: #ffebee;
    }
  `;
  
  document.head.appendChild(styleElement);
}

// Function to validate a form
function validateForm(form) {
  let isValid = true;
  let errors = []; // Array to store error messages
  
  // Clear previous error messages
  const previousErrorMessages = form.querySelectorAll('.error-message');
  previousErrorMessages.forEach(el => el.remove());
  
  // Validate all required fields
  const requiredFields = form.querySelectorAll('[required]');
  requiredFields.forEach(field => {
    if (!field.value) {
      isValid = false;
      field.classList.add('invalid');
      addErrorMessage(field, 'Dieses Feld ist erforderlich');
      errors.push(`Feld ${field.id} ist erforderlich`);
    } else {
      field.classList.remove('invalid');
    }
  });
  
  // Validate numeric fields
  const numericFields = form.querySelectorAll('[data-type="numeric"], [type="number"]');
  numericFields.forEach(field => {
    if (field.value && isNaN(parseFloat(field.value))) {
      isValid = false;
      field.classList.add('invalid');
      addErrorMessage(field, 'Bitte geben Sie eine gültige Zahl ein');
      errors.push(`Feld ${field.id} muss numerisch sein`);
    } else if (field.hasAttribute('min') && parseFloat(field.value) < parseFloat(field.getAttribute('min'))) {
      isValid = false;
      field.classList.add('invalid');
      addErrorMessage(field, `Minimaler Wert ist ${field.getAttribute('min')}`);
      errors.push(`Feld ${field.id} unterschreitet Minimalwert`);
    } else if (field.hasAttribute('max') && parseFloat(field.value) > parseFloat(field.getAttribute('max'))) {
      isValid = false;
      field.classList.add('invalid');
      addErrorMessage(field, `Maximaler Wert ist ${field.getAttribute('max')}`);
      errors.push(`Feld ${field.id} überschreitet Maximalwert`);
    } else {
      field.classList.remove('invalid');
    }
  });
  
  // Validate date fields
  const dateFields = form.querySelectorAll('[data-type="date"]');
  dateFields.forEach(field => {
    if (field.value && !isValidDate(field.value)) {
      isValid = false;
      field.classList.add('invalid');
      addErrorMessage(field, 'Bitte geben Sie ein gültiges Datum im Format TT.MM.JJJJ ein');
      errors.push(`Feld ${field.id} hat ungültiges Datumsformat`);
    } else {
      field.classList.remove('invalid');
    }
  });
  
  // Form-specific validation
  switch(form.id) {
    case 'form-customer-profile':
      // Validate birth date (reasonable range for a financial planning customer)
      const birthDateField = form.querySelector('#birth-date');
      if (birthDateField && birthDateField.value) {
        const birthDate = parseDate(birthDateField.value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 18) {
          isValid = false;
          birthDateField.classList.add('invalid');
          addErrorMessage(birthDateField, 'Der Kunde muss mindestens 18 Jahre alt sein');
          errors.push('Kunde muss mindestens 18 Jahre alt sein');
        } else if (age > 100) {
          isValid = false;
          birthDateField.classList.add('invalid');
          addErrorMessage(birthDateField, 'Bitte überprüfen Sie das eingegebene Geburtsdatum');
          errors.push('Unplausibles Alter (über 100 Jahre)');
        }
      }
      break;
      
    case 'form-retirement-planning':
      // Validate retirement age (between 58 and 70 is typical)
      const retirementAgeField = form.querySelector('#retirement-age');
      if (retirementAgeField && retirementAgeField.value) {
        const retirementAge = parseInt(retirementAgeField.value);
        // Already handled by min/max attributes, but add context here
        if (retirementAge < 58) {
          addErrorMessage(retirementAgeField, 'Frühestmögliche Pensionierung ab 58 Jahren (je nach Pensionskasse)');
        } else if (retirementAge > 70) {
          addErrorMessage(retirementAgeField, 'Aufschub der AHV-Rente maximal bis 70 Jahre möglich');
        }
      }
      
      // Validate average income (reasonable range)
      const averageIncomeField = form.querySelector('#average-income');
      if (averageIncomeField && averageIncomeField.value) {
        const averageIncome = parseFloat(averageIncomeField.value);
        if (averageIncome < 10000) {
          isValid = false;
          averageIncomeField.classList.add('invalid');
          addErrorMessage(averageIncomeField, 'Durchschnittliches Einkommen erscheint zu niedrig');
          errors.push('Durchschnittliches Einkommen zu niedrig');
        } else if (averageIncome > 500000) {
          isValid = false;
          averageIncomeField.classList.add('invalid');
          addErrorMessage(averageIncomeField, 'Durchschnittliches Einkommen erscheint zu hoch');
          errors.push('Durchschnittliches Einkommen zu hoch');
        }
      }
      break;
      
    case 'form-tax-optimization':
      // Validate tax-pillar3a-contribution (maximum contribution limits in 2025)
      const pillar3aField = form.querySelector('#tax-pillar3a-contribution');
      if (pillar3aField && pillar3aField.value) {
        const pillar3aContribution = parseFloat(pillar3aField.value);
        const maxContribution = 7258; // Maximum for 2025 with pension fund
        
        if (pillar3aContribution > maxContribution) {
          isValid = false;
          pillar3aField.classList.add('invalid');
          addErrorMessage(pillar3aField, `Maximale Einzahlung in Säule 3a für 2025: CHF ${maxContribution}`);
          errors.push('Säule 3a-Einzahlung überschreitet Maximum');
        }
      }
      break;
      
    case 'form-investment-concept':
      // Investment horizon plausibility
      const horizonField = form.querySelector('#investment-horizon');
      if (horizonField && horizonField.value) {
        const horizon = parseInt(horizonField.value);
        if (horizon > 40) {
          isValid = false;
          horizonField.classList.add('invalid');
          addErrorMessage(horizonField, 'Anlagehorizont erscheint ungewöhnlich lang');
          errors.push('Anlagehorizont zu lang');
        }
      }
      break;
      
    case 'form-real-estate':
      // Validate loan-to-value ratio
      const propertyValueField = form.querySelector('#property-value');
      const mortgageAmountField = form.querySelector('#mortgage-amount');
      
      if (propertyValueField && propertyValueField.value && 
          mortgageAmountField && mortgageAmountField.value) {
        const propertyValue = parseFloat(propertyValueField.value);
        const mortgageAmount = parseFloat(mortgageAmountField.value);
        
        if (mortgageAmount > propertyValue) {
          isValid = false;
          mortgageAmountField.classList.add('invalid');
          addErrorMessage(mortgageAmountField, 'Hypothekarbetrag darf den Immobilienwert nicht überschreiten');
          errors.push('Hypothekarbetrag übersteigt Immobilienwert');
        } else if (mortgageAmount / propertyValue > 0.8) {
          // Warning but not an error
          addErrorMessage(mortgageAmountField, 'Belehnungsgrad über 80% - beachten Sie die höheren Anforderungen', 'warning');
        }
      }
      break;
  }
  
  // Display summary of errors if there are any
  if (errors.length > 0) {
    const errorSummary = document.createElement('div');
    errorSummary.className = 'error-summary';
    errorSummary.innerHTML = `
      <h4>Bitte korrigieren Sie die folgenden Fehler:</h4>
      <ul>
        ${errors.map(err => `<li>${err}</li>`).join('')}
      </ul>
    `;
    
    // Insert at the top of the form
    form.insertBefore(errorSummary, form.firstChild);
  }
  
  return isValid;
}

// Helper function to add error messages beside fields
function addErrorMessage(field, message, type = 'error') {
  // Create error message element
  const errorMessage = document.createElement('div');
  errorMessage.className = `${type}-message`;
  errorMessage.textContent = message;
  
  // Insert after the field
  field.parentNode.insertBefore(errorMessage, field.nextSibling);
}

// Function to check if a date is valid
function isValidDate(dateString) {
  const regex = /^\d{2}\.\d{2}\.\d{4}$/;
  if (!regex.test(dateString)) return false;
  
  const parts = dateString.split('.');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  
  const date = new Date(year, month, day);
  
  return date.getDate() === day && 
         date.getMonth() === month && 
         date.getFullYear() === year;
}

// Function to parse a date string
function parseDate(dateString) {
  const parts = dateString.split('.');
  return new Date(
    parseInt(parts[2], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[0], 10)
  );
}

// Function to process a form
function processForm(form) {
  const formId = form.id;
  console.log("Processing form:", formId);
  
  switch (formId) {
    case 'form-customer-profile':
      processCustomerProfile(form);
      break;
    case 'form-current-situation':
      processCurrentSituation(form);
      break;
    case 'form-retirement-planning':
      processRetirementPlanning(form);
      break;
    case 'form-tax-optimization':
      processTaxOptimization(form);
      break;
    case 'form-investment-concept':
      processInvestmentConcept(form);
      break;
    case 'form-real-estate':
      processRealEstate(form);
      break;
    case 'form-estate-planning':
      processEstatePlanning(form);
      break;
    case 'form-action-plan':
      processActionPlan(form);
      break;
    default:
      console.error('Unknown form:', formId);
  }
}

// Function to format a number with thousands separator
function formatNumber(number) {
  return number.toLocaleString('de-CH');
}

// Function to show a success message
function showSuccessMessage(message) {
  console.log("Success:", message);
  alert(message); // Simple alert for now
}

// Function to update all calculations
function updateAllCalculations() {
  console.log("Updating all calculations...");
  // Re-run the current form processing
}

// Function to process the customer profile
function processCustomerProfile(form) {
  // Extract data from the form
  const data = {
    firstName: form.querySelector('#first-name')?.value || '',
    lastName: form.querySelector('#last-name')?.value || '',
    birthDate: form.querySelector('#birth-date')?.value || '',
    maritalStatus: form.querySelector('#marital-status')?.value || '',
    children: parseInt(form.querySelector('#children')?.value || '0'),
  };
  
  // Save data in local storage
  localStorage.setItem('customerProfile', JSON.stringify(data));
  
  // Update the summary
  updateCustomerProfileSummary(data);
  
  // Show a success message
  showSuccessMessage('Kundenprofil erfolgreich gespeichert');
  
  // Navigate to the next section
  const nextSectionLink = document.querySelector('[data-target="section-current-situation"]');
  if (nextSectionLink) {
    nextSectionLink.click();
  }
}

// Function to update the customer profile summary
function updateCustomerProfileSummary(data) {
  const summary = document.getElementById('customer-profile-summary');
  if (!summary) return;
  
  // Calculate age
  const birthDate = parseDate(data.birthDate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  // Format marital status
  let maritalStatusText = '';
  switch (data.maritalStatus) {
    case 'single': maritalStatusText = 'Ledig'; break;
    case 'married': maritalStatusText = 'Verheiratet'; break;
    case 'divorced': maritalStatusText = 'Geschieden'; break;
    case 'widowed': maritalStatusText = 'Verwitwet'; break;
    case 'registered-partnership': maritalStatusText = 'Eingetragene Partnerschaft'; break;
    default: maritalStatusText = data.maritalStatus;
  }
  
  // Show the summary
  summary.style.display = 'block';
  
  // Initialize a default display
  summary.innerHTML = `
    <h3>${data.firstName || ''} ${data.lastName || ''}</h3>
    <p><strong>Alter:</strong> ${age} Jahre</p>
    <p><strong>Zivilstand:</strong> ${maritalStatusText}</p>
    <p><strong>Kinder:</strong> ${data.children}</p>
  `;
}

// Function to process the current situation
function processCurrentSituation(form) {
  // Extract data from the form
  const data = {
    income: {
      salary: parseFloat(form.querySelector('#salary')?.value || '0'),
      bonuses: parseFloat(form.querySelector('#bonuses')?.value || '0'),
      // Add other income fields as needed
    },
    // Add expense fields as needed
  };
  
  // Calculate totals
  data.totalIncome = Object.values(data.income).reduce((sum, value) => sum + value, 0);
  
  // Save data in local storage
  localStorage.setItem('currentSituation', JSON.stringify(data));
  
  // Update the summary
  updateCurrentSituationSummary(data);
  
  // Show a success message
  showSuccessMessage('Ist-Analyse erfolgreich gespeichert');
  
  // Navigate to the next section
  const nextSectionLink = document.querySelector('[data-target="section-retirement-planning"]');
  if (nextSectionLink) {
    nextSectionLink.click();
  }
}

// Function to update the current situation summary
function updateCurrentSituationSummary(data) {
  const summary = document.getElementById('current-situation-summary');
  if (!summary) return;
  
  // Show the summary
  summary.style.display = 'block';
  
  // Display summary
  summary.innerHTML = `
    <h3>Finanzielle Situation</h3>
    <p><strong>Gesamteinkommen:</strong> CHF ${formatNumber(data.totalIncome)}</p>
  `;
}

// Function to process retirement planning
function processRetirementPlanning(form) {
  // Get calculations module
  const calculations = window.FinanzplanerModules.calculations;
  
  // Extract data from the form (if available)
  const data = {
    // Use defaults if fields don't exist in simplified form
    retirementAge: parseFloat(form.querySelector('#retirement-age')?.value || '65'),
    averageIncome: parseFloat(form.querySelector('#average-income')?.value || '0'),
    // Add other retirement fields
  };
  
  // Load customer profile data
  const customerProfile = JSON.parse(localStorage.getItem('customerProfile') || '{}');
  const birthDate = parseDate(customerProfile.birthDate || '01.01.1970');
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  // Bestimme das Geburtsjahr aus dem Geburtsdatum
  const birthYear = birthDate.getFullYear();
  
  // Bestimme das Geschlecht (vereinfacht basierend auf Geschäftslogik)
  // Für Daniel Pensioni (Jg. 1961, verheiratet) nehmen wir 'male' an
  const gender = 'male'; // Standard, sollte eigentlich vom Formular kommen
  
  // Calculate years to retirement
  data.yearsToRetirement = data.retirementAge - age;
  
  // Calculate AHV pension
  // Use actual income from the current situation if available
  const currentSituation = JSON.parse(localStorage.getItem('currentSituation') || '{}');
  const income = currentSituation.totalIncome || 85000; // Default if not available
  
  // Calculate AHV pension with enhanced parameters
  const ahvRente = calculations.calculateAHVRente(
    income,  // Use the income from Ist-Analyse
    40,      // Assume 40 contribution years
    customerProfile.maritalStatus === 'married', // Check if married
    income * 0.7, // Simplified spouse income for married couples (70% of primary)
    38,     // Approximate spouse contribution years
    birthYear, // Birth year for reference age calculation
    gender,  // Gender for reference age calculation
    data.retirementAge // Actual retirement age for flexibility calculation
  );
  
  // Save retirement planning data with enhanced information
  localStorage.setItem('retirementPlanning', JSON.stringify({
    data: data,
    results: {
      ahvRente: ahvRente,
      birthYear: birthYear,
      gender: gender,
      // Add other results
    }
  }));
  
  // Update the summary with the enhanced information
  updateRetirementPlanningSummary(data, ahvRente, birthYear, gender);
  
  // Show success message
  showSuccessMessage('Vorsorgeplanung erfolgreich berechnet');
  
  // Navigate to next section or show final report
  const nextSectionLink = document.querySelector('[data-target="section-tax-optimization"]');
  if (nextSectionLink) {
    nextSectionLink.click();
  } else {
    generateFinalReport();
  }
}

// Function to update retirement planning summary
function updateRetirementPlanningSummary(data, ahvRente, birthYear, gender) {
  const summary = document.getElementById('retirement-planning-summary');
  if (!summary) return;
  
  // Show the summary
  summary.style.display = 'block';
  
  // Format reference age display
  const referenceAgeText = `${ahvRente.referenceAge.years} Jahre${ahvRente.referenceAge.months > 0 ? ' und ' + ahvRente.referenceAge.months + ' Monate' : ''}`;
  
  // Calculate and format adjustment percentage
  const adjustmentPct = ((ahvRente.adjustmentFactor - 1) * 100).toFixed(2);
  const adjustmentText = ahvRente.adjustmentFactor !== 1 ? 
    `${adjustmentPct > 0 ? '+' : ''}${adjustmentPct}% ${adjustmentPct > 0 ? 'Aufschlag' : 'Kürzung'}` : 
    'Keine Anpassung';
  
  // Format AHV amounts
  // Format to 2 decimal places and use thousands separator for CHF amounts
  const formatCHF = (amount) => {
    return new Intl.NumberFormat('de-CH', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }).format(amount);
  };
  
  // Prepare the AHV rente display section
  let ahvRenteDisplay = `
    <p><strong>Monatliche AHV-Rente:</strong> CHF ${formatCHF(ahvRente.monthlyRente)}</p>
    <p><strong>AHV-Basis-Jahresrente (12 Monate):</strong> CHF ${formatCHF(ahvRente.baseYearlyRente)}</p>
  `;
  
  // Add 13th AHV pension information with conditional display
  if (ahvRente.with13thRente) {
    ahvRenteDisplay += `
      <p><strong>13. AHV-Rente:</strong> CHF ${formatCHF(ahvRente.thirteenthRente)}</p>
      <p><strong>Gesamt-Jahresrente mit 13. AHV-Rente:</strong> CHF ${formatCHF(ahvRente.yearlyRente)}</p>
    `;
  }
  
  // Format the summary information with enhanced details
  summary.innerHTML = `
    <h3>Vorsorgeplanung</h3>
    <p><strong>Pensionierungsalter:</strong> ${data.retirementAge} Jahre</p>
    <p><strong>AHV-Referenzalter (Jahrgang ${birthYear}):</strong> ${referenceAgeText}</p>
    <p><strong>Rentenanpassung bei Abweichung:</strong> ${adjustmentText}</p>
    
    <h4>AHV-Rentenberechnung:</h4>
    ${ahvRenteDisplay}
    
    <p><strong>Mit 13. AHV-Rente:</strong> ${ahvRente.with13thRente ? 'Ja' : 'Nein'}</p>
  `;
}

// Function to process tax optimization
function processTaxOptimization(form) {
  // Extract data from the form
  const data = {
    income: parseFloat(form.querySelector('#tax-income')?.value || '0'),
    pensionPurchasePotential: parseFloat(form.querySelector('#tax-pension-purchase-potential')?.value || '0'),
    pillar3aContribution: parseFloat(form.querySelector('#tax-pillar3a-contribution')?.value || '0')
  };
  
  // Simple tax calculations (without using external modules)
  const taxRate = data.income > 100000 ? 0.3 : 0.2; // Simplified tax rate
  const taxWithoutOptimization = data.income * taxRate;
  const taxableIncomeAfterDeductions = data.income - data.pensionPurchasePotential - data.pillar3aContribution;
  const taxWithOptimization = taxableIncomeAfterDeductions * taxRate;
  const taxSavings = taxWithoutOptimization - taxWithOptimization;
  
  // Store calculations
  data.taxSavings = taxSavings;
  
  // Save data in local storage
  localStorage.setItem('taxOptimization', JSON.stringify(data));
  
  // Update the summary
  updateTaxOptimizationSummary(data);
  
  // Show a success message
  showSuccessMessage('Steueroptimierung erfolgreich berechnet');
  
  // Navigate to the next section
  const nextSectionLink = document.querySelector('[data-target="section-investment-concept"]');
  if (nextSectionLink) {
    nextSectionLink.click();
  }
}

// Function to update tax optimization summary
function updateTaxOptimizationSummary(data) {
  const summary = document.getElementById('tax-optimization-summary');
  if (!summary) return;
  
  // Show the summary
  summary.style.display = 'block';
  
  // Display tax optimization summary
  summary.innerHTML = `
    <h3>Steueroptimierung</h3>
    <p><strong>Steuerbares Einkommen:</strong> CHF ${formatNumber(data.income)}</p>
    <p><strong>Steuerersparnis durch PK-Einkauf:</strong> CHF ${formatNumber(data.pensionPurchasePotential * 0.25)}</p>
    <p><strong>Steuerersparnis durch Säule 3a:</strong> CHF ${formatNumber(data.pillar3aContribution * 0.25)}</p>
    <p><strong>Gesamte Steuerersparnis:</strong> CHF ${formatNumber(data.taxSavings)}</p>
  `;
}

// Function to process investment concept
function processInvestmentConcept(form) {
  // Extract data from the form
  const data = {
    riskProfile: form.querySelector('#risk-profile')?.value || '',
    investmentAmount: parseFloat(form.querySelector('#investment-amount')?.value || '0'),
    investmentHorizon: parseInt(form.querySelector('#investment-horizon')?.value || '10')
  };
  
  // Simple portfolio allocation based on risk profile
  let allocation = {};
  
  switch(data.riskProfile) {
    case 'konservativ':
      allocation = { cash: 15, bonds: 55, stocks: 20, realEstate: 10, alternative: 0 };
      break;
    case 'ausgewogen':
      allocation = { cash: 10, bonds: 40, stocks: 30, realEstate: 15, alternative: 5 };
      break;
    case 'wachstumsorientiert':
      allocation = { cash: 5, bonds: 25, stocks: 45, realEstate: 15, alternative: 10 };
      break;
    case 'chancenorientiert':
      allocation = { cash: 5, bonds: 10, stocks: 60, realEstate: 15, alternative: 10 };
      break;
    default:
      allocation = { cash: 10, bonds: 40, stocks: 30, realEstate: 15, alternative: 5 };
  }
  
  // Calculate expected returns (simplified)
  const expectedReturn = 
    ((allocation.cash / 100) * 0.005) + 
    ((allocation.bonds / 100) * 0.02) + 
    ((allocation.stocks / 100) * 0.06) + 
    ((allocation.realEstate / 100) * 0.04) + 
    ((allocation.alternative / 100) * 0.05);
  
  // Calculate expected value after investment horizon
  const futureValue = data.investmentAmount * Math.pow(1 + expectedReturn, data.investmentHorizon);
  
  // Store calculations
  data.allocation = allocation;
  data.expectedReturn = expectedReturn;
  data.futureValue = futureValue;
  
  // Save data in local storage
  localStorage.setItem('investmentConcept', JSON.stringify(data));
  
  // Update the summary
  updateInvestmentConceptSummary(data);
  
  // Show a success message
  showSuccessMessage('Anlagekonzept erfolgreich erstellt');
  
  // Navigate to the next section
  const nextSectionLink = document.querySelector('[data-target="section-real-estate"]');
  if (nextSectionLink) {
    nextSectionLink.click();
  }
}

// Function to update investment concept summary
function updateInvestmentConceptSummary(data) {
  const summary = document.getElementById('investment-concept-summary');
  if (!summary) return;
  
  // Show the summary
  summary.style.display = 'block';
  
  // Display investment concept summary
  summary.innerHTML = `
    <h3>Anlagekonzept</h3>
    <p><strong>Risikoprofil:</strong> ${data.riskProfile}</p>
    <p><strong>Anlagevermögen:</strong> CHF ${formatNumber(data.investmentAmount)}</p>
    <p><strong>Anlagehorizont:</strong> ${data.investmentHorizon} Jahre</p>
    <p><strong>Erwartete jährliche Rendite:</strong> ${(data.expectedReturn * 100).toFixed(2)}%</p>
    <p><strong>Erwarteter Wert nach ${data.investmentHorizon} Jahren:</strong> CHF ${formatNumber(Math.round(data.futureValue))}</p>
    <br>
    <h4>Empfohlene Vermögensallokation:</h4>
    <p>Liquidität: ${data.allocation.cash}%</p>
    <p>Obligationen: ${data.allocation.bonds}%</p>
    <p>Aktien: ${data.allocation.stocks}%</p>
    <p>Immobilien: ${data.allocation.realEstate}%</p>
    <p>Alternative Anlagen: ${data.allocation.alternative}%</p>
  `;
}

// Function to process real estate
function processRealEstate(form) {
  // Extract data from the form
  const data = {
    propertyValue: parseFloat(form.querySelector('#property-value')?.value || '0'),
    mortgageAmount: parseFloat(form.querySelector('#mortgage-amount')?.value || '0'),
    interestRate: parseFloat(form.querySelector('#mortgage-interest-rate')?.value || '0') / 100
  };
  
  // Calculate loan-to-value ratio
  data.loanToValueRatio = data.mortgageAmount / data.propertyValue;
  
  // Calculate mortgage payments (simple calculation)
  const monthlyInterestRate = data.interestRate / 12;
  const totalPayments = 25 * 12; // 25-year mortgage
  data.monthlyPayment = data.mortgageAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments) / (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);
  data.yearlyPayment = data.monthlyPayment * 12;
  
  // Calculate affordability metrics
  const maintenanceCost = data.propertyValue * 0.01; // 1% of property value
  const calendaryCost = data.propertyValue * 0.01; // 1% of property value
  const kalkulatorischerZins = data.mortgageAmount * 0.05; // 5% interest rate for affordability calculation
  
  data.affordabilityCost = kalkulatorischerZins + maintenanceCost + calendaryCost;
  
  // Load current situation to check income
  const currentSituation = JSON.parse(localStorage.getItem('currentSituation') || '{}');
  const yearlyIncome = currentSituation.totalIncome || 100000; // Default if not available
  
  data.affordabilityRatio = data.affordabilityCost / yearlyIncome;
  data.isAffordable = data.affordabilityRatio <= 0.33; // 1/3 of income for affordability
  
  // Save data in local storage
  localStorage.setItem('realEstate', JSON.stringify(data));
  
  // Update the summary
  updateRealEstateSummary(data);
  
  // Show a success message
  showSuccessMessage('Immobilienfinanzierung erfolgreich berechnet');
  
  // Navigate to the next section
  const nextSectionLink = document.querySelector('[data-target="section-estate-planning"]');
  if (nextSectionLink) {
    nextSectionLink.click();
  }
}

// Function to update real estate summary
function updateRealEstateSummary(data) {
  const summary = document.getElementById('real-estate-summary');
  if (!summary) return;
  
  // Show the summary
  summary.style.display = 'block';
  
  // Display real estate summary
  summary.innerHTML = `
    <h3>Immobilienfinanzierung</h3>
    <p><strong>Immobilienwert:</strong> CHF ${formatNumber(data.propertyValue)}</p>
    <p><strong>Hypothekarbetrag:</strong> CHF ${formatNumber(data.mortgageAmount)}</p>
    <p><strong>Belehnungsgrad:</strong> ${(data.loanToValueRatio * 100).toFixed(1)}%</p>
    <p><strong>Monatliche Hypothekarzahlung:</strong> CHF ${formatNumber(Math.round(data.monthlyPayment))}</p>
    <p><strong>Kalkulatorische Kosten (Tragbarkeit):</strong> CHF ${formatNumber(Math.round(data.affordabilityCost))}</p>
    <p><strong>Tragbarkeitsquote:</strong> ${(data.affordabilityRatio * 100).toFixed(1)}%</p>
    <p><strong>Tragbarkeit:</strong> ${data.isAffordable ? '✓ Gegeben' : '✗ Nicht gegeben'}</p>
  `;
}

// Function to process estate planning
function processEstatePlanning(form) {
  // Extract data from the form
  const data = {
    hasWill: form.querySelector('#has-will')?.value || '',
    hasMarriageContract: form.querySelector('#has-marriage-contract')?.value || '',
    notes: form.querySelector('#estate-notes')?.value || ''
  };
  
  // Generate recommendations based on input
  const recommendations = [];
  
  if (data.hasWill === 'no') {
    recommendations.push('Erstellung eines Testaments empfohlen');
  }
  
  if (data.hasMarriageContract === 'no') {
    // Get marital status from customer profile
    const customerProfile = JSON.parse(localStorage.getItem('customerProfile') || '{}');
    if (customerProfile.maritalStatus === 'married') {
      recommendations.push('Erstellung eines Ehevertrags empfohlen');
    }
  }
  
  // Add default recommendations
  recommendations.push('Erstellung eines Vorsorgeauftrags empfohlen');
  recommendations.push('Erstellung einer Patientenverfügung empfohlen');
  
  // Store recommendations
  data.recommendations = recommendations;
  
  // Save data in local storage
  localStorage.setItem('estatePlanning', JSON.stringify(data));
  
  // Update the summary
  updateEstatePlanningSummary(data);
  
  // Show a success message
  showSuccessMessage('Nachlassplanung erfolgreich gespeichert');
  
  // Navigate to the next section
  const nextSectionLink = document.querySelector('[data-target="section-action-plan"]');
  if (nextSectionLink) {
    nextSectionLink.click();
  }
  
  // Generate action plan automatically
  generateAutomaticActionPlan();
}

// Function to update estate planning summary
function updateEstatePlanningSummary(data) {
  const summary = document.getElementById('estate-planning-summary');
  if (!summary) return;
  
  // Show the summary
  summary.style.display = 'block';
  
  // Generate recommendations list HTML
  const recommendationsHtml = data.recommendations.map(rec => `<li>${rec}</li>`).join('');
  
  // Display estate planning summary
  summary.innerHTML = `
    <h3>Nachlassplanung</h3>
    <p><strong>Testament vorhanden:</strong> ${data.hasWill === 'yes' ? 'Ja' : 'Nein'}</p>
    <p><strong>Ehevertrag vorhanden:</strong> ${
      data.hasMarriageContract === 'yes' ? 'Ja' : 
      data.hasMarriageContract === 'no' ? 'Nein' : 
      'Nicht anwendbar'
    }</p>
    <p><strong>Anmerkungen:</strong> ${data.notes || '-'}</p>
    
    <h4>Empfehlungen:</h4>
    <ul>
      ${recommendationsHtml}
    </ul>
  `;
}

// Function to generate automatic action plan based on previous inputs
function generateAutomaticActionPlan() {
  console.log("Generating automatic action plan...");
  
  // Get data from all sections
  const customerProfile = JSON.parse(localStorage.getItem('customerProfile') || '{}');
  const currentSituation = JSON.parse(localStorage.getItem('currentSituation') || '{}');
  const retirementPlanning = JSON.parse(localStorage.getItem('retirementPlanning') || '{}');
  const taxOptimization = JSON.parse(localStorage.getItem('taxOptimization') || '{}');
  const investmentConcept = JSON.parse(localStorage.getItem('investmentConcept') || '{}');
  const realEstate = JSON.parse(localStorage.getItem('realEstate') || '{}');
  const estatePlanning = JSON.parse(localStorage.getItem('estatePlanning') || '{}');
  
  // Initialize action plan arrays
  const shortTermActions = [];
  const mediumTermActions = [];
  const longTermActions = [];
  
  // 1. Generate short-term actions (immediate, within 1 year)
  
  // Tax optimization recommendations
  if (taxOptimization.pillar3aContribution < 7258 && taxOptimization.income > 50000) {
    shortTermActions.push('Maximale Einzahlung in die Säule 3a von CHF 7\'258 tätigen, um Steuern zu optimieren.');
  }
  
  if (taxOptimization.pensionPurchasePotential > 10000) {
    shortTermActions.push(`Einkauf in die Pensionskasse in Höhe von CHF ${formatNumber(Math.min(taxOptimization.pensionPurchasePotential, 50000))} prüfen, um Steuern zu optimieren.`);
  }
  
  // Estate planning recommendations
  if (estatePlanning.hasWill === 'no') {
    shortTermActions.push('Testament erstellen, um den Nachlass nach eigenen Wünschen zu regeln.');
  }
  
  if (estatePlanning.hasMarriageContract === 'no' && customerProfile.maritalStatus === 'married') {
    shortTermActions.push('Ehevertrag erstellen, um die güterrechtliche Situation zu optimieren.');
  }
  
  shortTermActions.push('Vorsorgeauftrag und Patientenverfügung erstellen, um für den Fall der Urteilsunfähigkeit vorzusorgen.');
  
  // Retirement planning recommendations
  const ahvRente = retirementPlanning.results?.ahvRente;
  if (ahvRente) {
    // If planned retirement age is different from reference age
    if (ahvRente.actualRetirementAge.years !== ahvRente.referenceAge.years || 
        ahvRente.actualRetirementAge.months !== ahvRente.referenceAge.months) {
      
      if (ahvRente.adjustmentFactor < 1) {
        shortTermActions.push(`Finanzielle Auswirkungen eines vorzeitigen Rentenbezugs im Alter von ${ahvRente.actualRetirementAge.years} Jahren prüfen. Die Rentenkürzung beträgt ${((1 - ahvRente.adjustmentFactor) * 100).toFixed(1)}%.`);
      } else if (ahvRente.adjustmentFactor > 1) {
        mediumTermActions.push(`Rentenaufschub bis Alter ${ahvRente.actualRetirementAge.years} ermöglicht eine Rentenerhöhung um ${((ahvRente.adjustmentFactor - 1) * 100).toFixed(1)}%.`);
      }
    }
  }
  
  // 2. Generate medium-term actions (1-3 years)
  
  // Investment recommendations
  if (investmentConcept.investmentAmount > 50000) {
    mediumTermActions.push(`Vermögensallokation entsprechend des ${investmentConcept.riskProfile || 'ausgewogenen'} Risikoprofils umsetzen: ${investmentConcept.allocation?.cash || 0}% Liquidität, ${investmentConcept.allocation?.bonds || 0}% Obligationen, ${investmentConcept.allocation?.stocks || 0}% Aktien, ${investmentConcept.allocation?.realEstate || 0}% Immobilien und ${investmentConcept.allocation?.alternative || 0}% alternative Anlagen.`);
  }
  
  // Real estate recommendations
  if (realEstate.propertyValue) {
    // If high loan-to-value ratio
    if (realEstate.loanToValueRatio > 0.67) {
      mediumTermActions.push(`Hypothekarbelastung reduzieren. Aktueller Belehnungsgrad: ${(realEstate.loanToValueRatio * 100).toFixed(1)}%. Mittelfristiges Ziel: max. 66%.`);
    }
    
    // If affordability is borderline
    if (realEstate.affordabilityRatio > 0.3 && realEstate.affordabilityRatio <= 0.33) {
      mediumTermActions.push(`Immobilientragbarkeit verbessern. Aktuelle Tragbarkeitsquote: ${(realEstate.affordabilityRatio * 100).toFixed(1)}%.`);
    } else if (realEstate.affordabilityRatio > 0.33) {
      shortTermActions.push(`Tragbarkeit der Immobilienfinanzierung sicherstellen. Tragbarkeitsquote von ${(realEstate.affordabilityRatio * 100).toFixed(1)}% überschreitet die empfohlene maximale Quote von 33%.`);
    }
  }
  
  // 3. Generate long-term actions (3+ years)
  
  // Retirement planning long-term
  if (ahvRente) {
    longTermActions.push(`Finanzierungslücke im Ruhestand analysieren und schließen. Die erwartete jährliche AHV-Rente von CHF ${formatNumber(Math.round(ahvRente.yearlyRente))} deckt nur einen Teil des Einkommensbedarfs im Ruhestand.`);
  }
  
  // Long-term investment goal
  if (investmentConcept.investmentAmount > 0 && investmentConcept.futureValue) {
    longTermActions.push(`Langfristiges Anlageziel verfolgen: Vermögenswachstum von aktuell CHF ${formatNumber(investmentConcept.investmentAmount)} auf prognostizierte CHF ${formatNumber(Math.round(investmentConcept.futureValue))} in ${investmentConcept.investmentHorizon} Jahren bei einer jährlichen Rendite von ${(investmentConcept.expectedReturn * 100).toFixed(2)}%.`);
  }
  
  // Pre-fill action plan form if exists
  const actionPlanForm = document.getElementById('form-action-plan');
  if (actionPlanForm) {
    const shortTermField = actionPlanForm.querySelector('#short-term-actions');
    const mediumTermField = actionPlanForm.querySelector('#medium-term-actions');
    const longTermField = actionPlanForm.querySelector('#long-term-actions');
    
    if (shortTermField && shortTermActions.length > 0) {
      shortTermField.value = shortTermActions.join('\n\n');
    }
    
    if (mediumTermField && mediumTermActions.length > 0) {
      mediumTermField.value = mediumTermActions.join('\n\n');
    }
    
    if (longTermField && longTermActions.length > 0) {
      longTermField.value = longTermActions.join('\n\n');
    }
  }
  
  // Save to localStorage for potential later use
  localStorage.setItem('generatedActionPlan', JSON.stringify({
    shortTermActions,
    mediumTermActions,
    longTermActions
  }));
  
  console.log("Automatic action plan generated and pre-filled");
}

// Function to process action plan
function processActionPlan(form) {
  const formId = form.id;
  console.log("Processing form:", formId);
  
  switch (formId) {
    case 'form-action-plan':
      const actionPlan = {
        shortTermActions: form.querySelector('#short-term-actions')?.value || '',
        mediumTermActions: form.querySelector('#medium-term-actions')?.value || '',
        longTermActions: form.querySelector('#long-term-actions')?.value || ''
      };
      
      // Save data in local storage
      localStorage.setItem('actionPlan', JSON.stringify(actionPlan));
      
      // Generate the final financial plan that includes all sections
      generateFinalReport();
      
      // Show a success message
      showSuccessMessage('Maßnahmenplan erfolgreich gespeichert');
      break;
  }
}

// Function to generate the final financial planning report
function generateFinalReport() {
  console.log("Generating final financial plan...");
  
  // Get data from storage
  const customerProfile = JSON.parse(localStorage.getItem('customerProfile') || '{}');
  const currentSituation = JSON.parse(localStorage.getItem('currentSituation') || '{}');
  const retirementPlanning = JSON.parse(localStorage.getItem('retirementPlanning') || '{}');
  const taxOptimization = JSON.parse(localStorage.getItem('taxOptimization') || '{}');
  const investmentConcept = JSON.parse(localStorage.getItem('investmentConcept') || '{}');
  const realEstate = JSON.parse(localStorage.getItem('realEstate') || '{}');
  const estatePlanning = JSON.parse(localStorage.getItem('estatePlanning') || '{}');
  const actionPlan = JSON.parse(localStorage.getItem('actionPlan') || '{}');
  
  // Format to 2 decimal places and use thousands separator for CHF amounts
  const formatCHF = (amount) => {
    return new Intl.NumberFormat('de-CH', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }).format(amount);
  };
  
  // Create a section for the final report if it doesn't exist
  let reportSection = document.getElementById('section-final-report');
  if (!reportSection) {
    reportSection = document.createElement('section');
    reportSection.id = 'section-final-report';
    reportSection.className = 'section';
    document.querySelector('main').appendChild(reportSection);
    
    // Add a navigation link if needed
    const navLink = document.createElement('a');
    navLink.className = 'nav-link';
    navLink.setAttribute('data-target', 'section-final-report');
    navLink.textContent = 'Finanzplan';
    document.querySelector('.nav').appendChild(navLink);
    
    // Add event listener to the new navigation link
    navLink.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all links
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      
      // Add active class to clicked link
      this.classList.add('active');
      
      // Hide all sections
      document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
      
      // Show this section
      reportSection.classList.remove('hidden');
      
      // Save the current section in local storage
      localStorage.setItem('currentSection', 'section-final-report');
    });
  }
  
  // Format marital status
  let maritalStatusText = '';
  switch (customerProfile.maritalStatus) {
    case 'single': maritalStatusText = 'Ledig'; break;
    case 'married': maritalStatusText = 'Verheiratet'; break;
    case 'divorced': maritalStatusText = 'Geschieden'; break;
    case 'widowed': maritalStatusText = 'Verwitwet'; break;
    case 'registered-partnership': maritalStatusText = 'Eingetragene Partnerschaft'; break;
    default: maritalStatusText = customerProfile.maritalStatus || '';
  }

  // Prepare the AHV pension display with more context and clarity
  let ahvPensionDisplay = '';
  if (retirementPlanning.results?.ahvRente) {
    const ahvRente = retirementPlanning.results.ahvRente;
    
    // If 13th pension is enabled, show base + 13th separately
    if (ahvRente.with13thRente) {
      ahvPensionDisplay = `
        <p><strong>AHV-Basis-Jahresrente (12 Monate):</strong> CHF ${formatCHF(ahvRente.baseYearlyRente)}</p>
        <p><strong>13. AHV-Rente:</strong> CHF ${formatCHF(ahvRente.thirteenthRente)}</p>
        <p><strong>Gesamt-Jahresrente:</strong> CHF ${formatCHF(ahvRente.yearlyRente)}</p>
      `;
    } else {
      ahvPensionDisplay = `
        <p><strong>AHV-Jahresrente:</strong> CHF ${formatCHF(ahvRente.yearlyRente)}</p>
      `;
    }
  }
  
  // Prepare the affordability display with more detail
  let affordabilityDisplay = '';
  if (realEstate.affordabilityRatio !== undefined) {
    // Add more detailed affordability information
    const affordabilityClass = realEstate.affordabilityRatio <= 0.28 ? 'optimal' : 
                              (realEstate.affordabilityRatio <= 0.33 ? 'akzeptabel' : 'kritisch');
    
    // Create a gauge visualization for affordability
    const affordabilityPercentage = (realEstate.affordabilityRatio * 100).toFixed(1);
    const gaugePercentage = Math.min(realEstate.affordabilityRatio * 100, 50); // Cap at 50% for visualization
    const gaugeColor = affordabilityClass === 'optimal' ? '#4CAF50' : 
                      (affordabilityClass === 'akzeptabel' ? '#FF9800' : '#F44336');
    
    affordabilityDisplay = `
      <p><strong>Tragbarkeit:</strong> ${realEstate.isAffordable ? '✓ Gegeben' : '✗ Nicht gegeben'} (${affordabilityPercentage}%)</p>
      
      <div class="visualization-container">
        <div class="gauge-container">
          <div class="gauge">
            <div class="gauge-fill" style="width: ${gaugePercentage*2}%; background-color: ${gaugeColor};"></div>
          </div>
          <div class="gauge-markers">
            <span class="marker" style="left: 0%">0%</span>
            <span class="marker optimal" style="left: 28%">28%</span>
            <span class="marker acceptable" style="left: 33%">33%</span>
            <span class="marker" style="left: 50%">50%</span>
          </div>
        </div>
        <div class="gauge-legend">
          <span class="legend-item"><span class="color-box" style="background-color: #4CAF50;"></span> Optimal (≤28%)</span>
          <span class="legend-item"><span class="color-box" style="background-color: #FF9800;"></span> Akzeptabel (≤33%)</span>
          <span class="legend-item"><span class="color-box" style="background-color: #F44336;"></span> Kritisch (>33%)</span>
        </div>
      </div>
    `;
  } else {
    affordabilityDisplay = realEstate.isAffordable ? '✓ Gegeben' : '✗ Nicht gegeben';
  }
  
  // Prepare tax savings display with more context and visualization
  let taxSavingsDisplay = '';
  if (taxOptimization.taxSavings !== undefined) {
    // More detailed attribution of savings
    const pkSavings = taxOptimization.pensionPurchasePotential ? (taxOptimization.pensionPurchasePotential * 0.25) : 0;
    const pillar3aSavings = taxOptimization.pillar3aContribution ? (taxOptimization.pillar3aContribution * 0.25) : 0;
    const otherSavings = taxOptimization.taxSavings - pkSavings - pillar3aSavings;
    
    // Calculate percentages for pie chart
    const pkSavingsPct = Math.round(pkSavings / taxOptimization.taxSavings * 100);
    const pillar3aSavingsPct = Math.round(pillar3aSavings / taxOptimization.taxSavings * 100);
    const otherSavingsPct = 100 - pkSavingsPct - pillar3aSavingsPct;
    
    // Create SVG pie chart
    // Using simple SVG for the pie chart
    const createPieSegment = (startAngle, endAngle, color) => {
      const x1 = 50 + 40 * Math.cos(startAngle * Math.PI / 180);
      const y1 = 50 + 40 * Math.sin(startAngle * Math.PI / 180);
      const x2 = 50 + 40 * Math.cos(endAngle * Math.PI / 180);
      const y2 = 50 + 40 * Math.sin(endAngle * Math.PI / 180);
      
      // Determine if the arc should be drawn using the large-arc-flag
      const largeArc = endAngle - startAngle > 180 ? 1 : 0;
      
      return `<path d="M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${color}" />`;
    };
    
    // Calculate angles for pie segments
    let currentAngle = 0;
    let pieSvg = '<svg viewBox="0 0 100 100" class="pie-chart">';
    
    if (pkSavingsPct > 0) {
      const pkEndAngle = currentAngle + (pkSavingsPct * 3.6); // 3.6 degrees per percentage point
      pieSvg += createPieSegment(currentAngle, pkEndAngle, '#4CAF50');
      currentAngle = pkEndAngle;
    }
    
    if (pillar3aSavingsPct > 0) {
      const pillar3aEndAngle = currentAngle + (pillar3aSavingsPct * 3.6);
      pieSvg += createPieSegment(currentAngle, pillar3aEndAngle, '#2196F3');
      currentAngle = pillar3aEndAngle;
    }
    
    if (otherSavingsPct > 0) {
      const otherEndAngle = currentAngle + (otherSavingsPct * 3.6);
      pieSvg += createPieSegment(currentAngle, otherEndAngle, '#FFC107');
    }
    
    pieSvg += '</svg>';
    
    taxSavingsDisplay = `
      <p><strong>Gesamte Steuerersparnis:</strong> CHF ${formatCHF(taxOptimization.taxSavings)}</p>
      
      <div class="visualization-container tax-savings-container">
        <div class="pie-chart-container">
          ${pieSvg}
        </div>
        <div class="pie-chart-legend">
          ${pkSavingsPct > 0 ? `<div class="legend-item"><span class="color-box" style="background-color: #4CAF50;"></span> PK-Einkauf: CHF ${formatCHF(pkSavings)} (${pkSavingsPct}%)</div>` : ''}
          ${pillar3aSavingsPct > 0 ? `<div class="legend-item"><span class="color-box" style="background-color: #2196F3;"></span> Säule 3a: CHF ${formatCHF(pillar3aSavings)} (${pillar3aSavingsPct}%)</div>` : ''}
          ${otherSavingsPct > 0 ? `<div class="legend-item"><span class="color-box" style="background-color: #FFC107;"></span> Andere: CHF ${formatCHF(otherSavings)} (${otherSavingsPct}%)</div>` : ''}
        </div>
      </div>
    `;
  }
  
  // Create a visualization for asset allocation if available
  let assetAllocationDisplay = '';
  if (investmentConcept.allocation) {
    const allocation = investmentConcept.allocation;
    
    // Create a horizontal bar chart for asset allocation
    assetAllocationDisplay = `
      <h4>Empfohlene Vermögensallokation:</h4>
      <div class="visualization-container">
        <div class="bar-chart-container">
          ${allocation.cash > 0 ? `
            <div class="bar-item">
              <div class="bar-label">Liquidität</div>
              <div class="bar-wrapper">
                <div class="bar-fill" style="width: ${allocation.cash}%; background-color: #E3F2FD;">
                  <span class="bar-value">${allocation.cash}%</span>
                </div>
              </div>
            </div>
          ` : ''}
          
          ${allocation.bonds > 0 ? `
            <div class="bar-item">
              <div class="bar-label">Obligationen</div>
              <div class="bar-wrapper">
                <div class="bar-fill" style="width: ${allocation.bonds}%; background-color: #BBDEFB;">
                  <span class="bar-value">${allocation.bonds}%</span>
                </div>
              </div>
            </div>
          ` : ''}
          
          ${allocation.stocks > 0 ? `
            <div class="bar-item">
              <div class="bar-label">Aktien</div>
              <div class="bar-wrapper">
                <div class="bar-fill" style="width: ${allocation.stocks}%; background-color: #90CAF9;">
                  <span class="bar-value">${allocation.stocks}%</span>
                </div>
              </div>
            </div>
          ` : ''}
          
          ${allocation.realEstate > 0 ? `
            <div class="bar-item">
              <div class="bar-label">Immobilien</div>
              <div class="bar-wrapper">
                <div class="bar-fill" style="width: ${allocation.realEstate}%; background-color: #64B5F6;">
                  <span class="bar-value">${allocation.realEstate}%</span>
                </div>
              </div>
            </div>
          ` : ''}
          
          ${allocation.alternative > 0 ? `
            <div class="bar-item">
              <div class="bar-label">Alternative</div>
              <div class="bar-wrapper">
                <div class="bar-fill" style="width: ${allocation.alternative}%; background-color: #42A5F5;">
                  <span class="bar-value">${allocation.alternative}%</span>
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
  
  // Create retirement income visualization if data is available
  let retirementIncomeDisplay = '';
  if (retirementPlanning.results?.ahvRente) {
    const ahvRente = retirementPlanning.results.ahvRente;
    
    // Estimate required income in retirement (simplified, typically 80% of current income)
    const currentSituationData = JSON.parse(localStorage.getItem('currentSituation') || '{}');
    const currentIncome = currentSituationData.totalIncome || 100000; // default if not available
    const targetRetirementIncome = currentIncome * 0.8;
    
    // Calculate potential income gap
    const ahvIncome = ahvRente.yearlyRente;
    const incomeGap = targetRetirementIncome - ahvIncome;
    const incomeGapPercentage = Math.round((incomeGap / targetRetirementIncome) * 100);
    
    // Create a stacked bar chart to visualize the income sources and gap
    retirementIncomeDisplay = `
      <h4>Einkommenssituation im Ruhestand:</h4>
      <div class="visualization-container">
        <div class="stacked-bar-container">
          <div class="stacked-bar">
            <div class="bar-segment ahv-segment" style="width: ${Math.round((ahvIncome / targetRetirementIncome) * 100)}%;">
              <span class="segment-label">AHV</span>
            </div>
            <div class="bar-segment gap-segment" style="width: ${incomeGapPercentage}%;">
              <span class="segment-label">Lücke</span>
            </div>
          </div>
          <div class="scale-markers">
            <span class="marker" style="left: 0%">0%</span>
            <span class="marker" style="left: 50%">50%</span>
            <span class="marker" style="left: 100%">100%</span>
          </div>
        </div>
        
        <div class="income-legend">
          <div class="legend-item">
            <span class="color-box ahv-color"></span> AHV-Rente: CHF ${formatCHF(ahvIncome)}/Jahr (${Math.round((ahvIncome / targetRetirementIncome) * 100)}%)
          </div>
          <div class="legend-item">
            <span class="color-box gap-color"></span> Einkommenslücke: CHF ${formatCHF(incomeGap)}/Jahr (${incomeGapPercentage}%)
          </div>
          <div class="legend-item target-income">
            Ziel-Ruhestandseinkommen: CHF ${formatCHF(targetRetirementIncome)}/Jahr (80% des aktuellen Einkommens)
          </div>
        </div>
      </div>
    `;
  }
  
  // Enhance the estate planning recommendations with more detail
  let estatePlanningRecommendations = '';
  if (estatePlanning.recommendations && estatePlanning.recommendations.length > 0) {
    // Add more context to each recommendation
    const enhancedRecommendations = estatePlanning.recommendations.map(rec => {
      if (rec.includes('Testament')) {
        return `${rec} - Ermöglicht individuelle Nachlassregelung und Minimierung von Erbschaftsstreitigkeiten`;
      } else if (rec.includes('Ehevertrag')) {
        return `${rec} - Optimiert güterrechtliche Situation und kann Steuern bei Vermögensübertragung minimieren`;
      } else if (rec.includes('Vorsorgeauftrag')) {
        return `${rec} - Bestimmt Vertretungsperson für Vermögens- und Rechtsangelegenheiten bei Urteilsunfähigkeit`;
      } else if (rec.includes('Patientenverfügung')) {
        return `${rec} - Legt medizinische Behandlungswünsche für den Fall der Urteilsunfähigkeit fest`;
      } else {
        return rec;
      }
    });
    
    estatePlanningRecommendations = `
      <h4>Empfehlungen zur Nachlassplanung:</h4>
      <ul>
        ${enhancedRecommendations.map(rec => `<li>${rec}</li>`).join('')}
      </ul>
    `;
  }
  
  // Add CSS styles for visualizations
  const visualizationStyles = `
    <style>
      /* General visualization styles */
      .visualization-container {
        margin: 20px 0;
        padding: 15px;
        background-color: #f9f9f9;
        border-radius: 5px;
      }
      
      /* Legend styles */
      .color-box {
        display: inline-block;
        width: 15px;
        height: 15px;
        margin-right: 5px;
        border-radius: 3px;
        vertical-align: middle;
      }
      
      .legend-item {
        margin: 5px 0;
        font-size: 0.9em;
      }
      
      /* Affordability gauge styles */
      .gauge-container {
        position: relative;
        margin: 30px 0 15px;
      }
      
      .gauge {
        height: 20px;
        background-color: #e0e0e0;
        border-radius: 10px;
        overflow: hidden;
      }
      
      .gauge-fill {
        height: 100%;
        border-radius: 10px;
        transition: width 1s;
      }
      
      .gauge-markers {
        position: relative;
        height: 20px;
      }
      
      .marker {
        position: absolute;
        transform: translateX(-50%);
        font-size: 0.8em;
        top: 0;
      }
      
      .gauge-legend {
        margin-top: 10px;
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
      }
      
      /* Pie chart styles */
      .pie-chart-container {
        width: 150px;
        margin: 0 auto;
      }
      
      .pie-chart {
        width: 100%;
        height: auto;
      }
      
      .pie-chart-legend {
        margin-top: 15px;
        text-align: center;
      }
      
      .tax-savings-container {
        text-align: center;
      }
      
      /* Bar chart styles */
      .bar-chart-container {
        margin: 15px 0;
      }
      
      .bar-item {
        margin-bottom: 12px;
      }
      
      .bar-label {
        display: inline-block;
        width: 100px;
        font-size: 0.9em;
      }
      
      .bar-wrapper {
        display: inline-block;
        width: calc(100% - 110px);
        background-color: #e0e0e0;
        border-radius: 3px;
        overflow: hidden;
      }
      
      .bar-fill {
        height: 20px;
        border-radius: 3px;
        text-align: right;
        transition: width 1s;
      }
      
      .bar-value {
        padding-right: 5px;
        color: #333;
        font-size: 0.8em;
        line-height: 20px;
        font-weight: bold;
      }
      
      /* Retirement income chart styles */
      .stacked-bar-container {
        position: relative;
        margin: 30px 0 15px;
      }
      
      .stacked-bar {
        height: 30px;
        background-color: #e0e0e0;
        border-radius: 5px;
        overflow: hidden;
        display: flex;
      }
      
      .bar-segment {
        height: 100%;
        text-align: center;
        position: relative;
      }
      
      .segment-label {
        position: absolute;
        width: 100%;
        text-align: center;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        color: white;
        font-size: 0.8em;
        font-weight: bold;
        text-shadow: 0 0 2px #000;
      }
      
      .ahv-segment {
        background-color: #4CAF50;
      }
      
      .gap-segment {
        background-color: #F44336;
      }
      
      .scale-markers {
        position: relative;
        height: 20px;
      }
      
      .ahv-color {
        background-color: #4CAF50;
      }
      
      .gap-color {
        background-color: #F44336;
      }
      
      .target-income {
        margin-top: 10px;
        font-weight: bold;
      }
      
      .income-legend {
        margin-top: 10px;
      }
      
      /* Print styles */
      @media print {
        .visualization-container {
          break-inside: avoid;
          page-break-inside: avoid;
        }
        
        .report-section {
          break-inside: avoid;
          page-break-inside: avoid;
        }
      }
    </style>
  `;
  
  // Build the comprehensive report
  reportSection.innerHTML = `
    ${visualizationStyles}
    <h2>Finanzplan für ${customerProfile.firstName || ''} ${customerProfile.lastName || ''}</h2>
    
    <div class="report-section">
      <h3>Persönliche Daten</h3>
      <p><strong>Name:</strong> ${customerProfile.firstName || ''} ${customerProfile.lastName || ''}</p>
      <p><strong>Geburtsdatum:</strong> ${customerProfile.birthDate || ''}</p>
      <p><strong>Zivilstand:</strong> ${maritalStatusText}</p>
      <p><strong>Kinder:</strong> ${customerProfile.children || 0}</p>
    </div>
    
    <div class="report-section">
      <h3>Finanzielle Situation</h3>
      <p><strong>Gesamteinkommen:</strong> CHF ${formatCHF(currentSituation.totalIncome || 0)}</p>
    </div>
    
    <div class="report-section">
      <h3>Vorsorgeplanung</h3>
      <p><strong>Geplantes Pensionierungsalter:</strong> ${retirementPlanning.data?.retirementAge || 65} Jahre</p>
      ${ahvPensionDisplay}
      <p><strong>Mit 13. AHV-Rente:</strong> ${retirementPlanning.results?.ahvRente?.with13thRente ? 'Ja' : 'Nein'}</p>
      ${retirementIncomeDisplay}
    </div>
    
    <div class="report-section">
      <h3>Steueroptimierung</h3>
      <p><strong>Steuerbares Einkommen:</strong> CHF ${formatCHF(taxOptimization.income || 0)}</p>
      ${taxSavingsDisplay}
    </div>
    
    <div class="report-section">
      <h3>Anlagekonzept</h3>
      <p><strong>Risikoprofil:</strong> ${investmentConcept.riskProfile || ''}</p>
      <p><strong>Anlagevermögen:</strong> CHF ${formatCHF(investmentConcept.investmentAmount || 0)}</p>
      <p><strong>Erwartete jährliche Rendite:</strong> ${investmentConcept.expectedReturn ? (investmentConcept.expectedReturn * 100).toFixed(2) : 0}%</p>
      ${assetAllocationDisplay}
    </div>
    
    <div class="report-section">
      <h3>Immobilienfinanzierung</h3>
      <p><strong>Immobilienwert:</strong> CHF ${formatCHF(realEstate.propertyValue || 0)}</p>
      <p><strong>Hypothekarbetrag:</strong> CHF ${formatCHF(realEstate.mortgageAmount || 0)}</p>
      ${affordabilityDisplay}
    </div>
    
    <div class="report-section">
      <h3>Nachlassplanung</h3>
      <p><strong>Testament vorhanden:</strong> ${estatePlanning.hasWill === 'yes' ? 'Ja' : 'Nein'}</p>
      ${estatePlanningRecommendations}
    </div>
    
    <div class="report-section">
      <h3>Maßnahmenplan</h3>
      <h4>Kurzfristige Maßnahmen:</h4>
      <p>${actionPlan.shortTermActions || 'Keine kurzfristigen Maßnahmen definiert.'}</p>
      
      <h4>Mittelfristige Maßnahmen:</h4>
      <p>${actionPlan.mediumTermActions || 'Keine mittelfristigen Maßnahmen definiert.'}</p>
      
      <h4>Langfristige Maßnahmen:</h4>
      <p>${actionPlan.longTermActions || 'Keine langfristigen Maßnahmen definiert.'}</p>
    </div>
    
    <div class="report-section">
      <h3>Zusammenfassung</h3>
      <p>Die finanzielle Planung für ${customerProfile.firstName || ''} ${customerProfile.lastName || ''} wurde erstellt basierend auf den eingegebenen Daten. Die 13. AHV-Rente, die ab 2026 eingeführt wird, wurde in den Berechnungen ${retirementPlanning.results?.ahvRente?.with13thRente ? 'berücksichtigt' : 'nicht berücksichtigt'}.</p>
      <p>Mit dem geplanten Pensionierungsalter von ${retirementPlanning.data?.retirementAge || 65} Jahren kann eine jährliche AHV-Rente von CHF ${formatCHF(retirementPlanning.results?.ahvRente?.yearlyRente || 0)} erwartet werden.</p>
      <p>Die empfohlene Vermögensallokation basiert auf dem ${investmentConcept.riskProfile || 'ausgewogenen'} Risikoprofil und zielt auf eine erwartete jährliche Rendite von ${investmentConcept.expectedReturn ? (investmentConcept.expectedReturn * 100).toFixed(2) : 0}% ab.</p>
    </div>
    
    <div class="report-actions">
      <button class="btn" onclick="window.print()">Finanzplan drucken</button>
    </div>
  `;
  
  // Navigate to the report section
  reportSection.classList.remove('hidden');
  document.querySelectorAll('.section').forEach(section => {
    if (section !== reportSection) section.classList.add('hidden');
  });
  
  // Update navigation
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  const reportLink = document.querySelector('[data-target="section-final-report"]');
  if (reportLink) reportLink.classList.add('active');
  
  // Save the current section
  localStorage.setItem('currentSection', 'section-final-report');
}

// Add other necessary functions as needed
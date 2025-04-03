// Finanzplaner-Tool - Benutzeroberfläche und Navigation

// Hauptfunktion zum Initialisieren der Benutzeroberfläche
function initializeUI() {
  // Lade die Berechnungsmodule
  const calculations = require('./calculations.js');
  const steuerOptimierung = require('./calculations_steueroptimierung.js');
  const vermoegensAllokation = require('./calculations_vermoegensallokation.js');
  const liquiditaetsplanung = require('./calculations_liquiditaetsplanung.js');
  const excelFunctions = require('./excel_functions.js');
  
  // Initialisiere den 13. AHV-Rente-Schalter
  initializeAHVToggle();
  
  // Initialisiere die Navigation
  initializeNavigation();
  
  // Initialisiere die Formularvalidierung
  initializeFormValidation();
  
  // Lade die Standardwerte
  loadDefaultValues();
  
  console.log("Finanzplaner-Tool UI initialisiert");
}

// Funktion zum Initialisieren des 13. AHV-Rente-Schalters
function initializeAHVToggle() {
  const toggle = document.getElementById('toggle-13-ahv');
  if (toggle) {
    // Setze den initialen Zustand des Schalters
    toggle.checked = true; // Standardmäßig aktiviert (ab 2026)
    
    // Aktualisiere die Anzeige des Schalters
    updateAHVToggleDisplay(toggle.checked);
    
    toggle.addEventListener('change', function() {
      // Aktualisiere die Berechnungen
      const calculations = require('./calculations.js');
      calculations.toggle13thAHVRente(this.checked);
      
      // Aktualisiere die Anzeige des Schalters
      updateAHVToggleDisplay(this.checked);
      
      // Aktualisiere alle Berechnungen
      updateAllCalculations();
    });
  }
}

// Funktion zum Aktualisieren der Anzeige des 13. AHV-Rente-Schalters
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

// Funktion zum Initialisieren der Navigation
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Entferne aktive Klasse von allen Links
      navLinks.forEach(l => l.classList.remove('active'));
      
      // Füge aktive Klasse zum geklickten Link hinzu
      this.classList.add('active');
      
      // Verstecke alle Abschnitte
      sections.forEach(section => section.classList.add('hidden'));
      
      // Zeige den entsprechenden Abschnitt an
      const targetId = this.getAttribute('data-target');
      document.getElementById(targetId).classList.remove('hidden');
      
      // Speichere den aktuellen Abschnitt im lokalen Speicher
      localStorage.setItem('currentSection', targetId);
    });
  });
  
  // Lade den zuletzt angezeigten Abschnitt oder den ersten Abschnitt
  const currentSection = localStorage.getItem('currentSection') || 'section-intro';
  document.querySelector(`[data-target="${currentSection}"]`).click();
}

// Funktion zum Initialisieren der Formularvalidierung
function initializeFormValidation() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validiere das Formular
      if (validateForm(this)) {
        // Wenn das Formular gültig ist, führe die Berechnungen durch
        processForm(this);
      }
    });
  });
}

// Funktion zum Validieren eines Formulars
function validateForm(form) {
  let isValid = true;
  
  // Validiere alle erforderlichen Felder
  const requiredFields = form.querySelectorAll('[required]');
  requiredFields.forEach(field => {
    if (!field.value) {
      isValid = false;
      field.classList.add('invalid');
    } else {
      field.classList.remove('invalid');
    }
  });
  
  // Validiere numerische Felder
  const numericFields = form.querySelectorAll('[data-type="numeric"]');
  numericFields.forEach(field => {
    if (field.value && isNaN(parseFloat(field.value))) {
      isValid = false;
      field.classList.add('invalid');
    } else {
      field.classList.remove('invalid');
    }
  });
  
  // Validiere Datumsfelder
  const dateFields = form.querySelectorAll('[data-type="date"]');
  dateFields.forEach(field => {
    if (field.value && !isValidDate(field.value)) {
      isValid = false;
      field.classList.add('invalid');
    } else {
      field.classList.remove('invalid');
    }
  });
  
  return isValid;
}

// Funktion zum Überprüfen, ob ein Datum gültig ist
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

// Funktion zum Verarbeiten eines Formulars
function processForm(form) {
  const formId = form.id;
  
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
      console.error('Unbekanntes Formular:', formId);
  }
}

// Funktion zum Verarbeiten des Kundenprofils
function processCustomerProfile(form) {
  // Extrahiere die Daten aus dem Formular
  const data = {
    firstName: form.querySelector('#first-name').value,
    lastName: form.querySelector('#last-name').value,
    birthDate: form.querySelector('#birth-date').value,
    maritalStatus: form.querySelector('#marital-status').value,
    children: parseInt(form.querySelector('#children').value || '0'),
    profession: form.querySelector('#profession').value,
    employer: form.querySelector('#employer').value,
    address: form.querySelector('#address').value,
    postalCode: form.querySelector('#postal-code').value,
    city: form.querySelector('#city').value,
    canton: form.querySelector('#canton').value,
    email: form.querySelector('#email').value,
    phone: form.querySelector('#phone').value,
    goals: form.querySelector('#goals').value
  };
  
  // Speichere die Daten im lokalen Speicher
  localStorage.setItem('customerProfile', JSON.stringify(data));
  
  // Aktualisiere die Zusammenfassung
  updateCustomerProfileSummary(data);
  
  // Zeige eine Erfolgsmeldung an
  showSuccessMessage('Kundenprofil erfolgreich gespeichert');
  
  // Navigiere zum nächsten Abschnitt
  document.querySelector('[data-target="section-current-situation"]').click();
}

// Funktion zum Aktualisieren der Kundenprofil-Zusammenfassung
function updateCustomerProfileSummary(data) {
  const summary = document.getElementById('customer-profile-summary');
  if (!summary) return;
  
  // Berechne das Alter
  const birthDate = parseDate(data.birthDate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  // Formatiere den Zivilstand
  let maritalStatusText = '';
  switch (data.maritalStatus) {
    case 'single':
      maritalStatusText = 'Ledig';
      break;
    case 'married':
      maritalStatusText = 'Verheiratet';
      break;
    case 'divorced':
      maritalStatusText = 'Geschieden';
      break;
    case 'widowed':
      maritalStatusText = 'Verwitwet';
      break;
    case 'registered-partnership':
      maritalStatusText = 'Eingetragene Partnerschaft';
      break;
    default:
      maritalStatusText = data.maritalStatus;
  }
  
  // Aktualisiere die Zusammenfassung
  summary.innerHTML = `
    <h3>${data.firstName} ${data.lastName}</h3>
    <p><strong>Alter:</strong> ${age} Jahre</p>
    <p><strong>Zivilstand:</strong> ${maritalStatusText}</p>
    <p><strong>Kinder:</strong> ${data.children}</p>
    <p><strong>Beruf:</strong> ${data.profession}</p>
    <p><strong>Arbeitgeber:</strong> ${data.employer}</p>
    <p><strong>Wohnort:</strong> ${data.postalCode} ${data.city}, ${data.canton}</p>
    <p><strong>Ziele:</strong> ${data.goals}</p>
  `;
  
  // Zeige die Zusammenfassung an
  summary.style.display = 'block';
}

// Funktion zum Verarbeiten der Vorsorgeplanung
function processRetirementPlanning(form) {
  // Lade die Berechnungsmodule
  const calculations = require('./calculations.js');
  
  // Lade das Kundenprofil
  const customerProfile = JSON.parse(localStorage.getItem('customerProfile') || '{}');
  
  // Extrahiere die Daten aus dem Formular
  const data = {
    ahv: {
      contributionYears: parseInt(form.querySelector('#ahv-contribution-years').value || '0'),
      hasGaps: form.querySelector('#ahv-has-gaps').checked,
      missingYears: parseInt(form.querySelector('#ahv-missing-years').value || '0'),
      averageIncome: parseFloat(form.querySelector('#ahv-average-income').value || '0'),
      plannedRetirementAge: parseInt(form.querySelector('#ahv-planned-retirement-age').value || '65'),
      earlyWithdrawal: form.querySelector('#ahv-early-withdrawal').checked,
      deferral: form.querySelector('#ahv-deferral').checked
    },
    pensionFund: {
      name: form.querySelector('#pension-fund-name').value,
      plan: form.querySelector('#pension-fund-plan').value,
      currentCapital: parseFloat(form.querySelector('#pension-fund-current-capital').value || '0'),
      conversionRate: parseFloat(form.querySelector('#pension-fund-conversion-rate').value || '0.068'),
      capitalWithdrawal: form.querySelector('#pension-fund-capital-withdrawal').checked,
      capitalWithdrawalPercentage: parseInt(form.querySelector('#pension-fund-capital-withdrawal-percentage').value || '0'),
      plannedPurchase: form.querySelector('#pension-fund-planned-purchase').checked,
      purchaseAmount: parseFloat(form.querySelector('#pension-fund-purchase-amount').value || '0'),
      purchaseDate: form.querySelector('#pension-fund-purchase-date').value
    },
    pillar3a: {
      currentCapital: parseFloat(form.querySelector('#pillar3a-current-capital').value || '0'),
      annualContribution: parseFloat(form.querySelector('#pillar3a-annual-contribution').value || '0'),
      withdrawalStrategy: form.querySelector('#pillar3a-withdrawal-strategy').value,
      staggeredWithdrawalPlan: form.querySelector('#pillar3a-staggered-withdrawal-plan').value
    }
  };
  
  // Berechne das Alter
  const birthDate = parseDate(customerProfile.birthDate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  // Berechne die Jahre bis zur Pensionierung
  const yearsToRetirement = data.ahv.plannedRetirementAge - age;
  
  // Berechne die AHV-Rente
  const ahvRente = calculations.calculateAHVRente(
    data.ahv.averageIncome,
    data.ahv.contributionYears - data.ahv.missingYears,
    customerProfile.maritalStatus === 'married' || customerProfile.maritalStatus === 'registered-partnership'
  );
  
  // Berechne die AHV-Rente mit 13. AHV-Rente
  const ahvRenteMit13 = calculations.calculateAHVRenteWith13th(
    data.ahv.averageIncome,
    data.ahv.contributionYears - data.ahv.missingYears,
    customerProfile.maritalStatus === 'married' || customerProfile.maritalStatus === 'registered-partnership'
  );
  
  // Berechne die Pensionskassenleistungen
  const pensionFundCapital = calculations.calculatePensionFundCapital(
    data.pensionFund.currentCapital,
    yearsToRetirement
  );
  
  const pensionFundRente = calculations.calculatePensionFundRente(
    pensionFundCapital,
    data.pensionFund.conversionRate
  );
  
  // Berechne die Säule 3a
  const pillar3aCapital = calculations.calculatePillar3a(
    data.pillar3a.currentCapital,
    yearsToRetirement,
    data.pillar3a.annualContribution
  );
  
  // Speichere die Daten und Berechnungsergebnisse im lokalen Speicher
  localStorage.setItem('retirementPlanning', JSON.stringify({
    data: data,
    results: {
      ahvRente: ahvRente,
      ahvRenteMit13: ahvRenteMit13,
      pensionFundCapital: pensionFundCapital,
      pensionFundRente: pensionFundRente,
      pillar3aCapital: pillar3aCapital
    }
  }));
  
  // Aktualisiere die Zusammenfassung
  updateRetirementPlanningSummary(data, {
    ahvRente: ahvRente,
    ahvRenteMit13: ahvRenteMit13,
    pensionFundCapital: pensionFundCapital,
    pensionFundRente: pensionFundRente,
    pillar3aCapital: pillar3aCapital
  });
  
  // Zeige eine Erfolgsmeldung an
  showSuccessMessage('Vorsorgeplanung erfolgreich berechnet');
  
  // Navigiere zum nächsten Abschnitt
  document.querySelector('[data-target="section-tax-optimization"]').click();
}

// Funktion zum Verarbeiten der Steueroptimierung
function processTaxOptimization(form) {
  // Lade die Berechnungsmodule
  const steuerOptimierung = require('./calculations_steueroptimierung.js');
  
  // Lade das Kundenprofil und die Vorsorgeplanung
  const customerProfile = JSON.parse(localStorage.getItem('customerProfile') || '{}');
  const currentSituation = JSON.parse(localStorage.getItem('currentSituation') || '{}');
  const retirementPlanning = JSON.parse(localStorage.getItem('retirementPlanning') || '{}');
  
  // Extrahiere die Daten aus dem Formular
  const data = {
    income: parseFloat(form.querySelector('#tax-income').value || '0'),
    wealth: parseFloat(form.querySelector('#tax-wealth').value || '0'),
    pensionPurchasePotential: parseFloat(form.querySelector('#tax-pension-purchase-potential').value || '0'),
    pillar3aContribution: parseFloat(form.querySelector('#tax-pillar3a-contribution').value || '0'),
    renovationCosts: parseFloat(form.querySelector('#tax-renovation-costs').value || '0')
  };
  
  // Berechne das Alter
  const birthDate = parseDate(customerProfile.birthDate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  // Berechne die Jahre bis zur Pensionierung
  const yearsToRetirement = retirementPlanning.data ? 
    retirementPlanning.data.ahv.plannedRetirementAge - age : 65 - age;
  
  // Berechne die Steueroptimierung
  const taxOptimization = steuerOptimierung.calculateTotalTaxOptimization(
    data.income,
    data.wealth,
    data.pensionPurchasePotential,
    data.pillar3aContribution,
    data.renovationCosts,
    customerProfile.canton || 'BE',
    customerProfile.maritalStatus === 'married' || customerProfile.maritalStatus === 'registered-partnership' ? 'married' : 'single',
    yearsToRetirement
  );
  
  // Speichere die Daten und Berechnungsergebnisse im lokalen Speicher
  localStorage.setItem('taxOptimization', JSON.stringif
(Content truncated due to size limit. Use line ranges to read in chunks)
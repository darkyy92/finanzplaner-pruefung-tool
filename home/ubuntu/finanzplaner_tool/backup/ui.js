// Finanzplaner-Tool - Benutzeroberfläche und Navigation

// Hauptfunktion zum Initialisieren der Benutzeroberfläche
function initializeUI() {
  // Lade die Berechnungsmodule
  const calculations = require('./calculations_updated.js');
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
    toggle.addEventListener('change', function() {
      const calculations = require('./calculations_updated.js');
      calculations.toggle13thAHVRente(this.checked);
      updateAllCalculations();
    });
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
}

// Funktion zum Verarbeiten der Ist-Analyse
function processCurrentSituation(form) {
  // Extrahiere die Daten aus dem Formular
  const data = {
    income: {
      salary: parseFloat(form.querySelector('#salary').value || '0'),
      bonuses: parseFloat(form.querySelector('#bonuses').value || '0'),
      rentalIncome: parseFloat(form.querySelector('#rental-income').value || '0'),
      investmentIncome: parseFloat(form.querySelector('#investment-income').value || '0'),
      otherIncome: parseFloat(form.querySelector('#other-income').value || '0')
    },
    expenses: {
      housing: parseFloat(form.querySelector('#housing-expenses').value || '0'),
      insurance: parseFloat(form.querySelector('#insurance-expenses').value || '0'),
      transportation: parseFloat(form.querySelector('#transportation-expenses').value || '0'),
      food: parseFloat(form.querySelector('#food-expenses').value || '0'),
      leisure: parseFloat(form.querySelector('#leisure-expenses').value || '0'),
      otherExpenses: parseFloat(form.querySelector('#other-expenses').value || '0')
    },
    assets: {
      cash: parseFloat(form.querySelector('#cash-assets').value || '0'),
      securities: parseFloat(form.querySelector('#securities-assets').value || '0'),
      realEstate: parseFloat(form.querySelector('#real-estate-assets').value || '0'),
      pension2ndPillar: parseFloat(form.querySelector('#pension-2nd-pillar').value || '0'),
      pension3rdPillar: parseFloat(form.querySelector('#pension-3rd-pillar').value || '0'),
      otherAssets: parseFloat(form.querySelector('#other-assets').value || '0')
    },
    liabilities: {
      mortgage: parseFloat(form.querySelector('#mortgage-liabilities').value || '0'),
      loans: parseFloat(form.querySelector('#loans-liabilities').value || '0'),
      leasing: parseFloat(form.querySelector('#leasing-liabilities').value || '0'),
      otherLiabilities: parseFloat(form.querySelector('#other-liabilities').value || '0')
    }
  };
  
  // Berechne die Gesamtwerte
  data.totalIncome = Object.values(data.income).reduce((sum, value) => sum + value, 0);
  data.totalExpenses = Object.values(data.expenses).reduce((sum, value) => sum + value, 0);
  data.totalAssets = Object.values(data.assets).reduce((sum, value) => sum + value, 0);
  data.totalLiabilities = Object.values(data.liabilities).reduce((sum, value) => sum + value, 0);
  data.netWorth = data.totalAssets - data.totalLiabilities;
  data.monthlySurplus = (data.totalIncome - data.totalExpenses) / 12;
  
  // Speichere die Daten im lokalen Speicher
  localStorage.setItem('currentSituation', JSON.stringify(data));
  
  // Aktualisiere die Zusammenfassung
  updateCurrentSituationSummary(data);
  
  // Zeige eine Erfolgsmeldung an
  showSuccessMessage('Ist-Analyse erfolgreich gespeichert');
  
  // Navigiere zum nächsten Abschnitt
  document.querySelector('[data-target="section-retirement-planning"]').click();
}

// Funktion zum Aktualisieren der Ist-Analyse-Zusammenfassung
function updateCurrentSituationSummary(data) {
  const summary = document.getElementById('current-situation-summary');
  if (!summary) return;
  
  // Aktualisiere die Zusammenfassung
  summary.innerHTML = `
    <h3>Finanzielle Situation</h3>
    <p><strong>Gesamteinkommen:</strong> CHF ${formatNumber(data.totalIncome)}</p>
    <p><strong>Gesamtausgaben:</strong> CHF ${formatNumber(data.totalExpenses)}</p>
    <p><strong>Monatlicher Überschuss:</strong> CHF ${formatNumber(data.monthlySurplus)}</p>
    <p><strong>Gesamtvermögen:</strong> CHF ${formatNumber(data.totalAssets)}</p>
    <p><strong>Gesamtverbindlichkeiten:</strong> CHF ${formatNumber(data.totalLiabilities)}</p>
    <p><strong>Nettovermögen:</strong> CHF ${formatNumber(data.netWorth)}</p>
  `;
  
  // Erstelle ein Diagramm für die Einnahmen und Ausgaben
  createIncomeExpensesChart(data);
  
  // Erstelle ein Diagramm für die Vermögensallokation
  createAssetAllocationChart(data);
}

// Funktion zum Verarbeiten der Vorsorgeplanung
function processRetirementPlanning(form) {
  // Extrahiere die Daten aus dem Formular
  const data = {
    retirementAge: parseInt(form.querySelector('#retirement-age').value || '65'),
    lifeExpectancy: parseInt(form.querySelector('#life-expectancy').value || '90'),
    ahvContributionYears: parseInt(form.querySelector('#ahv-contribution-years').value || '44'),
    averageIncome: parseFloat(form.querySelector('#average-income').value || '0'),
    currentPensionCapital: parseFloat(form.querySelector('#current-pension-capital').value || '0'),
    annualPensionContribution: parseFloat(form.querySelector('#annual-pension-contribution').value || '0'),
    current3aPillarCapital: parseFloat(form.querySelector('#current-3a-pillar-capital').value || '0'),
    annual3aPillarContribution: parseFloat(form.querySelector('#annual-3a-pillar-contribution').value || '0'),
    otherRetirementAssets: parseFloat(form.querySelector('#other-retirement-assets').value || '0'),
    expectedReturnRate: parseFloat(form.querySelector('#expected-return-rate').value || '0') / 100,
    include13thAHVRente: form.querySelector('#include-13th-ahv-rente').checked
  };
  
  // Lade die Kundenprofildaten
  const customerProfile = JSON.parse(localStorage.getItem('customerProfile') || '{}');
  const birthDate = parseDate(customerProfile.birthDate || '01.01.1970');
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  // Berechne die Jahre bis zur Pensionierung
  data.yearsToRetirement = data.retirementAge - age;
  
  // Lade die Berechnungsmodule
  const calculations = require('./calculations_updated.js');
  
  // Setze den 13. AHV-Rente-Schalter
  calculations.toggle13thAHVRente(data.include13thAHVRente);
  
  // Berechne die AHV-Rente
  const gender = customerProfile.gender || 'male';
  const ahvRente = calculations.calculateAHVRente(
    data.averageIncome,
    data.ahvContributionYears,
    customerProfile.maritalStatus === 'married',
    customerProfile.maritalStatus === 'married' ? data.averageIncome * 0.8 : 0,
    customerProfile.maritalStatus === 'married' ? data.ahvContributionYears : 0
  );
  
  // Berechne das Pensionskassenkapital bei Pensionierung
  const pensionCapitalAtRetirement = calculations.calculatePensionCapital(
    data.currentPensionCapital,
    data.yearsToRetirement,
    data.annualPensionContribution,
    calculations.VALUES_2025.bvgMindestzinssatz
  );
  
  // Berechne die Pensionskassenrente
  const pensionRente = calculations.calculatePensionRente(
    pensionCapitalAtRetirement,
    calculations.VALUES_2025.bvgUmwandlungssatz
  );
  
  // Berechne das Säule 3a-Kapital bei Pensionierung
  const pillar3aCapitalAtRetirement = calculations.calculatePillar3a(
    data.current3aPillarCapital,
    data.yearsToRetirement,
    data.annual3aPillarContribution,
    data.expectedReturnRate
  );
  
  // Berechne das Gesamteinkommen im Ruhestand
  const totalRetirementIncome = calculations.calculateTotalRetirementIncome(
    ahvRente,
    pensionRente,
    pillar3aCapitalAtRetirement,
    data.otherRetirementAssets,
    data.lifeExpectancy,
    data.retirementAge
  );
  
  // Lade die Ist-Analyse-Daten
  const currentSituation = JSON.parse(localStorage.getItem('currentSituation') || '{}');
  const lastIncome = currentSituation.totalIncome || data.averageIncome;
  
  // Berechne die Ersatzquote
  const replacementRate = calculations.calculateReplacementRate(
    totalRetirementIncome,
    lastIncome
  );
  
  // Speichere die Berechnungsergebnisse
  data.ahvRente = ahvRente;
  data.pensionCapitalAtRetirement = pensionCapitalAtRetirement;
  data.pensionRente = pensionRente;
  data.pillar3aCapitalAtRetirement = pillar3aCapitalAtRetirement;
  data.totalRetirementIncome = totalRetirementIncome;
  data.replacementRate = replacementRate;
  
  // Speichere die Daten im lokalen Speicher
  localStorage.setItem('retireme
(Content truncated due to size limit. Use line ranges to read in chunks)
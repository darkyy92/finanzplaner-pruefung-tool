// Finanzplaner-Tool - Berechnungen und Formeln

// Konstanten für 2025
const VALUES_2025 = {
  // AHV-Werte
  ahvMinimumRente: 1260, // Minimale monatliche AHV-Rente
  ahvMaximumRente: 2520, // Maximale monatliche AHV-Rente
  ahvEhepaarMaximum: 3780, // Maximale monatliche AHV-Rente für Ehepaare (150% der Maximalrente)
  
  // BVG-Werte
  bvgMindestzinssatz: 0.0125, // 1.25%
  bvgUmwandlungssatz: 0.068, // 6.8%
  bvgKoordinationsabzug: 26460, // Koordinationsabzug
  bvgEintrittsschwelle: 22680, // Eintrittsschwelle
  bvgMaxVersicherterLohn: 90720, // Maximaler versicherter Lohn
  
  // Säule 3a
  saeule3aMaxMitPK: 7258, // Maximaler Beitrag mit Pensionskasse
  saeule3aMaxOhnePK: 36288, // Maximaler Beitrag ohne Pensionskasse (20% des Erwerbseinkommens, max. 36'288)
  
  // Steuerwerte
  quellensteuerEU: 0.35, // Quellensteuer EU
  
  // Inflation
  inflation: 0.01, // 1% p.a.
};

// Rendite-Annahmen
const RENDITE = {
  renditeAktienCHF: 0.05, // 5% p.a.
  renditeAktienInternational: 0.06, // 6% p.a.
  renditeObligationen: 0.02, // 2% p.a.
  renditeImmobilien: 0.03, // 3% p.a.
  renditeAlternativeAnlagen: 0.04, // 4% p.a.
  renditeLiquiditaet: 0.005, // 0.5% p.a.
};

// Variable für die 13. AHV-Rente
let enable13thAHVRente = true;

// Funktion zum Umschalten der 13. AHV-Rente
function toggle13thAHVRente(isEnabled) {
  enable13thAHVRente = isEnabled;
}

// Funktion zum Abfragen des Status der 13. AHV-Rente
function is13thAHVRenteEnabled() {
  return enable13thAHVRente;
}

// AHV-Rentenberechnung
function calculateAHVRente(averageIncome, contributionYears, isMarried = false, spouseAverageIncome = 0, spouseContributionYears = 0) {
  // Vereinfachte Berechnung basierend auf durchschnittlichem Einkommen und Beitragsjahren
  let rente = 0;
  
  // Vollständige Beitragsdauer (44 Jahre)
  const fullContributionYears = 44;
  
  // Rentenformel vereinfacht
  if (averageIncome <= 14700) {
    // Minimale Rente bei niedrigem Einkommen
    rente = VALUES_2025.ahvMinimumRente * (contributionYears / fullContributionYears);
  } else if (averageIncome >= 88200) {
    // Maximale Rente bei hohem Einkommen
    rente = VALUES_2025.ahvMaximumRente * (contributionYears / fullContributionYears);
  } else {
    // Lineare Interpolation für Einkommen zwischen Min und Max
    const renteFaktor = (averageIncome - 14700) / (88200 - 14700);
    const volleRente = VALUES_2025.ahvMinimumRente + renteFaktor * (VALUES_2025.ahvMaximumRente - VALUES_2025.ahvMinimumRente);
    rente = volleRente * (contributionYears / fullContributionYears);
  }
  
  // Monatliche Rente
  let monthlyRente = rente;
  
  // Für Ehepaare: Plafonierung auf 150% der Maximalrente
  if (isMarried) {
    // Berechnung der Rente des Ehepartners
    let spouseRente = 0;
    
    if (spouseAverageIncome <= 14700) {
      spouseRente = VALUES_2025.ahvMinimumRente * (spouseContributionYears / fullContributionYears);
    } else if (spouseAverageIncome >= 88200) {
      spouseRente = VALUES_2025.ahvMaximumRente * (spouseContributionYears / fullContributionYears);
    } else {
      const spouseRenteFaktor = (spouseAverageIncome - 14700) / (88200 - 14700);
      const spouseVolleRente = VALUES_2025.ahvMinimumRente + spouseRenteFaktor * (VALUES_2025.ahvMaximumRente - VALUES_2025.ahvMinimumRente);
      spouseRente = spouseVolleRente * (spouseContributionYears / fullContributionYears);
    }
    
    // Gemeinsame Rente mit Plafonierung
    const combinedRente = rente + spouseRente;
    if (combinedRente > VALUES_2025.ahvEhepaarMaximum) {
      // Plafonierung auf 150% der Maximalrente
      const reductionFactor = VALUES_2025.ahvEhepaarMaximum / combinedRente;
      monthlyRente = rente * reductionFactor;
      // spouseMonthlyRente = spouseRente * reductionFactor; // Wird hier nicht zurückgegeben
    }
  }
  
  // Jährliche Rente (12 oder 13 Monate, je nach Einstellung)
  let yearlyRente = monthlyRente * 12;
  
  // 13. AHV-Rente, falls aktiviert
  if (enable13thAHVRente) {
    yearlyRente = monthlyRente * 13;
  }
  
  return {
    monthlyRente: monthlyRente,
    yearlyRente: yearlyRente
  };
}

// Berechnung der AHV-Rente mit expliziter 13. AHV-Rente
function calculateAHVRenteWith13th(averageIncome, contributionYears, isMarried = false, spouseAverageIncome = 0, spouseContributionYears = 0) {
  // Berechne die normale AHV-Rente (12 Monate)
  const baseRente = calculateAHVRente(averageIncome, contributionYears, isMarried, spouseAverageIncome, spouseContributionYears);
  
  // 13. Rente ist gleich der monatlichen Rente
  const thirteenthRente = baseRente.monthlyRente;
  
  // Jährliche Rente mit 13. Rente
  const yearlyRenteWith13th = baseRente.monthlyRente * 13;
  
  return {
    monthlyRente: baseRente.monthlyRente,
    thirteenthRente: thirteenthRente,
    yearlyRenteWith13th: yearlyRenteWith13th
  };
}

// Berechnung des voraussichtlichen Altersguthabens in der Pensionskasse
function calculatePensionFundCapital(currentCapital, yearsToRetirement, annualContribution = 0, interestRate = VALUES_2025.bvgMindestzinssatz) {
  let capital = currentCapital;
  
  for (let i = 0; i < yearsToRetirement; i++) {
    capital = capital * (1 + interestRate) + annualContribution;
  }
  
  return capital;
}

// Berechnung der voraussichtlichen Rente aus der Pensionskasse
function calculatePensionFundRente(capital, conversionRate = VALUES_2025.bvgUmwandlungssatz) {
  const yearlyRente = capital * conversionRate;
  const monthlyRente = yearlyRente / 12;
  
  return {
    yearlyRente: yearlyRente,
    monthlyRente: monthlyRente
  };
}

// Berechnung der Säule 3a bei Pensionierung
function calculatePillar3a(currentCapital, yearsToRetirement, annualContribution, interestRate = 0.01) {
  let capital = currentCapital;
  
  for (let i = 0; i < yearsToRetirement; i++) {
    capital = capital * (1 + interestRate) + annualContribution;
  }
  
  return capital;
}

// Berechnung der Steuern auf Kapitalbezug aus der Pensionskasse
function calculateCapitalWithdrawalTax(capitalAmount, canton, taxRate) {
  // Vereinfachte Berechnung für Kanton Bern
  // In der Realität sind die Steuersätze progressiv und abhängig von verschiedenen Faktoren
  if (canton === 'BE') {
    return capitalAmount * taxRate;
  }
  
  // Fallback für andere Kantone
  return capitalAmount * 0.1; // Annahme: 10% Steuern
}

// Berechnung der Steuern auf Säule 3a-Bezug
function calculatePillar3aTax(capitalAmount, canton, taxRate) {
  // Vereinfachte Berechnung für Kanton Bern
  if (canton === 'BE') {
    return capitalAmount * taxRate;
  }
  
  // Fallback für andere Kantone
  return capitalAmount * 0.05; // Annahme: 5% Steuern
}

// Berechnung der Gesamtvorsorgesituation
function calculateTotalRetirementIncome(ahvRente, pensionRente, pillar3aCapital, otherAssets, lifeExpectancy, retirementAge) {
  const yearsInRetirement = lifeExpectancy - retirementAge;
  
  // Jährliches Einkommen aus AHV und Pensionskasse
  const fixedYearlyIncome = ahvRente.yearlyRente + pensionRente.yearlyRente;
  
  // Kapitalverzehr aus Säule 3a und anderen Vermögenswerten
  const totalCapital = pillar3aCapital + otherAssets;
  const yearlyCapitalConsumption = totalCapital / yearsInRetirement;
  
  // Gesamtes jährliches Einkommen im Ruhestand
  const totalYearlyIncome = fixedYearlyIncome + yearlyCapitalConsumption;
  
  return {
    fixedYearlyIncome: fixedYearlyIncome,
    yearlyCapitalConsumption: yearlyCapitalConsumption,
    totalYearlyIncome: totalYearlyIncome
  };
}

// Berechnung der Ersatzquote (% des letzten Einkommens)
function calculateReplacementRate(totalRetirementIncome, lastIncome) {
  return totalRetirementIncome.totalYearlyIncome / lastIncome;
}

// Berechnung der Einkommenssteuer
function calculateIncomeTax(taxableIncome, canton, maritalStatus) {
  // Vereinfachte Berechnung für Kanton Bern
  if (canton === 'BE') {
    let taxRate;
    
    if (maritalStatus === 'single') {
      // Steuersätze für Alleinstehende
      if (taxableIncome <= 30000) taxRate = 0.1;
      else if (taxableIncome <= 50000) taxRate = 0.15;
      else if (taxableIncome <= 75000) taxRate = 0.2;
      else if (taxableIncome <= 100000) taxRate = 0.25;
      else if (taxableIncome <= 150000) taxRate = 0.3;
      else taxRate = 0.35;
    } else {
      // Steuersätze für Verheiratete
      if (taxableIncome <= 50000) taxRate = 0.08;
      else if (taxableIncome <= 75000) taxRate = 0.12;
      else if (taxableIncome <= 100000) taxRate = 0.17;
      else if (taxableIncome <= 150000) taxRate = 0.22;
      else if (taxableIncome <= 200000) taxRate = 0.27;
      else taxRate = 0.32;
    }
    
    return taxableIncome * taxRate;
  }
  
  // Fallback für andere Kantone
  return taxableIncome * 0.2; // Annahme: 20% Steuern
}

// Berechnung der Vermögenssteuer
function calculateWealthTax(taxableWealth, canton, maritalStatus) {
  // Vereinfachte Berechnung für Kanton Bern
  if (canton === 'BE') {
    let taxRate;
    
    if (maritalStatus === 'single') {
      // Steuersätze für Alleinstehende
      if (taxableWealth <= 100000) taxRate = 0.001;
      else if (taxableWealth <= 500000) taxRate = 0.002;
      else if (taxableWealth <= 1000000) taxRate = 0.003;
      else taxRate = 0.004;
    } else {
      // Steuersätze für Verheiratete
      if (taxableWealth <= 200000) taxRate = 0.0008;
      else if (taxableWealth <= 1000000) taxRate = 0.0016;
      else if (taxableWealth <= 2000000) taxRate = 0.0024;
      else taxRate = 0.0032;
    }
    
    return taxableWealth * taxRate;
  }
  
  // Fallback für andere Kantone
  return taxableWealth * 0.003; // Annahme: 0.3% Steuern
}

// Export der Funktionen
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    VALUES_2025,
    RENDITE,
    toggle13thAHVRente,
    is13thAHVRenteEnabled,
    calculateAHVRente,
    calculateAHVRenteWith13th,
    calculatePensionFundCapital,
    calculatePensionFundRente,
    calculatePillar3a,
    calculateCapitalWithdrawalTax,
    calculatePillar3aTax,
    calculateTotalRetirementIncome,
    calculateReplacementRate,
    calculateIncomeTax,
    calculateWealthTax
  };
}

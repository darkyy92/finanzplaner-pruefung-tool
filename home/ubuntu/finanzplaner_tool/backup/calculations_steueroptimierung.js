/**
 * Steueroptimierungsberechnungen für das Finanzplaner-Tool
 * 
 * Dieses Modul enthält Funktionen zur Berechnung von Steueroptimierungen,
 * insbesondere für den Kanton Bern.
 */

// Detaillierte Einkommenssteuerberechnung für Kanton Bern
function calculateDetailedIncomeTaxBern(taxableIncome, maritalStatus) {
  // Steuersätze für Kanton Bern 2025
  const taxRates = {
    single: [
      { limit: 0, base: 0, rate: 0.00 },
      { limit: 18800, base: 0, rate: 0.08 },
      { limit: 33800, base: 1200, rate: 0.15 },
      { limit: 45200, base: 2910, rate: 0.22 },
      { limit: 60300, base: 6232, rate: 0.26 },
      { limit: 78200, base: 10906, rate: 0.30 },
      { limit: 105500, base: 19096, rate: 0.34 },
      { limit: 137600, base: 30010, rate: 0.37 },
      { limit: 180500, base: 45943, rate: 0.39 },
      { limit: 608400, base: 212789, rate: 0.40 },
      { limit: Infinity, base: 212789, rate: 0.41 }
    ],
    married: [
      { limit: 0, base: 0, rate: 0.00 },
      { limit: 37700, base: 0, rate: 0.08 },
      { limit: 67700, base: 2400, rate: 0.15 },
      { limit: 90500, base: 5820, rate: 0.22 },
      { limit: 120700, base: 12464, rate: 0.26 },
      { limit: 156500, base: 21812, rate: 0.30 },
      { limit: 211100, base: 38192, rate: 0.34 },
      { limit: 275300, base: 60020, rate: 0.37 },
      { limit: 361100, base: 91886, rate: 0.39 },
      { limit: 1216900, base: 425578, rate: 0.40 },
      { limit: Infinity, base: 425578, rate: 0.41 }
    ]
  };

  // Auswahl der richtigen Steuertabelle
  const table = maritalStatus === 'married' ? taxRates.married : taxRates.single;
  
  // Finden der richtigen Steuerklasse
  let bracket = table[0];
  for (let i = 1; i < table.length; i++) {
    if (taxableIncome < table[i].limit) {
      bracket = table[i-1];
      break;
    }
    if (i === table.length - 1) {
      bracket = table[i];
    }
  }
  
  // Berechnung der Steuer
  const tax = bracket.base + (taxableIncome - bracket.limit) * bracket.rate;
  
  return tax;
}

// Berechnung der Steuerersparnis durch Einkauf in die Pensionskasse
function calculatePensionPurchaseTaxSavings(purchaseAmount, taxableIncome, canton, maritalStatus) {
  if (canton === 'BE') {
    // Berechnung der Steuer vor dem Einkauf
    const taxBefore = calculateDetailedIncomeTaxBern(taxableIncome, maritalStatus);
    
    // Berechnung der Steuer nach dem Einkauf
    const taxAfter = calculateDetailedIncomeTaxBern(taxableIncome - purchaseAmount, maritalStatus);
    
    // Steuerersparnis
    return taxBefore - taxAfter;
  }
  
  // Fallback für andere Kantone (vereinfachte Berechnung)
  // Annahme: Grenzsteuersatz von 30%
  return purchaseAmount * 0.3;
}

// Berechnung der Steuerersparnis durch Einzahlung in die Säule 3a
function calculatePillar3aTaxSavings(contributionAmount, taxableIncome, canton, maritalStatus) {
  if (canton === 'BE') {
    // Berechnung der Steuer vor der Einzahlung
    const taxBefore = calculateDetailedIncomeTaxBern(taxableIncome, maritalStatus);
    
    // Berechnung der Steuer nach der Einzahlung
    const taxAfter = calculateDetailedIncomeTaxBern(taxableIncome - contributionAmount, maritalStatus);
    
    // Steuerersparnis
    return taxBefore - taxAfter;
  }
  
  // Fallback für andere Kantone (vereinfachte Berechnung)
  // Annahme: Grenzsteuersatz von 25%
  return contributionAmount * 0.25;
}

// Berechnung der Steuerersparnis durch gestaffelte Bezüge aus der Säule 3a
function calculateStaggeredPillar3aWithdrawalSavings(totalCapital, withdrawalYears, canton, maritalStatus) {
  // Berechnung der Steuer bei einmaligem Bezug
  const singleWithdrawalTax = calculatePillar3aTax(totalCapital, canton, maritalStatus);
  
  // Berechnung der Steuer bei gestaffeltem Bezug
  const yearlyWithdrawal = totalCapital / withdrawalYears;
  let staggeredWithdrawalTax = 0;
  
  for (let i = 0; i < withdrawalYears; i++) {
    staggeredWithdrawalTax += calculatePillar3aTax(yearlyWithdrawal, canton, maritalStatus);
  }
  
  // Steuerersparnis
  return singleWithdrawalTax - staggeredWithdrawalTax;
}

// Detaillierte Berechnung der Steuern auf Säule 3a-Bezug
function calculatePillar3aTax(capitalAmount, canton, maritalStatus) {
  if (canton === 'BE') {
    // Steuersätze für Kapitalleistungen aus Vorsorge im Kanton Bern 2025
    const taxRates = {
      single: [
        { limit: 0, base: 0, rate: 0.00 },
        { limit: 5700, base: 0, rate: 0.01 },
        { limit: 14300, base: 86, rate: 0.02 },
        { limit: 28500, base: 370, rate: 0.03 },
        { limit: 42800, base: 798, rate: 0.04 },
        { limit: 57100, base: 1370, rate: 0.05 },
        { limit: 71300, base: 2084, rate: 0.06 },
        { limit: 85600, base: 2942, rate: 0.07 },
        { limit: 114100, base: 4938, rate: 0.08 },
        { limit: 142600, base: 7218, rate: 0.09 },
        { limit: Infinity, base: 9782, rate: 0.10 }
      ],
      married: [
        { limit: 0, base: 0, rate: 0.00 },
        { limit: 11400, base: 0, rate: 0.01 },
        { limit: 28500, base: 171, rate: 0.02 },
        { limit: 57100, base: 741, rate: 0.03 },
        { limit: 85600, base: 1596, rate: 0.04 },
        { limit: 114100, base: 2736, rate: 0.05 },
        { limit: 142600, base: 4161, rate: 0.06 },
        { limit: 171200, base: 5871, rate: 0.07 },
        { limit: 228200, base: 9859, rate: 0.08 },
        { limit: 285300, base: 14415, rate: 0.09 },
        { limit: Infinity, base: 19539, rate: 0.10 }
      ]
    };

    // Auswahl der richtigen Steuertabelle
    const table = maritalStatus === 'married' ? taxRates.married : taxRates.single;
    
    // Finden der richtigen Steuerklasse
    let bracket = table[0];
    for (let i = 1; i < table.length; i++) {
      if (capitalAmount < table[i].limit) {
        bracket = table[i-1];
        break;
      }
      if (i === table.length - 1) {
        bracket = table[i];
      }
    }
    
    // Berechnung der Steuer
    const tax = bracket.base + (capitalAmount - bracket.limit) * bracket.rate;
    
    return tax;
  }
  
  // Fallback für andere Kantone
  return capitalAmount * 0.05; // Annahme: 5% Steuern
}

// Berechnung der Steuerersparnis durch Renovationen bei Immobilien
function calculateRenovationTaxSavings(renovationCost, taxableIncome, canton, maritalStatus) {
  if (canton === 'BE') {
    // Berechnung der Steuer vor der Renovation
    const taxBefore = calculateDetailedIncomeTaxBern(taxableIncome, maritalStatus);
    
    // Berechnung der Steuer nach der Renovation
    const taxAfter = calculateDetailedIncomeTaxBern(taxableIncome - renovationCost, maritalStatus);
    
    // Steuerersparnis
    return taxBefore - taxAfter;
  }
  
  // Fallback für andere Kantone (vereinfachte Berechnung)
  // Annahme: Grenzsteuersatz von 25%
  return renovationCost * 0.25;
}

// Berechnung der optimalen Einkaufsstrategie in die Pensionskasse
function calculateOptimalPensionPurchaseStrategy(purchasePotential, taxableIncome, yearsToRetirement, canton, maritalStatus) {
  if (purchasePotential <= 0 || yearsToRetirement <= 0) {
    return {
      yearlyPurchase: 0,
      totalTaxSavings: 0,
      strategy: "Kein Einkaufspotenzial vorhanden"
    };
  }
  
  // Strategie 1: Gleichmäßige Verteilung über die Jahre
  const yearlyPurchase = purchasePotential / yearsToRetirement;
  let totalTaxSavingsStrategy1 = 0;
  let remainingIncome = taxableIncome;
  
  for (let i = 0; i < yearsToRetirement; i++) {
    const savings = calculatePensionPurchaseTaxSavings(yearlyPurchase, remainingIncome, canton, maritalStatus);
    totalTaxSavingsStrategy1 += savings;
    remainingIncome = remainingIncome * 1.02; // Annahme: 2% jährliche Einkommenssteigerung
  }
  
  // Strategie 2: Maximaler Einkauf im ersten Jahr
  const maxPurchaseFirstYear = Math.min(purchasePotential, taxableIncome * 0.7); // Max. 70% des Einkommens
  const remainingPurchase = purchasePotential - maxPurchaseFirstYear;
  const yearlyRemainingPurchase = remainingPurchase > 0 ? remainingPurchase / (yearsToRetirement - 1) : 0;
  
  let totalTaxSavingsStrategy2 = calculatePensionPurchaseTaxSavings(maxPurchaseFirstYear, taxableIncome, canton, maritalStatus);
  remainingIncome = taxableIncome * 1.02; // Annahme: 2% jährliche Einkommenssteigerung
  
  for (let i = 1; i < yearsToRetirement; i++) {
    if (yearlyRemainingPurchase > 0) {
      const savings = calculatePensionPurchaseTaxSavings(yearlyRemainingPurchase, remainingIncome, canton, maritalStatus);
      totalTaxSavingsStrategy2 += savings;
    }
    remainingIncome = remainingIncome * 1.02;
  }
  
  // Vergleich der Strategien
  if (totalTaxSavingsStrategy1 >= totalTaxSavingsStrategy2) {
    return {
      yearlyPurchase: yearlyPurchase,
      totalTaxSavings: totalTaxSavingsStrategy1,
      strategy: "Gleichmäßige Verteilung über die Jahre"
    };
  } else {
    return {
      initialPurchase: maxPurchaseFirstYear,
      yearlyRemainingPurchase: yearlyRemainingPurchase,
      totalTaxSavings: totalTaxSavingsStrategy2,
      strategy: "Maximaler Einkauf im ersten Jahr, Rest verteilt"
    };
  }
}

// Berechnung der Gesamtsteueroptimierung
function calculateTotalTaxOptimization(income, wealth, pensionPurchasePotential, pillar3aContribution, renovationCosts, canton, maritalStatus, yearsToRetirement) {
  // Berechnung der Steuer ohne Optimierung
  const incomeTaxWithoutOptimization = calculateDetailedIncomeTaxBern(income, maritalStatus);
  
  // Optimierungsmöglichkeiten
  
  // 1. Einkauf in die Pensionskasse
  const pensionPurchaseStrategy = calculateOptimalPensionPurchaseStrategy(
    pensionPurchasePotential, 
    income, 
    yearsToRetirement, 
    canton, 
    maritalStatus
  );
  
  // 2. Einzahlung in die Säule 3a
  const pillar3aTaxSavings = calculatePillar3aTaxSavings(
    pillar3aContribution, 
    income, 
    canton, 
    maritalStatus
  );
  
  // 3. Renovationskosten
  const renovationTaxSavings = calculateRenovationTaxSavings(
    renovationCosts, 
    income, 
    canton, 
    maritalStatus
  );
  
  // Gesamte Steuerersparnis im ersten Jahr
  let firstYearSavings = pillar3aTaxSavings + renovationTaxSavings;
  
  if (pensionPurchaseStrategy.strategy === "Gleichmäßige Verteilung über die Jahre") {
    const yearlyPurchaseSavings = calculatePensionPurchaseTaxSavings(
      pensionPurchaseStrategy.yearlyPurchase, 
      income, 
      canton, 
      maritalStatus
    );
    firstYearSavings += yearlyPurchaseSavings;
  } else if (pensionPurchaseStrategy.strategy === "Maximaler Einkauf im ersten Jahr, Rest verteilt") {
    const initialPurchaseSavings = calculatePensionPurchaseTaxSavings(
      pensionPurchaseStrategy.initialPurchase, 
      income, 
      canton, 
      maritalStatus
    );
    firstYearSavings += initialPurchaseSavings;
  }
  
  // Berechnung der Steuer nach Optimierung
  const optimizedIncome = income - 
    (pensionPurchaseStrategy.yearlyPurchase || pensionPurchaseStrategy.initialPurchase || 0) - 
    pillar3aContribution - 
    renovationCosts;
  
  const incomeTaxWithOptimization = calculateDetailedIncomeTaxBern(optimizedIncome, maritalStatus);
  
  return {
    taxWithoutOptimization: incomeTaxWithoutOptimization,
    taxWithOptimization: incomeTaxWithOptimization,
    totalSavings: incomeTaxWithoutOptimization - incomeTaxWithOptimization,
    firstYearSavings: firstYearSavings,
    pensionPurchaseStrategy: pensionPurchaseStrategy,
    pillar3aSavings: pillar3aTaxSavings,
    renovationSavings: renovationTaxSavings,
    optimizationRecommendations: [
      {
        type: "Pensionskassen-Einkauf",
        recommendation: pensionPurchaseStrategy.strategy,
        amount: pensionPurchaseStrategy.yearlyPurchase || pensionPurchaseStrategy.initialPurchase,
        savings: pensionPurchaseStrategy.totalTaxSavings
      },
      {
        type: "Säule 3a",
        recommendation: "Maximale jährliche Einzahlung",
        amount: pillar3aContribution,
        savings: pillar3aTaxSavings * yearsToRetirement
      },
      {
        type: "Renovationen",
        recommendation: renovationCosts > 0 ? "Durchführung empfohlen" : "Keine Renovationen geplant",
        amount: renovationCosts,
        savings: renovationTaxSavings
      }
    ]
  };
}

// Export der Funktionen
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateDetailedIncomeTaxBern,
    calculatePensionPurchaseTaxSavings,
    calculatePillar3aTaxSavings,
    calculateStaggeredPillar3aWithdrawalSavings,
    calculatePillar3aTax,
    calculateRenovationTaxSavings,
    calculateOptimalPensionPurchaseStrategy,
    calculateTotalTaxOptimization
  };
}

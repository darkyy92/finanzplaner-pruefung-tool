/**
 * Vermögensallokationsberechnungen für das Finanzplaner-Tool
 * 
 * Dieses Modul enthält Funktionen zur Berechnung der optimalen Vermögensallokation
 * basierend auf dem Risikoprofil des Kunden und anderen Faktoren.
 */

// Risikoprofile und ihre empfohlenen Vermögensallokationen
const RISK_PROFILES = {
  konservativ: {
    liquiditaet: 0.15,  // 15%
    obligationen: 0.55, // 55%
    aktien: 0.20,       // 20%
    immobilien: 0.10,   // 10%
    alternative: 0.00   // 0%
  },
  ausgewogen: {
    liquiditaet: 0.10,  // 10%
    obligationen: 0.40, // 40%
    aktien: 0.30,       // 30%
    immobilien: 0.15,   // 15%
    alternative: 0.05   // 5%
  },
  wachstumsorientiert: {
    liquiditaet: 0.05,  // 5%
    obligationen: 0.25, // 25%
    aktien: 0.45,       // 45%
    immobilien: 0.15,   // 15%
    alternative: 0.10   // 10%
  },
  chancenorientiert: {
    liquiditaet: 0.05,  // 5%
    obligationen: 0.10, // 10%
    aktien: 0.60,       // 60%
    immobilien: 0.15,   // 15%
    alternative: 0.10   // 10%
  }
};

// Erwartete Renditen pro Anlageklasse (basierend auf historischen Daten)
const EXPECTED_RETURNS = {
  liquiditaet: 0.005,     // 0.5%
  obligationen: 0.02,     // 2.0%
  aktien: {
    schweiz: 0.05,        // 5.0%
    international: 0.06   // 6.0%
  },
  immobilien: 0.03,       // 3.0%
  alternative: 0.04       // 4.0%
};

// Volatilität (Risiko) pro Anlageklasse
const VOLATILITY = {
  liquiditaet: 0.01,      // 1.0%
  obligationen: 0.05,     // 5.0%
  aktien: {
    schweiz: 0.15,        // 15.0%
    international: 0.18   // 18.0%
  },
  immobilien: 0.10,       // 10.0%
  alternative: 0.12       // 12.0%
};

// Korrelationsmatrix zwischen den Anlageklassen
const CORRELATION_MATRIX = {
  liquiditaet: {
    liquiditaet: 1.0,
    obligationen: 0.2,
    aktienSchweiz: 0.0,
    aktienInternational: 0.0,
    immobilien: 0.1,
    alternative: 0.0
  },
  obligationen: {
    liquiditaet: 0.2,
    obligationen: 1.0,
    aktienSchweiz: 0.3,
    aktienInternational: 0.3,
    immobilien: 0.4,
    alternative: 0.2
  },
  aktienSchweiz: {
    liquiditaet: 0.0,
    obligationen: 0.3,
    aktienSchweiz: 1.0,
    aktienInternational: 0.8,
    immobilien: 0.5,
    alternative: 0.4
  },
  aktienInternational: {
    liquiditaet: 0.0,
    obligationen: 0.3,
    aktienSchweiz: 0.8,
    aktienInternational: 1.0,
    immobilien: 0.4,
    alternative: 0.5
  },
  immobilien: {
    liquiditaet: 0.1,
    obligationen: 0.4,
    aktienSchweiz: 0.5,
    aktienInternational: 0.4,
    immobilien: 1.0,
    alternative: 0.3
  },
  alternative: {
    liquiditaet: 0.0,
    obligationen: 0.2,
    aktienSchweiz: 0.4,
    aktienInternational: 0.5,
    immobilien: 0.3,
    alternative: 1.0
  }
};

// Bestimmung des Risikoprofils basierend auf Fragebogen
function determineRiskProfile(answers) {
  // Annahme: answers ist ein Objekt mit Antworten auf Risikofragen
  // Jede Antwort hat einen Punktwert
  
  let totalPoints = 0;
  
  // Beispiel für die Auswertung eines Fragebogens
  if (answers.investmentHorizon === 'long') totalPoints += 3;
  else if (answers.investmentHorizon === 'medium') totalPoints += 2;
  else totalPoints += 1;
  
  if (answers.riskTolerance === 'high') totalPoints += 3;
  else if (answers.riskTolerance === 'medium') totalPoints += 2;
  else totalPoints += 1;
  
  if (answers.investmentKnowledge === 'expert') totalPoints += 3;
  else if (answers.investmentKnowledge === 'intermediate') totalPoints += 2;
  else totalPoints += 1;
  
  if (answers.incomeStability === 'high') totalPoints += 3;
  else if (answers.incomeStability === 'medium') totalPoints += 2;
  else totalPoints += 1;
  
  if (answers.financialReserves === 'high') totalPoints += 3;
  else if (answers.financialReserves === 'medium') totalPoints += 2;
  else totalPoints += 1;
  
  // Bestimmung des Risikoprofils basierend auf der Gesamtpunktzahl
  if (totalPoints <= 7) return 'konservativ';
  else if (totalPoints <= 10) return 'ausgewogen';
  else if (totalPoints <= 13) return 'wachstumsorientiert';
  else return 'chancenorientiert';
}

// Berechnung der erwarteten Rendite einer Vermögensallokation
function calculateExpectedReturn(allocation, aktienSplit = 0.5) {
  // aktienSplit: Anteil Schweizer Aktien am gesamten Aktienportfolio (0.5 = 50% CH, 50% International)
  
  const aktienRendite = 
    EXPECTED_RETURNS.aktien.schweiz * aktienSplit + 
    EXPECTED_RETURNS.aktien.international * (1 - aktienSplit);
  
  return (
    allocation.liquiditaet * EXPECTED_RETURNS.liquiditaet +
    allocation.obligationen * EXPECTED_RETURNS.obligationen +
    allocation.aktien * aktienRendite +
    allocation.immobilien * EXPECTED_RETURNS.immobilien +
    allocation.alternative * EXPECTED_RETURNS.alternative
  );
}

// Berechnung des Risikos (Volatilität) einer Vermögensallokation
function calculatePortfolioRisk(allocation, aktienSplit = 0.5) {
  // Vereinfachte Berechnung der Portfoliovolatilität
  // In der Realität würde man die vollständige Kovarianzmatrix verwenden
  
  const aktienVolatilitaet = 
    VOLATILITY.aktien.schweiz * aktienSplit + 
    VOLATILITY.aktien.international * (1 - aktienSplit);
  
  // Vereinfachte Berechnung ohne Berücksichtigung der Korrelationen
  const weightedVolatility = 
    Math.pow(allocation.liquiditaet * VOLATILITY.liquiditaet, 2) +
    Math.pow(allocation.obligationen * VOLATILITY.obligationen, 2) +
    Math.pow(allocation.aktien * aktienVolatilitaet, 2) +
    Math.pow(allocation.immobilien * VOLATILITY.immobilien, 2) +
    Math.pow(allocation.alternative * VOLATILITY.alternative, 2);
  
  return Math.sqrt(weightedVolatility);
}

// Berechnung der optimalen Vermögensallokation basierend auf dem Risikoprofil
function calculateOptimalAssetAllocation(riskProfile, age, retirementAge, existingAllocation = null) {
  // Basisallokation aus dem Risikoprofil
  let allocation = { ...RISK_PROFILES[riskProfile] };
  
  // Anpassung basierend auf dem Alter (je näher an der Pensionierung, desto konservativer)
  const yearsToRetirement = Math.max(0, retirementAge - age);
  
  if (yearsToRetirement < 10) {
    // Erhöhung des Anteils an Obligationen und Liquidität auf Kosten von Aktien
    const adjustmentFactor = (10 - yearsToRetirement) / 20; // Max. 50% Anpassung bei 0 Jahren bis zur Pensionierung
    
    allocation.aktien = Math.max(0.1, allocation.aktien * (1 - adjustmentFactor));
    allocation.alternative = Math.max(0, allocation.alternative * (1 - adjustmentFactor));
    
    // Erhöhung von Obligationen und Liquidität
    const totalReduction = 
      RISK_PROFILES[riskProfile].aktien - allocation.aktien + 
      RISK_PROFILES[riskProfile].alternative - allocation.alternative;
    
    allocation.obligationen += totalReduction * 0.7; // 70% der Reduktion geht in Obligationen
    allocation.liquiditaet += totalReduction * 0.3; // 30% der Reduktion geht in Liquidität
  }
  
  // Berücksichtigung der bestehenden Allokation, falls vorhanden
  if (existingAllocation) {
    // Berechnung der Differenz zwischen optimaler und bestehender Allokation
    const diff = {
      liquiditaet: allocation.liquiditaet - existingAllocation.liquiditaet,
      obligationen: allocation.obligationen - existingAllocation.obligationen,
      aktien: allocation.aktien - existingAllocation.aktien,
      immobilien: allocation.immobilien - existingAllocation.immobilien,
      alternative: allocation.alternative - existingAllocation.alternative
    };
    
    // Empfehlungen für Umschichtungen
    const recommendations = [];
    
    if (Math.abs(diff.liquiditaet) > 0.03) { // Mehr als 3% Abweichung
      recommendations.push({
        from: diff.liquiditaet < 0 ? 'Liquidität' : 'andere Anlageklassen',
        to: diff.liquiditaet < 0 ? 'andere Anlageklassen' : 'Liquidität',
        amount: Math.abs(diff.liquiditaet),
        priority: Math.abs(diff.liquiditaet) > 0.1 ? 'hoch' : 'mittel'
      });
    }
    
    if (Math.abs(diff.obligationen) > 0.05) { // Mehr als 5% Abweichung
      recommendations.push({
        from: diff.obligationen < 0 ? 'Obligationen' : 'andere Anlageklassen',
        to: diff.obligationen < 0 ? 'andere Anlageklassen' : 'Obligationen',
        amount: Math.abs(diff.obligationen),
        priority: Math.abs(diff.obligationen) > 0.1 ? 'hoch' : 'mittel'
      });
    }
    
    if (Math.abs(diff.aktien) > 0.05) { // Mehr als 5% Abweichung
      recommendations.push({
        from: diff.aktien < 0 ? 'Aktien' : 'andere Anlageklassen',
        to: diff.aktien < 0 ? 'andere Anlageklassen' : 'Aktien',
        amount: Math.abs(diff.aktien),
        priority: Math.abs(diff.aktien) > 0.1 ? 'hoch' : 'mittel'
      });
    }
    
    if (Math.abs(diff.immobilien) > 0.05) { // Mehr als 5% Abweichung
      recommendations.push({
        from: diff.immobilien < 0 ? 'Immobilien' : 'andere Anlageklassen',
        to: diff.immobilien < 0 ? 'andere Anlageklassen' : 'Immobilien',
        amount: Math.abs(diff.immobilien),
        priority: Math.abs(diff.immobilien) > 0.1 ? 'hoch' : 'mittel'
      });
    }
    
    if (Math.abs(diff.alternative) > 0.03) { // Mehr als 3% Abweichung
      recommendations.push({
        from: diff.alternative < 0 ? 'Alternative Anlagen' : 'andere Anlageklassen',
        to: diff.alternative < 0 ? 'andere Anlageklassen' : 'Alternative Anlagen',
        amount: Math.abs(diff.alternative),
        priority: Math.abs(diff.alternative) > 0.1 ? 'hoch' : 'mittel'
      });
    }
    
    return {
      optimalAllocation: allocation,
      currentAllocation: existingAllocation,
      difference: diff,
      recommendations: recommendations,
      expectedReturn: calculateExpectedReturn(allocation),
      expectedRisk: calculatePortfolioRisk(allocation)
    };
  }
  
  // Wenn keine bestehende Allokation vorhanden ist, nur die optimale Allokation zurückgeben
  return {
    optimalAllocation: allocation,
    expectedReturn: calculateExpectedReturn(allocation),
    expectedRisk: calculatePortfolioRisk(allocation)
  };
}

// Berechnung der Vermögensentwicklung über die Zeit
function calculateWealthProjection(initialWealth, allocation, yearsToProject, monthlyContribution = 0, aktienSplit = 0.5) {
  const expectedReturn = calculateExpectedReturn(allocation, aktienSplit);
  const monthlyReturn = Math.pow(1 + expectedReturn, 1/12) - 1;
  
  let projection = [];
  let currentWealth = initialWealth;
  
  for (let month = 0; month <= yearsToProject * 12; month++) {
    // Hinzufügen des aktuellen Vermögens zur Projektion (jährlich)
    if (month % 12 === 0) {
      projection.push({
        year: month / 12,
        wealth: currentWealth
      });
    }
    
    // Monatliche Aktualisierung des Vermögens
    currentWealth = currentWealth * (1 + monthlyReturn) + monthlyContribution;
  }
  
  return projection;
}

// Berechnung der Vermögensentwicklung mit Monte-Carlo-Simulation
function calculateMonteCarloProjection(initialWealth, allocation, yearsToProject, monthlyContribution = 0, aktienSplit = 0.5, simulations = 1000) {
  const expectedReturn = calculateExpectedReturn(allocation, aktienSplit);
  const expectedRisk = calculatePortfolioRisk(allocation, aktienSplit);
  
  // Monatliche Parameter
  const monthlyReturn = Math.pow(1 + expectedReturn, 1/12) - 1;
  const monthlyRisk = expectedRisk / Math.sqrt(12);
  
  // Array für alle Simulationen
  let allSimulations = [];
  
  // Durchführung der Simulationen
  for (let sim = 0; sim < simulations; sim++) {
    let currentWealth = initialWealth;
    let yearlyWealth = [];
    
    for (let month = 0; month <= yearsToProject * 12; month++) {
      // Zufällige Rendite basierend auf Normalverteilung
      // Verwendung der Box-Muller-Transformation für normalverteilte Zufallszahlen
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      
      const randomReturn = monthlyReturn + monthlyRisk * z;
      
      // Aktualisierung des Vermögens
      currentWealth = currentWealth * (1 + randomReturn) + monthlyContribution;
      
      // Speichern des jährlichen Vermögens
      if (month % 12 === 0) {
        yearlyWealth.push(currentWealth);
      }
    }
    
    allSimulations.push(yearlyWealth);
  }
  
  // Berechnung der Perzentile für jedes Jahr
  let projection = [];
  
  for (let year = 0; year <= yearsToProject; year++) {
    let valuesForYear = allSimulations.map(sim => sim[year]);
    valuesForYear.sort((a, b) => a - b);
    
    projection.push({
      year: year,
      median: valuesForYear[Math.floor(simulations * 0.5)],
      percentile10: valuesForYear[Math.floor(simulations * 0.1)],
      percentile25: valuesForYear[Math.floor(simulations * 0.25)],
      percentile75: valuesForYear[Math.floor(simulations * 0.75)],
      percentile90: valuesForYear[Math.floor(simulations * 0.9)]
    });
  }
  
  return projection;
}

// Berechnung der optimalen Aktienallokation (Schweiz vs. International)
function calculateOptimalEquitySplit(taxRate, dividendYieldCH = 0.025, dividendYieldInt = 0.02, witholdingTaxInt = 0.15) {
  // Berechnung der Nachsteuerrendite für Schweizer Aktien
  const afterTaxYieldCH = dividendYieldCH * (1 - taxRate);
  
  // Berechnung der Nachsteuerrendite für internationale Aktien
  // Berücksichtigung der ausländischen Quellensteuer und der Anrechnung an die Schweizer Steuer
  const foreignTaxCredit = Math.min(witholdingTaxInt, taxRate * dividendYieldInt);
  const afterTaxYieldInt = dividendYieldInt * (1 - taxRate) + foreignTaxCredit;
  
  // Vergleich der Nachsteuerrenditen
  if (afterTaxYieldCH > afterTaxYieldInt) {
    // Schweizer Aktien haben eine höhere Nachsteuerrendite
    return {
      recommendedSplit: { ch: 0.7, international: 0.3 }, // Übergewichtung Schweiz
      reasoning: "Schweizer Aktien haben eine höhere Nachsteuerrendite aufgrund der Dividendenbesteuerung."
    };
  } else {
    // Internationale Aktien haben eine höhere Nachsteuerrendite
    return {
      recommendedSplit: { ch: 0.4, international: 0.6 }, // Übergewichtung International
      reasoning: "Internationale Aktien haben eine höhere Nachsteuerrendite trotz Quellensteuer."
    };
  }
}

// Export der Funktionen
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    RISK_PROFILES,
    EXPECTED_RETURNS,
    VOLATILITY,
    determineRiskProfile,
    calculateExpectedReturn,
    calculatePortfolioRisk,
    calculateOptimalAssetAllocation,
    calculateWealthProjection,
    calculateMonteCarloProjection,
    calculateOptimalEquitySplit
  };
}

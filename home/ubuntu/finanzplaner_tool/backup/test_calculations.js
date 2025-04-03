/**
 * Testskript für die Berechnungsmodule des Finanzplaner-Tools
 * 
 * Dieses Skript testet die Funktionalität der verschiedenen Berechnungsmodule
 * und stellt sicher, dass die Ergebnisse korrekt sind.
 */

// Lade die Berechnungsmodule
const calculations = require('./calculations_updated.js');
const steuerOptimierung = require('./calculations_steueroptimierung.js');
const vermoegensAllokation = require('./calculations_vermoegensallokation.js');
const liquiditaetsplanung = require('./calculations_liquiditaetsplanung.js');

// Funktion zum Testen der AHV-Rentenberechnung
function testAHVRentenBerechnung() {
  console.log('=== Test: AHV-Rentenberechnung ===');
  
  // Testfall 1: Einzelperson mit durchschnittlichem Einkommen
  const testCase1 = {
    averageIncome: 85000,
    contributionYears: 44,
    isMarried: false
  };
  
  const result1 = calculations.calculateAHVRente(
    testCase1.averageIncome,
    testCase1.contributionYears,
    testCase1.isMarried
  );
  
  console.log('Testfall 1: Einzelperson mit durchschnittlichem Einkommen');
  console.log('Erwartete monatliche Rente: ca. 2400 CHF');
  console.log(`Berechnete monatliche Rente: ${result1.monthlyRente} CHF`);
  console.log(`Berechnete jährliche Rente: ${result1.yearlyRente} CHF`);
  console.log(`Test bestanden: ${Math.abs(result1.monthlyRente - 2400) < 100}`);
  console.log();
  
  // Testfall 2: Ehepaar mit hohem Einkommen (Plafonierung)
  const testCase2 = {
    averageIncome: 120000,
    contributionYears: 44,
    isMarried: true,
    spouseAverageIncome: 100000,
    spouseContributionYears: 44
  };
  
  const result2 = calculations.calculateAHVRente(
    testCase2.averageIncome,
    testCase2.contributionYears,
    testCase2.isMarried,
    testCase2.spouseAverageIncome,
    testCase2.spouseContributionYears
  );
  
  console.log('Testfall 2: Ehepaar mit hohem Einkommen (Plafonierung)');
  console.log('Erwartete monatliche Rente: ca. 3780 CHF (150% der Maximalrente)');
  console.log(`Berechnete monatliche Rente: ${result2.monthlyRente} CHF`);
  console.log(`Berechnete jährliche Rente: ${result2.yearlyRente} CHF`);
  console.log(`Test bestanden: ${Math.abs(result2.monthlyRente - 3780) < 100}`);
  console.log();
  
  // Testfall 3: Einzelperson mit niedrigem Einkommen
  const testCase3 = {
    averageIncome: 25000,
    contributionYears: 44,
    isMarried: false
  };
  
  const result3 = calculations.calculateAHVRente(
    testCase3.averageIncome,
    testCase3.contributionYears,
    testCase3.isMarried
  );
  
  console.log('Testfall 3: Einzelperson mit niedrigem Einkommen');
  console.log('Erwartete monatliche Rente: ca. 1260 CHF (Minimalrente)');
  console.log(`Berechnete monatliche Rente: ${result3.monthlyRente} CHF`);
  console.log(`Berechnete jährliche Rente: ${result3.yearlyRente} CHF`);
  console.log(`Test bestanden: ${Math.abs(result3.monthlyRente - 1260) < 100}`);
  console.log();
}

// Funktion zum Testen der 13. AHV-Rentenberechnung
function test13thAHVRentenBerechnung() {
  console.log('=== Test: 13. AHV-Rentenberechnung ===');
  
  // Testfall 1: Einzelperson mit durchschnittlichem Einkommen
  const testCase1 = {
    averageIncome: 85000,
    contributionYears: 44,
    isMarried: false
  };
  
  const result1 = calculations.calculateAHVRenteWith13th(
    testCase1.averageIncome,
    testCase1.contributionYears,
    testCase1.isMarried
  );
  
  console.log('Testfall 1: Einzelperson mit durchschnittlichem Einkommen');
  console.log('Erwartete monatliche Rente: ca. 2400 CHF');
  console.log('Erwartete 13. Rente: ca. 2400 CHF');
  console.log('Erwartete jährliche Rente mit 13. Rente: ca. 31200 CHF');
  console.log(`Berechnete monatliche Rente: ${result1.monthlyRente} CHF`);
  console.log(`Berechnete 13. Rente: ${result1.thirteenthRente} CHF`);
  console.log(`Berechnete jährliche Rente mit 13. Rente: ${result1.yearlyRenteWith13th} CHF`);
  console.log(`Test bestanden: ${Math.abs(result1.yearlyRenteWith13th - (result1.monthlyRente * 13)) < 10}`);
  console.log();
  
  // Testfall 2: Ehepaar mit hohem Einkommen (Plafonierung)
  const testCase2 = {
    averageIncome: 120000,
    contributionYears: 44,
    isMarried: true,
    spouseAverageIncome: 100000,
    spouseContributionYears: 44
  };
  
  const result2 = calculations.calculateAHVRenteWith13th(
    testCase2.averageIncome,
    testCase2.contributionYears,
    testCase2.isMarried,
    testCase2.spouseAverageIncome,
    testCase2.spouseContributionYears
  );
  
  console.log('Testfall 2: Ehepaar mit hohem Einkommen (Plafonierung)');
  console.log('Erwartete monatliche Rente: ca. 3780 CHF (150% der Maximalrente)');
  console.log('Erwartete 13. Rente: ca. 3780 CHF');
  console.log('Erwartete jährliche Rente mit 13. Rente: ca. 49140 CHF');
  console.log(`Berechnete monatliche Rente: ${result2.monthlyRente} CHF`);
  console.log(`Berechnete 13. Rente: ${result2.thirteenthRente} CHF`);
  console.log(`Berechnete jährliche Rente mit 13. Rente: ${result2.yearlyRenteWith13th} CHF`);
  console.log(`Test bestanden: ${Math.abs(result2.yearlyRenteWith13th - (result2.monthlyRente * 13)) < 10}`);
  console.log();
}

// Funktion zum Testen der Pensionskassenberechnung
function testPensionskassenBerechnung() {
  console.log('=== Test: Pensionskassenberechnung ===');
  
  // Testfall 1: Berechnung des voraussichtlichen Altersguthabens
  const testCase1 = {
    currentCapital: 300000,
    yearsToRetirement: 15,
    annualContribution: 10000,
    interestRate: 0.01
  };
  
  const result1 = calculations.calculatePensionFundCapital(
    testCase1.currentCapital,
    testCase1.yearsToRetirement,
    testCase1.annualContribution,
    testCase1.interestRate
  );
  
  console.log('Testfall 1: Berechnung des voraussichtlichen Altersguthabens');
  console.log('Aktuelles Kapital: 300\'000 CHF');
  console.log('Jahre bis zur Pensionierung: 15');
  console.log('Jährliche Einzahlung: 10\'000 CHF');
  console.log('Zinssatz: 1%');
  console.log(`Berechnetes voraussichtliches Altersguthaben: ${result1.toFixed(2)} CHF`);
  console.log(`Test bestanden: ${result1 > 450000 && result1 < 500000}`);
  console.log();
  
  // Testfall 2: Berechnung der voraussichtlichen Rente
  const testCase2 = {
    capital: 500000,
    conversionRate: 0.068
  };
  
  const result2 = calculations.calculatePensionFundRente(
    testCase2.capital,
    testCase2.conversionRate
  );
  
  console.log('Testfall 2: Berechnung der voraussichtlichen Rente');
  console.log('Kapital: 500\'000 CHF');
  console.log('Umwandlungssatz: 6.8%');
  console.log(`Berechnete jährliche Rente: ${result2.yearlyRente.toFixed(2)} CHF`);
  console.log(`Berechnete monatliche Rente: ${result2.monthlyRente.toFixed(2)} CHF`);
  console.log(`Test bestanden: ${Math.abs(result2.yearlyRente - 34000) < 100}`);
  console.log();
}

// Funktion zum Testen der Säule 3a-Berechnung
function testSaeule3aBerechnung() {
  console.log('=== Test: Säule 3a-Berechnung ===');
  
  // Testfall 1: Berechnung des voraussichtlichen Säule 3a-Guthabens
  const testCase1 = {
    currentCapital: 50000,
    yearsToRetirement: 20,
    annualContribution: 7258, // Maximalbetrag 2025 mit PK
    interestRate: 0.01
  };
  
  const result1 = calculations.calculatePillar3a(
    testCase1.currentCapital,
    testCase1.yearsToRetirement,
    testCase1.annualContribution,
    testCase1.interestRate
  );
  
  console.log('Testfall 1: Berechnung des voraussichtlichen Säule 3a-Guthabens');
  console.log('Aktuelles Kapital: 50\'000 CHF');
  console.log('Jahre bis zur Pensionierung: 20');
  console.log('Jährliche Einzahlung: 7\'258 CHF (Maximalbetrag 2025 mit PK)');
  console.log('Zinssatz: 1%');
  console.log(`Berechnetes voraussichtliches Säule 3a-Guthaben: ${result1.toFixed(2)} CHF`);
  console.log(`Test bestanden: ${result1 > 200000 && result1 < 250000}`);
  console.log();
}

// Funktion zum Testen der Steueroptimierungsberechnung
function testSteueroptimierungsBerechnung() {
  console.log('=== Test: Steueroptimierungsberechnung ===');
  
  // Testfall 1: Berechnung der Steuerersparnis durch Einkauf in die Pensionskasse
  const testCase1 = {
    purchaseAmount: 50000,
    taxableIncome: 120000,
    canton: 'BE',
    maritalStatus: 'single'
  };
  
  const result1 = steuerOptimierung.calculatePensionPurchaseTaxSavings(
    testCase1.purchaseAmount,
    testCase1.taxableIncome,
    testCase1.canton,
    testCase1.maritalStatus
  );
  
  console.log('Testfall 1: Berechnung der Steuerersparnis durch Einkauf in die Pensionskasse');
  console.log('Einkaufsbetrag: 50\'000 CHF');
  console.log('Steuerbares Einkommen: 120\'000 CHF');
  console.log('Kanton: BE');
  console.log('Zivilstand: ledig');
  console.log(`Berechnete Steuerersparnis: ${result1.toFixed(2)} CHF`);
  console.log(`Test bestanden: ${result1 > 10000 && result1 < 20000}`);
  console.log();
  
  // Testfall 2: Berechnung der Steuerersparnis durch Einzahlung in die Säule 3a
  const testCase2 = {
    contributionAmount: 7258, // Maximalbetrag 2025 mit PK
    taxableIncome: 90000,
    canton: 'BE',
    maritalStatus: 'married'
  };
  
  const result2 = steuerOptimierung.calculatePillar3aTaxSavings(
    testCase2.contributionAmount,
    testCase2.taxableIncome,
    testCase2.canton,
    testCase2.maritalStatus
  );
  
  console.log('Testfall 2: Berechnung der Steuerersparnis durch Einzahlung in die Säule 3a');
  console.log('Einzahlungsbetrag: 7\'258 CHF (Maximalbetrag 2025 mit PK)');
  console.log('Steuerbares Einkommen: 90\'000 CHF');
  console.log('Kanton: BE');
  console.log('Zivilstand: verheiratet');
  console.log(`Berechnete Steuerersparnis: ${result2.toFixed(2)} CHF`);
  console.log(`Test bestanden: ${result2 > 1000 && result2 < 3000}`);
  console.log();
}

// Funktion zum Testen der Vermögensallokationsberechnung
function testVermoegensallokationsBerechnung() {
  console.log('=== Test: Vermögensallokationsberechnung ===');
  
  // Testfall 1: Bestimmung des Risikoprofils
  const testCase1 = {
    investmentHorizon: 'long',
    riskTolerance: 'medium',
    investmentKnowledge: 'intermediate',
    incomeStability: 'high',
    financialReserves: 'medium'
  };
  
  const result1 = vermoegensAllokation.determineRiskProfile(testCase1);
  
  console.log('Testfall 1: Bestimmung des Risikoprofils');
  console.log('Anlagehorizont: lang');
  console.log('Risikotoleranz: mittel');
  console.log('Anlagekenntnisse: mittel');
  console.log('Einkommensstabilität: hoch');
  console.log('Finanzielle Reserven: mittel');
  console.log(`Berechnetes Risikoprofil: ${result1}`);
  console.log(`Test bestanden: ${result1 === 'ausgewogen' || result1 === 'wachstumsorientiert'}`);
  console.log();
  
  // Testfall 2: Berechnung der optimalen Vermögensallokation
  const testCase2 = {
    riskProfile: 'ausgewogen',
    age: 45,
    retirementAge: 65
  };
  
  const result2 = vermoegensAllokation.calculateOptimalAssetAllocation(
    testCase2.riskProfile,
    testCase2.age,
    testCase2.retirementAge
  );
  
  console.log('Testfall 2: Berechnung der optimalen Vermögensallokation');
  console.log('Risikoprofil: ausgewogen');
  console.log('Alter: 45');
  console.log('Pensionierungsalter: 65');
  console.log('Berechnete optimale Vermögensallokation:');
  console.log(`Liquidität: ${(result2.optimalAllocation.liquiditaet * 100).toFixed(1)}%`);
  console.log(`Obligationen: ${(result2.optimalAllocation.obligationen * 100).toFixed(1)}%`);
  console.log(`Aktien: ${(result2.optimalAllocation.aktien * 100).toFixed(1)}%`);
  console.log(`Immobilien: ${(result2.optimalAllocation.immobilien * 100).toFixed(1)}%`);
  console.log(`Alternative Anlagen: ${(result2.optimalAllocation.alternative * 100).toFixed(1)}%`);
  console.log(`Erwartete Rendite: ${(result2.expectedReturn * 100).toFixed(2)}%`);
  console.log(`Test bestanden: ${result2.optimalAllocation.aktien > 0.2 && result2.optimalAllocation.aktien < 0.4}`);
  console.log();
}

// Funktion zum Testen der Liquiditätsplanungsberechnung
function testLiquiditaetsplanungsBerechnung() {
  console.log('=== Test: Liquiditätsplanungsberechnung ===');
  
  // Testfall 1: Berechnung des monatlichen Cashflows
  const testCase1 = {
    monthlyIncome: [
      { description: 'Gehalt', amount: 8000 },
      { description: 'Nebeneinkommen', amount: 1000 }
    ],
    monthlyExpenses: [
      { description: 'Miete', amount: 2000 },
      { description: 'Nebenkosten', amount: 300 },
      { description: 'Versicherungen', amount: 500 },
      { description: 'Lebensmittel', amount: 800 },
      { description: 'Transport', amount: 400 },
      { description: 'Freizeit', amount: 600 }
    ]
  };
  
  const result1 = liquiditaetsplanung.calculateMonthlyCashflow(
    testCase1.monthlyIncome,
    testCase1.monthlyExpenses
  );
  
  console.log('Testfall 1: Berechnung des monatlichen Cashflows');
  console.log('Monatliches Einkommen: 9\'000 CHF');
  console.log('Monatliche Ausgaben: 4\'600 CHF');
  console.log(`Berechneter Netto-Cashflow: ${result1.netCashflow.toFixed(2)} CHF`);
  console.log(`Berechnete Sparquote: ${(result1.savingsRate * 100).toFixed(1)}%`);
  console.log(`Test bestanden: ${Math.abs(result1.netCashflow - 4400) < 10}`);
  console.log();
  
  // Testfall 2: Berechnung der empfohlenen Notfallreserve
  const testCase2 = {
    monthlyExpenses: [
      { description: 'Miete', amount: 2000 },
      { description: 'Nebenkosten', amount: 300 },
      { description: 'Versicherungen', amount: 500 },
      { description: 'Lebensmittel', amount: 800 },
      { description: 'Transport', amount: 400 },
      { description: 'Freizeit', amount: 600 }
    ],
    riskProfile: 'medium'
  };
  
  const result2 = liquiditaetsplanung.calculateEmergencyFund(
    testCase2.monthlyExpenses,
    testCase2.riskProfile
  );
  
  console.log('Testfall 2: Berechnung der empfohlenen Notfallreserve');
  console.log('Monatliche Ausgaben: 4\'600 CHF');
  console.log('Risikoprofil: mittel');
  console.log(`Berechnete empfohlene Notfallreserve: ${result2.recommendedAmount.toFixed(2)} CHF`);
  console.log(`Empfohlene Monate an Ausgaben: ${result2.monthsOfExpenses}`);
  console.log(`Test bestanden: ${Math.abs(result2.recommendedAmount - 18400) < 100}`);
  console.log();
}

// Funktion zum Testen des 13. AHV-Renten-Schalters
function test13thAHVToggle() {
  console.log('=== Test: 13. AHV-Renten-Schalter ===');
  
  // Testfall 1: Berechnung ohne 13. AHV-Rente
  calculations.toggle13thAHVRente(false);
  
  const testCase1 = {
    averageIncome: 85000,
    contributionYears: 44,
    isMarried: false
  };
  
  const result1 = calculations.calculateAHVRente(
    testCase1.averageIncome,
    testCase1.contributionYears,
    testCase1.isMarried
  );
  
  console.log('Testfall 1: Berechnung ohne 13. AHV-Rente');
  console.log(`13. AHV-Rente aktiviert: ${calculations.is13thAHVRenteEnabled()}`);
  console.log(`Berechnete jährliche Rente: ${result1.yearlyRente.toFixed(2)} CHF`);
  console.log();
  
  // Testfall 2: Berechnung mit 13. AHV-Rente
  calculations.toggle13thAHVRente(true);
  
  const testCase2 = {
    averageIncome: 85000,
    contributionYears: 44,
    isMarried: false
  };
  
  const result2 = calculations.calculateAHVRente(
    testCase2.averageIncome,
    testCase2.contributionYears,
    testCase2.isMarried
  );
  
  console.log('Testfall 2: Berechnung mit 13. AHV-Rente');
  console.log(`13. AHV-Rente aktiviert: ${calculations.is13thAHVRenteEnabled()}`);
  console.log(`Berechnete jährliche Rente: ${result2.yearlyRente.toFixed(2)} CHF`);
  console.log();
  
  // Vergleich der Ergebnisse
  const expectedRatio = 13 / 12;
  const actualRatio = result2.yearlyRente / result1.yearlyRente;
  
  console.log('Vergleich der Ergebnisse:');
  console.log(`Erwartetes Verhältnis (13/12): ${expectedRatio.toFixed(4)}`);
  console.log(`Tatsächliches Verhältnis: ${actualRatio.toFixed(4)}`);
  console.log(`Test bestanden: ${Math.abs(actualRatio - expectedRatio) < 0.01}`);
  console.log();
}

// Hauptfunktion zum Ausführen aller Tests
function runAllTests() {
  console.log('=== Finanzpl
(Content truncated due to size limit. Use line ranges to read in chunks)
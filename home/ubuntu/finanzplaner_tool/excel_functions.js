// Excel-ähnliche Berechnungsfunktionen für das Finanzplaner-Tool

/**
 * Berechnet den Barwert einer Reihe zukünftiger Zahlungen
 * @param {number} rate - Zinssatz pro Periode
 * @param {number} nper - Gesamtzahl der Perioden
 * @param {number} pmt - Zahlung pro Periode
 * @param {number} fv - Zukünftiger Wert
 * @param {number} type - Zahlungstyp (0: Ende der Periode, 1: Anfang der Periode)
 * @returns {number} Barwert
 */
function PV(rate, nper, pmt, fv = 0, type = 0) {
  if (rate === 0) {
    return -pmt * nper - fv;
  }
  
  const pvif = Math.pow(1 + rate, nper);
  let pv = -(pmt * (1 + rate * type) * (1 - pvif) / rate - fv * pvif);
  
  return pv;
}

/**
 * Berechnet den zukünftigen Wert einer Investition
 * @param {number} rate - Zinssatz pro Periode
 * @param {number} nper - Gesamtzahl der Perioden
 * @param {number} pmt - Zahlung pro Periode
 * @param {number} pv - Barwert
 * @param {number} type - Zahlungstyp (0: Ende der Periode, 1: Anfang der Periode)
 * @returns {number} Zukünftiger Wert
 */
function FV(rate, nper, pmt, pv = 0, type = 0) {
  if (rate === 0) {
    return -pv - pmt * nper;
  }
  
  const pvif = Math.pow(1 + rate, nper);
  const fvif = (pvif - 1) / rate;
  
  let fv = -(pv * pvif + pmt * (1 + rate * type) * fvif);
  
  return fv;
}

/**
 * Berechnet die Zahlung für ein Darlehen
 * @param {number} rate - Zinssatz pro Periode
 * @param {number} nper - Gesamtzahl der Perioden
 * @param {number} pv - Barwert
 * @param {number} fv - Zukünftiger Wert
 * @param {number} type - Zahlungstyp (0: Ende der Periode, 1: Anfang der Periode)
 * @returns {number} Zahlung pro Periode
 */
function PMT(rate, nper, pv, fv = 0, type = 0) {
  if (rate === 0) {
    return -(pv + fv) / nper;
  }
  
  const pvif = Math.pow(1 + rate, nper);
  let pmt = rate / (pvif - 1) * -(pv * pvif + fv);
  
  if (type === 1) {
    pmt = pmt / (1 + rate);
  }
  
  return pmt;
}

/**
 * Berechnet die Anzahl der Perioden für ein Darlehen
 * @param {number} rate - Zinssatz pro Periode
 * @param {number} pmt - Zahlung pro Periode
 * @param {number} pv - Barwert
 * @param {number} fv - Zukünftiger Wert
 * @param {number} type - Zahlungstyp (0: Ende der Periode, 1: Anfang der Periode)
 * @returns {number} Anzahl der Perioden
 */
function NPER(rate, pmt, pv, fv = 0, type = 0) {
  if (rate === 0) {
    return -(pv + fv) / pmt;
  }
  
  const num = pmt * (1 + rate * type) - fv * rate;
  const den = (pv * rate + pmt * (1 + rate * type));
  
  return Math.log(num / den) / Math.log(1 + rate);
}

/**
 * Berechnet den internen Zinsfuß einer Investition
 * @param {Array} values - Array von Cashflows
 * @param {number} guess - Schätzung des internen Zinsfußes
 * @returns {number} Interner Zinsfuß
 */
function IRR(values, guess = 0.1) {
  const maxIterations = 100;
  const tolerance = 1e-10;
  
  let x = guess;
  
  for (let i = 0; i < maxIterations; i++) {
    let f = 0;
    let df = 0;
    
    for (let j = 0; j < values.length; j++) {
      const v = values[j];
      const factor = Math.pow(1 + x, j);
      f += v / factor;
      df -= j * v / Math.pow(1 + x, j + 1);
    }
    
    // Newton-Raphson-Schritt
    const dx = f / df;
    x -= dx;
    
    if (Math.abs(dx) < tolerance) {
      return x;
    }
  }
  
  return NaN; // Keine Konvergenz
}

/**
 * Berechnet den Nettobarwert einer Investition
 * @param {number} rate - Diskontierungssatz
 * @param {Array} values - Array von Cashflows
 * @returns {number} Nettobarwert
 */
function NPV(rate, values) {
  let npv = 0;
  
  for (let i = 0; i < values.length; i++) {
    npv += values[i] / Math.pow(1 + rate, i);
  }
  
  return npv;
}

/**
 * Berechnet die Abschreibung eines Vermögenswerts mit der linearen Methode
 * @param {number} cost - Anschaffungskosten
 * @param {number} salvage - Restwert
 * @param {number} life - Nutzungsdauer
 * @returns {number} Jährliche Abschreibung
 */
function SLN(cost, salvage, life) {
  return (cost - salvage) / life;
}

/**
 * Berechnet die Abschreibung eines Vermögenswerts mit der degressiven Methode
 * @param {number} cost - Anschaffungskosten
 * @param {number} salvage - Restwert
 * @param {number} life - Nutzungsdauer
 * @param {number} period - Periode für die Berechnung
 * @param {number} factor - Abschreibungsfaktor (Standard: 2 für doppelt-degressive Abschreibung)
 * @returns {number} Abschreibung für die angegebene Periode
 */
function DDB(cost, salvage, life, period, factor = 2) {
  let book_value = cost;
  let total_depreciation = 0;
  
  for (let i = 1; i <= period; i++) {
    const depreciation_rate = Math.min(factor / life, 1 - Math.pow(salvage / cost, 1 / life));
    const depreciation = Math.min(book_value * depreciation_rate, book_value - salvage);
    
    book_value -= depreciation;
    total_depreciation += depreciation;
    
    if (i === period) {
      return depreciation;
    }
  }
  
  return 0;
}

/**
 * Berechnet den Kapitalwert einer Leibrente
 * @param {number} rate - Zinssatz pro Periode
 * @param {number} nper - Gesamtzahl der Perioden
 * @param {number} pmt - Zahlung pro Periode
 * @param {number} type - Zahlungstyp (0: Ende der Periode, 1: Anfang der Periode)
 * @returns {number} Kapitalwert der Leibrente
 */
function PVANNUITY(rate, nper, pmt, type = 0) {
  if (rate === 0) {
    return pmt * nper;
  }
  
  const pvif = Math.pow(1 + rate, nper);
  const pv = pmt * (1 + rate * type) * (1 - 1 / pvif) / rate;
  
  return pv;
}

/**
 * Berechnet den Kapitalwert einer ewigen Rente
 * @param {number} rate - Zinssatz pro Periode
 * @param {number} pmt - Zahlung pro Periode
 * @returns {number} Kapitalwert der ewigen Rente
 */
function PVPERPETUITY(rate, pmt) {
  if (rate === 0) {
    return Infinity;
  }
  
  return pmt / rate;
}

/**
 * Berechnet die Rendite einer Investition (Money Weighted Return)
 * @param {Array} cashflows - Array von Cashflows (negativ für Investitionen, positiv für Rückflüsse)
 * @param {Array} dates - Array von Daten für die Cashflows (als Anzahl der Tage seit einem Basisdatum)
 * @returns {number} Jährliche Rendite
 */
function XIRR(cashflows, dates) {
  const guess = 0.1;
  const maxIterations = 100;
  const tolerance = 1e-10;
  
  let x = guess;
  
  for (let i = 0; i < maxIterations; i++) {
    let f = 0;
    let df = 0;
    
    for (let j = 0; j < cashflows.length; j++) {
      const yearFraction = (dates[j] - dates[0]) / 365;
      const v = cashflows[j];
      const factor = Math.pow(1 + x, yearFraction);
      f += v / factor;
      df -= yearFraction * v / Math.pow(1 + x, yearFraction + 1);
    }
    
    // Newton-Raphson-Schritt
    const dx = f / df;
    x -= dx;
    
    if (Math.abs(dx) < tolerance) {
      return x;
    }
  }
  
  return NaN; // Keine Konvergenz
}

/**
 * Berechnet die Rendite einer Investition (Time Weighted Return)
 * @param {Array} endValues - Array von Endwerten für jede Periode
 * @param {Array} startValues - Array von Anfangswerten für jede Periode
 * @param {Array} cashflows - Array von Cashflows während jeder Periode
 * @returns {number} Gesamtrendite
 */
function TWR(endValues, startValues, cashflows) {
  let twr = 1;
  
  for (let i = 0; i < endValues.length; i++) {
    const periodReturn = (endValues[i] - startValues[i] - cashflows[i]) / startValues[i];
    twr *= (1 + periodReturn);
  }
  
  return twr - 1;
}

/**
 * Berechnet die Standardabweichung einer Datenreihe
 * @param {Array} values - Array von Werten
 * @returns {number} Standardabweichung
 */
function STDEV(values) {
  const n = values.length;
  if (n <= 1) return 0;
  
  const mean = values.reduce((sum, value) => sum + value, 0) / n;
  const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / (n - 1);
  
  return Math.sqrt(variance);
}

/**
 * Berechnet den Korrelationskoeffizienten zwischen zwei Datenreihen
 * @param {Array} x - Erste Datenreihe
 * @param {Array} y - Zweite Datenreihe
 * @returns {number} Korrelationskoeffizient
 */
function CORREL(x, y) {
  const n = Math.min(x.length, y.length);
  if (n <= 1) return 0;
  
  const meanX = x.reduce((sum, value) => sum + value, 0) / n;
  const meanY = y.reduce((sum, value) => sum + value, 0) / n;
  
  let numerator = 0;
  let denominatorX = 0;
  let denominatorY = 0;
  
  for (let i = 0; i < n; i++) {
    const xDiff = x[i] - meanX;
    const yDiff = y[i] - meanY;
    numerator += xDiff * yDiff;
    denominatorX += xDiff * xDiff;
    denominatorY += yDiff * yDiff;
  }
  
  if (denominatorX === 0 || denominatorY === 0) return 0;
  
  return numerator / Math.sqrt(denominatorX * denominatorY);
}

/**
 * Berechnet den Barwert einer Leibrente mit Sterbetafel
 * @param {number} rate - Zinssatz pro Periode
 * @param {number} age - Alter der Person
 * @param {number} pmt - Jährliche Zahlung
 * @param {Array} mortalityTable - Sterbetafel (Wahrscheinlichkeit, das jeweilige Alter zu erreichen)
 * @returns {number} Barwert der Leibrente
 */
function PVANNUITY_MORTALITY(rate, age, pmt, mortalityTable) {
  let pv = 0;
  const maxAge = mortalityTable.length - 1;
  
  for (let t = 0; t <= maxAge - age; t++) {
    const survivalProb = mortalityTable[age + t] / mortalityTable[age];
    pv += survivalProb * pmt / Math.pow(1 + rate, t);
  }
  
  return pv;
}

/**
 * Berechnet die Kapitalrückzahlung und Zinsen für eine Periode eines Darlehens
 * @param {number} rate - Zinssatz pro Periode
 * @param {number} period - Periode für die Berechnung
 * @param {number} nper - Gesamtzahl der Perioden
 * @param {number} pv - Barwert
 * @param {number} fv - Zukünftiger Wert
 * @param {number} type - Zahlungstyp (0: Ende der Periode, 1: Anfang der Periode)
 * @returns {Object} Objekt mit Kapitalrückzahlung und Zinsen
 */
function PPMT_IPMT(rate, period, nper, pv, fv = 0, type = 0) {
  const payment = PMT(rate, nper, pv, fv, type);
  let interest = 0;
  let principal = 0;
  
  if (period === 1 && type === 1) {
    principal = payment;
    interest = 0;
  } else {
    const remainingBalance = type === 1 ? 
      FV(rate, period - 2, payment, pv, 1) : 
      FV(rate, period - 1, payment, pv, 0);
    interest = remainingBalance * rate;
    principal = payment - interest;
  }
  
  return {
    principal: principal,
    interest: interest
  };
}

/**
 * Berechnet den Wert einer Anlage mit regelmäßigen Einzahlungen
 * @param {number} initialInvestment - Anfangsinvestition
 * @param {number} regularContribution - Regelmäßige Einzahlung
 * @param {number} rate - Jährliche Rendite
 * @param {number} years - Anlagedauer in Jahren
 * @param {number} contributionFrequency - Häufigkeit der Einzahlungen pro Jahr
 * @returns {number} Endwert der Anlage
 */
function INVESTMENT_VALUE(initialInvestment, regularContribution, rate, years, contributionFrequency = 12) {
  const ratePerPeriod = rate / contributionFrequency;
  const periods = years * contributionFrequency;
  
  // Wert der Anfangsinvestition
  const initialValue = initialInvestment * Math.pow(1 + ratePerPeriod, periods);
  
  // Wert der regelmäßigen Einzahlungen
  const contributionValue = regularContribution * ((Math.pow(1 + ratePerPeriod, periods) - 1) / ratePerPeriod);
  
  return initialValue + contributionValue;
}

/**
 * Berechnet die Inflation-bereinigte Rendite
 * @param {number} nominalRate - Nominale Rendite
 * @param {number} inflationRate - Inflationsrate
 * @returns {number} Reale Rendite
 */
function REAL_RETURN(nominalRate, inflationRate) {
  return (1 + nominalRate) / (1 + inflationRate) - 1;
}

/**
 * Berechnet den Barwert einer Immobilie mit Mieteinnahmen
 * @param {number} purchasePrice - Kaufpreis
 * @param {number} annualRent - Jährliche Mieteinnahmen
 * @param {number} annualCosts - Jährliche Kosten
 * @param {number} expectedGrowthRate - Erwartete jährliche Wertsteigerung
 * @param {number} requiredReturn - Geforderte Rendite
 * @param {number} years - Anlagehorizont in Jahren
 * @returns {Object} Objekt mit Barwert und Rendite
 */
function REAL_ESTATE_VALUE(purchasePrice, annualRent, annualCosts, expectedGrowthRate, requiredReturn, years) {
  const netRent = annualRent - annualCosts;
  const terminalValue = purchasePrice * Math.pow(1 + expectedGrowthRate, years);
  
  let presentValue = 0;
  
  // Barwert der Mieteinnahmen
  for (let t = 1; t <= years; t++) {
    presentValue += netRent * Math.pow(1 + expectedGrowthRate, t - 1) / Math.pow(1 + requiredReturn, t);
  }
  
  // Barwert des Endwerts
  presentValue += terminalValue / Math.pow(1 + requiredReturn, years);
  
  // Berechnung der internen Rendite
  const cashflows = [-purchasePrice];
  for (let t = 1; t <= years; t++) {
    cashflows.push(netRent * Math.pow(1 + expectedGrowthRate, t - 1));
  }
  cashflows[cashflows.length - 1] += terminalValue;
  
  const irr = IRR(cashflows);
  
  return {
    presentValue: presentValue,
    internalRateOfReturn: irr
  };
}

/**
 * Berechnet die Rendite einer Immobilieninvestition
 * @param {number} purchasePrice - Kaufpreis
 * @param {number} annualRent - Jährliche Mieteinnahmen
 * @param {number} annualCosts - Jährliche Kosten
 * @returns {Object} Objekt mit Bruttorendite und Nettorendite
 */
function REAL_ESTATE_RETURN(purchasePrice, annualRent, annualCosts) {
  const grossReturn = annualRent / purchasePrice;
  const netReturn = (annualRent - annualCosts) / purchasePrice;
  
  return {
    grossReturn: grossReturn,
    netReturn: netReturn
  };
}

/**
 * Berechnet die Tragbarkeit einer Immobilienfinanzierung
 * @param {number} propertyValue - Immobilienwert
 * @param {number} equity - Eigenkapital
 * @param {number} income - Jährliches Einkommen
 * @param {number} calculationRate - Kalkulatorischer Zinssatz
 * @param {number} maintenanceRate - Unterhaltskosten als Prozentsatz des Immobilienwerts
 * @returns {Object} Objekt mit Tragbarkeitsquote und Beurteilung
 */
function AFFORDABILITY(propertyValue, equity, income, calculationRate = 0.05, maintenanceRate = 0.01) {
  const mortgage = propertyValue - equity;
  const interestCosts = mortgage * calculationRate;
  const maintenanceCosts = propertyValue * maintenanceRate;
  const amortizationCosts = mortgage * 0.01; // 1% Amortisation
  
  const totalCosts = interestCosts + maintenanceCosts + amortizationCosts;
  const affordabilityRatio = totalCosts / income;
  
  let assessment = '';
  if (affordabilityRatio <= 0.33) {
    assessment = 'tragbar';
  } else if (affordabilityRatio <= 0.4) {
    assessment = 'grenzwertig';
  } else {
    assessment = 'nicht tragbar';
  }
  
  return {
    affordabilityRatio: affordabilityRatio,
    assessment: assessment,
    totalCosts: totalCosts,
    interestCosts: interestCosts,
    maintenanceCosts: maintenanceCosts,
    amortizationCosts: amortizationCosts
  };
}

/**
 * Berechnet die Steuerersparnis durch einen Pensionskasseneinkauf
 * @param {number} purchaseAmount - Einkaufsbetrag
 * @param {number} taxableIncome - Steuerbares Einkommen
 * @param {number} marginalTaxRate - Grenzsteuersatz
 * @returns {number} Steuerersparnis
 */
function TAX_SAVINGS_PENSION_PURCHASE(purchaseAmount, taxableIncome, marginalTaxRate) {
  return purchaseAmount * marginalTaxRate;
}

/**
 * Berechnet die Steuerersparnis durch eine Säule 3a-Einzahlung
 * @param {number} contributionAmount - Einzahlungsbetrag
 * @param {number} taxableIncome - Steuerbares Einkommen
 * @param {number} marginalTaxRate - Grenzsteuersatz
 * @returns {number} Steuerersparnis
 */
function TAX_SAVINGS_PILLAR_3A(contributionAmount, taxableIncome, marginalTaxRate) {
  return contributionAmount * marginalTaxRate;
}

/**
 * Berechnet die Steuern auf einen Kapitalbezug aus der Pensionskasse
 * @param {number} capitalAmount - Kapitalbetrag
 * @param {string} canton - Kanton
 * @param {string} municipality - Gemeinde
 * @param {string} maritalStatus - Zivilstand
 * @returns {number} Steuerbetrag
 */
function CAPITAL_WITHDRAWAL_TAX(capitalAmount, canton, municipality, maritalStatus) {
  // Vereinfachte Berechnung für Kanton Bern
  if (canton === 'BE') {
    let taxRate;
    
    if (maritalStatus === 'single') {
      // Steuersätze für Alleinstehen
(Content truncated due to size limit. Use line ranges to read in chunks)
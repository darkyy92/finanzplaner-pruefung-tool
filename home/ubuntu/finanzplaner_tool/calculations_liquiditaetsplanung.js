/**
 * Liquiditätsplanungsberechnungen für das Finanzplaner-Tool
 * 
 * Dieses Modul enthält Funktionen zur Berechnung der Liquiditätsplanung,
 * einschließlich Cashflow-Analysen und Notfallreserven.
 */

// Berechnung des monatlichen Cashflows
function calculateMonthlyCashflow(monthlyIncome, monthlyExpenses) {
  return {
    totalIncome: monthlyIncome.reduce((sum, item) => sum + item.amount, 0),
    totalExpenses: monthlyExpenses.reduce((sum, item) => sum + item.amount, 0),
    netCashflow: monthlyIncome.reduce((sum, item) => sum + item.amount, 0) - 
                 monthlyExpenses.reduce((sum, item) => sum + item.amount, 0),
    savingsRate: (monthlyIncome.reduce((sum, item) => sum + item.amount, 0) - 
                 monthlyExpenses.reduce((sum, item) => sum + item.amount, 0)) / 
                 monthlyIncome.reduce((sum, item) => sum + item.amount, 0)
  };
}

// Berechnung der empfohlenen Notfallreserve
function calculateEmergencyFund(monthlyExpenses, riskProfile) {
  // Empfohlene Notfallreserve basierend auf dem Risikoprofil
  let monthsOfExpenses;
  
  switch(riskProfile) {
    case 'high': // Hohes Risiko (z.B. selbständig, variabler Lohn)
      monthsOfExpenses = 6;
      break;
    case 'medium': // Mittleres Risiko
      monthsOfExpenses = 4;
      break;
    case 'low': // Niedriges Risiko (z.B. Beamter, sehr sicherer Job)
      monthsOfExpenses = 3;
      break;
    default:
      monthsOfExpenses = 4;
  }
  
  const totalMonthlyExpenses = monthlyExpenses.reduce((sum, item) => sum + item.amount, 0);
  
  return {
    recommendedAmount: totalMonthlyExpenses * monthsOfExpenses,
    monthsOfExpenses: monthsOfExpenses,
    monthlyExpenses: totalMonthlyExpenses
  };
}

// Berechnung der Liquiditätsplanung für einen bestimmten Zeitraum
function calculateLiquidityPlanning(initialLiquidity, monthlyIncome, monthlyExpenses, oneTimeEvents, months) {
  let liquidityPlan = [];
  let currentLiquidity = initialLiquidity;
  
  // Monatlicher Netto-Cashflow
  const monthlyCashflow = calculateMonthlyCashflow(monthlyIncome, monthlyExpenses);
  const netMonthlyCashflow = monthlyCashflow.netCashflow;
  
  for (let month = 0; month < months; month++) {
    // Einmalige Ereignisse für diesen Monat finden
    const eventsThisMonth = oneTimeEvents.filter(event => event.month === month);
    const oneTimeIncome = eventsThisMonth
      .filter(event => event.type === 'income')
      .reduce((sum, event) => sum + event.amount, 0);
    const oneTimeExpenses = eventsThisMonth
      .filter(event => event.type === 'expense')
      .reduce((sum, event) => sum + event.amount, 0);
    
    // Liquidität für diesen Monat berechnen
    currentLiquidity = currentLiquidity + netMonthlyCashflow + oneTimeIncome - oneTimeExpenses;
    
    // Zum Plan hinzufügen
    liquidityPlan.push({
      month,
      liquidity: currentLiquidity,
      netCashflow: netMonthlyCashflow,
      oneTimeIncome,
      oneTimeExpenses,
      events: eventsThisMonth
    });
  }
  
  return liquidityPlan;
}

// Identifizierung von Liquiditätsengpässen
function identifyLiquidityBottlenecks(liquidityPlan, minimumLiquidity) {
  const bottlenecks = liquidityPlan
    .filter(month => month.liquidity < minimumLiquidity)
    .map(month => ({
      month: month.month,
      liquidity: month.liquidity,
      shortfall: minimumLiquidity - month.liquidity
    }));
  
  return {
    hasBottlenecks: bottlenecks.length > 0,
    bottlenecks,
    worstMonth: bottlenecks.length > 0 ? 
      bottlenecks.reduce((worst, current) => 
        current.liquidity < worst.liquidity ? current : worst, bottlenecks[0]) : null
  };
}

// Berechnung der optimalen Liquiditätsverteilung
function calculateOptimalLiquidityDistribution(totalLiquidity, emergencyFundNeeded, investmentOpportunities) {
  // Sicherstellen, dass die Notfallreserve gedeckt ist
  const liquidityForEmergencyFund = Math.min(totalLiquidity, emergencyFundNeeded);
  let remainingLiquidity = totalLiquidity - liquidityForEmergencyFund;
  
  // Sortieren der Anlagemöglichkeiten nach Rendite (absteigend)
  const sortedOpportunities = [...investmentOpportunities].sort((a, b) => b.expectedReturn - a.expectedReturn);
  
  // Optimale Verteilung berechnen
  const distribution = sortedOpportunities.map(opportunity => {
    const maxAmount = opportunity.maxAmount || Infinity;
    const allocatedAmount = Math.min(remainingLiquidity, maxAmount);
    remainingLiquidity -= allocatedAmount;
    
    return {
      name: opportunity.name,
      amount: allocatedAmount,
      expectedReturn: opportunity.expectedReturn,
      expectedYield: allocatedAmount * opportunity.expectedReturn
    };
  });
  
  // Restliche Liquidität (falls vorhanden)
  if (remainingLiquidity > 0) {
    distribution.push({
      name: "Überschüssige Liquidität",
      amount: remainingLiquidity,
      expectedReturn: 0,
      expectedYield: 0
    });
  }
  
  return {
    emergencyFund: liquidityForEmergencyFund,
    investments: distribution,
    totalExpectedYield: distribution.reduce((sum, item) => sum + item.expectedYield, 0)
  };
}

// Berechnung der Auswirkungen von großen Ausgaben auf die Liquidität
function calculateMajorExpenseImpact(liquidityPlan, majorExpense) {
  // Kopie des Liquiditätsplans erstellen
  const modifiedPlan = JSON.parse(JSON.stringify(liquidityPlan));
  
  // Ausgabe zum Plan hinzufügen
  const expenseMonth = majorExpense.month;
  
  if (expenseMonth < modifiedPlan.length) {
    // Ausgabe zum entsprechenden Monat hinzufügen
    modifiedPlan[expenseMonth].oneTimeExpenses += majorExpense.amount;
    modifiedPlan[expenseMonth].events.push({
      type: 'expense',
      description: majorExpense.description,
      amount: majorExpense.amount,
      month: expenseMonth
    });
    
    // Liquidität für alle folgenden Monate neu berechnen
    for (let i = expenseMonth; i < modifiedPlan.length; i++) {
      if (i === expenseMonth) {
        modifiedPlan[i].liquidity -= majorExpense.amount;
      } else {
        modifiedPlan[i].liquidity = modifiedPlan[i-1].liquidity + 
                                    modifiedPlan[i].netCashflow + 
                                    modifiedPlan[i].oneTimeIncome - 
                                    modifiedPlan[i].oneTimeExpenses;
      }
    }
  }
  
  // Auswirkungen analysieren
  const originalEndLiquidity = liquidityPlan[liquidityPlan.length - 1].liquidity;
  const modifiedEndLiquidity = modifiedPlan[modifiedPlan.length - 1].liquidity;
  const liquidityImpact = originalEndLiquidity - modifiedEndLiquidity;
  
  // Prüfen, ob die Ausgabe zu einem Liquiditätsengpass führt
  const bottlenecks = modifiedPlan
    .filter(month => month.liquidity < 0)
    .map(month => ({
      month: month.month,
      liquidity: month.liquidity
    }));
  
  return {
    originalPlan: liquidityPlan,
    modifiedPlan,
    expense: majorExpense,
    liquidityImpact,
    causesBottleneck: bottlenecks.length > 0,
    bottlenecks,
    recommendation: bottlenecks.length > 0 ? 
      "Die geplante Ausgabe führt zu Liquiditätsengpässen. Eine Finanzierung oder Verschiebung sollte in Betracht gezogen werden." : 
      "Die geplante Ausgabe kann aus der vorhandenen Liquidität finanziert werden."
  };
}

// Berechnung der optimalen Finanzierungsstrategie für große Ausgaben
function calculateOptimalFinancingStrategy(majorExpense, currentLiquidity, monthlyCashflow, loanOptions) {
  const strategies = [];
  
  // Strategie 1: Vollständige Finanzierung aus Liquidität
  if (currentLiquidity >= majorExpense.amount) {
    const monthsToRecover = majorExpense.amount / monthlyCashflow;
    
    strategies.push({
      type: "Liquidität",
      feasible: true,
      amount: majorExpense.amount,
      interestCost: 0,
      totalCost: majorExpense.amount,
      monthsToRecover,
      recommendation: monthsToRecover <= 12 ? 
        "Empfohlen, da die Liquidität schnell wiederhergestellt werden kann." : 
        "Möglich, aber die Wiederherstellung der Liquidität dauert lange."
    });
  } else {
    strategies.push({
      type: "Liquidität",
      feasible: false,
      amount: currentLiquidity,
      shortfall: majorExpense.amount - currentLiquidity,
      recommendation: "Nicht ausreichende Liquidität vorhanden."
    });
  }
  
  // Strategie 2: Vollständige Finanzierung durch Kredit
  loanOptions.forEach(loan => {
    const monthlyPayment = calculateLoanPayment(majorExpense.amount, loan.interestRate, loan.termMonths);
    const totalInterest = (monthlyPayment * loan.termMonths) - majorExpense.amount;
    
    strategies.push({
      type: `Kredit (${loan.name})`,
      feasible: true,
      amount: majorExpense.amount,
      interestRate: loan.interestRate,
      termMonths: loan.termMonths,
      monthlyPayment,
      totalInterest,
      totalCost: majorExpense.amount + totalInterest,
      affordability: monthlyCashflow >= monthlyPayment,
      recommendation: monthlyCashflow >= monthlyPayment * 1.5 ? 
        "Empfohlen, da die monatliche Rate gut tragbar ist." : 
        monthlyCashflow >= monthlyPayment ? 
        "Möglich, aber die monatliche Rate belastet den Cashflow stark." : 
        "Nicht empfohlen, da die monatliche Rate nicht tragbar ist."
    });
  });
  
  // Strategie 3: Gemischte Finanzierung (Liquidität + Kredit)
  if (currentLiquidity > 0 && currentLiquidity < majorExpense.amount) {
    loanOptions.forEach(loan => {
      const loanAmount = majorExpense.amount - currentLiquidity;
      const monthlyPayment = calculateLoanPayment(loanAmount, loan.interestRate, loan.termMonths);
      const totalInterest = (monthlyPayment * loan.termMonths) - loanAmount;
      
      strategies.push({
        type: `Gemischt (Liquidität + ${loan.name})`,
        feasible: true,
        liquidityAmount: currentLiquidity,
        loanAmount,
        interestRate: loan.interestRate,
        termMonths: loan.termMonths,
        monthlyPayment,
        totalInterest,
        totalCost: majorExpense.amount + totalInterest,
        affordability: monthlyCashflow >= monthlyPayment,
        recommendation: monthlyCashflow >= monthlyPayment * 1.5 ? 
          "Empfohlen, da die monatliche Rate gut tragbar ist und die Liquidität teilweise erhalten bleibt." : 
          "Möglich, aber die monatliche Rate belastet den Cashflow."
      });
    });
  }
  
  // Beste Strategie ermitteln
  let bestStrategy = null;
  let lowestCost = Infinity;
  
  strategies.forEach(strategy => {
    if (strategy.feasible && strategy.totalCost < lowestCost && 
        (strategy.affordability === undefined || strategy.affordability)) {
      bestStrategy = strategy;
      lowestCost = strategy.totalCost;
    }
  });
  
  return {
    expense: majorExpense,
    strategies,
    bestStrategy,
    recommendation: bestStrategy ? 
      `Die empfohlene Finanzierungsstrategie ist: ${bestStrategy.type}` : 
      "Keine geeignete Finanzierungsstrategie gefunden. Die Ausgabe sollte verschoben oder reduziert werden."
  };
}

// Hilfsfunktion zur Berechnung der Kreditrate
function calculateLoanPayment(principal, annualInterestRate, termMonths) {
  const monthlyRate = annualInterestRate / 12;
  
  if (monthlyRate === 0) {
    return principal / termMonths;
  }
  
  return principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths) / 
         (Math.pow(1 + monthlyRate, termMonths) - 1);
}

// Export der Funktionen
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateMonthlyCashflow,
    calculateEmergencyFund,
    calculateLiquidityPlanning,
    identifyLiquidityBottlenecks,
    calculateOptimalLiquidityDistribution,
    calculateMajorExpenseImpact,
    calculateOptimalFinancingStrategy,
    calculateLoanPayment
  };
}

  renditeAktienCHF: 0.05, // 5% p.a.
  renditeAktienInternational: 0.06, // 6% p.a.
  renditeObligationen: 0.02, // 2% p.a.
  renditeImmobilien: 0.03, // 3% p.a.
  renditeAlternativeAnlagen: 0.04, // 4% p.a.
  renditeLiquiditaet: 0.005, // 0.5% p.a.
};

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
  
  // Jährliche Rente (12 Monate)
  let yearlyRente = monthlyRente * 12;
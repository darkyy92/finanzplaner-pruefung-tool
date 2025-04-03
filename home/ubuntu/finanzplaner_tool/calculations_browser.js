// Browser-compatible version of calculations.js

// Define in global namespace instead of using exports
window.FinanzplanerModules.calculations = (function() {
  // Globale Variablen für die 13. AHV-Rente
  let include13thAHVRente = true; // Standardmäßig eingeschaltet
  
  // Aktuelle Werte für 2025
  const VALUES_2025 = {
    // AHV-Werte
    ahvMinimumRente: 1260, // CHF pro Monat
    ahvMaximumRente: 2520, // CHF pro Monat
    ahvEhepaarMaximum: 3780, // CHF pro Monat (150% der Maximalrente)
    
    // BVG-Werte
    bvgMindestzinssatz: 0.0125, // 1.25%
    bvgUmwandlungssatz: 0.068, // 6.8% für obligatorischen Teil
    bvgKoordinationsabzug: 26460, // CHF
    bvgEintrittsschwelle: 22680, // CHF
    bvgVersicherterLohnMax: 90720, // CHF
    
    // Säule 3a
    saeule3aMaxEinzahlungMitPK: 7258, // CHF für Personen mit Pensionskasse
    saeule3aMaxEinzahlungOhnePK: 36288, // CHF für Personen ohne Pensionskasse
    
    // Steuerwerte Kanton Bern
    steuerBernGrenzsteuersatzMax: 0.4142, // 41.42% maximaler Grenzsteuersatz
    
    // Hypothekarzinsen
    hypothekarZinsKalkulatorisch: 0.05, // 5% für Tragbarkeitsberechnung
    
    // Inflationsrate
    inflation: 0.01, // 1% p.a.
  };
  
  // Funktion zum Umschalten der 13. AHV-Rente
  function toggle13thAHVRente(include) {
    include13thAHVRente = include;
    if (typeof recalculateAll === 'function') {
      recalculateAll();
    } else {
      console.log('13. AHV-Rente umgeschaltet, aber recalculateAll ist nicht definiert');
    }
  }
  
  // Hilfsfunktion zum Runden auf 5 Rappen
  function roundTo5Cents(amount) {
    return Math.round(amount * 20) / 20; // Runden auf 0.05
  }
  
  // Funktion zur Ermittlung des AHV-Referenzalters basierend auf Geburtsjahr und Geschlecht
  function getAHVReferenceAge(birthYear, gender) {
    // Standardreferenzalter
    let referenceAge = { years: 65, months: 0 }; // Für Männer aller Jahrgänge und Frauen ab Jahrgang 1970
    
    // Übergangsregelung für Frauen der Jahrgänge 1961-1969 gemäß AHV 21
    if (gender === 'female') {
      if (birthYear === 1961) {
        referenceAge = { years: 64, months: 3 };
      } else if (birthYear === 1962) {
        referenceAge = { years: 64, months: 6 };
      } else if (birthYear === 1963) {
        referenceAge = { years: 64, months: 9 };
      } else if (birthYear >= 1964 && birthYear <= 1969) {
        referenceAge = { years: 65, months: 0 };
      } else if (birthYear < 1961) {
        referenceAge = { years: 64, months: 0 }; // Frauen vor 1961
      }
    }
    
    return referenceAge;
  }
  
  // Funktion zur Berechnung des Altersunterschieds zur Referenz in Monaten
  function calculateAgeDifferenceInMonths(retirementAge, referenceAge) {
    const retirementAgeInMonths = (retirementAge.years * 12) + retirementAge.months;
    const referenceAgeInMonths = (referenceAge.years * 12) + referenceAge.months;
    return retirementAgeInMonths - referenceAgeInMonths;
  }
  
  // AHV-Rentenberechnung
  function calculateAHVRente(averageIncome, contributionYears, isMarried = false, spouseAverageIncome = 0, spouseContributionYears = 0, birthYear = 1960, gender = 'male', retirementAge = 65) {
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
    
    // Runden auf 5 Rappen
    rente = roundTo5Cents(rente);
    
    // Monatliche Rente
    let monthlyRente = rente;
    let spouseMonthlyRente = 0;
    
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
      
      // Runden auf 5 Rappen
      spouseRente = roundTo5Cents(spouseRente);
      spouseMonthlyRente = spouseRente;
      
      // Gemeinsame Rente mit Plafonierung
      const combinedRente = rente + spouseRente;
      if (combinedRente > VALUES_2025.ahvEhepaarMaximum) {
        // Plafonierung auf 150% der Maximalrente
        const reductionFactor = VALUES_2025.ahvEhepaarMaximum / combinedRente;
        monthlyRente = roundTo5Cents(rente * reductionFactor);
        spouseMonthlyRente = roundTo5Cents(spouseRente * reductionFactor);
      }
    }
    
    // Berücksichtigung des Referenzalters und der Flexibilisierung (Vorbezug/Aufschub)
    const referenceAge = getAHVReferenceAge(birthYear, gender);
    
    // Umwandlung des Pensionierungsalters in Jahre und Monate
    const actualRetirementAge = {
      years: Math.floor(retirementAge),
      months: Math.round((retirementAge - Math.floor(retirementAge)) * 12)
    };
    
    // Berechnung des Altersunterschieds zur Referenz in Monaten
    const ageDifferenceInMonths = calculateAgeDifferenceInMonths(actualRetirementAge, referenceAge);
    
    // Anpassungsfaktor für Vorbezug oder Aufschub
    let adjustmentFactor = 1.0;
    
    if (ageDifferenceInMonths < 0) {
      // Vorbezug: Kürzung um 6.8% pro Jahr (0.56667% pro Monat)
      adjustmentFactor = 1.0 + (ageDifferenceInMonths * 0.0056667);
    } else if (ageDifferenceInMonths > 0) {
      // Aufschub: Erhöhung je nach Aufschubdauer
      // Vereinfachte Berechnung: etwa 5.2% für ein Jahr, steigernd für längere Zeiträume
      if (ageDifferenceInMonths <= 12) {
        adjustmentFactor = 1.0 + (ageDifferenceInMonths * 0.00433); // ca. 5.2% für 12 Monate
      } else if (ageDifferenceInMonths <= 24) {
        adjustmentFactor = 1.052 + ((ageDifferenceInMonths - 12) * 0.00467); // weiteres Wachstum
      } else if (ageDifferenceInMonths <= 36) {
        adjustmentFactor = 1.108 + ((ageDifferenceInMonths - 24) * 0.005); // weiteres Wachstum
      } else if (ageDifferenceInMonths <= 48) {
        adjustmentFactor = 1.168 + ((ageDifferenceInMonths - 36) * 0.00533); // weiteres Wachstum
      } else {
        adjustmentFactor = 1.232 + ((ageDifferenceInMonths - 48) * 0.00692); // max. 5 Jahre
      }
    }
    
    // Anwendung des Anpassungsfaktors
    monthlyRente = roundTo5Cents(monthlyRente * adjustmentFactor);
    if (isMarried) {
      spouseMonthlyRente = roundTo5Cents(spouseMonthlyRente * adjustmentFactor);
    }
    
    // Berechnung der Basisjahresrente (12 Monate)
    const baseYearlyRente = monthlyRente * 12;
    
    // 13. AHV-Rente berechnen
    const thirteenthRente = monthlyRente;
    
    // Gesamtjahresrente (12 oder 13 Monate, je nach Einstellung)
    let yearlyRente = baseYearlyRente;
    if (include13thAHVRente) {
      yearlyRente += thirteenthRente;
    }
    
    return {
      monthlyRente: monthlyRente,
      baseYearlyRente: baseYearlyRente,
      thirteenthRente: thirteenthRente,
      yearlyRente: yearlyRente,
      with13thRente: include13thAHVRente,
      referenceAge: referenceAge,
      actualRetirementAge: actualRetirementAge,
      adjustmentFactor: adjustmentFactor
    };
  }
  
  // AHV-Rente mit expliziter 13. AHV-Rente
  function calculateAHVRenteWith13th(averageIncome, contributionYears, isMarried = false, spouseAverageIncome = 0, spouseContributionYears = 0, birthYear = 1960, gender = 'male', retirementAge = 65) {
    // Berechne die vollständige AHV-Rente mit allen Details
    return calculateAHVRente(averageIncome, contributionYears, isMarried, spouseAverageIncome, spouseContributionYears, birthYear, gender, retirementAge);
  }
  
  // Expose the public functions and values
  return {
    VALUES_2025: VALUES_2025,
    toggle13thAHVRente: toggle13thAHVRente,
    calculateAHVRente: calculateAHVRente,
    calculateAHVRenteWith13th: calculateAHVRenteWith13th,
    // Add other calculation functions here
  };
})();
/**
 * TypeScript interfaces for the calculation results
 * Based on the original berechnungsErgebnisse structure in datenfluss.md
 */

export interface AHVRente {
  ohneZusatzrente: {
    monatlich: number;
    jaehrlich: number;
  };
  mitZusatzrente: {
    monatlich: number;
    jaehrlich: number;
    zusatzrente: number;
  };
  flexibel: {
    kuerzungssatz: number;
    erhoehungssatz: number;
    angepassteRenteOhneZusatz: number;
    angepassteRenteMitZusatz: number;
  };
}

export interface PensionskasseErgebnis {
  voraussichtlichesAltersguthaben: number;
  voraussichtlicheJaehrlicheRente: number;
  einkaufspotenzial: number;
  voraussichtlichesKapital: number;
  steuernBeiKapitalbezug: number;
  steuerersparnisDurchEinkauf: number;
  auswirkungAufRente: number;
}

export interface Saeule3aErgebnis {
  voraussichtlichesGuthaben: number;
  steuernBeiBezug: number;
}

export interface GesamtvorsorgeOption {
  jaehrlicheAHVRente: number;
  jaehrlichePKRente: number;
  kapitalverzehr: number;
  gesamtesJaehrlichesEinkommen: number;
  ersatzquote: number;
}

export interface Gesamtvorsorge {
  ohneZusatzrente: GesamtvorsorgeOption;
  mitZusatzrente: GesamtvorsorgeOption;
}

export interface Steueroptimierung {
  aktuelleJaehrlicheSteuerbelastung: number;
  steuerbelastungNachOptimierung: number;
  einsparung: number;
}

export interface Vermögensallokation {
  liquiditaet: number; // in %
  obligationen: number;
  aktien: number;
  immobilien: number;
  alternative: number;
}

export interface Anlagekonzept {
  risikoprofil: 'konservativ' | 'ausgewogen' | 'wachstumsorientiert' | 'chancenorientiert' | '';
  vermögensallokation: Vermögensallokation;
  renditeerwartung: number;
}

export interface Immobilienfinanzierung {
  tragbarkeit: number; // in %
  amortisationsdauer: number;
}

export interface BerechnungsErgebnisse {
  ahvRente: AHVRente;
  pensionskasse: PensionskasseErgebnis;
  saeule3a: Saeule3aErgebnis;
  gesamtvorsorge: Gesamtvorsorge;
  steueroptimierung: Steueroptimierung;
  anlagekonzept: Anlagekonzept;
  immobilienfinanzierung: Immobilienfinanzierung;
}

// Default empty calculation results structure for initialization
export const defaultBerechnungsErgebnisse: BerechnungsErgebnisse = {
  ahvRente: {
    ohneZusatzrente: {
      monatlich: 0,
      jaehrlich: 0
    },
    mitZusatzrente: {
      monatlich: 0,
      jaehrlich: 0,
      zusatzrente: 0
    },
    flexibel: {
      kuerzungssatz: 0,
      erhoehungssatz: 0,
      angepassteRenteOhneZusatz: 0,
      angepassteRenteMitZusatz: 0
    }
  },
  
  pensionskasse: {
    voraussichtlichesAltersguthaben: 0,
    voraussichtlicheJaehrlicheRente: 0,
    einkaufspotenzial: 0,
    voraussichtlichesKapital: 0,
    steuernBeiKapitalbezug: 0,
    steuerersparnisDurchEinkauf: 0,
    auswirkungAufRente: 0
  },
  
  saeule3a: {
    voraussichtlichesGuthaben: 0,
    steuernBeiBezug: 0
  },
  
  gesamtvorsorge: {
    ohneZusatzrente: {
      jaehrlicheAHVRente: 0,
      jaehrlichePKRente: 0,
      kapitalverzehr: 0,
      gesamtesJaehrlichesEinkommen: 0,
      ersatzquote: 0
    },
    mitZusatzrente: {
      jaehrlicheAHVRente: 0,
      jaehrlichePKRente: 0,
      kapitalverzehr: 0,
      gesamtesJaehrlichesEinkommen: 0,
      ersatzquote: 0
    }
  },
  
  steueroptimierung: {
    aktuelleJaehrlicheSteuerbelastung: 0,
    steuerbelastungNachOptimierung: 0,
    einsparung: 0
  },
  
  anlagekonzept: {
    risikoprofil: "",
    vermögensallokation: {
      liquiditaet: 0,
      obligationen: 0,
      aktien: 0,
      immobilien: 0,
      alternative: 0
    },
    renditeerwartung: 0
  },
  
  immobilienfinanzierung: {
    tragbarkeit: 0,
    amortisationsdauer: 0
  }
};

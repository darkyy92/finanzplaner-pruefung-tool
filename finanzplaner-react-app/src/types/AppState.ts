/**
 * TypeScript interfaces for application state management
 */

import { KundenDaten } from './KundenDaten';
import { BerechnungsErgebnisse } from './BerechnungsErgebnisse';

// Main sections of the application
export type AppSection = 
  | 'intro'
  | 'customer-profile'
  | 'current-situation'
  | 'retirement-planning'
  | 'tax-optimization'
  | 'investment-concept'
  | 'real-estate'
  | 'estate-planning'
  | 'action-plan';

// Status of data in each section
export type SectionStatus = 
  | 'not-started'  // User hasn't entered data yet
  | 'in-progress'  // User has started but not completed
  | 'completed';   // User has completed and submitted

// Track status of each section
export interface SectionStatusMap {
  'intro': SectionStatus;
  'customer-profile': SectionStatus;
  'current-situation': SectionStatus;
  'retirement-planning': SectionStatus;
  'tax-optimization': SectionStatus;
  'investment-concept': SectionStatus;
  'real-estate': SectionStatus;
  'estate-planning': SectionStatus;
  'action-plan': SectionStatus;
}

// Main application state
export interface AppState {
  // Current active section
  currentSection: AppSection;
  
  // 13th AHV pension toggle state
  include13thAHVRente: boolean;
  
  // Customer data
  kundenDaten: KundenDaten;
  
  // Calculation results
  berechnungsErgebnisse: BerechnungsErgebnisse;
  
  // Section status tracking
  sectionStatus: SectionStatusMap;
}

// Default initial app state
export const defaultAppState: AppState = {
  currentSection: 'intro',
  include13thAHVRente: true,
  kundenDaten: {
    /* Import from KundenDaten.ts */
    persoenlich: {
      vorname: "",
      nachname: "",
      geburtsdatum: "",
      zivilstand: "",
      kinder: 0,
      beruf: "",
      arbeitgeber: "",
      adresse: "",
      plz: "",
      ort: "",
      kanton: "",
      email: "",
      telefon: "",
      ziele: ""
    },
    partner: {
      vorhanden: false,
      vorname: "",
      nachname: "",
      geburtsdatum: "",
      beruf: "",
      arbeitgeber: ""
    },
    einkommen: {
      gehalt: 0,
      boni: 0,
      mieteinnahmen: 0,
      kapitalertraege: 0,
      sonstigeEinnahmen: 0
    },
    ausgaben: {
      wohnkosten: 0,
      versicherungen: 0,
      transport: 0,
      nahrung: 0,
      freizeit: 0,
      sonstigeAusgaben: 0
    },
    vermoegen: {
      bargeld: 0,
      wertschriften: 0,
      immobilien: 0,
      pensionskasse: 0,
      saeule3a: 0,
      sonstigesVermoegen: 0
    },
    schulden: {
      hypotheken: 0,
      kredite: 0,
      sonstigeSchulden: 0
    },
    vorsorge: {
      ahv: {
        beitragsjahre: 0,
        beitragsluecken: false,
        fehlendeJahre: 0,
        durchschnittlichesJahreseinkommen: 0,
        geplantesRentenalter: 65,
        vorbezug: false,
        aufschub: false
      },
      pensionskasse: {
        name: "",
        vorsorgeplan: "",
        aktuellesAltersguthaben: 0,
        umwandlungssatz: 0.068,
        kapitalbezug: false,
        kapitalbezugAnteil: 0,
        geplantEinkauf: false,
        einkaufBetrag: 0,
        einkaufZeitpunkt: ""
      },
      saeule3a: {
        aktuellesGuthaben: 0,
        jaehrlicheEinzahlung: 0,
        bezugsstrategie: "",
        bezugStaffelung: ""
      },
      saeule3b: {
        lebensversicherungen: false,
        rueckkaufswert: 0,
        auszahlungBeiAblauf: 0,
        ablaufdatum: "",
        andereAnlagen: 0
      }
    }
  },
  berechnungsErgebnisse: {
    /* Import from BerechnungsErgebnisse.ts */
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
  },
  sectionStatus: {
    'intro': 'completed', // Start with intro as completed
    'customer-profile': 'not-started',
    'current-situation': 'not-started',
    'retirement-planning': 'not-started',
    'tax-optimization': 'not-started',
    'investment-concept': 'not-started',
    'real-estate': 'not-started',
    'estate-planning': 'not-started',
    'action-plan': 'not-started'
  }
};

// Type for actions that can be dispatched to update state
export type AppAction = 
  | { type: 'SET_CURRENT_SECTION'; payload: AppSection }
  | { type: 'TOGGLE_13TH_AHV_RENTE'; payload: boolean }
  | { type: 'UPDATE_KUNDEN_DATEN'; payload: Partial<KundenDaten> }
  | { type: 'UPDATE_BERECHNUNGS_ERGEBNISSE'; payload: Partial<BerechnungsErgebnisse> }
  | { type: 'UPDATE_SECTION_STATUS'; payload: { section: AppSection; status: SectionStatus } }
  | { type: 'RESET_APP_STATE' };

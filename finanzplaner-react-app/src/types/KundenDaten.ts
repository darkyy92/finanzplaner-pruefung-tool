/**
 * TypeScript interfaces for the customer data model
 * Based on the original kundenDaten structure in datenfluss.md
 */

export interface Persoenlich {
  vorname: string;
  nachname: string;
  geburtsdatum: string;
  zivilstand: 'ledig' | 'verheiratet' | 'geschieden' | 'verwitwet' | 'eingetragene Partnerschaft' | '';
  kinder: number;
  beruf: string;
  arbeitgeber: string;
  adresse: string;
  plz: string;
  ort: string;
  kanton: string;
  email: string;
  telefon: string;
  ziele: string;
}

export interface Partner {
  vorhanden: boolean;
  vorname: string;
  nachname: string;
  geburtsdatum: string;
  beruf: string;
  arbeitgeber: string;
}

export interface Einkommen {
  gehalt: number;
  boni: number;
  mieteinnahmen: number;
  kapitalertraege: number;
  sonstigeEinnahmen: number;
}

export interface Ausgaben {
  wohnkosten: number;
  versicherungen: number;
  transport: number;
  nahrung: number;
  freizeit: number;
  sonstigeAusgaben: number;
}

export interface Vermoegen {
  bargeld: number;
  wertschriften: number;
  immobilien: number;
  pensionskasse: number;
  saeule3a: number;
  sonstigesVermoegen: number;
}

export interface Schulden {
  hypotheken: number;
  kredite: number;
  sonstigeSchulden: number;
}

export interface AHV {
  beitragsjahre: number;
  beitragsluecken: boolean;
  fehlendeJahre: number;
  durchschnittlichesJahreseinkommen: number;
  geplantesRentenalter: number;
  vorbezug: boolean;
  aufschub: boolean;
}

export interface Pensionskasse {
  name: string;
  vorsorgeplan: string;
  aktuellesAltersguthaben: number;
  umwandlungssatz: number;
  kapitalbezug: boolean;
  kapitalbezugAnteil: number;
  geplantEinkauf: boolean;
  einkaufBetrag: number;
  einkaufZeitpunkt: string;
}

export interface Saeule3a {
  aktuellesGuthaben: number;
  jaehrlicheEinzahlung: number;
  bezugsstrategie: string;
  bezugStaffelung: string;
}

export interface Saeule3b {
  lebensversicherungen: boolean;
  rueckkaufswert: number;
  auszahlungBeiAblauf: number;
  ablaufdatum: string;
  andereAnlagen: number;
}

export interface Vorsorge {
  ahv: AHV;
  pensionskasse: Pensionskasse;
  saeule3a: Saeule3a;
  saeule3b: Saeule3b;
}

export interface KundenDaten {
  persoenlich: Persoenlich;
  partner: Partner;
  einkommen: Einkommen;
  ausgaben: Ausgaben;
  vermoegen: Vermoegen;
  schulden: Schulden;
  vorsorge: Vorsorge;
}

// Default empty customer data structure for initialization
export const defaultKundenDaten: KundenDaten = {
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
};

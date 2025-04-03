# Datenfluss zwischen Komponenten des Finanzplaner-Tools

## Übersicht

Dieses Dokument beschreibt den Datenfluss zwischen den verschiedenen Komponenten des Finanzplaner-Tools. Es dient als Referenz für die Implementierung und Weiterentwicklung des Tools.

## Hauptkomponenten und Datenfluss

### 1. Einführung und Anleitung
- **Output**: Benutzereinstellungen (z.B. 13. AHV-Rente ein/aus)
- **Datenfluss zu**: Alle anderen Komponenten

### 2. Kundenprofil
- **Input**: Benutzereinstellungen
- **Output**: 
  - Persönliche Daten (Name, Geburtsdatum, Zivilstand)
  - Familiensituation (Kinder, Partner)
  - Berufliche Situation (Beruf, Arbeitgeber)
  - Wohnort (Kanton für Steuerberechnungen)
  - Ziele und Wünsche
- **Datenfluss zu**: Ist-Analyse, Vorsorgeplanung, Steueroptimierung, Nachlass- und Vorsorgeplanung

### 3. Ist-Analyse
- **Input**: Kundenprofil
- **Output**:
  - Einkommensübersicht (Gehalt, Boni, Mieteinnahmen, Kapitalerträge)
  - Ausgabenübersicht (Wohnkosten, Versicherungen, Transport, Nahrung, Freizeit)
  - Vermögensübersicht (Bargeld, Wertschriften, Immobilien, Pensionskasse, Säule 3a)
  - Schuldenübersicht (Hypotheken, Kredite)
  - Versicherungsübersicht (Kranken-, Unfall-, Lebensversicherung)
- **Datenfluss zu**: Vorsorgeplanung, Steueroptimierung, Anlagekonzept, Immobilienfinanzierung, Maßnahmenplan

### 4. Vorsorgeplanung
- **Input**: Kundenprofil, Ist-Analyse, Benutzereinstellungen (13. AHV-Rente)
- **Output**:
  - AHV-Rentenberechnung (mit/ohne 13. AHV-Rente)
  - Pensionskassenleistungen (Rente vs. Kapital)
  - Einkaufspotenzial in die Pensionskasse
  - Säule 3a-Prognose
  - Gesamtvorsorgesituation
- **Datenfluss zu**: Steueroptimierung, Anlagekonzept, Maßnahmenplan, Dokumentation

### 5. Steueroptimierung
- **Input**: Kundenprofil, Ist-Analyse, Vorsorgeplanung
- **Output**:
  - Aktuelle Steuerbelastung
  - Optimierungsmöglichkeiten (Einkäufe PK, Säule 3a, Renovationen)
  - Steuerprognose nach Optimierung
  - Steuerbelastung bei Kapitalbezug
- **Datenfluss zu**: Anlagekonzept, Immobilienfinanzierung, Maßnahmenplan, Dokumentation

### 6. Anlagekonzept
- **Input**: Kundenprofil, Ist-Analyse, Vorsorgeplanung, Steueroptimierung
- **Output**:
  - Risikoprofil
  - Vermögensallokation (Liquidität, Obligationen, Aktien, Immobilien, Alternative)
  - Anlagestrategie
  - Renditeerwartungen
  - Kosten
- **Datenfluss zu**: Maßnahmenplan, Dokumentation

### 7. Immobilienfinanzierung
- **Input**: Kundenprofil, Ist-Analyse, Steueroptimierung
- **Output**:
  - Tragbarkeitsberechnung
  - Finanzierungsmodelle
  - Amortisationsplanung
  - Steuerliche Aspekte
- **Datenfluss zu**: Maßnahmenplan, Dokumentation

### 8. Nachlass- und Vorsorgeplanung
- **Input**: Kundenprofil, Ist-Analyse, Vorsorgeplanung
- **Output**:
  - Güter- und erbrechtliche Situation
  - Vorsorgeauftrag und Patientenverfügung
  - Nachlassplanung
  - Unternehmensnachfolge (falls relevant)
- **Datenfluss zu**: Maßnahmenplan, Dokumentation

### 9. Maßnahmenplan
- **Input**: Alle vorherigen Komponenten
- **Output**:
  - Zeitlich geordnete Maßnahmen
  - Prioritäten
  - Verantwortlichkeiten
  - Meilensteine
- **Datenfluss zu**: Dokumentation

### 10. Dokumentation und Checkliste
- **Input**: Alle vorherigen Komponenten
- **Output**:
  - Zusammenfassung aller Ergebnisse
  - Checkliste für die Umsetzung
  - Dokumentation der Berechnungen
  - Nachvollziehbare Lösungswege

## Datenmodell

### Kundendaten
```javascript
const kundenDaten = {
  persoenlich: {
    vorname: "",
    nachname: "",
    geburtsdatum: "",
    zivilstand: "", // ledig, verheiratet, geschieden, verwitwet, eingetragene Partnerschaft
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
      bezugsstrategie: "", // Einmalbezug, gestaffelter Bezug
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
```

### Berechnungsergebnisse
```javascript
const berechnungsErgebnisse = {
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
    risikoprofil: "", // konservativ, ausgewogen, wachstumsorientiert, chancenorientiert
    vermögensallokation: {
      liquiditaet: 0, // in %
      obligationen: 0,
      aktien: 0,
      immobilien: 0,
      alternative: 0
    },
    renditeerwartung: 0
  },
  
  immobilienfinanzierung: {
    tragbarkeit: 0, // in %
    amortisationsdauer: 0
  }
};
```

## Ereignisbasierte Kommunikation

Das Tool verwendet ein ereignisbasiertes Kommunikationssystem, um Änderungen zwischen den Komponenten zu propagieren:

```javascript
// Beispiel für die Implementierung des Ereignissystems
const eventBus = {
  events: {},
  
  subscribe: function(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  },
  
  publish: function(event, data) {
    if (!this.events[event]) {
      return;
    }
    this.events[event].forEach(callback => callback(data));
  }
};

// Beispiel für die Verwendung
// Komponente 1 abonniert ein Ereignis
eventBus.subscribe('kundendaten-aktualisiert', function(data) {
  // Aktualisiere die Komponente mit den neuen Daten
  updateComponent1(data);
});

// Komponente 2 veröffentlicht ein Ereignis
function saveCustomerData(data) {
  // Speichere die Daten
  saveData(data);
  
  // Benachrichtige andere Komponenten
  eventBus.publish('kundendaten-aktualisiert', data);
}
```

## Schalter für 13. AHV-Rente

Der Schalter für die 13. AHV-Rente beeinflusst alle Berechnungen, die mit der AHV-Rente zusammenhängen:

```javascript
// Globale Variable für die 13. AHV-Rente
let include13thAHVRente = true; // Standardmäßig eingeschaltet

// Funktion zum Umschalten der 13. AHV-Rente
function toggle13thAHVRente(include) {
  include13thAHVRente = include;
  
  // Veröffentliche ein Ereignis, um alle betroffenen Komponenten zu aktualisieren
  eventBus.publish('13-ahv-rente-geändert', include);
  
  // Aktualisiere alle Berechnungen
  recalculateAll();
}

// Abonniere das Ereignis in den betroffenen Komponenten
eventBus.subscribe('13-ahv-rente-geändert', function(include) {
  // Aktualisiere die Vorsorgeplanung
  updateRetirementPlanning(include);
  
  // Aktualisiere die Steueroptimierung
  updateTaxOptimization(include);
  
  // Aktualisiere den Maßnahmenplan
  updateActionPlan(include);
});
```

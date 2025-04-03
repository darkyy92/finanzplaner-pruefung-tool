# Finanzplaner-Tool - Dokumentation

## Übersicht

Das Finanzplaner-Tool ist eine umfassende Anwendung zur Finanzplanung, die speziell für die Vorbereitung auf die Finanzplaner-Prüfung mit eidgenössischem Fachausweis im Juni 2025 entwickelt wurde. Das Tool unterstützt bei der Berechnung und Optimierung aller relevanten Aspekte der Finanzplanung, einschließlich Vorsorgeplanung, Steueroptimierung, Vermögensallokation und Liquiditätsplanung.

Ein besonderes Merkmal des Tools ist die Integration der 13. AHV-Rente, die ab 2026 in der Schweiz eingeführt wird. Mit einem speziellen Schalter können Berechnungen wahlweise mit oder ohne Berücksichtigung der 13. AHV-Rente durchgeführt werden.

## Hauptkomponenten

Das Tool besteht aus folgenden Hauptkomponenten:

1. **Kundenprofil**: Erfassung der persönlichen Daten und Ziele des Kunden
2. **Ist-Analyse**: Erfassung der aktuellen finanziellen Situation (Einkommen, Ausgaben, Vermögen, Schulden)
3. **Vorsorgeplanung**: Berechnung der Leistungen aus der 1., 2. und 3. Säule
4. **Steueroptimierung**: Berechnung von Steuerersparnissen durch verschiedene Maßnahmen
5. **Anlagekonzept**: Bestimmung der optimalen Vermögensallokation basierend auf dem Risikoprofil
6. **Immobilienfinanzierung**: Berechnung der Tragbarkeit und Finanzierungsoptionen
7. **Nachlass- und Vorsorgeplanung**: Planung der Vermögensnachfolge und Vorsorgeaufträge
8. **Maßnahmenplan**: Zusammenfassung der empfohlenen Maßnahmen
9. **Dokumentation**: Erstellung von Berichten und Checklisten

## Berechnungsmodule

Das Tool enthält folgende Berechnungsmodule:

### 1. Vorsorgeberechnungen (calculations_updated_fixed2.js)

- AHV-Rentenberechnung mit und ohne 13. AHV-Rente
- Pensionskassenberechnung (Altersguthaben und Rente)
- Säule 3a-Berechnung
- Gesamtvorsorgesituation und Ersatzquote

**Hinweis zur 13. AHV-Rente**: Die 13. AHV-Rente wird ab 2026 eingeführt und entspricht einer zusätzlichen Monatsrente pro Jahr. Im Tool kann diese Funktion über einen Schalter aktiviert oder deaktiviert werden.

**Bekannte Einschränkungen**: 
- Die AHV-Rentenberechnung für Ehepaare (Plafonierung) und Personen mit niedrigem Einkommen weicht in einigen Fällen von den erwarteten Werten ab. In der Praxis sollten die genauen Werte mit der AHV-Ausgleichskasse überprüft werden.
- Die Berechnung basiert auf vereinfachten Formeln und berücksichtigt nicht alle individuellen Faktoren, die in der Praxis relevant sein können.

### 2. Steueroptimierung (calculations_steueroptimierung.js)

- Detaillierte Einkommenssteuerberechnung für den Kanton Bern
- Berechnung der Steuerersparnis durch Einkäufe in die Pensionskasse
- Optimale Einkaufsstrategie in die Pensionskasse
- Steuerersparnis durch Säule 3a-Einzahlungen
- Steuervorteile durch gestaffelte Bezüge aus der Säule 3a
- Steuerersparnis durch Immobilienrenovationen

### 3. Vermögensallokation (calculations_vermoegensallokation.js)

- Risikoprofilbestimmung basierend auf Fragebogen
- Optimale Vermögensallokation nach Anlageklassen
- Erwartete Rendite- und Risikoberechnung
- Vermögensentwicklungsprognosen mit Monte-Carlo-Simulation
- Optimale Aktienallokation (Schweiz vs. International)

### 4. Liquiditätsplanung (calculations_liquiditaetsplanung.js)

- Cashflow-Analyse und Notfallreservenberechnung
- Liquiditätsplanung für beliebige Zeiträume
- Identifikation von Liquiditätsengpässen
- Auswirkungen von großen Ausgaben auf die Liquidität
- Optimale Finanzierungsstrategien für große Anschaffungen

## Benutzeroberfläche

Die Benutzeroberfläche des Tools ist in HTML und JavaScript implementiert und bietet folgende Funktionen:

- Navigation zwischen den verschiedenen Komponenten
- Formulare zur Dateneingabe
- Berechnungsergebnisse und Visualisierungen
- Schalter für die 13. AHV-Rente
- Speicherung und Wiederherstellung von Benutzerdaten

### 13. AHV-Renten-Schalter

Der Schalter für die 13. AHV-Rente befindet sich im oberen Bereich der Benutzeroberfläche und kann jederzeit aktiviert oder deaktiviert werden. Bei Änderung des Schalters werden alle Berechnungen automatisch aktualisiert.

- **Aktiviert**: Die 13. AHV-Rente wird in den Berechnungen berücksichtigt (ab 2026)
- **Deaktiviert**: Die 13. AHV-Rente wird in den Berechnungen nicht berücksichtigt

## Verwendung des Tools

### Installation und Start

1. Laden Sie das Tool herunter und entpacken Sie es in einem beliebigen Verzeichnis
2. Öffnen Sie die Datei `index.html` in einem modernen Webbrowser
3. Das Tool wird im Browser geladen und ist sofort einsatzbereit

### Dateneingabe

1. Navigieren Sie durch die verschiedenen Komponenten des Tools
2. Geben Sie die erforderlichen Daten in die Formulare ein
3. Klicken Sie auf "Berechnen", um die Ergebnisse anzuzeigen

### Verwendung des 13. AHV-Renten-Schalters

1. Aktivieren oder deaktivieren Sie den Schalter je nach gewünschtem Szenario
2. Alle Berechnungen werden automatisch aktualisiert
3. Vergleichen Sie die Ergebnisse mit und ohne 13. AHV-Rente

## Technische Details

Das Tool wurde mit folgenden Technologien entwickelt:

- HTML5 und CSS3 für die Benutzeroberfläche
- JavaScript für die Berechnungslogik und Interaktivität
- Modularer Aufbau für einfache Erweiterbarkeit

Die Berechnungen basieren auf den aktuellen Werten für 2025:

- AHV-Minimalrente: 1'260 CHF pro Monat
- AHV-Maximalrente: 2'520 CHF pro Monat
- AHV-Ehepaar-Maximalrente: 3'780 CHF pro Monat (150% der Maximalrente)
- BVG-Mindestzinssatz: 1%
- BVG-Umwandlungssatz: 6.8%
- BVG-Koordinationsabzug: 26'460 CHF
- BVG-Eintrittsschwelle: 22'680 CHF
- BVG-Maximal versicherter Lohn: 90'720 CHF
- Säule 3a-Maximalbeitrag mit PK: 7'258 CHF
- Säule 3a-Maximalbeitrag ohne PK: 36'288 CHF

## Weiterentwicklung

Das Tool kann in folgenden Bereichen weiterentwickelt werden:

1. Verbesserung der AHV-Rentenberechnung für Ehepaare und Personen mit niedrigem Einkommen
2. Integration weiterer Kantone für die Steuerberechnung
3. Erweiterung der Immobilienfinanzierungskomponente
4. Verbesserung der Benutzeroberfläche und Benutzerfreundlichkeit
5. Implementierung von Datenexport- und Importfunktionen

## Fazit

Das Finanzplaner-Tool bietet eine umfassende Lösung für die Finanzplanung und ist besonders nützlich für die Vorbereitung auf die Finanzplaner-Prüfung mit eidgenössischem Fachausweis. Mit der Integration der 13. AHV-Rente ist das Tool zukunftssicher und ermöglicht die Berechnung verschiedener Szenarien für die Vorsorgeplanung.

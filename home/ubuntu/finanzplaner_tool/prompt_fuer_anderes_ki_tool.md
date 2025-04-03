# Prompt für ein anderes KI-Tool zur Fertigstellung des Finanzplaner-Tools

## Projektkontext

Ich habe ein Finanzplaner-Tool für die Vorbereitung auf die eidgenössische Fachprüfung zum Finanzplaner/in mit eidg. Fachausweis im Juni 2025 entwickelt. Das Tool ist bereits funktionsfähig und unter https://srgzjbuh.manus.space deployed.

Das Tool bietet folgende Hauptfunktionen:
- Erfassung von Kundendaten und finanzieller Situation
- Vorsorgeplanung mit einem Schalter für die 13. AHV-Rente (ab 2026)
- Steueroptimierung für den Kanton Bern
- Vermögensallokation basierend auf Risikoprofil
- Liquiditätsplanung und Immobilienfinanzierung
- Nachlass- und Vorsorgeplanung
- Maßnahmenplan und Dokumentation

## Aktueller Stand

Die Grundstruktur, Berechnungsmodule und Benutzeroberfläche sind implementiert. Das Tool verwendet aktuelle Werte für 2025 und bietet einen Schalter für die 13. AHV-Rente. Die Dokumentation ist erstellt und das Tool ist öffentlich zugänglich.

## Aufgaben zur Fertigstellung

Ich benötige Unterstützung bei folgenden Aufgaben:

1. **Verbesserung der AHV-Rentenberechnung**:
   - Die Berechnung für Ehepaare (Plafonierung) und Personen mit niedrigem Einkommen weicht von den erwarteten Werten ab
   - Implementiere eine präzisere Berechnungslogik basierend auf den offiziellen AHV-Formeln

2. **Erweiterung der Steuerberechnungen**:
   - Füge weitere Kantone zur Steuerberechnung hinzu (aktuell nur Bern)
   - Implementiere eine detailliertere Steuerberechnung mit Berücksichtigung von Abzügen

3. **Verbesserung der Benutzeroberfläche**:
   - Füge Visualisierungen für Vermögensentwicklung und Vorsorgesituation hinzu
   - Verbessere die Responsivität für verschiedene Bildschirmgrößen
   - Implementiere eine Druckfunktion für Berichte

4. **Datenvalidierung und Fehlerbehandlung**:
   - Füge Validierung für Benutzereingaben hinzu
   - Implementiere Fehlerbehandlung für ungültige Eingaben
   - Füge Hilfetexte und Tooltips hinzu

5. **Erweiterung der Dokumentation**:
   - Erstelle detaillierte Beispielfälle mit Lösungen
   - Füge Erklärungen zu den Berechnungsformeln hinzu
   - Erstelle ein FAQ für häufig gestellte Fragen

## Technische Details

Das Tool verwendet folgende Technologien:
- HTML5 und CSS3 für die Benutzeroberfläche
- JavaScript für die Berechnungslogik
- Modularer Aufbau mit separaten Dateien für verschiedene Funktionen

Die wichtigsten Dateien sind:
- `index.html`: Hauptdatei mit HTML-Struktur
- `ui.js`: Benutzeroberfläche und Interaktionslogik
- `calculations.js`: Hauptberechnungsmodul mit AHV-Rentenberechnung
- `calculations_steueroptimierung.js`: Steueroptimierungsberechnungen
- `calculations_vermoegensallokation.js`: Vermögensallokationsberechnungen
- `calculations_liquiditaetsplanung.js`: Liquiditätsplanungsberechnungen
- `dokumentation.md`: Technische Dokumentation
- `benutzerhandbuch.md`: Benutzerhandbuch

## Anforderungen an die Lösung

Die Lösung sollte:
- Die bestehende Struktur und Namenskonventionen beibehalten
- Gut dokumentierten und wartbaren Code liefern
- Die Berechnungen auf die aktuellen Werte für 2025 basieren
- Die 13. AHV-Rente korrekt berücksichtigen
- Offline-Funktionalität beibehalten (keine externen Abhängigkeiten)
- Benutzerfreundlich und intuitiv sein

## Erwartete Lieferumfang

- Verbesserte JavaScript-Dateien mit den implementierten Funktionen
- Aktualisierte HTML- und CSS-Dateien für die verbesserte Benutzeroberfläche
- Erweiterte Dokumentation mit Beispielfällen und Erklärungen
- Testfälle zur Validierung der Berechnungen

## Zusätzliche Informationen

Die 13. AHV-Rente wird ab 2026 in der Schweiz eingeführt und entspricht einer zusätzlichen Monatsrente pro Jahr. Im Tool kann diese Funktion über einen Schalter aktiviert oder deaktiviert werden.

Die aktuellen Werte für 2025 sind:
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

# Formelsammellung und Berechnungsgrundlagen

Dieses Dokument erklärt die wichtigsten Formeln und Berechnungsmethoden, die im Finanzplaner-Tool verwendet werden. Die Berechnungen basieren auf den aktuellen Werten und Regelungen für das Jahr 2025, insbesondere für den Kanton Bern.

## Inhaltsverzeichnis

1. [AHV-Rentenberechnung](#ahv-rentenberechnung)
2. [13. AHV-Rente](#13-ahv-rente)
3. [BVG-Berechnung](#bvg-berechnung)
4. [Steuerberechnung Kanton Bern](#steuerberechnung-kanton-bern)
5. [Tragbarkeitsberechnung für Immobilien](#tragbarkeitsberechnung-für-immobilien)
6. [Vermögensallokation und Renditeberechnung](#vermögensallokation-und-renditeberechnung)
7. [Steueroptimierung](#steueroptimierung)

## AHV-Rentenberechnung

### Formel für die AHV-Rentenberechnung

Die AHV-Rente wird hauptsächlich auf Basis des durchschnittlichen Jahreseinkommens und der Beitragsdauer berechnet:

```
Wenn averageIncome <= 14'700 CHF:
  Rente = AHVminimumRente * (Beitragsjahre / 44)

Wenn averageIncome >= 88'200 CHF:
  Rente = AHVmaximumRente * (Beitragsjahre / 44)

Sonst:
  Rentenfaktor = (averageIncome - 14'700) / (88'200 - 14'700)
  Vollrente = AHVminimumRente + Rentenfaktor * (AHVmaximumRente - AHVminimumRente)
  Rente = Vollrente * (Beitragsjahre / 44)
```

Wobei:
- **AHVminimumRente** = 1'260 CHF/Monat (2025)
- **AHVmaximumRente** = 2'520 CHF/Monat (2025)
- **Beitragsjahre** = Anzahl Jahre mit AHV-Beiträgen (max. 44)
- **averageIncome** = Durchschnittliches Jahreseinkommen über die gesamte Beitragszeit

### Ehepaarplafonierung

Für verheiratete Paare gilt die Plafonierung auf 150% der Maximalrente:

```
Kombinierte Rente = Rente Person 1 + Rente Person 2
Wenn Kombinierte Rente > AHVehepaarMaximum:
  Reduktionsfaktor = AHVehepaarMaximum / Kombinierte Rente
  Angepasste Rente Person 1 = Rente Person 1 * Reduktionsfaktor
  Angepasste Rente Person 2 = Rente Person 2 * Reduktionsfaktor
```

Wobei:
- **AHVehepaarMaximum** = 3'780 CHF/Monat (2025, entspricht 150% der Maximalrente)

### Referenzalter

Mit der AHV-Reform 21 gilt:
- Männer: Referenzalter 65 Jahre (unverändert)
- Frauen: Gestaffelte Anhebung
  - Jahrgang 1961: 64 Jahre und 3 Monate
  - Jahrgang 1962: 64 Jahre und 6 Monate
  - Jahrgang 1963: 64 Jahre und 9 Monate
  - Ab Jahrgang 1964: 65 Jahre

### Vorbezug und Aufschub

Bei Abweichung vom Referenzalter wird die Rente angepasst:

```
Vorbezug (maximal 3 Jahre):
  Rentenkürzung pro Jahr = 6.8% (0.56667% pro Monat)

Aufschub (maximal 5 Jahre):
  Rentenzuschlag für:
  - 1 Jahr: 5.2%
  - 2 Jahre: 10.8%
  - 3 Jahre: 17.1%
  - 4 Jahre: 24.0%
  - 5 Jahre: 31.5%
```

## 13. AHV-Rente

Ab 2026 wird eine 13. AHV-Rente ausbezahlt. Diese entspricht dem Betrag einer normalen Monatsrente:

```
13. AHV-Rente = Monatliche AHV-Rente
Jährliche AHV-Rente mit 13. Rente = (Monatliche AHV-Rente * 12) + 13. AHV-Rente
```

## BVG-Berechnung

### Umwandlungssatz und BVG-Rente

Die jährliche BVG-Rente wird wie folgt berechnet:

```
Jährliche BVG-Rente = BVG-Alterskapital * Umwandlungssatz
```

Wobei:
- **Umwandlungssatz** = 6.8% für den obligatorischen Teil (2025)
- **BVG-Alterskapital** = Angespartes Kapital in der Pensionskasse zum Zeitpunkt der Pensionierung

### Verzinsung des BVG-Guthabens

```
BVG-Kapital(Ende Jahr) = BVG-Kapital(Anfang Jahr) * (1 + BVG-Mindestzinssatz) + Jahresbeiträge
```

Wobei:
- **BVG-Mindestzinssatz** = 1.25% (2025)

## Steuerberechnung Kanton Bern

### Steuerbare Einkommen

Das steuerbare Einkommen ergibt sich nach Abzug verschiedener Positionen vom Bruttoeinkommen:

```
Steuerbares Einkommen = Bruttoeinkommen 
                      - Berufskosten 
                      - Versicherungsabzüge
                      - persönliche Abzüge 
                      - Kinderabzüge
                      - weitere Abzüge (Säule 3a, PK-Einkauf, etc.)
```

### Steuersätze (Kanton Bern 2025)

Für Einzelpersonen:
```
0 - 18'800 CHF: 0.00%
18'801 - 33'800 CHF: 8.00% + Grundbetrag 0 CHF
33'801 - 45'200 CHF: 15.00% + Grundbetrag 1'200 CHF
45'201 - 60'300 CHF: 22.00% + Grundbetrag 2'910 CHF
60'301 - 78'200 CHF: 26.00% + Grundbetrag 6'232 CHF
78'201 - 105'500 CHF: 30.00% + Grundbetrag 10'906 CHF
105'501 - 137'600 CHF: 34.00% + Grundbetrag 19'096 CHF
137'601 - 180'500 CHF: 37.00% + Grundbetrag 30'010 CHF
180'501 - 608'400 CHF: 39.00% + Grundbetrag 45'943 CHF
über 608'400 CHF: 40.00% + Grundbetrag 212'789 CHF
```

Für Verheiratete:
```
0 - 37'700 CHF: 0.00%
37'701 - 67'700 CHF: 8.00% + Grundbetrag 0 CHF
67'701 - 90'500 CHF: 15.00% + Grundbetrag 2'400 CHF
90'501 - 120'700 CHF: 22.00% + Grundbetrag 5'820 CHF
120'701 - 156'500 CHF: 26.00% + Grundbetrag 12'464 CHF
156'501 - 211'100 CHF: 30.00% + Grundbetrag 21'812 CHF
211'101 - 275'300 CHF: 34.00% + Grundbetrag 38'192 CHF
275'301 - 361'100 CHF: 37.00% + Grundbetrag 60'020 CHF
361'101 - 1'216'900 CHF: 39.00% + Grundbetrag 91'886 CHF
über 1'216'900 CHF: 40.00% + Grundbetrag 425'578 CHF
```

### Berechnungsformel

```
Steuer = Grundbetrag + (Steuerbares Einkommen - Untergrenze Stufe) * Steuersatz
```

## Tragbarkeitsberechnung für Immobilien

### Kalkulatorische Kosten

```
Kalkulatorische Kosten = (Hypothek * Kalkulatorischer Zinssatz) + Unterhaltskosten + Nebenkosten
```

Wobei:
- **Kalkulatorischer Zinssatz** = 5.0% (unabhängig vom aktuellen Zinssatz)
- **Unterhaltskosten** = 1.0% des Immobilienwertes
- **Nebenkosten** = 1.0% des Immobilienwertes

### Tragbarkeitsquote

```
Tragbarkeitsquote = Kalkulatorische Kosten / Jährliches Bruttoeinkommen
```

Beurteilungskriterien:
- **Optimal**: ≤ 28%
- **Akzeptabel**: ≤ 33%
- **Kritisch**: > 33%

## Vermögensallokation und Renditeberechnung

### Erwartete Rendite basierend auf Anlageklassen

```
Erwartete Rendite = (Anteil_Liquidität * Rendite_Liquidität) +
                  (Anteil_Obligationen * Rendite_Obligationen) +
                  (Anteil_Aktien * Rendite_Aktien) +
                  (Anteil_Immobilien * Rendite_Immobilien) +
                  (Anteil_AlternativeAnlagen * Rendite_AlternativeAnlagen)
```

Wobei (Annahmen für 2025):
- **Rendite_Liquidität** = 0.5%
- **Rendite_Obligationen** = 2.0%
- **Rendite_Aktien** = 6.0%
- **Rendite_Immobilien** = 4.0%
- **Rendite_AlternativeAnlagen** = 5.0%

### Zukünftiger Wert

```
Zukünftiger Wert = Anlagebetrag * (1 + Erwartete Rendite)^Anlagezeitraum
```

### Allokation nach Risikoprofilen

| Anlageklasse | Konservativ | Ausgewogen | Wachstumsorientiert | Chancenorientiert |
|--------------|-------------|------------|---------------------|-------------------|
| Liquidität   | 15%         | 10%        | 5%                  | 5%                |
| Obligationen | 55%         | 40%        | 25%                 | 10%               |
| Aktien       | 20%         | 30%        | 45%                 | 60%               |
| Immobilien   | 10%         | 15%        | 15%                 | 15%               |
| Alternative  | 0%          | 5%         | 10%                 | 10%               |

## Steueroptimierung

### Steuerersparnis durch Säule 3a Einzahlung

```
Steuerersparnis = Einzahlungsbetrag * Grenzsteuersatz
```

Wobei (für 2025):
- **Maximaler Einzahlungsbetrag mit PK** = 7'258 CHF
- **Maximaler Einzahlungsbetrag ohne PK** = 36'288 CHF (20% des Erwerbseinkommens)

### Steuerersparnis durch Einkauf in die Pensionskasse

```
Steuerersparnis = Einkaufsbetrag * Grenzsteuersatz
```

### Optimale Strategie für Pensionskassen-Einkauf

Für den optimalen Steuervorteil werden zwei Strategien verglichen:

1. **Gleichmäßige Verteilung**: Der Gesamteinkaufsbetrag wird gleichmäßig über die Jahre bis zur Pensionierung verteilt.
2. **Maximaler Einkauf im ersten Jahr**: Ein Großteil des Einkaufsbetrags wird sofort einbezahlt (maximal 70% des steuerbaren Einkommens), der Rest wird gleichmäßig über die restlichen Jahre verteilt.

Die Strategie mit der höheren Gesamtsteuerersparnis wird empfohlen.

### Steuerersparnis durch gestaffelte Bezüge aus der Säule 3a

```
Steuerersparnis = (Steuer bei Einmalbezug) - (Summe der Steuern bei gestaffelten Bezügen)
```

Die gestaffelten Bezüge werden auf mehrere Jahre verteilt, um die Progression zu brechen.
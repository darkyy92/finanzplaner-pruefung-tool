/**
 * Constants for Swiss financial planning values in 2025
 * Based on the VALUES_2025 object in the original calculations.js
 */

export const VALUES_2025 = {
  // AHV values
  ahvMinimumRente: 1260, // CHF per month
  ahvMaximumRente: 2520, // CHF per month
  ahvEhepaarMaximum: 3780, // CHF per month (150% of max pension)
  
  // BVG values
  bvgMindestzinssatz: 0.0125, // 1.25%
  bvgUmwandlungssatz: 0.068, // 6.8% for mandatory part
  bvgKoordinationsabzug: 26460, // CHF
  bvgEintrittsschwelle: 22680, // CHF
  bvgVersicherterLohnMax: 90720, // CHF
  
  // Pillar 3a
  saeule3aMaxEinzahlungMitPK: 7258, // CHF for people with pension fund
  saeule3aMaxEinzahlungOhnePK: 36288, // CHF for people without pension fund
  
  // Tax values for Canton Bern
  steuerBernGrenzsteuersatzMax: 0.4142, // 41.42% maximum marginal tax rate
  
  // Mortgage interest
  hypothekarZinsKalkulatorisch: 0.05, // 5% for affordability calculation
  
  // Inflation rate
  inflation: 0.01, // 1% p.a.
};

export const TAX_RATES_BERN = {
  single: [
    { limit: 0, base: 0, rate: 0.00 },
    { limit: 18800, base: 0, rate: 0.08 },
    { limit: 33800, base: 1200, rate: 0.15 },
    { limit: 45200, base: 2910, rate: 0.22 },
    { limit: 60300, base: 6232, rate: 0.26 },
    { limit: 78200, base: 10906, rate: 0.30 },
    { limit: 105500, base: 19096, rate: 0.34 },
    { limit: 137600, base: 30010, rate: 0.37 },
    { limit: 180500, base: 45943, rate: 0.39 },
    { limit: 608400, base: 212789, rate: 0.40 },
    { limit: Infinity, base: 212789, rate: 0.41 }
  ],
  married: [
    { limit: 0, base: 0, rate: 0.00 },
    { limit: 37700, base: 0, rate: 0.08 },
    { limit: 67700, base: 2400, rate: 0.15 },
    { limit: 90500, base: 5820, rate: 0.22 },
    { limit: 120700, base: 12464, rate: 0.26 },
    { limit: 156500, base: 21812, rate: 0.30 },
    { limit: 211100, base: 38192, rate: 0.34 },
    { limit: 275300, base: 60020, rate: 0.37 },
    { limit: 361100, base: 91886, rate: 0.39 },
    { limit: 1216900, base: 425578, rate: 0.40 },
    { limit: Infinity, base: 425578, rate: 0.41 }
  ]
};

export interface TaxBracket {
  limit: number;
  base: number;
  rate: number;
}

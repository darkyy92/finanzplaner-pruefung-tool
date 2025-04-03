# Swiss Financial Planner Exam Tool

## Overview

A comprehensive web-based financial planning application specifically designed to prepare for the Swiss "Finanzplaner mit eidgenössischem Fachausweis" examination in June 2025. The tool features client-side calculation capabilities for various aspects of Swiss financial planning, including:

- Pension planning with 13th AHV pension support
- Tax optimization for Canton Bern
- Asset allocation
- Liquidity planning
- Estate planning

## Key Features

- Toggle calculations with or without the "13. AHV-Rente" (introduced in Switzerland from 2026)
- Comprehensive tax calculations for Canton Bern
- Financial planning according to Swiss standards
- Step-by-step guidance through the financial planning process
- Detailed documentation of calculation methods and assumptions

## Project Structure

- `/home/ubuntu/finanzplaner_tool/` - Main application directory
  - Core HTML files (`index.html`, `index_browser.html`)
  - JavaScript calculation modules (`calculations_*.js`)
  - UI handling (`ui.js`, `ui_browser.js`, `ui_updated.js`)
  - Documentation in Markdown format (`*.md`)
  - `/analyse/` - Analysis documents and requirements
  - `/backup/` - Previous versions of key files

## How to Use

1. Open `index.html` in a modern web browser
2. Navigate through different sections using the menu
3. Input required data in the forms
4. Click "Berechnen" to display results
5. Toggle the 13th AHV pension switch to compare different scenarios

## Documentation

- `benutzerhandbuch.md` - User manual
- `dokumentation.md` - Technical documentation
- `formelerklaerungen.md` - Formula explanations
- `faq.md` - Frequently asked questions
- `beispiel_fallstudie.md` - Example case study

## Development Status

This tool is currently in Phase 2 refinement, focusing on:
- Enhanced Canton Bern tax calculations
- Improved validation and user experience
- Expanded documentation

## Examination Context

Specifically designed for preparing for the Swiss "Finanzplaner mit eidgenössischem Fachausweis" examination in June 2025, this tool focuses on accurate calculations based on 2025 values and recent regulatory changes, including the 13th AHV pension.

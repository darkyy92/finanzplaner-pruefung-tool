# Swiss Financial Planner Tool Migration Project

## Project Overview
Migrate the existing Swiss Financial Planner Tool from vanilla HTML/CSS/JS to a modern tech stack:
- **Build Tool:** Vite
- **UI Library:** React
- **Language:** TypeScript
- **Styling:** Tailwind CSS

**CRITICAL REQUIREMENT:** The final built application must function completely offline.

## 📋 Todo List

### 1. Initial Project Setup
- [x] Initialize Vite project with React-TS template
- [x] Install and configure Tailwind CSS
- [x] Set up project structure (components, hooks, utils, types folders)
- [x] Configure TypeScript (tsconfig.json)
- [x] Add basic Vite configuration for offline compatibility
- [x] Verify development environment works correctly

### 2. Initial Analysis & Planning
- [ ] Review existing file structure and document dependencies
- [ ] Identify key forms and UI components from index.html
- [ ] Map out data flow from current forms to calculation functions
- [ ] Document state management requirements
- [ ] Create component hierarchy diagram 
- [ ] Identify reusable components vs page-specific components

### 3. Core Types & Models (TypeScript)
- [ ] Define customer profile data types
- [ ] Define financial data input types
- [ ] Define calculation result types
- [ ] Define application state interfaces
- [ ] Create type definitions for utility functions

### 4. Utility Functions Migration
- [ ] Convert excel_functions.js to TypeScript
- [ ] Add proper typing to all utility functions
- [ ] Create test cases to verify function equivalence
- [ ] Document any function modifications

### 5. Core Calculation Logic Migration
- [ ] Convert calculations_steueroptimierung.js to TypeScript
- [ ] Convert calculations_liquiditaetsplanung.js to TypeScript
- [ ] Convert calculations_vermoegensallokation.js to TypeScript
- [ ] Convert other calculation modules to TypeScript
- [ ] Add comprehensive type definitions to all calculation functions
- [ ] Verify calculation output matches original code

### 6. React Component Creation
- [ ] Create application layout & navigation components
- [ ] Build form components for customer profile
- [ ] Build form components for financial inputs
- [ ] Create result display components
- [ ] Implement 13th AHV pension toggle component
- [ ] Develop error/validation message components
- [ ] Create any additional UI components needed

### 7. State Management
- [ ] Implement form state management with React hooks
- [ ] Create context/providers for shared application state
- [ ] Implement local storage persistence
- [ ] Set up form validation system
- [ ] Connect calculation functions to React state

### 8. Styling with Tailwind
- [ ] Create base style foundations (colors, typography, etc.)
- [ ] Style navigation and layout components
- [ ] Style form components
- [ ] Style results display components
- [ ] Ensure responsive design
- [ ] Implement print styles if needed

### 9. Integration & Testing
- [ ] Connect all components to form the complete application
- [ ] Test all calculation flows with sample data
- [ ] Verify all existing functionality works as expected
- [ ] Test with various screen sizes for responsiveness
- [ ] Test offline functionality in development mode

### 10. Build & Deployment
- [ ] Optimize Vite build configuration
- [ ] Create production build
- [ ] Test production build offline functionality
- [ ] Verify all features work in production build
- [ ] Create detailed README with instructions

### 11. Documentation
- [ ] Document component structure
- [ ] Document state management approach
- [ ] Update any existing documentation to reflect new implementation
- [ ] Create developer guide for future maintenance

## 🔄 In Progress
- Analyzing existing code structure and planning componentization
- Starting to migrate utility functions to TypeScript

## ✅ Completed Tasks
- Set up initial Vite project with React-TypeScript template
- Configure Tailwind CSS and PostCSS
- Create basic project structure with necessary folders
- Set up Vite configuration for offline compatibility
- Create initial TypeScript interfaces for data models

## Notes
- All development must ensure offline functionality remains intact
- The migrated application must produce identical calculation results
- Focus on maintaining the same user experience while improving code quality
- Canton Bern calculations and 2025 Swiss financial parameters must remain correct

Last Updated: 2025-04-03

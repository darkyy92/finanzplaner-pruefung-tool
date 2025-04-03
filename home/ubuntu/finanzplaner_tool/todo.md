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
- [x] Review existing file structure and document dependencies
- [x] Identify key forms and UI components from index.html
- [x] Map out data flow from current forms to calculation functions
- [x] Document state management requirements
- [x] Create component hierarchy diagram 
- [x] Identify reusable components vs page-specific components

### 3. Core Types & Models (TypeScript)
- [x] Define customer profile data types (KundenDaten interface)
- [x] Define calculation result types (BerechnungsErgebnisse interface)
- [x] Define form state interfaces for each section
- [x] Define application state interface
- [x] Create type definitions for utility functions
- [x] Define event types for state updates

### 4. State Management Implementation
- [x] Create Context provider for global application state
- [x] Implement customer data state and reducers
- [x] Implement calculation results state and reducers
- [x] Create 13th AHV pension toggle context
- [x] Implement local storage persistence
- [x] Create custom hooks for accessing and updating state

### 5. Utility Functions Migration
- [ ] Convert excel_functions.js to TypeScript
- [ ] Add proper typing to all utility functions
- [ ] Create test cases to verify function equivalence
- [ ] Document any function modifications

### 6. Core Calculation Logic Migration
- [ ] Convert calculations module main structure to TypeScript
- [ ] Migrate AHV calculation functions
- [ ] Convert calculations_steueroptimierung.js to TypeScript
- [ ] Convert calculations_liquiditaetsplanung.js to TypeScript
- [ ] Convert calculations_vermoegensallokation.js to TypeScript
- [ ] Add comprehensive type definitions to all calculation functions
- [ ] Verify calculation output matches original code

### 7. Layout & Navigation Components
- [x] Create application layout component (Layout.tsx)
- [x] Build navigation menu component (Navigation.tsx)
- [x] Implement section visibility management
- [x] Create 13th AHV pension toggle component
- [x] Build app header with controls
- [x] Create form action buttons (back, next, calculate)

### 8. Form Components Implementation
- [x] Create base form component with validation support
- [x] Build customer profile form component
- [ ] Build current situation form component
- [ ] Build retirement planning form component
- [ ] Build tax optimization form component
- [ ] Build investment concept form component
- [ ] Build real estate financing form component
- [ ] Build estate planning form component
- [ ] Build action plan form component
- [ ] Implement form validation logic

### 9. Results & Summary Components
- [x] Create summary box component template
- [x] Build customer profile summary component
- [ ] Build retirement planning results component
- [ ] Build tax optimization results component
- [ ] Build investment concept results component
- [ ] Build real estate results component

### 10. Styling with Tailwind
- [x] Create base style foundations (colors, typography, etc.)
- [x] Style navigation and layout components
- [x] Style form components and inputs
- [ ] Style results display components
- [x] Style toggle switches and buttons
- [ ] Ensure responsive design
- [ ] Implement print styles

### 11. Integration & Testing
- [ ] Connect all components to form the complete application
- [ ] Test form submission and data flow
- [ ] Test calculation functions with sample data
- [ ] Verify 13th AHV pension toggle functionality
- [ ] Test localStorage persistence
- [ ] Test all navigation paths
- [ ] Verify all existing functionality works as expected

### 12. Build & Deployment
- [ ] Optimize Vite build configuration
- [ ] Create production build
- [ ] Test production build offline functionality
- [ ] Verify all features work in production build
- [ ] Create detailed README with instructions

### 13. Documentation
- [ ] Document component structure
- [ ] Document state management approach
- [ ] Update any existing documentation to reflect new implementation
- [ ] Create developer guide for future maintenance

## 🔄 In Progress
- Developing remaining form components
- Migration of calculation functions

## ✅ Completed Tasks
- Set up initial Vite project with React-TypeScript template
- Configure Tailwind CSS and PostCSS
- Create basic project structure with necessary folders
- Set up Vite configuration for offline compatibility
- Initial analysis of the existing codebase structure
- Mapped the data flow between components
- Created TypeScript interfaces for all data models
- Implemented state management with React Context
- Created core layout and navigation components
- Implemented the 13th AHV pension toggle functionality
- Created reusable form components with validation
- Implemented the Introduction and Customer Profile sections
- Set up form validation and error handling

## Notes
- All development must ensure offline functionality remains intact
- The migrated application must produce identical calculation results
- Focus on maintaining the same user experience while improving code quality
- Canton Bern calculations and 2025 Swiss financial parameters must remain correct

Last Updated: 2025-04-03

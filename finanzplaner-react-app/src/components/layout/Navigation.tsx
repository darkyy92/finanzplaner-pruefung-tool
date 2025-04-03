import { useAppState } from '../../context/AppContext';
import { AppSection } from '../../types';

interface NavigationProps {
  currentSection: AppSection;
}

export function Navigation({ currentSection }: NavigationProps) {
  const { dispatch, state } = useAppState();
  
  // Define navigation items
  const navItems: { id: AppSection; label: string }[] = [
    { id: 'intro', label: 'Einführung' },
    { id: 'customer-profile', label: 'Kundenprofil' },
    { id: 'current-situation', label: 'Ist-Analyse' },
    { id: 'retirement-planning', label: 'Vorsorgeplanung' },
    { id: 'tax-optimization', label: 'Steueroptimierung' },
    { id: 'investment-concept', label: 'Anlagekonzept' },
    { id: 'real-estate', label: 'Immobilienfinanzierung' },
    { id: 'estate-planning', label: 'Nachlassplanung' },
    { id: 'action-plan', label: 'Maßnahmenplan' }
  ];
  
  const handleNavClick = (section: AppSection) => {
    dispatch({ type: 'SET_CURRENT_SECTION', payload: section });
  };
  
  // Helper function to determine if a section should be accessible
  const isSectionAccessible = (sectionId: AppSection): boolean => {
    // Intro is always accessible
    if (sectionId === 'intro') return true;
    
    // Define section dependencies (which sections must be completed before accessing this one)
    const dependencies: Record<Exclude<AppSection, 'intro'>, AppSection[]> = {
      'customer-profile': ['intro'],
      'current-situation': ['intro', 'customer-profile'],
      'retirement-planning': ['intro', 'customer-profile', 'current-situation'],
      'tax-optimization': ['intro', 'customer-profile', 'current-situation', 'retirement-planning'],
      'investment-concept': ['intro', 'customer-profile', 'current-situation', 'tax-optimization'],
      'real-estate': ['intro', 'customer-profile', 'current-situation', 'investment-concept'],
      'estate-planning': ['intro', 'customer-profile', 'current-situation', 'real-estate'],
      'action-plan': ['intro', 'customer-profile', 'current-situation', 'estate-planning']
    };
    
    // Special case for intro
    if (sectionId === 'intro') return true;
    
    // Check if all dependencies are completed
    const requiredSections = dependencies[sectionId] || [];
    return requiredSections.every(dep => state.sectionStatus[dep] === 'completed');
  };

  return (
    <nav className="overflow-x-auto">
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {navItems.map((item) => {
          const isActive = currentSection === item.id;
          const isAccessible = isSectionAccessible(item.id);
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              disabled={!isAccessible}
              className={`
                px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors
                ${isActive
                  ? 'bg-blue-600 text-white'
                  : isAccessible
                    ? 'bg-white text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, AppAction, defaultAppState } from '../types';

// Create context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: defaultAppState,
  dispatch: () => null,
});

// Reducer function to handle state updates
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_SECTION':
      return {
        ...state,
        currentSection: action.payload,
      };
    
    case 'TOGGLE_13TH_AHV_RENTE':
      return {
        ...state,
        include13thAHVRente: action.payload,
      };
    
    case 'UPDATE_KUNDEN_DATEN':
      return {
        ...state,
        kundenDaten: {
          ...state.kundenDaten,
          ...action.payload,
        },
      };
    
    case 'UPDATE_BERECHNUNGS_ERGEBNISSE':
      return {
        ...state,
        berechnungsErgebnisse: {
          ...state.berechnungsErgebnisse,
          ...action.payload,
        },
      };
    
    case 'UPDATE_SECTION_STATUS':
      return {
        ...state,
        sectionStatus: {
          ...state.sectionStatus,
          [action.payload.section]: action.payload.status,
        },
      };
    
    case 'RESET_APP_STATE':
      return defaultAppState;
    
    default:
      return state;
  }
}

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage if available
  const initialState = () => {
    const savedState = localStorage.getItem('finanzplanerAppState');
    if (savedState) {
      try {
        return JSON.parse(savedState) as AppState;
      } catch (error) {
        console.error('Error parsing saved state:', error);
        return defaultAppState;
      }
    }
    return defaultAppState;
  };

  const [state, dispatch] = useReducer(appReducer, initialState());

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('finanzplanerAppState', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the AppContext
export function useAppState() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
}

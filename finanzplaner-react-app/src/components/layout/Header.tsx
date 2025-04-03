import { useAppState } from '../../context/AppContext';
import { Toggle13AHV } from '../common/Toggle13AHV';

export function Header() {
  const { state, dispatch } = useAppState();

  const handleClearData = () => {
    if (window.confirm('Sind Sie sicher, dass Sie alle gespeicherten Daten löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      // Clear state
      dispatch({ type: 'RESET_APP_STATE' });
      
      // Show confirmation
      alert('Alle Daten wurden gelöscht.');
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <h1 className="text-2xl font-bold text-blue-800 mb-4 md:mb-0">
            Finanzplaner-Tool
          </h1>
          
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <Toggle13AHV 
              checked={state.include13thAHVRente} 
              onChange={(checked) => {
                dispatch({ type: 'TOGGLE_13TH_AHV_RENTE', payload: checked });
              }}
            />
            
            <button
              onClick={handleClearData}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Alle Daten löschen
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

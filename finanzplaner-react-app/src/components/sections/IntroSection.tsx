import { SectionContainer } from '../common/SectionContainer';
import { FormActions } from '../common/FormActions';
import { useAppState } from '../../context/AppContext';

export function IntroSection() {
  const { dispatch } = useAppState();
  
  const handleContinue = () => {
    dispatch({ 
      type: 'UPDATE_SECTION_STATUS', 
      payload: { section: 'intro', status: 'completed' } 
    });
    
    dispatch({ 
      type: 'SET_CURRENT_SECTION', 
      payload: 'customer-profile' 
    });
  };
  
  return (
    <SectionContainer id="intro" title="Einführung in das Finanzplaner-Tool">
      <div className="prose max-w-none">
        <p className="text-lg">
          Willkommen zum Finanzplaner-Tool für die Vorbereitung auf die Finanzplaner-Prüfung mit
          eidgenössischem Fachausweis im Juni 2025.
        </p>
        
        <p>
          Dieses Tool unterstützt Sie bei der systematischen Finanzplanung und berücksichtigt die
          wichtigsten Aspekte der Prüfung:
        </p>
        
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li>Kundenprofil - Erfassung der persönlichen und finanziellen Situation</li>
          <li>Ist-Analyse - Bewertung der aktuellen finanziellen Lage</li>
          <li>Vorsorgeplanung - Berechnung inkl. 13. AHV-Rente (ab 2026)</li>
          <li>Steueroptimierung - Strategien zur Steuerersparnis</li>
          <li>Anlagekonzept - Vermögensallokation nach Risikoprofil</li>
          <li>Immobilienfinanzierung - Tragbarkeits- und Amortisationsberechnung</li>
          <li>Nachlassplanung - Güter- und erbrechtliche Betrachtung</li>
          <li>Maßnahmenplan - Konkrete Handlungsempfehlungen</li>
        </ul>
        
        <p className="mt-6">
          Beginnen Sie mit dem Ausfüllen des Kundenprofils, um eine fundierte Finanzplanung zu erstellen.
        </p>
      </div>
      
      <FormActions
        currentSection="intro"
        onSubmit={handleContinue}
        submitLabel="Zum Kundenprofil"
      />
    </SectionContainer>
  );
}

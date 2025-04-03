import { useState, useEffect } from 'react';
import { SectionContainer } from '../common/SectionContainer';
import { FormField } from '../common/FormField';
import { FormActions } from '../common/FormActions';
import { SummaryBox } from '../common/SummaryBox';
import { useAppState } from '../../context/AppContext';
import { Persoenlich } from '../../types';

export function CustomerProfileSection() {
  const { state, dispatch } = useAppState();
  const [formData, setFormData] = useState<Persoenlich>(state.kundenDaten.persoenlich);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSummary, setShowSummary] = useState<boolean>(state.sectionStatus['customer-profile'] === 'completed');
  
  // Update form data if global state changes
  useEffect(() => {
    setFormData(state.kundenDaten.persoenlich);
  }, [state.kundenDaten.persoenlich]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.vorname) newErrors.vorname = 'Vorname ist erforderlich';
    if (!formData.nachname) newErrors.nachname = 'Nachname ist erforderlich';
    
    // Date validation
    if (!formData.geburtsdatum) {
      newErrors.geburtsdatum = 'Geburtsdatum ist erforderlich';
    } else if (!/^\d{2}\.\d{2}\.\d{4}$/.test(formData.geburtsdatum)) {
      newErrors.geburtsdatum = 'Bitte geben Sie ein gültiges Datum im Format TT.MM.JJJJ ein';
    } else {
      // Check age
      const [day, month, year] = formData.geburtsdatum.split('.').map(Number);
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 18) {
        newErrors.geburtsdatum = 'Der Kunde muss mindestens 18 Jahre alt sein';
      } else if (age > 100) {
        newErrors.geburtsdatum = 'Bitte überprüfen Sie das eingegebene Geburtsdatum';
      }
    }
    
    // Marital status validation
    if (!formData.zivilstand) {
      newErrors.zivilstand = 'Zivilstand ist erforderlich';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? 0 : parseInt(value, 10)
    }));
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      // Update global state
      dispatch({
        type: 'UPDATE_KUNDEN_DATEN',
        payload: { persoenlich: formData }
      });
      
      // Mark section as completed
      dispatch({
        type: 'UPDATE_SECTION_STATUS',
        payload: { section: 'customer-profile', status: 'completed' }
      });
      
      // Show summary
      setShowSummary(true);
      
      // Move to next section
      dispatch({ type: 'SET_CURRENT_SECTION', payload: 'current-situation' });
    }
  };
  
  return (
    <SectionContainer id="customer-profile" title="Kundenprofil">
      <p className="mb-6">Erfassen Sie hier die persönlichen Daten des Kunden.</p>
      
      {showSummary ? (
        <>
          <SummaryBox title="Kundendaten">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>Name:</strong> {formData.vorname} {formData.nachname}</p>
                <p><strong>Geburtsdatum:</strong> {formData.geburtsdatum}</p>
                <p><strong>Zivilstand:</strong> {formData.zivilstand}</p>
              </div>
              <div>
                <p><strong>Kinder:</strong> {formData.kinder}</p>
                <p><strong>Beruf:</strong> {formData.beruf || '-'}</p>
                <p><strong>Arbeitgeber:</strong> {formData.arbeitgeber || '-'}</p>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => setShowSummary(false)}
                className="px-4 py-2 text-sm text-blue-600 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Bearbeiten
              </button>
            </div>
          </SummaryBox>
          
          <FormActions
            currentSection="customer-profile"
            previousSection="intro"
            onSubmit={() => dispatch({ type: 'SET_CURRENT_SECTION', payload: 'current-situation' })}
            submitLabel="Weiter zur Ist-Analyse"
          />
        </>
      ) : (
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              id="vorname"
              label="Vorname"
              error={errors.vorname}
              required
            >
              <input
                type="text"
                id="vorname"
                name="vorname"
                value={formData.vorname}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${errors.vorname ? 'border-red-500' : 'border-gray-300'}`}
              />
            </FormField>
            
            <FormField
              id="nachname"
              label="Nachname"
              error={errors.nachname}
              required
            >
              <input
                type="text"
                id="nachname"
                name="nachname"
                value={formData.nachname}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${errors.nachname ? 'border-red-500' : 'border-gray-300'}`}
              />
            </FormField>
            
            <FormField
              id="geburtsdatum"
              label="Geburtsdatum"
              error={errors.geburtsdatum}
              helpText="Bitte geben Sie das Geburtsdatum im Format TT.MM.JJJJ ein"
              required
            >
              <input
                type="text"
                id="geburtsdatum"
                name="geburtsdatum"
                placeholder="DD.MM.YYYY"
                value={formData.geburtsdatum}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${errors.geburtsdatum ? 'border-red-500' : 'border-gray-300'}`}
              />
            </FormField>
            
            <FormField
              id="zivilstand"
              label="Zivilstand"
              error={errors.zivilstand}
              required
            >
              <select
                id="zivilstand"
                name="zivilstand"
                value={formData.zivilstand}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${errors.zivilstand ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Bitte wählen</option>
                <option value="ledig">Ledig</option>
                <option value="verheiratet">Verheiratet</option>
                <option value="geschieden">Geschieden</option>
                <option value="verwitwet">Verwitwet</option>
                <option value="eingetragene Partnerschaft">Eingetragene Partnerschaft</option>
              </select>
            </FormField>
            
            <FormField
              id="kinder"
              label="Anzahl Kinder"
              error={errors.kinder}
            >
              <input
                type="number"
                id="kinder"
                name="kinder"
                min="0"
                value={formData.kinder}
                onChange={handleNumberChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </FormField>
          </div>
          
          <FormActions
            currentSection="customer-profile"
            previousSection="intro"
            onSubmit={handleSubmit}
          />
        </form>
      )}
    </SectionContainer>
  );
}

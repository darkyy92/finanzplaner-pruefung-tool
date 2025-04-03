import { ReactNode } from 'react';
import { AppSection } from '../../types';
import { useAppState } from '../../context/AppContext';

interface FormActionsProps {
  currentSection: AppSection;
  previousSection?: AppSection;
  onSubmit?: () => void;
  submitLabel?: string;
  children?: ReactNode;
}

export function FormActions({
  currentSection,
  previousSection,
  onSubmit,
  submitLabel = 'Speichern und weiter',
  children
}: FormActionsProps) {
  const { dispatch } = useAppState();
  
  const handleBack = () => {
    if (previousSection) {
      dispatch({ type: 'SET_CURRENT_SECTION', payload: previousSection });
    }
  };

  return (
    <div className="form-actions mt-8 flex flex-wrap justify-between items-center gap-4">
      {previousSection && (
        <button
          type="button"
          onClick={handleBack}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        >
          Zurück
        </button>
      )}
      
      {children}
      
      {onSubmit && (
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {submitLabel}
        </button>
      )}
    </div>
  );
}

import { ReactNode } from 'react';
import { AppSection } from '../../types';
import { useAppState } from '../../context/AppContext';

interface SectionContainerProps {
  id: AppSection;
  title: string;
  children: ReactNode;
}

export function SectionContainer({ id, title, children }: SectionContainerProps) {
  const { state } = useAppState();
  
  // Only render if this is the current section
  if (state.currentSection !== id) {
    return null;
  }

  return (
    <div className="section-container">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="section-content">
        {children}
      </div>
    </div>
  );
}

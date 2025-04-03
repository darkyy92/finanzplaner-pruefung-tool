import { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { Header } from './Header';
import { useAppState } from '../../context/AppContext';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { state } = useAppState();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <Navigation currentSection={state.currentSection} />
        
        <main className="mt-6 bg-white shadow-md rounded-lg p-6">
          {children}
        </main>
        
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Swiss Financial Planner Tool © 2025</p>
          <p className="mt-1">Finanzplaner mit eidgenössischem Fachausweis Exam Preparation</p>
        </footer>
      </div>
    </div>
  );
}

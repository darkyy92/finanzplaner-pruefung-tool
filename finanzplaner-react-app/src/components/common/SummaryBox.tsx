import { ReactNode } from 'react';

interface SummaryBoxProps {
  title?: string;
  children: ReactNode;
}

export function SummaryBox({ title, children }: SummaryBoxProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
      {title && <h3 className="text-lg font-medium text-gray-700 mb-2">{title}</h3>}
      <div className="summary-content">
        {children}
      </div>
    </div>
  );
}

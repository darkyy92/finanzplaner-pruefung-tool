import { ReactNode } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({ id, label, error, helpText, required = false, children }: FormFieldProps) {
  return (
    <div className="form-group mb-4">
      <label 
        htmlFor={id} 
        className="block mb-1 font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        
        {helpText && (
          <div className="inline-block ml-2 group relative">
            <span className="cursor-help text-sm text-blue-500">ℹ️</span>
            <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded p-2 -right-2 top-6 w-64">
              {helpText}
            </div>
          </div>
        )}
      </label>
      
      {children}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

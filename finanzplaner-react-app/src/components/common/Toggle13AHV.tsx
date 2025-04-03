interface Toggle13AHVProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Toggle13AHV({ checked, onChange }: Toggle13AHVProps) {
  return (
    <div className="flex items-center">
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        <span className="ms-3 text-sm font-medium text-gray-700">
          {checked ? "13. AHV-Rente einbeziehen (ab 2026)" : "13. AHV-Rente nicht einbeziehen"}
        </span>
      </label>
      
      <div className="ml-2 group relative">
        <span className="cursor-help text-sm text-blue-500">ℹ️</span>
        <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded p-2 -right-2 top-6 w-64">
          {checked 
            ? "Die 13. AHV-Rente wird in den Berechnungen berücksichtigt. Diese wird ab 2026 ausbezahlt." 
            : "Die 13. AHV-Rente wird in den Berechnungen nicht berücksichtigt."}
        </div>
      </div>
    </div>
  );
}

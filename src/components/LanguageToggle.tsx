import React from 'react';
import { Languages } from 'lucide-react';
import { Language } from '../types';

interface LanguageToggleProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export default function LanguageToggle({ language, setLanguage }: LanguageToggleProps) {
  return (
    <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200 shadow-sm">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest transition-all ${
          language === 'en' 
            ? 'bg-[#00bbff] text-white shadow-md' 
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('am')}
        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest transition-all ${
          language === 'am' 
            ? 'bg-[#00bbff] text-white shadow-md' 
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        AM
      </button>
    </div>
  );
}

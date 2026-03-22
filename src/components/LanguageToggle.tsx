import React from 'react';
import { Languages } from 'lucide-react';
import { Language } from '../types';

interface LanguageToggleProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export default function LanguageToggle({ language, setLanguage }: LanguageToggleProps) {
  return (
    <div className="flex items-center space-x-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700">
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
          language === 'en' 
            ? 'bg-blue-500 text-white shadow-sm' 
            : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('am')}
        className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
          language === 'am' 
            ? 'bg-blue-500 text-white shadow-sm' 
            : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
        }`}
      >
        AM
      </button>
    </div>
  );
}

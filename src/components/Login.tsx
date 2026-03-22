import React, { useState } from 'react';
import { Lock, User, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface LoginProps {
  onLogin: (username: string, password?: string) => void;
  language: Language;
}

export default function Login({ onLogin, language }: LoginProps) {
  const t = translations[language];
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-blue-950 p-4 transition-colors">
      <div className="w-full max-w-xs">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 mb-4">
            <Lock size={24} />
          </div>
          <h1 className="text-xl font-bold text-blue-900 dark:text-white">{t.appName}</h1>
          <p className="text-xs text-blue-500 dark:text-blue-400 mt-1 font-medium">{t.loginTitle}</p>
        </div>

        <div className="bg-white dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-6 rounded-2xl shadow-xl shadow-blue-100/50 dark:shadow-none">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider ml-1">{t.username}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={14} />
                <input
                  required
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-blue-50/30 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-blue-900 dark:text-blue-100"
                  placeholder="admin or company_id"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider ml-1">{t.password}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={14} />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-blue-50/30 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-blue-900 dark:text-blue-100"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 group"
            >
              <span>{t.loginButton}</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-blue-50 dark:border-blue-800">
            <p className="text-[10px] text-blue-400 dark:text-blue-500 text-center leading-relaxed">
              {t.demoCredentials}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

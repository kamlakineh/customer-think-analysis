import React, { useState } from 'react';
import { Lock, User, Building2 } from 'lucide-react';
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
    <div className="min-h-screen bg-white flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-[320px] animate-in fade-in zoom-in duration-500">
        <div className="bg-white border border-[#00bbff]/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#00bbff]/5 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
          
          <div className="relative">
            <div className="flex flex-col items-center mb-8">
              <div className="p-4 bg-[#00bbff]/5 rounded-2xl shadow-inner mb-4 border border-[#00bbff]/10">
                <Building2 className="text-[#00bbff]" size={28} />
              </div>
              <h2 className="text-lg font-bold text-[#00bbff] uppercase tracking-[0.2em]">{t.loginTitle}</h2>
              <div className="h-0.5 w-8 bg-[#00bbff] mt-2 rounded-full opacity-20"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t.username}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#00bbff]/20 transition-all text-slate-900"
                    placeholder={t.username}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t.password}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#00bbff]/20 transition-all text-slate-900"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#00bbff] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md hover:shadow-lg hover:bg-[#00bbff]/90 active:scale-[0.98] mt-4"
              >
                {t.loginButton}
              </button>
            </form>
          </div>
        </div>
        <p className="text-center mt-8 text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em]">
          © {new Date().getFullYear()} {t.appName}
        </p>
      </div>
    </div>
  );
}

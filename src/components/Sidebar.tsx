import React from 'react';
import { LayoutDashboard, Users, Building2, LogOut, Stethoscope, BarChart3 } from 'lucide-react';
import { cn } from '../lib/utils';
import { UserRole, Language } from '../types';
import { translations } from '../translations';

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  userName: string;
  language: Language;
}

export default function Sidebar({ role, activeTab, onTabChange, onLogout, userName, language }: SidebarProps) {
  const t = translations[language];
  
  const menuItems = role === 'ADMIN' 
    ? [
        { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
        { id: 'companies', label: t.companies, icon: Building2 },
      ]
    : [
        { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
        { id: 'customers', label: t.reception, icon: Users },
        { id: 'doctor', label: t.doctorPanel, icon: Stethoscope },
      ];

  return (
    <div className="w-56 bg-white text-slate-900 h-screen flex flex-col border-r border-[#00bbff]/10 backdrop-blur-md">
      <div className="p-4 flex items-center space-x-2">
        <div className="w-7 h-7 bg-[#00bbff] rounded-lg flex items-center justify-center text-white shadow-sm">
          <Building2 size={16} />
        </div>
        <h1 className="text-lg font-bold tracking-tight text-[#00bbff]">{t.appName}</h1>
      </div>

      <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
        <div>
          <p className="px-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            {t.menu}
          </p>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-xs relative group",
                  activeTab === item.id 
                    ? "text-[#00bbff] font-bold bg-[#00bbff]/5 shadow-sm" 
                    : "text-slate-500 hover:bg-[#00bbff]/5 hover:text-[#00bbff]"
                )}
              >
                {activeTab === item.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#00bbff] rounded-r-full" />
                )}
                <item.icon size={18} className={activeTab === item.id ? "text-[#00bbff]" : "text-slate-400 group-hover:text-[#00bbff]"} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-[#00bbff]/10">
        <div className="flex items-center space-x-2 px-3 py-2 mb-2 bg-[#00bbff]/5 rounded-xl border border-[#00bbff]/10">
          <div className="w-8 h-8 rounded-full bg-[#00bbff] flex items-center justify-center text-white font-bold text-xs shadow-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold truncate text-slate-900">{userName}</p>
            <p className="text-[9px] text-slate-500 truncate">
              {role === 'ADMIN' ? t.adminPanel : t.companyPanel}
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-[#EF4444] hover:bg-[#EF4444]/10 transition-all duration-200 text-xs font-medium"
        >
          <LogOut size={18} />
          <span>{t.logout}</span>
        </button>
      </div>
    </div>
  );
}

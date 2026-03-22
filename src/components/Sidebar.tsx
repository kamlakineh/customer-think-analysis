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
    <div className="w-56 bg-white dark:bg-blue-950 text-blue-900 dark:text-white h-screen flex flex-col border-r border-blue-100 dark:border-blue-900">
      <div className="p-5 border-b border-blue-100 dark:border-blue-900">
        <h1 className="text-lg font-bold tracking-tight text-blue-600 dark:text-blue-400">{t.appName}</h1>
        <p className="text-[10px] text-blue-500/60 dark:text-blue-300/60 mt-0.5 uppercase tracking-widest font-medium">
          {role === 'ADMIN' ? t.adminPanel : t.companyPanel}
        </p>
      </div>

      <div className="flex-1 py-4 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm",
              activeTab === item.id 
                ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20" 
                : "text-blue-800/70 dark:text-blue-200/70 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 dark:hover:text-blue-300"
            )}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="p-3 border-t border-blue-100 dark:border-blue-900">
        <div className="flex items-center space-x-3 px-3 py-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-[10px]">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold truncate text-blue-900 dark:text-white">{userName}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 dark:hover:text-blue-300 transition-all duration-200 text-xs"
        >
          <LogOut size={16} />
          <span>{t.logout}</span>
        </button>
      </div>
    </div>
  );
}

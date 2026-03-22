import React, { useState } from 'react';
import { Building2, Plus, Trash2, ArrowLeft, Share2, Eye, EyeOff, Edit2 } from 'lucide-react';
import { Company, Customer, CustomerStatus, Language } from '../types';
import CustomerTable from './CustomerTable';
import Analytics from './Analytics';
import { translations } from '../translations';

interface AdminPanelProps {
  companies: Company[];
  customers: Customer[];
  onAddCompany: (data: Omit<Company, 'id' | 'createdAt'>) => void;
  onUpdateCompany: (id: string, data: Partial<Company>) => void;
  onDeleteCompany: (id: string) => void;
  onUpdateStatus: (id: string, status: CustomerStatus) => void;
  onUpdatePain: (id: string, pain: string) => void;
  onDeleteCustomer: (id: string) => void;
  onEditCustomer: (id: string, data: Partial<Customer>) => void;
  language: Language;
}

export default function AdminPanel({ 
  companies, 
  customers, 
  onAddCompany, 
  onUpdateCompany,
  onDeleteCompany,
  onUpdateStatus,
  onUpdatePain,
  onDeleteCustomer,
  onEditCustomer,
  language
}: AdminPanelProps) {
  const t = translations[language];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
  });

  const togglePassword = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const openAddModal = () => {
    setEditingCompany(null);
    setFormData({ name: '', username: '', password: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (company: Company) => {
    setEditingCompany(company);
    setFormData({ 
      name: company.name, 
      username: company.username, 
      password: company.password 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCompany) {
      onUpdateCompany(editingCompany.id, {
        name: formData.name,
        username: formData.username,
        password: formData.password
      });
    } else {
      onAddCompany({
        name: formData.name,
        username: formData.username,
        password: formData.password
      });
    }
    setFormData({ name: '', username: '', password: '' });
    setIsModalOpen(false);
  };

  const handleShare = (company: Company) => {
    const text = `ClinicFlow Credentials\nClinic: ${company.name}\nUsername: ${company.username}\nPassword: ${company.password}`;
    navigator.clipboard.writeText(text);
    alert('Credentials copied to clipboard!');
  };

  if (selectedCompany) {
    const companyCustomers = customers.filter(c => c.companyId === selectedCompany.id);
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setSelectedCompany(null)}
            className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm font-bold"
          >
            <ArrowLeft size={16} />
            <span>{t.backToCompanies}</span>
          </button>
          <div className="text-right">
            <h2 className="text-lg font-bold text-blue-900 dark:text-white">{selectedCompany.name}</h2>
            <p className="text-[10px] text-blue-500 uppercase tracking-widest font-bold">{t.manageClinicData}</p>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="text-xs font-bold text-blue-900 dark:text-white mb-4 uppercase tracking-wider flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span>{t.analytics}</span>
            </h3>
            <Analytics customers={companyCustomers} language={language} />
          </section>

          <section>
            <h3 className="text-xs font-bold text-blue-900 dark:text-white mb-4 uppercase tracking-wider flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span>{t.customers}</span>
            </h3>
            <CustomerTable 
              customers={companyCustomers}
              onAddCustomer={() => {}}
              onUpdateStatus={onUpdateStatus}
              onUpdatePain={onUpdatePain}
              onDeleteCustomer={onDeleteCustomer}
              onEditCustomer={onEditCustomer}
              isAdminView={true}
              language={language}
            />
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-blue-900 dark:text-white">{t.companies}</h2>
          <p className="text-[10px] text-blue-500 uppercase tracking-widest font-bold">{companies.length} {t.companies} registered</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm shadow-blue-500/20"
        >
          <Plus size={14} />
          <span>{t.registerCompany}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map((company) => (
            <div 
              key={company.id || `company-${company.username}`}
              onClick={() => setSelectedCompany(company)}
              className="group bg-white dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-xl hover:border-blue-500/50 transition-all cursor-pointer shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-300">
                  <Building2 size={20} />
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(company);
                    }}
                    className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-800 rounded-lg transition-all"
                    title={t.share}
                  >
                    <Share2 size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(company);
                    }}
                    className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-800 rounded-lg transition-all"
                    title={t.edit}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCompany(company.id);
                    }}
                    className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-800 rounded-lg transition-all"
                    title={t.delete}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <h3 className="text-sm font-bold text-blue-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{company.name}</h3>
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-blue-500/70 dark:text-blue-400/70 uppercase tracking-wider font-bold">{t.id}:</span>
                  <span className="text-blue-900 dark:text-blue-300 font-mono bg-blue-50 dark:bg-blue-950 px-1.5 rounded border border-blue-100/50 dark:border-blue-800">{company.username}</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-blue-500/70 dark:text-blue-400/70 uppercase tracking-wider font-bold">{t.pass}:</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-blue-900 dark:text-blue-300 font-mono bg-blue-50 dark:bg-blue-950 px-1.5 rounded border border-blue-100/50 dark:border-blue-800">
                      {showPasswords[company.id] ? company.password : '••••••••'}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePassword(company.id);
                      }}
                      className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
                    >
                      {showPasswords[company.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-blue-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-blue-900 border border-blue-100 dark:border-blue-800 rounded-2xl w-full max-w-xs p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-blue-900 dark:text-white mb-4">
              {editingCompany ? t.edit : t.registerCompany}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-wider mb-1">{t.companyName}</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-1.5 bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-800 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-blue-100"
                  placeholder="e.g. City Dental Clinic"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-wider mb-1">{t.username}</label>
                <input
                  required
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-1.5 bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-800 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-blue-100"
                  placeholder="e.g. citydental"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-wider mb-1">{t.password}</label>
                <input
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-1.5 bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-800 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-blue-100"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-3 py-2 bg-blue-50 dark:bg-blue-800 text-blue-600 dark:text-blue-300 rounded-lg text-xs font-bold transition-all"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-500/20"
                >
                  {editingCompany ? t.save : t.create}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

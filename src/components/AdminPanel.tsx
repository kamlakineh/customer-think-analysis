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
            className="flex items-center space-x-2 text-slate-600 hover:text-[#00bbff] transition-colors text-sm font-bold"
          >
            <ArrowLeft size={16} />
            <span>{t.backToCompanies}</span>
          </button>
          <div className="text-right">
            <h2 className="text-lg font-bold text-slate-900">{selectedCompany.name}</h2>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{t.manageClinicData}</p>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-wider flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00bbff]"></span>
              <span>{t.analytics}</span>
            </h3>
            <Analytics customers={companyCustomers} language={language} />
          </section>

          <section>
            <h3 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-wider flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00bbff]"></span>
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
          <h2 className="text-lg font-bold text-slate-900">{t.companies}</h2>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{companies.length} {t.companies} registered</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 bg-[#00bbff] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg"
        >
          <Plus size={18} />
          <span>{t.registerCompany}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
            <div 
              key={company.id || `company-${company.username}`}
              onClick={() => setSelectedCompany(company)}
              className="group bg-white border border-slate-200 p-6 rounded-2xl hover:border-[#00bbff]/50 transition-all cursor-pointer shadow-sm hover:shadow-md relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-[#00bbff] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-[#00bbff]">
                  <Building2 size={24} />
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(company);
                    }}
                    className="p-2 text-slate-400 hover:text-[#00bbff] hover:bg-slate-50 rounded-xl transition-all"
                    title={t.share}
                  >
                    <Share2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(company);
                    }}
                    className="p-2 text-slate-400 hover:text-[#00bbff] hover:bg-slate-50 rounded-xl transition-all"
                    title={t.edit}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCompany(company.id);
                    }}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                    title={t.delete}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-900 transition-colors">{company.name}</h3>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 uppercase tracking-widest font-bold">{t.id}:</span>
                  <span className="text-slate-900 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-200">{company.username}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 uppercase tracking-widest font-bold">{t.pass}:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-900 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                      {showPasswords[company.id] ? company.password : '••••••••'}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePassword(company.id);
                      }}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      {showPasswords[company.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-6">
              {editingCompany ? t.edit : t.registerCompany}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.companyName}</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00bbff]/20 text-slate-900"
                  placeholder="e.g. City Dental Clinic"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.username}</label>
                <input
                  required
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00bbff]/20 text-slate-900"
                  placeholder="e.g. citydental"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.password}</label>
                <input
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00bbff]/20 text-slate-900"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold transition-all hover:bg-slate-100"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#00bbff] text-white py-3 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-xl"
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

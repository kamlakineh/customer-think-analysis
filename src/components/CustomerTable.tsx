import React, { useState } from 'react';
import { Search, UserPlus, CheckCircle2, RotateCcw, Trash2, Edit2, X, Save, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { cn } from '../lib/utils';
import { Customer, CustomerStatus, Language } from '../types';
import { translations } from '../translations';

interface CustomerTableProps {
  customers: Customer[];
  onAddCustomer: (name: string, phone: string) => void;
  onUpdateStatus: (id: string, status: CustomerStatus) => void;
  onUpdatePain: (id: string, pain: string) => void;
  onDeleteCustomer: (id: string) => void;
  onEditCustomer: (id: string, data: Partial<Customer>) => void;
  isDoctorView?: boolean;
  isAdminView?: boolean;
  language: Language;
}

export default function CustomerTable({ 
  customers, 
  onAddCustomer, 
  onUpdateStatus, 
  onUpdatePain, 
  onDeleteCustomer,
  onEditCustomer,
  isDoctorView = false,
  isAdminView = false,
  language
}: CustomerTableProps) {
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [localPainNotes, setLocalPainNotes] = useState<Record<string, string>>({});
  const [editForm, setEditForm] = useState({ name: '', phone: '' });
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
  });

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCustomer(newCustomer.name, newCustomer.phone);
    setNewCustomer({ name: '', phone: '' });
    setIsModalOpen(false);
  };

  const startEditing = (customer: Customer) => {
    setEditingId(customer.id);
    setEditForm({ name: customer.name, phone: customer.phone });
  };

  const handleUpdate = (id: string) => {
    onEditCustomer(id, editForm);
    setEditingId(null);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [t.customer, t.phone, t.status, t.painNote];
    const tableRows = filteredCustomers.map(customer => [
      customer.name,
      customer.phone,
      customer.status === 'ARRIVED' ? t.arrived : t.notArrived,
      customer.pain || ''
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 138] },
    });

    doc.text(t.customers, 14, 15);
    doc.save(`customers_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <input
            type="text"
            placeholder={t.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all dark:text-zinc-200"
          />
        </div>
        <div className="flex items-center space-x-2">
          {!isDoctorView && (
            <button
              onClick={exportToPDF}
              className="flex items-center space-x-2 bg-white dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-all"
            >
              <Download size={14} />
              <span>PDF</span>
            </button>
          )}
          {!isDoctorView && !isAdminView && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm shadow-blue-500/20"
            >
              <UserPlus size={14} />
              <span>{t.addCustomer}</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50/50 dark:bg-blue-900/10 border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-4 py-2.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{t.customer}</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{t.phone}</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{t.status}</th>
                {(isDoctorView || isAdminView) && <th className="px-4 py-2.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{t.painNote}</th>}
                {!isAdminView && <th className="px-4 py-2.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-right">{t.actions}</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-4 py-2.5">
                    {editingId === customer.id ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded px-2 py-1 text-xs w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-blue-900 dark:text-blue-100">{customer.name}</span>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="text-[10px] text-blue-400 font-medium">{new Date(customer.createdAt).toLocaleDateString()}</span>
                          {customer.arrivalTime && (
                            <span className="text-[10px] text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-1 rounded">
                              {new Date(customer.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    {editingId === customer.id ? (
                      <input
                        type="text"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded px-2 py-1 text-xs w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      <span className="text-xs text-blue-800 dark:text-blue-300 font-mono font-medium">{customer.phone}</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium",
                      customer.status === 'ARRIVED' 
                        ? "bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-300" 
                        : "bg-blue-50 dark:bg-blue-900/20 text-blue-400 dark:text-blue-500"
                    )}>
                      {customer.status === 'ARRIVED' ? t.arrived : t.notArrived}
                    </span>
                  </td>
                  {(isDoctorView || isAdminView) && (
                    <td className="px-4 py-2.5">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-blue-500 uppercase tracking-wider">{t.painNote}</label>
                        <textarea
                          placeholder={t.diagnosisNotes}
                          value={localPainNotes[customer.id] !== undefined ? localPainNotes[customer.id] : (customer.pain || '')}
                          readOnly={isAdminView}
                          onChange={(e) => {
                            if (isDoctorView) {
                              setLocalPainNotes(prev => ({ ...prev, [customer.id]: e.target.value }));
                            }
                          }}
                          className={cn(
                            "w-full bg-blue-50/30 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800 rounded-lg focus:border-blue-500 focus:outline-none text-xs p-2 transition-all dark:text-blue-100 min-h-[80px] resize-none",
                            isAdminView && "cursor-default opacity-80"
                          )}
                        />
                        {isDoctorView && (
                          <button
                            onClick={() => onUpdatePain(customer.id, localPainNotes[customer.id] || '')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1 rounded-md text-[10px] font-bold transition-all"
                          >
                            {t.save}
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                  {!isAdminView && (
                    <td className="px-4 py-2.5 text-right">
                      {!isDoctorView && (
                        <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {editingId === customer.id ? (
                            <>
                              <button
                                onClick={() => handleUpdate(customer.id)}
                                className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded transition-colors"
                                title={t.save}
                              >
                                <Save size={14} />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                                title={t.cancel}
                              >
                                <X size={14} />
                              </button>
                            </>
                          ) : (
                            <>
                              {customer.status === 'NOT_ARRIVED' ? (
                                <button
                                  onClick={() => onUpdateStatus(customer.id, 'ARRIVED')}
                                  className="flex items-center space-x-1 px-2 py-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded transition-colors text-[10px] font-medium"
                                >
                                  <CheckCircle2 size={12} />
                                  <span>{t.came}</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => onUpdateStatus(customer.id, 'NOT_ARRIVED')}
                                  className="flex items-center space-x-1 px-2 py-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors text-[10px] font-medium"
                                >
                                  <RotateCcw size={12} />
                                  <span>{t.reset}</span>
                                </button>
                              )}
                              <button
                                onClick={() => startEditing(customer)}
                                className="p-1 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded transition-colors"
                                title={t.edit}
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => onDeleteCustomer(customer.id)}
                                className="p-1 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"
                                title={t.delete}
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={(isDoctorView || isAdminView) ? 5 : 4} className="px-4 py-8 text-center text-blue-400 text-xs italic">
                    {t.noRecords}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-xs p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{t.addCustomer}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">{t.fullName}</label>
                <input
                  required
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-zinc-200"
                  placeholder="e.g. Abebe Kebede"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">{t.phoneNumber}</label>
                <input
                  required
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-zinc-200"
                  placeholder="e.g. 0911223344"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-500/20 mt-2"
              >
                {t.save}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

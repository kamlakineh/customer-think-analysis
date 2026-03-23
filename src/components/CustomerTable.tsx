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
      headStyles: { fillColor: [0, 0, 0] },
    });

    doc.text(t.customers, 14, 15);
    doc.save(`customers_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder={t.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#00bbff]/20 transition-all text-slate-900 shadow-sm"
          />
        </div>
        <div className="flex items-center space-x-2">
          {!isDoctorView && (
            <button
              onClick={exportToPDF}
              className="flex items-center space-x-1.5 bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-slate-50 transition-all shadow-sm"
            >
              <Download size={14} />
              <span>PDF</span>
            </button>
          )}
          {!isDoctorView && !isAdminView && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-1.5 bg-[#00bbff] text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              <UserPlus size={14} />
              <span>{t.addCustomer}</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.customer}</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.phone}</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.status}</th>
                {(isDoctorView || isAdminView) && <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.painNote}</th>}
                {!isAdminView && <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">{t.actions}</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-4 py-2.5">
                    {editingId === customer.id ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs w-full focus:outline-none focus:ring-1 focus:ring-[#00bbff]/20 text-slate-900"
                      />
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900">{customer.name}</span>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="text-[9px] text-slate-400 font-medium uppercase tracking-tighter">{new Date(customer.createdAt).toLocaleDateString()}</span>
                          {customer.arrivalTime && (
                            <span className="text-[9px] text-[#00bbff] font-bold uppercase tracking-tighter bg-[#00bbff]/5 px-1.5 py-0.5 rounded border border-[#00bbff]/10">
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
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs w-full focus:outline-none focus:ring-1 focus:ring-[#00bbff]/20 text-slate-900"
                      />
                    ) : (
                      <span className="text-xs text-slate-600">{customer.phone}</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center space-x-2">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        customer.status === 'ARRIVED' ? "bg-[#00bbff]" : "bg-slate-200"
                      )} />
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest",
                        customer.status === 'ARRIVED' ? "text-[#00bbff]" : "text-slate-300"
                      )}>
                        {customer.status === 'ARRIVED' ? t.arrived : t.notArrived}
                      </span>
                    </div>
                  </td>
                  {(isDoctorView || isAdminView) && (
                    <td className="px-4 py-2">
                      <div className="space-y-1">
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
                            "w-full bg-slate-50 border border-slate-200 rounded-lg focus:border-[#00bbff]/20 focus:outline-none text-[10px] p-2 transition-all text-slate-900 min-h-[60px] resize-none",
                            isAdminView && "cursor-default opacity-80"
                          )}
                        />
                        {isDoctorView && (
                          <button
                            onClick={() => onUpdatePain(customer.id, localPainNotes[customer.id] || '')}
                            className="w-full bg-[#00bbff] text-white py-1 rounded-md text-[9px] font-bold transition-all shadow-sm hover:bg-[#00bbff]/90"
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
                        <div className="flex items-center justify-end space-x-1 ">
                          {editingId === customer.id ? (
                            <>
                              <button
                                onClick={() => handleUpdate(customer.id)}
                                className="p-1 text-[#00bbff] hover:bg-[#00bbff]/10 rounded transition-colors"
                                title={t.save}
                              >
                                <Save size={12} />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-1 text-slate-400 hover:bg-slate-100 rounded transition-colors"
                                title={t.cancel}
                              >
                                <X size={12} />
                              </button>
                            </>
                          ) : (
                            <>
                              {customer.status === 'NOT_ARRIVED' ? (
                                <button
                                  onClick={() => onUpdateStatus(customer.id, 'ARRIVED')}
                                  className="flex items-center space-x-1 px-2 py-1 text-[#00bbff] hover:bg-[#00bbff]/10 rounded transition-colors text-[9px] font-bold uppercase tracking-wider"
                                >
                                  <CheckCircle2 size={10} />
                                  <span>{t.came}</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => onUpdateStatus(customer.id, 'NOT_ARRIVED')}
                                  className="flex items-center space-x-1 px-2 py-1 text-slate-400 hover:bg-slate-100 rounded transition-colors text-[9px] font-bold uppercase tracking-wider"
                                >
                                  <RotateCcw size={10} />
                                  <span>{t.reset}</span>
                                </button>
                              )}
                              <button
                                onClick={() => startEditing(customer)}
                                className="p-1 text-slate-400 hover:text-[#00bbff] hover:bg-[#00bbff]/10 rounded transition-colors"
                                title={t.edit}
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                onClick={() => onDeleteCustomer(customer.id)}
                                className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                title={t.delete}
                              >
                                <Trash2 size={12} />
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
                  <td colSpan={(isDoctorView || isAdminView) ? 5 : 4} className="px-4 py-6 text-center text-slate-300 text-[10px] italic">
                    {t.noRecords}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-[280px] p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-[#00bbff] uppercase tracking-widest">{t.addCustomer}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.fullName}</label>
                <input
                  required
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#00bbff]/20 text-slate-900"
                  placeholder="e.g. Abebe Kebede"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.phoneNumber}</label>
                <input
                  required
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#00bbff]/20 text-slate-900"
                  placeholder="e.g. 0911223344"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#00bbff] text-white py-2 rounded-lg text-xs font-bold transition-all shadow-md mt-2 hover:shadow-lg active:scale-[0.98]"
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

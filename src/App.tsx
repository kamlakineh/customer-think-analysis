import React, { useState, useEffect } from 'react';
import { AuthState, Company, Customer, CustomerStatus, Language } from './types';
import Sidebar from './components/Sidebar';
import CustomerTable from './components/CustomerTable';
import Analytics from './components/Analytics';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import LanguageToggle from './components/LanguageToggle';
import { translations } from './translations';
import { cn } from './lib/utils';

function App() {
  const [auth, setAuth] = useState<AuthState>({ user: null, role: null });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [language, setLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang) setLanguage(savedLang);
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesRes, customersRes] = await Promise.all([
          fetch('/api/companies'),
          fetch('/api/customers')
        ]);
        const companiesData = await companiesRes.json();
        const customersData = await customersRes.json();
        setCompanies(companiesData);
        setCustomers(customersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const t = translations[language];

  const handleLogin = (username: string, password?: string) => {
    if (username === 'admin' && password === 'pass1234') {
      setAuth({ user: { id: 'admin', username: 'admin' }, role: 'ADMIN' });
      setActiveTab('dashboard');
      return;
    }

    const company = companies.find(c => c.username === username && c.password === password);
    if (company) {
      setAuth({ user: company, role: 'COMPANY' });
      setActiveTab('dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setAuth({ user: null, role: null });
  };

  const handleAddCompany = async (companyData: Omit<Company, 'id' | 'createdAt'>) => {
    try {
      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...companyData,
          createdAt: new Date().toISOString(),
        }),
      });
      const newCompany = await res.json();
      setCompanies([...companies, newCompany]);
    } catch (error) {
      console.error('Error adding company:', error);
    }
  };

  const handleDeleteCompany = async (id: string) => {
    try {
      await fetch(`/api/companies/${id}`, { method: 'DELETE' });
      setCompanies(companies.filter(c => c.id !== id));
      setCustomers(customers.filter(c => c.companyId !== id));
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };

  const handleUpdateCompany = async (id: string, data: Partial<Company>) => {
    try {
      const res = await fetch(`/api/companies/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update company');
      }
      const updatedCompany = await res.json();
      setCompanies(companies.map(c => c.id === id ? updatedCompany : c));
    } catch (error) {
      console.error('Error updating company:', error);
      alert(error instanceof Error ? error.message : 'Error updating company');
    }
  };

  const handleAddCustomer = async (name: string, phone: string) => {
    if (auth.role === 'COMPANY' && auth.user) {
      try {
        const res = await fetch('/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            phone,
            companyId: auth.user.id,
            status: 'NOT_ARRIVED',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to add customer');
        }
        const newCustomer = await res.json();
        setCustomers([...customers, newCustomer]);
      } catch (error) {
        console.error('Error adding customer:', error);
        alert(error instanceof Error ? error.message : 'Error adding customer');
      }
    }
  };

  const handleUpdateStatus = async (id: string, status: CustomerStatus) => {
    try {
      const updatePayload: any = { status, updatedAt: new Date().toISOString() };
      if (status === 'ARRIVED') {
        updatePayload.arrivalTime = new Date().toISOString();
      }
      const res = await fetch(`/api/customers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update status');
      }
      const updatedCustomer = await res.json();
      setCustomers(customers.map(c => c.id === id ? updatedCustomer : c));
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error instanceof Error ? error.message : 'Error updating status');
    }
  };

  const handleUpdatePain = async (id: string, pain: string) => {
    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pain, updatedAt: new Date().toISOString() }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update pain note');
      }
      const updatedCustomer = await res.json();
      setCustomers(customers.map(c => c.id === id ? updatedCustomer : c));
    } catch (error) {
      console.error('Error updating pain:', error);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    try {
      const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete customer');
      }
      setCustomers(customers.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert(error instanceof Error ? error.message : 'Error deleting customer');
    }
  };

  const handleEditCustomer = async (id: string, data: Partial<Customer>) => {
    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, updatedAt: new Date().toISOString() }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to edit customer');
      }
      const updatedCustomer = await res.json();
      setCustomers(customers.map(c => c.id === id ? updatedCustomer : c));
    } catch (error) {
      console.error('Error editing customer:', error);
      alert(error instanceof Error ? error.message : 'Error editing customer');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-6 h-6 border-2 border-[#00bbff] border-t-transparent rounded-full animate-spin shadow-sm"></div>
      </div>
    );
  }

  if (!auth.user) {
    return (
      <div className="bg-white min-h-screen">
        <div className="fixed top-3 right-3 z-50 flex items-center space-x-2">
          <LanguageToggle language={language} setLanguage={setLanguage} />
        </div>
        <Login onLogin={handleLogin} language={language} />
      </div>
    );
  }

  const companyCustomers = auth.role === 'COMPANY' && auth.user
    ? customers.filter(c => c.companyId === auth.user?.id)
    : customers;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Analytics customers={companyCustomers} language={language} />;
      case 'companies':
        return auth.role === 'ADMIN' ? (
          <AdminPanel 
            companies={companies} 
            customers={customers}
            onAddCompany={handleAddCompany}
            onUpdateCompany={handleUpdateCompany}
            onDeleteCompany={handleDeleteCompany}
            onUpdateStatus={handleUpdateStatus}
            onUpdatePain={handleUpdatePain}
            onDeleteCustomer={handleDeleteCustomer}
            onEditCustomer={handleEditCustomer}
            language={language}
          />
        ) : null;
      case 'customers':
        return (
          <CustomerTable 
            customers={companyCustomers}
            onAddCustomer={handleAddCustomer}
            onUpdateStatus={handleUpdateStatus}
            onUpdatePain={handleUpdatePain}
            onDeleteCustomer={handleDeleteCustomer}
            onEditCustomer={handleEditCustomer}
            language={language}
          />
        );
      case 'doctor':
        return (
          <CustomerTable 
            customers={companyCustomers.filter(c => c.status === 'ARRIVED')}
            onAddCustomer={handleAddCustomer}
            onUpdateStatus={handleUpdateStatus}
            onUpdatePain={handleUpdatePain}
            onDeleteCustomer={handleDeleteCustomer}
            onEditCustomer={handleEditCustomer}
            isDoctorView={true}
            language={language}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-white transition-colors">
      <Sidebar 
        role={auth.role!} 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        userName={auth.role === 'ADMIN' ? 'Administrator' : (auth.user as Company).name}
        language={language}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 shadow-sm">
          <h2 className="text-lg font-bold text-[#00bbff]">
            {activeTab === 'dashboard' ? t.dashboard : 
             activeTab === 'companies' ? t.companies : 
             activeTab === 'customers' ? t.reception : t.doctorPanel}
          </h2>
          <div className="flex items-center space-x-2">
            <LanguageToggle language={language} setLanguage={setLanguage} />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from 'recharts';
import { Customer, Language } from '../types';
import { translations } from '../translations';
import { cn } from '../lib/utils';

interface AnalyticsProps {
  customers: Customer[];
  language: Language;
}

type TimeRange = 'week' | 'month' | '3month';

export default function Analytics({ customers, language }: AnalyticsProps) {
  const t = translations[language];
  
  const arrivedCount = customers.filter(c => c.status === 'ARRIVED').length;
  const notArrivedCount = customers.filter(c => c.status === 'NOT_ARRIVED').length;
  const total = customers.length;

  const statusData = [
    { name: t.arrived, value: arrivedCount },
    { name: t.notArrived, value: notArrivedCount },
  ];

  const COLORS = ['#00bbff', '#00bbff20'];
  const chartTextColor = '#64748b';
  const barFill = '#00bbff';

  // Helper to get last 7 days
  const getWeeklyTrend = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        name: days[d.getDay()],
        date: d.toISOString().split('T')[0],
        count: 0
      };
    });

    customers.forEach(customer => {
      const customerDate = customer.createdAt.split('T')[0];
      const day = last7Days.find(d => d.date === customerDate);
      if (day) day.count++;
    });

    return last7Days;
  };

  // Helper to get last 4 weeks
  const getMonthlyTrend = () => {
    const weeks = ['W1', 'W2', 'W3', 'W4'];
    const last4Weeks = weeks.map((name, i) => ({ name, count: 0 }));
    
    const now = new Date();
    customers.forEach(customer => {
      const customerDate = new Date(customer.createdAt);
      const diffTime = Math.abs(now.getTime() - customerDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 28) {
        const weekIndex = 3 - Math.floor((diffDays - 1) / 7);
        if (weekIndex >= 0 && weekIndex < 4) {
          last4Weeks[weekIndex].count++;
        }
      }
    });

    return last4Weeks;
  };

  // Helper to get last 3 months
  const getQuarterlyTrend = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const last3Months = [];
    
    for (let i = 2; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      last3Months.push({
        name: months[d.getMonth()],
        month: d.getMonth(),
        year: d.getFullYear(),
        count: 0
      });
    }

    customers.forEach(customer => {
      const customerDate = new Date(customer.createdAt);
      const month = last3Months.find(m => m.month === customerDate.getMonth() && m.year === customerDate.getFullYear());
      if (month) month.count++;
    });

    return last3Months;
  };

  const weeklyData = getWeeklyTrend();
  const monthlyData = getMonthlyTrend();
  const quarterlyData = getQuarterlyTrend();

  const stats = [
    { label: t.totalCustomers, value: total, color: 'text-slate-900' },
    { label: t.arrived, value: arrivedCount, color: 'text-[#00bbff]' },
    { label: t.notArrived, value: notArrivedCount, color: 'text-slate-400' },
    { label: t.conversionRate, value: total > 0 ? `${Math.round((arrivedCount / total) * 100)}%` : '0%', color: 'text-slate-900' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-slate-200 rounded-lg shadow-xl">
          <p className="text-[10px] font-bold text-slate-900">{label}</p>
          <p className="text-[10px] text-[#00bbff] font-bold mt-0.5">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Distribution */}
        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-widest">{t.statusDistribution}</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconSize={6} wrapperStyle={{ fontSize: '9px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-widest">{t.week} {t.customerTrends}</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: chartTextColor, opacity: 0.6 }} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#00bbff10' }} />
                <Bar dataKey="count" fill={barFill} radius={[4, 4, 0, 0]} name={t.totalCustomers} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-widest">{t.month} {t.customerTrends}</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: chartTextColor, opacity: 0.6 }} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="count" stroke={barFill} strokeWidth={2} dot={{ r: 3, fill: barFill }} name={t.totalCustomers} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quarterly Trend */}
        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-widest">{t.threeMonths} {t.customerTrends}</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quarterlyData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: chartTextColor, opacity: 0.6 }} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#00bbff10' }} />
                <Bar dataKey="count" fill={barFill} radius={[4, 4, 0, 0]} name={t.totalCustomers} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

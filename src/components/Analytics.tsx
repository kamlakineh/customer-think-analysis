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

  const COLORS = ['#3b82f6', '#93c5fd']; // Medium Blue and Light Blue

  // Helper to group by date
  const groupByDate = (data: any[], unit: 'day' | 'week' | 'month') => {
    const counts: Record<string, number> = {};
    data.forEach(item => {
      const date = new Date(item.createdAt);
      let key = '';
      if (unit === 'day') key = date.toLocaleDateString([], { weekday: 'short' });
      else if (unit === 'week') {
        const firstDay = new Date(date.setDate(date.getDate() - date.getDay()));
        key = `Wk ${firstDay.getDate()}/${firstDay.getMonth() + 1}`;
      }
      else key = date.toLocaleDateString([], { month: 'short' });
      
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  };

  const weeklyData = groupByDate(customers, 'day').slice(-7);
  const monthlyData = groupByDate(customers, 'week').slice(-4);
  const quarterlyData = groupByDate(customers, 'month').slice(-3);

  const stats = [
    { label: t.totalCustomers, value: total, color: 'text-blue-900 dark:text-white' },
    { label: t.arrived, value: arrivedCount, color: 'text-blue-600 dark:text-blue-400' },
    { label: t.notArrived, value: notArrivedCount, color: 'text-blue-400' },
    { label: t.conversionRate, value: total > 0 ? `${Math.round((arrivedCount / total) * 100)}%` : '0%', color: 'text-blue-600 dark:text-blue-400' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-blue-900 dark:bg-white p-2 border border-blue-700 dark:border-blue-200 rounded shadow-lg">
          <p className="text-[10px] font-bold text-white dark:text-blue-900">{label}</p>
          <p className="text-[10px] text-blue-200 dark:text-blue-600 font-bold">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-3 rounded-xl shadow-sm">
            <p className="text-[10px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider">{stat.label}</p>
            <p className={`text-lg font-bold mt-0.5 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Distribution */}
        <div className="bg-white dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-xl shadow-sm">
          <h3 className="text-[10px] font-bold text-blue-900 dark:text-white mb-4 uppercase tracking-wider">{t.statusDistribution}</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={5}
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
        <div className="bg-white dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-xl shadow-sm">
          <h3 className="text-[10px] font-bold text-blue-900 dark:text-white mb-4 uppercase tracking-wider">{t.week} {t.customerTrends}</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#3b82f6' }} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name={t.totalCustomers} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-xl shadow-sm">
          <h3 className="text-[10px] font-bold text-blue-900 dark:text-white mb-4 uppercase tracking-wider">{t.month} {t.customerTrends}</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#3b82f6' }} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }} name={t.totalCustomers} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quarterly Trend */}
        <div className="bg-white dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-xl shadow-sm">
          <h3 className="text-[10px] font-bold text-blue-900 dark:text-white mb-4 uppercase tracking-wider">{t.threeMonths} {t.customerTrends}</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quarterlyData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#3b82f6' }} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
                <Bar dataKey="count" fill="#93c5fd" radius={[4, 4, 0, 0]} name={t.totalCustomers} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

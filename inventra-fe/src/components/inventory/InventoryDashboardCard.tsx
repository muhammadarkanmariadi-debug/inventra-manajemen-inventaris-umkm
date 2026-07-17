import React from 'react';
import Badge from '@/components/ui/badge/Badge';

interface InventoryOverview {
  ready: number;
  on_hold: number;
  reject: number;
}

export default function InventoryDashboardCard({ overview }: { overview: InventoryOverview }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col gap-4 w-full max-w-sm">
      <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">Event-Driven Inventory</h3>
        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      
      <div className="flex justify-between items-center py-2">
        <span className="text-gray-600 dark:text-gray-400">Available (READY)</span>
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-gray-900 dark:text-white">{overview?.ready || 0}</span>
          <Badge size="sm" color="success">Units</Badge>
        </div>
      </div>
      
      <div className="flex justify-between items-center py-2">
        <span className="text-gray-600 dark:text-gray-400">Pending (ON_HOLD)</span>
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-gray-900 dark:text-white">{overview?.on_hold || 0}</span>
          <Badge size="sm" color="warning">Units</Badge>
        </div>
      </div>
      
      <div className="flex justify-between items-center py-2">
        <span className="text-gray-600 dark:text-gray-400">Blocked (REJECT)</span>
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-gray-900 dark:text-white">{overview?.reject || 0}</span>
          <Badge size="sm" color="error">Units</Badge>
        </div>
      </div>
    </div>
  );
}

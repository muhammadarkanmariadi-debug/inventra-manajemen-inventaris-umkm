import React from 'react';
import Badge from '@/components/ui/badge/Badge';

export default function InventoryLogTimeline({ logs }: { logs: any[] }) {
  if (!logs || logs.length === 0) {
    return <p className="text-sm text-gray-500">No logs found for this batch.</p>;
  }

  return (
    <div className="relative border-l border-gray-200 dark:border-gray-700 ml-3">
      {logs.map((log: any, index: number) => (
        <div key={log.id} className="mb-6 ml-6">
          <span className="absolute flex items-center justify-center w-6 h-6 bg-brand-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-brand-900">
            <svg className="w-3 h-3 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </span>
          <h3 className="flex items-center mb-1 text-sm font-semibold text-gray-900 dark:text-white">
            {log.action}
          </h3>
          <time className="block mb-2 text-xs font-normal leading-none text-gray-400 dark:text-gray-500">
            {new Date(log.created_at).toLocaleString()} by {log.user?.username || 'System'}
          </time>
          <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
            <p>Quantity affected: <strong>{log.quantity}</strong></p>
            {log.from_status && log.to_status && (
              <p className="mt-1 flex items-center gap-2">
                Status: <Badge size="sm" color="light">{log.from_status.name}</Badge> → <Badge size="sm" color="info">{log.to_status.name}</Badge>
              </p>
            )}
            {log.notes && <p className="mt-2 italic">"{log.notes}"</p>}
          </div>
          {log.location && (
            <p className="mt-1 flex items-center gap-2">
              Lokasi: <Badge size="sm" color="light">{log.location.name}</Badge>
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

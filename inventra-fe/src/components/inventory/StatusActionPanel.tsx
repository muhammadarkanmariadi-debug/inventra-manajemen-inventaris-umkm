import React, { useEffect, useState } from 'react';
import Button from '@/components/ui/button/Button';
import Select from '../form/Select';
import SelectInputs from '../form/form-elements/SelectInputs';

interface ActionPanelProps {
  options: { key: any, value: any }[] | null;
  inventory: any;
  onUpdateStatus: (id: number, status: string, notes?: string, location_id?: number) => Promise<any>;
}

export default function StatusActionPanel({ inventory, onUpdateStatus, options  }: ActionPanelProps) {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [location_id, setLocationId] = useState<number | null>(null);



  if (!inventory || !inventory.status) return null;

  const status = inventory.status.code;

  const handleAction = async (newStatus: string | string[]) => {
    setLoading(true);
    // Convert array to comma-separated string if it's multiple, just for compatibility
    const statusVal = Array.isArray(newStatus) ? newStatus.join(',') : newStatus;
    await onUpdateStatus(inventory.id, statusVal, notes, location_id !== null ? location_id : undefined);
    setLoading(false);
    setNotes('');
    setLocationId(null);
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col gap-3">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Available Actions</h4>

      <input
        type="text"
        className="text-sm w-full p-2 border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700"
        placeholder="Add optional notes..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      {options && (
        <Select
          placeholder="Pilih Gudang"
          isSearchable={true}
          isMulti={false}
          value={location_id}
          options={options.map((option) => ({ label: option.key, value: option.value }))}
          onChange={(value) => {setLocationId(value) }}
        />
      )}


      <div className="flex flex-wrap gap-2">
        {status === 'UNRELEASED' && (
          <>
            <Button size="sm" variant="outline" className="text-brand-600 border-brand-200 hover:bg-brand-50" onClick={() => handleAction('READY')} disabled={loading}>
              Approve (READY)
            </Button>
            <Button size="sm" variant="outline" className="text-warning-600 border-warning-200 hover:bg-warning-50" onClick={() => handleAction('ON_HOLD')} disabled={loading}>
              Hold (ON_HOLD)
            </Button>
          </>
        )}

        {status === 'ON_HOLD' && (
          <>
            <Button size="sm" variant="outline" className="text-brand-600 border-brand-200 hover:bg-brand-50" onClick={() => handleAction('READY')} disabled={loading}>
              Approve (READY)
            </Button>
            <Button size="sm" variant="outline" className="text-error-600 border-error-200 hover:bg-error-50" onClick={() => handleAction('REJECT')} disabled={loading}>
              Reject (REJECT)
            </Button>
          </>
        )}

        {status === 'READY' && (
          <>
            <Button size="sm" variant="outline" className="text-warning-600 border-warning-200 hover:bg-warning-50" onClick={() => handleAction('ON_HOLD')} disabled={loading}>
              Hold (ON_HOLD)
            </Button>
            <p className="text-xs text-gray-500 mt-2 block w-full">Ready items can be securely deducted via Transactions.</p>
          </>
        )}

        {status === 'REJECT' && (
          <p className="text-sm text-error-500">Item is permanently rejected.</p>
        )}
      </div>
    </div>
  );
}

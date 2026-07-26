import { create } from 'zustand';

interface InventoryUIState {
  isFormOpen: boolean;
  selectedProductId: number | null;
  activeTab: 'products' | 'categories' | 'locations' | 'logs';
  openForm: (id?: number) => void;
  closeForm: () => void;
  setActiveTab: (tab: 'products' | 'categories' | 'locations' | 'logs') => void;
}

export const useInventoryUIStore = create<InventoryUIState>((set) => ({
  isFormOpen: false,
  selectedProductId: null,
  activeTab: 'products',
  openForm: (id) => set({ isFormOpen: true, selectedProductId: id ?? null }),
  closeForm: () => set({ isFormOpen: false, selectedProductId: null }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));

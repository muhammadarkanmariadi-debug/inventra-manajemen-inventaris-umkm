import { create } from 'zustand';

interface SalesUIState {
  isCreateModalOpen: boolean;
  selectedSaleId: number | null;
  openCreateModal: (id?: number) => void;
  closeCreateModal: () => void;
}

export const useSalesUIStore = create<SalesUIState>((set) => ({
  isCreateModalOpen: false,
  selectedSaleId: null,
  openCreateModal: (id) => set({ isCreateModalOpen: true, selectedSaleId: id ?? null }),
  closeCreateModal: () => set({ isCreateModalOpen: false, selectedSaleId: null }),
}));

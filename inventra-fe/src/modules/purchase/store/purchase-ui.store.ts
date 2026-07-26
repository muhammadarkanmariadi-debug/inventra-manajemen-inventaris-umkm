import { create } from 'zustand';

interface PurchaseUIState {
  isPurchaseModalOpen: boolean;
  isSupplierModalOpen: boolean;
  selectedPurchaseId: number | null;
  selectedSupplierId: number | null;
  activeTab: 'purchases' | 'suppliers';
  openPurchaseModal: (id?: number) => void;
  closePurchaseModal: () => void;
  openSupplierModal: (id?: number) => void;
  closeSupplierModal: () => void;
  setActiveTab: (tab: 'purchases' | 'suppliers') => void;
}

export const usePurchaseUIStore = create<PurchaseUIState>((set) => ({
  isPurchaseModalOpen: false,
  isSupplierModalOpen: false,
  selectedPurchaseId: null,
  selectedSupplierId: null,
  activeTab: 'purchases',
  openPurchaseModal: (id) => set({ isPurchaseModalOpen: true, selectedPurchaseId: id ?? null }),
  closePurchaseModal: () => set({ isPurchaseModalOpen: false, selectedPurchaseId: null }),
  openSupplierModal: (id) => set({ isSupplierModalOpen: true, selectedSupplierId: id ?? null }),
  closeSupplierModal: () => set({ isSupplierModalOpen: false, selectedSupplierId: null }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));

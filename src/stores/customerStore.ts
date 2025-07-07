// src/stores/customerStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Customer } from "@/types/customers.types";

interface DialogState {
  viewDialog: { isOpen: boolean; customerId: number | null };
  formDialog: { isOpen: boolean; customer: Customer | null };
  deleteDialog: { isOpen: boolean; customer: Customer | null };
}

interface CustomerState {
  dialogState: DialogState;
  // Acciones - Diálogos
  openViewDialog: (customerId: number) => void;
  closeViewDialog: () => void;
  openFormDialog: (customer?: Customer | null) => void;
  closeFormDialog: () => void;
  openDeleteDialog: (customer: Customer) => void;
  closeDeleteDialog: () => void;
}

export const useCustomerStore = create<CustomerState>()(
  devtools((set, get) => ({
    dialogState: {
      viewDialog: { isOpen: false, customerId: null },
      formDialog: { isOpen: false, customer: null },
      deleteDialog: { isOpen: false, customer: null },
    },

    // Acciones - Diálogos
    openViewDialog: (customerId) => {
      set((state) => ({
        dialogState: {
          ...state.dialogState,
          viewDialog: { isOpen: true, customerId },
        },
      }));
    },

    closeViewDialog: () => {
      set((state) => ({
        dialogState: {
          ...state.dialogState,
          viewDialog: { isOpen: false, customerId: null },
        },
      }));
    },

    openFormDialog: (customer = null) => {
      set((state) => ({
        dialogState: {
          ...state.dialogState,
          formDialog: { isOpen: true, customer },
        },
      }));
    },

    closeFormDialog: () => {
      set((state) => ({
        dialogState: {
          ...state.dialogState,
          formDialog: { isOpen: false, customer: null },
        },
      }));
    },

    openDeleteDialog: (customer) => {
      set((state) => ({
        dialogState: {
          ...state.dialogState,
          deleteDialog: { isOpen: true, customer },
        },
      }));
    },

    closeDeleteDialog: () => {
      set((state) => ({
        dialogState: {
          ...state.dialogState,
          deleteDialog: { isOpen: false, customer: null },
        },
      }));
    },
  }))
);

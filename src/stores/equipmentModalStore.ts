import { create } from "zustand";
import { Equipment } from "@/types/equipments.types";

interface EquipmentModalState {
  // Estados de los modales
  assignModalOpen: boolean;
  removeModalOpen: boolean;

  // Equipo seleccionado para operaciones
  selectedEquipment: Equipment | null;

  // Acciones para controlar los modales
  openAssignModal: (equipment?: Equipment) => void;
  closeAssignModal: () => void;
  openRemoveModal: (equipment: Equipment) => void;
  closeRemoveModal: () => void;
  setSelectedEquipment: (equipment: Equipment | null) => void;

  // Reset general
  reset: () => void;
}

export const useEquipmentModalStore = create<EquipmentModalState>((set) => ({
  // Estado inicial
  assignModalOpen: false,
  removeModalOpen: false,
  selectedEquipment: null,

  // Acciones para modal de asignación
  openAssignModal: (equipment) => {
    set({
      assignModalOpen: true,
      selectedEquipment: equipment || null,
    });
  },

  closeAssignModal: () => {
    set({
      assignModalOpen: false,
      selectedEquipment: null,
    });
  },

  // Acciones para modal de remoción
  openRemoveModal: (equipment) => {
    set({
      removeModalOpen: true,
      selectedEquipment: equipment,
    });
  },

  closeRemoveModal: () => {
    set({
      removeModalOpen: false,
      selectedEquipment: null,
    });
  },

  // Setters
  setSelectedEquipment: (equipment) => {
    set({ selectedEquipment: equipment });
  },

  // Reset todo el estado
  reset: () => {
    set({
      assignModalOpen: false,
      removeModalOpen: false,
      selectedEquipment: null,
    });
  },
}));

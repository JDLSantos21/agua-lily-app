"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  EllipsisVertical,
  Settings,
  Users,
  UserMinus,
  Plus,
} from "lucide-react";
import Link from "next/link";
import NewEquipmentModal from "./components/new-equipment-modal";
import NewEquipmentModelModal from "./components/new-equipment-model-modal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AssignCustomerModal from "./components/assign-customer-modal";
import RemoveAssignmentModal from "./components/remove-assignment-modal";

export default function VehiclesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Estados para controlar los modales
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [newEquipmentModalOpen, setNewEquipmentModalOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Función para manejar el éxito de las operaciones
  const handleModalSuccess = () => {
    // Cerrar popover después de una acción exitosa
    setPopoverOpen(false);
    // Aquí podrías agregar lógica adicional como refrescar datos
  };

  // Handlers para abrir modales
  const handleOpenAssignModal = () => {
    setAssignModalOpen(true);
    setPopoverOpen(false); // Cerrar popover al abrir modal
  };

  const handleOpenRemoveModal = () => {
    setRemoveModalOpen(true);
    setPopoverOpen(false); // Cerrar popover al abrir modal
  };

  const handleOpenNewEquipmentModal = () => {
    setNewEquipmentModalOpen(true);
    setPopoverOpen(false); // Cerrar popover al abrir modal
  };

  return (
    <div className="p-6">
      <div>
        {/* Header */}
        <div>
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild className="h-9 w-9 p-0">
              <Link href="/activos">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Gestión de Equipos
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Control y administración de la flota de equipos
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <NewEquipmentModal />

                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="relative">
                      <EllipsisVertical className="w-5 h-5 text-blue-600" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2" align="end">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={handleOpenAssignModal}
                        className="hover:bg-gray-100 w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 flex items-center gap-2 transition-colors"
                      >
                        <Users className="h-4 w-4 text-blue-600" />
                        Asignar cliente
                      </button>
                      <button
                        onClick={handleOpenRemoveModal}
                        className="hover:bg-gray-100 w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 flex items-center gap-2 transition-colors"
                      >
                        <UserMinus className="h-4 w-4 text-red-600" />
                        Quitar asignación
                      </button>
                      <button
                        onClick={handleOpenNewEquipmentModal}
                        className="hover:bg-gray-100 w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 flex items-center gap-2 transition-colors"
                      >
                        <Plus className="h-4 w-4 text-gray-700" />
                        Crear nuevo modelo
                      </button>
                      <div className="my-1 border-t border-gray-200" />
                      <button
                        className="hover:bg-gray-100 w-full text-left px-3 py-2 rounded-md text-sm text-gray-500 cursor-not-allowed"
                        disabled
                      >
                        Más opciones
                        <span className="text-xs ml-2">(Próximamente)</span>
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {children}

        {/* Modales */}

        <NewEquipmentModelModal
          open={newEquipmentModalOpen}
          onOpenChange={setNewEquipmentModalOpen}
        />

        <AssignCustomerModal
          open={assignModalOpen}
          onOpenChange={setAssignModalOpen}
          onSuccess={handleModalSuccess}
        />

        <RemoveAssignmentModal
          open={removeModalOpen}
          onOpenChange={setRemoveModalOpen}
          onSuccess={handleModalSuccess}
        />
      </div>
    </div>
  );
}

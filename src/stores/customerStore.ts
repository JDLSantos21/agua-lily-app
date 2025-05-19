// src/stores/customerStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  Customer,
  CustomerFilter,
  CustomerStatus,
} from "@/types/customers.types";
import {
  getCustomers,
  getCustomerById,
  getCustomerWithEquipment,
  createCustomer as apiCreateCustomer,
  updateCustomer as apiUpdateCustomer,
  updateCustomerStatus as apiUpdateCustomerStatus,
  deleteCustomer as apiDeleteCustomer,
  getCustomerStats,
} from "@/api/customers";
import { toast } from "sonner";

interface DialogState {
  viewDialog: { isOpen: boolean; customerId: number | null };
  formDialog: { isOpen: boolean; customer: Customer | null };
  deleteDialog: { isOpen: boolean; customer: Customer | null };
}

interface CustomerState {
  // Datos
  customers: Customer[];
  selectedCustomer: Customer | null;
  customerStats: any | null;
  customerDetails: Record<number, Customer>;
  customerWithEquipment: Record<number, any>;
  pagination: {
    total: number;
    limit: number | null;
    offset: number;
  } | null;

  // Estado UI
  isLoading: boolean;
  isLoadingDetails: boolean;
  isLoadingStats: boolean;
  error: string | null;
  filters: CustomerFilter;
  dialogState: DialogState;

  // Acciones - Datos
  setFilters: (filters: CustomerFilter) => void;
  selectCustomer: (customer: Customer | null) => void;
  fetchCustomers: () => Promise<void>;
  fetchCustomerById: (id: number) => Promise<Customer | null>;
  fetchCustomerWithEquipment: (id: number) => Promise<any | null>;
  fetchCustomerStats: () => Promise<void>;

  // Acciones - Diálogos
  openViewDialog: (customerId: number) => void;
  closeViewDialog: () => void;
  openFormDialog: (customer?: Customer | null) => void;
  closeFormDialog: () => void;
  openDeleteDialog: (customer: Customer) => void;
  closeDeleteDialog: () => void;

  // Acciones - Mutaciones
  createCustomer: (customer: Omit<Customer, "id">) => Promise<void>;
  updateCustomer: (id: number, data: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: number) => Promise<void>;
  updateCustomerStatus: (id: number, status: CustomerStatus) => Promise<void>;
}

export const useCustomerStore = create<CustomerState>()(
  devtools(
    (set, get) => ({
      // Estado inicial
      customers: [],
      selectedCustomer: null,
      customerStats: null,
      customerDetails: {},
      customerWithEquipment: {},
      pagination: null,
      isLoading: false,
      isLoadingDetails: false,
      isLoadingStats: false,
      error: null,
      filters: {},
      dialogState: {
        viewDialog: { isOpen: false, customerId: null },
        formDialog: { isOpen: false, customer: null },
        deleteDialog: { isOpen: false, customer: null },
      },

      // Acciones - Datos
      setFilters: (filters) => {
        set({ filters });
        // Cuando cambian los filtros, recargar los datos automáticamente
        get().fetchCustomers();
      },

      selectCustomer: (customer) => set({ selectedCustomer: customer }),

      fetchCustomers: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await getCustomers(get().filters);
          set({
            customers: response.data,
            pagination: response.pagination,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Error al cargar clientes",
          });
        }
      },

      fetchCustomerById: async (id) => {
        // Si ya tenemos el cliente en caché, lo devolvemos
        if (get().customerDetails[id]) {
          return get().customerDetails[id];
        }

        set({ isLoadingDetails: true, error: null });
        try {
          const response = await getCustomerById(id);
          // Actualizamos el caché de detalles
          set((state) => ({
            customerDetails: {
              ...state.customerDetails,
              [id]: response.data,
            },
            isLoadingDetails: false,
          }));
          return response.data;
        } catch (error) {
          set({
            isLoadingDetails: false,
            error:
              error instanceof Error
                ? error.message
                : "Error al cargar cliente",
          });
          return null;
        }
      },

      fetchCustomerWithEquipment: async (id) => {
        set({ isLoadingDetails: true, error: null });
        try {
          const response = await getCustomerWithEquipment(id);
          // Actualizamos el caché
          set((state) => ({
            customerWithEquipment: {
              ...state.customerWithEquipment,
              [id]: response.data,
            },
            isLoadingDetails: false,
          }));
          return response.data;
        } catch (error) {
          set({
            isLoadingDetails: false,
            error:
              error instanceof Error
                ? error.message
                : "Error al cargar cliente con equipos",
          });
          return null;
        }
      },

      fetchCustomerStats: async () => {
        set({ isLoadingStats: true, error: null });
        try {
          const response = await getCustomerStats();
          set({ customerStats: response.data, isLoadingStats: false });
        } catch (error) {
          set({
            isLoadingStats: false,
            error:
              error instanceof Error
                ? error.message
                : "Error al cargar estadísticas",
          });
        }
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

      // Acciones - Mutaciones
      createCustomer: async (customer) => {
        try {
          await apiCreateCustomer(customer);
          toast.success("Cliente creado exitosamente");
          // Refrescar la lista de clientes y estadísticas
          await get().fetchCustomers();
          await get().fetchCustomerStats();
          // Cerrar el diálogo de formulario
          get().closeFormDialog();
          return;
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Error al crear cliente"
          );
          throw error;
        }
      },

      updateCustomer: async (id, data) => {
        try {
          await apiUpdateCustomer(id, data);
          toast.success("Cliente actualizado exitosamente");
          // Refrescar la lista de clientes y estadísticas
          await get().fetchCustomers();
          await get().fetchCustomerStats();
          // Actualizar caché de detalles
          if (get().customerDetails[id]) {
            set((state) => ({
              customerDetails: {
                ...state.customerDetails,
                [id]: { ...state.customerDetails[id], ...data },
              },
            }));
          }
          // Cerrar el diálogo de formulario
          get().closeFormDialog();
          return;
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Error al actualizar cliente"
          );
          throw error;
        }
      },

      deleteCustomer: async (id) => {
        try {
          await apiDeleteCustomer(id);
          toast.success("Cliente eliminado exitosamente");
          // Refrescar la lista de clientes y estadísticas
          await get().fetchCustomers();
          await get().fetchCustomerStats();
          // Eliminar de caché
          set((state) => {
            const { [id]: removed, ...restDetails } = state.customerDetails;
            const { [id]: removedWithEquip, ...restWithEquip } =
              state.customerWithEquipment;
            return {
              customerDetails: restDetails,
              customerWithEquipment: restWithEquip,
            };
          });
          // Cerrar el diálogo de confirmación
          get().closeDeleteDialog();
          return;
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Error al eliminar cliente"
          );
          throw error;
        }
      },

      updateCustomerStatus: async (id, status) => {
        try {
          await apiUpdateCustomerStatus(id, status);
          toast.success(
            `Cliente ${status === CustomerStatus.ACTIVE ? "activado" : "desactivado"} exitosamente`
          );
          // Refrescar la lista de clientes y estadísticas
          await get().fetchCustomers();
          await get().fetchCustomerStats();
          // Actualizar caché de detalles
          if (get().customerDetails[id]) {
            set((state) => ({
              customerDetails: {
                ...state.customerDetails,
                [id]: { ...state.customerDetails[id], status },
              },
            }));
          }
          // Actualizar caché de cliente con equipo
          if (get().customerWithEquipment[id]) {
            set((state) => ({
              customerWithEquipment: {
                ...state.customerWithEquipment,
                [id]: { ...state.customerWithEquipment[id], status },
              },
            }));
          }
          return;
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Error al actualizar estado del cliente"
          );
          throw error;
        }
      },
    }),
    {
      name: "customer-store",
    }
  )
);

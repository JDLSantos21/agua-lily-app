// src/stores/orderStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  Order,
  OrderFilter,
  Product,
  OrderStats,
  DashboardData,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
  AssignDeliveryRequest,
} from "@/types/orders.types";
import {
  getOrders,
  getOrderById,
  getOrderByTrackingCode,
  updateOrder as apiUpdateOrder,
  updateOrderStatus as apiUpdateOrderStatus,
  assignDelivery as apiAssignDelivery,
  deleteOrder as apiDeleteOrder,
  getScheduledForDate,
  searchOrders,
  getPendingByDriver,
  getPendingByCustomer,
  getProducts,
  getOrderStats,
  getDashboardData,
} from "@/api/orders";
import { toast } from "sonner";

interface DialogState {
  viewDialog: { isOpen: boolean; orderId: number | null };
  formDialog: { isOpen: boolean; order: Order | null };
  deleteDialog: { isOpen: boolean; order: Order | null };
  statusDialog: { isOpen: boolean; order: Order | null };
  assignDialog: { isOpen: boolean; order: Order | null };
}

interface OrderState {
  // Datos
  orders: Order[];
  selectedOrder: Order | null;
  orderStats: OrderStats | null;
  dashboardData: DashboardData | null;
  orderDetails: Record<number, Order>;
  products: Product[];
  pagination: {
    total: number;
    limit: number | null;
    offset: number;
  } | null;

  // Estado UI
  isLoading: boolean;
  isLoadingDetails: boolean;
  isLoadingStats: boolean;
  isLoadingProducts: boolean;
  error: string | null;
  filters: OrderFilter;
  dialogState: DialogState;

  // Acciones - Datos
  setFilters: (filters: OrderFilter) => void;
  selectOrder: (order: Order | null) => void;
  fetchOrders: () => Promise<void>;
  fetchOrderById: (id: number) => Promise<Order | null>;
  fetchOrderByTracking: (trackingCode: string) => Promise<Order | null>;
  fetchOrdersForDate: (date: string) => Promise<Order[]>;
  fetchOrderStats: () => Promise<void>;
  fetchDashboardData: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  searchOrdersByTerm: (term: string, limit?: number) => Promise<Order[]>;
  fetchPendingByDriver: (driverId: number) => Promise<Order[]>;
  fetchPendingByCustomer: (customerId: number) => Promise<Order[]>;

  // Acciones - Diálogos
  openViewDialog: (orderId: number) => void;
  closeViewDialog: () => void;
  openFormDialog: (order?: Order | null) => void;
  closeFormDialog: () => void;
  openDeleteDialog: (order: Order) => void;
  closeDeleteDialog: () => void;
  openStatusDialog: (order: Order) => void;
  closeStatusDialog: () => void;
  openAssignDialog: (order: Order) => void;
  closeAssignDialog: () => void;

  // Acciones - Mutaciones
  createOrder: (order: CreateOrderRequest) => Promise<void>;
  updateOrder: (id: number, data: Partial<Order>) => Promise<void>;
  deleteOrder: (id: number) => Promise<void>;
  updateOrderStatus: (
    id: number,
    data: UpdateOrderStatusRequest
  ) => Promise<void>;
  assignDelivery: (id: number, data: AssignDeliveryRequest) => Promise<void>;
}

export const useOrderStore = create<OrderState>()(
  devtools(
    (set, get) => ({
      // Estado inicial
      orders: [],
      selectedOrder: null,
      orderStats: null,
      dashboardData: null,
      orderDetails: {},
      products: [],
      pagination: null,
      isLoading: false,
      isLoadingDetails: false,
      isLoadingStats: false,
      isLoadingProducts: false,
      error: null,
      filters: {},
      dialogState: {
        viewDialog: { isOpen: false, orderId: null },
        formDialog: { isOpen: false, order: null },
        deleteDialog: { isOpen: false, order: null },
        statusDialog: { isOpen: false, order: null },
        assignDialog: { isOpen: false, order: null },
      },

      // Acciones - Datos
      setFilters: (filters) => {
        set({ filters });
        // Cuando cambian los filtros, recargar los datos automáticamente
        get().fetchOrders();
      },

      selectOrder: (order) => set({ selectedOrder: order }),

      fetchOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          if (!get().filters?.order_status) {
            delete get().filters.order_status;
          }
          const response = await getOrders(get().filters);
          set({
            orders: response.data,
            pagination: response.pagination,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Error al cargar pedidos",
          });
        }
      },

      fetchOrderById: async (id) => {
        // Si ya tenemos el pedido en caché, lo devolvemos
        if (get().orderDetails[id]) {
          return get().orderDetails[id];
        }

        set({ isLoadingDetails: true, error: null });
        try {
          const response = await getOrderById(id);
          // Actualizamos el caché de detalles
          set((state) => ({
            orderDetails: {
              ...state.orderDetails,
              [id]: response.data,
            },
            isLoadingDetails: false,
          }));
          return response.data;
        } catch (error) {
          set({
            isLoadingDetails: false,
            error:
              error instanceof Error ? error.message : "Error al cargar pedido",
          });
          return null;
        }
      },

      fetchOrderByTracking: async (trackingCode) => {
        set({ isLoadingDetails: true, error: null });
        try {
          const response = await getOrderByTrackingCode(trackingCode);
          set({ isLoadingDetails: false });

          // Si el pedido tiene ID, lo guardamos en caché
          if (response.data.id) {
            set((state) => ({
              orderDetails: {
                ...state.orderDetails,
                [response.data.id as number]: response.data,
              },
            }));
          }

          return response.data;
        } catch (error) {
          set({
            isLoadingDetails: false,
            error:
              error instanceof Error ? error.message : "Error al cargar pedido",
          });
          return null;
        }
      },

      fetchOrdersForDate: async (date) => {
        set({ isLoading: true, error: null });
        try {
          const response = await getScheduledForDate(date);
          set({ isLoading: false });
          return response.data;
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Error al cargar pedidos para la fecha",
          });
          return [];
        }
      },

      fetchOrderStats: async () => {
        set({ isLoadingStats: true, error: null });
        try {
          const response = await getOrderStats();
          set({ orderStats: response.data, isLoadingStats: false });
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

      fetchDashboardData: async () => {
        set({ isLoadingStats: true, error: null });
        try {
          const response = await getDashboardData();
          set({ dashboardData: response.data, isLoadingStats: false });
        } catch (error) {
          set({
            isLoadingStats: false,
            error:
              error instanceof Error
                ? error.message
                : "Error al cargar datos del dashboard",
          });
        }
      },

      fetchProducts: async () => {
        set({ isLoadingProducts: true, error: null });
        try {
          const response = await getProducts();
          set({ products: response.data, isLoadingProducts: false });
        } catch (error) {
          set({
            isLoadingProducts: false,
            error:
              error instanceof Error
                ? error.message
                : "Error al cargar productos",
          });
        }
      },

      searchOrdersByTerm: async (term, limit = 10) => {
        set({ isLoading: true, error: null });
        try {
          const response = await searchOrders(term, limit);
          set({ isLoading: false });
          return response.data;
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Error al buscar pedidos",
          });
          return [];
        }
      },

      fetchPendingByDriver: async (driverId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await getPendingByDriver(driverId);
          set({ isLoading: false });
          return response.data;
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Error al cargar pedidos pendientes por conductor",
          });
          return [];
        }
      },

      fetchPendingByCustomer: async (customerId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await getPendingByCustomer(customerId);
          set({ isLoading: false });
          return response.data;
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Error al cargar pedidos pendientes por cliente",
          });
          return [];
        }
      },

      // Acciones - Diálogos
      openViewDialog: (orderId) => {
        set((state) => ({
          dialogState: {
            ...state.dialogState,
            viewDialog: { isOpen: true, orderId },
          },
        }));
      },

      closeViewDialog: () => {
        set((state) => ({
          dialogState: {
            ...state.dialogState,
            viewDialog: { isOpen: false, orderId: null },
          },
        }));
      },

      openFormDialog: (order = null) => {
        set((state) => ({
          dialogState: {
            ...state.dialogState,
            formDialog: { isOpen: true, order },
          },
        }));
      },

      closeFormDialog: () => {
        set((state) => ({
          dialogState: {
            ...state.dialogState,
            formDialog: { isOpen: false, order: null },
          },
        }));
      },

      openDeleteDialog: (order) => {
        set((state) => ({
          dialogState: {
            ...state.dialogState,
            deleteDialog: { isOpen: true, order },
          },
        }));
      },

      closeDeleteDialog: () => {
        set((state) => ({
          dialogState: {
            ...state.dialogState,
            deleteDialog: { isOpen: false, order: null },
          },
        }));
      },

      openStatusDialog: (order) => {
        set((state) => ({
          dialogState: {
            ...state.dialogState,
            statusDialog: { isOpen: true, order },
          },
        }));
      },

      closeStatusDialog: () => {
        set((state) => ({
          dialogState: {
            ...state.dialogState,
            statusDialog: { isOpen: false, order: null },
          },
        }));
      },

      openAssignDialog: (order) => {
        set((state) => ({
          dialogState: {
            ...state.dialogState,
            assignDialog: { isOpen: true, order },
          },
        }));
      },

      closeAssignDialog: () => {
        set((state) => ({
          dialogState: {
            ...state.dialogState,
            assignDialog: { isOpen: false, order: null },
          },
        }));
      },

      // Acciones - Mutaciones
      createOrder: async (orderData) => {
        try {
          toast.success("Pedido creado exitosamente");

          // Refrescar la lista de pedidos
          await get().fetchOrders();
          await get().fetchOrderStats();

          // Cerrar el diálogo de formulario
          get().closeFormDialog();

          return;
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Error al crear pedido"
          );
          throw error;
        }
      },

      updateOrder: async (id, data) => {
        try {
          await apiUpdateOrder(id, data);
          toast.success("Pedido actualizado exitosamente");

          // Refrescar la lista de pedidos y estadísticas
          await get().fetchOrders();
          await get().fetchOrderStats();

          // Actualizar caché de detalles
          if (get().orderDetails[id]) {
            set((state) => ({
              orderDetails: {
                ...state.orderDetails,
                [id]: { ...state.orderDetails[id], ...data },
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
              : "Error al actualizar pedido"
          );
          throw error;
        }
      },

      deleteOrder: async (id) => {
        try {
          await apiDeleteOrder(id);
          toast.success("Pedido eliminado exitosamente");

          // Refrescar la lista de pedidos y estadísticas
          await get().fetchOrders();
          await get().fetchOrderStats();

          // Eliminar de caché
          set((state) => {
            const { [id]: removed, ...restDetails } = state.orderDetails;
            return {
              orderDetails: restDetails,
            };
          });

          // Cerrar el diálogo de confirmación
          get().closeDeleteDialog();

          return;
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Error al eliminar pedido"
          );
          throw error;
        }
      },

      updateOrderStatus: async (id, data) => {
        try {
          await apiUpdateOrderStatus(id, data);
          toast.success(`Pedido actualizado a estado "${data.status}"`);

          // Refrescar la lista de pedidos y estadísticas
          await get().fetchOrders();
          await get().fetchOrderStats();

          // Actualizar caché de detalles
          if (get().orderDetails[id]) {
            set((state) => ({
              orderDetails: {
                ...state.orderDetails,
                [id]: {
                  ...state.orderDetails[id],
                  order_status: data.status,
                },
              },
            }));
          }

          // Cerrar el diálogo de estado
          get().closeStatusDialog();

          return;
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Error al actualizar estado del pedido"
          );
          throw error;
        }
      },

      assignDelivery: async (id, data) => {
        try {
          await apiAssignDelivery(id, data);
          toast.success(`Entrega asignada exitosamente`);

          // Refrescar la lista de pedidos
          await get().fetchOrders();

          // Actualizar caché de detalles
          if (get().orderDetails[id]) {
            set((state) => ({
              orderDetails: {
                ...state.orderDetails,
                [id]: {
                  ...state.orderDetails[id],
                  delivery_driver_id: data.delivery_driver_id,
                  vehicle_id: data.vehicle_id,
                },
              },
            }));
          }

          // Cerrar el diálogo de asignación
          get().closeAssignDialog();

          return;
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Error al asignar entrega"
          );
          throw error;
        }
      },
    }),
    {
      name: "order-store",
    }
  )
);

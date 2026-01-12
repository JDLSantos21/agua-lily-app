/**
 * Utilidades para contactar clientes
 */

/**
 * Formatea un número de teléfono para mostrar
 * @param phone Número de teléfono
 * @returns Número formateado
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remover caracteres no numéricos
  const cleaned = phone.replace(/\D/g, "");

  // Formato: (809) 555-1234
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  return phone;
};

/**
 * Abre WhatsApp con un mensaje predefinido
 * @param phone Número de teléfono
 * @param message Mensaje opcional
 */
export const openWhatsApp = (phone: string, message?: string): void => {
  // Limpiar número de teléfono
  const cleaned = phone.replace(/\D/g, "");

  // Construir URL de WhatsApp
  const baseUrl = "https://wa.me/";
  const fullPhone = cleaned.startsWith("1") ? cleaned : `1${cleaned}`; // Agregar código de país si no existe
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : "";

  const url = `${baseUrl}${fullPhone}${encodedMessage}`;

  // Abrir en nueva ventana
  window.open(url, "_blank");
};

/**
 * Inicia una llamada telefónica
 * @param phone Número de teléfono
 */
export const makePhoneCall = (phone: string): void => {
  const cleaned = phone.replace(/\D/g, "");
  window.location.href = `tel:${cleaned}`;
};

/**
 * Genera un mensaje de WhatsApp para cliente inactivo
 * @param customerName Nombre del cliente
 * @param productType Tipo de producto
 * @param daysWithoutOrder Días sin pedido
 * @returns Mensaje generado
 */
export const generateInactiveCustomerMessage = (
  customerName: string,
  productType: string,
  daysWithoutOrder: number
): string => {
  const greeting = getGreeting();
  return `${greeting} ${customerName}, notamos que no has pedido ${productType} en ${daysWithoutOrder} días. ¿Podemos ayudarte con un nuevo pedido? 🙂`;
};

/**
 * Obtiene un saludo basado en la hora del día
 */
const getGreeting = (): string => {
  const hour = new Date().getHours();

  if (hour < 12) return "Buenos días";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
};

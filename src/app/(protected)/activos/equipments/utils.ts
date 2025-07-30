export const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "disponible":
      return "bg-green-100 text-green-800";
    case "asignado":
      return "bg-blue-100 text-blue-800";
    case "mantenimiento":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusText = (status: string) => {
  switch (status?.toLowerCase()) {
    case "disponible":
      return "Disponible";
    case "asignado":
      return "Asignado";
    case "mantenimiento":
      return "Mantenimiento";
    default:
      return status || "Sin estado";
  }
};

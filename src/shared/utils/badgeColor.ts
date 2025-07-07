export function getStatusBadgeColor(status: string | undefined | null): string {
  switch (status) {
    case "pendiente":
      return "bg-yellow-500 text-white";
    case "preparando":
      return "bg-blue-500 text-white";
    case "entregado":
      return "bg-green-500 text-white";
    case "cancelado":
      return "bg-red-500 text-white";
    case "despachado":
      return "bg-purple-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
}

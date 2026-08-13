export function getBookingStatusClassName(status: string) {
  if (status === "Confirmat") {
    return "bg-green-100 text-green-600"
  }

  if (status === "Anulat") {
    return "bg-red-100 text-red-600"
  }

  if (status === "Finalizat") {
    return "bg-gray-200 text-gray-600"
  }

  return "bg-yellow-100 text-yellow-600"
}

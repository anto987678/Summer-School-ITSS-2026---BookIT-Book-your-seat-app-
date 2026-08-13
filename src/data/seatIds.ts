export const seatIds = [
  "P-B0-01",
  "P-B0-02",
  "P-B0-03",
  "P-B0-04",
  "P-B0-05",
  "P-B0-06",
  "P-B0-07",
  "P-B0-08",
  "P-B0-09",
  "P-B0-10",
  "P-B0-11",
  "P-B0-12",
  "P-SD0-01",
  "P-SD0-02",
  "P-SD0-03",
  "P-SD0-04",
  "P-SD0-05",
  "P-SD0-06",
  "P-SD0-07",
  "P-SD0-08",
  "T1-G2-01",
  "T1-G2-02",
  "T1-G2-03",
  "T1-G2-04",
  "T1-G2-05",
  "T1-G2-06",
  "T1-G2-07",
  "T1-G2-08",
] as const

export type SeatId = typeof seatIds[number]

export const getSeatFloor = (seatId: string) => {
  if (seatId.startsWith("P-")) return "Parter"
  if (seatId.startsWith("T1-")) return "T1"
  if (seatId.startsWith("T2-")) return "T2"
  return "Altul"
}

export const getSeatRoom = (seatId: string) => {
  const parts = seatId.split("-")
  return parts.length >= 2 ? parts[1] : "Altul"
}

export const seatOptions = seatIds.map((id) => ({
  id,
  floor: getSeatFloor(id),
  room: getSeatRoom(id),
}))

export const seatFloors = Array.from(
  new Set(seatOptions.map((seat) => seat.floor)),
)

export const getSeatRoomsForFloor = (floor: string) =>
  Array.from(
    new Set(
      seatOptions
        .filter((seat) => floor === "" || seat.floor === floor)
        .map((seat) => seat.room),
    ),
  )


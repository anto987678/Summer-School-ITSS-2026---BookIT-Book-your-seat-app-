export interface Seat {
  id: string
  row: string
  number: number
  isBooked: boolean
  occupant?: string
}

export interface Booking {
  seatId: string
  occupant: string
  date: string
}

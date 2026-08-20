export type BookingTab = "Viitoare" | "Trecute" | "Anulate"

export type Booking = {
  id: number;
  title: string;
  date: string;
  seat: string;
  room: string;
  time: string;
  status: string;
  tab: BookingTab;
  startDateTime: string;
  endDateTime: string;
  seatCode?: string;
  roomCode?: string;
};

export const bookingTabs: BookingTab[] = ["Viitoare", "Trecute", "Anulate"]

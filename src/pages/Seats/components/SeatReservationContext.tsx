import { createContext, useContext } from 'react';

type SeatReservationContextValue = {
  getReservationUser: (seatCode: string) => string | undefined;
};

export const SeatReservationContext = createContext<SeatReservationContextValue | null>(null);

export const useSeatReservation = () => useContext(SeatReservationContext);
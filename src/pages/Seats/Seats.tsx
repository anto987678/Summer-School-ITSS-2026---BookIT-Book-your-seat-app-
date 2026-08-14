import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { ComponentType } from 'react';
import ParterMap from './components/ParterMap';
import SeatsNavbar, { seatTabs } from './components/SeatsNavbar';
import T1Etaj1Map from './components/T1Etaj1Map';
import T2Etaj1Map from './components/T2Etaj1Map';
import T1Etaj2Map from './components/T1Etaj2Map';
import AIAssistant from '@/pages/AIAssistant';
import T2Etaj2Map from './components/T2Etaj2Map';

type SeatStatus = 'available' | 'occupied' | 'unavailable' | 'pending';

type SeatMapProps = {
  getSeatStatus: (id: string) => SeatStatus;
  onRoomSelect?: (val: boolean) => void;
  onSeatSelect?: (val: boolean) => void;
  onOccupiedSelect?: (val: boolean) => void;
  onSelectedSeatChange?: (seatCode: string) => void;
};

type MapConfig = {
  Component: ComponentType<SeatMapProps>;
  width: number;
  height: number;
};

const mapByTab = {
  Parter: { Component: ParterMap, width: 1000, height: 650 },
  'T1,etaj 1': { Component: T1Etaj1Map, width: 870, height: 700 },
  'T2,etaj 1': { Component: T2Etaj1Map, width: 1000, height: 650 },
  'T1,etaj 2': { Component: T1Etaj2Map, width: 870, height: 700 },
  'T2,etaj 2': { Component: T2Etaj2Map, width: 1000, height: 620 },
} as const;

type SeatTab = typeof seatTabs[number];

type BackendSeat = {
  id: number;
  code: string;
  status: string;
  type?: string;
  room?: {
    id: number;
    code: string;
    name: string;
  } | null;
};

const roomCodeBySeatPrefix: Array<[string, string]> = [
  ['P-SD0-', 'SD0'],
  ['P-S0-', 'S0'],
  ['P-B0-', 'B0'],
  ['T1-SD1-', 'E1'],
  ['T1-E1-', 'E1'],
  ['T1-S1-', 'S1'],
  ['T1-G2-', 'G2'],
  ['T2-404-', '404'],
  ['T2-B1-', 'B1'],
  ['T2-O2-', 'O2'],
  ['T2-SD2-', 'B2'],
  ['T2-B2-', 'B2'],
];

const getRoomCodeFromSeatCode = (seatCode: string) => {
  const match = roomCodeBySeatPrefix.find(([prefix]) => seatCode.startsWith(prefix));
  return match?.[1] ?? '';
};
type BackendReservation = {
  id: number;
  status: string;
  seat?: BackendSeat | null;
  room?: BackendSeat["room"] | null;
};

const ResponsiveMap = ({ Component, width, height, onRoomSelect, onSeatSelect, onOccupiedSelect, onSelectedSeatChange, getSeatStatus }: MapConfig & { onRoomSelect: (val: boolean) => void; onSeatSelect: (val: boolean) => void; onOccupiedSelect: (val: boolean) => void; onSelectedSeatChange?: (seatCode: string) => void; getSeatStatus: (id: string) => SeatStatus }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const updateScale = () => {
      const shouldUseScroll = window.innerWidth < 1024 && wrapper.clientWidth < width;
      setScale(shouldUseScroll ? 1 : Math.min(1, wrapper.clientWidth / width));
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(wrapper);

    return () => observer.disconnect();
  }, [width]);

  return (
    <div ref={wrapperRef} className="w-full overflow-x-auto overflow-y-hidden px-2 pb-8 sm:px-4 lg:overflow-x-hidden">
      <div className="mx-auto" style={{ width: width * scale, height: height * scale }}>
        <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <Component
            getSeatStatus={getSeatStatus}
            onRoomSelect={onRoomSelect}
            onSeatSelect={onSeatSelect}
            onOccupiedSelect={onOccupiedSelect}
            onSelectedSeatChange={onSelectedSeatChange}
          />
        </div>
      </div>
    </div>
  );
};

const Seats = () => {
  const [activeTab, setActiveTab] = useState<SeatTab>('Parter');
  const activeMap = mapByTab[activeTab as keyof typeof mapByTab];
  const location = useLocation();

  const bookingDate = location.state?.date;
  const startHour = location.state?.startHour;
  const endHour = location.state?.endHour;
  const startDateTime = bookingDate && startHour !== undefined ? `${bookingDate}T${String(startHour).padStart(2, "0")}:00:00` : "";
  const endDateTime = bookingDate && endHour !== undefined ? `${bookingDate}T${String(endHour).padStart(2, "0")}:00:00` : "";

  const [isRoomSelected, setIsRoomSelected] = useState(false);
  const [hasSelectedSeat, setHasSelectedSeat] = useState(false);
  const [hasOccupiedSeat, setHasOccupiedSeat] = useState(false);
  const [seats, setSeats] = useState<BackendSeat[]>([]);
  const [activeReservations, setActiveReservations] = useState<BackendReservation[]>([]);
  const [selectedSeatCode, setSelectedSeatCode] = useState("");
  
  useEffect(() => {
    fetch("http://localhost:8080/locuri", { credentials: "include" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Nu s-au putut incarca locurile");
        }

        return response.json();
      })
      .then((data: BackendSeat[]) => setSeats(Array.isArray(data) ? data : []))
      .catch(() => setSeats([]));
  }, []);

  useEffect(() => {
    if (!startDateTime || !endDateTime) {
      setActiveReservations([]);
      return;
    }

    const params = new URLSearchParams({
      start: startDateTime,
      end: endDateTime,
    });

    fetch(`http://localhost:8080/reservations/active?${params.toString()}`, { credentials: "include" })
      .then((response) => (response.ok ? response.json() : []))
      .then((data: BackendReservation[]) => setActiveReservations(Array.isArray(data) ? data : []))
      .catch(() => setActiveReservations([]));
  }, [startDateTime, endDateTime]);

  const normalizeSeatStatus = (status?: string): SeatStatus => {
    const normalizedStatus = status?.trim().toUpperCase().replace(/[\s-]+/g, "_");

    if (["OCCUPIED", "APPROVED", "CONFIRMED", "ACCEPTED"].includes(normalizedStatus ?? "")) return "occupied";
    if (normalizedStatus === "UNAVAILABLE") return "unavailable";
    if (normalizedStatus === "PENDING" || normalizedStatus === "IN_REVIEW") return "pending";

    return "available";
  };

  const seatStatusByCode = new Map(
    seats.map((seat) => [seat.code.trim(), normalizeSeatStatus(seat.status)])
  );

  const applyActiveStatus = <T,>(map: Map<T, SeatStatus>, key: T, status: SeatStatus) => {
    const currentStatus = map.get(key);
    if (currentStatus !== "occupied") {
      map.set(key, status);
    }
  };

  const activeSeatStatusByCode = new Map<string, SeatStatus>();
  const activeRoomStatusById = new Map<number, SeatStatus>();

  activeReservations.forEach((reservation) => {
    const status = normalizeSeatStatus(reservation.status);

    if (status !== "occupied" && status !== "pending") {
      return;
    }

    const seatCode = reservation.seat?.code?.trim();
    const roomId = reservation.room?.id;

    if (seatCode) {
      applyActiveStatus(activeSeatStatusByCode, seatCode, status);
    }

    if (roomId) {
      applyActiveStatus(activeRoomStatusById, roomId, status);
    }
  });

  const getSeatStatus = (code: string): SeatStatus => {
    const trimmedCode = code.trim();
    const seat = seats.find((currentSeat) => currentSeat.code.trim() === trimmedCode);
    const statusFromSeat = seatStatusByCode.get(trimmedCode) ?? "available";

    if (statusFromSeat === "unavailable") {
      return "unavailable";
    }

    const activeSeatStatus = activeSeatStatusByCode.get(trimmedCode);
    if (activeSeatStatus) {
      return activeSeatStatus;
    }

    const roomId = seat?.room?.id;
    if (roomId) {
      const activeRoomStatus = activeRoomStatusById.get(roomId);
      if (activeRoomStatus) {
        return activeRoomStatus;
      }
    }

    return "available";
  };

  const handleSelectedSeatChange = (seatCode: string) => {
    setSelectedSeatCode(seatCode);
    setHasSelectedSeat(Boolean(seatCode));
    setHasOccupiedSeat(false);
  };

  const selectedSeat = seats.find((seat) => seat.code.trim() === selectedSeatCode.trim());
  const selectedRoomCode = selectedSeat?.room?.code ?? getRoomCodeFromSeatCode(selectedSeatCode);

  return (
    <div className="min-h-screen bg-[#F5F3FF]">
      <SeatsNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isRoomSelected={isRoomSelected}
        hasSelectedSeat={hasSelectedSeat}
        hasOccupiedSeatSelected={hasOccupiedSeat}
        selectedSeatCode={selectedSeatCode}
        selectedRoomCode={selectedRoomCode}
      />

      {activeMap ? (
        <ResponsiveMap
          {...activeMap}
          onRoomSelect={setIsRoomSelected}
          onSeatSelect={setHasSelectedSeat}
          onOccupiedSelect={setHasOccupiedSeat}
          onSelectedSeatChange={handleSelectedSeatChange}
          getSeatStatus={getSeatStatus}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-gray-400">
          Harta pentru {activeTab} este in lucru...
        </div>
      )}

      <AIAssistant />
    </div>
  );
};

export default Seats;









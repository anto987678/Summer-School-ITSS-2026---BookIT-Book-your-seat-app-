import { useEffect, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import ParterMap from './components/ParterMap';
import SeatsNavbar, { seatTabs } from './components/SeatsNavbar';
import T1Etaj1Map from './components/T1Etaj1Map';
import T2Etaj1Map from './components/T2Etaj1Map';
import T1Etaj2Map from './components/T1Etaj2Map';
import AIAssistant from '@/pages/AIAssistant';
import T2Etaj2Map from './components/T2Etaj2Map';

type SeatStatus = 'available' | 'occupied' | 'unavailable' | 'in_review';

type SeatMapProps = {
  getSeatStatus: (id: string) => SeatStatus;
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
  id: number
  code: string
  status: string
  type?: string
}


const ResponsiveMap = ({ Component, width, height, onRoomSelect, onSeatSelect, onOccupiedSelect, getSeatStatus }: MapConfig & { onRoomSelect: (val: boolean) => void; onSeatSelect: (val: boolean) => void; onOccupiedSelect: (val: boolean) => void; getSeatStatus: (id: string) => SeatStatus }) => {
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

          <Component getSeatStatus={getSeatStatus} />
        </div>
      </div>
    </div>
  );
};

const Seats = () => {
  const [activeTab, setActiveTab] = useState<SeatTab>('Parter');
  const activeMap = mapByTab[activeTab as keyof typeof mapByTab];

  const [isRoomSelected, setIsRoomSelected] = useState(false);
  const [hasSelectedSeat, setHasSelectedSeat] = useState(false);
  const [seats, setSeats] = useState<BackendSeat[]>([])

  useEffect(() => {
    fetch("http://localhost:8080/locuri", { credentials: "include" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Nu s-au putut incarca locurile")
        }

        return response.json()
      })
      .then((data: BackendSeat[]) => setSeats(data))
      .catch(() => setSeats([]))
  }, [])

  const [hasOccupiedSeat, setHasOccupiedSeat] = useState(false);

  const normalizeSeatStatus = (status?: string): SeatStatus => {
    const normalizedStatus = status?.trim().toUpperCase().replace(/[\s-]+/g, "_")

    if (normalizedStatus === "OCCUPIED") return "occupied"
    if (normalizedStatus === "UNAVAILABLE") return "unavailable"
    if (normalizedStatus === "IN_REVIEW") return "in_review"

    return "available"
  }

  const seatStatusByCode = new Map(
    seats.map((seat) => [seat.code.trim(), normalizeSeatStatus(seat.status)])
  )

  const getSeatStatus = (code: string) => {
    return seatStatusByCode.get(code.trim()) ?? "available"
  }

  return (
    <div className="min-h-screen bg-[#F5F3FF]">
      <SeatsNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isRoomSelected={isRoomSelected}
        hasSelectedSeat={hasSelectedSeat}
        hasOccupiedSeatSelected={hasOccupiedSeat}
      />

      {activeMap ? (
        <ResponsiveMap
          {...activeMap}
          onRoomSelect={setIsRoomSelected}
          onSeatSelect={setHasSelectedSeat}
          onOccupiedSelect={setHasOccupiedSeat}
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

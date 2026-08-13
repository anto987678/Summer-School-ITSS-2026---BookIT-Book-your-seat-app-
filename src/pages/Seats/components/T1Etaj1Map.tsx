import { useSeatSelection } from '@/hooks/useSeatSelection';
import SingleSeat from './SingleSeat'

type SeatStatus = 'available' | 'occupied' | 'unavailable' | 'pending';

interface SeatMapProps {
    getSeatStatus: (id: string) => SeatStatus;
    onRoomSelect?: (isRoom: boolean) => void;
    onSeatSelect?: (hasSelected: boolean) => void;
    onOccupiedSelect?: (isOccupied: boolean) => void;
    onSelectedSeatChange?: (seatCode: string) => void;
}
const T1Etaj1Map = ({ getSeatStatus, onRoomSelect, onSeatSelect, onOccupiedSelect, onSelectedSeatChange }: SeatMapProps) => {
    const { handleSeatClick, getSelectedState } = useSeatSelection([
        { groupId: 'G-Evenimente', matches: (id: string) => id.includes('T1-SD1') || id.includes('T1-E1') },
        { groupId: 'G-S1', matches: (id: string) => id.includes('T1-S1') },
    ]);
    const handleSeatSelection = (id: string, type?: 'individual' | 'room') => {
        const wasSelectedBeforeClick = getSelectedState(id) !== null;
        const status = getSeatStatus(id);
        const isOccupied = status === 'occupied';

        if (status !== 'available') {
            onOccupiedSelect?.(isOccupied);
            return;
        }

        handleSeatClick(id);

        if (wasSelectedBeforeClick) {
            onSelectedSeatChange?.('');
            onRoomSelect?.(false);
            onSeatSelect?.(false);
            onOccupiedSelect?.(false);
            return;
        }

        onSelectedSeatChange?.(id);
        onRoomSelect?.(type === 'room');
        onSeatSelect?.(true);
        onOccupiedSelect?.(false);
    };

    return (
        <div className="relative mx-auto h-[700px] w-[870px] border border-gray-800 bg-[#F5F3FF] overflow-hidden shadow-sm">

            {/* ================= PEREČšII PRINCIPALI ================= */}
            <div className="absolute top-[400px] left-0 h-[1px] w-[680px] bg-gray-500"></div>

            {/* ================= PERETII SALII S1 ================= */}
            <div className="absolute top-[430px] left-[450px] w-[230px] h-[1px] bg-gray-500"></div>
            <div className="absolute top-[430px] left-[450px] h-[270px] w-[1px] bg-gray-500"></div>
            <div className="absolute top-[400px] left-[680px] h-[300px] w-[1px] bg-gray-500"></div>


            {/* ================= ZONA STAND-UP DESKS (SD1) ================= */}
            <div className="absolute top-[20px] left-[20px] text-[15px] font-semibold text-gray-800 leading-tight">
                Zona Stand-<br />Up Desks ,<br />SD 1
            </div>

            <div className="absolute top-[80px] left-[100px] h-[70px] w-[70px] rounded-full border border-[#7C7777] bg-[#C1BDD2]"></div>
            <SingleSeat id="T1-SD1-01" type="room" number="1" status={getSeatStatus("T1-SD1-01")} selectedSeat={getSelectedState("T1-SD1-01")} onSelect={handleSeatSelection} className="top-[60px] left-[170px]" />
            <SingleSeat id="T1-SD1-02" type="room" number="2" status={getSeatStatus("T1-SD1-02")} selectedSeat={getSelectedState("T1-SD1-02")} onSelect={handleSeatSelection} className="top-[140px] left-[60px]" />

            <div className="absolute top-[170px] left-[230px] h-[70px] w-[70px] rounded-full border border-[#7C7777] bg-[#C1BDD2]"></div>
            <SingleSeat id="T1-SD1-03" type="room" number="3" status={getSeatStatus("T1-SD1-03")} selectedSeat={getSelectedState("T1-SD1-03")} onSelect={handleSeatSelection} className="top-[120px] left-[290px]" />
            <SingleSeat id="T1-SD1-04" type="room" number="4" status={getSeatStatus("T1-SD1-04")} selectedSeat={getSelectedState("T1-SD1-04")} onSelect={handleSeatSelection} className="top-[230px] left-[190px]" />

            <div className="absolute top-[280px] left-[90px] h-[70px] w-[70px] rounded-full border border-[#7C7777] bg-[#C1BDD2]"></div>
            <SingleSeat id="T1-SD1-05" type="room" number="5" status={getSeatStatus("T1-SD1-05")} selectedSeat={getSelectedState("T1-SD1-05")} onSelect={handleSeatSelection} className="top-[270px] left-[170px]" />
            <SingleSeat id="T1-SD1-06" type="room" number="6" status={getSeatStatus("T1-SD1-06")} selectedSeat={getSelectedState("T1-SD1-06")} onSelect={handleSeatSelection} className="top-[340px] left-[50px]" />


            {/* ================= SALA EVENIMENTE (E1) - MASA IN U ================= */}
            <div className="absolute top-[30px] left-[400px] text-[15px] font-semibold text-gray-800 leading-tight">
                Sala<br />Evenimente,<br />E1
            </div>

            <div className="absolute top-[30px] left-[610px] h-[280px] w-[35px] border border-[#7C7777] bg-[#C1BDD2]"></div>
            <div className="absolute top-[30px] left-[750px] h-[280px] w-[35px] border border-[#7C7777] bg-[#C1BDD2]"></div>
            <div className="absolute top-[275px] left-[610px] h-[35px] w-[175px] border-x border-b border-[#7C7777] bg-[#C1BDD2]"></div>

            <SingleSeat id="T1-E1-07" type="room" number="7" status={getSeatStatus("T1-E1-07")} selectedSeat={getSelectedState("T1-E1-07")} onSelect={handleSeatSelection} className="top-[30px] left-[570px]" />
            <SingleSeat id="T1-E1-08" type="room" number="8" status={getSeatStatus("T1-E1-08")} selectedSeat={getSelectedState("T1-E1-08")} onSelect={handleSeatSelection} className="top-[65px] left-[570px]" />
            <SingleSeat id="T1-E1-09" type="room" number="9" status={getSeatStatus("T1-E1-09")} selectedSeat={getSelectedState("T1-E1-09")} onSelect={handleSeatSelection} className="top-[100px] left-[570px]" />
            <SingleSeat id="T1-E1-10" type="room" number="10" status={getSeatStatus("T1-E1-10")} selectedSeat={getSelectedState("T1-E1-10")} onSelect={handleSeatSelection} className="top-[135px] left-[570px]" />
            <SingleSeat id="T1-E1-11" type="room" number="11" status={getSeatStatus("T1-E1-11")} selectedSeat={getSelectedState("T1-E1-11")} onSelect={handleSeatSelection} className="top-[170px] left-[570px]" />
            <SingleSeat id="T1-E1-12" type="room" number="12" status={getSeatStatus("T1-E1-12")} selectedSeat={getSelectedState("T1-E1-12")} onSelect={handleSeatSelection} className="top-[205px] left-[570px]" />
            <SingleSeat id="T1-E1-13" type="room" number="13" status={getSeatStatus("T1-E1-13")} selectedSeat={getSelectedState("T1-E1-13")} onSelect={handleSeatSelection} className="top-[240px] left-[570px]" />
            <SingleSeat id="T1-E1-14" type="room" number="14" status={getSeatStatus("T1-E1-14")} selectedSeat={getSelectedState("T1-E1-14")} onSelect={handleSeatSelection} className="top-[275px] left-[570px]" />

            <SingleSeat id="T1-E1-15" type="room" number="15" status={getSeatStatus("T1-E1-15")} selectedSeat={getSelectedState("T1-E1-15")} onSelect={handleSeatSelection} className="top-[320px] left-[615px]" />
            <SingleSeat id="T1-E1-16" type="room" number="16" status={getSeatStatus("T1-E1-16")} selectedSeat={getSelectedState("T1-E1-16")} onSelect={handleSeatSelection} className="top-[320px] left-[660px]" />
            <SingleSeat id="T1-E1-17" type="room" number="17" status={getSeatStatus("T1-E1-17")} selectedSeat={getSelectedState("T1-E1-17")} onSelect={handleSeatSelection} className="top-[320px] left-[705px]" />

            <SingleSeat id="T1-E1-25" type="room" number="25" status={getSeatStatus("T1-E1-25")} selectedSeat={getSelectedState("T1-E1-25")} onSelect={handleSeatSelection} className="top-[30px] left-[795px]" />
            <SingleSeat id="T1-E1-24" type="room" number="24" status={getSeatStatus("T1-E1-24")} selectedSeat={getSelectedState("T1-E1-24")} onSelect={handleSeatSelection} className="top-[65px] left-[795px]" />
            <SingleSeat id="T1-E1-23" type="room" number="23" status={getSeatStatus("T1-E1-23")} selectedSeat={getSelectedState("T1-E1-23")} onSelect={handleSeatSelection} className="top-[100px] left-[795px]" />
            <SingleSeat id="T1-E1-22" type="room" number="22" status={getSeatStatus("T1-E1-22")} selectedSeat={getSelectedState("T1-E1-22")} onSelect={handleSeatSelection} className="top-[135px] left-[795px]" />
            <SingleSeat id="T1-E1-21" type="room" number="21" status={getSeatStatus("T1-E1-21")} selectedSeat={getSelectedState("T1-E1-21")} onSelect={handleSeatSelection} className="top-[170px] left-[795px]" />
            <SingleSeat id="T1-E1-20" type="room" number="20" status={getSeatStatus("T1-E1-20")} selectedSeat={getSelectedState("T1-E1-20")} onSelect={handleSeatSelection} className="top-[205px] left-[795px]" />
            <SingleSeat id="T1-E1-19" type="room" number="19" status={getSeatStatus("T1-E1-19")} selectedSeat={getSelectedState("T1-E1-19")} onSelect={handleSeatSelection} className="top-[240px] left-[795px]" />
            <SingleSeat id="T1-E1-18" type="room" number="18" status={getSeatStatus("T1-E1-18")} selectedSeat={getSelectedState("T1-E1-18")} onSelect={handleSeatSelection} className="top-[275px] left-[795px]" />


            {/* ================= ZONA DREAPTA-JOS (E1 - OPEN SPACE) ================= */}
            <div className="absolute top-[485px] left-[750px] h-[160px] w-[50px] border border-[#7C7777] bg-[#C1BDD2]"></div>

            <SingleSeat id="T1-E1-26" type="room" number="26" status={getSeatStatus("T1-E1-26")} selectedSeat={getSelectedState("T1-E1-26")} onSelect={handleSeatSelection} className="top-[505px] left-[710px]" />
            <SingleSeat id="T1-E1-27" type="room" number="27" status={getSeatStatus("T1-E1-27")} selectedSeat={getSelectedState("T1-E1-27")} onSelect={handleSeatSelection} className="top-[595px] left-[710px]" />
            <SingleSeat id="T1-E1-29" type="room" number="29" status={getSeatStatus("T1-E1-29")} selectedSeat={getSelectedState("T1-E1-29")} onSelect={handleSeatSelection} className="top-[505px] left-[810px]" />
            <SingleSeat id="T1-E1-28" type="room" number="28" status={getSeatStatus("T1-E1-28")} selectedSeat={getSelectedState("T1-E1-28")} onSelect={handleSeatSelection} className="top-[595px] left-[810px]" />


            {/* ================= SALA SEDINTE S1 ================= */}
            <div className="absolute top-[440px] left-[460px] text-[13px] font-semibold text-gray-800 leading-tight">
                Sala<br />sedinte,<br />S1
            </div>

            <div className="absolute top-[485px] left-[540px] h-[160px] w-[50px] border border-[#7C7777] bg-[#C1BDD2]"></div>

            <SingleSeat id="T1-S1-01" type="room" number="1" status={getSeatStatus("T1-S1-01")} selectedSeat={getSelectedState("T1-S1-01")} onSelect={handleSeatSelection} className="top-[445px] left-[550px]" />

            <SingleSeat id="T1-S1-02" type="room" number="2" status={getSeatStatus("T1-S1-02")} selectedSeat={getSelectedState("T1-S1-02")} onSelect={handleSeatSelection} className="top-[505px] left-[500px]" />
            <SingleSeat id="T1-S1-03" type="room" number="3" status={getSeatStatus("T1-S1-03")} selectedSeat={getSelectedState("T1-S1-03")} onSelect={handleSeatSelection} className="top-[550px] left-[500px]" />
            <SingleSeat id="T1-S1-04" type="room" number="4" status={getSeatStatus("T1-S1-04")} selectedSeat={getSelectedState("T1-S1-04")} onSelect={handleSeatSelection} className="top-[595px] left-[500px]" />

            <SingleSeat id="T1-S1-05" type="room" number="5" status={getSeatStatus("T1-S1-05")} selectedSeat={getSelectedState("T1-S1-05")} onSelect={handleSeatSelection} className="top-[655px] left-[550px]" />

            <SingleSeat id="T1-S1-08" type="room" number="8" status={getSeatStatus("T1-S1-08")} selectedSeat={getSelectedState("T1-S1-08")} onSelect={handleSeatSelection} className="top-[505px] left-[600px]" />
            <SingleSeat id="T1-S1-07" type="room" number="7" status={getSeatStatus("T1-S1-07")} selectedSeat={getSelectedState("T1-S1-07")} onSelect={handleSeatSelection} className="top-[550px] left-[600px]" />
            <SingleSeat id="T1-S1-06" type="room" number="6" status={getSeatStatus("T1-S1-06")} selectedSeat={getSelectedState("T1-S1-06")} onSelect={handleSeatSelection} className="top-[595px] left-[600px]" />

        </div>
    );
};

export default T1Etaj1Map;






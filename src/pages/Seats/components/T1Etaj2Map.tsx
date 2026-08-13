import { useSeatSelection } from '@/hooks/useSeatSelection';
import SingleSeat from './SingleSeat'

type SeatStatus = 'available' | 'occupied' | 'unavailable' | 'in_review';

interface SeatMapProps {
    getSeatStatus: (id: string) => SeatStatus;
}
const T1Etaj2Map = ({ getSeatStatus }: SeatMapProps) => {
    const { handleSeatClick, getSelectedState } = useSeatSelection();


    return (
        <div className="relative mx-auto h-[700px] w-[870px] border border-gray-800 bg-[#F5F3FF] overflow-hidden shadow-sm">
            {/* ================= ZONA SALA GAMING G2 ================= */}
            <div className="absolute top-[40px] left-[60px] text-[15px] font-semibold text-gray-800 leading-tight">
                Sala<br />Gaming<br />G2
            </div>

            {/* PÄtratele mici gri de pe peretele din stĂ˘nga */}
            <div className="absolute top-[160px] left-[20px] h-[25px] w-[25px] border border-[#7C7777] bg-[#C1BDD2]"></div>
            <div className="absolute top-[450px] left-[20px] h-[25px] w-[25px] border border-[#7C7777] bg-[#C1BDD2]"></div>

            {/* --- Masa Gaming 1 (StĂ˘nga) --- */}
            <div className="absolute top-[240px] left-[170px] h-[45px] w-[140px] border border-[#7C7777] bg-[#C1BDD2]"></div>

            <SingleSeat id="T1-G2-01"  number="1" status={getSeatStatus("T1-G2-01")} selectedSeat={getSelectedState("T1-G2-01")} onSelect={handleSeatClick} className="top-[170px] left-[190px]" />
            <SingleSeat id="T1-G2-02"  number="2" status={getSeatStatus("T1-G2-02")} selectedSeat={getSelectedState("T1-G2-02")} onSelect={handleSeatClick} className="top-[170px] left-[250px]" />

            <SingleSeat id="T1-G2-03"  number="3" status={getSeatStatus("T1-G2-03")} selectedSeat={getSelectedState("T1-G2-03")} onSelect={handleSeatClick} className="top-[305px] left-[190px]" />
            <SingleSeat id="T1-G2-04"  number="4" status={getSeatStatus("T1-G2-04")} selectedSeat={getSelectedState("T1-G2-04")} onSelect={handleSeatClick} className="top-[305px] left-[250px]" />


            {/* --- Masa Gaming 2 (Dreapta) --- */}
            <div className="absolute top-[240px] left-[390px] h-[45px] w-[140px] border border-[#7C7777] bg-[#C1BDD2]"></div> 

            <SingleSeat id="T1-G2-05"  number="5" status={getSeatStatus("T1-G2-05")} selectedSeat={getSelectedState("T1-G2-05")} onSelect={handleSeatClick} className="top-[170px] left-[410px]" />
            <SingleSeat id="T1-G2-06"  number="6" status={getSeatStatus("T1-G2-06")} selectedSeat={getSelectedState("T1-G2-06")} onSelect={handleSeatClick} className="top-[170px] left-[470px]" />

            <SingleSeat id="T1-G2-07"  number="7" status={getSeatStatus("T1-G2-07")} selectedSeat={getSelectedState("T1-G2-07")} onSelect={handleSeatClick} className="top-[305px] left-[410px]" />
            <SingleSeat id="T1-G2-08"  number="8" status={getSeatStatus("T1-G2-08")} selectedSeat={getSelectedState("T1-G2-08")} onSelect={handleSeatClick} className="top-[305px] left-[470px]" />


            {/* ================= ZONA MASA PING-PONG ================= */}
            <div className="absolute top-[40px] left-[550px] h-[130px] w-[260px] border border-[#7C7777] bg-[#C1BDD2] flex items-center justify-center">
                <span className="text-[15px] font-bold text-[#3B3259]">Masa Ping-Pong</span>
            </div>


            {/* ================= ZONA MASA BILIARD ================= */}
            <div className="absolute top-[420px] left-[370px] h-[130px] w-[260px] border border-[#7C7777] bg-[#C1BDD2] flex items-center justify-center">
                <span className="text-[15px] font-bold text-[#3B3259]">Masa Biliard</span>
            </div>


            {/* ================= ZONA MASA ROTUNDÄ‚ (DREAPTA JOS) ================= */}
            {/* Peretele despÄrČ›itor */}
            <div className="absolute top-[540px] left-[680px] h-[160px] w-[1px] bg-gray-500"></div>


            <div className="absolute top-[540px] left-[740px] h-[60px] w-[60px] rounded-full border border-[#7C7777] bg-[#C1BDD2]"></div>


            <div className="absolute top-[505px] left-[757px] h-[25px] w-[25px] border border-[#7C7777] bg-[#C1BDD2]"></div>
            <div className="absolute top-[610px] left-[757px] h-[25px] w-[25px] border border-[#7C7777] bg-[#C1BDD2]"></div>
            <div className="absolute top-[557px] left-[705px] h-[25px] w-[25px] border border-[#7C7777] bg-[#C1BDD2]"></div>
            <div className="absolute top-[557px] left-[810px] h-[25px] w-[25px] border border-[#7C7777] bg-[#C1BDD2]"></div>

        </div>
    );

};
export default T1Etaj2Map;
import { useSeatSelection } from '@/hooks/useSeatSelection';
import SingleSeat from './SingleSeat';

interface ParterMapProps {
    onRoomSelect?: (isRoom: boolean) => void;
    onSeatSelect?: (hasSelected: boolean) => void;
    onOccupiedSelect?: (isOccupied: boolean) => void;
    getSeatStatus: (id: string) => 'available' | 'occupied' | 'unavailable' | 'in_review';
}

const ParterMap = ({ onRoomSelect, onSeatSelect, onOccupiedSelect, getSeatStatus }: ParterMapProps) => {
    const { handleSeatClick, getSelectedState } = useSeatSelection([
        { groupId: 'G-S0', matches: (id: string) => id.includes('P-S0') }
    ]);

    const handleSeatSelection = (id: string, type?: 'individual' | 'room') => {
        const wasSelectedBeforeClick = getSelectedState(id) === 'selected';
        const isOccupied = getSeatStatus(id) === 'occupied';

        handleSeatClick(id);

        if (onRoomSelect) {
            onRoomSelect(type === 'room');
        }

        if (onSeatSelect) {
            onSeatSelect(!wasSelectedBeforeClick);
        }

        if (onOccupiedSelect) {
            if (!wasSelectedBeforeClick) {

                onOccupiedSelect(isOccupied);
            } else {

                onOccupiedSelect(false);
            }
        }
    };


    return (
        <div className="relative mx-auto h-[650px] w-full max-w-[1000px] border border-gray-800 bg-[#F5F3FF] overflow-hidden shadow-sm">
            <div className="absolute top-0 right-[350px] h-[250px] w-[1px] bg-gray-800"></div>
            <div className="absolute top-[250px] right-0 w-[350px] h-[1px] bg-gray-800"></div>
            <div className="absolute bottom-[120px] right-0 w-[350px] h-[1px] bg-gray-800"></div>
            <div className="absolute top-[420px] left-0 w-[355px] h-[1px] bg-gray-800"></div>
            <div className="absolute top-[420px] left-[280px] w-[1px] h-[300px] bg-gray-800"></div>
            <div className="absolute top-[550px] left-[280px] w-[80px] h-[1px] bg-gray-800"></div>

            {/* ZONA 1 */}
            <div className="absolute left-6 top-6">
                <h3 className="mb-4 text-sm font-semibold leading-tight text-gray-800">Zona Stand-Up<br />Desks , SD0</h3>
                <div className="absolute top-[85px] left-[10px] h-[50px] w-[150px] border border-[#7C7777] bg-[#C1BDD2]"></div>
                <SingleSeat selectedSeat={getSelectedState("P-SD0-01")} onSelect={handleSeatSelection} id="P-SD0-01" number="1" status={getSeatStatus("P-SD0-01")} className="top-[50px] left-[30px]" />
                <SingleSeat selectedSeat={getSelectedState("P-SD0-02")} onSelect={handleSeatSelection} id="P-SD0-02" number="2" status={getSeatStatus("P-SD0-02")} className="top-[50px] left-[100px]" />
                <SingleSeat selectedSeat={getSelectedState("P-SD0-03")} onSelect={handleSeatSelection} id="P-SD0-03" number="3" status={getSeatStatus("P-SD0-03")} className="top-[145px] left-[30px]" />
                <SingleSeat selectedSeat={getSelectedState("P-SD0-04")} onSelect={handleSeatSelection} id="P-SD0-04" number="4" status={getSeatStatus("P-SD0-04")} className="top-[145px] left-[100px]" />
                <div className="absolute top-[225px] left-[10px] h-[50px] w-[150px] border border-[#7C7777] bg-[#C1BDD2]"></div>
                <SingleSeat selectedSeat={getSelectedState("P-SD0-05")} onSelect={handleSeatSelection} id="P-SD0-05" number="5" status={getSeatStatus("P-SD0-05")} className="top-[190px] left-[30px]" />
                <SingleSeat selectedSeat={getSelectedState("P-SD0-06")} onSelect={handleSeatSelection} id="P-SD0-06" number="6" status={getSeatStatus("P-SD0-06")} className="top-[190px] left-[100px]" />
                <SingleSeat selectedSeat={getSelectedState("P-SD0-07")} onSelect={handleSeatSelection} id="P-SD0-07" number="7" status={getSeatStatus("P-SD0-07")} className="top-[285px] left-[30px]" />
                <SingleSeat selectedSeat={getSelectedState("P-SD0-08")} onSelect={handleSeatSelection} id="P-SD0-08" number="8" status={getSeatStatus("P-SD0-08")} className="top-[285px] left-[100px]" />
            </div>

            {/* ZONA 2 */}
            <div className="absolute top-0 left-[350px] h-[25px] w-[140px] border border-[#7C7777] bg-[#C1BDD2]"></div>
            <div className="absolute top-0 left-[510px] h-[25px] w-[60px] border border-[#7C7777] bg-[#C1BDD2]"></div>
            <div className="absolute top-[30px] left-[570px] h-[50px] w-[20px] border border-[#7C7777] bg-[#C1BDD2]"></div>
            <div className="absolute top-[90px] left-[480px] h-[60px] w-[60px] rounded-full border border-[#7C7777] bg-[#C1BDD2]"></div>
            <div className="absolute top-[105px] left-[420px] h-[30px] w-[30px] border border-[#7C7777] bg-[#C1BDD2]"></div>
            <div className="absolute top-[165px] left-[450px] h-[30px] w-[30px] border border-[#7C7777] bg-[#C1BDD2]"></div>
            <div className="absolute top-[165px] left-[540px] h-[30px] w-[30px] border border-[#7C7777] bg-[#C1BDD2]"></div>
            <div className="absolute top-[105px] left-[570px] h-[25px] w-[20px] border border-[#7C7777] bg-[#C1BDD2]"></div>

            {/* ZONA 3 */}
            <div className="absolute top-[440px] left-[310px] h-[30px] w-[30px] border border-[#7C7777] bg-[#C1BDD2]"></div>
            <div className="absolute top-[490px] left-[290px] h-[30px] w-[30px] border border-[#7C7777] bg-[#C1BDD2]"></div>
            <div className="absolute top-[565px] left-[310px] h-[30px] w-[30px] border border-[#7C7777] bg-[#C1BDD2]"></div>

            {/* ZONA 4 - SĂLILE (AICI SUNT SALILE) */}
            <div className="absolute top-0 right-0 w-[350px] h-[250px] p-4">
                <h3 className="text-sm font-semibold text-gray-800 leading-tight">Sala<br />sedinte<br />S0</h3>
                <div className="absolute top-[80px] left-[70px] h-[45px] w-[200px] border border-[#7C7777] bg-[#C1BDD2]"></div>
                <div className="absolute top-[115px] left-[225px] h-[75px] w-[45px] border-x border-[#7C7777] bg-[#C1BDD2]">
                    <div className="absolute bottom-0 right-0 h-px w-[34px] bg-[#7C7777]"></div>
                </div>
                <SingleSeat 
                    selectedSeat={getSelectedState("P-S0-01")} 
                    onSelect={handleSeatSelection} 
                    id="P-S0-01" number="1" 
                    status={getSeatStatus("P-S0-01")} 
                    type="room" 
                    className="top-[35px] left-[80px]" 
                />
                <SingleSeat selectedSeat={getSelectedState("P-S0-02")} onSelect={handleSeatSelection} id="P-S0-02" number="2" status={getSeatStatus("P-S0-02")} type="room" className="top-[35px] left-[125px]" />
                <SingleSeat selectedSeat={getSelectedState("P-S0-03")} onSelect={handleSeatSelection} id="P-S0-03" number="3" status={getSeatStatus("P-S0-03")} type="room" className="top-[35px] left-[170px]" />
                <SingleSeat selectedSeat={getSelectedState("P-S0-04")} onSelect={handleSeatSelection} id="P-S0-04" number="4" status={getSeatStatus("P-S0-04")} type="room" className="top-[65px] left-[280px]" />
                <SingleSeat selectedSeat={getSelectedState("P-S0-05")} onSelect={handleSeatSelection} id="P-S0-05" number="5" status={getSeatStatus("P-S0-05")} type="room" className="top-[110px] left-[280px]" />
                <SingleSeat selectedSeat={getSelectedState("P-S0-06")} onSelect={handleSeatSelection} id="P-S0-06" number="6" status={getSeatStatus("P-S0-06")} type="room" className="top-[155px] left-[280px]" />
                <SingleSeat selectedSeat={getSelectedState("P-S0-08")} onSelect={handleSeatSelection} id="P-S0-08" number="8" status={getSeatStatus("P-S0-08")} type="room" className="top-[140px] left-[110px]" />
                <SingleSeat selectedSeat={getSelectedState("P-S0-07")} onSelect={handleSeatSelection} id="P-S0-07" number="7" status={getSeatStatus("P-S0-07")} type="room" className="top-[140px] left-[160px]" />
            </div>

            <div className="absolute top-[530px] right-0 h-[1px] w-[350px] bg-gray-800"></div>

            {/* ZONA 5 */}
            <div className="absolute top-[250px] right-0 w-[350px] h-[280px]">
                <h3 className="absolute top-[60px] right-[20px] text-sm font-semibold text-gray-800 leading-tight">Sala<br />birouri<br />B0</h3>
                <div className="absolute top-[20px] left-[60px] h-[240px] w-[35px] border border-[#7C7777] bg-[#C1BDD2]"></div>
                <SingleSeat selectedSeat={getSelectedState("P-B0-01")} onSelect={handleSeatSelection} id="P-B0-01" number="1" status={getSeatStatus("P-B0-01")} className="top-[25px] left-[20px]" />
                <SingleSeat selectedSeat={getSelectedState("P-B0-02")} onSelect={handleSeatSelection} id="P-B0-02" number="2" status={getSeatStatus("P-B0-02")} className="top-[60px] left-[20px]" />
                <SingleSeat selectedSeat={getSelectedState("P-B0-03")} onSelect={handleSeatSelection} id="P-B0-03" number="3" status={getSeatStatus("P-B0-03")} className="top-[95px] left-[20px]" />
                <SingleSeat selectedSeat={getSelectedState("P-B0-04")} onSelect={handleSeatSelection} id="P-B0-04" number="4" status={getSeatStatus("P-B0-04")} className="top-[130px] left-[20px]" />
                <SingleSeat selectedSeat={getSelectedState("P-B0-05")} onSelect={handleSeatSelection} id="P-B0-05" number="5" status={getSeatStatus("P-B0-05")} className="top-[165px] left-[20px]" />
                <SingleSeat selectedSeat={getSelectedState("P-B0-06")} onSelect={handleSeatSelection} id="P-B0-06" number="6" status={getSeatStatus("P-B0-06")} className="top-[200px] left-[20px]" />
                <div className="absolute top-[20px] left-[165px] h-[240px] w-[35px] border border-[#7C7777] bg-[#C1BDD2]"></div>
                <SingleSeat selectedSeat={getSelectedState("P-B0-07")} onSelect={handleSeatSelection} id="P-B0-07" number="7" status={getSeatStatus("P-B0-07")} className="top-[25px] left-[215px]" />
                <SingleSeat selectedSeat={getSelectedState("P-B0-08")} onSelect={handleSeatSelection} id="P-B0-08" number="8" status={getSeatStatus("P-B0-08")} className="top-[60px] left-[215px]" />
                <SingleSeat selectedSeat={getSelectedState("P-B0-09")} onSelect={handleSeatSelection} id="P-B0-09" number="9" status={getSeatStatus("P-B0-09")} className="top-[95px] left-[215px]" />
                <SingleSeat selectedSeat={getSelectedState("P-B0-10")} onSelect={handleSeatSelection} id="P-B0-10" number="10" status={getSeatStatus("P-B0-10")} className="top-[130px] left-[215px]" />
                <SingleSeat selectedSeat={getSelectedState("P-B0-11")} onSelect={handleSeatSelection} id="P-B0-11" number="11" status={getSeatStatus("P-B0-11")} className="top-[165px] left-[215px]" />
                <SingleSeat selectedSeat={getSelectedState("P-B0-12")} onSelect={handleSeatSelection} id="P-B0-12" number="12" status={getSeatStatus("P-B0-12")} className="top-[200px] left-[215px]" />
            </div>

            <div className="absolute top-[250px] right-[350px] h-[400px] w-[1px] bg-gray-800"></div>

            {/* ZONA 6 */}
            <div className="absolute bottom-0 right-0 w-[350px] h-[120px] flex items-center justify-center bg-[#F8F9FA]/50">
                <h3 className="text-sm font-semibold text-gray-800">Bucatarie</h3>
            </div>
        </div>
    );
};

export default ParterMap;
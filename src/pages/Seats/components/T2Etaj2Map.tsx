import { useSeatSelection } from '@/hooks/useSeatSelection';
import SingleSeat from './SingleSeat'

type SeatStatus = 'available' | 'occupied' | 'unavailable' | 'in_review';

interface SeatMapProps {
    getSeatStatus: (id: string) => SeatStatus;
}

const T2Etaj2 = ({ getSeatStatus }: SeatMapProps) => {
    const { handleSeatClick, getSelectedState } = useSeatSelection([{ groupId: 'G-O2', matches: (id: string) => id.includes('T2-O2') }]);
  
  return (
    <div className="relative mx-auto h-[620px] w-full max-w-[1000px] overflow-hidden border border-gray-800 bg-[#F5F3FF] shadow-sm">
      <div className="absolute left-0 top-[85px] h-[350px] w-[400px] border-y border-r border-gray-800">
        <h3 className="absolute left-[15px] top-[10px] text-base font-semibold leading-tight text-[#1E1B4B]">
          Outland
          <br/> 
          O2
        </h3>

        <div className="absolute left-[120px] top-[70px] h-[150px] w-[80px] border border-[#7C7777] bg-[#C1BDD2]"></div>
        
        <SingleSeat
          id="T2-O2-01"
          type="room"
          number="1"
          status={getSeatStatus("T2-O2-01")}
          selectedSeat={getSelectedState('T2-O2-01')}
          onSelect={handleSeatClick}
          className="left-[140px] top-[30px]"
        />
        <SingleSeat
          id="T2-O2-02"
          type="room"
          number="2"
          status={getSeatStatus("T2-O2-02")}
          selectedSeat={getSelectedState('T2-O2-02')}
          onSelect={handleSeatClick}
          className="left-[80px] top-[70px]"
        />
        <SingleSeat
          id="T2-O2-03"
          type="room"
          number="3"
          status={getSeatStatus("T2-O2-03")}
          selectedSeat={getSelectedState('T2-O2-03')}
          onSelect={handleSeatClick}
          className="left-[80px] top-[110px]"
        />
        <SingleSeat
          id="T2-O2-04"
          type="room"
          number="4"
          status={getSeatStatus("T2-O2-04")}
          selectedSeat={getSelectedState('T2-O2-04')}
          onSelect={handleSeatClick}
          className="left-[80px] top-[150px]"
        />
        <SingleSeat
          id="T2-O2-05"
          type="room"
          number="5"
          status={getSeatStatus("T2-O2-05")}
          selectedSeat={getSelectedState('T2-O2-05')}
          onSelect={handleSeatClick}
          className="left-[80px] top-[190px]"
        />
        <SingleSeat
          id="T2-O2-06"
          type="room"
          number="6"
          status={getSeatStatus("T2-O2-06")}
          selectedSeat={getSelectedState('T2-O2-06')}
          onSelect={handleSeatClick}
          className="left-[145px] top-[230px]"
        />
        <SingleSeat
          id="T2-O2-10"
          type="room"
          number="10"
          status={getSeatStatus("T2-O2-10")}
          selectedSeat={getSelectedState('T2-O2-10')}
          onSelect={handleSeatClick}
          className="left-[210px] top-[70px]"
        />

        <SingleSeat
          id="T2-O2-09"
          type="room"
          number="9"
          status={getSeatStatus("T2-O2-09")}
          selectedSeat={getSelectedState('T2-O2-09')}
          onSelect={handleSeatClick}
          className="left-[210px] top-[110px]"
        />

        <SingleSeat
          id="T2-O2-08"
          type="room"
          number="8"
          status={getSeatStatus("T2-O2-08")}
          selectedSeat={getSelectedState('T2-O2-08')}
          onSelect={handleSeatClick}
          className="left-[210px] top-[150px]"
        />

        <SingleSeat
          id="T2-O2-07"
          type="room"
          number="7"
          status={getSeatStatus("T2-O2-07")}
          selectedSeat={getSelectedState('T2-O2-07')}
          onSelect={handleSeatClick}
          className="left-[210px] top-[190px]"
        />
      </div>

      <div className="absolute left-[400px] top-0 h-full w-[260px]">
        <h3 className="absolute left-[40px] top-[22px] text-base font-semibold leading-tight text-[#1E1B4B]">
          Stand-Up Desks
          <br />
          SD2
        </h3>
        <div className="absolute left-[112px] top-[80px] h-[60px] w-[60px] rounded-full border border-[#7C7777] bg-[#C1BDD2]" />

        <SingleSeat
          id="T2-SD2-01"
          number="1"
          status={getSeatStatus("T2-SD2-01")}
          selectedSeat={getSelectedState('T2-SD2-01')}
          onSelect={handleSeatClick}
          className="left-[162px] top-[50px]"
        />

        <SingleSeat
          id="T2-SD2-02"
          number="2"
          status={getSeatStatus("T2-SD2-02")}
          selectedSeat={getSelectedState('T2-SD2-02')}
          onSelect={handleSeatClick}
          className="left-[72px] top-[120px]"
        />

        {/* Masa rotundÄ de jos */}
        <div className="absolute left-[110px] top-[250px] h-[60px] w-[60px] rounded-full border border-[#7C7777] bg-[#C1BDD2]" />

        <SingleSeat
          id="T2-SD2-03"
          number="3"
          status={getSeatStatus("T2-SD2-03")}
          selectedSeat={getSelectedState('T2-SD2-03')}
          onSelect={handleSeatClick}
          className="left-[158px] top-[215px]"
        />

        <SingleSeat
          id="T2-SD2-04"
          number="4"
          status={getSeatStatus("T2-SD2-04")}
          selectedSeat={getSelectedState('T2-SD2-04')}
          onSelect={handleSeatClick}
          className="left-[70px] top-[305px]"
        />
      </div>

      <div className="absolute right-0 top-0 h-full w-[340px]">
        <h3 className="absolute left-[150px] top-[20px] text-base font-semibold leading-tight text-[#1E1B4B]">
          Birouri
          <br />
          B2
        </h3>

        {/* Masa verticalÄ de sus */}
        <div className="absolute left-[150px] top-[90px] h-[145px] w-[60px] border border-[#7C7777] bg-[#C1BDD2]" />

        {/* Scaunele din stĂ˘nga primei mese */}
        <SingleSeat
          id="T2-B2-05"
          number="5"
          status={getSeatStatus("T2-B2-05")}
          selectedSeat={getSelectedState('T2-B2-05')}
          onSelect={handleSeatClick}
          className="left-[105px] top-[115px]"
        />

        <SingleSeat
          id="T2-B2-06"
          number="6"
          status={getSeatStatus("T2-B2-06")}
          selectedSeat={getSelectedState('T2-B2-06')}
          onSelect={handleSeatClick}
          className="left-[105px] top-[155px]"
        />

        <SingleSeat
          id="T2-B2-07"
          number="7"
          status={getSeatStatus("T2-B2-07")}
          selectedSeat={getSelectedState('T2-B2-07')}
          onSelect={handleSeatClick}
          className="left-[105px] top-[195px]"
        />

        {/* Scaunele din dreapta primei mese */}
        <SingleSeat
          id="T2-B2-11"
          number="11"
          status={getSeatStatus("T2-B2-11")}
          selectedSeat={getSelectedState('T2-B2-11')}
          onSelect={handleSeatClick}
          className="left-[225px] top-[115px]"
        />

        <SingleSeat
          id="T2-B2-12"
          number="12"
          status={getSeatStatus("T2-B2-12")}
          selectedSeat={getSelectedState('T2-B2-12')}
          onSelect={handleSeatClick}
          className="left-[225px] top-[155px]"
        />

        <SingleSeat
          id="T2-B2-13"
          number="13"
          status={getSeatStatus("T2-B2-13")}
          selectedSeat={getSelectedState('T2-B2-13')}
          onSelect={handleSeatClick}
          className="left-[225px] top-[195px]"
        />

        {/* Masa verticalÄ de jos */}
        <div className="absolute left-[150px] top-[240px] h-[145px] w-[60px] border border-[#7C7777] bg-[#C1BDD2]" />

        {/* Scaunele din stĂ˘nga celei de-a doua mese */}
        <SingleSeat
          id="T2-B2-08"
          number="8"
          status={getSeatStatus("T2-B2-08")}
          selectedSeat={getSelectedState('T2-B2-08')}
          onSelect={handleSeatClick}
          className="left-[105px] top-[255px]"
        />

        <SingleSeat
          id="T2-B2-09"
          number="9"
          status={getSeatStatus("T2-B2-09")}
          selectedSeat={getSelectedState('T2-B2-09')}
          onSelect={handleSeatClick}
          className="left-[105px] top-[295px]"
        />

        <SingleSeat
          id="T2-B2-10"
          number="10"
          status={getSeatStatus("T2-B2-10")}
          selectedSeat={getSelectedState('T2-B2-10')}
          onSelect={handleSeatClick}
          className="left-[105px] top-[335px]"
        />

        {/* Scaunele din dreapta celei de-a doua mese */}
        <SingleSeat
          id="T2-B2-14"
          number="14"
          status={getSeatStatus("T2-B2-14")}
          selectedSeat={getSelectedState('T2-B2-14')}
          onSelect={handleSeatClick}
          className="left-[225px] top-[255px]"
        />

        <SingleSeat
          id="T2-B2-15"
          number="15"
          status={getSeatStatus("T2-B2-15")}
          selectedSeat={getSelectedState('T2-B2-15')}
          onSelect={handleSeatClick}
          className="left-[225px] top-[295px]"
        />

        <SingleSeat
          id="T2-B2-16"
          number="16"
          status={getSeatStatus("T2-B2-16")}
          selectedSeat={getSelectedState('T2-B2-16')}
          onSelect={handleSeatClick}
          className="left-[225px] top-[335px]"
        />
      </div>
    </div>
  )
}

export default T2Etaj2

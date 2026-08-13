interface SingleSeatProps {
    id: string;
    number: string | number;
    status: 'available' | 'occupied' | 'unavailable' | 'pending';
    type?: 'individual' | 'room';
    selectedSeat: string | null;
    onSelect: (id: string, type?: 'individual' | 'room') => void; 
    className?: string;
}

const getSeatColor = (
    id: string,
    status: SingleSeatProps['status'],
    type: NonNullable<SingleSeatProps['type']>,
    selectedSeat: string | null,
) => {
    if (selectedSeat === id) return 'bg-[#8B5CF6] text-white';

    switch (status) {
        case 'available':
            return type === 'room' ? 'bg-[#85E2B7] text-[#1E1B4B] border border-[#61DEA5]' : 'bg-[#A7F3D0] border border-[#61DEA5] text-[#064E3B]';
        case 'occupied':
            return 'bg-[#FECACA] text-[#1E1B4B] border border-[#F5A1A1]';
        case 'unavailable':
            return 'bg-[#C1BDD2] border border-[#7C7777] text-gray-500 cursor-not-allowed';
        case 'pending':
            return 'bg-[#FDE68A] text-[#78350F] border border-[#F59E0B]';
        default:
            return 'bg-[#C1BDD2]';
    }
};

const SingleSeat = ({
    id,
    number,
    status,
    type = 'individual',
    selectedSeat,
    onSelect,
    className = '',
}: SingleSeatProps) => {
    const isClickable = status === 'available';

    return (
        <div className={`absolute group ${className}`}>
            <button
                type="button"
                disabled={!isClickable}
                onClick={() => {
                    if (!isClickable) return;
                    onSelect(id, type)
                }} // Aici trimitem si tipul in sus la harta
                className={`flex h-[30px] w-[30px] items-center justify-center rounded text-xs font-bold transition-all ${getSeatColor(id, status, type, selectedSeat)} ${isClickable ? 'hover:scale-110 hover:shadow-md z-20' : ''}`}
            >
                {number}
            </button>

            <div className="pointer-events-none absolute -top-8 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded bg-[#29255E] px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                ID: {id}
            </div>
        </div>
    );
};

export default SingleSeat;




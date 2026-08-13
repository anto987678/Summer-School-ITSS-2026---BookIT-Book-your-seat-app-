import React, { useState } from 'react';
import BackButton from "@/components/BackButton";
import TextField from "@mui/material/TextField";
import AIAssistant from '../AIAssistant';
const Preferences = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const colleaguesData = [
        { id: 1, name: 'Claudiu I.', percentage: 25, days: 5, room: 'Sala 404', seat: 'Locul 12' },
        { id: 2, name: 'Ana P.', percentage: 60, days: 12, room: 'Open Space T1', seat: 'Locul 5' },
        { id: 3, name: 'Cristian M.', percentage: 5, days: 1, room: 'Sala Gaming G2', seat: 'Canapea' },
        { id: 4, name: 'Diana R.', percentage: 90, days: 19, room: 'Sala de Ședințe S1', seat: 'Locul 2' },
        { id: 5, name: 'Andrei V.', percentage: 50, days: 10, room: 'Outland', seat: 'Locul 8' },
        { id: 6, name: 'Edi T.', percentage: 75, days: 15, room: 'Birou B1', seat: 'Locul 5' },
        { id: 7, name: 'Antonia D.', percentage: 70, days: 14, room: 'Birou B1', seat: 'Locul 6' },
        { id: 8, name: 'Alex N.', percentage: 40, days: 8, room: 'Birou B1', seat: 'Locul 7' },
    ];

    const filteredColleagues = colleaguesData.filter((colleague) =>
        colleague.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);

    return (
        <div className="min-h-screen bg-[#F5F3FF] p-8">
            <div className="max-w-5xl mx-auto space-y-12">
                <BackButton fallbackTo="/dashboard" />

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="w-full">
                        <TextField
                            id="search-preferences"
                            variant="outlined"
                            fullWidth
                            placeholder="Caută un coleg după nume..."
                            size="small"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{
                                backgroundColor: "#F9FAFB",
                                borderRadius: "60px",
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "60px",
                                    "& fieldset": { borderColor: "#D1D5DB" },
                                    "&:hover fieldset": { borderColor: "#6D28D9" },
                                    "&.Mui-focused fieldset": { borderColor: "#6D28D9" },
                                },
                            }}
                        />
                        <p className="text-xs text-gray-400 mt-2 ml-4">
                            Caută o persoană pentru a-i vedea preferințele din ultima lună.
                        </p>

                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-3xl font-bold text-[#1E1B4B] mb-10 text-center">
                        Preferințele Colegilor (Ultima Lună)
                    </h2>

                    <div className="space-y-6 max-w-4xl mx-auto w-full">
                        {filteredColleagues.map((colleague) => (
                            <div key={colleague.id} className="flex flex-col items-start w-full">
                                <h3 className="text-[22px] font-bold text-[#1E1B4B] mb-2 ml-4">
                                    {colleague.name}
                                </h3>

                                <div className="bg-[#EDE9FE] border border-[#DDD6FE] rounded-full px-8 py-6 text-lg font-bold text-[#1E1B4B] shadow-sm w-full text-left">
                                    {colleague.name.split(' ')[0]} a venit {colleague.percentage}% la birou în ultima lună (prezent fizic {colleague.days} zile).
                                    <span className="text-[#6D28D9] ml-2">
                                        (Preferință: {colleague.room}, {colleague.seat})
                                    </span>
                                </div>
                            </div>
                        ))}

                        {filteredColleagues.length === 0 && (
                            <div className="text-center text-xl text-gray-400 font-medium mt-10 w-full">
                                Nu am găsit niciun coleg cu acest nume.
                            </div>
                        )}
                    </div>
                    
                    <AIAssistant/>

                </div>
            </div>
        </div>
    );
};

export default Preferences;


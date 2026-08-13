import React, { useState } from 'react';
import BackButton from "@/components/BackButton";
import AIAssistant from '../AIAssistant';

const HRReports = () => {

    const [monthlyTraffic] = useState([
        { day: 'Luni', employeesCount: 32 },
        { day: 'Marți', employeesCount: 65 },
        { day: 'Miercuri', employeesCount: 58 },
        { day: 'Joi', employeesCount: 70 },
        { day: 'Vineri', employeesCount: 25 },
    ]);

    const [zonePopularity] = useState([
        { zone: 'Parter (SD0, S0, B0)', occupancyRate: '85%', level: 'Ridicat' },
        { zone: 'T1 Etaj 1 (Sala Evenimente & S1)', occupancyRate: '92%', level: 'Foarte Ridicat' },
        { zone: 'T1 Etaj 2 (Sala Gaming G2)', occupancyRate: '45%', level: 'Moderat' },
        { zone: 'T2 Etaj 1 (Sala 404 & B1)', occupancyRate: '78%', level: 'Ridicat' },
        { zone: 'T2 Etaj 2 (Outland, SD2, B2)', occupancyRate: '60%', level: 'Moderat' },
    ]);

    const [roomsUtilization] = useState([
        { name: 'Sala de ședințe S0 (Parter)', type: 'Rezervare Integrală', utilization: '75%' },
        { name: 'Sala de birouri B0 (Parter)', type: 'Locuri individuale', utilization: '80%' },
        { name: 'Sala Evenimente E1 (T1, Etaj 1)', type: 'Rezervare Integrală', utilization: '95%' },
        { name: 'Sala de ședințe S1 (T1, Etaj 1)', type: 'Rezervare Integrală', utilization: '60%' },
        { name: 'Sala Gaming G2 (T1, Etaj 2)', type: 'Locuri individuale', utilization: '40%' },
        { name: 'Sala 404 (T2, Etaj 1)', type: 'Rezervare Integrală', utilization: '90%' },
        { name: 'Sala de birouri B1 (T2, Etaj 1)', type: 'Locuri individuale', utilization: '70%' },
        { name: 'Outland O2 (T2, Etaj 2)', type: 'Rezervare Integrală', utilization: '85%' },
        { name: 'Birouri B2 & SD2 (T2, Etaj 2)', type: 'Mixt', utilization: '65%' },
    ]);

    const maxTraffic = Math.max(...monthlyTraffic.map((item) => item.employeesCount));

    return (
        <div className="min-h-screen bg-[#F5F3FF] p-8">
            <div className="max-w-7xl mx-auto">
                <BackButton className="mb-6" fallbackTo="/dashboard" />
            </div>


            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-[#2D2A4A]">Rapoarte și Analiză HR</h1>
                <p className="text-sm text-gray-500 mt-1">Prezența medie lunară și utilizarea spațiilor de birouri</p>
            </div>


            <div className="max-w-7xl mx-auto space-y-8">


                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">


                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div>
                            <h3 className="text-base font-semibold text-[#2D2A4A] mb-1">Traficul pe Zile (Medie Lunară)</h3>
                            <p className="text-xs text-gray-400 mb-6">Numărul mediu de angajați prezenți fizic în birouri</p>


                            <div className="flex items-end justify-around h-48 px-2 pt-6 border-b border-l border-gray-200">
                                {monthlyTraffic.map((item, index) => {

                                    const heightPercentage = Math.max((item.employeesCount / maxTraffic) * 100, 10);

                                    return (
                                        <div key={index} className="flex flex-col items-center justify-end h-full w-full mx-2 group">

                                            <span className="text-xs font-bold text-purple-700 mb-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                                {item.employeesCount}
                                            </span>


                                            <div
                                                style={{ height: `${heightPercentage}%` }}
                                                className="w-full max-w-[40px] bg-purple-500 rounded-t-md transition-all duration-500 ease-out group-hover:bg-purple-700 shadow-sm"
                                            ></div>
                                        </div>
                                    );
                                })}
                            </div>


                            <div className="flex justify-around px-2 mt-3 text-xs font-medium text-gray-600">
                                {monthlyTraffic.map((item, index) => (
                                    <span key={index} className="w-full max-w-[40px] text-center">{item.day}</span>
                                ))}
                            </div>
                        </div>
                    </div>


                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
                        <h3 className="text-base font-semibold text-[#2D2A4A] mb-1">Popularitatea Zonelor (Heatmap)</h3>
                        <p className="text-xs text-gray-400 mb-6">Gradul mediu lunar de solicitare pe fiecare zonă</p>

                        <div className="space-y-4 flex-1 flex flex-col justify-center">
                            {zonePopularity.map((zone, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{zone.zone}</p>
                                        <span className="text-[11px] text-purple-600 font-semibold">Nivel trafic: {zone.level}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className="bg-purple-600 h-2.5 rounded-full transition-all duration-1000"
                                                style={{ width: zone.occupancyRate }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-bold text-gray-700 w-10 text-right">{zone.occupancyRate}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>


                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-base font-semibold text-[#2D2A4A]">Rata de Ocupare per Sală / Birou</h3>
                            <p className="text-xs text-gray-400">Statistici detaliate (rezervare integrală vs. locuri individuale)</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {roomsUtilization.map((room, index) => (
                            <div key={index} className="border border-gray-100 bg-gray-50 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-800 mb-2">{room.name}</h4>
                                    <span className="inline-block px-2.5 py-1 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-full mb-4">
                                        {room.type}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-200">
                                    <span className="text-xs text-gray-500 font-medium">Grad ocupare lunar:</span>
                                    <span className="text-base font-bold text-purple-700">{room.utilization}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <AIAssistant/>
        </div>
    );
};

export default HRReports;

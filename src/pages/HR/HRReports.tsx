import { useEffect, useState } from "react"
import BackButton from "@/components/BackButton";
import AIAssistant from '../AIAssistant';

const HRReports = () => {
  const [reportData, setReportData] = useState<any>({
    monthlyTraffic: [],
    zonePopularity: [],
    roomsUtilization: [],
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("http://localhost:8080/hr/reports", {
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("Failed to load reports")
        }

        const data = await response.json()
        setReportData({
          monthlyTraffic: data.monthlyTraffic ?? [],
          zonePopularity: data.zonePopularity ?? [],
          roomsUtilization: data.roomsUtilization ?? [],
        })
      } catch {
        setReportData({
          monthlyTraffic: [],
          zonePopularity: [],
          roomsUtilization: [],
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchReports()
  }, [])

  const monthlyTraffic = reportData.monthlyTraffic
  const zonePopularity = reportData.zonePopularity
  const roomsUtilization = reportData.roomsUtilization

  const maxTraffic =
    monthlyTraffic.length > 0
      ? Math.max(...monthlyTraffic.map((item: any) => Number(item.employeesCount) || 0))
      : 1

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F3FF] p-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-gray-500">Se încarcă rapoartele HR...</p>
        </div>
      </div>
    )
  }

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
                {monthlyTraffic.map((item: any, index: number) => {
                  const heightPercentage = Math.max((Number(item.employeesCount) / maxTraffic) * 100, 10);

                  return (
                    <div key={index} className="flex flex-col items-center justify-end h-full w-full mx-2 group">
                      <span className="text-xs font-bold text-purple-700 mb-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        {item.employeesCount}
                      </span>

                      <div
                        style={{ height: `${heightPercentage}%` }}
                        className="w-full max-w-10 bg-purple-500 rounded-t-md transition-all duration-500 ease-out group-hover:bg-purple-700 shadow-sm"
                      ></div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-around px-2 mt-3 text-xs font-medium text-gray-600">
                {monthlyTraffic.map((item: any, index: number) => (
                  <span key={index} className="w-full max-w-10 text-center">{item.day}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-base font-semibold text-[#2D2A4A] mb-1">Popularitatea Zonelor (Heatmap)</h3>
            <p className="text-xs text-gray-400 mb-6">Gradul mediu lunar de solicitare pe fiecare zonă</p>

            <div className="space-y-4 flex-1 flex flex-col justify-center">
              {zonePopularity.map((zone: any, index: number) => (
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
            {roomsUtilization.map((room: any, index: number) => (
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

      <AIAssistant />
    </div>
  )
}

export default HRReports
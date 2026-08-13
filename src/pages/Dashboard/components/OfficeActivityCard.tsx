import DashboardCard from "./DashboardCard"
import {
  officeActivity,
  preferredZones,
} from "@/data/dashboardMockData"

const OfficeActivityCard = () => {
  const maximumDays = Math.max(
    ...officeActivity.map((item) => item.days),
  )

  let currentPercentage = 0

  const donutGradient = preferredZones
    .map((zone) => {
      const start = currentPercentage
      const end = start + zone.percentage

      currentPercentage = end

      return `${zone.color} ${start}% ${end}%`
    })
    .join(", ")

  return (
    <DashboardCard title="Your Office Activity">
      <p className="mt-1 text-xs text-gray-400">
        Weekly days in office
      </p>

      {/* Graficul cu bare */}
      <div className="relative mt-5 h-[180px]">
        {/* Liniile orizontale din spatele graficului */}
        <div className="pointer-events-none absolute inset-x-0 top-6 border-t border-gray-200" />
        <div className="pointer-events-none absolute inset-x-0 top-[78px] border-t border-gray-200" />
        <div className="pointer-events-none absolute inset-x-0 top-[130px] border-t border-gray-200" />

        <div className="relative flex h-full items-end justify-around gap-3 px-2 pb-6">
          {officeActivity.map((item) => (
            <div
              key={item.label}
              className="flex h-full flex-1 flex-col items-center justify-end"
            >
              <span className="mb-1 text-xs text-gray-500">
                {item.days}d
              </span>

              <div
                className="w-8 rounded-t-md bg-[#7C3AED] transition-all hover:bg-[#6D28D9]"
                style={{
                  height: `${(item.days / maximumDays) * 100}px`,
                }}
              />

              <span className="mt-2 text-xs text-gray-400">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Preferred zones */}
      <div className="mt-5">
        <h4 className="font-semibold text-[#29255E]">
          Preferred Seat Zones
        </h4>

        <p className="mt-1 text-xs text-gray-400">
          All-time distribution
        </p>

        <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row">
          {/* Donut */}
          <div
            className="relative h-32 w-32 shrink-0 rounded-full"
            style={{
              background: `conic-gradient(${donutGradient})`,
            }}
          >
            <div className="absolute inset-[26px] flex items-center justify-center rounded-full bg-white">
              <div className="text-center">
                <p className="text-xs text-gray-400">
                  Top
                </p>

                <p className="font-bold text-[#29255E]">
                  A
                </p>
              </div>
            </div>
          </div>

          {/* Legenda */}
          <div className="flex flex-col gap-3">
            {preferredZones.map((zone) => (
              <div
                key={zone.name}
                className="flex items-center gap-2"
              >
                <span
                  className="h-3 w-3 rounded-sm"
                  style={{
                    backgroundColor: zone.color,
                  }}
                />

                <span className="text-xs text-gray-500">
                  {zone.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardCard>
  )
}

export default OfficeActivityCard
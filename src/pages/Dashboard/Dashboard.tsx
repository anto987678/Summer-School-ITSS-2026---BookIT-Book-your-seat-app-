import { Link } from "react-router-dom"
import AIAssistant from "@/pages/AIAssistant"
import CityOverviewCard from "./components/CityOverviewCard"
import OfficeActivityCard from "./components/OfficeActivityCard"
import { useCurrentUser } from "@/hooks/useCurrentUser"

const Dashboard = () => {
  const { user: currentUser, isLoading } = useCurrentUser()
  const isHr = currentUser.role === "CEO" || currentUser.role === "MANAGER"
  const displayName = isLoading ? "Se incarca..." : currentUser.name

  return (
    <div className="min-h-full bg-[#F5F3FF] p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#29255E] sm:text-2xl">
                Good morning, {displayName}!
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Ready to book your seat for today?
              </p>
            </div>

            {isHr && (
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Link 
                  to="/istoric"
                  className="rounded-full bg-[#6D28D9] px-6 py-3 text-center font-semibold text-white transition-all hover:bg-[#5B21B6]"
                >
                  Istoric angajati
                </Link>

                <Link 
                  to="/preferinte"
                  className="rounded-full border-2 border-[#6D28D9] bg-white px-6 py-3 text-center font-semibold text-[#6D28D9] transition-all hover:bg-[#EDE9FE]"
                >
                  Preferinte
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard content */}
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-[0.85fr_1.35fr]">
          <OfficeActivityCard />

          <CityOverviewCard />
        </div>
      </div>

      <AIAssistant />
    </div>
  )
}

export default Dashboard

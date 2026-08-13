import { useState } from "react"
import { Link } from "react-router-dom"
import { ChevronDown } from "lucide-react"

import hrReports from "../assets/HR_reports_icon.svg"
import historyIcon from "../assets/istoric_angajatit.svg"
import preferencesIcon from "../assets/preferinte_icon.svg"

type SidebarHrItemProps = {
  isExtended: boolean
  onNavigate?: () => void
}

const SidebarHrItem = ({
  isExtended,
  onNavigate,
}: SidebarHrItemProps) => {
  const [isMobileSubmenuOpen, setIsMobileSubmenuOpen] =
    useState(false)

  const handleNavigation = () => {
    setIsMobileSubmenuOpen(false)
    onNavigate?.()
  }

  return (
    <div className="relative mt-10">
      <div className="flex justify-center sm:hidden">
        <div className="w-[calc(100%-24px)]">
          <div className="flex items-center rounded-[18px] transition hover:bg-[#7C3AED]">
            <Link
              to="/hr-reports"
              onClick={handleNavigation}
              className="flex min-w-0 flex-1 items-center justify-center gap-3 px-3 py-3 text-white"
            >
              <img
                src={hrReports}
                alt="HR reports"
                className="h-8 w-8 shrink-0"
              />

              <span className="whitespace-nowrap text-[20px]">
                Reports
              </span>
            </Link>

            <button
              type="button"
              onClick={() =>
                setIsMobileSubmenuOpen(
                  (previous) => !previous,
                )
              }
              aria-label={
                isMobileSubmenuOpen
                  ? "Inchide optiunile Reports"
                  : "Deschide optiunile Reports"
              }
              aria-expanded={isMobileSubmenuOpen}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] text-white transition hover:bg-white/10"
            >
              <ChevronDown
                className={`h-5 w-5 transition-transform duration-300 ${
                  isMobileSubmenuOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>
          </div>

          {isMobileSubmenuOpen && (
            <div className="mt-2 flex flex-col overflow-hidden rounded-lg bg-[#1E1B4B]">
              <Link
                to="/istoric"
                onClick={handleNavigation}
                className="flex items-center gap-4 px-5 py-4 text-left text-base font-bold text-white transition hover:bg-[#7C3AED]"
              >
                <img
                  src={historyIcon}
                  alt=""
                  className="h-7 w-7 invert"
                />

                Istoric angajati
              </Link>

              <Link
                to="/preferences"
                onClick={handleNavigation}
                className="flex items-center gap-4 border-t border-white/10 px-5 py-4 text-left text-base font-bold text-white transition hover:bg-[#7C3AED]"
              >
                <img
                  src={preferencesIcon}
                  alt=""
                  className="h-7 w-7 invert"
                />

                Preferinte
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="group relative z-[90] hidden justify-center sm:flex">
        <Link
          to="/hr-reports"
          className={`flex items-center justify-center gap-3 rounded-[18px] px-3 py-3 transition-all hover:bg-[#6D28D9] ${
            isExtended
              ? "w-[calc(100%-24px)]"
              : ""
          }`}
        >
          <img
            src={hrReports}
            alt="HR reports"
            className="h-10 w-10"
          />

          {isExtended && (
            <span className="whitespace-nowrap text-[24px] text-white">
              Reports
            </span>
          )}
        </Link>

        <div className="absolute left-full top-0 z-[100] hidden w-64 flex-col overflow-hidden rounded-md border border-[#C4B5FD] bg-[#EDE9FE] opacity-100 shadow-xl group-hover:flex">
          <Link
            to="/istoric"
            className="flex items-center gap-4 bg-[#EDE9FE] px-5 py-4 text-left text-lg font-bold text-[#111827] hover:bg-[#D8B4FE]"
          >
            <img
              src={historyIcon}
              alt=""
              className="h-7 w-7"
            />

            Istoric angajati
          </Link>

          <Link
            to="/preferences"
            className="flex items-center gap-4 bg-[#EDE9FE] px-5 py-4 text-left text-lg font-bold text-[#111827] hover:bg-[#D8B4FE]"
          >
            <img
              src={preferencesIcon}
              alt=""
              className="h-7 w-7"
            />

            Preferinte
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SidebarHrItem









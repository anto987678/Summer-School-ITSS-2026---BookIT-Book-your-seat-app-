import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SidebarNavItem from "@/components/SidebarNavItem";
import SidebarHrItem from "@/components/SidebarHrItem";
import logo from "../assets/Logo_without_bg.svg";
import collapsedArrow from "../assets/CollapseArrow.svg";
import home from "../assets/Home.svg";
import invite from "../assets/Invite.svg";
import history from "../assets/History.svg";

const navItems = [
  { to: "/dashboard", icon: home, label: "Home" },
  { to: "/invite", icon: invite, label: "Invite" },
  { to: "/history", icon: history, label: "History" },
];


type UserRole = "CEO" | "MANAGER" | "PM" | "DEV" | "HR";

type CurrentUser = {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
};

type SidebarProps = {
  isMobileOpen: boolean
  onMobileClose: () => void
}

const Sidebar = ( {isMobileOpen, onMobileClose}: SidebarProps ) => {
  const [isExtended, setIsExtended] = useState(false);
  const [isHr, setIsHr] = useState(false);

  const showLabels = isMobileOpen || isExtended

  const handleMobileNavigation = () => {
    if (isMobileOpen) {
      onMobileClose()
    }
  }

  useEffect(() => {
    if (import.meta.env.VITE_MOCK_AUTH === "true") {
      const mockUser = localStorage.getItem("mockUser");
      if (!mockUser) {
        setIsHr(false);
        return;
      }

      const data = JSON.parse(mockUser) as CurrentUser;
      setIsHr(data.role === "CEO" || data.role === "MANAGER" || data.role === "HR");
      return;
    }

    fetch("http://localhost:8080/me", {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Not logged in");
        }

        return response.json();
      })
      .then((data: CurrentUser) => {
        setIsHr(data.role === "CEO" || data.role === "MANAGER" || data.role === "HR");
      })
      .catch(() => {
        setIsHr(false);
      });
  }, []);

  return (
    <>
      <button 
        type = "button"
        onClick={onMobileClose}
        area-label="Close sidebar"

        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 sm:hidden ${
        isMobileOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      />

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          h-screen w-[280px] max-w-[85vw]
          shrink-0 overflow-hidden sm:overflow-visible
          bg-[#1E1B4B]
          transition-all duration-300

          sm:relative
          sm:z-50
          sm:max-w-none
          sm:translate-x-0

          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          ${
            isExtended
              ? "sm:w-64"
              : "sm:w-24"
          }
        `}
      >
        <nav className="flex h-full flex-col bg-[#1E1B4B]">
          <br />
          <Link 
            to="/dashboard"
            onClick={handleMobileNavigation}
          >
            <div className="flex items-center justify-center gap-3">
              <img
                src={logo}
                alt="BookIT logo"
                className="h-8 w-8 shrink-0 sm:h-10 sm:w-10"
              />

              {showLabels && (
                <h1 className="whitespace-nowrap text-[24px] font-semibold text-white sm:text-[30px]">
                  BookIT
                </h1>
              )}
            </div>
          </Link>

          <div className="mt-10 flex flex-col">
            {navItems.map((item) => (
              <div
                key={item.to}
                onClick={handleMobileNavigation}
              >
                <SidebarNavItem
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  isExtended={showLabels}
                />
              </div>
            ))}
            {isHr && (
              <SidebarHrItem
                isExtended={showLabels}
                onNavigate={handleMobileNavigation}
              />
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsExtended((previous) => !previous)}
            className={`mt-auto hidden items-center rounded-lg p-3 text-white transition hover:bg-white/10 sm:flex ${
              isExtended
                ? "justify-start gap-3"
                : "justify-center"
            }`}
            aria-label={isExtended ? "Collapse sidebar" : "Expand sidebar"}
          >
            <img
              src={collapsedArrow}
              alt="Collapse sidebar"
              className={`h-8 w-8 transition-transform duration-300 sm:h-10 sm:w-10 ${
                isExtended ? "rotate-180" : ""
              }`}
            />

            {isExtended && (
              <span className="whitespace-nowrap text-[20px] text-white sm:text-[24px]">
                Collapse
              </span>
            )}
          </button>

          <br />
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;










import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft, Bell, ChevronRight, Menu, Search, X } from "lucide-react"
import TextField from "@mui/material/TextField"
import { useCurrentUser } from "@/hooks/useCurrentUser"

import logo from "../assets/Logo.svg"
import user from "../assets/User.svg"
import details from "../assets/User_details.svg"
import logout from "../assets/Logout.svg"

type TopbarProps = {
  notificationCount?: number
  onOpenMobileMenu: () => void
}

const pages = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Notifications", path: "/notifications" },
  { label: "History", path: "/history" },
  { label: "User Details", path: "/user-details" },
  { label: "Invite", path: "/invite" },
  { label: "Seats", path: "/seats" },
  { label: "Book Now", path: "/book-now" },
  { label: "HR Reports", path: "/hr-reports", hrOnly: true },
  { label: "Preferinte", path: "/preferences", hrOnly: true },
  { label: "Istoric angajati", path: "/istoric", hrOnly: true },
]

const Topbar = ({ notificationCount = 0, onOpenMobileMenu }: TopbarProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [isMobileUserMenuOpen, setIsMobileUserMenuOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const { user: currentUser, isLoading: isCurrentUserLoading } = useCurrentUser(location.pathname)
  const displayName = isCurrentUserLoading ? "Se incarca..." : currentUser.name
  const displayEmail = isCurrentUserLoading ? "" : currentUser.email || "Email indisponibil"
  const userInitial = displayName.trim().charAt(0).toUpperCase() || "U"
  const canUseHrFlow = ["CEO", "MANAGER", "HR"].includes(currentUser.role)
  const visiblePages = pages.filter((page) => !page.hrOnly || canUseHrFlow)

  const suggestions = searchValue.trim()
    ? visiblePages.filter((page) =>
        page.label.toLowerCase().includes(searchValue.trim().toLowerCase())
      )
    : []

  const authPages = [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/change-password",
  ]

  const hiddenButtons = authPages.includes(location.pathname)

  const closeMobileMenus = () => {
    setIsMobileSearchOpen(false)
    setIsMobileUserMenuOpen(false)
  }



  return (
    <nav className="relative z-30 w-full border-b border-purple-100 bg-[#312E81] px-3 py-3 shadow-sm sm:px-6 md:py-4">
      {hiddenButtons ? (
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="BookIT logo" className="h-10" />
          <h3 className="text-xl font-semibold text-white">BookIT</h3>
        </Link>
      ) : (
        <>
          <div
            className={
              isMobileSearchOpen
                ? "hidden items-center sm:flex sm:justify-between"
                : "grid grid-cols-[1fr_auto_1fr] items-center sm:flex sm:justify-between"
            }
          >
            <div className="flex justify-start sm:hidden">
              <button
                type="button"
                onClick={() => {
                  setIsMobileUserMenuOpen(false)
                  onOpenMobileMenu()
                }}
                aria-label="Open navigation menu"
                aria-controls="main-sidebar"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-white/10 sm:hidden"
              >
                <Menu className="h-7 w-7" />
              </button>
            </div>

            <Link
              to="/book-now"
              onClick={closeMobileMenus}
              className="flex items-center justify-center rounded-[60px] border border-white bg-[#6D28D9] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#5B21B6] sm:text-base"
            >
              Book now
            </Link>

            <div className="flex min-w-0 items-center justify-end gap-1 sm:gap-2 md:gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsMobileUserMenuOpen(false)
                  setIsMobileSearchOpen(true)
                }}
                aria-label="Open search"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-white/10 sm:hidden"
              >
                <Search className="h-6 w-6" />
              </button>

              <div className="relative hidden w-[220px] sm:block xl:w-[300px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <TextField
                  id="search"
                  variant="outlined"
                  fullWidth
                  placeholder="Search"
                  size="small"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "60px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "60px",
                      "& fieldset": { borderColor: "white" },
                      "&:hover fieldset": { borderColor: "white" },
                      "&.Mui-focused fieldset": { borderColor: "white" },
                    },
                    "& .MuiOutlinedInput-input": {
                      paddingLeft: "42px",
                    },
                  }}
                />
                {suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-xl border border-purple-200 bg-white shadow-lg">
                    {suggestions.map((page) => (
                      <button
                        key={page.path}
                        type="button"
                        onClick={() => {
                          navigate(page.path)
                          setSearchValue("")
                        }}
                        className="block w-full border-b border-gray-100 px-3 py-2 text-left text-sm text-[#29255E] last:border-b-0 hover:bg-purple-50"
                      >
                        {page.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/notifications"
                onClick={closeMobileMenus}
                className="relative flex h-10 w-10 items-center justify-center sm:h-12 sm:w-12"
                aria-label={`Notifications: ${notificationCount}`}
              >
                <Bell className="h-6 w-6 text-white sm:h-8 sm:w-8" />

                {notificationCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full border border-[#F87171] bg-[#FEE2E2] px-1 text-xs font-bold text-[#F87171]">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={() => {
                  setIsMobileSearchOpen(false)
                  setIsMobileUserMenuOpen((current) => !current)
                }}
                className="flex h-10 w-10 items-center justify-center sm:hidden"
                aria-label="Open user menu"
                aria-expanded={isMobileUserMenuOpen}
              >
                <img src={user} alt="User" className="h-9 w-9" />
              </button>

              <div className="group relative hidden sm:block">
                <img src={user} alt="User" className="h-10 w-10 cursor-pointer" />

                <div className="absolute right-0 top-full z-50 hidden pt-2 group-hover:flex">
                  <div className="flex w-48 flex-col divide-y divide-[#EDE9FE] overflow-hidden rounded-lg bg-[#EDE9FE] py-2 shadow-lg">
                    <div className="flex items-center gap-4 px-3 py-2 font-bold text-[#1E1B4B]">
                      <img src={user} alt="" className="h-6 w-6" />
                      <h3>{displayName}</h3>
                    </div>

                    <Link
                      to="/user-details"
                      className="bg-[#E9D5FF] py-2 text-[#1E1B4B] transition hover:bg-[#EDE9FE]"
                    >
                      <div className="flex items-center gap-4 px-3 font-bold">
                        <img src={details} alt="" className="h-6 w-6" />
                        <h3>User details</h3>
                      </div>
                    </Link>

                    <Link
                      to="/"
                      className="bg-[#E9D5FF] py-2 text-[#1E1B4B] transition hover:bg-[#EDE9FE]"
                    >
                      <div className="flex items-center gap-4 px-3 font-bold">
                        <img src={logout} alt="" className="h-6 w-6" />
                        <h3>Log out</h3>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={
              isMobileSearchOpen
                ? "flex w-full items-center gap-2 sm:hidden"
                : "hidden"
            }
          >
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(false)}
              aria-label="Close search"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white transition hover:bg-white/10"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>

            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <input
                autoFocus
                type="search"
                placeholder="Search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                className="w-full rounded-full border border-white bg-white py-2.5 pl-12 pr-4 text-[#1E1B4B] outline-none"
              />
            </div>
          </div>

          {isMobileUserMenuOpen && !isMobileSearchOpen && (
            <div className="fixed inset-0 z-[100] sm:hidden">
              <button
                type="button"
                onClick={() => setIsMobileUserMenuOpen(false)}
                aria-label="Close user menu"
                className="absolute inset-0 bg-[#0B0A1A]/45"
              />

              <section
                role="dialog"
                aria-modal="true"
                aria-label="User account menu"
                className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-[28px] bg-white px-4 pb-8 pt-3 shadow-2xl"
              >
                <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-200" />

                <div className="flex items-center justify-between px-1">
                  <h2 className="text-lg font-bold text-[#29255E]">
                    Contul meu
                  </h2>

                  <button
                    type="button"
                    onClick={() => setIsMobileUserMenuOpen(false)}
                    aria-label="Close user menu"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-4 rounded-2xl bg-[#F5F3FF] p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#8B5CF6] text-lg font-bold text-white">
                    {userInitial}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-[#29255E]">
                      {displayName}
                    </h3>

                    <p className="truncate text-sm text-gray-400">
                      {displayEmail}
                    </p>
                  </div>
                </div>

                <Link
                  to="/user-details"
                  onClick={closeMobileMenus}
                  className="mt-4 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-[#29255E] transition hover:bg-[#F5F3FF]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5F3FF]">
                    <img src={details} alt="" className="h-6 w-6" />
                  </span>

                  <span className="font-semibold">User Details</span>
                  <ChevronRight className="ml-auto h-5 w-5 text-gray-400" />
                </Link>

                <Link
                  to="/"
                  onClick={closeMobileMenus}
                  className="mt-3 flex items-center gap-3 rounded-2xl border border-red-300 bg-white p-4 text-red-500 transition hover:bg-red-50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
                    <img src={logout} alt="" className="h-6 w-6" />
                  </span>

                  <span className="font-semibold">Log out</span>
                  <ChevronRight className="ml-auto h-5 w-5" />
                </Link>
              </section>
            </div>
          )}
        </>
      )}
    </nav>
  )
}

export default Topbar














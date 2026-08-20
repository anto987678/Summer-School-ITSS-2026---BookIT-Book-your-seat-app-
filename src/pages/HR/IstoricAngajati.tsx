import { useEffect, useMemo, useState } from "react"
import {
  Building2,
  CalendarDays,
  Search,
  Users,
  X,
} from "lucide-react"

import BackButton from "@/components/BackButton"
import AIAssistant from "../AIAssistant"

const IstoricAngajati = () => {
  const [searchValue, setSearchValue] = useState("")
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedDepartment, setSelectedDepartment] =
    useState("All departments")

  const [selectedDate, setSelectedDate] = useState("")

  const departments = [
    "All departments",
    ...Array.from(
      new Set(
        employees
          .map((employee) => employee.department)
          .filter(Boolean)
      ),
    ),
  ]

  useEffect (() => {
    fetch("http://localhost:8080/hr/attendance-history", {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Nu s-au putut încărca datele angajaților.")
        }
        return response.json()
      })
      .then((data) => {
        setEmployees(data)
      })
      .catch(() => {
        setEmployees([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const filteredEmployees = useMemo(() => {
    const normalizedSearch = searchValue
      .trim()
      .toLowerCase()

    return employees.filter((employee) => {
      const matchesSearch = employee.name
        .toLowerCase()
        .includes(normalizedSearch)

      const matchesDepartment =
        selectedDepartment === "All departments" ||
        employee.department === selectedDepartment

      const matchesDate =
        selectedDate === "" ||
        employee.attendanceDates.includes(selectedDate)

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesDate
      )
    })
  }, [
    searchValue,
    selectedDepartment,
    selectedDate,
    employees
  ])

  const hasActiveFilters =
    searchValue.trim() !== "" ||
    selectedDepartment !== "All departments" ||
    selectedDate !== ""

  const clearFilters = () => {
    setSearchValue("")
    setSelectedDepartment("All departments")
    setSelectedDate("")
  }

  if (loading) {
    return (
      <div className="min-h-full bg-[#F5F3FF] p-4 sm:p-6 lg:p-8">
        <p className="text-center font-semibold text-[#29255E]">
          Se încarcă istoricul angajaților...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-[#F5F3FF] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <BackButton className="mb-4" fallbackTo="/dashboard" />

        {/* Titlul și filtrele */}
        <section className="rounded-2xl border border-[#DDD6FE] bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-7 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EDE9FE] text-[#6D28D9]">
              <Users className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#29255E] sm:text-3xl">
                Istoricul prezenței la birou al angajaților
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Caută colegii și analizează frecvența prezenței lor la birou.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_auto]">
            {/* Căutare după nume */}
            <div>
              <label
                htmlFor="employee-search"
                className="mb-2 block text-sm font-semibold text-[#29255E]"
              >
                Caută un coleg
              </label>

              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  id="employee-search"
                  type="search"
                  placeholder="Introdu numele colegului..."
                  value={searchValue}
                  onChange={(event) =>
                    setSearchValue(event.target.value)
                  }
                  className="w-full rounded-xl border-2 border-[#DDD6FE] bg-white py-3 pl-12 pr-4 text-[#29255E] outline-none transition focus:border-[#6D28D9]"
                />
              </div>
            </div>

            {/* Filtru după departament */}
            <div>
              <label
                htmlFor="department"
                className="mb-2 block text-sm font-semibold text-[#29255E]"
              >
                Departament
              </label>

              <div className="relative">
                <Building2 className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <select
                  id="department"
                  value={selectedDepartment}
                  onChange={(event) =>
                    setSelectedDepartment(event.target.value)
                  }
                  className="w-full appearance-none rounded-xl border-2 border-[#DDD6FE] bg-white py-3 pl-12 pr-4 text-[#29255E] outline-none transition focus:border-[#6D28D9]"
                >
                  {departments.map((department) => (
                    <option
                      key={department}
                      value={department}
                    >
                      {department}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filtru după dată */}
            <div>
              <label
                htmlFor="attendance-date"
                className="mb-2 block text-sm font-semibold text-[#29255E]"
              >
                Ziua prezenței
              </label>

              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  id="attendance-date"
                  type="date"
                  value={selectedDate}
                  onChange={(event) =>
                    setSelectedDate(event.target.value)
                  }
                  className="w-full rounded-xl border-2 border-[#DDD6FE] bg-white py-3 pl-12 pr-4 text-[#29255E] outline-none transition focus:border-[#6D28D9]"
                />
              </div>
            </div>

            {/* Buton de resetare */}
            <div className="flex items-end">
              <button
                type="button"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#6D28D9] px-5 py-3 font-semibold text-[#6D28D9] transition hover:bg-[#EDE9FE] disabled:cursor-not-allowed disabled:border-[#DDD6FE] disabled:text-gray-400 disabled:hover:bg-transparent xl:w-auto"
              >
                <X className="h-5 w-5" />
                Resetează
              </button>
            </div>
          </div>
        </section>

        {/* Numărul rezultatelor */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-[#29255E]">
            Rezultatele prezenței
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {filteredEmployees.length}{" "}
            {filteredEmployees.length === 1
              ? "angajat găsit"
              : "angajați găsiți"}
          </p>
        </div>

        {/* Lista angajaților */}
        {filteredEmployees.length > 0 ? (
          <div className="mt-6 flex flex-col gap-5">
            {filteredEmployees.map((employee) => {
              const attendancePercentage = Math.round(
                (
                  employee.presenceDays /
                  employee.totalWorkingDays
                ) * 100,
              )

              const firstName = employee.name.split(" ")[0]

              return (
                <article
                  key={employee.id}
                  className="rounded-2xl border border-[#DDD6FE] bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold text-[#29255E]">
                        {employee.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {employee.department}
                      </p>
                    </div>

                    <span className="rounded-full bg-[#EDE9FE] px-4 py-2 text-sm font-semibold text-[#6D28D9]">
                      {attendancePercentage}% prezență
                    </span>
                  </div>

                  <div className="mt-4 rounded-2xl bg-[#F5F3FF] p-5">
                    <p className="font-medium leading-relaxed text-[#29255E]">
                      {firstName} vine în aproximativ{" "}
                      {attendancePercentage}% dintre zile la
                      birou și a fost prezent fizic în{" "}
                      {employee.presenceDays} zile.
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-[#DDD6FE] bg-white px-6 py-12 text-center shadow-sm">
            <Users className="mx-auto h-10 w-10 text-[#A78BFA]" />

            <h3 className="mt-4 text-lg font-bold text-[#29255E]">
              Nu au fost găsiți angajați
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Modifică numele, departamentul sau data selectată.
            </p>
          </div>
        )}
      </div>

      <AIAssistant/>
    </div>
  )
}

export default IstoricAngajati


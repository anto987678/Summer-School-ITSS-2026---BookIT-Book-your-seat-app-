import { useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import BackButton from "@/components/BackButton"
import Calendar from "@/components/Calendar"

type TipRezervare = "RECURENTA" | "O_ZI"
type LocationState = { bookingType: TipRezervare; recurrenceWeeks?: number }

const HOURS = Array.from({ length: 11 }, (_, i) => 8 + i)
const MS_IN_DAY = 24 * 60 * 60 * 1000

const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)

const toDateValue = (date: Date) => date.toISOString().split("T")[0]

const SelectDateTime = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState | null
  const bookingType = state?.bookingType ?? "O_ZI"
  const recurrenceWeeks = state?.recurrenceWeeks ?? 0
  const isRecurring = bookingType === "RECURENTA"

  const [date, setDate] = useState(() => {
    const azi = new Date();
    azi.setHours(0, 0, 0, 0);
    return azi;
  });

  const [startHour, setStartHour] = useState(9)
  const [endHour, setEndHour] = useState(17)
  const [error, setError] = useState("")

  const recurrenceDates = useMemo(() => {
    if (!isRecurring || recurrenceWeeks <= 0) {
      return []
    }
    return Array.from({ length: recurrenceWeeks }, (_, index) => addDays(date, (index + 1) * 7))
  }, [date, isRecurring, recurrenceWeeks])

  const endDate = recurrenceDates.at(-1) ?? date

  const handleDateSelect = (newDate: Date) => {
    const azi = new Date();
    azi.setHours(0, 0, 0, 0);

    if (newDate < azi) {
      setError("Nu poți selecta o dată din trecut.");
      return;
    }

    setError("");
    setDate(newDate);
  };

  const handleStartHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStart = Number(e.target.value);
    setStartHour(newStart);

    if (endHour <= newStart) {
      setEndHour(newStart + 1);
    }
    setError("");
  };

  const handleContinue = () => {
    if (endHour <= startHour) {
      setError("Ora de sfarsit trebuie sa fie dupa ora de inceput.")
      return
    }

    navigate("/seats", {
      state: {
        bookingType,
        date: toDateValue(date),
        endDate: toDateValue(endDate),
        recurrenceDates: recurrenceDates.map(toDateValue),
        startHour,
        endHour,
        recurrenceWeeks,
      },
    })
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col bg-white p-4">
      <div className="mx-auto w-full max-w-7xl">
        <BackButton fallbackTo="/book-now" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-8">
        <h1 className="text-3xl font-bold text-[#29255E]">Alege data si intervalul orar</h1>

        <div className="flex flex-col items-center gap-4">
          <div>
            <p className="mb-2 font-semibold text-[#29255E]">
              {isRecurring ? "Data de inceput" : "Data rezervarii"}
            </p>
            <Calendar selected={date} onSelect={handleDateSelect} recurrenceDates={recurrenceDates} />
          </div>

          {isRecurring && recurrenceWeeks > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-[#29255E]">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#6D28D9]" />
                Data aleasa
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#C4B5FD]" />
                Repetari saptamanale
              </span>
              <span>
                Se repeta {recurrenceWeeks} {recurrenceWeeks === 1 ? "saptamana" : "saptamani"}, pana la {toDateValue(endDate)}.
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <label className="flex flex-col text-[#29255E]">
            Ora inceput
            <select value={startHour} onChange={handleStartHourChange} className="mt-1 rounded-lg border-2 border-[#DDD6FE] px-4 py-2">
              {HOURS.filter(h => h < Math.max(...HOURS)).map((h) => <option key={h} value={h}>{h}:00</option>)}
            </select>
          </label>
          <label className="flex flex-col text-[#29255E]">
            Ora sfarsit
            <select value={endHour} onChange={(e) => setEndHour(Number(e.target.value))} className="mt-1 rounded-lg border-2 border-[#DDD6FE] px-4 py-2">
              {HOURS.filter(h => h > startHour).map((h) => <option key={h} value={h}>{h}:00</option>)}
            </select>
          </label>
        </div>

        {error && <p className="font-semibold text-red-600">{error}</p>}

        <button
          onClick={handleContinue}
          className="rounded-full bg-[#6D28D9] px-10 py-3 font-semibold text-white hover:bg-[#5B21B6]"
        >
          Continua
        </button>
      </div>
    </div>
  )
}

export default SelectDateTime
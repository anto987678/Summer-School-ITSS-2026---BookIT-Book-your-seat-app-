import { useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import BackButton from "@/components/BackButton"
import Calendar from "@/components/Calendar"
import ErrorPopUp from "@/components/ErrorPopUp"

type TipRezervare = "RECURENTA" | "O_ZI"
type LocationState = {
  bookingType?: TipRezervare;
  recurrenceWeeks?: number;
  editReservationId?: number;
  roomCode?: string;
  seatCode?: string;
  date?: string;
  startHour?: number;
  endHour?: number;
}

const HOURS = Array.from({ length: 15 }, (_, i) => 8 + i)
const MS_IN_DAY = 24 * 60 * 60 * 1000

const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)

const isWeekend = (date: Date) => {
  const dayOfWeek = date.getDay()
  return dayOfWeek === 0 || dayOfWeek === 6
}

const isWeekendDateValue = (dateValue: string) => {
  const [year, month, day] = dateValue.split('-').map(Number)
  return isWeekend(new Date(year, month - 1, day))
}

const getNextBusinessDay = (date: Date) => {
  const nextDate = new Date(date)
  nextDate.setHours(0, 0, 0, 0)

  while (isWeekend(nextDate)) {
    nextDate.setDate(nextDate.getDate() + 1)
  }

  return nextDate
}

const toDateValue = (date: Date) => {
  const an = date.getFullYear();
  const luna = String(date.getMonth() + 1).padStart(2, '0');
  const ziua = String(date.getDate()).padStart(2, '0');

  return `${an}-${luna}-${ziua}`;
};

const SelectDateTime = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState | null
  const bookingType = state?.bookingType ?? "O_ZI"
  const recurrenceWeeks = state?.recurrenceWeeks ?? 0
  const editReservationId = state?.editReservationId
  const isRecurring = bookingType === "RECURENTA"

  const [date, setDate] = useState(() => {
    if (state?.date) {
      const [year, month, day] = state.date.split("-").map(Number)
      return getNextBusinessDay(new Date(year, month - 1, day))
    }

    const azi = new Date();
    azi.setHours(0, 0, 0, 0);
    return getNextBusinessDay(azi);
  });

  const [startHour, setStartHour] = useState(state?.startHour ?? 8)
  const [endHour, setEndHour] = useState(state?.endHour ?? 22)
  const [error, setError] = useState("")
  const [showWeekendError, setShowWeekendError] = useState(false);

  const recurrenceDates = useMemo(() => {
    if (!isRecurring || recurrenceWeeks <= 0) {
      return []
    }
    return Array.from({ length: recurrenceWeeks }, (_, index) => addDays(date, (index + 1) * 7))
  }, [date, isRecurring, recurrenceWeeks])

  const endDate = recurrenceDates.at(-1) ?? date


  const handleStartHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStart = Number(e.target.value);
    setStartHour(newStart);

    if (endHour <= newStart) {
      setEndHour(newStart + 1);
    }
    setError("");
  };

  const handleContinue = () => {
    const selectedDateValue = toDateValue(date)

    if (isWeekendDateValue(selectedDateValue)) {
      setShowWeekendError(true)
      return
    }

    if (endHour <= startHour) {
      setError("Ora de sfarsit trebuie sa fie dupa ora de inceput.")
      return
    }

    navigate("/seats", {
      state: {
        bookingType,
        date: selectedDateValue,
        endDate: toDateValue(endDate),
        recurrenceDates: recurrenceDates.map(toDateValue),
        startHour,
        endHour,
        recurrenceWeeks,
        editReservationId,
        roomCode: state?.roomCode,
        seatCode: state?.seatCode,
      },
    })
  }

  const handleDateSelect = (newDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isWeekend(newDate)) {
      setShowWeekendError(true)
      return
    }

    if (newDate < today) {
      setError("Nu poti selecta o data din trecut.")
      return
    }

    setError("")
    setDate(newDate)
  };

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

      {showWeekendError && (
        <ErrorPopUp
          title="Data invalida"
          message="Poti selecta doar zile de luni pana vineri."
          buttonText="Inchide"
          onClose={() => setShowWeekendError(false)}
        />
      )}
    </div>
  )
}

export default SelectDateTime

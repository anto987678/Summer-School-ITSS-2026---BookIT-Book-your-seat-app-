import { useState } from "react";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type CalendarProps = {
  selected: Date;
  onSelect: (date: Date) => void;
  recurrenceDates?: Date[];
};

const isSameDay = (dateA: Date, dateB: Date) =>
  dateA.getFullYear() === dateB.getFullYear() &&
  dateA.getMonth() === dateB.getMonth() &&
  dateA.getDate() === dateB.getDate();

export default function Calendar({ selected, onSelect, recurrenceDates = [] }: CalendarProps) {
  const [date, setDate] = useState(selected);

  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const totalDays = new Date(year, month + 1, 0).getDate();

  const days = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  const changeMonth = (offset: number) =>
    setDate(new Date(year, month + offset, 1));

  const getDayDate = (day: number) => new Date(year, month, day);

  const isSelectedDay = (day: number | null) =>
    day !== null && isSameDay(getDayDate(day), selected);

  const isRecurrenceDay = (day: number | null) =>
    day !== null && recurrenceDates.some((recurrenceDate) => isSameDay(getDayDate(day), recurrenceDate));

  return (
    <div style={{ background: "#DDD6FE", borderRadius: 24, padding: 24, width: 300, fontFamily: "sans-serif", color: "#1E1B4B" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <button onClick={() => changeMonth(-1)} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 20, color: "#1E1B4B" }}>
          &lt;
        </button>
        <strong>{MONTHS[month]} {year}</strong>
        <button onClick={() => changeMonth(1)} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 20, color: "#1E1B4B" }}>
          &gt;
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", rowGap: 8 }}>
        {DAYS.map((d, i) => (
          <div key={i} style={{ fontWeight: "bold" }}>{d}</div>
        ))}
        {days.map((day, i) => {
          const selectedDay = isSelectedDay(day);
          const recurrenceDay = isRecurrenceDay(day);

          return (
            <div
              key={i}
              onClick={() => day && onSelect(getDayDate(day))}
              style={{
                cursor: day ? "pointer" : "default",
                borderRadius: "50%",
                width: 30,
                height: 30,
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                background: selectedDay ? "#6D28D9" : recurrenceDay ? "#C4B5FD" : "transparent",
                color: selectedDay ? "#FFFFFF" : "#1E1B4B",
                fontWeight: 600,
              }}
            >
              {day || ""}
              {recurrenceDay && !selectedDay && (
                <span
                  style={{
                    position: "absolute",
                    bottom: 2,
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#6D28D9",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
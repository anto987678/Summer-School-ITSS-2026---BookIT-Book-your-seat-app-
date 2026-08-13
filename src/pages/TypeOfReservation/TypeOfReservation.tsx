import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/BackButton"
import AIAssistant from "@/pages/AIAssistant";

const reservationTypes = [
  { label: "Rezervare recurenta", bookingType: "RECURENTA" },
  { label: "Rezervare o singura zi", bookingType: "O_ZI" },
] as const;

const TypeOfReservation = () => {
  const navigate = useNavigate();
  const [showRecurrenceDropdown, setShowRecurrenceDropdown] = useState(false);

  const handleReservationTypeClick = (bookingType: "RECURENTA" | "O_ZI") => {
    if (bookingType === "RECURENTA") {
      setShowRecurrenceDropdown(true)
      return;
    }

    navigate("/select-date", {
      state: { bookingType },
    });
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col bg-white p-4">
      <div className="mx-auto w-full max-w-7xl">
        <BackButton fallbackTo="/dashboard" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <h1 className="mb-10 text-center text-3xl font-bold text-[#29255E] sm:mb-16 sm:text-4xl">
          Tipul rezervarii
        </h1>

        <div className="flex w-full max-w-3xl flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
          {reservationTypes.map((reservationType) => (
            <button
              key={reservationType.bookingType}
              type="button"
              onClick={() => handleReservationTypeClick(reservationType.bookingType)}
              className="rounded-[3rem] border-b border-[#C4B5FD] bg-[#EDE9FE] px-8 py-6 text-lg font-bold text-[#29255E] transition-all hover:scale-105 hover:bg-[#EBE9FE] hover:shadow-md sm:px-14 sm:py-8 sm:text-xl"
            >
              {reservationType.label}
            </button>
          ))}
        </div>

        {showRecurrenceDropdown && (
          <select
            defaultValue=""
            onChange={(event) => {
              navigate("/select-date", {
                state: {
                  bookingType: "RECURENTA",
                  recurrenceWeeks: Number(event.target.value),
                },
              });
            }}
            className="mt-6 rounded-lg border-2 border-[#C4B5FD] bg-[#EDE9FE] text-[#29255E] px-4 py-3 font-semibold text-[#29255E] hover:bg-[#EDE9FE]"
          >
            <option value="" disabled className="bg-[#EDE9FE] text-[#29255E]">
              Alege recurenta
            </option>
            <option value="1" className="bg-[#EDE9FE] text-[#29255E]">1 saptamana</option>
            <option value="2" className="bg-[#EDE9FE] text-[#29255E]">2 saptamani</option>
            <option value="3" className="bg-[#EDE9FE] text-[#29255E]">3 saptamani</option>
            <option value="4" className="bg-[#EDE9FE] text-[#29255E]">4 saptamani</option>
          </select>
        )}

      </div>

      <AIAssistant />
    </div>
  );
};

export default TypeOfReservation;

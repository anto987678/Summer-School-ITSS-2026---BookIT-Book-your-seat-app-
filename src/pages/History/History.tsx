import BackButton from "@/components/BackButton";
import AIAssistant from "@/pages/AIAssistant";
import { useEffect, useState } from "react";
import BookingTabs from "./components/BookingTabs";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import SuccessPopUp from "@/components/SuccessPopUp";
import ErrorPopUp from "@/components/ErrorPopUp";
import type { Booking, BookingTab } from "./types";
import { getBookingStatusClassName } from "@/lib/bookingStatus";

type ReservationApi = {
  id: number;
  status: string;
  startDateTime: string;
  endDateTime: string;
  seat?: {
    code: string;
    room?: {
      name: string;
    };
  } | null;
  room?: {
    name: string;
  } | null;
}

const History = () => {
  const [activeTab, setActiveTab] = useState<BookingTab>("Viitoare");

  // Am schimbat isModalOpen Ä‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹˇÄ‚â€šĂ‚Â®ntr-un state care Ä‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€žĂ„â€¦Ă„Ä…Ă‹â€ˇÄ‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„ÄľĂ„â€šĂ˘â‚¬Ä…Ä‚â€šĂ‚Âtie exact ce pop-up sĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„ÄľÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹˇÄ‚â€šĂ‚Â arate
  const [popupState, setPopupState] = useState<'none' | 'confirm' | 'success' | 'error'>('none');

  const [bookingToDelete, setBookingToDelete] = useState<number | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const getBookingStatus = (reservation: ReservationApi) => {
    const now = new Date();
    const endDate = new Date(reservation.endDateTime);
    if (reservation.status === "REJECTED") {
      return "Anulat";
    }
    

    if (endDate < now) {
      return "Finalizat";
    }

    if (reservation.status === "APPROVED") {
      return "Confirmat";
    }

    return "In asteptare";    
  };

  const getBookingTab = (reservation: ReservationApi): BookingTab => {
    const now = new Date();
    const endDate = new Date(reservation.endDateTime);

    if (reservation.status === "REJECTED") {
      return "Anulate";
    }

    if (endDate < now) {
      return "Trecute";
    }

    return "Viitoare";
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("ro-RO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  const formatTime = (start: string, end: string) => {
    return `${start.slice(11, 16)} - ${end.slice(11, 16)}`;
  };


  const handleDeleteClick = (id: number) => {
    setBookingToDelete(id);
    setPopupState('confirm');
  };

  const confirmDelete = async () => {
    if (!bookingToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:8080/reservations/cancel/${bookingToDelete}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Nu s-a putut anula rezervarea.");
      }

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === bookingToDelete
            ? {
                ...booking,
                status: "Anulat",
                tab: "Anulate",
              }
            : booking
        )
      );

      setPopupState("success");
      setBookingToDelete(null);
    } catch {
      setErrorMessage(
        "Nu s-a putut anula rezervarea. Verifica daca backend-ul ruleaza."
      );
      setPopupState("error");
      setBookingToDelete(null);
    }
  };

  const cancelDelete = () => {
    setPopupState('none');
    setBookingToDelete(null);
  };

  const displayedBookings = bookings.filter((booking) => booking.tab === activeTab);

  useEffect(() => {
    fetch("http://localhost:8080/reservations/history", {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Nu s-au putut incarca rezervarile.");
        }

        return response.json();
      })
      .then((reservations: ReservationApi[]) => {
        setBookings(
          reservations.map((reservation, index) => ({
            id: reservation.id,
            title: `Rezervare ${index + 1}`,
            date: formatDate(reservation.startDateTime),
            seat: reservation.seat?.code ?? "-",
            room: reservation.seat?.room?.name ?? reservation.room?.name ?? "-",
            time: formatTime(reservation.startDateTime, reservation.endDateTime),
            status: getBookingStatus(reservation),
            tab: getBookingTab(reservation),
          }))
        );
      })
      .catch(() => {
        setBookings([]);
        setErrorMessage(
          "Nu s-au putut incarca rezervarile. Verifica daca backend-ul ruleaza."
        );
        setPopupState("error");
      });
  }, []);

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] bg-white">
      <div className="relative min-w-0 flex-1 p-4 sm:p-8">
        <div className="mx-auto max-w-5xl">
          <BackButton className="mb-6" fallbackTo="/dashboard" />

          <BookingTabs activeTab={activeTab} onChange={setActiveTab} />

          <div className="flex flex-col gap-6">
            {displayedBookings.length === 0 ? (
              <p className="mt-10 text-center text-gray-400">
                Nu exista rezervari in aceasta categorie.
              </p>
            ) : (
              displayedBookings.map((booking) => {
                const canCancel = booking.tab === "Viitoare" && booking.status === "In asteptare";
                const canModify = booking.tab === "Viitoare" && booking.status === "In asteptare";

                return (
                  <div key={booking.id}>
                    <h4 className="mb-2 text-sm font-bold text-gray-700">{booking.title}</h4>
                    <div className="flex flex-col gap-4 rounded-2xl bg-[#F8F8FC] p-4 shadow-sm md:flex-row md:items-center md:justify-between">
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EBE9FE]">
                          <span className="text-xl">S</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500">Data - Scaun - Sala</p>
                          <p className="font-bold text-[#29255E]">
                            {booking.date} - {booking.seat} - {booking.room}
                          </p>
                          <p className="font-bold text-[#29255E]">{booking.time}</p>
                        </div>
                      </div>

                      <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${getBookingStatusClassName(booking.status)}`}>
                        {booking.status}
                      </span>

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={canCancel ? () => handleDeleteClick(booking.id) : undefined}
                          className={
                            canCancel
                              ? "rounded-full border border-[#F87171] bg-[#FEE2E2] px-6 py-2 text-sm font-bold text-red-400 transition hover:bg-red-50"
                              : "rounded-full border border-[#6B7280] px-6 py-2 text-sm font-bold text-[#6B7280] transition"
                          }
                        >
                          Anuleaza
                        </button>
                        <button
                          type="button"
                          className={
                            canModify
                              ? "rounded-full border border-[#6D28D9] px-6 py-2 text-sm font-bold text-[#6D28D9] transition hover:bg-purple-50"
                              : "rounded-full border border-[#6B7280] px-6 py-2 text-sm font-bold text-[#6B7280] transition"
                          }
                        >
                          Modifica
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <AIAssistant />
      </div>


      {popupState === 'confirm' && (
        <ConfirmDeleteModal
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      {popupState === 'success' && (
        <SuccessPopUp
          title="Rezervare stearsa"
          sideMessage="Rezervarea ta a fost stearsa"
          highlightedText="CU SUCCES"
          onClose={() => setPopupState('none')} 
        />
      )}

      {popupState === "error" && (
        <ErrorPopUp
          title="Eroare"
          message={errorMessage}
          buttonText="Inchide"
          onClose={() => {
            setPopupState("none");
            setErrorMessage("");
          }}
        />
      )}

    </div>
  );
};

export default History;
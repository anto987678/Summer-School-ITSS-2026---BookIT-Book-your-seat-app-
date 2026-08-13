import BackButton from "@/components/BackButton";
import AIAssistant from "@/pages/AIAssistant";
import { useState } from "react";
import BookingTabs from "./components/BookingTabs";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import SuccessPopUp from "@/components/SuccessPopUp";
import type { Booking, BookingTab } from "./types";
import { getBookingStatusClassName } from "@/lib/bookingStatus";

const initialBookings: Booking[] = [
  { id: 1, title: "Rezervare 1", date: "28 Iulie 2026", seat: "Rand 3, C7", room: "Sala A", time: "09:00 - 17:00", status: "In asteptare", tab: "Viitoare" },
  { id: 2, title: "Rezervare 2", date: "30 Iulie 2026", seat: "Rand 1, C2", room: "Sala B", time: "10:00 - 18:00", status: "Confirmat", tab: "Viitoare" },
  { id: 3, title: "Rezervare 3", date: "02 August 2026", seat: "Rand 2, C5", room: "Sala A", time: "09:00 - 17:00", status: "In asteptare", tab: "Viitoare" },
  { id: 4, title: "Rezervare 4 (Finalizata)", date: "15 Iulie 2026", seat: "Rand 2, C1", room: "Sala B", time: "09:00 - 17:00", status: "Finalizat", tab: "Trecute" },
  { id: 5, title: "Rezervare 5 (Anulata)", date: "20 Iulie 2026", seat: "Rand 4, C12", room: "Sala C", time: "10:00 - 14:00", status: "Anulat", tab: "Anulate" },
];

const History = () => {
  const [activeTab, setActiveTab] = useState<BookingTab>("Viitoare");

  // Am schimbat isModalOpen într-un state care știe exact ce pop-up să arate
  const [popupState, setPopupState] = useState<'none' | 'confirm' | 'success'>('none');

  const [bookingToDelete, setBookingToDelete] = useState<number | null>(null);
  const [bookings, setBookings] = useState(initialBookings);

  const handleDeleteClick = (id: number) => {
    setBookingToDelete(id);
    setPopupState('confirm');
  };

  const confirmDelete = () => {
    setBookings((currentBookings) =>
      currentBookings.filter((booking) => booking.id !== bookingToDelete)
    );

    setPopupState('success');
    setBookingToDelete(null);
  };

  const cancelDelete = () => {
    setPopupState('none');
    setBookingToDelete(null);
  };

  const displayedBookings = bookings.filter((booking) => booking.tab === activeTab);

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
                const canEdit = booking.tab === "Viitoare" && booking.status === "In asteptare";

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
                          onClick={canEdit ? () => handleDeleteClick(booking.id) : undefined}
                          className={
                            canEdit
                              ? "rounded-full border border-[#F87171] bg-[#FEE2E2] px-6 py-2 text-sm font-bold text-red-400 transition hover:bg-red-50"
                              : "rounded-full border border-[#6B7280] px-6 py-2 text-sm font-bold text-[#6B7280] transition"
                          }
                        >
                          Sterge
                        </button>
                        <button
                          type="button"
                          className={
                            canEdit
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
          onClose={() => setPopupState('none')} // La OK, închidem tot
        />
      )}

    </div>
  );
};

export default History;
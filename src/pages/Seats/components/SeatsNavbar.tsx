import { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import singleSeatAvailable from '@/assets/singleSeatAvailable.svg';
import selected from '@/assets/selected.svg';
import occupied from '@/assets/occupied.svg';
import indisponibil from '@/assets/indisponibil.svg';
import roomAvailable from '@/assets/roomAvailable.svg';

import SuccessPopUp from '@/components/SuccessPopUp';
import ErrorPopUp from '@/components/ErrorPopUp';

export const seatTabs = ['Parter', 'T1,etaj 1', 'T1,etaj 2', 'T2,etaj 1', 'T2,etaj 2'] as const;

type SeatTab = typeof seatTabs[number];

type SeatsNavbarProps = {
  activeTab: SeatTab;
  setActiveTab: (tab: SeatTab) => void;
  isRoomSelected: boolean;
  hasSelectedSeat: boolean;
  hasOccupiedSeatSelected: boolean;
  selectedSeatCode: string;
  selectedRoomCode: string;
};

const legendItems = [
  { icon: singleSeatAvailable, alt: 'single seat available', label: 'Disponibil (loc individual)' },
  { icon: occupied, alt: 'occupied', label: 'Ocupat' },
  { icon: selected, alt: 'selected', label: 'Selectat' },
  { icon: indisponibil, alt: 'indisponibil', label: 'Indisponibil' },
  { icon: roomAvailable, alt: 'room available', label: 'Disponibil (doar daca se rezerva toata sala)' },
];

const LegendContent = () => (
  <>
    {legendItems.map((item) => (
      <div key={item.label} className="flex items-center gap-3 text-sm font-semibold text-[#1E1B4B]">
        <img src={item.icon} alt={item.alt} className="h-6 w-6 shrink-0" />
        <p className="min-w-0 leading-snug">{item.label}</p>
      </div>
    ))}
  </>
);

const SeatsNavbar = ({ activeTab, setActiveTab, isRoomSelected, hasSelectedSeat, hasOccupiedSeatSelected, selectedSeatCode, selectedRoomCode }: SeatsNavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [popupState, setPopupState] = useState<'none' | 'success-admin' | 'success-direct' | 'error-taken' | 'error-admin-fail' | 'error-unavailable' | 'error-no-selection' | 'error-no-room'>('none');
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Te rugam sa incerci din nou mai tarziu.');

  const handleConfirmSelection = async () => {
    if (!selectedSeatCode) {
      setPopupState('error-no-selection');
      return;
    }

    if (hasOccupiedSeatSelected) {
      setPopupState('error-taken');
      return;
    }

    if (!selectedRoomCode) {
      setPopupState('error-no-room');
      return;
    }

    const bookingType = location.state?.bookingType;
      const date = location.state?.date;
      const startHour = location.state?.startHour;
      const endHour = location.state?.endHour;
      const recurrenceWeeks = location.state?.recurrenceWeeks;

      let response: Response;

      try {
        response = await fetch("http://localhost:8080/reservations", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomCode: selectedRoomCode,
            seatCode: isRoomSelected ? null : selectedSeatCode,
            start: `${date}T${String(startHour).padStart(2, "0")}:00:00`,
            end: `${date}T${String(endHour).padStart(2, "0")}:00:00`,
            recurrence: bookingType === "RECURENTA" ? recurrenceWeeks : 0,
          }),
        });
      } catch {
        setErrorMessage('Backend-ul nu raspunde. Verifica daca serverul este pornit pe localhost:8080.');
        setPopupState('error-admin-fail');
        return;
      }

      if (!response.ok) {
        const backendMessage = await response.text();
        setErrorMessage(backendMessage || `Eroare backend: ${response.status}`);
        setPopupState('error-admin-fail');
        return;
      }

      if (bookingType === 'RECURENTA' || isRoomSelected) {
        setPopupState('success-admin');
      } else {
        setPopupState('success-direct');
      }
    };
  return (
    <>
      <div className="bg-[#F5F3FF] px-4 py-4 sm:px-8 sm:py-6">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-3 sm:items-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Inapoi"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-2xl text-[#29255E] transition hover:bg-gray-200"
            >
              &larr;
            </button>

            <div className="min-w-0 flex-1 pb-1">
              <div className="flex flex-wrap gap-2 pr-2">
                {seatTabs.map((tab) => (
                  <button
                    type="button"
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`shrink-0 rounded-full border border-[#000000] px-4 py-2 text-sm font-semibold transition-all sm:px-6 ${activeTab === tab
                      ? 'bg-[#6D28D9] text-white'
                      : 'bg-[#C4B5FD] text-[#1E1B4B] hover:bg-[#D4CBFF]'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="group relative z-[90] hidden shrink-0 sm:block">
              <button type="button" className="text-sm font-semibold text-gray-500 underline hover:text-gray-700">
                Legenda Culorilor
              </button>

              <div className="absolute right-0 top-full z-[100] hidden pt-2 group-hover:flex">
                <div className="flex w-[min(360px,calc(100vw-32px))] flex-col gap-3 rounded-lg border border-[#C4B5FD] bg-[#EDE9FE] p-3 opacity-100 shadow-xl">
                  <LegendContent />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:shrink-0 lg:justify-end">
            <div className="relative lg:order-2">
              <button
                type="button"
                onClick={() => setIsLegendOpen(true)}
                aria-expanded={isLegendOpen}
                className="w-fit text-sm font-semibold text-gray-500 underline hover:text-gray-700 sm:hidden"
              >
                Legenda Culorilor
              </button>

            </div>

            <button
              type="button"
              onClick={handleConfirmSelection}
              className="w-full rounded-full bg-[#8B5CF6] px-5 py-3 font-semibold text-white transition-all hover:bg-[#7C3AED] hover:shadow-lg lg:w-auto lg:px-8 lg:order-1"
            >
              Confirm new selection
            </button>
          </div>
        </div>
      </div>

      {isLegendOpen && (
        <div className="fixed inset-0 z-[120] sm:hidden">
          <button
            type="button"
            onClick={() => setIsLegendOpen(false)}
            aria-label="Inchide legenda"
            className="absolute inset-0 bg-[#0B0A1A]/35"
          />

          <section className="absolute inset-x-0 bottom-0 rounded-t-[24px] bg-[#EDE9FE] px-4 pb-6 pt-3 shadow-2xl">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#C4B5FD]" />

            <div className="mb-4 flex items-center justify-between border-b border-[#DDD6FE] pb-3">
              <h2 className="text-base font-bold text-[#1E1B4B]">Legenda Culorilor</h2>

              <button
                type="button"
                onClick={() => setIsLegendOpen(false)}
                aria-label="Inchide legenda"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#29255E] transition hover:bg-[#DDD6FE]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <LegendContent />
            </div>
          </section>
        </div>
      )}

      {popupState === 'success-admin' && (
        <SuccessPopUp
          title="Cererea a fost trimisa catre administrator. Se asteapta raspunsul..."
          sideMessage="Cererea a fost trimisa catre administrator"
          highlightedText="CU SUCCES"
          onClose={() => setPopupState('none')}
        />
      )}

      {popupState === 'success-direct' && (
        <SuccessPopUp
          title="Rezervare efectuata cu succes. O puteti vizualiza in Rezervarile mele"
          sideMessage="Cererea a fost efectuata"
          highlightedText="CU SUCCES"
          onClose={() => setPopupState('none')}
        />
      )}

      {popupState === 'error-taken' && (
        <ErrorPopUp
          title="Acest loc este deja rezervat."
          message="Va rugam sa alegeti alt loc."
          sideMessage="Loc ocupat"
          buttonText="Inapoi la harta interactiva"
          onClose={() => setPopupState('none')}
        />
      )}

      {popupState === 'error-admin-fail' && (
        <ErrorPopUp
          title="Backend-ul a respins rezervarea."
          message={errorMessage}
          sideMessage="Eroare backend"
          buttonText="OK, am inteles"
          onClose={() => setPopupState('none')}
        />
      )}

      {popupState === 'error-unavailable' && (
        <ErrorPopUp
          title="Ai ales un loc indisponibil. Te rugam sa selectezi alt loc."
          message="Acest loc nu poate fi rezervat in acest moment."
          sideMessage="Loc indisponibil"
          buttonText="OK, am inteles"
          onClose={() => setPopupState('none')}
        />
      )}
      {popupState === 'error-no-room' && (
        <ErrorPopUp
          title="Nu am putut identifica sala pentru locul selectat."
          message="Codul locului selectat nu este mapat la o sala din backend."
          sideMessage="Sala lipsa"
          buttonText="Inapoi la harta interactiva"
          onClose={() => setPopupState('none')}
        />
      )}      {popupState === 'error-no-selection' && (
        <ErrorPopUp
          title="Nu ai selectat niciun loc."
          message="Te rugam sa alegi un loc de pe harta inainte de a da confirmare."
          sideMessage="Selectie lipsa"
          buttonText="Inapoi la harta interactiva"
          onClose={() => setPopupState('none')}
        />
      )}
    </>
  );
};

export default SeatsNavbar;


























import AIAssistant from "@/pages/AIAssistant";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useState } from 'react';
import { getBookingStatusClassName } from '@/lib/bookingStatus';

const UserDetails = () => {
  const { user: currentUser, isLoading } = useCurrentUser();


  // MOCK DATA - Date statice temporare


  const userProfile = {
    name: currentUser.name,
    role: currentUser.role,
    email: isLoading ? "Se incarca..." : currentUser.email || "Email indisponibil",
    phone: isLoading ? "Se incarca..." : currentUser.phoneNumber || "Telefon indisponibil",
    department: isLoading ? "Se incarca..." : currentUser.departmentId ? `Departament #${currentUser.departmentId}` : "Departament indisponibil",
    preferredSeat: "Rand 3, Mijloc - Sala A",
    preferredTime: "09:00 - 17:00"
  };

  const [bookingStats] = useState({
    confirmed: 4,
    pending: 1,
    canceled: 1
  });

  const [bookingHistory] = useState([
    { id: 1, date: '24 Jul 2026', seat: 'R3 - C7', room: 'Sala A', status: 'Confirmat' },
    { id: 2, date: '22 Jul 2026', seat: 'R1 - C2', room: 'Sala B', status: 'Confirmat' },
    { id: 3, date: '18 Jul 2026', seat: 'R2 - C5', room: 'Sala A', status: 'In asteptare' },
    { id: 4, date: '10 Jul 2026', seat: 'R4 - C1', room: 'Sala C', status: 'Anulat' },
    { id: 5, date: '05 Jul 2026', seat: 'R3 - C9', room: 'Sala A', status: 'Confirmat' },
    { id: 6, date: '28 Jun 2026', seat: 'R2 - C3', room: 'Sala B', status: 'Confirmat' },
  ]);


  return (
    <div className="relative min-h-full bg-white p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-2xl font-bold text-[#29255E]">User Details</h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">

          <div className="lg:col-span-5 flex flex-col gap-6">

            <div className="relative flex flex-col items-start gap-4 rounded-3xl bg-[#F4F3FF] p-5 shadow-sm sm:flex-row sm:items-center sm:gap-6 sm:p-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E5E0FF] text-[#8B5CF6]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#29255E]">{userProfile.name}</h2>
                <span className="mt-1 inline-block rounded-full bg-[#8B5CF6] px-4 py-1 text-xs font-bold text-white">
                  {userProfile.role}
                </span>
              </div>
              <button className="absolute right-6 top-6 text-[#8B5CF6] hover:text-[#6D28D9]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>

            <div className="rounded-3xl bg-[#F4F3FF] p-6 shadow-sm">
              <h3 className="mb-4 font-bold text-[#29255E]">Date de contact</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4 rounded-xl bg-white p-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F4F3FF] text-[#8B5CF6]">??</span>
                  <div>
                    <p className="text-[10px] text-gray-400">Email</p>
                    <p className="text-sm font-semibold text-[#29255E]">{userProfile.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-xl bg-white p-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F4F3FF] text-[#8B5CF6]">??</span>
                  <div>
                    <p className="text-[10px] text-gray-400">Telefon</p>
                    <p className="text-sm font-semibold text-[#29255E]">{userProfile.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-xl bg-white p-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F4F3FF] text-[#8B5CF6]">??</span>
                  <div>
                    <p className="text-[10px] text-gray-400">Departament</p>
                    <p className="text-sm font-semibold text-[#29255E]">{userProfile.department}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-[#F4F3FF] p-6 shadow-sm">
              <h3 className="mb-4 font-bold text-[#29255E]">Preferinte rezervare</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4 rounded-xl bg-white p-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F4F3FF] text-[#8B5CF6]">??</span>
                  <div>
                    <p className="text-[10px] text-gray-400">Scaun preferat</p>
                    <p className="text-sm font-semibold text-[#29255E]">{userProfile.preferredSeat}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-xl bg-white p-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F4F3FF] text-[#8B5CF6]">??</span>
                  <div>
                    <p className="text-[10px] text-gray-400">Interval orar</p>
                    <p className="text-sm font-semibold text-[#29255E]">{userProfile.preferredTime}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="lg:col-span-7 flex flex-col gap-6">

            <div className="rounded-3xl bg-[#F4F3FF] p-6 shadow-sm">
              <h3 className="mb-4 font-bold text-[#29255E]">Status rezervari</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                <div className="flex flex-col items-center justify-center rounded-xl bg-[#D1FAE5] py-4 text-center">
                  <span className="text-3xl font-bold text-green-500">{bookingStats.confirmed}</span>
                  <span className="text-xs font-semibold text-green-600">Confirmate</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl bg-[#FEF3C7] py-4 text-center">
                  <span className="text-3xl font-bold text-yellow-500">{bookingStats.pending}</span>
                  <span className="text-xs font-semibold text-yellow-600">In asteptare</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl bg-[#FEE2E2] py-4 text-center">
                  <span className="text-3xl font-bold text-red-400">{bookingStats.canceled}</span>
                  <span className="text-xs font-semibold text-red-500">Anulate</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-[#F4F3FF] p-6 shadow-sm flex-1">
              <h3 className="mb-4 font-bold text-[#29255E]">Istoric rezervari</h3>

              <div className="mb-2 hidden grid-cols-4 px-4 text-xs font-bold text-gray-400 sm:grid">
                <span>DATA</span>
                <span>SCAUN</span>
                <span>SALA</span>
                <span>STATUS</span>
              </div>

              <div className="flex flex-col gap-2">
                {bookingHistory.map((item) => (
                  <div key={item.id} className="grid grid-cols-2 gap-2 rounded-xl bg-white p-4 text-sm font-bold text-[#29255E] sm:grid-cols-4 sm:items-center sm:gap-0">
                    <span>{item.date}</span>
                    <span>{item.seat}</span>
                    <span>{item.room}</span>
                    <div>
                      <span className={`inline-block rounded-full px-3 py-1 text-[10px] ${getBookingStatusClassName(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
      <AIAssistant />
    </div>
  );
};

export default UserDetails;







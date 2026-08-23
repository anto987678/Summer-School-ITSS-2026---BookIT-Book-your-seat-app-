import AIAssistant from "@/pages/AIAssistant";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useState, useEffect } from 'react';
import { getBookingStatusClassName } from '@/lib/bookingStatus';
import { CheckCircle2, XCircle } from 'lucide-react';

type BookingStats = { confirmed: number; pending: number; canceled: number };
type BookingHistoryItem = { id: number; date: string; seat: string; room: string; status: string };
type BookingPreferences = { preferredRoom: string; preferredSeat: string; preferredTime: string };
type PasswordRule = { label: string; isValid: boolean };
type BookingSummaryResponse = {
  bookingStats: BookingStats;
  bookingHistory: Array<Omit<BookingHistoryItem, 'date'> & { date: string }>;
};

const specialCharacterRegex = /[!@#$%&*]/g;

const PasswordRules = ({ rules }: { rules: PasswordRule[] }) => (
  <div className="space-y-1 rounded-xl bg-white px-3 py-2 text-xs shadow-sm">
    {rules.map((rule) => (
      <div
        key={rule.label}
        className={`flex items-center gap-2 font-semibold ${rule.isValid ? 'text-green-600' : 'text-red-500'}`}
      >
        {rule.isValid ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
        <span>{rule.label}</span>
      </div>
    ))}
  </div>
);
const API_URL = 'http://localhost:8080';
const ROMANIAN_MOLDOVAN_PHONE_PATTERN = /^(?:0|\+40)[2-9]\d{8}$|^(?:0|\+373)[2-9]\d{7}$/;
const PHONE_VALIDATION_MESSAGE = 'Format invalid. Exemple valide: 0722123456, +40722123456, 069123456, +37369123456';
const normalizePhoneNumber = (phone: string) => phone.replace(/[\s().-]/g, '');

const formatBookingDate = (date: string) => new Intl.DateTimeFormat('ro-RO', {
  day: '2-digit', month: 'short', year: 'numeric',
}).format(new Date(date));

const formatBookingTime = (date: string) => new Intl.DateTimeFormat('ro-RO', {
  hour: '2-digit', minute: '2-digit',
}).format(new Date(date));

const mostFrequent = (values: string[]) => {
  const counts = values.reduce<Record<string, number>>((acc, value) => {
    if (!value || value === '-') return acc;
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
};

const getBookingPreferences = (items: BookingSummaryResponse['bookingHistory']): BookingPreferences => {
  const confirmedItems = items.filter((item) => item.status === 'Confirmat');

  if (!confirmedItems.length) {
    return {
      preferredRoom: 'Nu exista rezervari confirmate',
      preferredSeat: 'Nu exista rezervari confirmate',
      preferredTime: 'Nu exista rezervari confirmate',
    };
  }

  const favoriteRoom = mostFrequent(confirmedItems.map((item) => item.room));
  const favoriteSeat = mostFrequent(confirmedItems.map((item) => item.seat));
  const favoriteTime = mostFrequent(confirmedItems.map((item) => formatBookingTime(item.date)));

  return {
    preferredRoom: favoriteRoom || 'Nu exista preferinta clara',
    preferredSeat: favoriteSeat || 'Nu exista preferinta clara',
    preferredTime: favoriteTime ? `In jur de ${favoriteTime}` : 'Nu exista preferinta clara',
  };
};

const UserDetails = () => {
  const { user: currentUser, isLoading } = useCurrentUser();

  // --- STATE-URI PENTRU MODUL DE EDITARE ---
  const [isEditing, setIsEditing] = useState(false);
  const [editPhone, setEditPhone] = useState("");
  const [savedPhone, setSavedPhone] = useState<string | null>(null); // Stocare temporară pentru telefon
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({ phone: '', password: '' });
  const [bookingStats, setBookingStats] = useState<BookingStats>({ confirmed: 0, pending: 0, canceled: 0 });
  const [bookingHistory, setBookingHistory] = useState<BookingHistoryItem[]>([]);
  const [bookingPreferences, setBookingPreferences] = useState<BookingPreferences>({
    preferredRoom: 'Se incarca...',
    preferredSeat: 'Se incarca...',
    preferredTime: 'Se incarca...',
  });
  const [passwordSuccess, setPasswordSuccess] = useState(""); // Mesajul de succes pentru parolă

  // Sincronizează numărul de telefon curent când datele utilizatorului sunt încărcate
  useEffect(() => {
    if (currentUser?.phoneNumber) {
      setEditPhone(currentUser.phoneNumber);
    }
  }, [currentUser]);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_URL}/me/reservations`, { credentials: 'include', signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(await response.text());
        return response.json() as Promise<BookingSummaryResponse>;
      })
      .then((data) => {
        setBookingStats(data.bookingStats);
        setBookingPreferences(getBookingPreferences(data.bookingHistory));
        setBookingHistory(data.bookingHistory.map((item) => ({ ...item, date: formatBookingDate(item.date) })));
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setBookingStats({ confirmed: 0, pending: 0, canceled: 0 });
        setBookingHistory([]);
        setBookingPreferences({
          preferredRoom: 'Nu exista rezervari confirmate',
          preferredSeat: 'Nu exista rezervari confirmate',
          preferredTime: 'Nu exista rezervari confirmate',
        });
      });

    return () => controller.abort();
  }, []);

  const userProfile = {
    name: currentUser?.name || "User",
    role: currentUser?.role || "USER",
    email: isLoading ? "Se incarca..." : currentUser?.email || "Email indisponibil",
    // Afișăm telefonul modificat local, altfel cel din baza de date
    phone: savedPhone !== null ? savedPhone : (isLoading ? "Se incarca..." : currentUser?.phoneNumber || "Telefon indisponibil"),
    department: isLoading ? "Se incarca..." : currentUser?.departmentName || "Departament indisponibil",
    preferredRoom: bookingPreferences.preferredRoom,
    preferredSeat: bookingPreferences.preferredSeat,
    preferredTime: bookingPreferences.preferredTime
  };

  const normalizedEditPhone = normalizePhoneNumber(editPhone);
  const isPhoneValid = ROMANIAN_MOLDOVAN_PHONE_PATTERN.test(normalizedEditPhone);
  const phoneValidationMessage = isEditing && editPhone.trim() !== '' && !isPhoneValid
    ? PHONE_VALIDATION_MESSAGE
    : '';
  const phoneError = errors.phone || phoneValidationMessage;
  const specialCharactersCount = newPassword.match(specialCharacterRegex)?.length ?? 0;
  const passwordsMatch = newPassword !== "" && newPassword === confirmPassword;
  const passwordRules: PasswordRule[] = [
    { label: 'Minim 10 caractere', isValid: newPassword.length >= 10 },
    { label: 'Cel putin 2 caractere speciale (!@#$%&*)', isValid: specialCharactersCount >= 2 },
    { label: 'Parolele coincid', isValid: passwordsMatch },
  ];
  const isPasswordValid = passwordRules.every((rule) => rule.isValid);

  // --- HANDLERS (LOGICA DE SALVARE) ---
  const handleSaveProfile = async () => {
    if (!editPhone || editPhone.trim() === "") {
      setErrors((prev) => ({ ...prev, phone: 'Numarul de telefon este obligatoriu!' }));
      return;
    }

    if (!isPhoneValid) {
      setErrors((prev) => ({ ...prev, phone: PHONE_VALIDATION_MESSAGE }));
      return;
    }

    try {
      const response = await fetch(`${API_URL}/me/phone`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: normalizedEditPhone }),
      });

      if (!response.ok) throw new Error(await response.text());

      const updatedUser = await response.json() as { phoneNumber?: string };
      setSavedPhone(updatedUser.phoneNumber ?? normalizedEditPhone);
      setIsEditing(false);
      setPasswordSuccess("");
      setErrors({ phone: '', password: '' });
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        phone: error instanceof Error && error.message ? error.message : 'Telefonul nu a putut fi salvat. Încearcă din nou!',
      }));
    }
  };

  const handleSavePassword = async () => {
    // Validare parole
    if (newPassword !== confirmPassword) {
      setErrors((prev) => ({ ...prev, password: 'Parolele nu se potrivesc!' }));
      setPasswordSuccess("");
      return;
    }

    const specialCharacters = (newPassword.match(/[!@#$%&*]/g) || []).length;
    if (newPassword.length < 10 || specialCharacters < 2) {
      setErrors((prev) => ({ ...prev, password: 'Parola trebuie să aibă minim 10 caractere și 2 caractere speciale (!@#$%&*)!' }));
      setPasswordSuccess("");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/me/password`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });

      if (!response.ok) throw new Error(await response.text());

      setErrors((prev) => ({ ...prev, password: '' }));
      setPasswordSuccess("Parolă nouă salvată cu succes");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordSuccess("");
      setErrors((prev) => ({
        ...prev,
        password: error instanceof Error && error.message ? error.message : 'Parola nu a putut fi salvată. Încearcă din nou!',
      }));
    }
  };

  return (
    <div className="relative min-h-full bg-white p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-2xl font-bold text-[#29255E]">
          {isEditing ? 'Edit User Details' : 'User Details'}
        </h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">

          {/* COLOANA STÂNGĂ - DATE UTILIZATOR */}
          <div className="flex flex-col gap-6 lg:col-span-5">

            {/* HEADER PROFIL */}
            <div className="flex flex-col items-start gap-4 rounded-3xl bg-[#F4F3FF] p-5 shadow-sm sm:flex-row sm:items-center sm:gap-6 sm:p-6">

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#E5E0FF] text-[#8B5CF6]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>

              <div className="flex-1 min-w-0 pr-2">
                <h2 className="text-xl font-bold text-[#29255E] break-words">{userProfile.name}</h2>
                <span className="mt-1 inline-block rounded-full bg-[#8B5CF6] px-4 py-1 text-xs font-bold text-white">
                  {userProfile.role}
                </span>
              </div>

              <div className="shrink-0 self-end sm:self-center">
                {!isEditing ? (
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditPhone(savedPhone !== null ? savedPhone : (currentUser?.phoneNumber || "")); // Păstrează ce ai tastat ultima oară
                    }}
                    className="text-[#8B5CF6] hover:text-[#6D28D9] transition-colors p-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={handleSaveProfile}
                    disabled={!isPhoneValid}
                    className={`rounded-full px-8 py-2.5 text-sm font-bold text-white shadow-sm transition-colors ${isPhoneValid ? 'bg-[#8B5CF6] hover:bg-[#6D28D9]' : 'cursor-not-allowed bg-[#C4B5FD]'}`}
                  >
                    Save
                  </button>
                )}
              </div>
            </div>

            {/* DATE DE CONTACT */}
            <div className="rounded-3xl bg-[#F4F3FF] p-6 shadow-sm">
              <h3 className="mb-4 font-bold text-[#29255E]">Date de contact</h3>
              <div className="flex flex-col gap-3">

                {/* EMAIL */}
                <div className="flex items-center gap-4 rounded-xl bg-white p-3 border border-transparent">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F4F3FF] text-[#8B5CF6]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </span>
                  <div>
                    <p className="text-[10px] text-gray-400">Email</p>
                    <p className="text-sm font-semibold text-[#29255E]">{userProfile.email}</p>
                  </div>
                </div>

                {/* TELEFON */}
                <div className={`flex items-center gap-4 rounded-xl p-3 border ${phoneError ? 'border-red-400 bg-red-50' : 'bg-white border-transparent'}`}>
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${phoneError ? 'bg-red-100 text-red-500' : 'bg-[#F4F3FF] text-[#8B5CF6]'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </span>
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-400">Telefon</p>
                    {isEditing ? (
                      <input
                        type="text"
                        inputMode="tel"
                        value={editPhone}
                        onChange={(e) => {
                          setEditPhone(e.target.value);
                          if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                        }}
                        className="w-full bg-transparent text-sm font-semibold text-[#29255E] outline-none placeholder-gray-400"
                        placeholder="Ex: +40 721 123 456 sau +373 69 123 456"
                      />
                    ) : (
                      <p className="text-sm font-semibold text-[#29255E]">{userProfile.phone}</p>
                    )}
                  </div>
                </div>
                {phoneError && <span className="text-xs font-semibold text-red-500 pl-2">{phoneError}</span>}

                {/* DEPARTAMENT */}
                <div className="flex items-center gap-4 rounded-xl bg-white p-3 border border-transparent">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F4F3FF] text-[#8B5CF6]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </span>
                  <div>
                    <p className="text-[10px] text-gray-400">Departament</p>
                    <p className="text-sm font-semibold text-[#29255E]">{userProfile.department}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* BLOC SCHIMBARE PAROLA SAU PREFERINTE */}
            {isEditing ? (
              <div className="rounded-3xl bg-[#F4F3FF] p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
                <h3 className="mb-4 font-bold text-[#29255E]">Schimbare parolă</h3>
                <div className="flex flex-col gap-3">

                  {/* Parola noua */}
                  <div className={`flex items-center gap-4 rounded-xl p-3 border bg-white ${errors.password ? 'border-red-400' : 'border-gray-200'}`}>
                    <span className="text-[#8B5CF6]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </span>
                    <div className="flex-1">
                      <p className="text-[10px] text-gray-400">Parolă nouă</p>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setPasswordSuccess(""); // Sterge verdele daca scrii iar
                          if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                        }}
                        className="w-full bg-transparent text-sm font-semibold text-[#29255E] outline-none"
                        placeholder="*********"
                      />
                    </div>
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="text-[#8B5CF6] hover:text-[#6D28D9]">
                      {showNewPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>

                  {/* Confirmare Parola */}
                  <div className={`flex items-center gap-4 rounded-xl p-3 border ${errors.password ? 'border-red-400 bg-red-50' : 'bg-white border-gray-200'}`}>
                    <span className="text-[#8B5CF6]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </span>
                    <div className="flex-1">
                      <p className="text-[10px] text-gray-400">Confirmare parolă</p>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setPasswordSuccess("");
                          if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                        }}
                        className="w-full bg-transparent text-sm font-semibold text-[#29255E] outline-none"
                        placeholder="*********"
                      />
                    </div>
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-[#8B5CF6] hover:text-[#6D28D9]">
                      {showConfirmPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>

                  <PasswordRules rules={passwordRules} />

                  {/* Mesaje de eroare sau succes */}
                  {errors.password && <span className="text-xs font-semibold text-red-500 pl-2">{errors.password}</span>}
                  {passwordSuccess && <span className="text-xs font-semibold text-green-500 pl-2">{passwordSuccess}</span>}

                  <button
                    onClick={handleSavePassword}
                    className="mt-2 w-max rounded-full bg-[#8B5CF6] px-6 py-2 text-sm font-bold text-white hover:bg-[#6D28D9] transition-colors"
                  >
                    Save new password
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl bg-[#F4F3FF] p-6 shadow-sm animate-in fade-in duration-300">
                <h3 className="mb-4 font-bold text-[#29255E]">Preferinte rezervare</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-4 rounded-xl bg-white p-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F4F3FF] text-[#8B5CF6]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a2 2 0 012-2h14a2 2 0 012 2v12H3V7z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21v-6h8v6" /></svg>
                    </span>
                    <div>
                      <p className="text-[10px] text-gray-400">Sala preferata</p>
                      <p className="text-sm font-semibold text-[#29255E]">{userProfile.preferredRoom}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-xl bg-white p-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F4F3FF] text-[#8B5CF6]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                    </span>
                    <div>
                      <p className="text-[10px] text-gray-400">Scaun preferat</p>
                      <p className="text-sm font-semibold text-[#29255E]">{userProfile.preferredSeat}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-xl bg-white p-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F4F3FF] text-[#8B5CF6]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </span>
                    <div>
                      <p className="text-[10px] text-gray-400">Ora preferata</p>
                      <p className="text-sm font-semibold text-[#29255E]">{userProfile.preferredTime}</p>
                    </div>
                  </div>
                </div>
                  </div>
            )}

          </div>

          {/* COLOANA DREAPTĂ - STATUS ȘI ISTORIC REZERVĂRI */}
          <div className="flex flex-col gap-6 lg:col-span-7">

            {/* Status rezervari */}
            <div className="rounded-3xl bg-[#F4F3FF] p-6 shadow-sm">
              <h3 className="mb-4 font-bold text-[#29255E]">Status rezervari</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                <div className="flex flex-col items-center justify-center rounded-xl bg-[#D1FAE5] py-4 text-center shadow-sm">
                  <span className="text-3xl font-bold text-green-500">{bookingStats.confirmed}</span>
                  <span className="text-xs font-semibold text-green-600">Confirmate</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl bg-[#FEF3C7] py-4 text-center shadow-sm">
                  <span className="text-3xl font-bold text-yellow-500">{bookingStats.pending}</span>
                  <span className="text-xs font-semibold text-yellow-600">In asteptare</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl bg-[#FEE2E2] py-4 text-center shadow-sm">
                  <span className="text-3xl font-bold text-red-400">{bookingStats.canceled}</span>
                  <span className="text-xs font-semibold text-red-500">Anulate</span>
                </div>
              </div>
            </div>

            {/* Istoric rezervari */}
            <div className="flex-1 rounded-3xl bg-[#F4F3FF] p-6 shadow-sm">
              <h3 className="mb-4 font-bold text-[#29255E]">Istoric rezervari</h3>

              <div className="mb-2 hidden grid-cols-4 px-4 text-xs font-bold text-gray-400 sm:grid">
                <span>DATA</span>
                <span>SCAUN</span>
                <span>SALA</span>
                <span>STATUS</span>
              </div>

              <div className="flex flex-col gap-2">
                {bookingHistory.map((item) => (
                  <div key={item.id} className="grid grid-cols-2 gap-2 rounded-xl bg-white p-4 text-sm font-bold text-[#29255E] shadow-sm sm:grid-cols-4 sm:items-center sm:gap-0">
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




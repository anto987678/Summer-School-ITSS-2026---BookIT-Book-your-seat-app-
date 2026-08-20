import ErrorPopUp from "@/components/ErrorPopUp";
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

type EntityId = string | number;

type Floor = {
  id: EntityId;
  name: string;
};

type Room = {
  id: number;
  code: string;
  name: string;
  type: string;
  floor?: Floor;
  floor_id?: Floor;
  floorId?: EntityId;
};

type Seat = {
  id: number;
  code: string;
  type: string;
  status: string;
  room?: Room;
  roomId?: number;
  salaId?: number;
  room_id?: any; // Adaugat pentru siguranta
};

type User = {
  postgresUserId: number;
  name: string;
  email: string;
};

type Reservation = {
  id: number;
  seat?: Seat | null;
  room?: Room | null;
  startDateTime: string;
  endDateTime: string;
  status: string;
};

// Functii blindate de citire a ID-urilor
const getRoomFloorId = (room: any) => {
  if (!room) return undefined;
  if (room.floor?.id !== undefined) return room.floor.id;
  if (room.floorId !== undefined) return room.floorId;
  if (typeof room.floor_id === 'object' && room.floor_id !== null) return room.floor_id.id;
  if (room.floor_id !== undefined) return room.floor_id;
  return undefined;
};

const getSeatRoomId = (seat: any) => {
  if (!seat) return undefined;
  if (seat.room?.id !== undefined) return seat.room.id;
  if (seat.roomId !== undefined) return seat.roomId;
  if (seat.salaId !== undefined) return seat.salaId;
  if (typeof seat.room_id === 'object' && seat.room_id !== null) return seat.room_id.id;
  if (seat.room_id !== undefined) return seat.room_id;
  return undefined;
};

// The seat status is structural; time-based occupancy comes from
// /reservations/active for the selected interval.
const isSelectableSeat = (status?: string) => {
  const normalizedStatus = status?.trim().toUpperCase();
  return normalizedStatus !== "UNAVAILABLE";
};

const isConferenceRoom = (type?: string) => {
  const normalizedType = type?.trim().toUpperCase() ?? "";
  return normalizedType.includes("SEDINTE");
};

const overlapsInterval = (reservation: Reservation, start: Date, end: Date) => {
  const reservationStart = new Date(reservation.startDateTime);
  const reservationEnd = new Date(reservation.endDateTime);
  return start < reservationEnd && end > reservationStart;
};

const InviteModal = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    colleagueId: "",
    date: "",
    startTime: "",
    endTime: "",
    seatFloor: "",
    seatRoom: "",
    seatId: "",
  });

  useEffect(() => {
    fetch("http://localhost:8080/sali", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setRooms(Array.isArray(data) ? data : []))
      .catch(() => setRooms([]));

    fetch("http://localhost:8080/locuri", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setSeats(Array.isArray(data) ? data : []))
      .catch(() => setSeats([]));

    fetch("http://localhost:8080/floors", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setFloors(Array.isArray(data) ? data : []))
      .catch(() => setFloors([]));

    fetch("http://localhost:8080/api/invitations/colleagues", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers([]));

  }, []);

  // ---> SPIONUL PENTRU DEBUG (V2) <---
  useEffect(() => {
    if (seats.length > 0 && rooms.length > 0) {
      console.log("=== DIAGNOSTIC G2 & SD0 (V2) ===");
      const g2 = rooms.find(r => r.code === "G2");
      const sd0 = rooms.find(r => r.code === "SD0");

      const g2Seats = seats.filter(s => String(getSeatRoomId(s)) === String(g2?.id));
      const sd0Seats = seats.filter(s => String(getSeatRoomId(s)) === String(sd0?.id));

      console.log("1. Statusurile scaunelor din G2:", g2Seats.map(s => s.status).join(", ") || "Fără scaune");
      console.log("2. Statusurile scaunelor din SD0:", sd0Seats.map(s => s.status).join(", ") || "Fără scaune");
      console.log("3. Număr rezervări active primite pt acest interval:", reservations.length);
      console.log("===========================");
    }
  }, [seats, rooms, reservations]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
      ...(name === "date" || name === "startTime" || name === "endTime"
        ? { seatFloor: "", seatRoom: "", seatId: "" }
        : {}),
      ...(name === "seatFloor" ? { seatRoom: "", seatId: "" } : {}),
      ...(name === "seatRoom" ? { seatId: "" } : {}),
    }));
  };

  const isTimeInvalid = formData.startTime !== "" && formData.endTime !== "" && formData.endTime <= formData.startTime;
  const hasValidDateTime = formData.date !== "" && formData.startTime !== "" && formData.endTime !== "" && !isTimeInvalid;

  useEffect(() => {
    if (!hasValidDateTime) {
      setReservations([]);
      setAvailabilityError("");
      setIsCheckingAvailability(false);
      return;
    }

    const abortController = new AbortController();
    const query = new URLSearchParams({
      start: `${formData.date}T${formData.startTime}:00`,
      end: `${formData.date}T${formData.endTime}:00`,
    });

    setIsCheckingAvailability(true);
    setAvailabilityError("");

    const loadActiveReservations = async () => {
      try {
        const response = await fetch(`http://localhost:8080/reservations/active?${query.toString()}`, {
          credentials: "include",
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load active reservations");
        }

        const data = await response.json() as Reservation[];
        setReservations(Array.isArray(data) ? data : []);
      } catch (error) {
        if ((error as DOMException).name !== "AbortError") {
          setReservations([]);
          setAvailabilityError("Nu am putut verifica disponibilitatea. Încearcă din nou.");
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsCheckingAvailability(false);
        }
      }
    };

    void loadActiveReservations();
    return () => abortController.abort();
  }, [formData.date, formData.startTime, formData.endTime, hasValidDateTime]);

  const selectedStart = hasValidDateTime ? new Date(`${formData.date}T${formData.startTime}`) : null;
  const selectedEnd = hasValidDateTime ? new Date(`${formData.date}T${formData.endTime}`) : null;

  const overlappingReservations = selectedStart && selectedEnd
    ? reservations.filter((reservation) => overlapsInterval(reservation, selectedStart, selectedEnd))
    : [];

  const isSeatReserved = (seat: Seat) => {
    const seatRoomId = getSeatRoomId(seat);
    return overlappingReservations.some((reservation) => {
      if (reservation.seat?.id === seat.id || reservation.seat?.code === seat.code) return true;
      return reservation.room?.id !== undefined && reservation.room.id === seatRoomId;
    });
  };

  const availableSeatsForInterval = hasValidDateTime
    ? seats.filter((seat) => isSelectableSeat(seat.status) && !isSeatReserved(seat))
    : [];

  const selectedFloorId = formData.seatFloor;
  const selectedRoomId = Number(formData.seatRoom);

  const officeRooms = rooms.filter((room) => !isConferenceRoom(room.type));

  const floorsFromRooms = officeRooms.reduce<Floor[]>((accumulator, room) => {
    const floor = room.floor ?? room.floor_id;
    const floorId = getRoomFloorId(room);

    if (floorId === undefined || accumulator.some((currentFloor) => String(currentFloor.id) === String(floorId))) {
      return accumulator;
    }
    accumulator.push({ id: floorId, name: floor?.name ?? String(floorId) });
    return accumulator;
  }, []);

  const displayedFloors = floorsFromRooms.length > 0 ? floorsFromRooms : floors;

  const officeRoomsWithAvailableSeats = officeRooms.filter((room) => {
    const roomFloorId = getRoomFloorId(room);
    const matchesFloor = formData.seatFloor === "" || String(roomFloorId) === String(selectedFloorId);
    const hasAvailableSeat = availableSeatsForInterval.some((seat) => String(getSeatRoomId(seat)) === String(room.id));
    return matchesFloor && hasAvailableSeat;
  });

  const seatsForSelectedRoom = availableSeatsForInterval.filter(
    (seat) => String(getSeatRoomId(seat)) === String(selectedRoomId)
  );

  const isFormInvalid =
    formData.colleagueId === "" || formData.date === "" || formData.startTime === "" ||
    formData.endTime === "" || formData.seatFloor === "" || formData.seatRoom === "" ||
    formData.seatId === "" || isTimeInvalid || isCheckingAvailability || availabilityError !== "";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isFormInvalid || isSubmitting) return;

    const selectedRoom = rooms.find((room) => String(room.id) === formData.seatRoom);
    const selectedSeat = seats.find((seat) => String(seat.id) === formData.seatId);
    if (!selectedRoom || !selectedSeat) return;

    const selectedColleague = users.find((user) => String(user.postgresUserId) === formData.colleagueId);
    if (!selectedColleague) {
      setSubmitError("Nu am putut identifica utilizatorul invitat in Postgres.");
      return;
    }

    const invitationData = {
      receiverId: selectedColleague.postgresUserId,
      seatId: selectedSeat.id,
      startDateTime: `${formData.date}T${formData.startTime}:00`,
      endDateTime: `${formData.date}T${formData.endTime}:00`,
    };

    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:8080/api/invitations", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invitationData),
      });

      if (!response.ok) {
        setSubmitError("Invitatia nu a fost trimisa. Verifica daca esti autentificata si daca locul este inca disponibil.");
        return;
      }
      setIsSuccess(true);
    } catch {
      setSubmitError("Invitatia nu a fost trimisa. Verifica conexiunea si incearca din nou.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {submitError !== "" && (
        <ErrorPopUp title="Invitatia nu a fost trimisa" message={submitError} buttonText="Incearca din nou" onClose={() => setSubmitError("")} />
      )}

      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0A1A]/45 p-4">
          <section className="w-full max-w-md rounded-[32px] bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-3xl font-bold text-green-600">✓</div>
            <h2 className="mt-5 text-2xl font-bold text-[#29255E]">Invitația a fost trimisă cu succes!</h2>
            <p className="mt-3 text-gray-600">Colegul tău va primi notificarea pentru rezervare.</p>
            <button type="button" onClick={() => navigate("/dashboard")} className="mt-7 w-full rounded-full bg-[#6D28D9] px-6 py-3 font-bold text-white transition hover:bg-[#5B21B6]">
              Mergi la Dashboard
            </button>
          </section>
        </div>
      )}

      <div className="w-full max-w-xl rounded-[32px] border border-[#C4B5FD] bg-[#EDE9FE] px-5 py-6 shadow-xl sm:rounded-[48px] sm:px-10 sm:py-10">
        <h2 className="mb-8 text-center text-2xl font-medium text-[#1E1950] sm:mb-10 sm:text-[30px]">Choose your colleague and the date</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label htmlFor="colleagueId" className="font-medium text-[#29255E]">Colleague</label>
              <select id="colleagueId" name="colleagueId" value={formData.colleagueId} onChange={handleChange} required className="w-full rounded-full border-2 border-[#C4B5FD] bg-white px-5 py-3 focus:border-[#6D28D9] focus:outline-none">
                <option value="">Select a colleague</option>
                {users.map((user) => (
                  <option key={user.postgresUserId} value={user.postgresUserId}>{user.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="date" className="font-medium text-[#29255E]">Date</label>
              <input id="date" name="date" type="date" value={formData.date} onChange={handleChange} min={new Date().toISOString().split("T")[0]} required className="w-full rounded-full border-2 border-[#C4B5FD] bg-white px-5 py-3 focus:border-[#6D28D9] focus:outline-none" />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="startTime" className="font-medium text-[#29255E]">Start time</label>
              <input id="startTime" name="startTime" type="time" value={formData.startTime} onChange={handleChange} step="900" required className="w-full rounded-full border-2 border-[#C4B5FD] bg-white px-5 py-3 focus:border-[#6D28D9] focus:outline-none" />
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2 sm:mx-auto sm:w-full sm:max-w-[calc((100%-1.5rem)/2)]">
              <label htmlFor="endTime" className="font-medium text-[#29255E]">End time</label>
              <input id="endTime" name="endTime" type="time" value={formData.endTime} onChange={handleChange} min={formData.startTime || undefined} step="900" required className="w-full rounded-full border-2 border-[#C4B5FD] bg-white px-5 py-3 focus:border-[#6D28D9] focus:outline-none" />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="seatFloor" className="font-medium text-[#29255E]">Etaj / zona</label>
              <select id="seatFloor" name="seatFloor" value={formData.seatFloor} onChange={handleChange} required disabled={!hasValidDateTime || isCheckingAvailability} className="w-full rounded-full border-2 border-[#C4B5FD] bg-white px-5 py-3 focus:border-[#6D28D9] focus:outline-none disabled:cursor-not-allowed disabled:bg-[#F5F3FF] disabled:text-gray-400">
                <option value="">{hasValidDateTime ? "Selecteaza etajul" : "Alege data si ora intai"}</option>
                {displayedFloors.map((floor) => (
                  <option key={floor.id} value={floor.id}>{floor.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="seatRoom" className="font-medium text-[#29255E]">Camera</label>
              <select id="seatRoom" name="seatRoom" value={formData.seatRoom} onChange={handleChange} required disabled={!hasValidDateTime || isCheckingAvailability || formData.seatFloor === ""} className="w-full rounded-full border-2 border-[#C4B5FD] bg-white px-5 py-3 focus:border-[#6D28D9] focus:outline-none disabled:cursor-not-allowed disabled:bg-[#F5F3FF] disabled:text-gray-400">
                <option value="">Selecteaza camera</option>
                {officeRoomsWithAvailableSeats.map((room) => (
                  <option key={room.id} value={room.id}>{room.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <label htmlFor="seatId" className="font-medium text-[#29255E]">Seat ID</label>
              <select id="seatId" name="seatId" value={formData.seatId} onChange={handleChange} required disabled={!hasValidDateTime || isCheckingAvailability || formData.seatRoom === ""} className="w-full rounded-full border-2 border-[#C4B5FD] bg-white px-5 py-3 focus:border-[#6D28D9] focus:outline-none disabled:cursor-not-allowed disabled:bg-[#F5F3FF] disabled:text-gray-400">
                <option value="">Selecteaza scaunul</option>
                {seatsForSelectedRoom.map((seat) => (
                  <option key={seat.id} value={seat.id}>{seat.code}</option>
                ))}
              </select>
            </div>
          </div>

          {isTimeInvalid && <p className="mt-4 text-center text-sm font-medium text-red-600">End time must be later than start time.</p>}
          {isCheckingAvailability && <p className="mt-4 text-center text-sm font-medium text-[#29255E]" role="status">Se verifică disponibilitatea...</p>}
          {availabilityError !== "" && <p className="mt-4 text-center text-sm font-medium text-red-600">{availabilityError}</p>}
          <button type="submit" disabled={isFormInvalid || isSubmitting} className={`mt-8 w-full rounded-full px-6 py-4 text-lg font-bold text-white sm:mt-12 sm:text-xl ${isFormInvalid || isSubmitting ? "cursor-not-allowed bg-[#C4B5FD]" : "bg-[#6D28D9] hover:bg-[#5B21B6]"}`}>
            {isSubmitting ? "Se trimite..." : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
};

export default InviteModal;

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
};

type User = {
  id: string;
  name: string;
  email: string;
  role?: string;
};

type Reservation = {
  id: number;
  seat?: Seat | null;
  room?: Room | null;
  startDateTime: string;
  endDateTime: string;
  status: string;
};

const getRoomFloorId = (room: Room) => room.floor?.id ?? room.floor_id?.id ?? room.floorId ?? room.floor?.name ?? room.floor_id?.name;
const getSeatRoomId = (seat: Seat) => seat.room?.id ?? seat.roomId ?? seat.salaId;
const isAvailable = (status?: string) => status?.trim().toUpperCase() === "AVAILABLE";
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
  const [submitError, setSubmitError] = useState("");
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

    fetch("http://localhost:8080/hr/users", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers([]));

    fetch("http://localhost:8080/reservations/approved", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setReservations(Array.isArray(data) ? data : []))
      .catch(() => setReservations([]));
  }, []);

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

  const isTimeInvalid =
    formData.startTime !== "" &&
    formData.endTime !== "" &&
    formData.endTime <= formData.startTime;

  const hasValidDateTime =
    formData.date !== "" &&
    formData.startTime !== "" &&
    formData.endTime !== "" &&
    !isTimeInvalid;

  const selectedStart = hasValidDateTime
    ? new Date(`${formData.date}T${formData.startTime}`)
    : null;
  const selectedEnd = hasValidDateTime
    ? new Date(`${formData.date}T${formData.endTime}`)
    : null;

  const overlappingReservations = selectedStart && selectedEnd
    ? reservations.filter((reservation) => overlapsInterval(reservation, selectedStart, selectedEnd))
    : [];

  const isSeatReserved = (seat: Seat) => {
    const seatRoomId = getSeatRoomId(seat);

    return overlappingReservations.some((reservation) => {
      if (reservation.seat?.id === seat.id || reservation.seat?.code === seat.code) {
        return true;
      }

      return reservation.room?.id !== undefined && reservation.room.id === seatRoomId;
    });
  };

  const availableSeatsForInterval = hasValidDateTime
    ? seats.filter((seat) => isAvailable(seat.status) && !isSeatReserved(seat))
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

    accumulator.push({
      id: floorId,
      name: floor?.name ?? String(floorId),
    });

    return accumulator;
  }, []);

  const floorIdsWithOfficeRooms = new Set(
    officeRooms
      .map((room) => getRoomFloorId(room))
      .filter((floorId): floorId is EntityId => floorId !== undefined)
      .map((floorId) => String(floorId))
  );

  const displayedFloors = floorsFromRooms.length > 0
    ? floorsFromRooms
    : floors;

  const officeRoomsWithAvailableSeats = officeRooms.filter((room) => {
    const roomFloorId = getRoomFloorId(room);
    const matchesFloor = formData.seatFloor === "" || String(roomFloorId) === selectedFloorId;
    const hasAvailableSeat = availableSeatsForInterval.some((seat) => String(getSeatRoomId(seat)) === String(room.id));

    return matchesFloor && hasAvailableSeat;
  });

  const seatsForSelectedRoom = availableSeatsForInterval.filter(
    (seat) => getSeatRoomId(seat) === selectedRoomId
  );

  const isFormInvalid =
    formData.colleagueId === "" ||
    formData.date === "" ||
    formData.startTime === "" ||
    formData.endTime === "" ||
    formData.seatFloor === "" ||
    formData.seatRoom === "" ||
    formData.seatId === "" ||
    isTimeInvalid;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isFormInvalid) {
      return;
    }

    const selectedRoom = rooms.find((room) => String(room.id) === formData.seatRoom);
    const selectedSeat = seats.find((seat) => String(seat.id) === formData.seatId);

    if (!selectedRoom || !selectedSeat) {
      return;
    }

    const reservationData = {
      roomCode: selectedRoom?.code,
      seatCode: selectedSeat?.code,
      start: `${formData.date}T${formData.startTime}:00`,
      end: `${formData.date}T${formData.endTime}:00`,
      recurrence: 0,
    };

    const response = await fetch("http://localhost:8080/reservations", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservationData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Reservation was not saved", response.status, errorText);
      
      setSubmitError("Rezervarea nu a fost salvata. Verifica daca esti autentificata si daca locul este inca disponibil.");
      return;
    }

    navigate("/dashboard");
  };

  return (
    <>
      {submitError !== "" && (
        <ErrorPopUp
          title="Rezervarea nu a fost salvata"
          message={submitError}
          buttonText="Incearca din nou"
          onClose={() => setSubmitError("")}
        />
      )}

    <div className="w-full max-w-xl rounded-[32px] border border-[#C4B5FD] bg-[#EDE9FE] px-5 py-6 shadow-xl sm:rounded-[48px] sm:px-10 sm:py-10">
      <h2 className="mb-8 text-center text-2xl font-medium text-[#1E1950] sm:mb-10 sm:text-[30px]">
        Choose your colleague and the date
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label htmlFor="colleagueId" className="font-medium text-[#29255E]">
              Colleague
            </label>

            <select
              id="colleagueId"
              name="colleagueId"
              value={formData.colleagueId}
              onChange={handleChange}
              required
              className="w-full rounded-full border-2 border-[#C4B5FD] bg-white px-5 py-3 focus:border-[#6D28D9] focus:outline-none"
            >
              <option value="">Select a colleague</option>

              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="date" className="font-medium text-[#29255E]">
              Date
            </label>

            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              required
              className="w-full rounded-full border-2 border-[#C4B5FD] bg-white px-5 py-3 focus:border-[#6D28D9] focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="startTime" className="font-medium text-[#29255E]">
              Start time
            </label>

            <input
              id="startTime"
              name="startTime"
              type="time"
              value={formData.startTime}
              onChange={handleChange}
              step="900"
              required
              className="w-full rounded-full border-2 border-[#C4B5FD] bg-white px-5 py-3 focus:border-[#6D28D9] focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2 sm:mx-auto sm:w-full sm:max-w-[calc((100%-1.5rem)/2)]">
            <label htmlFor="endTime" className="font-medium text-[#29255E]">
              End time
            </label>

            <input
              id="endTime"
              name="endTime"
              type="time"
              value={formData.endTime}
              onChange={handleChange}
              min={formData.startTime || undefined}
              step="900"
              required
              className="w-full rounded-full border-2 border-[#C4B5FD] bg-white px-5 py-3 focus:border-[#6D28D9] focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="seatFloor" className="font-medium text-[#29255E]">
              Etaj / zona
            </label>

            <select
              id="seatFloor"
              name="seatFloor"
              value={formData.seatFloor}
              onChange={handleChange}
              required
              disabled={!hasValidDateTime}
              className="w-full rounded-full border-2 border-[#C4B5FD] bg-white px-5 py-3 focus:border-[#6D28D9] focus:outline-none disabled:cursor-not-allowed disabled:bg-[#F5F3FF] disabled:text-gray-400"
            >
              <option value="">
                {hasValidDateTime ? "Selecteaza etajul" : "Alege data si ora intai"}
              </option>

              {displayedFloors.map((floor) => (
                <option key={floor.id} value={floor.id}>
                  {floor.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="seatRoom" className="font-medium text-[#29255E]">
              Camera
            </label>

            <select
              id="seatRoom"
              name="seatRoom"
              value={formData.seatRoom}
              onChange={handleChange}
              required
              disabled={!hasValidDateTime || formData.seatFloor === ""}
              className="w-full rounded-full border-2 border-[#C4B5FD] bg-white px-5 py-3 focus:border-[#6D28D9] focus:outline-none disabled:cursor-not-allowed disabled:bg-[#F5F3FF] disabled:text-gray-400"
            >
              <option value="">Selecteaza camera</option>

              {officeRoomsWithAvailableSeats.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <label htmlFor="seatId" className="font-medium text-[#29255E]">
              Seat ID
            </label>

            <select
              id="seatId"
              name="seatId"
              value={formData.seatId}
              onChange={handleChange}
              required
              disabled={!hasValidDateTime || formData.seatRoom === ""}
              className="w-full rounded-full border-2 border-[#C4B5FD] bg-white px-5 py-3 focus:border-[#6D28D9] focus:outline-none disabled:cursor-not-allowed disabled:bg-[#F5F3FF] disabled:text-gray-400"
            >
              <option value="">Selecteaza scaunul</option>

              {seatsForSelectedRoom.map((seat) => (
                <option key={seat.id} value={seat.id}>
                  {seat.code}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isTimeInvalid && (
          <p className="mt-4 text-center text-sm font-medium text-red-600">
            End time must be later than start time.
          </p>
        )}

        <button
          type="submit"
          disabled={isFormInvalid}
          className={`mt-8 w-full rounded-full px-6 py-4 text-lg font-bold text-white sm:mt-12 sm:text-xl ${
            isFormInvalid
              ? "cursor-not-allowed bg-[#C4B5FD]"
              : "bg-[#6D28D9] hover:bg-[#5B21B6]"
          }`}
        >
          Submit
        </button>
      </form>
    </div>
    </>
  );
};

export default InviteModal;








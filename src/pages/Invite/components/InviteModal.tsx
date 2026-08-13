import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getSeatRoomsForFloor, seatFloors, seatOptions } from "@/data/seatIds";

const colleagues = [
  { id: 1, name: "Andrei Popescu" },
  { id: 2, name: "Maria Ionescu" },
  { id: 3, name: "Alex Dumitru" },
];

const InviteModal = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    colleagueId: "",
    seatFloor: "",
    seatRoom: "",
    seatId: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };


  const availableRooms = getSeatRoomsForFloor(formData.seatFloor);

  const filteredSeatIds = seatOptions.filter((seat) => {
    const matchesFloor = formData.seatFloor === "" || seat.floor === formData.seatFloor;
    const matchesRoom = formData.seatRoom === "" || seat.room === formData.seatRoom;

    return matchesFloor && matchesRoom;
  });
  const isTimeInvalid =
    formData.startTime !== "" &&
    formData.endTime !== "" &&
    formData.endTime <= formData.startTime;

  const isFormInvalid =
    formData.colleagueId === "" ||
    formData.seatFloor === "" ||
    formData.seatRoom === "" ||
    formData.seatId === "" ||
    formData.date === "" ||
    formData.startTime === "" ||
    formData.endTime === "" ||
    isTimeInvalid;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isFormInvalid) {
      return;
    }

    const invitationData = {
      colleagueId: Number(formData.colleagueId),
      seatFloor: formData.seatFloor,
      seatRoom: formData.seatRoom,
      seatId: formData.seatId,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
    };

    console.log(invitationData);

    navigate("/dashboard");
  };

  return (
    <div className="w-full max-w-xl rounded-[32px] border border-[#C4B5FD] bg-[#EDE9FE] px-5 py-6 shadow-xl sm:rounded-[48px] sm:px-10 sm:py-10">
      <h2 className="mb-8 text-center text-2xl font-medium text-[#1E1950] sm:mb-10 sm:text-[30px]">
        Choose your colleague and the date
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          {/* Colleague */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="colleagueId"
              className="font-medium text-[#29255E]"
            >
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

              {colleagues.map((colleague) => (
                <option key={colleague.id} value={colleague.id}>
                  {colleague.name}
                </option>
              ))}
            </select>
          </div>

          {/* Floor */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="seatFloor"
              className="font-medium text-[#29255E]"
            >
              Etaj / zona
            </label>

            <select
              id="seatFloor"
              name="seatFloor"
              value={formData.seatFloor}
              onChange={handleChange}
              required
              className="w-full rounded-full border-2 border-[#C4B5FD] bg-white px-5 py-3 focus:border-[#6D28D9] focus:outline-none"
            >
              <option value="">Selecteaza etajul</option>

              {seatFloors.map((floor) => (
                <option key={floor} value={floor}>
                  {floor}
                </option>
              ))}
            </select>
          </div>

          {/* Room */}
          <div className="flex flex-col gap-2 sm:col-span-2 sm:mx-auto sm:w-1/2">
            <label
              htmlFor="seatRoom"
              className="font-medium text-[#29255E]"
            >
              Camera
            </label>

            <select
              id="seatRoom"
              name="seatRoom"
              value={formData.seatRoom}
              onChange={handleChange}
              required
              disabled={formData.seatFloor === ""}
              className="w-full rounded-full border-2 border-[#C4B5FD] bg-white px-5 py-3 focus:border-[#6D28D9] focus:outline-none disabled:cursor-not-allowed disabled:bg-[#F5F3FF] disabled:text-gray-400"
            >
              <option value="">Selecteaza camera</option>

              {availableRooms.map((room) => (
                <option key={room} value={room}>
                  {room}
                </option>
              ))}
            </select>
          </div>

          {/* Seat ID */}
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label
              htmlFor="seatId"
              className="font-medium text-[#29255E]"
            >
              Seat ID
            </label>

            <select
              id="seatId"
              name="seatId"
              value={formData.seatId}
              onChange={handleChange}
              required
              disabled={formData.seatRoom === ""}
              className="w-full rounded-full border-2 border-[#C4B5FD] bg-white px-5 py-3 focus:border-[#6D28D9] focus:outline-none disabled:cursor-not-allowed disabled:bg-[#F5F3FF] disabled:text-gray-400"
            >
              <option value="">Selecteaza scaunul</option>

              {filteredSeatIds.map((seat) => (
                <option key={seat.id} value={seat.id}>
                  {seat.id}
                </option>
              ))}
            </select>
          </div>
          {/* Date */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="date"
              className="font-medium text-[#29255E]"
            >
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

          {/* Start time */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="startTime"
              className="font-medium text-[#29255E]"
            >
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

          {/* End time */}
          <div className="flex flex-col gap-2 sm:col-span-2 sm:mx-auto sm:w-full sm:max-w-[calc((100%-1.5rem)/2)]">
            <label
              htmlFor="endTime"
              className="font-medium text-[#29255E]"
            >
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
  );
};

export default InviteModal;







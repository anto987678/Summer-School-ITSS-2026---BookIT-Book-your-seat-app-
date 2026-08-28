import { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";

type Reservation = {
  id: number;
  status: string;
  startDateTime: string;
  endDateTime: string;
  seat?: {
    id: number;
    code: string;
    room?: {
      id: number;
      code: string;
      name: string;
    } | null;
  } | null;
  room?: {
    id: number;
    code: string;
    name: string;
  } | null;
};

type OfficeActivityItem = {
  label: string;
  days: number;
};

type PreferredZoneItem = {
  name: string;
  percentage: number;
  color: string;
};

const getWeekLabel = (week: number) => {
  const ranges: Record<number, string> = {
    1: "1-7",
    2: "8-14",
    3: "15-21",
    4: "22-28",
    5: "29-31",
  };

  return ranges[week] ?? `S${week}`;
};

const buildOfficeActivity = (reservations: Reservation[]): OfficeActivityItem[] => {
  const approvedReservations = reservations.filter(
    (reservation) => reservation.status === "APPROVED"
  );

  const uniqueDaysByWeek = new Map<number, Set<string>>();

  approvedReservations.forEach((reservation) => {
    const date = new Date(reservation.startDateTime);
    const day = reservation.startDateTime.slice(0, 10);
    const week = Math.ceil(date.getDate() / 7);

    if (!uniqueDaysByWeek.has(week)) {
      uniqueDaysByWeek.set(week, new Set());
    }

    uniqueDaysByWeek.get(week)?.add(day);
  });

  return [1, 2, 3, 4, 5].map((week) => ({
    label: getWeekLabel(week),
    days: uniqueDaysByWeek.get(week)?.size ?? 0,
  }));
};

const buildPreferredZones = (reservations: Reservation[]): PreferredZoneItem[] => {
  const colors = ["#7C3AED", "#A855F7", "#C084FC", "#E9D5FF"];
  const approvedReservations = reservations.filter(
    (reservation) => reservation.status === "APPROVED"
  );
  const counts = new Map<string, number>();

  approvedReservations.forEach((reservation) => {
    const zone =
      reservation.seat?.room?.name ??
      reservation.room?.name ??
      "Necunoscut";

    counts.set(zone, (counts.get(zone) ?? 0) + 1);
  });

  const total = Array.from(counts.values()).reduce((sum, count) => sum + count, 0);

  if (total === 0) {
    return [];
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, count], index) => ({
      name,
      percentage: Math.round((count * 100) / total),
      color: colors[index % colors.length],
    }));
};

const OfficeActivityCard = () => {
  const [officeActivity, setOfficeActivity] = useState<OfficeActivityItem[]>(
    buildOfficeActivity([])
  );
  const [preferredZones, setPreferredZones] = useState<PreferredZoneItem[]>([]);

  useEffect(() => {
    const loadStats = () => {
      fetch("http://localhost:8080/reservations/history", {
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Could not load reservation history");
          }

          return response.json();
        })
        .then((reservations: Reservation[]) => {
          const safeReservations = Array.isArray(reservations) ? reservations : [];

          setOfficeActivity(buildOfficeActivity(safeReservations));
          setPreferredZones(buildPreferredZones(safeReservations));
        })
        .catch(() => {
          setOfficeActivity(buildOfficeActivity([]));
          setPreferredZones([]);
        });
    };

    loadStats();

    window.addEventListener("focus", loadStats);

    return () => {
      window.removeEventListener("focus", loadStats);
    };
  }, []);

  const maximumDays = Math.max(1, ...officeActivity.map((item) => item.days));
  const hasPreferredZones = preferredZones.length > 0;

  const donutSize = 128;
  const donutStroke = 30;
  const donutRadius = 49;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const donutGap = hasPreferredZones && preferredZones.length > 1 ? 3 : 0;
  const totalPreferredPercentage = preferredZones.reduce(
    (sum, zone) => sum + zone.percentage,
    0
  );
  const drawableCircumference = donutCircumference - donutGap * preferredZones.length;
  let donutOffset = 0;
  const donutSegments = preferredZones.map((zone) => {
    const segmentLength =
      totalPreferredPercentage > 0
        ? (zone.percentage / totalPreferredPercentage) * drawableCircumference
        : 0;
    const segment = {
      ...zone,
      segmentLength,
      dashOffset: -donutOffset,
    };

    donutOffset += segmentLength + donutGap;

    return segment;
  });

  const topZoneInitial = preferredZones[0]?.name.charAt(0).toUpperCase() ?? "-";

  return (
    <DashboardCard title="Your Office Activity">
      <p className="mt-1 text-xs text-[#29255E]">Weekly days in office</p>

      <div className="relative mt-5 h-[180px]">
        <div className="pointer-events-none absolute inset-x-0 top-6 border-t border-gray-200" />
        <div className="pointer-events-none absolute inset-x-0 top-[78px] border-t border-gray-200" />
        <div className="pointer-events-none absolute inset-x-0 top-[130px] border-t border-gray-200" />

        <div className="relative flex h-full items-end justify-around gap-3 px-2 pb-6">
          {officeActivity.map((item) => (
            <div
              key={item.label}
              className="flex h-full flex-1 flex-col items-center justify-end"
            >
              <span className="mb-1 text-xs text-[#29255E]">{item.days}d</span>

              <div
                className="w-8 rounded-t-md bg-[#7C3AED] transition-all hover:bg-[#6D28D9]"
                style={{
                  height: `${Math.max(4, (item.days / maximumDays) * 100)}px`,
                }}
              />

              <span className="mt-2 text-xs text-[#29255E]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <h4 className="font-semibold text-[#29255E]">Preferred Seat Zones</h4>

        <p className="mt-1 text-xs text-[#29255E]">All-time distribution</p>

        <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row">
          <div className="relative h-32 w-32 shrink-0">
            <svg
              className="h-32 w-32 -rotate-90"
              viewBox={`0 0 ${donutSize} ${donutSize}`}
              aria-hidden="true"
            >
              {hasPreferredZones ? (
                donutSegments.map((zone) => (
                  <circle
                    key={zone.name}
                    cx={donutSize / 2}
                    cy={donutSize / 2}
                    r={donutRadius}
                    fill="none"
                    stroke={zone.color}
                    strokeWidth={donutStroke}
                    strokeDasharray={`${zone.segmentLength} ${donutCircumference - zone.segmentLength}`}
                    strokeDashoffset={zone.dashOffset}
                    shapeRendering="geometricPrecision"
                  />
                ))
              ) : (
                <circle
                  cx={donutSize / 2}
                  cy={donutSize / 2}
                  r={donutRadius}
                  fill="none"
                  stroke="#E9D5FF"
                  strokeWidth={donutStroke}
                />
              )}
            </svg>

            <div className="absolute inset-[26px] flex items-center justify-center rounded-full bg-white">
              <div className="text-center">
                <p className="text-xs text-[#29255E]">Top</p>

                <p className="font-bold text-[#29255E]">{topZoneInitial}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {hasPreferredZones ? (
              preferredZones.map((zone) => (
                <div key={zone.name} className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-sm"
                    style={{
                      backgroundColor: zone.color,
                    }}
                  />

                  <span className="text-xs text-[#29255E]">
                    {zone.name} ({zone.percentage}%)
                  </span>
                </div>
              ))
            ) : (
              <span className="text-xs text-[#29255E]">No reservations yet</span>
            )}
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default OfficeActivityCard;
export type EmployeeAttendance = {
  id: number
  name: string
  department: string
  presenceDays: number
  totalWorkingDays: number
  attendanceDates: string[]
}

export const employeeAttendanceMock: EmployeeAttendance[] = [
  {
    id: 1,
    name: "Claudiu Ionescu",
    department: "Development",
    presenceDays: 45,
    totalWorkingDays: 165,
    attendanceDates: [
      "2026-07-21",
      "2026-07-22",
      "2026-07-23",
      "2026-07-28",
    ],
  },
  {
    id: 2,
    name: "Cristian Marin",
    department: "Development",
    presenceDays: 64,
    totalWorkingDays: 120,
    attendanceDates: [
      "2026-07-21",
      "2026-07-24",
      "2026-07-29",
    ],
  },
  {
    id: 3,
    name: "Elena Popescu",
    department: "Development",
    presenceDays: 92,
    totalWorkingDays: 140,
    attendanceDates: [
      "2026-07-22",
      "2026-07-23",
      "2026-07-24",
      "2026-07-30",
    ],
  },
  {
    id: 4,
    name: "Radu Georgescu",
    department: "Development",
    presenceDays: 35,
    totalWorkingDays: 110,
    attendanceDates: [
      "2026-07-21",
      "2026-07-25",
      "2026-07-31",
    ],
  },

  {
    id: 5,
    name: "Ana Petrescu",
    department: "Project Management",
    presenceDays: 88,
    totalWorkingDays: 195,
    attendanceDates: [
      "2026-07-22",
      "2026-07-24",
      "2026-07-25",
      "2026-07-29",
    ],
  },
  {
    id: 6,
    name: "Mihai Dumitrescu",
    department: "Project Management",
    presenceDays: 76,
    totalWorkingDays: 130,
    attendanceDates: [
      "2026-07-21",
      "2026-07-23",
      "2026-07-28",
    ],
  },
  {
    id: 7,
    name: "Ioana Stan",
    department: "Project Management",
    presenceDays: 105,
    totalWorkingDays: 150,
    attendanceDates: [
      "2026-07-21",
      "2026-07-22",
      "2026-07-24",
      "2026-07-30",
    ],
  },
  {
    id: 8,
    name: "Vlad Enache",
    department: "Project Management",
    presenceDays: 51,
    totalWorkingDays: 125,
    attendanceDates: [
      "2026-07-23",
      "2026-07-25",
      "2026-07-31",
    ],
  },

  {
    id: 9,
    name: "Maria Dobre",
    department: "Human Resources",
    presenceDays: 62,
    totalWorkingDays: 100,
    attendanceDates: [
      "2026-07-21",
      "2026-07-23",
      "2026-07-25",
      "2026-07-28",
    ],
  },
  {
    id: 10,
    name: "Andreea Rusu",
    department: "Human Resources",
    presenceDays: 84,
    totalWorkingDays: 120,
    attendanceDates: [
      "2026-07-22",
      "2026-07-24",
      "2026-07-29",
    ],
  },
  {
    id: 11,
    name: "Sorin Pavel",
    department: "Human Resources",
    presenceDays: 43,
    totalWorkingDays: 115,
    attendanceDates: [
      "2026-07-21",
      "2026-07-25",
      "2026-07-30",
    ],
  },
  {
    id: 12,
    name: "Diana Matei",
    department: "Human Resources",
    presenceDays: 97,
    totalWorkingDays: 135,
    attendanceDates: [
      "2026-07-22",
      "2026-07-23",
      "2026-07-28",
      "2026-07-31",
    ],
  },

  {
    id: 13,
    name: "Andrei Vasilescu",
    department: "Management",
    presenceDays: 54,
    totalWorkingDays: 90,
    attendanceDates: [
      "2026-07-22",
      "2026-07-24",
      "2026-07-29",
    ],
  },
  {
    id: 14,
    name: "Oana Iliescu",
    department: "Management",
    presenceDays: 78,
    totalWorkingDays: 100,
    attendanceDates: [
      "2026-07-21",
      "2026-07-22",
      "2026-07-23",
      "2026-07-30",
    ],
  },
  {
    id: 15,
    name: "Alexandru Neagu",
    department: "Management",
    presenceDays: 69,
    totalWorkingDays: 105,
    attendanceDates: [
      "2026-07-24",
      "2026-07-25",
      "2026-07-28",
    ],
  },
  {
    id: 16,
    name: "Bianca Tudor",
    department: "Management",
    presenceDays: 82,
    totalWorkingDays: 110,
    attendanceDates: [
      "2026-07-21",
      "2026-07-23",
      "2026-07-29",
      "2026-07-31",
    ],
  },
]
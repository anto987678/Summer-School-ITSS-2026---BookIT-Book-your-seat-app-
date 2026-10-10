import { bookingTabs, type BookingTab } from "../types"

type BookingTabsProps = {
  activeTab: BookingTab
  onChange: (tab: BookingTab) => void
}

export default function BookingTabs({ activeTab, onChange }: BookingTabsProps) {
  return (
    <div className="mb-6 grid w-full grid-cols-1 gap-1 rounded-2xl bg-[#F3F3F9] p-1 sm:mb-8 sm:grid-cols-3 sm:rounded-full">
      {bookingTabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`min-h-11 min-w-0 rounded-xl px-3 py-3 text-sm font-semibold transition-all sm:rounded-full ${
            activeTab === tab ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

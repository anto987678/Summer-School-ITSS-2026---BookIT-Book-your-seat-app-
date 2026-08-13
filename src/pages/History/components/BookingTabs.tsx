import { bookingTabs, type BookingTab } from "../types"

type BookingTabsProps = {
  activeTab: BookingTab
  onChange: (tab: BookingTab) => void
}

export default function BookingTabs({ activeTab, onChange }: BookingTabsProps) {
  return (
    <div className="mb-8 flex w-full rounded-full bg-[#F3F3F9] p-1">
      {bookingTabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`min-w-0 flex-1 rounded-full px-2 py-3 text-xs font-semibold transition-all sm:text-sm ${
            activeTab === tab ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
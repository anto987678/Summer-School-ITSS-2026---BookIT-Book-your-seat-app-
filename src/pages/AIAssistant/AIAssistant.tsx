import { useState } from "react"
import { Bot } from "lucide-react"
import AssistantWindow, { type TravelMode } from "./components/AssistantWindow"
import type { AssistantStatus } from "./types"

const idleMessage =
  "Salut! Pot sa te ajut cu informatii despre vreme si trafic pentru drumul catre birou."

const formatLocalDateTime = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, "0")

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const backendTravelModeBySelection: Record<TravelMode, string> = {
  driving: "DRIVE",
  walking: "WALK",
  bicycling: "TWO_WHEELER",
  transit: "TRANSIT",
  "two-wheeler": "TWO_WHEELER",
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState<AssistantStatus>("idle")
  const [message, setMessage] = useState(idleMessage)
  const [travelMode, setTravelMode] = useState<TravelMode>("driving")

  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setStatus("error")
      setMessage("Browserul tau nu permite accesarea locatiei.")
      return
    }

    setStatus("requesting-location")
    setMessage("Astept permisiunea pentru locatie...")

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setStatus("loading")
        setMessage("Analizez traficul si vremea...")

        const { latitude, longitude } = position.coords

        // ora pentru care cerem recomandarea: acum, rotunjit la ora exacta urmatoare
        const now = new Date()
        now.setMinutes(0, 0, 0)
        now.setHours(now.getHours() + 1)
        const targetHour = formatLocalDateTime(now)

        try {
          const params = new URLSearchParams({
            lat: String(latitude),
            lng: String(longitude),
            targetHour,
            metodaDeplasare: backendTravelModeBySelection[travelMode],
          })
          const url = `http://localhost:8080/recommendation?${params.toString()}`
          const response = await fetch(url, { credentials: "include" })

          if (!response.ok) {
            setStatus("error")
            setMessage("Nu am putut obtine recomandarea. Incearca din nou.")
            return
          }

          const recomandare = await response.text()
          setStatus("succes")
          setMessage(recomandare)
        } catch {
          setStatus("error")
          setMessage("Nu am putut contacta serverul.")
        }
      },
      () => {
        setStatus("error")
        setMessage(
          "Nu am putut obtine locatia. Verifica permisiunile browserului si incearca din nou."
        )
      }
    )
  }

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-5 z-50 sm:bottom-28 sm:right-10">
          <AssistantWindow
            status={status}
            message={message}
            travelMode={travelMode}
            onTravelModeChange={setTravelMode}
            onClose={() => setIsOpen(false)}
            onRequestLocation={handleRequestLocation}
          />
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((currentIsOpen) => !currentIsOpen)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#8B5CF6] text-2xl text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#7C3AED] sm:bottom-10 sm:right-10 sm:h-16 sm:w-16"
        aria-label={isOpen ? "Close assistant" : "Open assistant"}
      >
        <Bot className="h-7 w-7 sm:h-8 sm:w-8" />
      </button>
    </>
  )
}

export default AIAssistant


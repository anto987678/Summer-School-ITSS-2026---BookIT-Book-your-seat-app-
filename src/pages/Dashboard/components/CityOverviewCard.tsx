import { useEffect, useState } from "react"
import DashboardCard from "./DashboardCard"
import {
  CloudRain,
  Droplets,
  Wind,
} from "lucide-react"

import {
  trafficMock,
  weatherMock,
} from "@/data/dashboardMockData"

type WeatherResponse = {
  temperature: number
  windSpeed: number
  precipitation: number
  snowfall: number
  weatherCode: number
}

type RouteResponse = {
  routeName: string
  distanceInMeters: number
  durationInSeconds: number
}

type TrafficItem = {
  id: number
  route: string
  car: string
  walk: string
  bike: string
  publicTransport: string
  distance: string
  color: string
}

const fallbackCoords = {
  latitude: 44.4268,
  longitude: 26.1025,
}

const getCurrentCoords = () =>
  new Promise<GeolocationCoordinates>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation unavailable"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      reject,
      { timeout: 8000 },
    )
  })

const getLocalTargetHour = () => {
  const now = new Date()
  now.setMinutes(0, 0, 0)
  const timezoneOffsetMs = now.getTimezoneOffset() * 60 * 1000
  return new Date(now.getTime() - timezoneOffsetMs).toISOString().slice(0, 19)
}

const getDisplayDate = () =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date())

const getWeatherCondition = (weather: WeatherResponse) => {
  if (weather.snowfall > 0) return "Snowy"
  if (weather.precipitation > 0) return "Rainy"

  switch (weather.weatherCode) {
    case 0:
      return "Clear"
    case 1:
      return "Mostly clear"
    case 2:
      return "Mostly clear"
    case 3:
      return "Overcast"
    case 45:
    case 48:
      return "Foggy"
    default:
      return "Mixed"
  }
}

const formatDuration = (minutes: number) => `${Math.max(1, Math.round(minutes))} min`

const getTrafficLevel = (durationInSeconds: number, distanceInMeters: number) => {
  const minutes = Math.round(durationInSeconds / 60)
  const distanceKm = distanceInMeters / 1000
  const speedKmh = distanceKm / (durationInSeconds / 3600)

  if (speedKmh < 12) {
    return { label: `${minutes} min`, color: "#EF4444" }
  }

  if (speedKmh < 22) {
    return { label: `${minutes} min`, color: "#F59E0B" }
  }

  return { label: `${minutes} min`, color: "#10B981" }
}

const mapRoutesToTraffic = (routes: RouteResponse[]): TrafficItem[] =>
  routes.map((route, index) => {
    const trafficLevel = getTrafficLevel(route.durationInSeconds, route.distanceInMeters)
    const distanceKm = route.distanceInMeters / 1000

    return {
      id: index + 1,
      route: route.routeName,
      car: trafficLevel.label,
      walk: formatDuration((distanceKm / 5) * 60),
      bike: formatDuration((distanceKm / 15) * 60),
      publicTransport: formatDuration((distanceKm / 18) * 60 + 8),
      distance: `${distanceKm.toFixed(1)} km`,
      color: trafficLevel.color,
    }
  })

const CityOverviewCard = () => {
  const [weather, setWeather] = useState({
    ...weatherMock,
    date: getDisplayDate(),
  })
  const [traffic, setTraffic] = useState<TrafficItem[]>(
    trafficMock.map((item) => ({
      id: item.id,
      route: `Ruta ${item.id}`,
      car: item.level,
      walk: "-",
      bike: "-",
      publicTransport: "-",
      distance: item.interval,
      color: item.color,
    })),
  )
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadCityOverview = async () => {
      try {
        const coords = await getCurrentCoords().catch(() => fallbackCoords)
        const targetHour = getLocalTargetHour()

        const weatherParams = new URLSearchParams({
          latitude: String(coords.latitude),
          longitude: String(coords.longitude),
          targetHour,
        })

        const trafficParams = new URLSearchParams({
          lat: String(coords.latitude),
          lng: String(coords.longitude),
        })

        const [weatherResponse, trafficResponse] = await Promise.all([
          fetch(`http://localhost:8080/weather-test?${weatherParams.toString()}`),
          fetch(`http://localhost:8080/traffic-routes?${trafficParams.toString()}`),
        ])

        if (!weatherResponse.ok || !trafficResponse.ok) {
          throw new Error("City overview request failed")
        }

        const weatherData = (await weatherResponse.json()) as WeatherResponse
        const trafficData = (await trafficResponse.json()) as RouteResponse[]

        if (!isMounted) return

        setWeather({
          city: "Bucharest",
          date: getDisplayDate(),
          temperature: Math.round(weatherData.temperature),
          condition: getWeatherCondition(weatherData),
          humidity: Math.round(weatherData.precipitation),
          windSpeed: Math.round(weatherData.windSpeed),
        })
        setTraffic(mapRoutesToTraffic(trafficData))
        setIsLive(true)
      } catch {
        if (isMounted) {
          setIsLive(false)
        }
      }
    }

    void loadCityOverview()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <DashboardCard title="City Overview" className="flex flex-col gap-6">
      {/* Weather */}
      <section className="rounded-xl bg-[#F5F3FF] p-5">
        <h3 className="font-bold text-[#29255E]">
          Weather - {weather.city}
        </h3>

        <p className="mt-1 text-xs text-gray-400">
          {weather.date}
        </p>

        <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-500">
              <CloudRain className="h-7 w-7" />
            </div>

            <div>
              <p className="text-3xl font-bold text-[#29255E]">
                {weather.temperature}°C
              </p>

              <p className="text-sm text-gray-500">
                {weather.condition}
              </p>
            </div>
          </div>

          <div className="flex gap-7 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4" />

              <span>
                Precip: {weather.humidity} mm
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4" />

              <span>
                Wind: {weather.windSpeed} km/h
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Traffic */}
      <section className="min-h-[280px] flex-1 rounded-xl bg-[#F5F3FF] p-5">
        <div className="flex items-center gap-4">
          <h3 className="font-bold text-[#29255E]">
            Traffic - Bucharest
          </h3>

          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isLive
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-500"
          }`}>
            {isLive ? "Live" : "Fallback"}
          </span>
        </div>

        <div className="mt-5 overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white">
          <div className="min-w-[620px]">
            <div className="grid grid-cols-[1fr_0.9fr_0.9fr_0.9fr_1.15fr_0.8fr] bg-[#F3F4F6] px-4 py-3 text-xs font-bold uppercase text-gray-500">
              <span>Ruta</span>
              <span>Masina</span>
              <span>Pe jos</span>
              <span>Bicicleta</span>
              <span>Transport comun</span>
              <span>Distanta</span>
            </div>

            <div className="divide-y divide-[#E5E7EB]">
              {traffic.map((trafficItem) => (
                <div
                  key={trafficItem.id}
                  className="grid grid-cols-[1fr_0.9fr_0.9fr_0.9fr_1.15fr_0.8fr] items-center bg-[#F9FAFB] px-4 py-3 text-sm"
                >
                  <div className="flex items-center gap-2 font-semibold text-[#29255E]">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{
                        backgroundColor: trafficItem.color,
                      }}
                    />
                    {trafficItem.route}
                  </div>

                  <span className="font-semibold text-[#29255E]">{trafficItem.car}</span>
                  <span className="text-gray-500">{trafficItem.walk}</span>
                  <span className="text-gray-500">{trafficItem.bike}</span>
                  <span className="text-gray-500">{trafficItem.publicTransport}</span>
                  <span className="text-gray-500">{trafficItem.distance}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </DashboardCard>
  )
}

export default CityOverviewCard








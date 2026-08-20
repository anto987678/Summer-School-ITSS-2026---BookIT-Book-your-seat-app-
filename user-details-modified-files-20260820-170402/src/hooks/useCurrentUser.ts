import { useEffect, useState } from "react"

export type UserRole = "CEO" | "MANAGER" | "PM" | "DEV" | "HR"

export type CurrentUser = {
  id?: string
  postgresUserId?: number
  name: string
  email: string
  role: UserRole
  phoneNumber?: string
  departmentId?: number
  departmentName?: string
}

const fallbackUser: CurrentUser = {
  name: "User",
  email: "",
  role: "DEV",
}

export function useCurrentUser(refreshKey?: string) {
  const [user, setUser] = useState<CurrentUser>(fallbackUser)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const setSafeUser = (nextUser: Partial<CurrentUser>) => {
      if (isMounted) {
        setUser({
          ...fallbackUser,
          ...nextUser,
          name: nextUser.name || fallbackUser.name,
          email: nextUser.email || fallbackUser.email,
          role: nextUser.role || fallbackUser.role,
        })
        setIsLoading(false)
      }
    }

    if (import.meta.env.VITE_MOCK_AUTH === "true") {
      const mockUser = localStorage.getItem("mockUser")

      if (!mockUser) {
        setSafeUser(fallbackUser)
        return () => {
          isMounted = false
        }
      }

      try {
        setSafeUser(JSON.parse(mockUser) as Partial<CurrentUser>)
      } catch {
        setSafeUser(fallbackUser)
      }

      return () => {
        isMounted = false
      }
    }

    fetch("http://localhost:8080/me", {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Not logged in")
        }

        return response.json()
      })
      .then((data: Partial<CurrentUser>) => setSafeUser(data))
      .catch(() => setSafeUser(fallbackUser))

    return () => {
      isMounted = false
    }
  }, [refreshKey])

  return { user, isLoading }
}

import AuthFormField from "@/components/auth/AuthFormField"
import AuthFormShell from "@/components/auth/AuthFormShell"
import AuthSubmitButton from "@/components/auth/AuthSubmitButton"
import { useEmailValidation } from "@/hooks/useEmailValidation"
import { useFormData } from "@/hooks/useFormData"
import {
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react"
import { Link, useNavigate } from "react-router-dom"

type LoginProps = {
  setIsLoggedIn?: Dispatch<SetStateAction<boolean>>
}

const Login = ({ setIsLoggedIn }: LoginProps) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { formData, handleChange } = useFormData(
    {
      email: "",
      password: "",
    },
    () => setError(""),
  )

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (import.meta.env.VITE_MOCK_AUTH === "true") {
        const email = formData.email.trim()
        const role = email.toLowerCase() === "hr@mock.test" ? "MANAGER" : "DEV"

        localStorage.setItem(
          "mockUser",
          JSON.stringify({
            id: "mock-user",
            name: role === "MANAGER" ? "Mock HR" : "Mock User",
            email,
            role,
          }),
        )

        setIsLoggedIn?.(true)
        navigate("/dashboard")
        return
      }

      const loginResponse = await fetch("http://localhost:8080/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      })

      if (!loginResponse.ok) {
        const message = await loginResponse.text()

        if (message.includes("Password must be changed")) {
          navigate("/change-password", {
            state: {
              email: formData.email.trim(),
              oldPassword: formData.password,
            },
          })
          return
        }

        setError(message || "Emailul sau parola introduse nu sunt corecte.")
        return
      }

      setIsLoggedIn?.(true)
      navigate("/dashboard")
    } catch {
      setError("Nu am putut contacta serverul. Incearca din nou.")
    } finally {
      setLoading(false)
    }
  }

  const isValidEmail = useEmailValidation(formData.email)
  const isInactive = !isValidEmail || formData.password === "" || loading

  return (
    <AuthFormShell error={error} onClearError={() => setError("")} onSubmit={handleSubmit}>
      <h1 className="mb-4 text-center text-[36px] sm:text-[48px]">
        Log in
      </h1>

      <AuthFormField
        id="email"
        name="email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
      />

      <AuthFormField
        id="password"
        name="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
      />

      <AuthSubmitButton disabled={isInactive}>
        {loading ? "Logging in..." : "Log in"}
      </AuthSubmitButton>

      <p className="mt-4 text-center text-base text-[#6B7280] sm:text-[20px]">
        Don't have an account?
        <Link to="/signup" className="ml-1 font-semibold text-[#6D28D9]">
          Register
        </Link>
      </p>

      <p className="mt-4 text-center text-base text-[#6B7280] sm:text-[20px]">
        Did you forget your password?
        <Link
          to="/forgot-password"
          className="ml-1 font-semibold text-[#6D28D9]"
        >
          Reset it
        </Link>
      </p>
    </AuthFormShell>
  )
}

export default Login
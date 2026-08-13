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

type RegisterProps = {
  setIsLoggedIn?: Dispatch<SetStateAction<boolean>>
}

const Register = (_props: RegisterProps) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { formData, handleChange } = useFormData(
    {
      name: "",
      email: "",
      password: "",
      repeatPassword: "",
      role: "DEV",
    },
    () => setError(""),
  )

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (formData.password !== formData.repeatPassword) {
      setError("Passwords do not match!")
      return
    }

    setError("")
    setLoading(true)

    try {
      const registerResponse = await fetch(
        "http://localhost:8080/register",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
            role: formData.role,
          }),
        },
      )

      if (!registerResponse.ok) {
        const message = await registerResponse.text()

        setError(
          message || "Registration could not be completed.",
        )
        return
      }

      navigate("/change-password", {
        state: {
          email: formData.email.trim(),
          oldPassword: formData.password,
        },
      })
    } catch {
      setError(
        "Nu am putut contacta serverul. Încearcă din nou.",
      )
    } finally {
      setLoading(false)
    }
  }

  const isValidEmail = useEmailValidation(formData.email)

  const isInactive =
    formData.name.trim() === "" ||
    !isValidEmail ||
    formData.password === "" ||
    formData.repeatPassword === "" ||
    loading

  return (
    <AuthFormShell error={error} onClearError={() => setError("")} onSubmit={handleSubmit}>
      <h1 className="mb-4 text-center text-[36px] sm:text-[48px]">
        Register
      </h1>

      <AuthFormField
        id="name"
        name="name"
        label="Name"
        placeholder="Enter your name"
        value={formData.name}
        onChange={handleChange}
      />

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
        id="role"
        name="role"
        label="Role"
        value={formData.role}
        onChange={handleChange}
      >
        <option value="DEV">Developer</option>
        <option value="PM">Project Manager</option>
        <option value="MANAGER">Manager</option>
        <option value="CEO">CEO</option>
      </AuthFormField>

      <AuthFormField
        id="password"
        name="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
      />

      <AuthFormField
        id="repeatPassword"
        name="repeatPassword"
        label="Repeat password"
        type="password"
        placeholder="Repeat your password"
        value={formData.repeatPassword}
        onChange={handleChange}
      />

      <AuthSubmitButton disabled={isInactive}>
        {loading ? "Submitting..." : "Register"}
      </AuthSubmitButton>

      <p className="mt-4 text-center text-base text-[#6B7280] sm:text-[20px]">
        Do you already have an account?

        <Link
          to="/login"
          className="ml-1 font-semibold text-[#6D28D9] hover:underline"
        >
          Log in
        </Link>
      </p>
    </AuthFormShell>
  )
}

export default Register
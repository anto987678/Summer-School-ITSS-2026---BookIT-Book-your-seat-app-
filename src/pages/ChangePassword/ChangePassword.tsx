import AuthFormField from "@/components/auth/AuthFormField"
import AuthFormShell from "@/components/auth/AuthFormShell"
import AuthSubmitButton from "@/components/auth/AuthSubmitButton"
import { useFormData } from "@/hooks/useFormData"
import { useState, type ChangeEvent, type FormEvent } from "react"
import { useLocation, useNavigate } from "react-router-dom"

type ChangePasswordState = {
  email?: string
  oldPassword?: string
}

const ChangePassword = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as ChangePasswordState | null

  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { formData, handleChange } = useFormData(
    {
      email: state?.email || "",
      oldPassword: state?.oldPassword || "",
      newPassword: "",
    },
    () => setError(""),
  )

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    setError("")
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (formData.newPassword !== confirmPassword) {
      setError("Parolele introduse nu coincid.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("http://localhost:8080/change-password", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }),
      })

      const message = await response.text()

      if (!response.ok) {
        setError(message || "Parola nu a putut fi modificata.")
        return
      }

      const loginResponse = await fetch("http://localhost:8080/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.newPassword,
        }),
      })

      if (!loginResponse.ok) {
        navigate("/login")
        return
      }

      navigate("/dashboard")
    } catch {
      setError("Nu am putut contacta serverul. Incearca din nou.")
    } finally {
      setLoading(false)
    }
  }

  const isInactive =
    formData.email.trim() === "" ||
    formData.oldPassword === "" ||
    formData.newPassword === "" ||
    confirmPassword === ""

  return (
    <AuthFormShell error={error} onClearError={() => setError("")} onSubmit={handleSubmit}>
      <h1 className="mb-4 text-center text-[36px] sm:text-[48px]">
        Change password
      </h1>

      <p className="text-center text-base text-[#6B7280] sm:text-[20px]">
        Trebuie sa-ti setezi o parola noua inainte de a continua.
      </p>

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
        id="oldPassword"
        name="oldPassword"
        label="Current password"
        type="password"
        placeholder="Enter your current password"
        value={formData.oldPassword}
        onChange={handleChange}
      />

      <AuthFormField
        id="newPassword"
        name="newPassword"
        label="New password"
        type="password"
        placeholder="Enter your new password"
        value={formData.newPassword}
        onChange={handleChange}
      />

      <AuthFormField
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm new password"
        type="password"
        placeholder="Confirm your new password"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
      />

      <AuthSubmitButton disabled={isInactive || loading}>
        {loading ? "Changing password..." : "Change password"}
      </AuthSubmitButton>
    </AuthFormShell>
  )
}

export default ChangePassword
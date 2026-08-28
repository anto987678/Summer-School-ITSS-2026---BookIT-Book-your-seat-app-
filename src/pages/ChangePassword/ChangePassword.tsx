import AuthFormField from "@/components/auth/AuthFormField"
import AuthFormShell from "@/components/auth/AuthFormShell"
import AuthSubmitButton from "@/components/auth/AuthSubmitButton"
import { useFormData } from "@/hooks/useFormData"
import { Check, Eye, EyeOff } from "lucide-react"
import { useState, type ChangeEvent, type FormEvent } from "react"
import { useLocation, useNavigate } from "react-router-dom"

type ChangePasswordState = {
  email?: string
  oldPassword?: string
}

type PasswordRule = {
  label: string
  isValid: boolean
}

const ChangePassword = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as ChangePasswordState | null
  const resetToken = new URLSearchParams(location.search).get("token")
  const isResetFlow = location.pathname === "/reset-password"
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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

  const specialCharactersCount = (formData.newPassword.match(/[!@#$%&*]/g) || []).length
  const passwordsMatch = formData.newPassword !== "" && formData.newPassword === confirmPassword
  const passwordRules: PasswordRule[] = [
    { label: "Minim 10 caractere", isValid: formData.newPassword.length >= 10 },
    { label: "Cel putin 2 caractere speciale (!@#$%&*)", isValid: specialCharactersCount >= 2 },
    { label: "Parolele coincid", isValid: passwordsMatch },
  ]
  const isPasswordValid = passwordRules.every((rule) => rule.isValid)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!passwordsMatch) {
      setError("Parolele introduse nu coincid.")
      return
    }

    if (!isPasswordValid) {
      setError("Parola trebuie sa respecte toate conditiile.")
      return
    }

    if (isResetFlow && !resetToken) {
      setError("Tokenul de resetare lipseste sau linkul este invalid.")
      return
    }
    setLoading(true)

    try {
      const response = await fetch(
        isResetFlow ? "http://localhost:8080/reset-password" : "http://localhost:8080/change-password",
        {
          method: isResetFlow ? "POST" : "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            isResetFlow
              ? {
                  newPassword: formData.newPassword,
                  cNewPassword: confirmPassword,
                  token: resetToken,
                }
              : {
                  email: formData.email,
                  oldPassword: formData.oldPassword,
                  newPassword: formData.newPassword,
                },
          ),
        },
      )

      const message = await response.text()

      if (!response.ok) {
        setError(message || "Parola nu a putut fi modificata.")
        return
      }

      if (isResetFlow) {
        navigate("/login")
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
    (!isResetFlow && formData.email.trim() === "") ||
    (!isResetFlow && formData.oldPassword === "") ||
    formData.newPassword === "" ||
    confirmPassword === "" ||
    !isPasswordValid

  const renderPasswordToggle = (
    isVisible: boolean,
    onClick: () => void,
    label: string,
  ) => (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="text-[#6B7280] transition hover:text-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#DDD6FE]"
    >
      {isVisible ? <EyeOff size={22} /> : <Eye size={22} />}
    </button>
  )

  return (
    <AuthFormShell error={error} onClearError={() => setError("")} onSubmit={handleSubmit}>
      <h1 className="mb-4 text-center text-[36px] sm:text-[48px]">
        Change password
      </h1>

      <p className="text-center text-base text-[#6B7280] sm:text-[20px]">
        {isResetFlow ? "Seteaza o parola noua pentru contul tau." : "Trebuie sa-ti setezi o parola noua inainte de a continua."}
      </p>

      <AuthFormField
        id="newPassword"
        name="newPassword"
        label="Parola"
        type={showNewPassword ? "text" : "password"}
        placeholder="Introdu parola noua"
        value={formData.newPassword}
        onChange={handleChange}
        rightElement={renderPasswordToggle(
          showNewPassword,
          () => setShowNewPassword((current) => !current),
          showNewPassword ? "Ascunde parola" : "Arata parola",
        )}
      />

      <AuthFormField
        id="confirmPassword"
        name="confirmPassword"
        label="Confirmare parola"
        type={showConfirmPassword ? "text" : "password"}
        placeholder="Confirma parola noua"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        rightElement={renderPasswordToggle(
          showConfirmPassword,
          () => setShowConfirmPassword((current) => !current),
          showConfirmPassword ? "Ascunde confirmarea parolei" : "Arata confirmarea parolei",
        )}
      />

      <div className="space-y-2 rounded-lg border border-[#DDD6FE] bg-[#F8F5FF] p-4">
        {passwordRules.map((rule) => (
          <div
            key={rule.label}
            className={`flex items-center gap-2 text-sm font-medium ${
              rule.isValid ? "text-[#15803D]" : "text-[#6B7280]"
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                rule.isValid
                  ? "border-[#15803D] bg-[#DCFCE7]"
                  : "border-[#C4B5FD] bg-white"
              }`}
            >
              {rule.isValid && <Check size={14} strokeWidth={3} />}
            </span>
            {rule.label}
          </div>
        ))}
      </div>

      <AuthSubmitButton disabled={isInactive || loading}>
        {loading ? "Changing password..." : isResetFlow ? "Reset password" : "Change password"}
      </AuthSubmitButton>
    </AuthFormShell>
  )
}

export default ChangePassword

import AuthFormField from "@/components/auth/AuthFormField"
import AuthFormShell from "@/components/auth/AuthFormShell"
import AuthSubmitButton from "@/components/auth/AuthSubmitButton"
import { useEmailValidation } from "@/hooks/useEmailValidation"
import { useFormData } from "@/hooks/useFormData"
import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const { formData, handleChange } = useFormData(
    {
      email: "",
    },
    () => {
      setError("")
      setSuccessMessage("")
    },
  )

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setError("")
    setSuccessMessage("")
    setLoading(true)

    try {
      const response = await fetch(
        "http://localhost:8080/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email.trim(),
          }),
        }
      )

      const message = await response.text()

      if (!response.ok) {
        setError(
          message ||
            "Cererea de resetare a parolei nu a putut fi trimisă."
        )
        return
      }

      setSuccessMessage(
        message ||
          "Daca exista un cont asociat acestui email, vei primi instructiunile de resetare."
      );
    } catch {
      setError(
        "Nu am putut contacta serverul. Incearca din nou."
      );
    } finally {
      setLoading(false)
    }
  }

  const isValidEmail = useEmailValidation(formData.email)
  const isInactive = !isValidEmail || loading

  return (
    <AuthFormShell error={error} onClearError={() => setError("")} onSubmit={handleSubmit}>
      <h1 className="mb-2 text-center text-[32px] font-semibold sm:text-[40px]">
        Forgot your password?
      </h1>

      <p className="mb-4 text-center text-gray-500">
        Enter your email and we will send you password reset
        instructions.
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

      {successMessage && (
        <p className="text-sm text-green-700">
          {successMessage}
        </p>
      )}

      <AuthSubmitButton disabled={isInactive}>
        {loading ? "Sending..." : "Send reset link"}
      </AuthSubmitButton>

      <p className="mt-4 text-center text-base text-[#6B7280] sm:text-[20px]">
        Do you already have an account?
        <Link to="/login" className="text-[#6D28D9] font-semibold ml-1">
          Back to log in
        </Link>
      </p>
    </AuthFormShell>
  );
};

export default ForgotPassword;
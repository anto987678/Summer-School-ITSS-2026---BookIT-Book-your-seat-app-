import AuthFormField from "@/components/auth/AuthFormField"
import AuthFormShell from "@/components/auth/AuthFormShell"
import AuthSubmitButton from "@/components/auth/AuthSubmitButton"
import { useEmailValidation } from "@/hooks/useEmailValidation"
import { useFormData } from "@/hooks/useFormData"
import { CheckCircle2, Eye, EyeOff, XCircle } from "lucide-react"
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

type PasswordRule = {
  label: string
  isValid: boolean
}

const specialCharacterRegex = /[!@#$%&*]/g

const roleOptions = [
  { value: "CEO", label: "CEO" },
  { value: "MANAGER", label: "Manager" },
  { value: "PM", label: "Project Manager" },
  { value: "HR", label: "HR" },
  { value: "DEV", label: "Developer" },
  { value: "QA", label: "QA" },
  { value: "DESIGNER", label: "Designer" },
  { value: "DEVOPS", label: "DevOps" },
  { value: "INTERN", label: "Intern" },
]

const PasswordVisibilityButton = ({
  isVisible,
  onToggle,
  label,
}: {
  isVisible: boolean
  onToggle: () => void
  label: string
}) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={label}
    className="rounded-full p-1 text-[#6B7280] transition hover:bg-[#F5F3FF] hover:text-[#6D28D9]"
  >
    {isVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
  </button>
)

const PasswordRules = ({ rules }: { rules: PasswordRule[] }) => (
  <div className="-mt-2 space-y-1 rounded-lg bg-[#F5F3FF] px-3 py-2 text-sm">
    {rules.map((rule) => (
      <div
        key={rule.label}
        className={`flex items-center gap-2 font-medium ${rule.isValid ? "text-green-600" : "text-red-500"}`}
      >
        {rule.isValid ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
        <span>{rule.label}</span>
      </div>
    ))}
  </div>
)

const Register = (_props: RegisterProps) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)
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

  const specialCharactersCount = formData.password.match(specialCharacterRegex)?.length ?? 0
  const passwordsMatch = formData.password !== "" && formData.password === formData.repeatPassword

  const passwordRules: PasswordRule[] = [
    {
      label: "Minim 10 caractere",
      isValid: formData.password.length >= 10,
    },
    {
      label: "Cel putin 2 caractere speciale (!@#$%&*)",
      isValid: specialCharactersCount >= 2,
    },
    {
      label: "Parolele coincid",
      isValid: passwordsMatch,
    },
  ]

  const isPasswordValid = passwordRules.every((rule) => rule.isValid)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!isPasswordValid) {
      setError("Parola nu respecta toate regulile.")
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

      navigate("/login")
    } catch {
      setError(
        "Nu am putut contacta serverul. Incearca din nou.",
      )
    } finally {
      setLoading(false)
    }
  }

  const isValidEmail = useEmailValidation(formData.email)

  const isInactive =
    formData.name.trim() === "" ||
    !isValidEmail ||
    !isPasswordValid ||
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
        {roleOptions.map((role) => (
          <option key={role.value} value={role.value}>{role.label}</option>
        ))}
      </AuthFormField>

      <AuthFormField
        id="password"
        name="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        rightElement={
          <PasswordVisibilityButton
            isVisible={showPassword}
            onToggle={() => setShowPassword((current) => !current)}
            label={showPassword ? "Ascunde parola" : "Arata parola"}
          />
        }
      />

      <AuthFormField
        id="repeatPassword"
        name="repeatPassword"
        label="Repeat password"
        type={showRepeatPassword ? "text" : "password"}
        placeholder="Repeat your password"
        value={formData.repeatPassword}
        onChange={handleChange}
        rightElement={
          <PasswordVisibilityButton
            isVisible={showRepeatPassword}
            onToggle={() => setShowRepeatPassword((current) => !current)}
            label={showRepeatPassword ? "Ascunde parola repetata" : "Arata parola repetata"}
          />
        }
      />

      <PasswordRules rules={passwordRules} />

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
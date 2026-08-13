import type { ChangeEvent, ReactNode } from "react"

type AuthFormFieldProps = {
  id: string
  name: string
  label: string
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  type?: string
  placeholder?: string
  required?: boolean
  children?: ReactNode
  className?: string
}

const AuthFormField = ({
  id,
  name,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = true,
  children,
  className = "",
}: AuthFormFieldProps) => {
  const fieldClassName = `w-full rounded-lg border-2 border-[#DDD6FE] px-4 py-2 focus:border-[#6D28D9] focus:outline-none ${className}`.trim()

  return (
    <>
      <label htmlFor={id} className="text-[20px] sm:text-[24px]">
        {label}
      </label>

      {children ? (
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`bg-white ${fieldClassName}`}
        >
          {children}
        </select>
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={fieldClassName}
        />
      )}
    </>
  )
}

export default AuthFormField

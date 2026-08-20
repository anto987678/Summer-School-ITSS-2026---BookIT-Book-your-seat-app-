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
  rightElement?: ReactNode
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
  rightElement,
}: AuthFormFieldProps) => {
  const fieldClassName = `w-full rounded-lg border-2 border-[#DDD6FE] px-4 py-2 focus:border-[#6D28D9] focus:outline-none ${rightElement ? "pr-12" : ""} ${className}`.trim()

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
        <div className="relative">
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

          {rightElement && (
            <div className="absolute inset-y-0 right-3 flex items-center">
              {rightElement}
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default AuthFormField
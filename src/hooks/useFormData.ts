import { useState } from "react"
import type { ChangeEvent } from "react"

type FormFieldElement = HTMLInputElement | HTMLSelectElement

export function useFormData<T extends Record<string, string>>(
  initialData: T,
  onChange?: () => void,
) {
  const [formData, setFormData] = useState<T>(initialData)

  const handleChange = (event: ChangeEvent<FormFieldElement>) => {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))

    onChange?.()
  }

  return { formData, setFormData, handleChange }
}

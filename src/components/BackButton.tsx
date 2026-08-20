import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

type BackButtonProps = {
  fallbackTo?: string
  className?: string
}

const BackButton = ({ fallbackTo = "/", className = "" }: BackButtonProps) => {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate(fallbackTo)
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label="Inapoi"
      title="Inapoi"
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-[#29255E] transition hover:bg-gray-200 ${className}`}
    >
      <ArrowLeft className="h-6 w-6" aria-hidden="true" />
    </button>
  )
}

export default BackButton

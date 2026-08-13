import ModalBackdrop from "@/components/ui/ModalBackdrop"
import WarningIconCircle from "@/components/ui/WarningIconCircle"

type ErrorPopUpProps = {
  title: string
  message: string
  sideMessage?: string
  buttonText?: string
  onClose: () => void
}

const ErrorPopUp = ({ title, message, sideMessage, buttonText = "Try again", onClose }: ErrorPopUpProps) => {
  return (
    <ModalBackdrop>
      <div className="w-full max-w-xl rounded-[32px] border border-[#C4B5FD] bg-white px-6 py-8 text-center shadow-xl sm:rounded-[48px] sm:px-10 sm:py-10">
        <WarningIconCircle />

        <h2 className="mb-4 text-center text-2xl font-bold text-[#29255E] sm:text-[30px]">
          {title}
        </h2>

        <p className="mb-3 text-center text-base font-semibold text-[#29255E] sm:text-lg">
          {message}
        </p>

        {sideMessage && (
          <p className="mb-8 text-center text-sm text-[#6B7280]">
            {sideMessage}
          </p>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-full bg-[#F87171] px-6 py-4 text-lg font-semibold text-white transition hover:bg-red-500 sm:text-xl"
        >
          {buttonText}
        </button>
      </div>
    </ModalBackdrop>
  )
}

export default ErrorPopUp;
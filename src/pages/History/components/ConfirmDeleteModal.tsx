import ModalBackdrop from "@/components/ui/ModalBackdrop"
import WarningIconCircle from "@/components/ui/WarningIconCircle"

type ConfirmDeleteModalProps = {
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDeleteModal({ onConfirm, onCancel }: ConfirmDeleteModalProps) {
  return (
    <ModalBackdrop>
      <div className="w-[min(400px,calc(100vw-32px))] rounded-3xl bg-white p-6 text-center shadow-xl sm:p-8">
        <WarningIconCircle />

        <h3 className="mb-2 text-2xl font-bold text-[#29255E]">Esti sigur?</h3>
        <p className="mb-8 text-sm text-gray-500">
          Aceasta actiune va sterge definitiv rezervarea selectata.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-full bg-[#FF6B6B] py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-500"
          >
            Da, sterge
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-full border-2 border-[#6D28D9] py-3 text-sm font-bold text-[#6D28D9] transition hover:bg-purple-50"
          >
            Anuleaza
          </button>
        </div>
      </div>
    </ModalBackdrop>
  )
}
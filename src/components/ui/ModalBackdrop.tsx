import type { ReactNode } from "react"

type ModalBackdropProps = {
  children: ReactNode
}

const ModalBackdrop = ({ children }: ModalBackdropProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#29255E]/50 p-4 backdrop-blur-sm">
      {children}
    </div>
  )
}

export default ModalBackdrop

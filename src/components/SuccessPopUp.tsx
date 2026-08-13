import ModalBackdrop from "@/components/ui/ModalBackdrop"

type SuccessPopUpProps = {
    title: string
    message?: string
    sideMessage?: string
    highlightedText?: string
    buttonText?: string
    onClose: () => void
}

const SuccessPopUp = ({
    title,
    message,
    sideMessage,
    highlightedText,
    buttonText = "OK, am inteles",
    onClose
}: SuccessPopUpProps) => {
    return (
        <ModalBackdrop>
            <div className="w-full max-w-xl rounded-[32px] border border-[#C4B5FD] bg-white px-6 py-8 text-center shadow-xl sm:rounded-[48px] sm:px-10 sm:py-10">

                <div className="mx-auto mb-6 flex h-[100px] w-[100px] items-center justify-center rounded-full bg-[#ECFDF5]">
                    <svg
                        width="50"
                        height="50"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>

                <h2 className="mb-4 text-center text-xl font-bold text-[#29255E] sm:text-2xl">
                    {title}
                </h2>

                {message && (
                    <p className="mb-3 text-center text-base font-semibold text-[#29255E] sm:text-lg">
                        {message}
                    </p>
                )}

                {(sideMessage || highlightedText) && (
                    <div className="mb-8 flex flex-col text-center text-sm font-medium text-[#6B7280]">
                        {sideMessage && <span>{sideMessage}</span>}
                        {highlightedText && (
                            <span className="mt-1 font-bold text-[#10B981] uppercase tracking-wide">
                                {highlightedText}
                            </span>
                        )}
                    </div>
                )}

                <button
                    type="button"
                    onClick={onClose}
                    className="mt-4 w-full rounded-full bg-[#6D28D9] px-6 py-4 text-lg font-bold text-white transition hover:bg-[#5B21B6] sm:text-xl shadow-md"
                >
                    {buttonText}
                </button>

            </div>
        </ModalBackdrop>
    )
}

export default SuccessPopUp
type AuthSubmitButtonProps = {
  disabled: boolean
  children: string
}

const AuthSubmitButton = ({ disabled, children }: AuthSubmitButtonProps) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`mt-4 rounded-lg p-2 text-[20px] font-semibold transition-colors sm:text-[24px] ${
        disabled
          ? "cursor-not-allowed bg-[#DDD6FE] text-[#6B7280]"
          : "bg-[#6D28D9] text-white hover:bg-[#5B21B6]"
      }`}
    >
      {children}
    </button>
  )
}

export default AuthSubmitButton

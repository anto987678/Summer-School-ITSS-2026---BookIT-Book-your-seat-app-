import BackButton from "@/components/BackButton"
import ErrorPopUp from "@/components/ErrorPopUp"
import type { FormEvent, ReactNode } from "react"

type AuthFormShellProps = {
  error: string
  onClearError: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  children: ReactNode
}

const AuthFormShell = ({ error, onClearError, onSubmit, children }: AuthFormShellProps) => {
  return (
    <div className="flex min-h-[calc(100vh-72px)] flex-col bg-[#F5F3FF] px-4 py-4 sm:px-6">
      {error && (
        <ErrorPopUp
          title="Something went wrong"
          message={error}
          sideMessage="Please check the details and try again."
          onClose={onClearError}
        />
      )}

      <div className="mx-auto w-full max-w-7xl">
        <BackButton />
      </div>

      <div className="flex flex-1 items-center justify-center py-4">
        <form
          onSubmit={onSubmit}
          className="flex w-full max-w-md flex-col gap-4 rounded-xl border-2 border-[#DDD6FE] bg-white p-5 text-[#1E1B4B] sm:p-8"
        >
          {children}
        </form>
      </div>
    </div>
  )
}

export default AuthFormShell

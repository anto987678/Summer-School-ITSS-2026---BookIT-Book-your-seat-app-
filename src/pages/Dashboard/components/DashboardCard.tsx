import type { ReactNode } from "react"

type DashboardCardProps = {
  title: string
  children: ReactNode
  action?: ReactNode
  className?: string
}

export default function DashboardCard({ title, children, action, className = "" }: DashboardCardProps) {
  return (
    <div className={`rounded-2xl bg-white p-5 shadow-sm sm:p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#29255E]">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  )
}
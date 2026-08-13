import { Link } from "react-router-dom"

type SidebarNavItemProps = {
  to: string
  icon: string
  label: string
  isExtended: boolean
}

const SidebarNavItem = ({ to, icon, label, isExtended }: SidebarNavItemProps) => {
  return (
    <div className="mt-10 flex justify-center">
      <Link
        to={to}
        className={`flex items-center justify-center gap-3 rounded-[18px] px-3 py-3 transition-all hover:bg-[#7C3AED] ${
          isExtended ? "w-[calc(100%-24px)]" : ""
        }`}
      >
        <img src={icon} alt={label} className="h-8 w-8 sm:h-10 sm:w-10" />

        {isExtended && (
          <span className="whitespace-nowrap text-[20px] text-white sm:text-[24px]">
            {label}
          </span>
        )}
      </Link>
    </div>
  )
}

export default SidebarNavItem
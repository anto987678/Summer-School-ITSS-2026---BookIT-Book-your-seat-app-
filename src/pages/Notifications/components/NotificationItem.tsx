export type NotificationStatus = "pending" | "accepted" | "declined"

export type Notification = {
  id: number;
  invitationId?: number;
  message: string;
  date: string;
  startTime: string;
  endTime: string;
  status: NotificationStatus;
  isRead: boolean;
  colleagueName?: string;
  seatCode?: string;
  roomName?: string;
  floorName?: string;
};

type NotificationItemProps = {
  notification: Notification
  formattedDate: string
  onAccept: (notification: Notification) => void
  onDecline: (notificationId: number) => void
}

export default function NotificationItem({
  notification,
  formattedDate,
  onAccept,
  onDecline,
}: NotificationItemProps) {
  return (
    <div className="flex w-full flex-col gap-4 rounded-[32px] border border-[#DDD6FE] bg-[#EDE9FE] px-5 py-4 shadow-sm md:flex-row md:items-center md:rounded-[60px] md:px-10 md:py-3">
      <div>
        <h2 className="text-base font-bold text-[#29255E] sm:text-xl">
          {notification.message}
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          {formattedDate}, {notification.startTime}-{notification.endTime}
        </p>
        <p className="mt-1 text-sm text-gray-600">
          Loc: {notification.seatCode ?? "-"}
          {notification.roomName ? `, sala ${notification.roomName}` : ""}
          {notification.floorName ? `, etaj ${notification.floorName}` : ""}
        </p> 
      </div>

      {notification.status === "pending" && (
        <div className="flex w-full flex-wrap items-center gap-3 md:ml-auto md:w-auto md:gap-4">
          <button
            type="button"
            onClick={() => onAccept(notification)}
            className="rounded-[60px] bg-[#6D28D9] px-5 py-2 font-bold text-white hover:bg-[#5B21B6] sm:px-8"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={() => onDecline(notification.id)}
            className="rounded-[60px] border border-[#6D28D9] bg-white px-5 py-2 font-bold text-[#6D28D9] hover:bg-[#F5F3FF] sm:px-8"
          >
            Decline
          </button>
        </div>
      )}

      {notification.status === "accepted" && (
        <span className="font-bold text-green-600 md:ml-auto">Reserved</span>
      )}

      {notification.status === "declined" && (
        <span className="font-bold text-[#F87171] md:ml-auto">Declined</span>
      )}
    </div>
  )
}
import BackButton from "@/components/BackButton";
import AIAssistant from "@/pages/AIAssistant";
import { useRef, useState } from "react";
import { Bell } from "lucide-react";
import NotificationItem, { type Notification } from "./components/NotificationItem";

export const initialNotifications: Notification[] = [
  {
    id: 1,
    message: "Andrei invited you to book a seat together.",
    date: "2026-08-05",
    startTime: "09:00",
    endTime: "17:00",
    status: "pending",
    isRead: false,
  },
  {
    id: 2,
    message: "Your colleagues are coming to the office.",
    date: "2026-10-09",
    startTime: "09:00",
    endTime: "17:00",
    status: "pending",
    isRead: false,
  },
  {
    id: 3,
    message: "Your colleagues are coming to the office.",
    date: "2026-10-25",
    startTime: "09:00",
    endTime: "17:00",
    status: "pending",
    isRead: false,
  },
  {
    id: 4,
    message: "Your colleagues are coming to the office.",
    date: "2026-10-25",
    startTime: "09:00",
    endTime: "17:00",
    status: "pending",
    isRead: false,
  },
]

type NotificationsProps = {
  onNotificationRemoved?: () => void;
};

const Notifications = ({ onNotificationRemoved }: NotificationsProps) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const scheduledRemovalIds = useRef<Set<number>>(new Set());

  const removeNotification = (
    notificationId: number,
    delay = 1000
  ) => {
    if (scheduledRemovalIds.current.has(notificationId)) {
      return;
    }

    scheduledRemovalIds.current.add(notificationId);

    setTimeout(() => {
      setNotifications((previousNotifications) =>
        previousNotifications.filter(
          (notification) => notificationId !== notification.id
        )
      );

      onNotificationRemoved?.();
    }, delay)
  }

  const handleAccept = (notification: Notification) => {
    setNotifications((previousNotifications) =>
      previousNotifications.map((item) =>
        item.id === notification.id
          ? {
              ...item,
              status: "accepted",
              isRead: true,
            }
          : item,
      ),
    )

    removeNotification(notification.id)
  }

  const handleDecline = (notificationId: number) => {
    setNotifications((previousNotifications) =>
      previousNotifications.map((item) =>
        item.id === notificationId
          ? {
              ...item,
              status: "declined",
              isRead: true,
            }
          : item,
      ),
    )

    removeNotification(notificationId)
  }

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("ro-RO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(`${date}T00:00:00`))
  }

  return (
    <div className="min-h-full gap-10 p-4 sm:p-6">
      <BackButton className="mb-6" fallbackTo="/dashboard" />

      <div className="flex w-fit items-center gap-3 rounded-[60px] border border-[#DDD6FE] bg-[#EDE9FE] px-6 py-3 shadow-sm">
        <h4 className="text-base font-bold text-[#29255E] sm:text-xl">Notifications</h4>
        <Bell />
      </div>

      <div className="mt-10 flex flex-col gap-4">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            formattedDate={formatDate(notification.date)}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        ))}
      </div>

      <AIAssistant />
    </div>
  )
}

export default Notifications;


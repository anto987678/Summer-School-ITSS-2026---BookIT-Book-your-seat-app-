import BackButton from "@/components/BackButton";
import ErrorPopUp from "@/components/ErrorPopUp";
import AIAssistant from "@/pages/AIAssistant";
import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import NotificationItem, { type Notification } from "./components/NotificationItem";

type NotificationApi = {
  id: number;
  message: string;
  type: string;
  read: boolean;
  invitation?: {
    id: number;
    senderId: {
      name: string;
    };
    seatId: {
      code: string;
      room?: {
        name: string;
        code: string;
        floor_id?: {
          name: string;
        };
      };
    };
    startDateTime: string;
    endDateTime: string;
    status: string;
  };
};

type NotificationsProps = {
  onNotificationRemoved?: () => void;
};

const Notifications = ({ onNotificationRemoved }: NotificationsProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const scheduledRemovalIds = useRef<Set<number>>(new Set());
  const { user } = useCurrentUser();

  useEffect(() => {
    if (!user.postgresUserId) return;

    fetch(`http://localhost:8080/api/notifications/user/${user.postgresUserId}`, {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Nu s-au putut incarca notificarile.");
        }

        return response.json();
      })
      .then((data: NotificationApi[]) => {
        setNotifications(
          data.map((notification) => {
            const invitation = notification.invitation;

            return {
              id: notification.id,
              invitationId: invitation?.id,
              message:
                notification.message ||
                `${invitation?.senderId.name ?? "Un coleg"} te-a invitat la birou.`,
              date: invitation?.startDateTime.slice(0, 10) ?? "",
              startTime: invitation?.startDateTime.slice(11, 16) ?? "",
              endTime: invitation?.endDateTime.slice(11, 16) ?? "",
              status: "pending" as const,
              isRead: notification.read,
              colleagueName: invitation?.senderId.name,
              seatCode: invitation?.seatId.code,
              roomName: invitation?.seatId.room?.name,
              floorName: invitation?.seatId.room?.floor_id?.name,
            };
          })
        );
      })
      .catch(() => {
        setNotifications([]);
        setErrorMessage("Nu s-au putut incarca notificarile. Verifica daca backend-ul ruleaza.");
      });
  }, [user.postgresUserId]);

  const removeNotification = (notificationId: number, delay = 1000) => {
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
    }, delay);
  };

  const handleAccept = async (notification: Notification) => {
    if (!notification.invitationId) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/invitations/${notification.invitationId}/accept`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Nu s-a putut accepta invitatia.");
      }

      setNotifications((previousNotifications) =>
        previousNotifications.map((item) =>
          item.id === notification.id
            ? {
                ...item,
                status: "accepted",
                isRead: true,
              }
            : item
        )
      );

      removeNotification(notification.id);
    } catch {
      setErrorMessage("Nu s-a putut accepta invitatia. Verifica daca backend-ul ruleaza.");
    }
  };

  const handleDecline = async (notificationId: number) => {
    const notification = notifications.find((item) => item.id === notificationId);

    if (!notification?.invitationId) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/invitations/${notification.invitationId}/decline`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Nu s-a putut refuza invitatia.");
      }

      setNotifications((previousNotifications) =>
        previousNotifications.map((item) =>
          item.id === notificationId
            ? {
                ...item,
                status: "declined",
                isRead: true,
              }
            : item
        )
      );

      removeNotification(notificationId);
    } catch {
      setErrorMessage("Nu s-a putut refuza invitatia. Verifica daca backend-ul ruleaza.");
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "";

    return new Intl.DateTimeFormat("ro-RO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
  };

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

      {errorMessage && (
        <ErrorPopUp
          title="Eroare"
          message={errorMessage}
          buttonText="Inchide"
          onClose={() => setErrorMessage("")}
        />
      )}

      <AIAssistant />
    </div>
  );
};

export default Notifications;
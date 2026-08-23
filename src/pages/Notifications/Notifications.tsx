import BackButton from "@/components/BackButton";
import ErrorPopUp from "@/components/ErrorPopUp";
import AIAssistant from "@/pages/AIAssistant";
import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import NotificationItem, { type Notification } from "./components/NotificationItem";

type NotificationSeatApi = {
  code: string;
  room?: {
    name: string;
    code: string;
    floor_id?: {
      name: string;
    };
  };
};

type NotificationRoomApi = {
  name: string;
  code: string;
  floor_id?: {
    name: string;
  };
};

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
    seatId: NotificationSeatApi;
    startDateTime: string;
    endDateTime: string;
    status: string;
  };
  reservation?: {
    id: number;
    seat?: NotificationSeatApi;
    room?: NotificationRoomApi;
    startDateTime: string;
    endDateTime: string;
    status: string;
  } | null;
};

type NotificationsProps = {
  onNotificationRemoved?: () => void;
};

const getNotificationStartDateTime = (notification: NotificationApi) =>
  notification.invitation?.startDateTime ?? notification.reservation?.startDateTime;

const isCurrentOrFutureNotification = (notification: NotificationApi) => {
  const startDateTime = getNotificationStartDateTime(notification);

  if (!startDateTime) {
    return true;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const notificationDate = new Date(startDateTime);
  notificationDate.setHours(0, 0, 0, 0);

  return notificationDate >= today;
};

const mapNotificationStatus = (notification: NotificationApi) => {
  const invitationStatus = notification.invitation?.status?.toLowerCase();

  if (invitationStatus === "accepted") return "accepted" as const;
  if (invitationStatus === "declined") return "declined" as const;

  return "pending" as const;
};

const Notifications = ({ onNotificationRemoved }: NotificationsProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const scheduledRemovalIds = useRef<Set<number>>(new Set());
  const { user } = useCurrentUser();

  useEffect(() => {
    if (!user.postgresUserId) return;

    fetch("http://localhost:8080/api/notifications/me/unread", {
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
          data
            .filter(isCurrentOrFutureNotification)
            .filter((notification) => notification.type !== "COLLEAGUES_COMING" || notification.reservation != null)
            .map((notification) => {
              const invitation = notification.invitation;
              const reservation = notification.reservation;
              const sourceSeat = invitation?.seatId ?? reservation?.seat;
              const sourceRoom = sourceSeat?.room ?? reservation?.room;
              const startDateTime = invitation?.startDateTime ?? reservation?.startDateTime ?? "";
              const endDateTime = invitation?.endDateTime ?? reservation?.endDateTime ?? "";

              return {
                id: notification.id,
                type: notification.type,
                invitationId: invitation?.id,
                message:
                  notification.message ||
                  `${invitation?.senderId.name ?? "Un coleg"} te-a invitat la birou.`,
                date: startDateTime.slice(0, 10),
                startTime: startDateTime.slice(11, 16),
                endTime: endDateTime.slice(11, 16),
                status: mapNotificationStatus(notification),
                isRead: notification.read,
                colleagueName: invitation?.senderId.name,
                seatCode: sourceSeat?.code,
                roomName: sourceRoom?.name,
                floorName: sourceRoom?.floor_id?.name,
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
    const isInvitationNotification = notification.invitationId !== undefined;
    const url = isInvitationNotification
      ? `http://localhost:8080/api/invitations/${notification.invitationId}/accept`
      : `http://localhost:8080/api/notifications/${notification.id}/accept`;

    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Nu s-a putut accepta invitatia.");
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
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Nu s-a putut accepta invitatia.");
    }
  };

  const handleDecline = async (notificationId: number) => {
    const notification = notifications.find((item) => item.id === notificationId);
    if (!notification) return;

    const isInvitationNotification = notification.invitationId !== undefined;
    const url = isInvitationNotification
      ? `http://localhost:8080/api/invitations/${notification.invitationId}/decline`
      : `http://localhost:8080/api/notifications/${notification.id}/decline`;

    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Nu s-a putut refuza invitatia.");
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
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Nu s-a putut refuza invitatia.");
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

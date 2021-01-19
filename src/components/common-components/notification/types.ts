export type NotificationType = "success" | "error";

export interface Notification {
  id?: number;
  type: NotificationType;
  message: string;
  duration?: number;
}

export interface NotificationContextValues {
  notifications: Notification[];
  createNotification: (notification: Notification) => void;
  deleteNotification: (id: number) => void;
}

export type NotificationTimeout = {
  id: number;
  timeout: NodeJS.Timeout;
};

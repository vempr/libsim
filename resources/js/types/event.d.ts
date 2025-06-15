import { MessageEager, Notification } from '.';

export interface NotificationEvent {
  notification: Notification;
}

export interface MessageEvent {
  message: MessageEager;
}

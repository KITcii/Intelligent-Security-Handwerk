package ish.user.service.notification;

import ish.user.model.User;

public interface NotificationService {

    void sendNotification(User recipient, NotificationType type, String token) throws NotificationException;
}

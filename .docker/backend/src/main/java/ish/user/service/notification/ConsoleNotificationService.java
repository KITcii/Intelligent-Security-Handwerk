package ish.user.service.notification;

import ish.user.model.User;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(prefix = "ish.notification", name = "service", havingValue = "console", matchIfMissing = true)
@CommonsLog
public class ConsoleNotificationService implements NotificationService {

    @Override
    public void sendNotification(User recipient, NotificationType type, String token) throws NotificationException {
        log.info(recipient.getMail() + " requested token: " + token);
    }
}

package ish.user.service.notification;

import ish.user.model.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.HashMap;
import java.util.Map;

@Service
@ConditionalOnProperty(prefix = "ish.notification", name = "service", havingValue = "mail")
@CommonsLog
@AllArgsConstructor
public class MailNotificationService implements NotificationService  {

    // noreply@baeldung.com
    @Value("${spring.mail.username}")
    private String sender;

    @Value("${ish.app.host}")
    private String appHost;

    private JavaMailSender emailSender;

    private TemplateEngine templateEngine;

    // https://www.baeldung.com/spring-email
    @Override
    public void sendNotification(User recipient, NotificationType type, String token) throws NotificationException {
        sendMail(recipient, type, token);
    }

    // method must be public for @Async to work
    @Async("mailExecutor")
    public void sendMail(User recipient, NotificationType type, String token) throws NotificationException {
        Map<String, Object> variables = new HashMap<>();
        variables.put("name", recipient.getFirstName() + " " + recipient.getLastName());
        variables.put("token", token);

        // Generate email content using Thymeleaf
        String text = switch (type) {
            case VERIFICATION -> {
                variables.put("url", "https://" + appHost + "/auth/verify?token=" + token);
                yield generateEmailContent("mail-verification", variables);
            }
            case INVITE -> {
                variables.put("url", "https://" + appHost + "/auth/initialize?token=" + token);
                yield generateEmailContent("password-setup", variables);
            }
            case PASSWORD_RESET -> {
                variables.put("url", "https://" + appHost + "/auth/reset?token=" + token);
                yield generateEmailContent("password-reset", variables);
            }
        };

        /*
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom(sender);
        mail.setTo(recipient.getMail());
        mail.setSubject(type.name());
         */

        MimeMessage mail = emailSender.createMimeMessage();
        MimeMessageHelper helper = null;
        try {
            helper = new MimeMessageHelper(mail, true);
            helper.setFrom(sender);
            helper.setTo(recipient.getMail());
            helper.setSubject(type.name());
            helper.setText(text, true);
        } catch (MessagingException e) {
            log.error(e.getMessage());
            throw new NotificationException("Creating mail failed!", e);
        }

        try {
            log.info(recipient.getMail() + " requested token: " + token);
            emailSender.send(mail);
        } catch (MailException e) {
            log.error(e.getMessage());
            throw new NotificationException("Sending mail notification failed!", e);
        }
    }

    private String generateEmailContent(String templateName, Map<String, Object> variables) {
        Context context = new Context();
        context.setVariables(variables);
        return templateEngine.process("emails/" + templateName, context);
    }
}

package com.oet.application.usecases.manageNotification.service;

import com.oet.application.common.MailService;
import com.oet.application.usecases.manageNotification.constant.NotificationEventType;
import com.oet.application.usecases.manageNotification.entity.UserNotification;
import lombok.AllArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Component;

import static com.oet.application.usecases.manageNotification.constant.NotificationEventType.*;

@EnableAsync
@AllArgsConstructor
@Component
public class NotificationListener {
    private final MailContentBuilder mailContentBuilder;
    private final MailService mailService;

    @Async
    @EventListener
    public void eventListener(UserNotification userNotification) {
        String message;
        if (userNotification.getNotification().getEventType().equals(NEW_ASSIGNMENT)) {
           message = mailContentBuilder.generateMailContentForNewAssignment(userNotification);
        }
        else if (userNotification.getNotification().getEventType().equals(ASSIGNMENT_COMPLETED)) {
           message = mailContentBuilder.generateMailContentForAssignmentCompleted(userNotification);
        }
        else if (userNotification.getNotification().getEventType().equals(NEW_FEEDBACK)) {
           message = mailContentBuilder.generateMailContentForNewFeedback(userNotification);
        }
        else {
           throw new IllegalStateException("Unexpected value: " + userNotification.getNotification().getEventType());
        }

        String mailAddress = userNotification.getUser().getEmailAddress();

        if (!mailAddress.isEmpty()) {
            mailService.sendComplexMail(mailAddress, userNotification.getNotification().getCreatedBy(), userNotification.getNotification().getEventType().toString(), message);
        }
    }
}

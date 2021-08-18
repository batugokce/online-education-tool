package com.oet.application.usecases.manageNotification.service;

import com.oet.application.usecases.manageNotification.entity.UserNotification;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class MailContentBuilder {

    private final TemplateEngine templateEngine;

    public String generateMailContentForAssignmentCompleted(UserNotification userNotification) {
        Context context = new Context();
        context.setVariable("name", userNotification.getUser().getName());
        context.setVariable("date", new Date(System.currentTimeMillis()));
        context.setVariable("username", userNotification.getNotification().getCreatedBy());
        context.setVariable("title", userNotification.getNotification().getAssignmentTitle());

        return templateEngine.process("mailTemplateForAssignmentCompleted.html", context);
    }

    public String generateMailContentForNewAssignment(UserNotification userNotification) {
        Context context = new Context();
        context.setVariable("name", userNotification.getUser().getName());
        context.setVariable("date", new Date(System.currentTimeMillis()));
        context.setVariable("title", userNotification.getNotification().getAssignmentTitle());

        return templateEngine.process("mailTemplateForNewAssignment.html", context);
    }

    public String generateMailContentForNewFeedback(UserNotification userNotification) {
        Context context = new Context();
        context.setVariable("name", userNotification.getUser().getName());
        context.setVariable("date", new Date(System.currentTimeMillis()));
        context.setVariable("username", userNotification.getNotification().getCreatedBy());
        context.setVariable("title", userNotification.getNotification().getAssignmentTitle());

        return templateEngine.process("mailTemplateForNewFeedback.html", context);
    }
}

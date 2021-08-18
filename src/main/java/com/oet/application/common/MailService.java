package com.oet.application.common;


import com.oet.application.entity.Student;
import com.oet.application.entity.Instructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.springframework.mail.javamail.JavaMailSender;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import java.util.List;

import static com.oet.application.common.LogMessages.L_NOTIFICATION_MAIL_SENT;

@Component
@RequiredArgsConstructor
@Slf4j
public class MailService {
    private final JavaMailSender emailSender = EmailConfig.getJavaMailSender();

    //Template for student
    public SimpleMailMessage mail_template(Student student,String password) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(student.getEmailAddress());
        msg.setSubject("New Password");
        msg.setText("Your student account has been activated.\n Your password is: " + password );
        return msg;
    }
    public SimpleMailMessage mail_template(Instructor student,String password) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(student.getEmailAddress());
        msg.setSubject("New Password");
        msg.setText("Your instructor account has been activated.\n Your password is: " + password );
        return msg;
    }
    public SimpleMailMessage forgot_password_template(String token,String email){
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(email);
        msg.setFrom("OET");
        msg.setSubject("Password Change Request");
        msg.setText("To change your password click\n"+ "http://localhost:8080/#/change-password/"+token);
        return msg;
    }

    public void sendComplexMail(String to, String from, String subject, String text) {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper;
        try {
            helper = new MimeMessageHelper(message, true);

            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text,true);

            emailSender.send(message);

            log.info(String.format(L_NOTIFICATION_MAIL_SENT, to, subject));

        } catch (MessagingException e) {
            log.error(e.getMessage());
        }
    }

}

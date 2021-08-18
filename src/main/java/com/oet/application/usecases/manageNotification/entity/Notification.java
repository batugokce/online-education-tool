package com.oet.application.usecases.manageNotification.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.oet.application.common.BaseEntity;
import com.oet.application.usecases.manageNotification.constant.NotificationEventType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
@SequenceGenerator(name = "idGenerator", sequenceName = "notification_sequence")
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Notification extends BaseEntity {

    @Column(name = "EVENT_TYPE")
    private NotificationEventType eventType;

    @Column(name = "CREATED_DATE")
    private LocalDateTime createdDate;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "ASSIGMENT_TITLE")
    private String assignmentTitle;

    @OneToMany(mappedBy = "notification")
    @JsonIgnore
    private Set<UserNotification> userNotifications = new HashSet<>();

    public String convertToHTML() {
        DateTimeFormatter format = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");
        String formattedDateTime = createdDate.format(format);
        if(eventType.equals(NotificationEventType.ASSIGNMENT_COMPLETED)) {
            return "The student with username " + createdBy + " has completed the assignment\n" +
                    "    with title " + assignmentTitle + "\n" +
                    "    on " + formattedDateTime;
        } else if(eventType.equals(NotificationEventType.NEW_ASSIGNMENT)) {
            return "New assignment with the title "+ assignmentTitle +" is uploaded on\n" +
                    formattedDateTime;
        } else if(eventType.equals(NotificationEventType.NEW_FEEDBACK)) {

            return "Your instructor "+ createdBy +" has given feedback for your assignment\n" +
                    "  with title " + assignmentTitle + " on\n" +
                    formattedDateTime ;
        } else{
            return "";
        }
    }

}

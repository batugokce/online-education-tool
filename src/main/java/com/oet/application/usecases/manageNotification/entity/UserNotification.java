package com.oet.application.usecases.manageNotification.entity;

import com.oet.application.common.PersonEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class UserNotification {

    @EmbeddedId
    private UserNotificationId id = new UserNotificationId();

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "USER_ID")
    private PersonEntity user;

    @ManyToOne
    @MapsId("notificationId")
    @JoinColumn(name = "NOTIFICATION_ID")
    private Notification notification;

    private Boolean isRead = false; // hold whether the notification is seen by the user or not

}

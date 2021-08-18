package com.oet.application.usecases.manageNotification.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Getter
@Setter
public class UserNotificationId implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long notificationId;
    private Long userId;

    public UserNotificationId() {

    }

    public UserNotificationId(Long notificationId, Long userId) {
        super();
        this.notificationId = notificationId;
        this.userId = userId;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result
                + ((notificationId == null) ? 0 : notificationId.hashCode());
        result = prime * result
                + ((userId == null) ? 0 : userId.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        UserNotificationId other = (UserNotificationId) obj;
        return Objects.equals(getNotificationId(), other.getNotificationId()) && Objects.equals(getUserId(), other.getUserId());
    }
}

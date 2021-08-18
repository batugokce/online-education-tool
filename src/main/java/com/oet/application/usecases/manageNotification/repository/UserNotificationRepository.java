package com.oet.application.usecases.manageNotification.repository;

import com.oet.application.usecases.manageNotification.entity.Notification;
import com.oet.application.usecases.manageNotification.entity.UserNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserNotificationRepository extends JpaRepository<UserNotification,Long> {
}

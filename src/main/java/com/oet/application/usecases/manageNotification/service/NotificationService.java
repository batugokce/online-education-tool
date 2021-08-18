package com.oet.application.usecases.manageNotification.service;

import com.oet.application.common.CommonMessages;
import com.oet.application.common.ResponseTemplate;
import com.oet.application.entity.Instructor;
import com.oet.application.entity.Student;
import com.oet.application.service.InstructorService;
import com.oet.application.service.StudentService;
import com.oet.application.usecases.manageNotification.constant.NotificationEventType;
import com.oet.application.usecases.manageNotification.entity.Notification;
import com.oet.application.usecases.manageNotification.entity.UserNotification;
import com.oet.application.usecases.manageNotification.repository.NotificationRepository;
import com.oet.application.usecases.manageNotification.repository.UserNotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.oet.application.common.CommonMessages.ERROR;
import static com.oet.application.usecases.manageNotification.constant.NotificationEventType.*;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final StudentService studentService;
    private final InstructorService instructorService;

    private final NotificationRepository notificationRepository;
    private final UserNotificationRepository userNotificationRepository;

    private final ApplicationEventPublisher publisher;


    public Notification createNotification(String username, String assignmentTitle, NotificationEventType eventType) {
        if (username == null) {
            return null;
        }
        Notification notification = new Notification();
        notification.setEventType(eventType);
        notification.setCreatedBy(username);
        notification.setCreatedDate(LocalDateTime.now());
        notification.setAssignmentTitle(assignmentTitle);
        notificationRepository.save(notification);

        return notification;
    }

    // give receiver info as either classId or username
    public void addAndSaveUserNotificationsByEventType(Notification notification, List<Student> studentList, Set<Instructor> instructors, Long classId, String receiverUsername) {
        if (notification.getEventType().equals(NEW_ASSIGNMENT) && classId != null) {
            if (studentList != null && !studentList.isEmpty()) {
                studentList.forEach(student -> {
                    UserNotification userNotification = new UserNotification();
                    userNotification.setUser(student);
                    userNotification.setNotification(notification);

                    notification.getUserNotifications().add(userNotification);
                    student.getUserNotifications().add(userNotification);
                    userNotificationRepository.save(userNotification);

                    publisher.publishEvent(userNotification);
                });
            }
        } else if (notification.getEventType().equals(ASSIGNMENT_COMPLETED) && receiverUsername != null) {
            Instructor instructor = instructorService.findByUsername(receiverUsername);

            if(instructor != null) {
                UserNotification userNotification = new UserNotification();
                userNotification.setUser(instructor);
                userNotification.setNotification(notification);

                notification.getUserNotifications().add(userNotification);
                instructor.getUserNotifications().add(userNotification);
                userNotificationRepository.save(userNotification);

                publisher.publishEvent(userNotification);
            }

        } else if (notification.getEventType().equals(ASSIGNMENT_COMPLETED) && classId != null) {
            if(instructors != null && !instructors.isEmpty()) {
                instructors.forEach(instructor -> {
                    UserNotification userNotification = new UserNotification();
                    userNotification.setUser(instructor);
                    userNotification.setNotification(notification);

                    notification.getUserNotifications().add(userNotification);
                    instructor.getUserNotifications().add(userNotification);
                    userNotificationRepository.save(userNotification);

                    publisher.publishEvent(userNotification);
                });
            }

        } else if (notification.getEventType().equals(NEW_FEEDBACK) && receiverUsername != null) {
            Student student = studentService.findByUsername(receiverUsername);

            if(student != null) {
                UserNotification userNotification = new UserNotification();
                userNotification.setUser(student);
                userNotification.setNotification(notification);

                notification.getUserNotifications().add(userNotification);
                student.getUserNotifications().add(userNotification);
                userNotificationRepository.save(userNotification);

                publisher.publishEvent(userNotification);
            }
        }
    }

    public ResponseEntity<ResponseTemplate> getUnreadStudentNotifications(String username) {
        Student student = studentService.findByUsername(username);
        return getUnreadNotifications(student != null, student.getUserNotifications());
    }


    public ResponseEntity<ResponseTemplate> getUnreadInstructorNotifications(String username) {
        Instructor instructor = instructorService.findByUsername(username);
        return getUnreadNotifications(instructor != null, instructor.getUserNotifications());
    }

    private ResponseEntity<ResponseTemplate> getUnreadNotifications(boolean b, Set<UserNotification> userNotifications) {
        if(b) {
            if (userNotifications!=null) {
                List<Notification> unreadNotifications = userNotifications.stream().filter(userNotification -> !userNotification.getIsRead()).map(UserNotification::getNotification).collect(Collectors.toList());
                //List<String> notifications = unreadNotifications.stream().map(Notification::convertToHTML).collect(Collectors.toList());
                return ResponseEntity
                        .ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.UNREAD_NOTIFICATIONS_RETRIEVED, unreadNotifications));
            } else {
                return ResponseEntity
                        .ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.UNREAD_NOTIFICATIONS_RETRIEVED, null));
            }
        } else {
            return ResponseEntity
                    .ok(new ResponseTemplate(ERROR, CommonMessages.USER_NOT_FOUND, null));
        }
    }

    public ResponseEntity<ResponseTemplate> getUnreadInstructorNotificationsLength(String username) {
        Instructor instructor = instructorService.findByUsername(username);
        return getUnreadNotificationsLength(instructor != null, instructor.getUserNotifications());
    }

    public ResponseEntity<ResponseTemplate> getUnreadStudentNotificationsLength(String username) {
        Student student = studentService.findByUsername(username);
        return getUnreadNotificationsLength(student != null, student.getUserNotifications());
    }

    private ResponseEntity<ResponseTemplate> getUnreadNotificationsLength(boolean b, Set<UserNotification> userNotifications) {
        if(b) {
            if (userNotifications!=null) {
                List<Notification> unreadNotifications = userNotifications.stream().filter(userNotification -> !userNotification.getIsRead()).map(UserNotification::getNotification).collect(Collectors.toList());
                //List<String> notifications = unreadNotifications.stream().map(Notification::convertToHTML).collect(Collectors.toList());
                return ResponseEntity
                        .ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.UNREAD_NOTIFICATIONS_LENGTH_RETRIEVED, unreadNotifications.size()));
            } else {
                return ResponseEntity
                        .ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.UNREAD_NOTIFICATIONS_LENGTH_RETRIEVED, 0));
            }

        } else {
            return ResponseEntity
                    .ok(new ResponseTemplate(ERROR, CommonMessages.USER_NOT_FOUND, null));
        }
    }

    public ResponseEntity<ResponseTemplate> getLast10ReadNotificationsForStudent(String username) {
        Student student = studentService.findByUsername(username);
        return getLast10ReadNotifications(student != null, student.getUserNotifications());
    }

    public ResponseEntity<ResponseTemplate> getLast10ReadNotificationsForInstructor(String username) {
        Instructor instructor = instructorService.findByUsername(username);
        return getLast10ReadNotifications(instructor != null, instructor.getUserNotifications());
    }

    private ResponseEntity<ResponseTemplate> getLast10ReadNotifications(boolean b, Set<UserNotification> userNotifications) {
        if(b) {
            if (userNotifications!=null) {
                List<Notification> readNotifications = userNotifications.stream().filter(UserNotification::getIsRead).map(UserNotification::getNotification).collect(Collectors.toList());
                //List<String> notifications;
                List<Notification> lastNotifications = readNotifications;
                if (readNotifications.size() >= 10) {
                    lastNotifications = readNotifications.subList(readNotifications.size()-10, readNotifications.size());
                    //notifications = lastNotifications.stream().map(Notification::convertToHTML).collect(Collectors.toList());
                } /*else {
                    //notifications = readNotifications.stream().map(Notification::convertToHTML).collect(Collectors.toList());
                }*/

                return ResponseEntity
                        .ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.READ_NOTIFICATIONS_RETRIEVED, lastNotifications));
            } else {
                return ResponseEntity
                        .ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.READ_NOTIFICATIONS_RETRIEVED, null));
            }

        } else {
            return ResponseEntity
                    .ok(new ResponseTemplate(ERROR, CommonMessages.USER_NOT_FOUND, null));
        }
    }

    public ResponseEntity<ResponseTemplate> setAsReadForStudent(String username, long[] notificationIdList) {
        Student student = studentService.findByUsername(username);
        return setAsRead(student != null, student.getUserNotifications(), notificationIdList);
    }

    public ResponseEntity<ResponseTemplate> setAsReadForInstructor(String username, long[] notificationIdList) {
        Instructor instructor = instructorService.findByUsername(username);
        return setAsRead(instructor != null, instructor.getUserNotifications(), notificationIdList);
    }

    private ResponseEntity<ResponseTemplate> setAsRead(boolean b, Set<UserNotification> userNotifications,  long[] notificationIdList) {
        if(b) {
            for (long unreadNotificationId : notificationIdList) {
                List<UserNotification> userNotificationList = userNotifications.stream().filter(userNotification -> userNotification.getId().getNotificationId().equals(unreadNotificationId)).collect(Collectors.toList());
                if (userNotificationList.size() == 1) {
                    userNotificationList.get(0).setIsRead(true);
                    userNotificationRepository.save(userNotificationList.get(0));
                } else {
                    return ResponseEntity
                            .ok(new ResponseTemplate(ERROR, CommonMessages.ERRONEOUS_NOTIFICATION_ID, false));
                }
            }
            return ResponseEntity
                    .ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.READ_NOTIFICATION, true));
        } else {
            return ResponseEntity
                    .ok(new ResponseTemplate(ERROR, CommonMessages.USER_NOT_FOUND, false));
        }
    }


}

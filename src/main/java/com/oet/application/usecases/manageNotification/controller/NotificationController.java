package com.oet.application.usecases.manageNotification.controller;

import com.oet.application.common.ResponseTemplate;
import com.oet.application.usecases.manageNotification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notification")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @PreAuthorize("hasAuthority('STUDENT') and #username == authentication.principal.username ")
    @GetMapping("/retrieveUnread/student/{username}")
    public ResponseEntity<ResponseTemplate> retrieveUnreadNotificationsForStudent(@PathVariable String username) {
        return notificationService.getUnreadStudentNotifications(username);
    }

    @PreAuthorize("hasAuthority('INSTRUCTOR') and #username == authentication.principal.username ")
    @GetMapping("/retrieveUnread/instructor/{username}")
    public ResponseEntity<ResponseTemplate> retrieveUnreadNotificationsForInstructor(@PathVariable String username) {
        return notificationService.getUnreadInstructorNotifications(username);
    }

    @PreAuthorize("hasAuthority('STUDENT') and #username == authentication.principal.username ")
    @GetMapping("/retrieveUnreadLength/student/{username}")
    public ResponseEntity<ResponseTemplate> retrieveUnreadNotificationsLengthForStudent(@PathVariable String username) {
        return notificationService.getUnreadStudentNotificationsLength(username);
    }

    @PreAuthorize("hasAuthority('INSTRUCTOR') and #username == authentication.principal.username ")
    @GetMapping("/retrieveUnreadLength/instructor/{username}")
    public ResponseEntity<ResponseTemplate> retrieveUnreadNotificationsLengthForInstructor(@PathVariable String username) {
        return notificationService.getUnreadInstructorNotificationsLength(username);
    }

    @PreAuthorize("hasAuthority('STUDENT') and #username == authentication.principal.username ")
    @GetMapping("/retrieveRead/student/{username}")
    public ResponseEntity<ResponseTemplate> retrieveReadNotificationsForStudent(@PathVariable String username) {
        return notificationService.getLast10ReadNotificationsForStudent(username);
    }

    @PreAuthorize("hasAuthority('INSTRUCTOR') and #username == authentication.principal.username ")
    @GetMapping("/retrieveRead/instructor/{username}")
    public ResponseEntity<ResponseTemplate> retrieveReadNotificationsForInstructor(@PathVariable String username) {
        return notificationService.getLast10ReadNotificationsForInstructor(username);
    }

    @PreAuthorize("hasAuthority('STUDENT') and #username == authentication.principal.username ")
    @PostMapping("/read/student/{username}")
    public ResponseEntity<ResponseTemplate> setAsReadForStudent(@PathVariable String username,  @RequestBody long[] notificationIdList) {
        return notificationService.setAsReadForStudent(username, notificationIdList);
    }

    @PreAuthorize("hasAuthority('INSTRUCTOR') and #username == authentication.principal.username ")
    @PostMapping("/read/instructor/{username}")
    public ResponseEntity<ResponseTemplate> setAsReadForInstructor(@PathVariable String username, @RequestBody long[] notificationIdList) {
        return notificationService.setAsReadForInstructor(username, notificationIdList);
    }
}

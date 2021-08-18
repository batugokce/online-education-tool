package com.oet.application.usecases.manageClasses.controller;

import com.oet.application.common.ResponseTemplate;
import com.oet.application.usecases.manageClasses.DTO.ClassroomForAdminDTO;
import com.oet.application.usecases.manageClasses.DTO.ClassroomForInstructorDTO;
import com.oet.application.usecases.manageClasses.entity.Classroom;
import com.oet.application.usecases.manageClasses.service.ListClassroomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.oet.application.common.CommonMessages.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/classroom")
@RequiredArgsConstructor
public class ListClassroomController {

    private final ListClassroomService service;

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/listForAdmin")
    public ResponseEntity<ResponseTemplate> listClassroomsForAdmin() {
        List<ClassroomForAdminDTO> classrooms = service.listClassrooms();
        return ResponseEntity.ok(new ResponseTemplate(SUCCESS, "", classrooms));
    }

    @PreAuthorize("hasAuthority('INSTRUCTOR') and #username == authentication.principal.username ")
    @GetMapping("/listForInstructor/{username}")
    public ResponseEntity<ResponseTemplate> listClassroomsForInstructor(@PathVariable String username) {
        Set<ClassroomForInstructorDTO> classrooms = service.listClassroomsForInstructor(username);
        return ResponseEntity.ok(new ResponseTemplate(SUCCESS, "", classrooms));
    }

    @PreAuthorize("hasAuthority('INSTRUCTOR') and #username == authentication.principal.username ")
    @GetMapping("/listNamesForInstructor/{username}")
    public ResponseEntity<ResponseTemplate> listClassroomNamesForInstructor(@PathVariable String username) {
        List<String> classroomNames = service.listClassroomNamesForInstructor(username);
        return ResponseEntity.ok(new ResponseTemplate(SUCCESS, "", classroomNames));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/find/{classID}")
    public ResponseEntity<ResponseTemplate> displayClassInfo(@PathVariable Long classID) {
        ClassroomForAdminDTO classroom = service.displayClassInfo(classID);
        if (classroom != null) {
            return ResponseEntity.ok(new ResponseTemplate(SUCCESS, "", classroom));
        }
        return ResponseEntity.ok(new ResponseTemplate(ERROR, CLASS_NOT_FOUND, null));
    }

}

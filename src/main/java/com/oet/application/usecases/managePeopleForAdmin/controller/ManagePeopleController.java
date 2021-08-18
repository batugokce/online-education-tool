package com.oet.application.usecases.managePeopleForAdmin.controller;

import com.oet.application.common.CommonMessages;
import com.oet.application.common.ResponseTemplate;
import com.oet.application.usecases.manageClasses.DTO.InstructorDTO;
import com.oet.application.usecases.manageClasses.DTO.StudentDTO;
import com.oet.application.usecases.managePeopleForAdmin.service.ManagePeopleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

import static com.oet.application.common.CommonMessages.*;

@RestController
@RequestMapping("/api/v1/people")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class ManagePeopleController {

    private final ManagePeopleService service;

    @GetMapping("/listStudentsForAdmin")
    public ResponseEntity<ResponseTemplate> listStudentsForAdmin() {
        Set<StudentDTO> students = service.listStudentsForAdmin();
        return ResponseEntity.ok(new ResponseTemplate(SUCCESS, STUDENT_LIST_FOUND, students));
    }

    @GetMapping("/listInstructorsForAdmin")
    public ResponseEntity<ResponseTemplate> listInstructorsForAdmin() {
        Set<InstructorDTO> instructors = service.listInstructorsForAdmin();
        return ResponseEntity.ok(new ResponseTemplate(SUCCESS, USER_FOUND, instructors));
    }

    @PutMapping("/updateStudent")
    public ResponseEntity<ResponseTemplate> updateStudent(@RequestBody StudentDTO studentDTO) {
        return service.updateStudent(studentDTO);
    }

    @DeleteMapping("/deleteStudent/{id}")
    public ResponseEntity<ResponseTemplate> deleteStudent(@PathVariable Long id) {
        return service.deleteStudent(id);
    }

    @PutMapping("/updateInstructor")
    public ResponseEntity<ResponseTemplate> updateInstructor(@RequestBody InstructorDTO instructorDTO) {
        return service.updateInstructor(instructorDTO);
    }

    @DeleteMapping("/deleteInstructor/{id}")
    public ResponseEntity<ResponseTemplate> deleteInstructor(@PathVariable Long id) {
        return service.deleteInstructor(id);
    }


}

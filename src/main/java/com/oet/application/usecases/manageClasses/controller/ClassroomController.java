package com.oet.application.usecases.manageClasses.controller;

import com.oet.application.common.CommonMessages;
import com.oet.application.common.ResponseTemplate;
import com.oet.application.entity.Instructor;
import com.oet.application.entity.Student;
import com.oet.application.service.InstructorService;
import com.oet.application.service.StudentService;
import com.oet.application.usecases.manageClasses.DTO.AvailablePeopleDTO;
import com.oet.application.usecases.manageClasses.entity.Classroom;
import com.oet.application.usecases.manageClasses.service.ClassroomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import javax.validation.Valid;
import org.springframework.validation.BindingResult;

@RestController
@RequestMapping("/api/v1/classroom")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class ClassroomController {

    private final ClassroomService classroomService;

    @PostMapping
    public ResponseEntity<ResponseTemplate> createClassroom(@Valid @RequestBody Classroom classroom,BindingResult bindingresult) {
         if (bindingresult.hasErrors()) {
           return ResponseEntity.ok(new ResponseTemplate(CommonMessages.ERROR, bindingresult.getAllErrors().get(0).getDefaultMessage(), null));}
         Classroom newClassroom = classroomService.create(classroom);
         return ResponseEntity
                .ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.CLASS_CREATED, newClassroom));
    }

    @GetMapping
    public ResponseEntity<ResponseTemplate> getAllClassrooms() {
        List<Classroom> classroomList = classroomService.findAll();
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.RECORDS_FETCHED, classroomList));
    }

    @DeleteMapping
    public ResponseEntity<ResponseTemplate> deleteAllClassrooms() {
        classroomService.deleteAll();
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.RECORDS_DELETED, null));
    }

    @GetMapping("/find/{classId}/students")
    public ResponseEntity<ResponseTemplate> getAllStudentsByClassId(@PathVariable Long classId) {
        return classroomService.getAllStudentsByClassId(classId);
    }
    @PreAuthorize("hasAnyAuthority('ADMIN','INSTRUCTOR')")
    @PostMapping("/unassign/{articleId}/{username}/{classId}")
    public ResponseEntity<ResponseTemplate> unAssignAssignmentFromClassroom(@PathVariable List<Long> classId,@PathVariable Long articleId,@PathVariable String username) {
         if(classroomService.unAssignArticlesFromClassrooms(classId,articleId,username)){
             return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.ARTICLE_UNASSIGNED, null));
         }
         else{
             return ResponseEntity.ok(new ResponseTemplate(CommonMessages.ERROR, CommonMessages.ERROR, null));
         }
    }

    @PostMapping("/add/student/{classId}/{studentId}")
    public ResponseEntity<ResponseTemplate> addStudentToClass(@PathVariable Long classId, @PathVariable Long studentId) {
        return classroomService.addStudentToClass(classId, studentId);
    }

    @PostMapping("/add/instructor/{classId}/{instructorId}")
    public ResponseEntity<ResponseTemplate> addInstructorToClass(@PathVariable Long classId, @PathVariable Long instructorId) {
        return classroomService.addInstructorToClass(classId, instructorId);
    }

    @DeleteMapping("/delete/student/{classId}/{studentId}")
    public ResponseEntity<ResponseTemplate> deleteStudentFromClass(@PathVariable Long classId, @PathVariable Long studentId) {
        return classroomService.deleteStudentFromClass(classId, studentId);
    }

    @DeleteMapping("/delete/instructor/{classId}/{instructorId}")
    public ResponseEntity<ResponseTemplate> deleteInstructorFromClass(@PathVariable Long classId, @PathVariable Long instructorId) {
        return classroomService.deleteInstructorFromClass(classId, instructorId);
    }

    @GetMapping("/listAvailablePeople")
    public ResponseEntity<ResponseTemplate> listAvailablePeople() {
        return classroomService.listAvailablePeople();
    }

    @PreAuthorize("hasAuthority('INSTRUCTOR')")
    @PostMapping("/assignArticle/{username}/{classId}/{articleId}")
    public ResponseEntity<ResponseTemplate> assignArticleToClassroom(@PathVariable String username, @PathVariable Long classId, @PathVariable Long articleId) {
        ResponseTemplate responseTemplate = classroomService.assignArticlesToClassrooms(List.of(classId), articleId, username);
        return ResponseEntity.ok(responseTemplate);
    }
}

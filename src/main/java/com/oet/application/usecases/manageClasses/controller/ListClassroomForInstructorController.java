package com.oet.application.usecases.manageClasses.controller;

import com.oet.application.common.CommonMessages;
import com.oet.application.common.ResponseTemplate;
import com.oet.application.usecases.manageArticles.DTO.ArticleTitleAndIDDTO;
import com.oet.application.usecases.manageClasses.DTO.AdvancedClassroomForInstructorDTO;
import com.oet.application.usecases.manageClasses.entity.Classroom;
import com.oet.application.usecases.manageClasses.service.ClassroomService;
import com.oet.application.usecases.manageClasses.service.ListClassroomForInstructorService;
import com.oet.application.usecases.manageClasses.utilities.ClassroomMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/classroom")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('INSTRUCTOR')")
public class ListClassroomForInstructorController {
    private final ListClassroomForInstructorService service;
    private final ClassroomService classroomService;

    @GetMapping("/allClasses/{name}")
    public ResponseEntity<ResponseTemplate> getAllClassesByInstructorId(@PathVariable String name){
        Set<Classroom> classrooms=service.getAllClassesById(name);
        Set<AdvancedClassroomForInstructorDTO> classroomDTOs = classrooms
                .stream()
                .map(item -> new AdvancedClassroomForInstructorDTO(item.getId(), item.getClassName(), item.getEnglishLevel(), item.getCapacity(), ClassroomMapper.mapInstructorsToDTO(item.getInstructors())))
                .collect(Collectors.toSet());
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS,CommonMessages.RECORDS_FETCHED,classroomDTOs));
    }
    @GetMapping("/studentList/{id}")
    public ResponseEntity<ResponseTemplate> getStudentList(@PathVariable Long id){
        return classroomService.getAllStudentsByClassId(id);
    }
    @GetMapping("/asssignmentList/{classId}")
    public ResponseEntity<ResponseTemplate> getAssignmentList(@PathVariable Long classId){
        Set<ArticleTitleAndIDDTO> articleTitleAndIDDTOS = service.getAssignmentsOfClass(classId);
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.SUCCESS, articleTitleAndIDDTOS));
    }
    @GetMapping("/assignment/studentList/{classId}/{assignmentId}")
    public ResponseEntity<ResponseTemplate> getListOfStudentsCompletedAssignments(@PathVariable Long classId,@PathVariable Long assignmentId) {
      return service.getListOfStudentsCompletedAssignments(classId,assignmentId);
    }
    @PreAuthorize("hasAuthority('STUDENT') and #username == authentication.principal.username " +  " || hasAuthority('INSTRUCTOR')")
    @GetMapping("/assignmentOfStudent/{username}")
    public ResponseEntity<ResponseTemplate> getAssignmentsOfStudent(@PathVariable String username){
        ResponseTemplate responseTemplate = service.getPastAssignments(username);
        return ResponseEntity.ok(responseTemplate);
    }
    @GetMapping("/averagesOfClass/{classId}")
    public ResponseEntity<ResponseTemplate> getAveragesOfClassWithId(@PathVariable Long classId){
        return ResponseEntity.ok(service.getAveragesOfClassroom(classId));
    }
    @GetMapping("/assignmentAverageOfClass/{classId}/{assignmentId}")
        public ResponseEntity<ResponseTemplate> getAveragesOfAssignments(@PathVariable Long classId,@PathVariable Long assignmentId){
        return ResponseEntity.ok(service.getPointsWithAssignmentIdAndClassId(classId,assignmentId));
    }



}

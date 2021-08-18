package com.oet.application.usecases.manageClasses.service;

import com.oet.application.common.ResponseTemplate;
import com.oet.application.entity.Instructor;
import com.oet.application.entity.Student;
import com.oet.application.repository.InstructorRepository;
import com.oet.application.repository.StudentRepository;
import com.oet.application.service.InstructorService;
import com.oet.application.service.StudentService;
import com.oet.application.usecases.manageClasses.entity.Classroom;
import com.oet.application.usecases.manageClasses.repository.ClassroomRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static com.oet.application.CommonEntities.*;
import static com.oet.application.common.CommonMessages.*;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class ClassroomServiceTest {

    @Mock
    ClassroomRepository classroomRepository;
    @Mock
    StudentService studentService;
    @Mock
    InstructorService instructorService;
    @Mock
    StudentRepository studentRepository;
    @Mock
    InstructorRepository instructorRepository;
    @InjectMocks
    ClassroomService classroomService;

    Classroom classroom;
    Student student;
    Instructor instructor;

    @BeforeEach
    void setUp() {
        classroom = getClassroom();
        student = getStudent();
        instructor = getInstructor();
    }

    @Test
    void create() {
        Classroom response = classroomService.create(classroom);

        verify(classroomRepository).save(any());
    }

    @Test
    void findAll() {
        when(classroomRepository.findAll()).thenReturn(List.of(classroom));

        List<Classroom> classrooms = classroomService.findAll();

        assertEquals(1, classrooms.size());
    }

    @Test
    void deleteAll() {
        classroomService.deleteAll();

        verify(classroomRepository).deleteAll();
    }

    @Test
    void getAllStudentsByClassIdNull() {
        when(classroomRepository.findById(anyLong())).thenReturn(Optional.empty());

        ResponseEntity<ResponseTemplate> response = classroomService.getAllStudentsByClassId(1L);

        assertEquals(ERROR, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(CLASS_NOT_FOUND, response.getBody().getMessage());
    }

    @Test
    void getAllStudentsByClassIdEmptyStudents() {
        when(classroomRepository.findById(anyLong())).thenReturn(Optional.of(classroom));

        ResponseEntity<ResponseTemplate> response = classroomService.getAllStudentsByClassId(1L);

        assertEquals(ERROR, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(STUDENT_LIST_NOT_FOUND, response.getBody().getMessage());
    }

    @Test
    void getAllStudentsByClassIdSuccess() {
        classroom.setStudents(Set.of(student));
        when(classroomRepository.findById(anyLong())).thenReturn(Optional.of(classroom));

        ResponseEntity<ResponseTemplate> response = classroomService.getAllStudentsByClassId(1L);

        assertEquals(SUCCESS, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(STUDENT_LIST_FOUND, response.getBody().getMessage());
    }

    @Test
    void addStudentToClassNullClassroom() {
        when(classroomRepository.findById(anyLong())).thenReturn(Optional.empty());

        ResponseEntity<ResponseTemplate> response = classroomService.addStudentToClass(1L, 1L);

        assertEquals(WARNING, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(CLASS_NOT_FOUND, response.getBody().getMessage());
    }

    @Test
    void addStudentToClassNullStudent() {
        when(classroomRepository.findById(anyLong())).thenReturn(Optional.of(classroom));
        when(studentService.findById(anyLong())).thenReturn(null);

        ResponseEntity<ResponseTemplate> response = classroomService.addStudentToClass(1L, 1L);

        assertEquals(WARNING, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(USER_NOT_FOUND, response.getBody().getMessage());
    }

    @Test
    void addStudentToClassStudentHasClassroom() {
        student.setClassroom(classroom);
        when(classroomRepository.findById(anyLong())).thenReturn(Optional.of(classroom));
        when(studentService.findById(anyLong())).thenReturn(student);

        ResponseEntity<ResponseTemplate> response = classroomService.addStudentToClass(1L, 1L);

        assertEquals(WARNING, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(USER_HAS_ALREADY_CLASSROOM, response.getBody().getMessage());
    }

    @Test
    void addStudentToClassExceedCapacity() {
        student.setClassroom(null);
        classroom.setStudents(Set.of(new Student()));
        classroom.setCapacity(1);

        when(classroomRepository.findById(anyLong())).thenReturn(Optional.of(classroom));
        when(studentService.findById(anyLong())).thenReturn(student);

        ResponseEntity<ResponseTemplate> response = classroomService.addStudentToClass(1L, 1L);

        assertEquals(WARNING, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(CLASS_IS_FULL, response.getBody().getMessage());
    }

    @Test
    void addStudentToClassSuccess() {
        student.setClassroom(null);
        classroom.getStudents().add(new Student());
        classroom.setCapacity(10);

        when(classroomRepository.findById(anyLong())).thenReturn(Optional.of(classroom));
        when(studentService.findById(anyLong())).thenReturn(student);

        ResponseEntity<ResponseTemplate> response = classroomService.addStudentToClass(1L, 1L);

        assertEquals(SUCCESS, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(STUDENT_ADDED_TO_CLASS, response.getBody().getMessage());
    }

    @Test
    void addInstructorToClassNullClassroom() {
        when(classroomRepository.findById(anyLong())).thenReturn(Optional.empty());

        ResponseEntity<ResponseTemplate> response = classroomService.addInstructorToClass(1L, 1L);

        assertEquals(WARNING, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(CLASS_NOT_FOUND, response.getBody().getMessage());
    }

    @Test
    void addInstructorToClassNullInstructor() {
        when(classroomRepository.findById(anyLong())).thenReturn(Optional.of(classroom));
        when(instructorService.findById(anyLong())).thenReturn(null);

        ResponseEntity<ResponseTemplate> response = classroomService.addInstructorToClass(1L, 1L);

        assertEquals(WARNING, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(USER_NOT_FOUND, response.getBody().getMessage());
    }

    @Test
    void addInstructorToClassInstructorInClassroom() {
        instructor.setClassrooms(Set.of(classroom));
        when(classroomRepository.findById(anyLong())).thenReturn(Optional.of(classroom));
        when(instructorService.findById(anyLong())).thenReturn(instructor);

        ResponseEntity<ResponseTemplate> response = classroomService.addInstructorToClass(1L, 1L);

        assertEquals(WARNING, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(INSTRUCTOR_ALREADY_IN_CLASS, response.getBody().getMessage());
    }

    @Test
    void addInstructorToClassSuccess() {
        when(classroomRepository.findById(anyLong())).thenReturn(Optional.of(classroom));
        when(instructorService.findById(anyLong())).thenReturn(instructor);

        ResponseEntity<ResponseTemplate> response = classroomService.addInstructorToClass(1L, 1L);

        assertEquals(SUCCESS, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(INSTRUCTOR_ADDED_TO_CLASS, response.getBody().getMessage());
    }

    @Test
    void deleteStudentFromClassNullClassroom() {
        when(classroomRepository.findById(anyLong())).thenReturn(Optional.empty());

        ResponseEntity<ResponseTemplate> response = classroomService.deleteStudentFromClass(1L, 1L);

        assertEquals(ERROR, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(CLASS_NOT_FOUND, response.getBody().getMessage());
    }

    @Test
    void deleteStudentFromClassNullStudent() {
        when(classroomRepository.findById(anyLong())).thenReturn(Optional.of(classroom));
        when(studentService.findById(anyLong())).thenReturn(null);

        ResponseEntity<ResponseTemplate> response = classroomService.deleteStudentFromClass(1L, 1L);

        assertEquals(ERROR, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(USER_NOT_FOUND, response.getBody().getMessage());
    }

    @Test
    void deleteStudentFromClassStudentNotInClassroom() {
        student.setClassroom(null);
        when(classroomRepository.findById(anyLong())).thenReturn(Optional.of(classroom));
        when(studentService.findById(anyLong())).thenReturn(student);

        ResponseEntity<ResponseTemplate> response = classroomService.deleteStudentFromClass(1L, 1L);

        assertEquals(ERROR, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(USER_IN_CLASS_NOT_FOUND, response.getBody().getMessage());
    }

    @Test
    void deleteStudentFromClassSuccess() {
        student.setClassroom(classroom);
        when(classroomRepository.findById(anyLong())).thenReturn(Optional.of(classroom));
        when(studentService.findById(anyLong())).thenReturn(student);

        ResponseEntity<ResponseTemplate> response = classroomService.deleteStudentFromClass(1L, 1L);

        assertEquals(SUCCESS, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(STUDENT_REMOVED_FROM_CLASS, response.getBody().getMessage());
    }

    @Test
    void deleteInstructorFromClassNullInstructor() {
        when(instructorRepository.findById(anyLong())).thenReturn(Optional.empty());

        ResponseEntity<ResponseTemplate> response = classroomService.deleteInstructorFromClass(1L, 1L);

        assertEquals(ERROR, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(USER_NOT_FOUND, response.getBody().getMessage());
    }

    @Test
    void deleteInstructorFromClassInstructorNotInClassroom() {
        instructor.setClassrooms(new HashSet<>());
        when(instructorRepository.findById(anyLong())).thenReturn(Optional.of(instructor));

        ResponseEntity<ResponseTemplate> response = classroomService.deleteInstructorFromClass(1L, 1L);

        assertEquals(ERROR, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(USER_NOT_FOUND, response.getBody().getMessage());
    }

    @Test
    void deleteInstructorFromClassSuccess() {
        instructor.getClassrooms().add(classroom);
        when(instructorRepository.findById(anyLong())).thenReturn(Optional.of(instructor));

        ResponseEntity<ResponseTemplate> response = classroomService.deleteInstructorFromClass(1L, 1L);

        assertEquals(SUCCESS, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(INSTRUCTOR_REMOVED_FROM_CLASS, response.getBody().getMessage());
    }

    @Test
    void listAvailablePeople() {
        when(studentRepository.findAllByClassroomNull()).thenReturn(Set.of(student));
        when(instructorRepository.findAll()).thenReturn(List.of(instructor));

        ResponseEntity<ResponseTemplate> response = classroomService.listAvailablePeople();

        assertEquals(SUCCESS, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(RECORDS_FETCHED, response.getBody().getMessage());
        assertNotNull(response.getBody().getData());
    }



}
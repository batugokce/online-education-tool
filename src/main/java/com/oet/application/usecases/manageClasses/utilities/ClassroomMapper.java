package com.oet.application.usecases.manageClasses.utilities;

import com.oet.application.entity.Instructor;
import com.oet.application.entity.Student;
import com.oet.application.usecases.manageClasses.DTO.ClassroomForAdminDTO;
import com.oet.application.usecases.manageClasses.DTO.ClassroomForInstructorDTO;
import com.oet.application.usecases.manageClasses.DTO.InstructorDTO;
import com.oet.application.usecases.manageClasses.DTO.StudentDTO;
import com.oet.application.usecases.manageClasses.entity.Classroom;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class ClassroomMapper {

    public static ClassroomForAdminDTO mapClassroomToDTO(Classroom classroom) {
        return new ClassroomForAdminDTO(classroom.getId(), classroom.getClassName(),
                classroom.getEnglishLevel(), classroom.getStudents().size(), classroom.getCapacity(),
                mapStudentsToDTO(classroom.getStudents()), mapInstructorsToDTO(classroom.getInstructors()));
    }

    public static Set<StudentDTO> mapStudentsToDTO(Set<Student> students) {
        return students
                .stream()
                .map(item ->
                        new StudentDTO(item.getId(), item.getStudentNo(), item.getName(), item.getSurname(), String.join(" ", item.getName(), item.getSurname()),
                                item.getClassroom() != null ? item.getClassroom().getClassName(): "", item.getEmailAddress(), item.getUsername(), item.getTelephoneNumber(), item.getBanned()))
                .collect(Collectors.toSet());
    }

    public static Set<StudentDTO> mapStudentsToDTO(List<Student> students) {
        return students
                .stream()
                .map(item ->
                        new StudentDTO(item.getId(), item.getStudentNo(), item.getName(), item.getSurname(), String.join(" ", item.getName(), item.getSurname()),
                                item.getClassroom() != null ? item.getClassroom().getClassName(): "", item.getEmailAddress(), item.getUsername(), item.getTelephoneNumber(), item.getBanned() ))
                .collect(Collectors.toSet());
    }

    public static Set<InstructorDTO> mapInstructorsToDTO(Set<Instructor> instructors) {
        return instructors
                .stream()
                .map(item ->
                        new InstructorDTO(item.getId(), item.getName(), item.getSurname(),
                                String.join(" ", item.getName(), item.getSurname()),
                                item.getClassrooms().size(),
                                item.getEmailAddress(), item.getUsername(), item.getTelephoneNumber(),
                                item.getClassrooms().stream().map(Classroom::getClassName).collect(Collectors.toSet())))
                .collect(Collectors.toSet());
    }

    public static Set<InstructorDTO> mapInstructorsToDTO(List<Instructor> instructors) {
        return instructors
                .stream()
                .map(item ->
                        new InstructorDTO(item.getId(), item.getName(), item.getSurname(),
                                String.join(" ", item.getName(), item.getSurname()),
                                item.getClassrooms().size(),
                                item.getEmailAddress(), item.getUsername(), item.getTelephoneNumber(),
                                item.getClassrooms().stream().map(Classroom::getClassName).collect(Collectors.toSet())))
                .collect(Collectors.toSet());
    }

    public static Set<ClassroomForInstructorDTO> mapClassroomsToDTO(Set<Classroom> classrooms) {
        return classrooms
                .stream()
                .map(item -> new ClassroomForInstructorDTO(item.getId(), item.getClassName()))
                .collect(Collectors.toSet());
    }
}

package com.oet.application.usecases.manageClasses.DTO;

import com.oet.application.usecases.manageClasses.enums.EnglishLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
public class ClassroomForAdminDTO {

    private Long id;
    private String className;
    private EnglishLevel englishLevel;
    private int numberOfStudents;
    private int capacity;
    private Set<StudentDTO> students;
    private Set<InstructorDTO> instructors;

}

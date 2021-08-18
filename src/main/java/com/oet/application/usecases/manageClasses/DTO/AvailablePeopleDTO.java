package com.oet.application.usecases.manageClasses.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
public class AvailablePeopleDTO {

    private Set<StudentDTO> students;
    private Set<InstructorDTO> instructors;

}

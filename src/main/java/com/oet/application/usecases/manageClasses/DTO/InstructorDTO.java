package com.oet.application.usecases.manageClasses.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
public class InstructorDTO {

    private Long id;
    private String name;
    private String surname;
    private String nameSurname;
    private Integer numberOfClassrooms;
    private String emailAddress;
    private String username;
    private String telephoneNumber;
    private Set<String> registeredClassrooms;

}

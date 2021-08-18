package com.oet.application.usecases.manageClasses.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class StudentDTO {

    private Long id;
    private String studentNumber;
    private String name;
    private String surname;
    private String nameSurname;
    private String classroomName;
    private String emailAddress;
    private String username;
    private String telephoneNumber;
    private Boolean banned;

}

package com.oet.application.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class InstructorInfoDTO {
    private String type;
    private Long id;
    private String name;
    private String surname;
    private String username;
    private String telephoneNumber;
    private String emailAddress;
}

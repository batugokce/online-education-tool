package com.oet.application.DTO;

import com.oet.application.enums.Level;
import com.oet.application.usecases.manageClasses.enums.EnglishLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor
public class StudentInfoDTO {
    private Long id;
    private String studentNo;
    private String className;
    private String englishLevel;
    private String name;
    private String surname;
    private String username;
    private String telephoneNumber;
    private String emailAddress;
    private String level;
}

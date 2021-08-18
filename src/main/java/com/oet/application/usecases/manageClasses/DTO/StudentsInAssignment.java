package com.oet.application.usecases.manageClasses.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class StudentsInAssignment {

    private String name;

    private String surname;

    private String username;

    private String studentId;

    private Long articleId;

    private String text;

}

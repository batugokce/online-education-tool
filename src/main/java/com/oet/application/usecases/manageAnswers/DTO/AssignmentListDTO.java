package com.oet.application.usecases.manageAnswers.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AssignmentListDTO {
    private Long articleId;

    private String title;

    private String username;

    private String name;

    private String className;

    private Boolean graded;

    private Float point;

    private String feedbackGiven;

    private Integer feedbackVersion = 0;

    private Boolean progressiveGrading = false;

    private Boolean isTest;
}

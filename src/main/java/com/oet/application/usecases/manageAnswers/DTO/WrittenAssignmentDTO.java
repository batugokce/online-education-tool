package com.oet.application.usecases.manageAnswers.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
@AllArgsConstructor
public class WrittenAssignmentDTO {

    private Long articleId;

    private String title;

    private String username;

    private String className;

    private Boolean graded;

    private Float point;

    private String feedbackGiven;

    private Integer feedbackVersion = 0;

    private Boolean progressiveGrading = false;
}

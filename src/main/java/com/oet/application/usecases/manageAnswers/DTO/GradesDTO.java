package com.oet.application.usecases.manageAnswers.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@AllArgsConstructor
@Setter
public class GradesDTO {

    private Long articleId;

    private String point;

    private float maxPoint;

    private String average;

    private String title;

    private Boolean feedbackGiven;

    private Double averageValue;

}

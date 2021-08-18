package com.oet.application.usecases.manageClasses.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AssignmentSummaries {
    private Long articleId;

    private String point;

    private String average;

    private float maxPoint;

    private String title;

    private Double averageValue;

    private String text;
}

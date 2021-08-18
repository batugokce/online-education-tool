package com.oet.application.usecases.manageAnswers.DTO;

import lombok.Getter;

@Getter
public class AssignmentSummary {

    private Long articleId;

    private Double average;

    private Long cnt;

    public AssignmentSummary(Long articleId, Double average, Long cnt) {
        this.articleId = articleId;
        this.average = average;
        this.cnt = cnt;

    }
}

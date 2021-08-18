package com.oet.application.usecases.manageArticles.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ArticleMultipleChoice {
    private int num;
    private String text;
    private String option1;
    private String option2;
    private String option3;
    private String option4;
    private String option5;
    private String correctAnswer;
}

package com.oet.application.usecases.manageArticles.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ArticleGapFilling {
    private int num;
    private String questionText;
    private String answer;
}

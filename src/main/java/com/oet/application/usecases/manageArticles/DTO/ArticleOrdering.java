package com.oet.application.usecases.manageArticles.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ArticleOrdering {
    private String text;

    private int correctOrder;
}

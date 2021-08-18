package com.oet.application.usecases.manageArticles.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
public class ArticleGapFillingMain {
    private String clues;

    private Set<ArticleGapFilling> gapFillings;

}

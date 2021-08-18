package com.oet.application.usecases.manageArticles.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter

public class ArticleMatchingsArray extends ArticleQuestionBase {
    private Set<ArticleMatchings> matchings;

    public ArticleMatchingsArray(String description, int order, int point, Set<ArticleMatchings> matchings) {
        super(description, "matching", order, point);
        this.matchings = matchings;
    }
}

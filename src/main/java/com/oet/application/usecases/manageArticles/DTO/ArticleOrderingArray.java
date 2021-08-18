package com.oet.application.usecases.manageArticles.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class ArticleOrderingArray extends ArticleQuestionBase {
    private Set<ArticleOrdering> orderings;

    public ArticleOrderingArray(String description, int order, int point, Set<ArticleOrdering> orderings) {
        super(description, "ordering", order, point);
        this.orderings = orderings;
    }
}

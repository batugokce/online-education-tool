package com.oet.application.usecases.manageArticles.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class ArticleTrueFalseArray extends ArticleQuestionBase {

    private Set<ArticleTrueFalse> trueFalses;

    public ArticleTrueFalseArray(String description, int order, int point, Set<ArticleTrueFalse> trueFalses) {
        super(description, "tf", order, point);
        this.trueFalses = trueFalses;
    }
}


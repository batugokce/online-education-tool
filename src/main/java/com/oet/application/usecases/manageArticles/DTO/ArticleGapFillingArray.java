package com.oet.application.usecases.manageArticles.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class ArticleGapFillingArray extends ArticleQuestionBase {

    private ArticleGapFillingMain gapFillingMain;
    public ArticleGapFillingArray(String description, int order, int point, ArticleGapFillingMain gapFillings) {
        super(description, "fill", order, point);
        this.gapFillingMain = gapFillings;
    }

}

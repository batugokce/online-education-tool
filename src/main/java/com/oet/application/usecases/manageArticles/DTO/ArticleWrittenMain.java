package com.oet.application.usecases.manageArticles.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class ArticleWrittenMain extends ArticleQuestionBase {
    private ArticleWritten writtenQuestion;

    public ArticleWrittenMain(String description, int order, int point, ArticleWritten articleWritten) {
        super(description, "written", order, point);
        this.writtenQuestion = articleWritten;
    }

}

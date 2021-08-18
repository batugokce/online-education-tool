package com.oet.application.usecases.manageArticles.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class ArticleMultipleChoiceArray extends ArticleQuestionBase{
    private Set<ArticleMultipleChoice> multipleChoices;

    public ArticleMultipleChoiceArray(String description,int order,int point,Set<ArticleMultipleChoice> multipleChoices){
        super(description,"mc",order,point);
        this.multipleChoices=multipleChoices;
    }
}

package com.oet.application.usecases.manageArticles.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class ArticleQuestionBase {
    private String description;
    private String type;
    private int order;
    private int point;

    ArticleQuestionBase(String description,String type,int order,int point){
        this.description=description;
        this.type=type;
        this.order=order;
        this.point=point;
    }
}

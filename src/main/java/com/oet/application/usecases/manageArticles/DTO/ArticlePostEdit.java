package com.oet.application.usecases.manageArticles.DTO;

import com.oet.application.usecases.manageArticles.entity.Article;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ArticlePostEdit {
    private Article article;
    private int type;
}

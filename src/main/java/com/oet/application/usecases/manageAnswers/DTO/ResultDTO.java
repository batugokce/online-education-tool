package com.oet.application.usecases.manageAnswers.DTO;

import com.oet.application.usecases.manageArticles.entity.Article;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor
public class ResultDTO {

    private final Article article;

    private final PointDTO pointDTO;
}

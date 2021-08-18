package com.oet.application.usecases.manageArticles.DTO;

import com.oet.application.enums.Category;
import com.oet.application.enums.Level;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@AllArgsConstructor
@Setter
public class ArticleTitleAndIDDTO {

    private final Long id;
    private final String title;
    private final int level;
    private final Category category;
    private boolean isStarted = false;

}

package com.oet.application.usecases.manageArticles.DTO;

import com.oet.application.usecases.manageClasses.enums.EnglishLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor
public class AssignmentDTO {

    private final Long id;
    private final String title;
    private final EnglishLevel englishLevel;
    private final int nOfClassesUser;
}

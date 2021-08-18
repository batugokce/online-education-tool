package com.oet.application.usecases.manageArticles.DTO;

import com.oet.application.enums.Category;
import com.oet.application.enums.Level;
import com.oet.application.usecases.manageArticles.entity.ArticleText;
import com.oet.application.usecases.manageArticles.entity.WordDef;
import com.oet.application.usecases.manageClasses.entity.Classroom;
import com.oet.application.usecases.manageClasses.enums.EnglishLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.validation.Valid;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
public class ArticleForEdit {
   private com.oet.application.usecases.manageClasses.enums.EnglishLevel EnglishLevel;
   private Level difficultyLevel;
   private Category Category;
   private ArticleText articleText;
   private Set<@Valid WordDef> definitions;
   private Set<ArticleQuestionBase> sections;
   private Boolean IsOtherClassesUsing;
   private Boolean IsAnyStudentStarted;
}

package com.oet.application.usecases.manageArticles.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.oet.application.common.BaseEntity;
import com.oet.application.enums.Category;
import com.oet.application.enums.Level;
import com.oet.application.usecases.manageClasses.entity.Classroom;
import com.oet.application.usecases.manageClasses.enums.EnglishLevel;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@SequenceGenerator(name = "idGenerator", sequenceName = "article_sequence")
public class Article extends BaseEntity {

    @Valid
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "TEXT")
    private ArticleText text;

    @NotEmpty(message = "You should add some question sections")
    @OrderBy("order ASC")
    @OneToMany(cascade = CascadeType.ALL)
    private Set<@Valid Section> sections;

    @Transient
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long timeTaken;

    @Column(name = "ENGLISH_LEVEL")
    private EnglishLevel englishLevel;

    @Column(name = "DIFFICULTY_LEVEL")
    private Level difficultyLevel;

    @Column(name = "CATEGORY")
    private Category category;

    @OneToMany(cascade = CascadeType.ALL)
    private Set<@Valid WordDef> definitions = new HashSet<>();

    @ManyToMany(mappedBy = "articles")
    @JsonIgnore
    private Set<Classroom> ownerClassrooms = new HashSet<>();

    @Transient
    @NotNull(message = "You should specify a classroom to use this assignment")
    private Long classroomId;

    public Boolean isOnlyOneSectionAndWrittenType() {
        return sections.size() == 1 && sections.stream().iterator().next().getWrittenQuestion() != null;
    }

}

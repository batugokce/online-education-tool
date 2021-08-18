package com.oet.application.usecases.manageArticles.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.oet.application.common.BaseEntity;
import com.oet.application.usecases.manageAnswers.entity.AnswerForm;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.Set;

@Entity
@Getter
@Setter
@SequenceGenerator(name = "idGenerator", sequenceName = "articleText_sequence")
public class ArticleText extends BaseEntity {

    @NotBlank(message = "You cannot leave title blank")
    @Column(name = "TITLE")
    private String title;

    @NotBlank(message = "Article text cannot be empty")
    @Column(name= "TEXT", columnDefinition = "TEXT")
    private String text;

    @OneToOne(fetch = FetchType.LAZY, mappedBy = "text")
    @JsonIgnore
    private Article article;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "articleText")
    @JsonIgnore
    private Set<AnswerForm> answerForm;

    //TO DO : Add possible pictures.
}

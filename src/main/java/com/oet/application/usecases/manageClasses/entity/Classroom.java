package com.oet.application.usecases.manageClasses.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.oet.application.common.BaseEntity;
import com.oet.application.entity.Instructor;
import com.oet.application.entity.Student;
import com.oet.application.usecases.manageArticles.entity.Article;
import com.oet.application.usecases.manageClasses.enums.EnglishLevel;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;
import javax.validation.constraints.*;

@Getter
@Setter
@SequenceGenerator(name = "idGenerator", sequenceName = "class_sequence")
@Entity
public class Classroom extends BaseEntity {

    @NotEmpty(message = "Please enter a class name")
    @Column(name = "CLASS_NAME")
    private String className;

    @NotNull(message = "Please enter an English level")
    @Column(name = "ENGLISH_LEVEL")
    private EnglishLevel englishLevel;

    @NotNull(message = "Please enter a capacity")
    @Min(value = 2,message = "Capacity cannot be less than 2")
    @Max(value = 50,message = "Capacity cannot be more than 50")
    @Column(name = "CAPACITY")
    private int capacity;

    @ManyToMany(mappedBy = "classrooms", fetch = FetchType.LAZY)
    private Set<Instructor> instructors = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "classroom", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Student> students = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "CLASS_ARTICLES",
            joinColumns = @JoinColumn(name = "class_id"),
            inverseJoinColumns = @JoinColumn(name = "article_id"))
    private Set<Article> articles = new HashSet<>();



}

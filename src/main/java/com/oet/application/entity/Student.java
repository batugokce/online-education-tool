package com.oet.application.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.oet.application.common.PersonEntity;
import com.oet.application.enums.Level;
import com.oet.application.enums.StudentLevel;
import com.oet.application.usecases.manageAnswers.entity.AnswerForm;
import com.oet.application.usecases.manageClasses.entity.Classroom;
import com.oet.application.usecases.manageComments.entity.Comment;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@SequenceGenerator(name = "idGenerator", sequenceName = "student_sequence")
public class Student extends PersonEntity {

    @Column(name = "STUDENT_NO")
    private String studentNo;

    @Column(name = "LEVEL")
    private StudentLevel level;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="classroom_id")
    private Classroom classroom;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private Set<AnswerForm> answerForms = new HashSet<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private Set<Comment> comments = new HashSet<>();

    @JsonIgnore
    @Column(name = "GENERAL_SCORE")
    private int generalScore = 0;

    @Column(name = "IS_BANNED")
    private Boolean banned = false;

}


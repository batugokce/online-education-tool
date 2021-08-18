package com.oet.application.usecases.manageComments.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.oet.application.common.BaseEntity;
import com.oet.application.entity.Student;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@SequenceGenerator(name = "idGenerator", sequenceName = "comment_sequence")
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Comment extends BaseEntity  {

    @ManyToOne
    @JsonIgnore
    private Student student;

    @Column(name = "OWNER_STUDENT_ID")
    private Long studentId;

    @Column(name = "OWNER_STUDENT_USERNAME")
    private String username;

    @Column(name = "ARTICLE_ID")
    private Long articleId;

    @Column(name = "MESSAGE")
    private String message;

    @Column(name="COLOR")
    private String color;

    @Column(name="CREATION_DATE")
    private Long creationTimestamp;
}




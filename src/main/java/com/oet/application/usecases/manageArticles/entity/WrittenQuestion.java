package com.oet.application.usecases.manageArticles.entity;

import com.oet.application.common.BaseEntity;
import com.oet.application.usecases.manageAnswers.entity.questiontypes.WrittenAnswer;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.SequenceGenerator;
import javax.persistence.Transient;

@Entity
@Getter
@Setter
@SequenceGenerator(name = "idGenerator", sequenceName = "written_sequence")
public class WrittenQuestion extends BaseEntity {

    @Transient
    private String studentAnswer;

    @Transient
    private String instructorFeedback;

    @Transient
    private Boolean graded;

    @Transient
    private Float point;

    @Column
    private Boolean progressiveGrading = false;

    @Transient
    private Integer feedbackVersion = 0;

    public WrittenAnswer mapToAnswer() {
        return new WrittenAnswer("", "", false,0f, progressiveGrading, 0);
    }
}

package com.oet.application.usecases.manageArticles.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.oet.application.common.BaseEntity;
import com.oet.application.usecases.manageAnswers.entity.questiontypes.TrueFalseAnswer;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Objects;

@Entity
@Getter
@Setter
@SequenceGenerator(name = "idGenerator", sequenceName = "trueFalse_sequence")
public class TrueFalse extends BaseEntity {

    @NotBlank(message = "You cannot leave TF question text blank")
    @Column
    private String text;

    @NotNull(message = "Correct answer for TF question cannot be null")
    @Column
    private Integer correctAnswer;

    @Transient
    private Integer studentAnswer;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        TrueFalse trueFalse = (TrueFalse) o;
        return correctAnswer.equals(trueFalse.correctAnswer) &&
                text.equals(trueFalse.text);
    }

    public TrueFalseAnswer mapToAnswer() {
        return new TrueFalseAnswer(text, null);
    }
}

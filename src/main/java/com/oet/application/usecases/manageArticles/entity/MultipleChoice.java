package com.oet.application.usecases.manageArticles.entity;

import com.oet.application.common.BaseEntity;
import com.oet.application.usecases.manageAnswers.entity.questiontypes.MultipleChoiceAnswer;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.util.*;

@Entity
@Getter
@Setter
@SequenceGenerator(name = "idGenerator", sequenceName = "multipleChoice_sequence")
public class MultipleChoice extends BaseEntity {
    @Column
    private Integer num;

    @NotBlank(message = "You cannot leave question text blank")
    @Column
    private String text;

    @Column
    private String correctAnswer;

    @NotBlank(message = "Options in multiple choice questions cannot be empty")
    private String option1;
    @NotBlank(message = "Options in multiple choice questions cannot be empty")
    private String option2;
    @NotBlank(message = "Options in multiple choice questions cannot be empty")
    private String option3;
    private String option4;
    private String option5;

    @Transient
    private String studentAnswer;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        MultipleChoice that = (MultipleChoice) o;
        return num.equals(that.num) &&
                text.equals(that.text) &&
                correctAnswer.equals(that.correctAnswer);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), num, text, correctAnswer);
    }

    public MultipleChoiceAnswer mapToAnswer() {
        return new MultipleChoiceAnswer(num, text, "", option1, option2, option3, option4, option5);
    }
}

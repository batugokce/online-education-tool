package com.oet.application.usecases.manageArticles.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.oet.application.common.BaseEntity;
import com.oet.application.usecases.manageAnswers.entity.questiontypes.GapFillingAnswer;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.Objects;

@Entity
@Getter
@Setter
@SequenceGenerator(name = "idGenerator", sequenceName = "GapFilling_sequence")
public class GapFilling extends BaseEntity {

    @Column
    private Integer num;

    @NotBlank(message = "Question text in gap filling questions cannot be empty")
    @Column
    private String questionText;  // the gap if shown with a special character.

    @NotBlank(message = "Correct answer in gap filling questions cannot be empty")
    @Column
    private String answer;

    @Transient
    private String studentAnswer;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        GapFilling that = (GapFilling) o;
        return num.equals(that.num) &&
                questionText.equals(that.questionText) &&
                answer.equals(that.answer);
    }

    public GapFillingAnswer mapToAnswer() {
        return new GapFillingAnswer(num, questionText, "");
    }

}

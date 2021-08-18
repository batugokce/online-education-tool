package com.oet.application.usecases.manageAnswers.entity.questiontypes;

import com.oet.application.common.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.SequenceGenerator;

@Entity
@Getter
@Setter
@SequenceGenerator(name = "idGenerator", sequenceName = "multipleChoiceAnswer_sequence")
@NoArgsConstructor
@AllArgsConstructor
public class MultipleChoiceAnswer extends BaseEntity {

    @Column
    private Integer num;

    @Column
    private String text;

    @Column
    private String studentAnswer;

    private String option1;
    private String option2;
    private String option3;
    private String option4;
    private String option5;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        MultipleChoiceAnswer that = (MultipleChoiceAnswer) o;
        return num.equals(that.num) &&
                text.equals(that.text);
    }

}

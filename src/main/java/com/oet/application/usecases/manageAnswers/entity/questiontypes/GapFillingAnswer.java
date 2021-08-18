package com.oet.application.usecases.manageAnswers.entity.questiontypes;

import com.oet.application.common.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.SequenceGenerator;
import java.util.Objects;

@Entity
@Getter
@Setter
@SequenceGenerator(name = "idGenerator", sequenceName = "GapFillingAnswer_sequence")
@AllArgsConstructor
@NoArgsConstructor
public class GapFillingAnswer extends BaseEntity {

    @Column
    private Integer num;

    @Column
    private String questionText;  // the gap if shown with a special character.

    @Column
    private String studentAnswer;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        GapFillingAnswer that = (GapFillingAnswer) o;
        return num.equals(that.num) &&
                questionText.equals(that.questionText);
    }

}

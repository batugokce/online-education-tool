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
@SequenceGenerator(name = "idGenerator", sequenceName = "matchingAnswer_sequence")
@NoArgsConstructor
@AllArgsConstructor
public class MatchingAnswer extends BaseEntity {

    @Column
    private int number;

    @Column
    private String leftPart;

    @Column
    private String randomRightPart;

    @Column
    private String studentRightPart;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        MatchingAnswer that = (MatchingAnswer) o;
        return number == that.number &&
                leftPart.equals(that.leftPart);
    }
    
}

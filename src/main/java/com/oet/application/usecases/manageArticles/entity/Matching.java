package com.oet.application.usecases.manageArticles.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.oet.application.common.BaseEntity;
import com.oet.application.usecases.manageAnswers.entity.questiontypes.MatchingAnswer;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.*;

@Entity
@Getter
@Setter
@SequenceGenerator(name = "idGenerator", sequenceName = "matching_sequence")
public class Matching extends BaseEntity {

    @Column
    private int number;

    @NotBlank(message = "Left part in matching questions cannot be empty")
    @Column
    private String leftPart;

    @NotBlank(message = "Right part in matching questions cannot be empty")
    @Column
    private String rightPart;

    @Transient
    private String studentRightPart;

    @Transient
    private String randomRightPart;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        Matching matching = (Matching) o;
        return number == matching.number &&
                leftPart.equals(matching.leftPart) &&
                rightPart.equals(matching.rightPart);
    }

    public MatchingAnswer mapToAnswer() {
        return new MatchingAnswer(number, leftPart,"", "");
    }

}

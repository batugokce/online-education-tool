package com.oet.application.usecases.manageArticles.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.oet.application.common.BaseEntity;
import com.oet.application.usecases.manageAnswers.entity.questiontypes.OrderingAnswer;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import java.util.*;

@Entity
@Getter
@Setter
@SequenceGenerator(name = "idGenerator", sequenceName = "ordering_sequence")
public class Ordering extends BaseEntity {

    @NotBlank(message = "You cannot leave ordering text blank")
    @Column
    private String text;

    @Min(value = 1, message = "Order must be greater than 0")
    @Column
    private Integer correctOrder;

    @Transient
    private Integer studentOrder;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        Ordering ordering = (Ordering) o;
        return correctOrder.equals(ordering.correctOrder) &&
                text.equals(ordering.text);
    }

    public OrderingAnswer mapToAnswer() {
        return new OrderingAnswer(text, null);
    }

}

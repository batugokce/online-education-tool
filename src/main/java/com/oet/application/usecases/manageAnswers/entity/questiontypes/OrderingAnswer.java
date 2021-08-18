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
@SequenceGenerator(name = "idGenerator", sequenceName = "orderingAnswer_sequence")
@NoArgsConstructor
@AllArgsConstructor
public class OrderingAnswer extends BaseEntity {

    @Column
    private String text;

    @Column
    private Integer studentOrder;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        OrderingAnswer that = (OrderingAnswer) o;
        return text.equals(that.text);
    }

}

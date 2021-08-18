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
@SequenceGenerator(name = "idGenerator", sequenceName = "writtenAnswer_sequence")
@AllArgsConstructor
@NoArgsConstructor
public class WrittenAnswer extends BaseEntity {

    @Column(name= "TEXT", columnDefinition = "TEXT")
    private String text;

    @Column(name= "FEEDBACK")
    private String instructorFeedback;

    @Column(name = "GRADED")
    private Boolean graded = false;

    @Column(name = "POINT")
    private Float point;

    @Column(name = "PROGRESSIVE_GRADING")
    private Boolean progressiveGrading = false;

    @Column(name = "FEEDBACK_VERSION")
    private Integer feedbackVersion = 0;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        WrittenAnswer that = (WrittenAnswer) o;
        return Objects.equals(text, that.text);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), text);
    }
}

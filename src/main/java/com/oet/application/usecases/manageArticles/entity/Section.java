package com.oet.application.usecases.manageArticles.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.oet.application.common.BaseEntity;
import com.oet.application.usecases.manageAnswers.entity.AnswerSection;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.*;

@Entity
@Getter
@Setter
@SequenceGenerator(name = "idGenerator", sequenceName = "container_sequence")
public class Section extends BaseEntity {

    @Column(name = "NUMBER")
    private Integer order;

    @NotBlank(message = "You cannot leave description blank")
    @Column(name = "DESCRIPTION", columnDefinition = "TEXT")
    private String description;

    @Min(value = 1, message = "Point must be greater than 0")
    @Column(name = "POINT")
    private int point;

    @OrderBy("num ASC")
    @OneToMany(fetch= FetchType.LAZY,cascade = CascadeType.ALL)
    private Set<@Valid MultipleChoice> multipleChoices = new HashSet<>();

    @OrderBy("text ASC")
    @OneToMany(fetch= FetchType.LAZY,cascade = CascadeType.ALL)
    private Set<@Valid Ordering> orderings = new HashSet<>();

    @OrderBy("text ASC")
    @OneToMany(fetch= FetchType.LAZY,cascade = CascadeType.ALL)
    private Set<@Valid TrueFalse> trueFalses = new HashSet<>();

    @OrderBy("number ASC")
    @OneToMany(fetch= FetchType.LAZY,cascade = CascadeType.ALL)
    private Set<@Valid Matching> matchings = new HashSet<>();

    @Valid
    @OneToOne(fetch= FetchType.LAZY,cascade = CascadeType.ALL)
    private GapFillingMain gapFillingMain;

    @OneToOne(fetch= FetchType.LAZY,cascade = CascadeType.ALL)
    private WrittenQuestion writtenQuestion;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        Section section = (Section) o;
        return order.equals(section.order) &&
                description.equals(section.description);
    }

    public AnswerSection mapToAnswerSection() {
        return new AnswerSection(order,description,point);
    }
}

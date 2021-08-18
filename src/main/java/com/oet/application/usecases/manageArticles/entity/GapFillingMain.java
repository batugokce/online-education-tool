package com.oet.application.usecases.manageArticles.entity;

import com.fasterxml.jackson.databind.ser.Serializers;
import com.oet.application.common.BaseEntity;
import com.oet.application.usecases.manageAnswers.entity.questiontypes.GapFillingAnswer;
import com.oet.application.usecases.manageAnswers.entity.questiontypes.GapFillingMainAnswer;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.Valid;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Getter
@Setter
@SequenceGenerator(name = "idGenerator", sequenceName = "GapFillingMain_sequence")
public class GapFillingMain extends BaseEntity {

    @Column
    private String clues; //each clue seperated by a unique character

    @OrderBy("num ASC")
    @Column
    @OneToMany(fetch= FetchType.LAZY,cascade = CascadeType.ALL)
    private Set<@Valid GapFilling> gapFillings = new HashSet<>();

    public GapFillingMainAnswer mapToAnswer() {
        return new GapFillingMainAnswer(clues,gapFillings.stream().map(GapFilling::mapToAnswer).collect(Collectors.toSet()));
    }

}

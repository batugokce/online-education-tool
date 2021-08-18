package com.oet.application.usecases.manageAnswers.entity.questiontypes;

import com.oet.application.common.BaseEntity;
import com.oet.application.usecases.manageArticles.entity.GapFilling;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@SequenceGenerator(name = "idGenerator", sequenceName = "gapFillingAnswer_sequence")
@NoArgsConstructor
@AllArgsConstructor
public class GapFillingMainAnswer extends BaseEntity {

    @Column
    private String clues; //each clue seperated by a unique character

    @Column
    @OrderBy("num ASC")
    @OneToMany(fetch= FetchType.LAZY,cascade = CascadeType.ALL)
    private Set<GapFillingAnswer> gapFillingAnswers = new HashSet<>();
}

package com.oet.application.usecases.manageArticles.entity;

import com.oet.application.common.BaseEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@SequenceGenerator(name = "idGenerator", sequenceName = "dragDrop_sequence")
public class DragDrop extends BaseEntity {
    @Column(name="Part1")
    private String question1;

    @Column(name="Part2")
    private String question2;

    @Column(name="Answer")
    private String answer;

}

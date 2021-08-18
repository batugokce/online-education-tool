package com.oet.application.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.oet.application.common.PersonEntity;
import com.oet.application.usecases.manageClasses.entity.Classroom;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@Entity
@Getter
@Setter
@SequenceGenerator(name = "idGenerator", sequenceName = "instructor_sequence")
public class Instructor extends PersonEntity {

    @ManyToMany(fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Classroom> classrooms;
}

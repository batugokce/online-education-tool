package com.oet.application.entity;

import com.oet.application.common.PersonEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.SequenceGenerator;

@Entity
@Getter
@Setter
@SequenceGenerator(name = "idGenerator", sequenceName = "admin_sequence")
public class Admin extends PersonEntity {

}

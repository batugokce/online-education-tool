package com.oet.application.entity;

import com.oet.application.common.BaseEntity;
import com.oet.application.common.PersonEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.UUID;

@Entity
@Getter
@Setter
@SequenceGenerator(name = "idGenerator", sequenceName = "confirmation_token_sequence")
public class ConfirmationToken extends BaseEntity {

    @Column(name="TOKEN")
    private String token;

    @Temporal(TemporalType.TIMESTAMP)
    private Date creationTime;

    @OneToOne(targetEntity = PersonEntity.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false ,name="id")
    private PersonEntity person;

    @Column(name="user_id")
    private long userId;

    public ConfirmationToken(){

    }
    public ConfirmationToken(PersonEntity personEntity,long user_id){
        this.person=personEntity;
        this.creationTime=new Date();
        token= UUID.randomUUID().toString();
        this.userId=user_id;
    }


}

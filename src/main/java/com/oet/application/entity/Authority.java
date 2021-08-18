package com.oet.application.entity;

import com.oet.application.common.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;

import javax.persistence.Entity;
import javax.persistence.SequenceGenerator;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@SequenceGenerator(name = "idgen", sequenceName = "authority_sequence")
public class Authority extends BaseEntity implements GrantedAuthority {

    private String authority;

}

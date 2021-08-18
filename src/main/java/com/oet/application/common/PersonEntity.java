package com.oet.application.common;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.oet.application.entity.Authority;
import com.oet.application.usecases.manageNotification.entity.UserNotification;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.CredentialsContainer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;


import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@SequenceGenerator(name = "idGenerator", sequenceName = "person_sequence")
@Entity
public class PersonEntity extends BaseEntity implements UserDetails, CredentialsContainer {

    @NotEmpty(message = "Please enter a nam")
    @Column(name = "NAME")
    private String name;

    @NotEmpty(message = "Please enter a surname.")
    @Column(name = "SURNAME")
    private String surname;

    @Size(max = 20, min = 4, message = "The number of characters in the username must be in the range of 4, 20")
    @NotEmpty(message = "Please enter an username")
    @Column(name = "USERNAME")
    private String username;

    //@NotEmpty(message = "Please enter a password")
    @Column(name = "PASSWORD")
    private String password;

    //@NotEmpty(message = "Please enter a telephone number")
    @Column(name = "TELEPHONE_NUMBER")
    private String telephoneNumber;

    @Email(message = "E-mail format is invalid")
    @NotEmpty(message = "Please enter an email address")
    @Column(name = "EMAIL_ADDRESS")
    private String emailAddress;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "USER_AUTHORITIES",
            joinColumns = @JoinColumn(name = "USER_ID"),
            inverseJoinColumns = @JoinColumn(name = "AUTHORITY_ID"))
    private Set<Authority> authorities = new HashSet<>();

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private Set<UserNotification> userNotifications = new HashSet<>();

    @Override
    public void eraseCredentials() {

    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

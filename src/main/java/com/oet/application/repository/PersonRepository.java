package com.oet.application.repository;

import com.oet.application.common.PersonEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;

@Transactional
public interface PersonRepository extends JpaRepository<PersonEntity,Long> {

    @Query("SELECT p FROM PersonEntity AS p LEFT JOIN FETCH p.authorities " +
            "WHERE p.username = :username ")
    PersonEntity getByUsername(String username);
    PersonEntity getByEmailAddress(String email);
    PersonEntity findByUsername(String username);

}

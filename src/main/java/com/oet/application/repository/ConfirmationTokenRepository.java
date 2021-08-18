package com.oet.application.repository;

import com.oet.application.common.PersonEntity;
import com.oet.application.entity.ConfirmationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;

@Transactional
public interface ConfirmationTokenRepository extends JpaRepository<ConfirmationToken,Long> {

    @Modifying
    @Query("DELETE FROM ConfirmationToken where userId=:id")
    public void deleteByUserId(long id);
    @Query ("SELECT M from ConfirmationToken M where token=:token")
    public ConfirmationToken getByToken(String token);
}

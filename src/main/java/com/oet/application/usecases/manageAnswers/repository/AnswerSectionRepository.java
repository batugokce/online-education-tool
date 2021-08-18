package com.oet.application.usecases.manageAnswers.repository;

import com.oet.application.usecases.manageAnswers.entity.AnswerSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnswerSectionRepository extends JpaRepository<AnswerSection, Long> {
}

package com.oet.application.usecases.manageArticles.repository;

import com.oet.application.usecases.manageArticles.entity.WrittenQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WrittenQuestionRepository extends JpaRepository<WrittenQuestion,Long> {
}

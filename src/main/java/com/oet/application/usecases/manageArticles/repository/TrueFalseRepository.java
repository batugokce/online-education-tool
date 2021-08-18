package com.oet.application.usecases.manageArticles.repository;

import com.oet.application.usecases.manageArticles.entity.TrueFalse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrueFalseRepository extends JpaRepository<TrueFalse,Long> {
}

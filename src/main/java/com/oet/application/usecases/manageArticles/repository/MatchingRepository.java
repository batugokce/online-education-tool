package com.oet.application.usecases.manageArticles.repository;

import com.oet.application.usecases.manageArticles.entity.Matching;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchingRepository extends JpaRepository<Matching,Long> {
}

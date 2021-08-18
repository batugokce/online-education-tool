package com.oet.application.usecases.manageArticles.repository;

import com.oet.application.usecases.manageArticles.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {
}

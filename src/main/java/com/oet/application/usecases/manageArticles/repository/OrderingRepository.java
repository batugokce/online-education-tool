package com.oet.application.usecases.manageArticles.repository;

import com.oet.application.usecases.manageArticles.entity.Ordering;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderingRepository extends JpaRepository<Ordering,Long> {
}

package com.oet.application.usecases.manageClasses.repository;

import com.oet.application.usecases.manageArticles.entity.Article;
import com.oet.application.usecases.manageClasses.entity.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface ClassroomRepository extends JpaRepository<Classroom,Long> {

    @Query("SELECT c FROM Classroom c LEFT JOIN FETCH c.articles AS articles " +
            "                         LEFT JOIN FETCH articles.text " +
            "                         LEFT JOIN FETCH articles.sections " +
            "WHERE c.id = :id")
    Classroom getClassroomWithArticles(Long id);

    Optional<Classroom> findByClassName(String className);
}

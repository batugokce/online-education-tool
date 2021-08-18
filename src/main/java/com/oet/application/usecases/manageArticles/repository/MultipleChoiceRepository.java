package com.oet.application.usecases.manageArticles.repository;

import com.oet.application.usecases.manageArticles.entity.DragDrop;
import com.oet.application.usecases.manageArticles.entity.MultipleChoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MultipleChoiceRepository extends JpaRepository<MultipleChoice,Long> {
    /*@Query("SELECT m from MultipleChoice m where m.quiz.ownerArticle.id= :id")
    List<MultipleChoice> getMultipleChoices(@Param("id") Long id);*/
}

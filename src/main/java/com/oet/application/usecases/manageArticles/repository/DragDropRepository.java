package com.oet.application.usecases.manageArticles.repository;

import com.oet.application.usecases.manageArticles.entity.DragDrop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DragDropRepository extends JpaRepository<DragDrop,Long> {
    /*@Query("SELECT d from DragDrop d where d.quiz.ownerArticle.id= :id")
    List<DragDrop>  getDragDrops(@Param("id") Long id);*/
}

package com.oet.application.usecases.manageArticles.repository;

import com.oet.application.usecases.manageArticles.DTO.ArticleTitleAndIDDTO;
import com.oet.application.usecases.manageArticles.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface ArticleRepository extends JpaRepository<Article,Long> {

    @Query("SELECT a FROM Article a LEFT JOIN FETCH a.text " +
            "                       LEFT JOIN FETCH a.sections AS sec " +
            "                       LEFT JOIN FETCH sec.multipleChoices AS mc " +
            "                       LEFT JOIN FETCH sec.orderings AS or " +
            "                       LEFT JOIN FETCH sec.trueFalses AS tf " +
            "                       LEFT JOIN FETCH sec.matchings AS mt " +
            "                       LEFT JOIN FETCH sec.gapFillingMain AS gp " +
            "                       LEFT JOIN FETCH gp.gapFillings AS gps " +
            "                       LEFT JOIN FETCH sec.writtenQuestion AS wq " +
            "ORDER BY sec.order, mc.num ASC ")
    Set<Article> getAllArticlesWithQuestions();

    @Query("SELECT a FROM Article a LEFT JOIN FETCH a.text " +
            "                       LEFT JOIN FETCH a.sections AS sec " +
            "                       LEFT JOIN FETCH sec.multipleChoices AS mc " +
            "                       LEFT JOIN FETCH sec.orderings AS or " +
            "                       LEFT JOIN FETCH sec.trueFalses AS tf " +
            "                       LEFT JOIN FETCH sec.matchings AS mt " +
            "                       LEFT JOIN FETCH sec.gapFillingMain AS gp " +
            "                       LEFT JOIN FETCH gp.gapFillings AS gps " +
            "                       LEFT JOIN FETCH sec.writtenQuestion AS wq " +
            "WHERE a.id = :id ORDER BY sec.order, mc.num ")
    Article getArticleByIdWithQuestions(Long id);

    @Query("SELECT a FROM Article a LEFT JOIN FETCH a.text " +
            "                       LEFT JOIN FETCH a.sections " +
            "WHERE a.id = :id")
    Article getArticleTextById(Long id);

    @Query("SELECT a FROM Article a LEFT JOIN FETCH a.text " +
            "                       LEFT JOIN FETCH a.sections AS sec " +
            "                       LEFT JOIN FETCH sec.multipleChoices " +
            "WHERE a.id = :id")
    Article getMultipleChoicesById(Long id);

    @Query("SELECT a FROM Article a LEFT JOIN FETCH a.text " +
            "                       LEFT JOIN FETCH a.sections " +
            "ORDER BY a.id")
    Set<Article> getArticlesWithTexts();

}

package com.oet.application.usecases.manageArticles.service;

import com.oet.application.common.BaseEntity;
import com.oet.application.common.ResponseTemplate;
import com.oet.application.entity.Student;
import com.oet.application.usecases.manageArticles.DTO.ArticleTitleAndIDDTO;
import com.oet.application.usecases.manageArticles.entity.Article;
import com.oet.application.usecases.manageArticles.entity.ArticleText;
import com.oet.application.usecases.manageArticles.entity.Section;
import com.oet.application.usecases.manageArticles.repository.ArticleRepository;
import com.oet.application.usecases.manageClasses.entity.Classroom;
import com.oet.application.usecases.manageClasses.repository.ClassroomRepository;
import com.oet.application.usecases.manageClasses.service.ClassroomService;
import com.oet.application.usecases.manageNotification.constant.NotificationEventType;
import com.oet.application.usecases.manageNotification.entity.Notification;
import com.oet.application.usecases.manageNotification.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.*;
import java.util.stream.Collectors;

import static com.oet.application.CommonEntities.*;
import static com.oet.application.common.CommonMessages.*;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class ArticleServiceTest {

    @Mock
    ArticleRepository articleRepository;

    @Mock
    ArticleTextService articleTextService;

    @InjectMocks
    ArticleService articleService;

    @Mock
    ClassroomService classroomService;

    Article article;
    ArticleText articleText;
    Section section;

    @BeforeEach
    void setUp() {
        article = getArticle();
        articleText = getArticleText();
        section = getSection();
    }

    @Test
    void create() {
        String username = "username";
        when(articleRepository.save(any())).thenReturn(article);

        Article response = articleService.create(article, username);

        assertEquals(article.getId(), response.getId());
        verify(classroomService).assignArticlesToClassrooms(List.of(article.getClassroomId()), article, username);
    }

    @Test
    void findAll() {
        when(articleRepository.getAllArticlesWithQuestions()).thenReturn(new HashSet<>());

        Set<Article> articles = articleService.findAll();

        assertEquals(0, articles.size());
    }

    @Test
    void findById() {
        when(articleRepository.getArticleByIdWithQuestions(anyLong())).thenReturn(article);

        Article response = articleService.findById(1L);

        assertEquals(article.getId(), response.getId());
    }

    @Test
    void deleteAll() {
        articleService.deleteAll();
        verify(articleRepository).deleteAll();
    }

    @Test
    void addTextToArticleNotFound() {
        when(articleRepository.findById(anyLong())).thenReturn(Optional.empty());

        ResponseEntity<ResponseTemplate> response = articleService.addTextToArticle(1L, articleText);

        assertEquals(ERROR, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(ARTICLE_NOT_FOUND, response.getBody().getMessage());
    }

    @Test
    void addTextToArticleNotFoundArticleText() {
        when(articleRepository.findById(anyLong())).thenReturn(Optional.of(article));
        when(articleTextService.findById(anyLong())).thenReturn(null);

        ResponseEntity<ResponseTemplate> response = articleService.addTextToArticle(1L, articleText);

        assertEquals(ERROR, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(TEXT_NOT_FOUND, response.getBody().getMessage());
    }

    @Test
    void addTextToArticleSuccess() {
        when(articleRepository.findById(anyLong())).thenReturn(Optional.of(article));
        when(articleTextService.findById(anyLong())).thenReturn(articleText);

        ResponseEntity<ResponseTemplate> response = articleService.addTextToArticle(1L, articleText);

        assertEquals(SUCCESS, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(TEXT_ADDED_TO_ARTICLE, response.getBody().getMessage());
    }

    @Test
    void addSectionToArticleNull() {
        when(articleRepository.getArticleTextById(anyLong())).thenReturn(null);

        ResponseEntity<ResponseTemplate> response = articleService.addSectionToArticle(1L, section);

        assertEquals(ERROR, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(ARTICLE_NOT_FOUND, response.getBody().getMessage());
    }

    @Test
    void addSectionToArticleSuccess() {
        when(articleRepository.getArticleTextById(anyLong())).thenReturn(article);

        ResponseEntity<ResponseTemplate> response = articleService.addSectionToArticle(1L, section);

        verify(articleRepository).save(any());
        assertEquals(SUCCESS, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(SECTION_IS_ADDED, response.getBody().getMessage());
    }

    @Test
    void getArticleTextNull() {
        when(articleRepository.getArticleTextById(anyLong())).thenReturn(null);

        ResponseEntity<ResponseTemplate> response = articleService.getArticleText(1L);

        assertEquals(ERROR, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(ARTICLE_NOT_FOUND, response.getBody().getMessage());
    }

    @Test
    void getArticleTextTextIsNull() {
        article.setText(null);
        when(articleRepository.getArticleTextById(anyLong())).thenReturn(article);

        ResponseEntity<ResponseTemplate> response = articleService.getArticleText(1L);

        assertEquals(ERROR, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(TEXT_IS_NOT_FOUND, response.getBody().getMessage());
    }

    @Test
    void getArticleTextSuccess() {
        when(articleRepository.getArticleTextById(anyLong())).thenReturn(article);

        ResponseEntity<ResponseTemplate> response = articleService.getArticleText(1L);

        assertEquals(SUCCESS, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(TEXT_IS_FOUND, response.getBody().getMessage());
    }

    @Test
    void getAssignmentListWithTitles() {
        when(articleRepository.getArticlesWithTexts()).thenReturn(Set.of(article));

        Set<ArticleTitleAndIDDTO> articleSet = articleService.getAssignmentListWithTitles();

        assertEquals(1, articleSet.size());
    }


}
package com.oet.application.usecases.manageComments.service;

import com.oet.application.common.ResponseTemplate;
import com.oet.application.entity.Student;
import com.oet.application.service.StudentService;
import com.oet.application.usecases.manageArticles.entity.Article;
import com.oet.application.usecases.manageArticles.service.ArticleService;
import com.oet.application.usecases.manageComments.entity.Comment;
import com.oet.application.usecases.manageComments.repository.CommentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import static com.oet.application.CommonEntities.*;
import static com.oet.application.common.CommonMessages.*;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock
    CommentRepository commentRepository;
    @Mock
    StudentService studentService;
    @Mock
    ArticleService articleService;
    @InjectMocks
    CommentService commentService;

    Student student;
    Article article;
    Comment comment;

    @BeforeEach
    void setUp() {
        student = getStudent();
        article = getArticle();
        comment = getComment();
    }

    @Test
    void saveNullArticle() {
        when(studentService.findByUsername(anyString())).thenReturn(student);
        when(articleService.findById(anyLong())).thenReturn(null);

        ResponseEntity<ResponseTemplate> response = commentService.save(1L, "username", comment);

        assertNull(response);
    }

    @Test
    void saveNullStudent() {
        when(studentService.findByUsername(anyString())).thenReturn(null);
        when(articleService.findById(anyLong())).thenReturn(article);

        ResponseEntity<ResponseTemplate> response = commentService.save(1L, "username", comment);

        assertNull(response);
    }

    @Test
    void saveNullArticleSuccess() {
        when(studentService.findByUsername(anyString())).thenReturn(student);
        when(articleService.findById(anyLong())).thenReturn(article);
        when(commentRepository.save(any())).thenReturn(comment);

        ResponseEntity<ResponseTemplate> response = commentService.save(1L, "username", comment);

        assertEquals(SUCCESS, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(COMMENT_SAVED, response.getBody().getMessage());
    }

    @Test
    void findAllByArticleIdAndUsername() {
        when(commentRepository.findAllByArticleIdAndUsername(anyLong(), anyString())).thenReturn(Set.of(comment));

        ResponseEntity<ResponseTemplate> response = commentService.findAllByArticleIdAndUsername(1L, "username");

        assertEquals(SUCCESS, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(RECORDS_FETCHED, response.getBody().getMessage());
        assertEquals(Set.of(comment), response.getBody().getData());
    }

    @Test
    void updateNull() {
        when(commentRepository.findByArticleIdAndUsernameAndCreationTimestamp(anyLong(), anyString(), anyLong())).thenReturn(Optional.empty());

        ResponseEntity<ResponseTemplate> response = commentService.update(1L, "username", comment);

        assertEquals(ERROR, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(COMMENT_DELETED, response.getBody().getMessage());
    }

    @Test
    void updateSuccess() {
        when(commentRepository.findByArticleIdAndUsernameAndCreationTimestamp(anyLong(), anyString(), anyLong())).thenReturn(Optional.of(comment));

        ResponseEntity<ResponseTemplate> response = commentService.update(1L, "username", comment);

        assertEquals(SUCCESS, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(COMMENT_UPDATED, response.getBody().getMessage());
    }

    @Test
    void deleteNull() {
        when(commentRepository.findByArticleIdAndUsernameAndCreationTimestamp(anyLong(), anyString(), anyLong())).thenReturn(Optional.empty());

        ResponseEntity<ResponseTemplate> response = commentService.delete(1L, "username", 1L);

        assertEquals(ERROR, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(COMMENT_NOT_FOUND, response.getBody().getMessage());
    }

    @Test
    void deleteSuccess() {
        when(commentRepository.findByArticleIdAndUsernameAndCreationTimestamp(anyLong(), anyString(), anyLong())).thenReturn(Optional.of(comment));

        ResponseEntity<ResponseTemplate> response = commentService.delete(1L, "username", 1L);

        assertEquals(SUCCESS, Objects.requireNonNull(response.getBody()).getType());
        assertEquals(COMMENT_DELETED, response.getBody().getMessage());
        verify(commentRepository).delete(any());
    }
}
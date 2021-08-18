package com.oet.application.usecases.manageAnswers.service;

import com.oet.application.common.ResponseTemplate;
import com.oet.application.entity.Student;
import com.oet.application.service.StudentService;
import com.oet.application.usecases.manageAnswers.entity.AnswerForm;
import com.oet.application.usecases.manageAnswers.repository.AnswerFormRepository;
import com.oet.application.usecases.manageArticles.entity.Article;
import com.oet.application.usecases.manageArticles.entity.Section;
import com.oet.application.usecases.manageArticles.service.ArticleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static com.oet.application.CommonEntities.*;
import static com.oet.application.common.CommonMessages.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AnswerFormServiceTest {

    @Mock
    AnswerFormRepository repository;

    @Mock
    StudentService studentService;

    @Mock
    ArticleService articleService;

    @InjectMocks
    AnswerFormService answerFormService;

    Student student;
    Article article;
    AnswerForm answerForm;
    AnswerForm completedAnswerForm;

    @BeforeEach
    void setUp() {
        student = getStudent();
        article = getArticle();
        answerForm = getNonCompleteAnswerForm();
        completedAnswerForm = getCompleteAnswerForm();
    }

    @Test
    void deleteAnswerFormsByUsernameNullStudent() {
        when(studentService.findByUsername(anyString())).thenReturn(null);

        ResponseTemplate responseTemplate = answerFormService.deleteAnswerFormsByUsername("");

        assertEquals(ERROR, responseTemplate.getType());
        assertEquals(RECORDS_NOT_DELETED, responseTemplate.getMessage());
    }

    @Test
    void deleteAnswerFormsByUsernameSuccess() {
        when(studentService.findByUsername(anyString())).thenReturn(student);

        ResponseTemplate responseTemplate = answerFormService.deleteAnswerFormsByUsername("");

        verify(repository).deleteAnswerFormsByStudentId(1L);
        assertEquals(SUCCESS, responseTemplate.getType());
        assertEquals(RECORDS_DELETED, responseTemplate.getMessage());
    }

    @Test
    void startAssignmentAlreadyCompleted() {
        when(repository.getAnswerFormByArticleIdAndAndStudentId(anyLong(), anyString())).thenReturn(completedAnswerForm);
        when(articleService.findById(1L)).thenReturn(article);
        ResponseTemplate responseTemplate = answerFormService.startAssignment(1L, "");

        assertEquals(WARNING, responseTemplate.getType());
        assertEquals(ANSWERS_ALREADY_SUBMITTED, responseTemplate.getMessage());
    }

    @Test
    void startAssignmentAlreadyCompletedWithSections() {
        article.setSections(getSectionSetWithQuestions());
        completedAnswerForm.setAnswerSections(getAnswerSectionSetWithAnswers());

        when(repository.getAnswerFormByArticleIdAndAndStudentId(anyLong(), anyString())).thenReturn(completedAnswerForm);
        when(articleService.findById(1L)).thenReturn(article);
        ResponseTemplate responseTemplate = answerFormService.startAssignment(1L, "");

        assertEquals(WARNING, responseTemplate.getType());
        assertEquals(ANSWERS_ALREADY_SUBMITTED, responseTemplate.getMessage());
    }

    @Test
    void startAssignmentNotCompleted() {
        when(repository.getAnswerFormByArticleIdAndAndStudentId(anyLong(), anyString())).thenReturn(answerForm);
        ResponseTemplate responseTemplate = answerFormService.startAssignment(1L, "");

        assertEquals(SUCCESS, responseTemplate.getType());
        assertEquals(ANSWER_FORM_FETCHED_SUCCESSFULLY, responseTemplate.getMessage());
    }

    @Test
    void startAssignmentNullAnswerForm() {
        when(repository.getAnswerFormByArticleIdAndAndStudentId(anyLong(), anyString())).thenReturn(null);
        when(studentService.findByUsername("")).thenReturn(null);

        ResponseTemplate responseTemplate = answerFormService.startAssignment(1L, "");

        assertEquals(ERROR, responseTemplate.getType());
        assertEquals(ANSWER_FORM_COULD_NOT_BE_FETCHED, responseTemplate.getMessage());
    }

    @Test
    void startAssignmentJustStarted() {
        when(repository.getAnswerFormByArticleIdAndAndStudentId(anyLong(), anyString())).thenReturn(null);
        when(studentService.findByUsername("")).thenReturn(student);
        when(articleService.findById(anyLong())).thenReturn(article);
        when(repository.save(any())).thenReturn(answerForm);

        ResponseTemplate responseTemplate = answerFormService.startAssignment(1L, "");

        assertEquals(SUCCESS, responseTemplate.getType());
        assertEquals(ANSWER_FORM_FETCHED_SUCCESSFULLY, responseTemplate.getMessage());
    }

    @Test
    void getPastAssignmentsEmptySet() {
        Set<AnswerForm> answerForms = Set.of();
        when(repository.findAnswerFormsByUsernameAndIsCompletedIsTrue("")).thenReturn(answerForms);

        ResponseTemplate responseTemplate = answerFormService.getPastAssignments("");

        assertEquals(WARNING, responseTemplate.getType());
        assertEquals(NO_RECORD, responseTemplate.getMessage());
    }

    @Test
    void getPastAssignmentsSuccess() {
        Set<AnswerForm> answerForms = Set.of(completedAnswerForm);
        when(repository.findAnswerFormsByUsernameAndIsCompletedIsTrue("")).thenReturn(answerForms);

        ResponseTemplate responseTemplate = answerFormService.getPastAssignments("");

        assertEquals(SUCCESS, responseTemplate.getType());
        assertEquals(PAST_ASSIGNMENTS_FETCHED, responseTemplate.getMessage());
    }
}
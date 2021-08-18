package com.oet.application.usecases.manageAnswers.service;

import com.oet.application.common.ResponseTemplate;
import com.oet.application.usecases.adjustLevel.service.LevelAdjustmentService;
import com.oet.application.usecases.manageAnswers.entity.AnswerForm;
import com.oet.application.usecases.manageAnswers.repository.AnswerFormRepository;
import com.oet.application.usecases.manageArticles.entity.Article;
import com.oet.application.usecases.manageArticles.service.ArticleService;
import com.oet.application.usecases.manageNotification.constant.NotificationEventType;
import com.oet.application.usecases.manageNotification.entity.Notification;
import com.oet.application.usecases.manageNotification.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static com.oet.application.CommonEntities.*;
import static org.mockito.Mockito.*;
import static com.oet.application.common.CommonMessages.*;

@ExtendWith(MockitoExtension.class)
class SubmitServiceTest {

    @Mock
    AnswerFormRepository repository;

    @Mock
    ArticleService articleService;

    @InjectMocks
    SubmitService submitService;

    @Mock
    NotificationService notificationService;

    @Mock
    LevelAdjustmentService levelAdjustmentService;

    AnswerForm completedAnswerForm;
    AnswerForm uncompletedAnswerForm;
    Article article;

    @BeforeEach
    void setUp() {
        completedAnswerForm = getCompleteAnswerForm();
        uncompletedAnswerForm = getNonCompleteAnswerForm();
        article = getArticle();
    }

    @Test
    void submitNullForm() {
        when(repository.getAnswerFormByArticleIdAndAndStudentId(anyLong(),anyString())).thenReturn(null);

        ResponseTemplate responseTemplate = submitService.submit(1L, "", uncompletedAnswerForm);

        assertEquals(ERROR, responseTemplate.getType());
        assertEquals(ANSWER_FORM_COULD_NOT_BE_FETCHED, responseTemplate.getMessage());
    }

    @Test
    void submitAlreadyCompletedForm() {
        when(repository.getAnswerFormByArticleIdAndAndStudentId(anyLong(),anyString())).thenReturn(completedAnswerForm);

        ResponseTemplate responseTemplate = submitService.submit(1L, "", uncompletedAnswerForm);

        assertEquals(ERROR, responseTemplate.getType());
        assertEquals(ANSWERS_ALREADY_SUBMITTED, responseTemplate.getMessage());
    }

    @Test
    void submitIdMismatch() {
        AnswerForm anotherAnswerForm = getNonCompleteAnswerForm();
        anotherAnswerForm.setId(20L);
        uncompletedAnswerForm.setId(10L);

        when(repository.getAnswerFormByArticleIdAndAndStudentId(anyLong(),anyString())).thenReturn(anotherAnswerForm);

        ResponseTemplate responseTemplate = submitService.submit(1L, "", uncompletedAnswerForm);

        assertEquals(ERROR, responseTemplate.getType());
        assertEquals(ERROR, responseTemplate.getMessage());
    }

    @Test
    void submitNullArticle() {
        uncompletedAnswerForm.setId(1L);
        uncompletedAnswerForm.setArticleId(1L);
        when(repository.getAnswerFormByArticleIdAndAndStudentId(anyLong(),anyString())).thenReturn(uncompletedAnswerForm);
        when(articleService.findById(anyLong())).thenReturn(null);

        ResponseTemplate responseTemplate = submitService.submit(1L, "", uncompletedAnswerForm);

        assertEquals(ERROR, responseTemplate.getType());
        assertEquals(ARTICLE_NOT_FOUND, responseTemplate.getMessage());
    }


    @Test
    void submitSuccess() {
        String username = "username";

        uncompletedAnswerForm.setId(1L);
        uncompletedAnswerForm.setArticleId(1L);
        uncompletedAnswerForm.getArticleText().setTitle("xxxx");
        when(repository.getAnswerFormByArticleIdAndAndStudentId(anyLong(),anyString())).thenReturn(uncompletedAnswerForm);
        when(articleService.findById(anyLong())).thenReturn(article);
        Notification notification = new Notification();
        when(notificationService.createNotification(username, uncompletedAnswerForm.getArticleText().getTitle(), NotificationEventType.ASSIGNMENT_COMPLETED)).
                thenReturn(notification);

        ResponseTemplate responseTemplate = submitService.submit(1L, username, uncompletedAnswerForm);

        assertEquals(SUCCESS, responseTemplate.getType());

        verify(notificationService).addAndSaveUserNotificationsByEventType(notification, null, uncompletedAnswerForm.getStudent().getClassroom().getInstructors(), uncompletedAnswerForm.getStudent().getClassroom().getId(), null);
    }

    @Test
    void submitSuccessWithMCSections() {
        String username = "username";

        uncompletedAnswerForm.setId(1L);
        uncompletedAnswerForm.setArticleId(1L);
        uncompletedAnswerForm.setAnswerSections(getAnswerSectionSetWithAnswers());
        uncompletedAnswerForm.getArticleText().setTitle("xxxx");
        article.setSections(getSectionSetWithQuestions());
        when(repository.getAnswerFormByArticleIdAndAndStudentId(anyLong(),anyString())).thenReturn(uncompletedAnswerForm);
        when(articleService.findById(anyLong())).thenReturn(article);
        Notification notification = new Notification();
        when(notificationService.createNotification(username, uncompletedAnswerForm.getArticleText().getTitle(), NotificationEventType.ASSIGNMENT_COMPLETED)).
                thenReturn(notification);


        ResponseTemplate responseTemplate = submitService.submit(1L, username, uncompletedAnswerForm);

        assertEquals(SUCCESS, responseTemplate.getType());

        verify(notificationService).addAndSaveUserNotificationsByEventType(notification, null, uncompletedAnswerForm.getStudent().getClassroom().getInstructors(), uncompletedAnswerForm.getStudent().getClassroom().getId(), null);
    }

}
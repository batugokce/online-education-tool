package com.oet.application.usecases.manageAnswers.service;

import com.oet.application.common.ResponseTemplate;
import com.oet.application.entity.Instructor;
import com.oet.application.usecases.adjustLevel.service.LevelAdjustmentService;
import com.oet.application.usecases.manageAnswers.DTO.PointDTO;
import com.oet.application.usecases.manageAnswers.DTO.ResultDTO;
import com.oet.application.usecases.manageAnswers.entity.AnswerForm;
import com.oet.application.usecases.manageAnswers.entity.AnswerSection;
import com.oet.application.usecases.manageAnswers.repository.AnswerFormRepository;
import com.oet.application.usecases.manageArticles.entity.Article;
import com.oet.application.usecases.manageArticles.entity.Section;
import com.oet.application.usecases.manageArticles.service.ArticleService;
import com.oet.application.usecases.manageNotification.constant.NotificationEventType;
import com.oet.application.usecases.manageNotification.entity.Notification;
import com.oet.application.usecases.manageNotification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Set;

import static com.oet.application.common.CommonMessages.*;
import static com.oet.application.common.LogMessages.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubmitService {

    private final AnswerFormRepository repository;
    private final ArticleService articleService;
    private final LevelAdjustmentService levelAdjustmentService;
    private final NotificationService notificationService;

    public ResponseTemplate submit(Long articleId, String username, AnswerForm answerForm) {
        AnswerForm formDB = repository.getAnswerFormByArticleIdAndAndStudentId(articleId, username);
        if (formDB == null) {
            log.info(String.format(L_ANSWERS_COULD_NOT_BE_FETCHED_TO_SUBMIT, username, articleId));
            return new ResponseTemplate(ERROR, ANSWER_FORM_COULD_NOT_BE_FETCHED, null);
        }
        else if (formDB.getIsCompleted()) {
            log.info(String.format(L_COULD_NOT_SUBMIT_ALREADY_SUBMITTED, username, articleId));
            return new ResponseTemplate(ERROR, ANSWERS_ALREADY_SUBMITTED, null);
        }
        else if (!formDB.getId().equals(answerForm.getId())) {
            log.info(String.format(L_UNKNOWN_ERROR_IN_SUBMIT, username, articleId));
            return new ResponseTemplate(ERROR, ERROR, null);
        }
        Article article = articleService.findById(answerForm.getArticleId());
        if (article == null) {
            log.info(String.format(L_ARTICLE_COULD_NOT_BE_FOUND_IN_SUBMIT, articleId, username));
            return new ResponseTemplate(ERROR,ARTICLE_NOT_FOUND, null);
        }

        return processAnswerForm(articleId, username, answerForm, formDB, article);
    }


    private ResponseTemplate processAnswerForm(Long articleId, String username, AnswerForm answerForm, AnswerForm formDB, Article article) {
        answerForm.setIsCompleted(true);
        answerForm.setStudent(formDB.getStudent());

        PointDTO pointDTO = new PointDTO(0,0);
        for (AnswerSection answerSection : answerForm.getAnswerSections()) {
            Section section1 = article.getSections().stream()
                    .filter(item -> item.getOrder().equals(answerSection.getOrder())).findFirst().orElse(null);
            if (section1 != null) {
                pointDTO = pointDTO.add(answerSection.calculatePoint(section1));
            }
        }
        answerForm.setStartTimestamp(formDB.getStartTimestamp());
        answerForm.setPointTaken(pointDTO.getPoint());
        answerForm.setMaxPoint(pointDTO.getMaxPoint());
        Long finishTimestamp = new Date().getTime();
        answerForm.setFinishTimestamp(finishTimestamp);
        repository.save(answerForm);

        article.setTimeTaken((finishTimestamp- answerForm.getStartTimestamp())/1000);
        if (!answerForm.isOnlyOneSectionAndWrittenType()) {
            levelAdjustmentService.adjustStudentLevel(username, pointDTO);
        }

        Notification notification = notificationService.createNotification(username, answerForm.getArticleText().getTitle(), NotificationEventType.ASSIGNMENT_COMPLETED);
        Set<Instructor> instructors = formDB.getStudent().getClassroom().getInstructors();
        notificationService.addAndSaveUserNotificationsByEventType(notification, null, instructors, formDB.getStudent().getClassroom().getId(), null);

        ResultDTO resultDTO = new ResultDTO(article, pointDTO);
        log.info(String.format(L_SUBMITTED_ASSIGNMENT, username, articleId));
        return new ResponseTemplate(SUCCESS, ANSWER_SUBMITTED_SUCCESSFULLY, resultDTO);
    }


}

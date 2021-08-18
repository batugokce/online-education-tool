package com.oet.application.usecases.manageAnswers.service;

import com.oet.application.common.ResponseTemplate;
import com.oet.application.usecases.manageAnswers.entity.AnswerForm;
import com.oet.application.usecases.manageAnswers.entity.AnswerSection;
import com.oet.application.usecases.manageAnswers.repository.AnswerFormRepository;
import com.oet.application.usecases.manageAnswers.repository.AnswerSectionRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

import static com.oet.application.common.CommonMessages.*;
import static com.oet.application.common.LogMessages.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnswerSavingService {

    private final AnswerFormRepository repository;
    private final AnswerSectionRepository answerSectionRepository;

    public ResponseTemplate saveAnswerForm(Long articleId, String username, AnswerForm answerForm) {
        AnswerForm returnedAnswerForm = repository.getAnswerFormByArticleIdAndAndStudentId(articleId, username);
        if (returnedAnswerForm == null) {
            log.info(String.format(L_ANSWER_FORM_COULD_NOT_BE_FOUND, username, articleId));
            return new ResponseTemplate(ERROR, ANSWER_FORM_COULD_NOT_BE_FETCHED, null);
        }
        if (returnedAnswerForm.getIsCompleted()) {
            log.info(String.format(L_ANSWER_HAS_ALREADY_SUBMITTED, username, articleId));
            return new ResponseTemplate(ERROR, ANSWERS_ALREADY_SUBMITTED, null);
        }
        else if (returnedAnswerForm.getId().equals(answerForm.getId())) {
            answerForm.setPointTaken(null);
            answerForm.setMaxPoint(null);
            answerForm.setStudent(returnedAnswerForm.getStudent());
            answerForm.setStartTimestamp(returnedAnswerForm.getStartTimestamp());
            LocalDateTime currentDate = LocalDateTime.now();
            DateTimeFormatter format = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
            String formattedDateTime = currentDate.format(format);
            answerForm.setLastSavedDate(formattedDateTime);
            repository.save(answerForm);
            log.info(String.format(L_ASSIGNMENT_SAVED, username, articleId));
            return new ResponseTemplate(SUCCESS, ANSWER_SAVED_SUCCESSFULLY, formattedDateTime);
        }
        log.info(String.format(L_UNKNOWN_ERROR, username, articleId));
        return new ResponseTemplate(SUCCESS, ANSWER_COULD_NOT_BE_SAVED, null);
    }

    public ResponseTemplate saveSection(Long articleId, String username, AnswerSection section) {
        AnswerForm answerForm = repository.getAnswerFormByArticleIdAndAndStudentId(articleId,username);
        if (answerForm.getIsCompleted()) {
            log.info(String.format(L_SECTION_ALREADY_SAVED, username, articleId));
            return new ResponseTemplate(ERROR, ANSWERS_ALREADY_SUBMITTED, null);
        }
        else if (answerSectionRepository.existsById(section.getId())) {
            LocalDateTime currentDate = LocalDateTime.now();
            DateTimeFormatter format = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
            String formattedDateTime = currentDate.format(format);
            section.setLastSavedDate(formattedDateTime);
            answerSectionRepository.save(section);
            answerForm.setLastSavedTime();
            repository.save(answerForm);
            log.info(String.format(L_SECTION_SAVED, username, articleId));
            return new ResponseTemplate(SUCCESS, SECTION_SAVED_SUCCESSFULLY, formattedDateTime);
        }

        log.info(String.format(L_COULD_NOT_SAVE_SECTION, username, articleId));
        return new ResponseTemplate(ERROR, SECTION_DOES_NOT_EXIST, null);
    }


}

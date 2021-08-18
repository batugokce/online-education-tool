package com.oet.application.unitTests;

import com.oet.application.common.ResponseTemplate;
import com.oet.application.entity.Student;
import com.oet.application.usecases.manageAnswers.entity.AnswerForm;
import com.oet.application.usecases.manageAnswers.entity.AnswerSection;
import com.oet.application.usecases.manageAnswers.repository.AnswerFormRepository;
import com.oet.application.usecases.manageAnswers.repository.AnswerSectionRepository;
import com.oet.application.usecases.manageAnswers.service.AnswerSavingService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;

import static com.oet.application.common.CommonMessages.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
public class  AnswerSavingServiceImplTest{

    @Mock
    AnswerFormRepository repository;

    @Mock
    AnswerSectionRepository answerSectionRepository;

    @InjectMocks
    AnswerSavingService answerSavingService;

    @Test
    public void testSaveAnswerFormSuccessfuly() {

        Long articleId = 1L;
        String username= "user1";

        Student student = new Student();
        student.setId(1L);
        student.setUsername("user1");

        AnswerForm answerForm = new AnswerForm(student, student.getId(), student.getUsername(), articleId, new HashSet<>(), null, false, null, null, null, null, 0L, new HashSet<>(), null,false,null);
        answerForm.setId(1L);

        Mockito.when(repository.getAnswerFormByArticleIdAndAndStudentId(articleId, username)).thenReturn(answerForm);

        ResponseTemplate responseTemplateActual = answerSavingService.saveAnswerForm(articleId, username, answerForm);

        LocalDateTime currentDate = LocalDateTime.now();
        DateTimeFormatter format = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
        String formattedDateTime = currentDate.format(format);

        ResponseTemplate responseTemplateExpected = new ResponseTemplate(SUCCESS, ANSWER_SAVED_SUCCESSFULLY, formattedDateTime);

        Mockito.verify(repository, Mockito.times(1)).getAnswerFormByArticleIdAndAndStudentId(articleId, username);

        assertEquals(responseTemplateExpected.getMessage(), responseTemplateActual.getMessage());
        assertEquals(responseTemplateExpected.getType(), responseTemplateActual.getType());
    }

    @Test
    public void testSaveAnswerFormNullCase() {

        Long articleId = 1L;
        String username= "user1";

        Student student = new Student();
        student.setId(1L);
        student.setUsername("user1");

        AnswerForm answerForm = new AnswerForm(student, student.getId(), student.getUsername(), articleId, new HashSet<>(), null, false, null, null, null, null, 0L, new HashSet<>(), null,false,null);
        answerForm.setId(1L);

        Mockito.when(repository.getAnswerFormByArticleIdAndAndStudentId(articleId, username)).thenReturn(null);

        ResponseTemplate responseTemplateActual = answerSavingService.saveAnswerForm(articleId, username, answerForm);

        ResponseTemplate responseTemplateExpected = new ResponseTemplate(ERROR, ANSWER_FORM_COULD_NOT_BE_FETCHED, null);

        Mockito.verify(repository, Mockito.times(1)).getAnswerFormByArticleIdAndAndStudentId(articleId, username);

        assertEquals(responseTemplateExpected.getMessage(), responseTemplateActual.getMessage());
        assertEquals(responseTemplateExpected.getData(), responseTemplateActual.getData());
        assertEquals(responseTemplateExpected.getType(), responseTemplateActual.getType());
    }

    @Test
    public void testSaveAnswerFormIsCompletedCase() {

        Long articleId = 1L;
        String username= "user1";

        Student student = new Student();
        student.setId(1L);
        student.setUsername("user1");

        AnswerForm answerForm = new AnswerForm(student, student.getId(), student.getUsername(), articleId, new HashSet<>(), null, false, null, null, null, null, 0L, new HashSet<>(), null,false,null);

        AnswerForm returnedAnswerForm = new AnswerForm(student, student.getId(), student.getUsername(), articleId, new HashSet<>(), null, true, null, null, null, null, 0L, new HashSet<>(), null,false,null);

        Mockito.when(repository.getAnswerFormByArticleIdAndAndStudentId(articleId, username)).thenReturn(returnedAnswerForm);

        ResponseTemplate responseTemplateActual = answerSavingService.saveAnswerForm(articleId, username, answerForm);

        ResponseTemplate responseTemplateExpected = new ResponseTemplate(ERROR, ANSWERS_ALREADY_SUBMITTED, null);

        Mockito.verify(repository, Mockito.times(1)).getAnswerFormByArticleIdAndAndStudentId(articleId, username);

        assertEquals(responseTemplateExpected.getMessage(), responseTemplateActual.getMessage());
        assertEquals(responseTemplateExpected.getData(), responseTemplateActual.getData());
        assertEquals(responseTemplateExpected.getType(), responseTemplateActual.getType());
    }

    @Test
    public void testSaveSectionSuccessfuly() {
        Long articleId = 1L;
        String username= "user1";

        Student student = new Student();
        student.setId(1L);
        student.setUsername("user1");

        AnswerForm answerForm = new AnswerForm(student, student.getId(), student.getUsername(), articleId, new HashSet<>(), null, false, null, null, null, null, 0L, new HashSet<>(), null,false,null);
        answerForm.setId(1L);

        AnswerSection answerSection = new AnswerSection(1, "", 100);
        answerSection.setId(1L);

        Mockito.when(repository.getAnswerFormByArticleIdAndAndStudentId(articleId, username)).thenReturn(answerForm);
        Mockito.when(answerSectionRepository.existsById(answerSection.getId())).thenReturn(true);

        ResponseTemplate responseTemplateActual = answerSavingService.saveSection(articleId, username, answerSection);

        LocalDateTime currentDate = LocalDateTime.now();
        DateTimeFormatter format = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
        String formattedDateTime = currentDate.format(format);

        ResponseTemplate responseTemplateExpected = new ResponseTemplate(SUCCESS, SECTION_SAVED_SUCCESSFULLY, formattedDateTime);

        Mockito.verify(repository,Mockito.times(1)).getAnswerFormByArticleIdAndAndStudentId(articleId, username);
        Mockito.verify(answerSectionRepository,Mockito.times(1)).existsById(answerSection.getId());

        assertEquals(responseTemplateExpected.getMessage(), responseTemplateActual.getMessage());
        assertEquals(responseTemplateExpected.getData(), responseTemplateActual.getData());
        assertEquals(responseTemplateExpected.getType(), responseTemplateActual.getType());
    }

    @Test
    public void testSaveSectionIsCompletedCase() {
        Long articleId = 1L;
        String username= "user1";

        Student student = new Student();
        student.setId(1L);
        student.setUsername("user1");

        AnswerForm answerForm = new AnswerForm(student, student.getId(), student.getUsername(), articleId, new HashSet<>(), null, true, null, null, null, null, 0L, new HashSet<>(), null,false,null);
        answerForm.setId(1L);

        AnswerSection answerSection = new AnswerSection(1, "", 100);
        answerSection.setId(1L);

        Mockito.when(repository.getAnswerFormByArticleIdAndAndStudentId(articleId, username)).thenReturn(answerForm);

        ResponseTemplate responseTemplateActual = answerSavingService.saveSection(articleId, username, answerSection);

        ResponseTemplate responseTemplateExpected = new ResponseTemplate(ERROR, ANSWERS_ALREADY_SUBMITTED, null);

        Mockito.verify(repository,Mockito.times(1)).getAnswerFormByArticleIdAndAndStudentId(articleId, username);

        assertEquals(responseTemplateExpected.getMessage(), responseTemplateActual.getMessage());
        assertEquals(responseTemplateExpected.getData(), responseTemplateActual.getData());
        assertEquals(responseTemplateExpected.getType(), responseTemplateActual.getType());
    }
}
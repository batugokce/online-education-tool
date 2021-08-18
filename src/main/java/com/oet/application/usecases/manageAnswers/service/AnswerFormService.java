package com.oet.application.usecases.manageAnswers.service;

import com.oet.application.common.ResponseTemplate;
import com.oet.application.entity.Student;
import com.oet.application.repository.InstructorRepository;
import com.oet.application.service.StudentService;
import com.oet.application.usecases.manageAnswers.DTO.*;
import com.oet.application.usecases.manageAnswers.entity.AnswerForm;
import com.oet.application.usecases.manageAnswers.entity.AnswerSection;
import com.oet.application.usecases.manageAnswers.entity.questiontypes.*;
import com.oet.application.usecases.manageAnswers.repository.AnswerFormRepository;
import com.oet.application.usecases.manageArticles.entity.*;
import com.oet.application.usecases.manageArticles.service.ArticleService;
import static com.oet.application.common.CommonMessages.*;
import static com.oet.application.common.LogMessages.*;

import com.oet.application.usecases.manageClasses.DTO.ClassroomForInstructorDTO;
import com.oet.application.usecases.manageClasses.entity.Classroom;
import com.oet.application.usecases.manageClasses.service.ClassroomService;
import com.oet.application.usecases.manageClasses.service.ListClassroomService;
import com.oet.application.usecases.manageClasses.service.ListClassroomForInstructorService;
import com.oet.application.usecases.manageNotification.constant.NotificationEventType;
import com.oet.application.usecases.manageNotification.entity.Notification;
import com.oet.application.usecases.manageNotification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.DecimalFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnswerFormService {

    private final AnswerFormRepository repository;
    private final StudentService studentService;
    private final ArticleService articleService;
    private final ClassroomService classroomService;
    private final ListClassroomService listClassroomService;
    private final InstructorRepository instructorRepository;
    private final NotificationService notificationService;

    @Transactional
    public ResponseTemplate deleteAnswerFormsByUsername(String username) {
        Student student = studentService.findByUsername(username);
        if (student != null) {
            repository.deleteAnswerFormsByStudentId(student.getId());
            log.info(String.format(L_ANSWERS_DELETED, username));
            return new ResponseTemplate(SUCCESS, RECORDS_DELETED, null);
        }
        log.info(String.format(L_ANSWERS_COULD_NOT_BE_DELETED, username));
        return new ResponseTemplate(ERROR, RECORDS_NOT_DELETED, null);
    }

    public ResponseTemplate startAssignment(Long articleId, String username) {
        AnswerForm form = repository.getAnswerFormByArticleIdAndAndStudentId(articleId, username);
        Article article = articleService.findById(articleId);

        if (form == null) {
            form = prepareAnswerForm(articleId, username);
            if (form == null) {
                log.info(String.format(L_COULD_NOT_START_ASSIGNMENT, username, articleId));
                return new ResponseTemplate(ERROR, ANSWER_FORM_COULD_NOT_BE_FETCHED, null);
            } else {
                log.info(String.format(L_STARTED_ASSIGNMENT, username, articleId));
                return new ResponseTemplate(SUCCESS, ANSWER_FORM_FETCHED_SUCCESSFULLY, form);
            }
        }
        if (form.getIsCompleted()) {
            log.info(String.format(L_RETRIEVED_RESULTS, username, articleId));
            return retrieveResults(articleId, form);
        }
        Long currentTimestamp = new Date().getTime();
        form.setTimeTaken((currentTimestamp - form.getStartTimestamp()) / 1000);
        if (null != article) {
            form.setDefinitions(article.getDefinitions());
        }
        log.info(String.format(L_CONTINUED_ASSIGNMENT, username, articleId));

        return new ResponseTemplate(SUCCESS, ANSWER_FORM_FETCHED_SUCCESSFULLY, form);
    }
    public boolean checkIfCompleted(String username,Long articleId){
        AnswerForm form = repository.getAnswerFormByArticleIdAndAndStudentId(articleId, username);
       if(form==null){
           return false;
       }
        else if (form.getIsCompleted()) {
            return true;
        }
        return false;
    }
    public Set<AnswerForm> getStudentCompletedAssignements(String username){
        Set<AnswerForm> forms=repository.getAnswerFormByUsername(username);
        Set<AnswerForm> completedForms=new HashSet<AnswerForm>();
        for(AnswerForm form:forms){
            if(form.getIsCompleted())
                completedForms.add(form);
        }
        return completedForms;
    }
    private ResponseTemplate retrieveResults(Long articleId, AnswerForm form) {
        Article article = articleService.findById(articleId);
        insertStudentAnswersToArticle(article, form);
        PointDTO pointDTO = new PointDTO(form.getPointTaken(), form.getMaxPoint());
        return new ResponseTemplate(WARNING, ANSWERS_ALREADY_SUBMITTED, new ResultDTO(article, pointDTO));
    }

    private void insertStudentAnswersToArticle(Article article, AnswerForm form) {
        for (AnswerSection answerSection : form.getAnswerSections()) {
            Section section = article.getSections().stream()
                    .filter(item -> item.getOrder().equals(answerSection.getOrder())).findFirst().orElse(null);
            if (section != null) {
                if (section.getMultipleChoices().size() > 0) {
                    for (MultipleChoiceAnswer multipleChoiceAnswer : answerSection.getMultipleChoiceAnswers()) {
                        MultipleChoice question = section.getMultipleChoices().stream().filter(item -> item.getNum().equals(multipleChoiceAnswer.getNum())).findFirst().orElse(null);
                        if (question != null) {
                            question.setStudentAnswer(multipleChoiceAnswer.getStudentAnswer());
                        }
                    }
                } else if (section.getOrderings().size() > 0) {
                    for (OrderingAnswer orderingAnswer : answerSection.getOrderingAnswers()) {
                        Ordering ordering = section.getOrderings().stream()
                                .filter(item -> item.getText().equals(orderingAnswer.getText())).findFirst().orElse(null);
                        if (ordering != null) {
                            ordering.setStudentOrder(orderingAnswer.getStudentOrder());
                        }
                    }
                } else if (section.getTrueFalses().size() > 0) {
                    for (TrueFalseAnswer trueFalseAnswer : answerSection.getTrueFalseAnswers()) {
                        TrueFalse question = section.getTrueFalses().stream().filter(item -> item.getText().equals(trueFalseAnswer.getText())).findFirst().orElse(null);
                        if (trueFalseAnswer.getStudentAnswer() != null && question != null) {
                            question.setStudentAnswer(trueFalseAnswer.getStudentAnswer());
                        }
                    }
                } else if (section.getMatchings().size() > 0) {
                    for (MatchingAnswer matchingAnswer : answerSection.getMatchingAnswers()) {
                        Matching question = section.getMatchings().stream().filter(item -> item.getNumber() == matchingAnswer.getNumber()).findFirst().orElse(null);
                        if (question != null) {
                            question.setStudentRightPart(matchingAnswer.getStudentRightPart());
                            question.setRandomRightPart(matchingAnswer.getRandomRightPart());
                        }
                    }
                } else if (section.getGapFillingMain() != null) {
                    for (GapFillingAnswer gapFillingAnswer : answerSection.getGapFillingMain().getGapFillingAnswers()) {
                        GapFilling question = section.getGapFillingMain().getGapFillings().stream().filter(item -> item.getNum().equals(gapFillingAnswer.getNum())).findFirst().orElse(null);
                        if (question != null) {
                            question.setStudentAnswer(gapFillingAnswer.getStudentAnswer());
                        }
                    }
                } else if (section.getWrittenQuestion() != null) {
                    section.getWrittenQuestion().setStudentAnswer(answerSection.getWrittenAnswer().getText());
                    section.getWrittenQuestion().setGraded(answerSection.getWrittenAnswer().getGraded());
                    section.getWrittenQuestion().setPoint(answerSection.getWrittenAnswer().getPoint());
                    section.getWrittenQuestion().setInstructorFeedback(answerSection.getWrittenAnswer().getInstructorFeedback());
                    section.getWrittenQuestion().setFeedbackVersion(answerSection.getWrittenAnswer().getFeedbackVersion());
                }
            }
        }
        article.setTimeTaken((form.getFinishTimestamp() - form.getStartTimestamp()) / 1000);
    }

    private AnswerForm prepareAnswerForm(Long articleId, String username) {
        Student student = studentService.findByUsername(username);
        Article article = articleService.findById(articleId);

        if (article == null || student == null) {
            return null;
        }

        Date date = new Date();
        Long startTimestamp = date.getTime();

        AnswerForm form = new AnswerForm(student, student.getId(), student.getUsername(), articleId, new HashSet<>(), article.getText(), false, startTimestamp, null, null, null, 0L, new HashSet<>(), null,false,null);
        Set<AnswerSection> answerSections = new HashSet<>();

        for (Section section : article.getSections()) {
            AnswerSection answerSection = section.mapToAnswerSection();
            answerSection.setMultipleChoiceAnswers(section.getMultipleChoices().stream().map(MultipleChoice::mapToAnswer).collect(Collectors.toSet()));
            answerSection.setOrderingAnswers(section.getOrderings().stream().map(Ordering::mapToAnswer).collect(Collectors.toSet()));
            answerSection.setTrueFalseAnswers(section.getTrueFalses().stream().map(TrueFalse::mapToAnswer).collect(Collectors.toSet()));
            answerSection.setMatchingAnswers(section.getMatchings().stream().map(Matching::mapToAnswer).collect(Collectors.toSet()));
            if (section.getMatchings().size() > 0) {
                List<String> rightParts = section.getMatchings().stream().map(Matching::getRightPart).collect(Collectors.toList());
                Collections.shuffle(rightParts);

                int i = 0;
                for (MatchingAnswer matchingAnswer : answerSection.getMatchingAnswers()) {
                    matchingAnswer.setRandomRightPart(rightParts.get(i++));
                }
            }
            if (section.getGapFillingMain() != null) {
                answerSection.setGapFillingMain(section.getGapFillingMain().mapToAnswer());
            }
            if (section.getWrittenQuestion() != null) {
                answerSection.setWrittenAnswer(section.getWrittenQuestion().mapToAnswer());
            }

            answerSections.add(answerSection);
        }
        form.setAnswerSections(answerSections);
        form = repository.save(form);
        form.setTimeTaken(0L);
        form.setDefinitions(article.getDefinitions());
        return form;
    }

    public ResponseTemplate getPastAssignments(String username) {
        Set<AnswerForm> answerForms = repository.findAnswerFormsByUsernameAndIsCompletedIsTrue(username);
        List<Long> articleIDs = answerForms.stream()
                .filter(AnswerForm::getIsCompleted)
                .map(AnswerForm::getArticleId).collect(Collectors.toList());

        List<AssignmentSummary> assignmentSummaries = repository.calculateAveragePoints(articleIDs);

        if (articleIDs.size() > 0) {
            List<GradesDTO> grades = answerForms.stream()
                    .map(item -> new GradesDTO(item.getArticleId(), String.format("%.2f", item.getPointTaken()), item.getMaxPoint(), "", item.getArticleText().getTitle(),item.getFeedbackGiven(),0.0))
                    .collect(Collectors.toList());

            for (GradesDTO item : grades) {
                AssignmentSummary summary = assignmentSummaries.stream()
                        .filter(tmp -> tmp.getArticleId().equals(item.getArticleId()))
                        .findFirst().orElse(null);
                if (summary != null) {
                    item.setAverage(String.format("%.2f (%d)", summary.getAverage(), summary.getCnt()));
                    item.setAverageValue(summary.getAverage());
                }
            }
            log.info(String.format(L_RETRIEVED_PAST_ASSIGNMENTS, username));
            return new ResponseTemplate(SUCCESS, PAST_ASSIGNMENTS_FETCHED, grades);
        } else {
            log.info(String.format(L_NO_PAST_ASSIGNMENT, username));
            return new ResponseTemplate(WARNING, NO_RECORD, null);
        }

    }

    @Transactional(readOnly=true)
    public ResponseTemplate getWrittenAssignmentDTOsByClassIdAndAssignmentId(Long classId, Long articleId) {
        List<Student> studentList = classroomService.getStudentListByClassId(classId);
        if (studentList != null && !studentList.isEmpty()) {
            List<WrittenAssignmentDTO> writtenAssignmentDTOList = new ArrayList<>();
            studentList.forEach(student -> {
                WrittenAssignmentDTO writtenAssignmentDTO = getWrittenAssignmentByUsernameAndAssignmentId(student.getUsername(), articleId);
                if (writtenAssignmentDTO != null) {
                    writtenAssignmentDTOList.add(writtenAssignmentDTO);
                }
            });
            if (writtenAssignmentDTOList.isEmpty()) {
                return new ResponseTemplate(WARNING, NO_RECORD, null);
            } else {
                log.info(String.format(L_WRITTEN_ASSIGNMENTS_RETRIEVED, classId, articleId));
                return new ResponseTemplate(SUCCESS, WRITTEN_ASSIGNMENTS_FETCHED, writtenAssignmentDTOList);
            }

        } else {
            return new ResponseTemplate(ERROR, STUDENT_LIST_NOT_FOUND, null);
        }
    }

    private WrittenAssignmentDTO getWrittenAssignmentByUsernameAndAssignmentId(String username, Long articleId) {
        //it is assumed that the article with this article id contains only one written type section
        Student student = studentService.findByUsername(username);
        AnswerForm form = repository.getWrittenAssignmentByArticleIdAndAndUsername(articleId, username);
        if (form != null && !form.getAnswerSections().isEmpty()) {
            WrittenAnswer writtenAnswer = form.getAnswerSections().iterator().next().getWrittenAnswer();
            String feedbackGiven;
            if (writtenAnswer.getProgressiveGrading() && writtenAnswer.getFeedbackVersion() == 1) {
                feedbackGiven = (!writtenAnswer.getInstructorFeedback().isEmpty()) ? "yes" : "no";
            }
            else feedbackGiven = form.getFeedbackGiven() ? "yes" : "no";
            return new WrittenAssignmentDTO(form.getArticleId(), form.getArticleText().getTitle(), form.getUsername(), student.getClassroom().getClassName(), writtenAnswer.getGraded(), writtenAnswer.getPoint(), feedbackGiven, writtenAnswer.getFeedbackVersion(), writtenAnswer.getProgressiveGrading());
        } else {
            return null;
        }

    }

    @Transactional(readOnly=true)
    public ResponseTemplate getWrittenAssignmentByArticleIdAndUsername(Long articleId, String username) {
        //it is assumed that the article with this article id contains only one written type section
        AnswerForm form = repository.getWrittenAssignmentByArticleIdAndAndUsername(articleId, username);
        if (form != null && form.getAnswerSections().iterator().next().getWrittenAnswer() != null) {
            WrittenAnswerDTO writtenAnswerDTO = new WrittenAnswerDTO(form.getAnswerSections().iterator().next().getWrittenAnswer(), form.getFeedbackGiven(), form.getFeedback(), form.getIsCompleted(), form.getArticleText().getTitle(), form.getUsername(), form.getArticleId(), form.getMaxPoint());
            return new ResponseTemplate(SUCCESS, ASSIGNMENT_FETCHED, writtenAnswerDTO);
        } else {
            return new ResponseTemplate(ERROR, ASSIGNMENT_NOT_FOUND, null);
        }
    }

    public ResponseTemplate saveFeedback(Long articleId, String studentUsername, String instructorUsername, WrittenAssignmentDTO writtenAssignmentDTO) {
        //it is assumed that the article with this article id contains only one written type section
        AnswerForm form = repository.getAnswerFormByArticleIdAndAndStudentId(articleId, studentUsername);
        if (form != null) {
            if (form.getIsCompleted() && !form.getAnswerSections().isEmpty()) {
                WrittenAnswer writtenAnswer = form.getAnswerSections().iterator().next().getWrittenAnswer();
                if (writtenAnswer != null) {
                    if (writtenAnswer.getProgressiveGrading() && ( writtenAnswer.getFeedbackVersion() == 0)) {
                       form.setIsCompleted(false);
                    }
                    writtenAnswer.setGraded(writtenAssignmentDTO.getGraded());
                    if (writtenAnswer.getProgressiveGrading() && ( writtenAnswer.getFeedbackVersion() == 0)) {
                        // set as prev feedback and show it to student
                        writtenAnswer.setInstructorFeedback(writtenAssignmentDTO.getFeedbackGiven());
                    } else {
                        form.setFeedbackGiven(true);
                        form.setFeedback(writtenAssignmentDTO.getFeedbackGiven());
                    }

                    writtenAnswer.setFeedbackVersion(writtenAssignmentDTO.getFeedbackVersion()); //TODO::do not forget to increment with one
                    if (writtenAssignmentDTO.getGraded()) {
                        writtenAnswer.setPoint(writtenAssignmentDTO.getPoint());
                        form.setPointTaken(writtenAssignmentDTO.getPoint());
                    }

                    form = repository.save(form);
                    log.info(String.format(L_FEEDBACK_SAVED, instructorUsername, studentUsername, articleId));
                    Notification notification = notificationService.createNotification(instructorUsername, form.getArticleText().getTitle(), NotificationEventType.NEW_FEEDBACK);
                    notificationService.addAndSaveUserNotificationsByEventType(notification, null, null, null, studentUsername);
                    return new ResponseTemplate(SUCCESS, FEEDBACK_SAVED, form);
                }
                log.info(String.format(L_COULD_NOT_SAVE_FEEDBACK, instructorUsername, studentUsername, articleId));
            }
            else {
                return new ResponseTemplate(ERROR, ASSIGNMENT_NOT_COMPLETED_YET, null);
            }

        } else  {
            return new ResponseTemplate(ERROR, ANSWER_FORM_COULD_NOT_BE_FETCHED, null);
        }
        return null;
    }
    public ResponseTemplate getAllAssignmentsByUsername(String username){
        Set<Classroom> classroomList=instructorRepository.findByUsername(username).getClassrooms();
        if(classroomList!=null && !classroomList.isEmpty()){
            List<AssignmentDTO> assignmentList = new ArrayList<>();
            classroomList.forEach(classroom -> {
                    Set<Student> students=classroom.getStudents();
                    if(students!=null && !students.isEmpty()){
                        students.forEach(student -> {
                            Set<AnswerForm> answerforms=repository.getAnswerFormByUsernameAndIsCompleted(student.getId());
                            if(answerforms!=null && !answerforms.isEmpty()){
                                answerforms.forEach(answerForm -> {
                                    try {
                                        WrittenAnswer writtenAnswer = answerForm.getAnswerSections().iterator().next().getWrittenAnswer();
                                        if(writtenAnswer!=null)
                                            assignmentList.add(new AssignmentDTO(classroom.getId(), classroom.getClassName(), student.getId(), student.getName(), student.getSurname(), student.getStudentNo(), answerForm.getArticleText().getTitle(), true,new Feedback2DTO( answerForm.getArticleId(),student.getUsername()),answerForm.getFeedbackGiven()));
                                        else
                                            assignmentList.add(new AssignmentDTO(classroom.getId(), classroom.getClassName(), student.getId(), student.getName(), student.getSurname(), student.getStudentNo(), answerForm.getArticleText().getTitle(), false,new Feedback2DTO( answerForm.getArticleId(),student.getUsername()),answerForm.getFeedbackGiven()));
                                    }
                                    catch(NoSuchElementException e){
                                        assignmentList.add(new AssignmentDTO(classroom.getId(), classroom.getClassName(), student.getId(), student.getName(), student.getSurname(), student.getStudentNo(), answerForm.getArticleText().getTitle(), false,new Feedback2DTO( answerForm.getArticleId(),student.getUsername()),answerForm.getFeedbackGiven()));
                                    }
                                });
                            }
                        });
                    }

                }

            );
            return new ResponseTemplate(SUCCESS,RECORDS_FETCHED,assignmentList);
        }
        else{
            return new ResponseTemplate(ERROR,ERROR,null);
        }
    }
    public ResponseTemplate saveFeedbackOfTest(FeedbackDTO feedbackDTO, String instructorUsername){
        AnswerForm form = repository.getAnswerFormByArticleIdAndAndStudentId(feedbackDTO.getArticleId(), feedbackDTO.getUsername());
        if (form != null) {
            if (form.getIsCompleted() && !form.getAnswerSections().isEmpty()) {
                form.setFeedbackGiven(true);
                form.setFeedback(feedbackDTO.getFeedback());
                repository.save(form);
                Notification notification = notificationService.createNotification(instructorUsername, form.getArticleText().getTitle(), NotificationEventType.NEW_FEEDBACK);
                notificationService.addAndSaveUserNotificationsByEventType(notification, null, null, null, feedbackDTO.getUsername());
                return new ResponseTemplate(SUCCESS, FEEDBACK_SAVED, form);
            }
            else{
                return new ResponseTemplate(ERROR, ASSIGNMENT_NOT_COMPLETED_YET, null);
            }
        }
        else{
            return new ResponseTemplate(ERROR, ANSWER_FORM_COULD_NOT_BE_FETCHED, null);
        }
    }
    public ResponseTemplate getFeedback(Long articleId,String username){
        AnswerForm form = repository.getAnswerFormByArticleIdAndAndStudentId(articleId, username);
        if (form != null) {
            if (form.getIsCompleted() && !form.getAnswerSections().isEmpty()) {
                return new ResponseTemplate(SUCCESS, SUCCESS, form.getFeedback());
            }
        }

        return new ResponseTemplate(ERROR, ANSWER_FORM_COULD_NOT_BE_FETCHED, null);

    }

    @Transactional(readOnly=true)
    public ResponseTemplate getWrittenAssignmentOfInstructorClasses(String instructorUsername) {
        Set<ClassroomForInstructorDTO> classrooms = listClassroomService.listClassroomsForInstructor(instructorUsername);
        List<Student> studentList = new ArrayList<>();
        classrooms.forEach(classroomForInstructorDTO -> {
            long classId = classroomForInstructorDTO.getId();
            studentList.addAll(classroomService.getStudentListByClassId(classId));
        });

        List<WrittenAssignmentDTO> writtenAssignmentDTOList = new ArrayList<>();
        if (studentList != null && !studentList.isEmpty()) {
            studentList.forEach(student -> {
                List<WrittenAssignmentDTO> writtenAssignmentDTOs = getWrittenAssignmentsByUsername(student.getUsername());
                if (!writtenAssignmentDTOs.isEmpty()) {
                    writtenAssignmentDTOList.addAll(writtenAssignmentDTOs);
                }
            });
            if (writtenAssignmentDTOList.isEmpty()) {
                return new ResponseTemplate(WARNING, NO_RECORD, null);
            } else {
                log.info(String.format(L_WRITTEN_ASSIGNMENTS_RETRIEVED_BY_INSTRUCTOR, instructorUsername));
                return new ResponseTemplate(SUCCESS, WRITTEN_ASSIGNMENTS_FETCHED, writtenAssignmentDTOList);
            }

        } else {
            return new ResponseTemplate(ERROR, STUDENT_LIST_NOT_FOUND, null);
        }
    }

    private List<WrittenAssignmentDTO> getWrittenAssignmentsByUsername(String studentUsername) {
        Student student = studentService.findByUsername(studentUsername);
        List<WrittenAssignmentDTO> writtenAssignmentDTOS = new ArrayList<>();
        //find assigned article-ids to student's class
        Set<AnswerForm> answerForms = repository.findAnswerFormsByUsernameAndIsCompletedIsTrue(studentUsername);

        answerForms.forEach(form-> {
            if (form != null && form.isOnlyOneSectionAndWrittenType() && form.getIsCompleted()) {
                WrittenAnswer writtenAnswer = form.getAnswerSections().iterator().next().getWrittenAnswer();
                String feedbackGiven;
                if (writtenAnswer.getProgressiveGrading() && writtenAnswer.getFeedbackVersion() == 1) {
                    feedbackGiven = (!writtenAnswer.getInstructorFeedback().isEmpty()) ? "yes" : "no";
                }
                else feedbackGiven = form.getFeedbackGiven() ? "yes" : "no";
                writtenAssignmentDTOS.add(new WrittenAssignmentDTO(form.getArticleId(), form.getArticleText().getTitle(), form.getUsername(), student.getClassroom().getClassName(), writtenAnswer.getGraded(), writtenAnswer.getPoint(), feedbackGiven, writtenAnswer.getFeedbackVersion(), writtenAnswer.getProgressiveGrading()));
            }
        });

        return writtenAssignmentDTOS;
    }

    private List<WrittenAssignmentDTO> getWrittenAssignmentsByStudentNumber(String studentNumber) {
        Student student = studentService.findByStudentNo(studentNumber);
        List<WrittenAssignmentDTO> writtenAssignmentDTOS = new ArrayList<>();
        //find assigned article-ids to student's class
        List<AnswerForm> answerForms = new ArrayList<>( repository.findAnswerFormsByUsernameAndIsCompletedIsTrue(student.getUsername()).stream().collect(Collectors.toList()));

        answerForms.forEach(form-> {
            if (form != null && form.isOnlyOneSectionAndWrittenType() && form.getIsCompleted()) {
                WrittenAnswer writtenAnswer = form.getAnswerSections().iterator().next().getWrittenAnswer();
                String feedbackGiven;
                if (writtenAnswer.getProgressiveGrading() && writtenAnswer.getFeedbackVersion() == 1) {
                    feedbackGiven = (!writtenAnswer.getInstructorFeedback().isEmpty()) ? "yes" : "no";
                }
                else feedbackGiven = form.getFeedbackGiven() ? "yes" : "no";
                writtenAssignmentDTOS.add(new WrittenAssignmentDTO(form.getArticleId(), form.getArticleText().getTitle(), form.getUsername(), student.getClassroom().getClassName(), writtenAnswer.getGraded(), writtenAnswer.getPoint(), feedbackGiven, writtenAnswer.getFeedbackVersion(), writtenAnswer.getProgressiveGrading()));
            }
        });

        return writtenAssignmentDTOS;
    }

    public ResponseTemplate getWrittenAssignmentOfInstructorClassesByParameters(String instructorUsername, GetWrittenAssignmentDTO getWrittenAssignmentDTO) {
        List<WrittenAssignmentDTO> writtenAssignmentDTOList = new ArrayList<>();
         if( !getWrittenAssignmentDTO.getStudentNumber().isEmpty()) {
             writtenAssignmentDTOList = getWrittenAssignmentsByStudentNumber(getWrittenAssignmentDTO.getStudentNumber());
             if(!getWrittenAssignmentDTO.getAssignmentName().isEmpty()) {
                 writtenAssignmentDTOList = new ArrayList<>(writtenAssignmentDTOList.stream().filter(writtenAssignmentDTO ->
                         writtenAssignmentDTO.getTitle().equals(getWrittenAssignmentDTO.getAssignmentName())
                 ).collect(Collectors.toList())) ;
             }
             if(!getWrittenAssignmentDTO.getClassName().isEmpty()) {
                 writtenAssignmentDTOList = new ArrayList<>(writtenAssignmentDTOList.stream().filter(writtenAssignmentDTO ->
                         writtenAssignmentDTO.getClassName().equals(getWrittenAssignmentDTO.getClassName())
                 ).collect(Collectors.toList()));
             }
         }
         else if(!getWrittenAssignmentDTO.getAssignmentName().isEmpty()) {
             writtenAssignmentDTOList = getWrittenAssignmentByAssignmentName(getWrittenAssignmentDTO.getAssignmentName());

             if(!getWrittenAssignmentDTO.getClassName().isEmpty()) {
                 writtenAssignmentDTOList = new ArrayList<>(writtenAssignmentDTOList.stream().filter(writtenAssignmentDTO ->
                     writtenAssignmentDTO.getClassName().equals(getWrittenAssignmentDTO.getClassName())
                 ).collect(Collectors.toList()));
             }
         }
         else if(!getWrittenAssignmentDTO.getClassName().isEmpty()) {
             writtenAssignmentDTOList = getWrittenAssignmentsByClassName(getWrittenAssignmentDTO.getClassName());
         }

        if (writtenAssignmentDTOList.isEmpty()) {
            return new ResponseTemplate(WARNING, NO_RECORD, null);
        } else {
            log.info(String.format(L_WRITTEN_ASSIGNMENTS_RETRIEVED_BY_INSTRUCTOR, instructorUsername));
            return new ResponseTemplate(SUCCESS, WRITTEN_ASSIGNMENTS_FETCHED, writtenAssignmentDTOList);
        }

    }

    private List<WrittenAssignmentDTO> getWrittenAssignmentByAssignmentName(String articleName) {
        List<WrittenAssignmentDTO> writtenAssignmentDTOList = new ArrayList<>();

        List<AnswerForm> forms = repository.getWrittenAssignmentsByArticleName(articleName);
        if (!forms.isEmpty()) {
            forms.forEach(form -> {
                WrittenAnswer writtenAnswer = form.getAnswerSections().iterator().next().getWrittenAnswer();
                String feedbackGiven;
                if (writtenAnswer.getProgressiveGrading() && writtenAnswer.getFeedbackVersion() == 1) {
                    feedbackGiven = (!writtenAnswer.getInstructorFeedback().isEmpty()) ? "yes" : "no";
                }
                else feedbackGiven = form.getFeedbackGiven() ? "yes" : "no";
                Student student = studentService.findByUsername(form.getUsername());
               writtenAssignmentDTOList.add(new WrittenAssignmentDTO(form.getArticleId(), form.getArticleText().getTitle(), form.getUsername(), student.getClassroom().getClassName(), writtenAnswer.getGraded(), writtenAnswer.getPoint(), feedbackGiven, writtenAnswer.getFeedbackVersion(), writtenAnswer.getProgressiveGrading()));
            });
        }
        return writtenAssignmentDTOList;
    }

    private List<WrittenAssignmentDTO> getWrittenAssignmentsByClassName(String className) {
        Classroom classFromDB = classroomService.findByClassName(className);
        long classId = classFromDB.getId();
        List<Student> studentList = classroomService.getStudentListByClassId(classId);


        List<WrittenAssignmentDTO> writtenAssignmentDTOList = new ArrayList<>();
        if (studentList != null && !studentList.isEmpty()) {
            studentList.forEach(student -> {
                List<WrittenAssignmentDTO> writtenAssignmentDTOs = getWrittenAssignmentsByUsername(student.getUsername());
                if (!writtenAssignmentDTOs.isEmpty()) {
                    writtenAssignmentDTOList.addAll(writtenAssignmentDTOs);
                }
            });
        }
        return writtenAssignmentDTOList;
    }
    @Transactional(readOnly=true)
    public ResponseTemplate getAssignmentsByUsername(String instructorUsername){
        Set<ClassroomForInstructorDTO> classrooms = listClassroomService.listClassroomsForInstructor(instructorUsername);
        List<Student> students=new ArrayList<>();
        List<AssignmentListDTO> assignmentListDTOS=new ArrayList<>();
        classrooms.forEach(classroomForInstructorDTO -> {
            long classId = classroomForInstructorDTO.getId();
            if(classroomService.getStudentListByClassId(classId)!=null)
            students.addAll(classroomService.getStudentListByClassId(classId));
        });
        if (students != null && !students.isEmpty()) {
            students.forEach(student->{
                Set<AnswerForm> answerForms = repository.findAnswerFormsByUsernameAndIsCompletedIsTrue(student.getUsername());
                answerForms.forEach(form -> {
                    if (form != null && form.isOnlyOneSectionAndWrittenType() && form.getIsCompleted()){
                        WrittenAnswer writtenAnswer = form.getAnswerSections().iterator().next().getWrittenAnswer();
                        String feedbackGiven;
                        if (writtenAnswer.getProgressiveGrading() && writtenAnswer.getFeedbackVersion() == 1) {
                            feedbackGiven = (!writtenAnswer.getInstructorFeedback().isEmpty()) ? "yes" : "no";
                        }
                        else feedbackGiven = form.getFeedbackGiven() ? "yes" : "no";
                        assignmentListDTOS.add(new AssignmentListDTO(form.getArticleId(), form.getArticleText().getTitle(), form.getUsername(),student.getName()+" " + student.getSurname(), student.getClassroom().getClassName(), writtenAnswer.getGraded(), writtenAnswer.getPoint(), feedbackGiven, writtenAnswer.getFeedbackVersion(), writtenAnswer.getProgressiveGrading(),false));
                    }
                    else if(form != null && form.getIsCompleted()){
                        String feedbackGiven = form.getFeedbackGiven() ? "yes" : "no";
                        assignmentListDTOS.add(new AssignmentListDTO(form.getArticleId(), form.getArticleText().getTitle(), form.getUsername(), student.getName()+" " + student.getSurname(),student.getClassroom().getClassName(), form.getIsCompleted(), form.getPointTaken(), feedbackGiven, 0, false,true));
                    }
                });
            });
            if(assignmentListDTOS.isEmpty()){
                return new ResponseTemplate(WARNING, NO_RECORD, null);
            }
            else{
                return new ResponseTemplate(SUCCESS, ANSWER_FORM_FETCHED_SUCCESSFULLY, assignmentListDTOS);
            }
        }
        else{
            return new ResponseTemplate(ERROR, STUDENT_LIST_NOT_FOUND, null);
        }

    }
    private List<AssignmentListDTO> getAssignmentsByStudentName(String name){
        List<Student> students=studentService.findByNameAndSurname(name);
        List<AssignmentListDTO> assignmentListDTOS=new ArrayList<>();
        if(!students.isEmpty()){
            students.forEach(student -> {
                Set<AnswerForm> answerForms = repository.findAnswerFormsByUsernameAndIsCompletedIsTrue(student.getUsername());
                answerForms.forEach(form -> {
                    if (form != null && form.isOnlyOneSectionAndWrittenType() && form.getIsCompleted()){
                        WrittenAnswer writtenAnswer = form.getAnswerSections().iterator().next().getWrittenAnswer();
                        String feedbackGiven;
                        if (writtenAnswer.getProgressiveGrading() && writtenAnswer.getFeedbackVersion() == 1) {
                            feedbackGiven = (!writtenAnswer.getInstructorFeedback().isEmpty()) ? "yes" : "no";
                        }
                        else feedbackGiven = form.getFeedbackGiven() ? "yes" : "no";
                        assignmentListDTOS.add(new AssignmentListDTO(form.getArticleId(), form.getArticleText().getTitle(), form.getUsername(), student.getName()+" " + student.getSurname(),student.getClassroom().getClassName(), writtenAnswer.getGraded(), writtenAnswer.getPoint(), feedbackGiven, writtenAnswer.getFeedbackVersion(), writtenAnswer.getProgressiveGrading(),false));
                    }
                    else if(form != null && form.getIsCompleted()){
                        String feedbackGiven = form.getFeedbackGiven() ? "yes" : "no";
                        assignmentListDTOS.add(new AssignmentListDTO(form.getArticleId(), form.getArticleText().getTitle(), form.getUsername(), student.getName()+" " + student.getSurname(),student.getClassroom().getClassName(), form.getIsCompleted(), form.getPointTaken(), feedbackGiven, 0, false,true));
                    }
                });
            });
            return assignmentListDTOS;
        }
        else{
            return null;
        }
    }
    private List<AssignmentListDTO> getAssignmentByAssignmentName(String articleName) {
        List<AssignmentListDTO> assignmentListDTOS = new ArrayList<>();
        List<AnswerForm> answerForms = repository.getWrittenAssignmentsByArticleName(articleName);
        if (!answerForms.isEmpty()) {
            answerForms.forEach(form -> {
                if (form != null && form.isOnlyOneSectionAndWrittenType() && form.getIsCompleted()){
                    WrittenAnswer writtenAnswer = form.getAnswerSections().iterator().next().getWrittenAnswer();
                    String feedbackGiven;
                    if (writtenAnswer.getProgressiveGrading() && writtenAnswer.getFeedbackVersion() == 1) {
                        feedbackGiven = (!writtenAnswer.getInstructorFeedback().isEmpty()) ? "yes" : "no";
                    }
                    else feedbackGiven = form.getFeedbackGiven() ? "yes" : "no";
                    Student student = studentService.findByUsername(form.getUsername());
                    assignmentListDTOS.add(new AssignmentListDTO(form.getArticleId(), form.getArticleText().getTitle(), form.getUsername(), student.getName()+" " + student.getSurname(),student.getClassroom().getClassName(), writtenAnswer.getGraded(), writtenAnswer.getPoint(), feedbackGiven, writtenAnswer.getFeedbackVersion(), writtenAnswer.getProgressiveGrading(),false));
                }
                else if(form != null && form.getIsCompleted()){
                    String feedbackGiven = form.getFeedbackGiven() ? "yes" : "no";
                    Student student = studentService.findByUsername(form.getUsername());
                    assignmentListDTOS.add(new AssignmentListDTO(form.getArticleId(), form.getArticleText().getTitle(), form.getUsername(), student.getName()+" " + student.getSurname(),student.getClassroom().getClassName(), form.getIsCompleted(), form.getPointTaken(), feedbackGiven, 0, false,true));
                }
            });
        }
        return assignmentListDTOS;
    }
    private List<AssignmentListDTO> getAssignmentsByClassName(String className) {
        Classroom classFromDB = classroomService.findByClassName(className);
        long classId = classFromDB.getId();
        List<Student> studentList = classroomService.getStudentListByClassId(classId);
        List<AssignmentListDTO> assignmentListDTOS = new ArrayList<>();
        if (studentList != null && !studentList.isEmpty()) {
            studentList.forEach(student -> {
                List<AssignmentListDTO> assignmentListDTOS1 = getAssignmentsByStudentName(student.getName()+ " " + student.getSurname());
                if (!assignmentListDTOS1.isEmpty()) {
                    assignmentListDTOS.addAll(assignmentListDTOS1);
                }
            });
        }
        return assignmentListDTOS;
    }
    public ResponseTemplate getAssignmentsByParameters(String instructorName,GetWrittenAssignmentDTO getWrittenAssignmentDTO){
        List<AssignmentListDTO> assignmentListDTOS=new ArrayList<>();
        if( !getWrittenAssignmentDTO.getStudentNumber().isEmpty()){
            assignmentListDTOS=getAssignmentsByStudentName(getWrittenAssignmentDTO.getStudentNumber());
            if(!getWrittenAssignmentDTO.getAssignmentName().isEmpty()) {
                assignmentListDTOS = new ArrayList<>(assignmentListDTOS.stream().filter(assignmentListDTO ->
                        assignmentListDTO.getTitle().equals(getWrittenAssignmentDTO.getAssignmentName())
                ).collect(Collectors.toList())) ;
            }
            if(!getWrittenAssignmentDTO.getClassName().isEmpty()) {
                assignmentListDTOS = new ArrayList<>(assignmentListDTOS.stream().filter(assignmentListDTO ->
                        assignmentListDTO.getClassName().equals(getWrittenAssignmentDTO.getClassName())
                ).collect(Collectors.toList()));
            }
        }
        else if(!getWrittenAssignmentDTO.getAssignmentName().isEmpty()){
            assignmentListDTOS=getAssignmentByAssignmentName(getWrittenAssignmentDTO.getAssignmentName());
            if(!getWrittenAssignmentDTO.getClassName().isEmpty()) {
                assignmentListDTOS = new ArrayList<>(assignmentListDTOS.stream().filter(assignmentListDTO ->
                        assignmentListDTO.getClassName().equals(getWrittenAssignmentDTO.getClassName())
                ).collect(Collectors.toList()));
            }
        }
        else if(!getWrittenAssignmentDTO.getClassName().isEmpty()) {
            assignmentListDTOS = getAssignmentsByClassName(getWrittenAssignmentDTO.getClassName());
        }
        if (assignmentListDTOS.isEmpty()) {
            return new ResponseTemplate(WARNING, NO_RECORD, null);
        } else {
          //  log.info(String.format(L_WRITTEN_ASSIGNMENTS_RETRIEVED_BY_INSTRUCTOR, instructorUsername));
            return new ResponseTemplate(SUCCESS, ALL_ASSIGNMENTS_FETCHED, assignmentListDTOS);
        }
    }
    public ResponseTemplate getListSearchBarParameters(String instructorUsername){
        List<String> classrooms;
        Set<ClassroomForInstructorDTO> classroomList = listClassroomService.listClassroomsForInstructor(instructorUsername);
        classrooms=classroomList.stream().map(ClassroomForInstructorDTO::getClassName).collect(Collectors.toList());
        if(!classroomList.isEmpty()){
            List<String> titles=new ArrayList<>();
            List<String> names=new ArrayList<>();
            for(ClassroomForInstructorDTO classroom:classroomList){
                List<String> subNames=new ArrayList<>();
                List<ArticleText> articles = classroomService.findArticlesOfAClassroom(classroom.getId()).stream().map(Article::getText).collect(Collectors.toList());
                titles.addAll(new ArrayList<String>(articles.stream().map(ArticleText::getTitle).collect(Collectors.toList())));
                Set<Student> students=classroomService.findById(classroom.getId()).getStudents();
                students.forEach(student->{
                    subNames.add(student.getName()+" " + student.getSurname());
                });
                names.addAll(subNames);
                names=names.stream().distinct().collect(Collectors.toList());
                titles=titles.stream().distinct().collect(Collectors.toList());
                classrooms=classrooms.stream().distinct().collect(Collectors.toList());
            }
            AssignmentListParametersDTO assignmentListParametersDTO=new AssignmentListParametersDTO(names,classrooms,titles);
            return new ResponseTemplate(SUCCESS,SUCCESS,assignmentListParametersDTO);
        }
        return new ResponseTemplate(ERROR,ERROR,null);


    }
}


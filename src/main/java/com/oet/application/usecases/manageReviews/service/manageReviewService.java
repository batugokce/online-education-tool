package com.oet.application.usecases.manageReviews.service;

import com.oet.application.common.CommonMessages;
import com.oet.application.common.ResponseTemplate;
import com.oet.application.entity.Student;
import com.oet.application.usecases.manageAnswers.entity.AnswerForm;
import com.oet.application.usecases.manageAnswers.repository.AnswerFormRepository;
import com.oet.application.usecases.manageAnswers.service.AnswerFormService;
import com.oet.application.usecases.manageClasses.entity.Classroom;
import com.oet.application.usecases.manageClasses.repository.ClassroomRepository;
import com.oet.application.usecases.manageClasses.service.ClassroomService;
import com.oet.application.usecases.manageReviews.DTO.ReviewAnswerDTO;
import com.oet.application.usecases.manageReviews.DTO.ReviewDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class manageReviewService {

    private final ClassroomRepository classroomRepository;
    private final AnswerFormRepository answerFormRepository;
    private final AnswerFormService answerFormService;

    public ResponseEntity<ResponseTemplate> getCompletedAssignmentsByClassIdAndArticleId(ReviewDTO reviewDTO) {
        Set<ReviewAnswerDTO> answerForms = new HashSet<>();
        Optional<Classroom> classroomOptional = classroomRepository.findById(Long.getLong(reviewDTO.getClassId()));
        if (classroomOptional.isPresent()) {
            Classroom classroomDB = classroomOptional.get();
            Set<Student> studentSet = classroomDB.getStudents();
            for (Student student : studentSet) {
                if (answerFormService.checkIfCompleted(student.getUsername(), Long.getLong(reviewDTO.getClassId()))) {
                    answerForms.add(new ReviewAnswerDTO(student.getId(), student.getName(), student.getSurname()));
                }
            }
            return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.RECORDS_FETCHED, answerForms));
        }
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.ERROR, CommonMessages.ERROR, null));
    }
    public ResponseEntity<ResponseTemplate> getCompletedAssignmentsByStudentId(String username){
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS,CommonMessages.SUCCESS,answerFormService.getStudentCompletedAssignements(username)));
    }
    public ResponseTemplate getCompletedAssignment(String username,Long id){
        return answerFormService.startAssignment(id,username);
    }

}

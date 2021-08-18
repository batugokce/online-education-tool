package com.oet.application.usecases.manageClasses.service;

import com.oet.application.common.CommonMessages;
import com.oet.application.common.ResponseTemplate;
import com.oet.application.entity.Instructor;
import com.oet.application.entity.Student;
import com.oet.application.repository.InstructorRepository;
import com.oet.application.repository.StudentRepository;
import com.oet.application.service.StudentService;
import com.oet.application.usecases.manageAnswers.DTO.AssignmentSummary;
import com.oet.application.usecases.manageAnswers.entity.AnswerForm;
import com.oet.application.usecases.manageAnswers.repository.AnswerFormRepository;
import com.oet.application.usecases.manageAnswers.service.AnswerFormService;
import com.oet.application.usecases.manageArticles.DTO.ArticleTitleAndIDDTO;
import com.oet.application.usecases.manageArticles.entity.Article;
import com.oet.application.usecases.manageArticles.entity.Section;
import com.oet.application.usecases.manageClasses.DTO.*;
import com.oet.application.usecases.manageClasses.entity.Classroom;
import com.oet.application.usecases.manageClasses.repository.ClassroomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ListClassroomForInstructorService {
    private final InstructorRepository instructorRepository;
    private final StudentService studentService;
    private final ClassroomRepository classroomRepository;
    private final AnswerFormRepository answerFormRepository;
    private final ClassroomService classroomService;
    private final AnswerFormService answerFormService;

    public Set<Classroom> getAllClassesById(String name){
        Instructor instructor=instructorRepository.findByUsername(name);
        return instructor.getClassrooms();
    }
    public Set<ArticleTitleAndIDDTO> getAssignmentsOfClass(Long classId){
        Set<Article> articles = classroomService.findArticlesOfAClassroom(classId);
        return articles.stream()
                .map(item -> new ArticleTitleAndIDDTO(item.getId(),item.getText().getTitle(), item.getDifficultyLevel().ordinal()+1, item.getCategory(), false)).collect(Collectors.toSet());
    }
    public ResponseEntity<ResponseTemplate> getListOfStudentsCompletedAssignments(Long classId,Long articleId){
        Optional<Classroom> classroomOptional = classroomRepository.findById(classId);

        if(classroomOptional.isPresent()){
            Classroom classroomDB = classroomOptional.get();
            Set<StudentsInAssignment> studentlist=new HashSet<StudentsInAssignment>();
            Set<Student> studentSet = classroomDB.getStudents();
            studentSet.forEach(student->{
                AnswerForm answerForm=answerFormRepository.getAnswerFormByAssignmentId(articleId,student.getUsername());
                if(answerForm!=null){
                    if(answerForm.getIsCompleted()){
                        studentlist.add(new StudentsInAssignment(student.getName(),student.getSurname(),student.getUsername(),student.getStudentNo(),articleId,"COMPLETED"));
                    }
                    else{
                        studentlist.add(new StudentsInAssignment(student.getName(),student.getSurname(),student.getUsername(),student.getStudentNo(),articleId,"STARTED"));
                    }
                }
                else{
                    studentlist.add(new StudentsInAssignment(student.getName(),student.getSurname(),student.getUsername(),student.getStudentNo(),articleId,"NOT STARTED"));
                }
            });
        }
        else{
            return ResponseEntity.ok(new ResponseTemplate(CommonMessages.ERROR, CommonMessages.ERROR, null));
        }
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.ERROR, CommonMessages.ERROR, null));
    }
    public ResponseTemplate getPastAssignments(String username){
        Set<Article> articles = classroomService.findArticlesOfAClassroom(studentService.findByUsername(username).getClassroom().getId());
        Set<AssignmentSummaries> summaries=new HashSet<AssignmentSummaries>();
        List<Long> articleIDs = articles.stream()
                .map(Article::getId).collect(Collectors.toList());
        List<AssignmentSummary> assignmentSummaries = answerFormRepository.calculateAveragePoints(articleIDs);
        articles.forEach(article -> {
            AnswerForm form = answerFormRepository.getAnswerFormByArticleIdAndAndStudentId(article.getId(), username);
            AssignmentSummary summary = assignmentSummaries.stream()
                    .filter(tmp -> tmp.getArticleId().equals(article.getId()))
                    .findFirst().orElse(new AssignmentSummary(article.getId(),0.0,0L));
            if(form==null){
                int maxPoint=0;
                Set<Section> sections=article.getSections();
                for(Section section:sections){
                    maxPoint+=section.getPoint();
                }
                summaries.add(new AssignmentSummaries(article.getId(), "0", String.format("%.2f (%d)", summary.getAverage(), summary.getCnt()),(float) maxPoint ,article.getText().getTitle(),summary.getAverage(),"Not Started"));
            }
            else{
                if(form.getIsCompleted()){
                    summaries.add(new AssignmentSummaries(article.getId(),String.format("%.2f", form.getPointTaken()), String.format("%.2f (%d)", summary.getAverage(), summary.getCnt()),form.getMaxPoint(),article.getText().getTitle(),summary.getAverage(),"FINISHED"));
                }
                else{
                    int maxPoint=0;
                    Set<Section> sections=article.getSections();
                    for(Section section:sections){
                        maxPoint+=section.getPoint();
                    }
                    summaries.add(new AssignmentSummaries(article.getId(),"0", String.format("%.2f (%d)", summary.getAverage(), summary.getCnt()),(float) maxPoint,article.getText().getTitle(),summary.getAverage(),"STARTED"));
                }
            }
        });
        return new ResponseTemplate(CommonMessages.SUCCESS,CommonMessages.SUCCESS,summaries);
    }
    public ResponseTemplate getAveragesOfClassroom(Long classId){
        List<Student> students=classroomService.getStudentListByClassId(classId);
        List<Long> studentIds=students.stream()
                .map(Student::getId).collect(Collectors.toList());
        int size= classroomService.findArticlesOfAClassroom(classId).size();
        List<StudentAverages> averages=answerFormRepository.calculateStudentAverages(studentIds);
        List<Long> averagesWithIds=averages.stream()
                .map(StudentAverages::getId).collect(Collectors.toList());
        int index=0;
        averages.forEach(average->{
            average.setTotalAverage(average.getTotalAverage()/size);
        });
        List<StudentAverages> newAverages=new ArrayList<>();
        students.forEach(student->{
            if(!averagesWithIds.contains(student.getId())){
                newAverages.add(new StudentAverages(student.getId(),student.getName(),student.getSurname(),0.0,0.0,0L));
            }
            else{
                StudentAverages averages1=averages.get(averagesWithIds.indexOf(student.getId()));
                newAverages.add(new StudentAverages(student.getId(),student.getName(),student.getSurname(),averages1.getAverages(),averages1.getTotalAverage(),averages1.getCount()));
            }
        });
        return new ResponseTemplate(CommonMessages.SUCCESS,CommonMessages.SUCCESS,averages);
    }
    public ResponseTemplate getPointsWithAssignmentIdAndClassId(Long classId,Long assignmentId){
        List<Student> students=classroomService.getStudentListByClassId(classId);
        Set<AssignmentPoints> completed=new HashSet<AssignmentPoints>();
        Set<AssignmentPoints> all=new HashSet<AssignmentPoints>();
        students.forEach(student->{
            AnswerForm form = answerFormRepository.getAnswerFormByArticleIdAndAndStudentId(assignmentId, student.getUsername());
            if(form==null || !form.getIsCompleted()){
                all.add(new AssignmentPoints(student.getName()+" "+student.getSurname(),0.0F));
            }
            else{
                all.add(new AssignmentPoints(student.getName()+" "+student.getSurname(),form.getPointTaken()));
                completed.add(new AssignmentPoints(student.getName()+" "+student.getSurname(),form.getPointTaken()));
            }
        });
        return new ResponseTemplate(CommonMessages.SUCCESS,CommonMessages.SUCCESS,new AssignmentSummaryDTO(completed,all));
    }
}

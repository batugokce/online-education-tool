package com.oet.application.usecases.manageClasses.service;

import com.oet.application.common.BaseEntity;
import com.oet.application.common.ResponseTemplate;
import com.oet.application.entity.Instructor;
import com.oet.application.entity.Student;
import com.oet.application.enums.Level;
import com.oet.application.repository.InstructorRepository;
import com.oet.application.repository.StudentRepository;
import com.oet.application.service.InstructorService;
import com.oet.application.service.StudentService;
import com.oet.application.usecases.manageArticles.entity.Article;
import com.oet.application.usecases.manageArticles.repository.ArticleRepository;
import com.oet.application.usecases.manageClasses.DTO.AvailablePeopleDTO;
import com.oet.application.usecases.manageClasses.DTO.InstructorDTO;
import com.oet.application.usecases.manageClasses.DTO.StudentDTO;
import com.oet.application.usecases.manageClasses.entity.Classroom;
import com.oet.application.usecases.manageClasses.repository.ClassroomRepository;
import com.oet.application.usecases.manageClasses.utilities.ClassroomMapper;
import com.oet.application.usecases.manageNotification.constant.NotificationEventType;
import com.oet.application.usecases.manageNotification.entity.Notification;
import com.oet.application.usecases.manageNotification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static com.oet.application.common.CommonMessages.*;
import static com.oet.application.common.LogMessages.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClassroomService {

    private final ClassroomRepository classroomRepository;
    private final StudentService studentService;
    private final InstructorService instructorService;
    private final StudentRepository studentRepository;
    private final InstructorRepository instructorRepository;
    private final ArticleRepository articleRepository;
    private final NotificationService notificationService;

    public Classroom create(Classroom classroom) {
        log.info(String.format(L_CLASSROOM_CREATED, classroom.getClassName()));
        return classroomRepository.save(classroom);
    }

    public Classroom findById(Long classroomId) {
        return classroomRepository.findById(classroomId).orElse(null);
    }

    public Classroom findByClassName(String className) {
        return classroomRepository.findByClassName(className).orElse(null);
    }

    public ResponseTemplate assignArticlesToClassrooms(List<Long> classroomIDs, Long articleId, String username) {
        Article article = articleRepository.findById(articleId).orElse(null);
        if (null == article) {
            return new ResponseTemplate(WARNING, ARTICLE_NOT_FOUND, null);
        }
        return assignArticlesToClassrooms(classroomIDs, article, username);
    }
    public Optional<Classroom> getStudentsByClassName(String name){
        return classroomRepository.findByClassName(name);
    }
    public ResponseTemplate assignArticlesToClassrooms(List<Long> classroomIDs, Article article, String username) {
        List<Classroom> classrooms = classroomRepository.findAllById(classroomIDs);
        List<Long> ownerClassIDs = article.getOwnerClassrooms().stream().map(BaseEntity::getId).collect(Collectors.toList());
        List<Long> notExistingClasses = classroomIDs.stream().filter(item -> !ownerClassIDs.contains(item)).collect(Collectors.toList());
        if (notExistingClasses.size() == 0) {
            return new ResponseTemplate(WARNING, CLASS_HAVE_THAT_ARTICLE, null);
        }
        classrooms.forEach(classroom -> {
            classroom.getArticles().add(article);
        });
        classroomRepository.saveAll(classrooms);
        notExistingClasses.forEach(notExistingClass-> {
            List<Student> studentList = getStudentListByClassId(notExistingClass);
            Notification notification = notificationService.createNotification(username, article.getText().getTitle(), NotificationEventType.NEW_ASSIGNMENT);
            notificationService.addAndSaveUserNotificationsByEventType(notification, studentList, null, notExistingClass, null);
        });

        return new ResponseTemplate(SUCCESS, ARTICLE_ASSIGNED_SUCCESSFULLY, null);
    }
    public boolean unAssignArticlesFromClassrooms(List<Long> classroomIDs, Long articleId, String username) {
        Article article = articleRepository.findById(articleId).orElse(null);
        if (null == article) {
            return false ;
        }

        classroomIDs.forEach(classroom->{
            Classroom classToRemove=classroomRepository.findById(classroom).orElse(null);
            if(classToRemove!=null){
                article.getOwnerClassrooms().remove(classToRemove);
                classToRemove.getArticles().remove(article);
                classroomRepository.save(classToRemove);
                articleRepository.save(article);
            }
        });
        return true;
    }

    public List<Classroom> findAll() {
        return classroomRepository.findAll();
    }

    public void deleteAll() {
        log.info(L_CLASSROOMS_DELETED);
        classroomRepository.deleteAll();
    }

    public Set<Article> findArticlesOfAClassroom(Long classID) {
        Classroom classroomWithArticles = classroomRepository.getClassroomWithArticles(classID);
        return classroomWithArticles.getArticles();
    }

    public Set<Article> findArticlesOfAClassroomByLevel(Long classID, Level studentLevel) {
        return findArticlesOfAClassroom(classID).stream().filter(article -> studentLevel.equals(article.getDifficultyLevel())).collect(Collectors.toSet());
    }

    public List<Article> findWrittenAssignmentsOfAClassroom(Long classID) {
        Classroom classroomWithArticles = classroomRepository.getClassroomWithArticles(classID);
        return classroomWithArticles.getArticles().stream().filter(Article::isOnlyOneSectionAndWrittenType).collect(Collectors.toList());
    }

    public List<Student> getStudentListByClassId(Long id) {
        Optional<Classroom> classroomOptional = classroomRepository.findById(id);
        if (classroomOptional.isPresent()) {
            Classroom classroomDB = classroomOptional.get();
            Set<Student> studentSet = classroomDB.getStudents();
            if (!studentSet.isEmpty()) {
                List<Student> studentList = new ArrayList<>(studentSet);
                return studentList;
            }
        }
        return null;
    }

    @Transactional
    public ResponseEntity<ResponseTemplate> getAllStudentsByClassId(Long id) {
        Optional<Classroom> classroomOptional = classroomRepository.findById(id);
        if (classroomOptional.isPresent()) {
            Classroom classroomDB = classroomOptional.get();
            Set<Student> studentSet = classroomDB.getStudents();
            if (!studentSet.isEmpty()) {
                return ResponseEntity.ok(new ResponseTemplate(SUCCESS, STUDENT_LIST_FOUND, ClassroomMapper.mapStudentsToDTO(studentSet)));
            } else {
                return ResponseEntity.ok(new ResponseTemplate(ERROR, STUDENT_LIST_NOT_FOUND, new ArrayList<>()));
            }
        } else {
            return ResponseEntity
                    .ok(new ResponseTemplate(ERROR, CLASS_NOT_FOUND, new ArrayList<>()));
        }
    }


    @Transactional
    public ResponseEntity<ResponseTemplate> addStudentToClass(Long classId, Long studentId) {
        Classroom classroomDB = classroomRepository.findById(classId).orElse(null);
        if (classroomDB != null) {
            Student studentDB = studentService.findById(studentId);
            if (studentDB != null) {
                if (studentDB.getClassroom() == null) {
                    if (classroomDB.getStudents().size() < classroomDB.getCapacity()) {
                        studentDB.setClassroom(classroomDB);
                        log.info(String.format(L_STUDENT_ADDED_TO_CLASSROOM, studentDB.getUsername(), classroomDB.getId()));
                        classroomDB.getStudents().add(studentDB);
                        Set<StudentDTO> studentDTOS = ClassroomMapper.mapStudentsToDTO(classroomDB.getStudents());
                        return ResponseEntity.ok(new ResponseTemplate(SUCCESS, STUDENT_ADDED_TO_CLASS, studentDTOS));
                    }
                    return ResponseEntity.ok(new ResponseTemplate(WARNING, CLASS_IS_FULL, null));
                } else {
                    return ResponseEntity.ok(new ResponseTemplate(WARNING, USER_HAS_ALREADY_CLASSROOM, null));
                }
            } else {
                return ResponseEntity.ok(new ResponseTemplate(WARNING, USER_NOT_FOUND, null));
            }
        }
        return ResponseEntity
                .ok(new ResponseTemplate(WARNING, CLASS_NOT_FOUND, null));
    }

    @Transactional
    public ResponseEntity<ResponseTemplate> addInstructorToClass(Long classId, Long instructorId) {
        Classroom classroomDB = classroomRepository.findById(classId).orElse(null);
        if (classroomDB != null) {
            Instructor instructorDB = instructorService.findById(instructorId);
            if (instructorDB != null) {
                if (instructorDB.getClassrooms().contains(classroomDB)) {
                    return ResponseEntity.ok(new ResponseTemplate(WARNING, INSTRUCTOR_ALREADY_IN_CLASS, null));
                } else {
                    instructorDB.getClassrooms().add(classroomDB);
                    classroomDB.getInstructors().add(instructorDB);
                    Set<InstructorDTO> instructorDTOS = ClassroomMapper.mapInstructorsToDTO(classroomDB.getInstructors());
                    log.info(String.format(L_INSTRUCTOR_ADDED_TO_CLASSROOM, instructorDB.getUsername(), classroomDB.getId()));
                    return ResponseEntity.ok(new ResponseTemplate(SUCCESS, INSTRUCTOR_ADDED_TO_CLASS, instructorDTOS));
                }
            } else {
                return ResponseEntity.ok(new ResponseTemplate(WARNING, USER_NOT_FOUND, null));
            }
        }
        return ResponseEntity
                .ok(new ResponseTemplate(WARNING, CLASS_NOT_FOUND, null));
    }

    @Transactional
    public ResponseEntity<ResponseTemplate> deleteStudentFromClass(Long classId, Long studentId) {
        Classroom classroomDB = classroomRepository.findById(classId).orElse(null);
        if (classroomDB != null) {
            Student studentDB = studentService.findById(studentId);
            if (studentDB != null) {
                if (studentDB.getClassroom() != null) {
                    studentDB.setClassroom(null);
                    log.info(String.format(L_STUDENT_DELETED_FROM_CLASSROOM, studentDB.getUsername(), classroomDB.getId()));
                    return ResponseEntity.ok(new ResponseTemplate(SUCCESS, STUDENT_REMOVED_FROM_CLASS, null));
                } else {
                    return ResponseEntity.ok(new ResponseTemplate(ERROR, USER_IN_CLASS_NOT_FOUND, null));
                }
            } else {
                return ResponseEntity.ok(new ResponseTemplate(ERROR, USER_NOT_FOUND, null));
            }
        }
        return ResponseEntity
                .ok(new ResponseTemplate(ERROR, CLASS_NOT_FOUND, null));
    }

    @Transactional
    public ResponseEntity<ResponseTemplate> deleteInstructorFromClass(Long classId, Long instructorId) {
        Instructor instructor = instructorRepository.findById(instructorId).orElse(null);
        if (instructor != null) {
            if (instructor.getClassrooms().stream().anyMatch(classroom -> classroom.getId().equals(classId))) {
                instructor.setClassrooms(instructor.getClassrooms()
                        .stream()
                        .filter(classroom -> !classroom.getId().equals(classId)).collect(Collectors.toSet()));

                log.info(String.format(L_INSTRUCTOR_DELETED_FROM_CLASSROOM, instructor.getId(), classId));
                return ResponseEntity.ok(new ResponseTemplate(SUCCESS, INSTRUCTOR_REMOVED_FROM_CLASS, null));
            } else {
                return ResponseEntity.ok(new ResponseTemplate(ERROR, USER_NOT_FOUND, null));
            }
        }
        return ResponseEntity
                .ok(new ResponseTemplate(ERROR, USER_NOT_FOUND, null));
    }

    public ResponseEntity<ResponseTemplate> listAvailablePeople() {
        Set<Student> students = studentRepository.findAllByClassroomNull();
        List<Instructor> instructors = instructorRepository.findAll();
        AvailablePeopleDTO availablePeopleDTO = new AvailablePeopleDTO(ClassroomMapper.mapStudentsToDTO(students), ClassroomMapper.mapInstructorsToDTO(instructors));
        return ResponseEntity.ok(new ResponseTemplate(SUCCESS, RECORDS_FETCHED, availablePeopleDTO));
    }
}

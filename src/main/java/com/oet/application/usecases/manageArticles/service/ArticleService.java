package com.oet.application.usecases.manageArticles.service;

import static com.oet.application.common.CommonMessages.*;
import static com.oet.application.common.LogMessages.*;
import com.oet.application.common.ResponseTemplate;
import com.oet.application.entity.Instructor;
import com.oet.application.entity.Student;
import com.oet.application.service.InstructorService;
import com.oet.application.service.StudentService;
import com.oet.application.usecases.manageAnswers.entity.AnswerForm;
import com.oet.application.usecases.manageAnswers.repository.AnswerFormRepository;
import com.oet.application.usecases.manageArticles.DTO.*;
import com.oet.application.usecases.manageArticles.entity.*;
import com.oet.application.usecases.manageArticles.repository.ArticleRepository;
import com.oet.application.usecases.manageClasses.DTO.ClassroomForInstructorDTO;
import com.oet.application.usecases.manageClasses.entity.Classroom;
import com.oet.application.usecases.manageClasses.service.ClassroomService;
import com.oet.application.usecases.manageClasses.service.ListClassroomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final ArticleTextService articleTextService;
    private final ClassroomService classroomService;
    private final StudentService studentService;
    private final AnswerFormRepository answerFormRepository;
    private final ListClassroomService listClassroomService;
    private final InstructorService instructorService;

    @Transactional
    public Article create(Article article, String username) {
        if (article.getSections().size() > 1 && article.getSections().stream().anyMatch(section -> section.getWrittenQuestion()!=null)) {
            return null;
        }
        Article articleDB = articleRepository.save(article);
        classroomService.assignArticlesToClassrooms(List.of(article.getClassroomId()), articleDB, username);
        log.info(String.format(L_ARTICLE_CREATED, article.getText().getTitle()));
        return articleDB;
    }
    @Transactional
    public Article edit(ArticlePostEdit articleForEdit, String username) {
        Article article=articleForEdit.getArticle();
        if (article.getSections().size() > 1 && article.getSections().stream().anyMatch(section -> section.getWrittenQuestion()!=null)) {
            return null;
        }

        if(articleForEdit.getType()==0){
            Optional<Article> oldArticleOp=articleRepository.findById(article.getId());
            if(oldArticleOp.isPresent()){
                Article oldArticle=oldArticleOp.get();
                oldArticle.setSections(article.getSections());
                ArticleText articleText=articleTextService.create(article.getText());
                oldArticle.setText(articleText);
                oldArticle.setEnglishLevel(article.getEnglishLevel());
                oldArticle.setDifficultyLevel(article.getDifficultyLevel());
                oldArticle.setCategory(article.getCategory());
                oldArticle.setDefinitions(article.getDefinitions());
                Set<Classroom> classrooms=article.getOwnerClassrooms();
                Long id=0L;
                List<Long> ids=new ArrayList<>();
                for(Classroom classroom:classrooms){
                    id=classroom.getId();
                    ids.add(classroom.getId());
                }
                oldArticle.setClassroomId(id);
                answerFormRepository.deleteAnswerFormsByArticleId(oldArticle.getId());
                Article articleDB = articleRepository.save(oldArticle);
                if (article.getClassroomId()!=null && article.getClassroomId()==0){
                    classroomService.assignArticlesToClassrooms(ids, articleDB, username);
                }
                else if (article.getClassroomId()!=null){
                    classroomService.unAssignArticlesFromClassrooms(ids,articleDB.getId(),username);
                    classroomService.assignArticlesToClassrooms(List.of(article.getClassroomId()), articleDB, username);
                }
                log.info(String.format(L_ARTICLE_EDITED, article.getText().getTitle()));
                return articleDB;
            }
            else{
                return null;
            }
        }
        else{
            return create(article, username);
        }
    }


    public Set<Article> findAll() {
        return articleRepository.getAllArticlesWithQuestions();
    }

    public Article findById(Long id) {
        return articleRepository.getArticleByIdWithQuestions(id);
    }
    public List<ClassroomForInstructorDTO> findClassroomsOfArticles(Long articleId,String username){
        Instructor instructor=instructorService.findByUsername(username);
        Set<ClassroomForInstructorDTO> instructorClassrooms=listClassroomService.listClassroomsForInstructor(username);
        Article article=articleRepository.getArticleByIdWithQuestions(articleId);
        List<ClassroomForInstructorDTO> list=article.getOwnerClassrooms().stream().filter(e->instructorClassrooms.stream().filter(f->e.getId()==f.getId()).findFirst().isPresent()).map(r->new ClassroomForInstructorDTO(r.getId(),r.getClassName())).collect(Collectors.toList());
        return list;
    }
    public ArticleForEdit findByIdForEdit(Long id,String instructorUsername){
        Article article=articleRepository.getArticleByIdWithQuestions(id);
        Set<Section> sections=article.getSections();
        Set<ArticleQuestionBase> questions=new HashSet<>();

        sections.forEach(section -> {
            if(section.getMultipleChoices().size()!=0){
                Set<ArticleMultipleChoice> multipleChoices=new HashSet<>();
                section.getMultipleChoices().forEach(multipleChoice -> {
                    multipleChoices.add(new ArticleMultipleChoice(multipleChoice.getNum(),multipleChoice.getText(),multipleChoice.getOption1(),multipleChoice.getOption2(),multipleChoice.getOption3(),multipleChoice.getOption4(),multipleChoice.getOption5(),multipleChoice.getCorrectAnswer()));
                });
                questions.add(new ArticleMultipleChoiceArray(section.getDescription(),section.getOrder(),section.getPoint(),multipleChoices));
            }
            else if(section.getTrueFalses().size()!=0){
                Set<ArticleTrueFalse> trueFalses=new HashSet<>();
                section.getTrueFalses().forEach(trueFalse->{
                    trueFalses.add(new ArticleTrueFalse(trueFalse.getText(),trueFalse.getCorrectAnswer()));
                });
                questions.add(new ArticleTrueFalseArray(section.getDescription(),section.getOrder(),section.getPoint(),trueFalses));
            }
            else if(section.getMatchings().size()!=0){
                Set<ArticleMatchings> matchings=new HashSet<>();
                section.getMatchings().forEach(matching->{
                    matchings.add(new ArticleMatchings(matching.getNumber(),matching.getLeftPart(),matching.getRightPart()));
                });
                questions.add(new ArticleMatchingsArray(section.getDescription(),section.getOrder(),section.getPoint(),matchings));
            }
            else if(section.getGapFillingMain()!=null){
                Set<ArticleGapFilling> gapFillings=new HashSet<>();
                section.getGapFillingMain().getGapFillings().forEach(gapFilling->{
                    gapFillings.add(new ArticleGapFilling(gapFilling.getNum(),gapFilling.getQuestionText(),gapFilling.getAnswer()));
                });
                questions.add(new ArticleGapFillingArray(section.getDescription(),section.getOrder(),section.getPoint(),new ArticleGapFillingMain(section.getGapFillingMain().getClues(),gapFillings)));
            }
            else if(section.getOrderings().size()!=0){
                Set<ArticleOrdering> orderings=new HashSet<>();
                section.getOrderings().forEach(ordering->{
                    orderings.add(new ArticleOrdering(ordering.getText(),ordering.getCorrectOrder()));
                });
                questions.add(new ArticleOrderingArray(section.getDescription(),section.getOrder(),section.getPoint(),orderings));
            }
            else if(section.getWrittenQuestion()!=null){
                questions.add(new ArticleWrittenMain(section.getDescription(),section.getOrder(),section.getPoint(),new ArticleWritten(section.getWrittenQuestion().getProgressiveGrading())));
            }


        });
        Set<ClassroomForInstructorDTO> classes=listClassroomService.listClassroomsForInstructor(instructorUsername);
        Set<Classroom> classrooms=article.getOwnerClassrooms();
        Set<Classroom> filtered=classrooms.stream().filter(e->classes.stream().filter(classroom->e.getId()==classroom.getId()).findFirst().isPresent()).collect(Collectors.toSet());
        if(filtered.size()!= classrooms.size()){
            return new ArticleForEdit(article.getEnglishLevel(),article.getDifficultyLevel(),article.getCategory(),article.getText(),article.getDefinitions(),questions,true,true);
        }
        Set<AnswerForm> answerForms=answerFormRepository.findAnswerFormsByArticleId(id);
        if(answerForms.isEmpty())
            return new ArticleForEdit(article.getEnglishLevel(),article.getDifficultyLevel(),article.getCategory(),article.getText(),article.getDefinitions(),questions,false,false);
        else{
            return new ArticleForEdit(article.getEnglishLevel(),article.getDifficultyLevel(),article.getCategory(),article.getText(),article.getDefinitions(),questions,false,true);
        }
    }
    public void deleteAll() {
        log.info(L_ARTICLES_DELETED);
        articleRepository.deleteAll();
    }

    @Transactional
    public ResponseEntity<ResponseTemplate> addTextToArticle(Long articleId, ArticleText articleText) {
        Optional<Article> ArticleOptional = articleRepository.findById(articleId);
        if (ArticleOptional.isPresent()) {
            Article articleDB = ArticleOptional.get();
            ArticleText articleTextDB = articleTextService.findById(articleText.getId());
            if(articleTextDB!=null) {
                articleDB.setText(articleText);
                return ResponseEntity.ok(new ResponseTemplate(SUCCESS, TEXT_ADDED_TO_ARTICLE, articleTextDB));
            }
            else{
                return ResponseEntity.ok(new ResponseTemplate(ERROR, TEXT_NOT_FOUND, null));
            }
        }
        return ResponseEntity
                .ok(new ResponseTemplate(ERROR, ARTICLE_NOT_FOUND, null));
    }

    public ResponseEntity<ResponseTemplate> addSectionToArticle(Long articleId, Section section) {
        Article articleDB = articleRepository.getArticleTextById(articleId);
        if(articleDB != null) {
            articleDB.getSections().add(section);
            articleRepository.save(articleDB);
            return ResponseEntity.ok(new ResponseTemplate(SUCCESS, SECTION_IS_ADDED, null));

        }
        else {
            return  ResponseEntity
                    .ok(new ResponseTemplate(ERROR, ARTICLE_NOT_FOUND, null));
        }
    }

    @Transactional
    public ResponseEntity<ResponseTemplate> getArticleText(Long id) {
        Article articleDB = articleRepository.getArticleTextById(id);
        if(articleDB != null) {
            ArticleText articleText= articleDB.getText();
            if(articleText!=null) {
                return ResponseEntity.ok(new ResponseTemplate(SUCCESS, TEXT_IS_FOUND,articleText));
            }
            else{
                return ResponseEntity.ok(new ResponseTemplate(ERROR, TEXT_IS_NOT_FOUND, null));
            }
        }
        else {return  ResponseEntity
                .ok(new ResponseTemplate(ERROR, ARTICLE_NOT_FOUND, null));}
    }

    public Set<ArticleTitleAndIDDTO> getAssignmentListWithTitles() {
        Set<Article> articles = articleRepository.getArticlesWithTexts();
        return articles.stream()
                .map(item -> new ArticleTitleAndIDDTO(item.getId(),item.getText().getTitle(), item.getDifficultyLevel() != null ? item.getDifficultyLevel().ordinal()+1 : 1, item.getCategory(), false))
                .collect(Collectors.toSet());
    }


    public Set<ArticleTitleAndIDDTO> getAssignmentListWithTitlesForStudent(String username) {
        Student student = studentService.findByUsername(username);
        if (null == student || null == student.getClassroom()) {
            return new HashSet<>();
        }

        Set<ArticleTitleAndIDDTO> articles = classroomService
                .findArticlesOfAClassroom(student.getClassroom().getId())
                .stream()
                .map(item -> new ArticleTitleAndIDDTO(item.getId(),item.getText().getTitle(), item.getDifficultyLevel() != null ? item.getDifficultyLevel().ordinal()+1 : 1, item.getCategory(), false))
                .collect(Collectors.toSet());

        Set<AnswerForm> answerForms = answerFormRepository.getAnswerFormByUsername(username);
        answerForms.forEach(answerForm -> {
            if (answerForm.getIsCompleted()) {
                articles.removeIf(article -> article.getId().equals(answerForm.getArticleId()));
            } else {
                articles.stream()
                        .filter(article -> article.getId().equals(answerForm.getArticleId()))
                        .findFirst().ifPresent(selectedArticle -> selectedArticle.setStarted(true));
            }

        });

        return articles;
    }

}
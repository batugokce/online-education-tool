package com.oet.application.usecases.manageArticles.controller;

import com.oet.application.common.CommonMessages;
import com.oet.application.common.ResponseTemplate;
import com.oet.application.entity.Instructor;
import com.oet.application.entity.Student;
import com.oet.application.usecases.manageArticles.DTO.ArticleForEdit;
import com.oet.application.usecases.manageArticles.DTO.ArticlePostEdit;
import com.oet.application.usecases.manageArticles.DTO.ArticleQuestionBase;
import com.oet.application.usecases.manageArticles.DTO.ArticleTitleAndIDDTO;
import com.oet.application.usecases.manageArticles.entity.*;
import com.oet.application.usecases.manageArticles.service.ArticleService;
import com.oet.application.usecases.manageClasses.DTO.ClassroomForInstructorDTO;
import com.oet.application.usecases.manageClasses.entity.Classroom;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import static com.oet.application.common.CommonMessages.*;
import javax.validation.Valid;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/article")
@RequiredArgsConstructor
public class ArticleController {
    private final ArticleService articleService;

    @PreAuthorize("hasAnyAuthority('ADMIN','INSTRUCTOR')")
    @PostMapping("/{username}")
    public ResponseEntity<ResponseTemplate> createArticle(@PathVariable String username, @Valid @RequestBody Article article, BindingResult bindingresult) {
        if (bindingresult.hasErrors()) {
            return ResponseEntity.ok(new ResponseTemplate(CommonMessages.ERROR, bindingresult.getAllErrors().get(0).getDefaultMessage(), null));
        }
        Article newArticle = articleService.create(article, username);
        if (newArticle == null) {
            return ResponseEntity.ok(new ResponseTemplate(ERROR, ARTICLE_CREATION_ESSAY_ERROR, null));
        }
        return ResponseEntity
                .ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.ARTICLE_CREATED, newArticle));
    }
    @PreAuthorize("hasAnyAuthority('ADMIN','INSTRUCTOR')")
    @PostMapping("edit/{username}")
    public ResponseEntity<ResponseTemplate> editArticle(@PathVariable String username, @Valid @RequestBody ArticlePostEdit article) {
        Article newArticle = articleService.edit(article, username);
        if (newArticle == null) {
            return ResponseEntity.ok(new ResponseTemplate(ERROR, ARTICLE_CREATION_ESSAY_ERROR, null));
        }
        return ResponseEntity
                .ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.ARTICLE_EDITED, newArticle));
    }
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping
    public ResponseEntity<ResponseTemplate> getAllArticles() {
        Set<Article> articleList = articleService.findAll();
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.RECORDS_FETCHED, articleList));
    }
    @PreAuthorize("hasAuthority('INSTRUCTOR')")
    @GetMapping("/getAssignedClassrooms/{articleId}/{username}")
    public ResponseEntity<ResponseTemplate> getAllArticles(@PathVariable Long articleId,@PathVariable String username) {
        List<ClassroomForInstructorDTO> articleList = articleService.findClassroomsOfArticles(articleId,username);
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.RECORDS_FETCHED, articleList));
    }


    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping
    public ResponseEntity<ResponseTemplate> deleteAllArticles() {
        articleService.deleteAll();
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.RECORDS_DELETED, null));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','INSTRUCTOR')")
    @GetMapping("/find/{articleId}")
    public ResponseEntity<ResponseTemplate> getArticleById(@PathVariable Long articleId) {
        Article article = articleService.findById(articleId);
        if (article != null) {
            return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.ARTICLE_FOUND, article));
        }
        return ResponseEntity
                .ok(new ResponseTemplate(CommonMessages.ERROR, CommonMessages.ARTICLE_NOT_FOUND, null));
    }
    @PreAuthorize("hasAnyAuthority('ADMIN','INSTRUCTOR')")
    @GetMapping("/findForEdit/{articleId}/{instructorName}")
    public ResponseEntity<ResponseTemplate> getArticleByIdForEdit(@PathVariable Long articleId,@PathVariable String instructorName) {
       ArticleForEdit articleForEdit=articleService.findByIdForEdit(articleId,instructorName);

        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.ARTICLE_FOUND, articleForEdit));
    }


    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/add/{articleId}/text")
    public ResponseEntity<ResponseTemplate> addTextToArticle(@PathVariable Long articleId, @RequestBody ArticleText articleText) {
        return articleService.addTextToArticle(articleId, articleText);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/add/{articleId}/section")
    public ResponseEntity<ResponseTemplate> addSectionToArticle(@PathVariable Long articleId, @RequestBody Section section) {
        return articleService.addSectionToArticle(articleId, section);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/find/{articleId}/text")
    public ResponseEntity<ResponseTemplate> getTextByArticleId(@PathVariable Long articleId) {
        return articleService.getArticleText(articleId);
    }


    @PreAuthorize("hasAnyAuthority('STUDENT','ADMIN','INSTRUCTOR')")
    @GetMapping("/getList")
    public ResponseEntity<ResponseTemplate> getAssignmentListWithTitles(){
        Set<ArticleTitleAndIDDTO> articleTitleAndIDDTOS = articleService.getAssignmentListWithTitles();
        return ResponseEntity.ok(new ResponseTemplate(SUCCESS, ARTICLE_FOUND, articleTitleAndIDDTOS));
    }

    @PreAuthorize("hasAuthority('STUDENT') and #username == authentication.principal.username ")
    @GetMapping("/getListForStudent/{username}")
    public ResponseEntity<ResponseTemplate> getAssignmentListWithTitlesForStudent(@PathVariable String username){
        Set<ArticleTitleAndIDDTO> articleTitleAndIDDTOS = articleService.getAssignmentListWithTitlesForStudent(username);
        return ResponseEntity.ok(new ResponseTemplate(SUCCESS, ARTICLE_FOUND, articleTitleAndIDDTOS));
    }

}
